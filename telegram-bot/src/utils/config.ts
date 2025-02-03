import dotenv from 'dotenv'

dotenv.config()
const token = process.env.BOT_TOKEN
if (!token) {
  throw new Error('BOT_TOKEN is required')
}

const botAddress = process.env.BOT_ADDRESS
if (!botAddress) {
  throw new Error('BOT_ADDRESS is required')
}

const botPrivateKey = process.env.BOT_PRIVATE_KEY
if (!botPrivateKey) {
  throw new Error('BOT_PRIVATE_KEY is required')
}

const supportedNetworks = process.env.SUPPORTED_NETWORKS
if (!supportedNetworks) {
  throw new Error('SUPPORTED_NETWORKS is required')
}

const openaiApiKey = process.env.OPENAI_API_KEY
if (!openaiApiKey) {
  throw new Error('OPENAI_API_KEY is required')
}

const twitterApiKey = process.env.TWITTER_API_KEY
const twitterApiKeySecret = process.env.TWITTER_API_KEY_SECRET
const twitterBearerToken = process.env.TWITTER_BEARER_TOKEN
const twitterAccessToken = process.env.TWITTER_ACCESS_TOKEN
const twitterAccessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET
if (!twitterApiKey || !twitterApiKeySecret || !twitterBearerToken || !twitterAccessToken || !twitterAccessTokenSecret) {
  throw new Error('TWITTER_CONFIG is required')
}

const baseRpcUrl = process.env.BASE_RPC_URL || 'https://mainnet.base.org'
const scrollRpcUrl = process.env.SCROLL_RPC_URL || 'https://scroll-mainnet.chainstacklabs.com'
const ethereumRpcUrl = process.env.ETHEREUM_RPC_URL || 'https://eth.llamarpc.com'
 
const EXAMPLE_TASK = `/duin Implement a proof system that ensures duin\\.fun bot responses as well as wallet keys cannot be compromised or tampered with\\. https://basescan\\.org/tx/0x04ed94c3f3eb6be159bc1de9cf49601b89e081e0b4e6ae00026d42b8b165adc4`
const CHECK_EXAMPLE_TASK = '/duin Implement a proof system that ensures duin.fun bot responses as well as wallet keys cannot be compromised or tampered with. https://basescan.org/tx/0x04ed94c3f3eb6be159bc1de9cf49601b89e081e0b4e6ae00026d42b8b165adc4'

export default {
  BOT_TOKEN: token,
  BOT_ADDRESS: botAddress,
  BOT_PRIVATE_KEY: botPrivateKey,
  SUPPORTED_NETWORKS: supportedNetworks,
  BASE_RPC_URL: baseRpcUrl,
  SCROLL_RPC_URL: scrollRpcUrl,
  ETHEREUM_RPC_URL: ethereumRpcUrl,
  OPENAI_API_KEY: openaiApiKey,
  TWITTER_CONFIG: {
    API_KEY: twitterApiKey,
    API_KEY_SECRET: twitterApiKeySecret,
    BEARER_TOKEN: twitterBearerToken,
    ACCESS_TOKEN: twitterAccessToken,
    ACCESS_TOKEN_SECRET: twitterAccessTokenSecret,
  },
  EXAMPLE_TASK,
  CHECK_EXAMPLE_TASK,
}