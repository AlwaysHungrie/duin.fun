import bot from '../../bot'
import config from '../../utils/config'
import { Command } from '../command.interface'

export const supportedNetworksCommand: Command = {
  command: 'supportednetworks',
  description: 'Display supported networks',
  handler: (message) => {
    const chatId = message.chat.id
    bot.sendMessage(chatId, supportedNetworksMessage, {
      parse_mode: 'MarkdownV2',
    })
  },
}

const supportedNetworksMessage = `Supported networks:
*${config.SUPPORTED_NETWORKS.split(',').join(', ')}*

_Please ensure that you are staking to the correct address by using /address\\._`
