import Markdown from '@/components/markdown';

const REGISTER = `
# Register Wallet Address

Before you can start adding tasks with @getduinbot, you need to register your wallet address.
This ensures that when you make a commitment, someone else is not able to claim your commitment hash as their own before you run the \`/duin\` command to register your hash.

There are two different ways by which you can use **duin.fun** -

The first way, by default, is the private way where all your added tasks remain in your personal chat with @getduinbot. 
You simply stake your commitment, and get it back once you're done with your task.

To register your wallet address, use the \`/register\` followed by your wallet address.
For example: \`/register 0x23ada4b7203F3617aB6e601Ce2829FB9C75C2AC9\` would successfully register this wallet address against your account.

Running the above command will generate a response like this:

![registration success](/registration-success.png)

## Amplified Incentives

If you follow the instructions and associate your X handle, 
members of the duin community will be able to increase your staked amount by adding their own commitments to your task.

How?

 - When you add a task, the @getduinbot will make a post on X from its official account along with your X handle
 - Any user can now create a commitment (like usual) and adding the hash as a comment to this post
 - When you complete your task, the @getduinbot will not only release your initial commitment but also send you all the commitments added by other users
 - Make sure to keep this X post engaging by adding more details and updates to get the community to *cheer* for you


## How To Claim Your X Handle

The secret generated for you after you register is a secret, and not meant to be shared with anyone.
You need to sign this 44 character secret as it is with your wallet and tweet the exact signed message that was generated. (X handle verification will fail if your tweet contains any other text apart from the generated signed message)

To sign a message with your wallet, there are various online tools available. You can use any of them, or use the one available on the [duin.fun](https://duin.fun). _Signing a message is an offchain operation and should not cost you any tokens._

[Here](https://x.com/Always_Hungrie_/status/1885638179010609170) is an example of a tweet that has been used to successfully claim an X handle.
`

export default function Register() {
  return <Markdown content={REGISTER} />
}


