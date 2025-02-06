use http_body_util::{BodyExt, Empty, Full};
use hyper::{body::Bytes, Request, StatusCode, Method};
use hyper_util::rt::TokioIo;
use notary_client::{Accepted, NotarizationRequest, NotaryClient};
use std::{env, str};
use tokio_util::compat::{FuturesAsyncReadCompatExt, TokioAsyncReadCompatExt};
use tracing::debug;
use utils::range::RangeSet;

use tlsn_common::config::ProtocolConfig;
use tlsn_core::{request::RequestConfig, transcript::TranscriptCommitConfig};
use tlsn_prover::{Prover, ProverConfig};
use tlsn_core::{presentation::Presentation, CryptoProvider};


// Setting of the application server
const SERVER_DOMAIN: &str = "api.openai.com";

// Setting of the notary server — make sure these are the same with the config
// in ../../notary/server
const NOTARY_HOST: &str = "127.0.0.1";
const NOTARY_PORT: u16 = 7047;

// Maximum number of bytes that can be sent from prover to server
const MAX_SENT_DATA: usize = 1 << 12;
// Maximum number of bytes that can be received by prover from server
const MAX_RECV_DATA: usize = 1 << 14;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt::init();

    // Load OpenAI API key from environment
    dotenv::dotenv().map_err(|_| "Failed to load .env file")?;
    let openai_api_key = env::var("OPENAI_API_KEY").expect("OPENAI_API_KEY not set");
    let auth_header = format!("Bearer {}", openai_api_key);

    // Build a client to connect to the notary server.
    let notary_client = NotaryClient::builder()
        .host(NOTARY_HOST)
        .port(NOTARY_PORT)
        // WARNING: Always use TLS to connect to notary server, except if notary is running locally
        // e.g. this example, hence `enable_tls` is set to False (else it always defaults to True).
        .enable_tls(false)
        .build()
        .unwrap();

    // Send requests for configuration and notarization to the notary server.
    let notarization_request = NotarizationRequest::builder()
        .max_sent_data(MAX_SENT_DATA)
        .max_recv_data(MAX_RECV_DATA)
        .build()
        .unwrap();

    let Accepted {
        io: notary_connection,
        id: _session_id,
        ..
    } = notary_client
        .request_notarization(notarization_request)
        .await
        .expect("Could not connect to notary. Make sure it is running.");

    // Set up protocol configuration for prover.
    let protocol_config = ProtocolConfig::builder()
        .max_sent_data(MAX_SENT_DATA)
        .max_recv_data(MAX_RECV_DATA)
        .build()
        .unwrap();

    // Create a new prover and set up the MPC backend.
    let prover_config = ProverConfig::builder()
        .server_name(SERVER_DOMAIN)
        .protocol_config(protocol_config)
        .build()
        .unwrap();
    let prover = Prover::new(prover_config)
        .setup(notary_connection.compat())
        .await
        .unwrap();

    // Open a new socket to the application server.
    let client_socket = tokio::net::TcpStream::connect((SERVER_DOMAIN, 443))
        .await
        .unwrap();

    // Bind the Prover to server connection
    let (tls_connection, prover_fut) = prover.connect(client_socket.compat()).await.unwrap();

    // Spawn the Prover to be run concurrently
    let prover_task = tokio::spawn(prover_fut);

    // Attach the hyper HTTP client to the TLS connection
    let (mut request_sender, connection) =
        hyper::client::conn::http1::handshake(TokioIo::new(tls_connection.compat()))
            .await
            .unwrap();

    // Spawn the HTTP task to be run concurrently
    tokio::spawn(connection);

    let body = serde_json::json!({
        "model": "gpt-4o-mini",
        "messages": [
            {
                "role": "user",
                "content": "Hello, how are you?"   
            }
        ]
    }); 
    let body_str = serde_json::to_string(&body)?;

    // Build the HTTP request
    let request = Request::builder()
        .uri(format!("https://{SERVER_DOMAIN}/v1/chat/completions"))
        .header("Host", SERVER_DOMAIN)
        .header("Accept", "*/*")
        .header("Accept-Language", "en-US,en;q=0.5")
        .header("Accept-Encoding", "identity")
        .header("Content-Type", "application/json")
        .header("Authorization", &auth_header)
        .header("Connection", "close")
        .method(Method::POST)
        .body(Full::new(Bytes::from(body_str)))
        .map_err(|e| format!("Failed to build request: {}", e))?;

    let response = request_sender.send_request(request).await?;
    let status = response.status();
    
    if status != StatusCode::OK {
        return Err(format!("Request failed with status: {}", status).into());
    }

    // Parse and display response
    let payload = response.into_body().collect().await?.to_bytes();
    let parsed = serde_json::from_str::<serde_json::Value>(&String::from_utf8_lossy(&payload))?;
    println!("Response: {}", serde_json::to_string_pretty(&parsed)?);

    // The Prover task should be done now, so we can grab it.
    let prover = prover_task.await.unwrap().unwrap();

    // Prepare for notarization
    let mut prover = prover.start_notarize();

    // Identify the ranges in the transcript that contain secrets
    let sent_transcript = prover.transcript().sent();
    let recv_transcript = prover.transcript().received();

    // Identify the ranges in the outbound data which contain data which we want to
    // disclose
    let (_, range_set) = find_text_between(&String::from_utf8_lossy(&sent_transcript), "host", "accept:").unwrap();
    let sent_public_ranges = range_set;

    let (_, range_set) = find_text_between(&String::from_utf8_lossy(&recv_transcript), "\"choices\"", "\"usage\"").unwrap();
    let recv_public_ranges = range_set;

    let mut builder = TranscriptCommitConfig::builder(prover.transcript());

    // Commit to public ranges
    builder.commit_sent(&sent_public_ranges).unwrap();
    builder.commit_recv(&recv_public_ranges).unwrap();

    let config = builder.build().unwrap();

    prover.transcript_commit(config);

    // Finalize, returning the notarized session
    let request_config = RequestConfig::default();
    let (attestation, secrets) = prover.finalize(&request_config).await.unwrap();

    debug!("Notarization complete!");

    // tokio::fs::write(
    //     "discord.attestation.tlsn",
    //     bincode::serialize(&attestation).unwrap(),
    // )
    // .await
    // .unwrap();

    // tokio::fs::write(
    //     "discord.secrets.tlsn",
    //     bincode::serialize(&secrets).unwrap(),
    // )
    // .await
    // .unwrap();

    let mut builder = secrets.transcript_proof_builder();

    builder.reveal_recv(&recv_public_ranges)?;
    builder.reveal_sent(&sent_public_ranges)?;

    let transcript_proof = builder.build()?;

    // Use default crypto provider to build the presentation.
    let provider = CryptoProvider::default();

    let mut builder = attestation.presentation_builder(&provider);

    builder
        .identity_proof(secrets.identity_proof())
        .transcript_proof(transcript_proof);

    let presentation: Presentation = builder.build()?;

    // Write the presentation to disk.
    std::fs::write(
        "discord.presentation.tlsn",
        bincode::serialize(&presentation)?,
    )?;

    println!("Presentation built successfully!");
    println!("The presentation has been written to `discord.presentation.tlsn`.");
    Ok(())
}

