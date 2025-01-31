import bot from "../../bot"
import { Command } from "../command.interface"

export const startCommand: Command = {
  command: 'start',
  description: 'Start the bot',
  handler: (message) => {
    const chatId = message.chat.id
    bot.sendMessage(chatId, startMessage, { parse_mode: 'MarkdownV2' })
  }
}
const startMessage = `Welcome to duin\\.fun\\!

Bet on yourself, get duin\\.

Need motivation to complete important tasks? @getduinbot is here to help\\!
Simply make a commitment to your task by staking native tokens from your preferred blockchain\\.
Complete your task, and the bot will return your stake back to you\\.

How it works:

1\\. Register your wallet address with the /register command
   • This ensures your funds remain secure by preventing others from claiming your transaction as theirs
   • Connection between your wallet address and telegram id always remains secure and not shared with anyone

2\\. Start a commitment using the /duin command and include:
   • The task description
   • A block explorer link containing the transaction hash of your commitment \\(Make sure to only make commitments with *native tokens* on /supportednetworks\\. Unsupported commitments cannot be recovered\\)

3\\. After your task is accepted, reply to the bot's confirmation message with a proof of completion\\. If convinced, your staked amount will be returned to you by the bot\\.

Get Started:

Use /example to see an example interaction\\.
You can send tokens directly using any wallet to this /address to make a commitment\\.

⚠️ *IMPORTANT:*
_Never blindly trust agents claiming to be autonomous_
Please read through https://duin\\.fun/info to learn more about how your funds and information are protected before committing\\.
`
