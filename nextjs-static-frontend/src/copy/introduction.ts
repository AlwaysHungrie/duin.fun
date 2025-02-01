export const INTRODUCTION = `
# Welcome to duin.fun!

Bet on yourself, get duin. Have more questions? Reach out to us on [Twitter](https://twitter.com/duinfun).

## How It Works

### 1. Register Your Wallet
- Use the \`/register\` followed by your wallet address to register your wallet address. 
- *For example*: \`/register 0x23ada4b7203F3617aB6e601Ce2829FB9C75C2AC9\`
- This ensures your funds remain protected by preventing others from claiming your transaction as theirs. You will not be able to use a wallet that has already been registered by someone else.

### 2. Stake Your Commitment
- Send native tokens from your registered address to the @getduinbot's address:
~~~
0x5D484E465Bea2dea67dF3ed9847DC0c16a9caC73
~~~
- You can use any wallet directly or connect your wallet to [duin.fun](https://duin.fun) to make a commitment and get the transaction hash.
- You can use any of the supported networks (\`base\`, \`ethereum\`, \`scroll\`). Use the \`/supportednetworks\` command to check supported networks directly from telegram.
- The @getduinbot's address can be found using the \`/address\` command.
- **Important**: Make sure you are sending your stake to the correct address and on a supported network. Unsupported commitments cannot be recovered.

### 3. Add Your Commitment
- Start a commitment using the \`/duin\` command and a message. This message must contain a clear task description and a block explorer link containing your commitment transaction hash.
- Following is an example of valid \`/duin\` command. *You can copy this exact message and paste it in telegram without registering your wallet, to see how duin command works as it has been programmed to act as sample interaction:*
~~~
/duin Implement a proof system that ensures duin.fun bot responses as well as wallet keys cannot be compromised or tampered with. https://basescan.org/tx/0x04ed94c3f3eb6be159bc1de9cf49601b89e081e0b4e6ae00026d42b8b165adc4
~~~
- If the duin bot is unable to understand your task or how it should be evaluating if you have completed your task, it will return your commitment back to you. 

### 4. Complete Your Task
- Once the bot decides to accept your commitment, it will send you a confirmation message.
- After you have completed your task, you can reply to same message explaining how you have completed your task.
- If satisfied with your response, the bot will release your staked amount back to you.
- *You can try again by replying to the confirmation message, if your stake was not released.*

## Available Commands

- \`/start\` to start chatting with the bot
- \`/example\` to see a sample interaction of a successful task
- \`/address\` to display @getduinbot's wallet address
- \`/supportednetworks\` to display supported networks
- \`/register\` to register your wallet address. **Usage**: \`/register <wallet address>\`
- \`/duin\` to commit to a task. **Usage**: \`/duin <task description> <block explorer link>\`

##  Handling Commitments

All commitments released or returned by @getduinbot will have the gas fees deducted from the final amount. 
@getduinbot is an autonomous agent, and it is not possible for anyone to manually take control over the agent's wallet at given point in time.

*Blockchain networks can be unreliable at times, in the unlikely cases of network failure or transactions getting lost, **duin.fun** will not be responsible for any loses incurred by the user.*

---
***Important Notice:** Never blindly trust agents claiming to be autonomous. Visit https://duin.fun/docs/verifiable-autonomy to learn more.*
`