/// Find the ranges of the public and private parts of a sequence.
///
/// Returns a tuple of `(public, private)` ranges.
fn find_ranges(seq: &[u8], sub_seq: &[&[u8]]) -> (RangeSet<usize>, RangeSet<usize>) {
    let mut private_ranges = Vec::new();
    for s in sub_seq {
        for (idx, w) in seq.windows(s.len()).enumerate() {
            if w == *s {
                private_ranges.push(idx..(idx + w.len()));
            }
        }
    }

    let mut sorted_ranges = private_ranges.clone();
    sorted_ranges.sort_by_key(|r| r.start);

    let mut public_ranges = Vec::new();
    let mut last_end = 0;
    for r in sorted_ranges {
        if r.start > last_end {
            public_ranges.push(last_end..r.start);
        }
        last_end = r.end;
    }

    if last_end < seq.len() {
        public_ranges.push(last_end..seq.len());
    }

    (
        RangeSet::from(public_ranges),
        RangeSet::from(private_ranges),
    )
}

/// Finds text between two marker words in a string and returns both the text
/// and its position as a RangeSet.
/// 
/// # Arguments
/// * `input` - The input string to search
/// * `first_word` - The starting marker word
/// * `last_word` - The ending marker word
fn find_text_between(input: &str, first_word: &str, last_word: &str) -> Option<(String, RangeSet<usize>)> {
    let first_pos = input.find(first_word)?;
    let last_pos = input.rfind(last_word)?;
    
    if last_pos < first_pos {
        return None;
    }
    
    let start = first_pos;
    let end = last_pos;
    let text = input[start..end].to_string();
    
    Some((text, RangeSet::from([start..end])))
}
