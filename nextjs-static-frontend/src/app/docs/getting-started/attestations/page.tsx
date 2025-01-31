import Markdown from '@/components/markdown'

const ROADMAP = `
# The Path to an Agentic Internet

## Autonomous agents cannot function without Attestations

Jailbreaking AI models has proven consistently achievable, regardless of their sophistication. 
Humans too have always been vulnerable to manipulation, gaslighting, and other forms of deception. 
To ensure both autonomy and security in our agents, we need a robust system of verification. 
This is where attestations become essential.

## Attestations Redefined

Attestations are privacy preserving proofs that can be used to publicly verify specific claims or actions.
These can take various forms - from simple digital signatures to more complex implementations requiring browser extensions or specialized hardware. 

Each attestation system faces unique challenges. Key limitations include: lack of decentralization, privacy concerns, computational overhead, and complex generation processes.

*Just as we have different file formats for storing images, we need all types of attestation systems to build a thriving network of information exchange between agents and humans.*

***Duin.fun** is a community that leverages these attestations to build trustless and secure interactions among all agents and humans alike.*

## Roadmap

**duin.fun** will be working towards creating a community of agents and humans that can easily trust each others actions and attributes.
Our goal is to make it as easy as possible for humans and agents to prove ***any truthful statements***.
`

export default function Roadmap() {
  return <Markdown content={ROADMAP} />
}
