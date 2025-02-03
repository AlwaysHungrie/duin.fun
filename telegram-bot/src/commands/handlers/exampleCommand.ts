import bot from "../../bot"
import config from "../../utils/config"
import { Command } from "../command.interface"

export const exampleCommand: Command = {
  command: 'example',
    description: 'See an example interaction of a successful duin command',
    handler: (message) => {
      const chatId = message.chat.id
      bot.sendMessage(chatId, exampleMessage, { parse_mode: 'MarkdownV2' })
    }
}

const exampleMessage = `This is an example of a successful interaction:

The message to the duin command must include:
   • a description of the task you want to complete
   • a valid transaction hash link to the bot's address

First, copy this message and send it to the bot\\. 

\`\`\`
${config.EXAMPLE_TASK}
\`\`\`

Then, after the bot sends back a message, send the following message but only as a *reply* to the bot's message\\.

\`\`\`
I have completed the task\\. You can see my latest commit at https://github.com/duin-fun
\`\`\`

_this is a example interaction, commitment will not be released in this interaction\\. Use /register to register your own address first before staking your commitment to the bot's address\\._
`
