import bot from '../../bot'
import config from '../../utils/config'
import { Command } from '../command.interface'

export const addressCommand: Command = {
  command: 'address',
  description: "Display @getduinbot's wallet address",
  handler: (message) => {
    const chatId = message.chat.id
    bot.sendMessage(chatId, addressMessage, { parse_mode: 'MarkdownV2' })
  },
}

const addressMessage = `Wallet address:
*${config.BOT_ADDRESS}*

_Please check if you are using a supported network with /supportednetworks before staking your commitment to this address\\._`

