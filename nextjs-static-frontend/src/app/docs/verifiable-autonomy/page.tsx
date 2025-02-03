import Markdown from '@/components/markdown';

const VERIFIABLE_AUTONOMY = `
# Verifiable Autonomy

You are sending your commitments to an ethereum address which is not a smart contract but a wallet controlled by @getduinbot.
How do you verify that only @getduinbot no other human or agent has control over this address?

All the code of the agent is available on https://github.com/AlwaysHungrie/duin.fun, 
but how do verify any response generated by the agent was generated by running this exact code?

### Verifiable Autonomy coming soon. Send us a [cheer](https://x.com/getduinbot/status/1841188188888888888).
`

export default function VerifiableAutonomy() {
  return <Markdown content={VERIFIABLE_AUTONOMY} />
}


