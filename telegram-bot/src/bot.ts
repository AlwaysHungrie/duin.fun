import TelegramBot from 'node-telegram-bot-api'
import config from './utils/config'
import { commands } from './commands/commands'
import processReply from './commands/processReply'

const bot = new TelegramBot(config.BOT_TOKEN, { polling: true })

export const initBot = () => {
  commands.forEach(({ command, handler }) => {
    const cleanCommand = command.replace(/^\//, '')
    const commandRegex = new RegExp(
      `(?:^|\\s)/?${cleanCommand}(?:@\\w+)?(?=\\s|$)`,
      'i'  // case insensitive
    )
    bot.onText(commandRegex, handler)
  })

  bot.on('message', (message) => {
    if (message.reply_to_message) {
      processReply(message, bot)
    }
  })
  
  console.log('Bot is running...')
}

export default bot
