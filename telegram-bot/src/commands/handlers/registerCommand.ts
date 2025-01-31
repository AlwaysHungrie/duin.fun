import bot from '../../bot'
import { getUser, registerAddress } from '../../db/user'
import { isValidAddress } from '../../web3/misc'
import { Command } from '../command.interface'

export const registerCommand: Command = {
  command: 'register',
  description: 'Register your wallet address. Example: /register 0x0000000000000000000000000000000000000000',
  handler: async(message) => {
    console.log(message)
    const chatId = message.chat.id
    const text = message.text
    if (!text) {
      bot.sendMessage(chatId, 'Please provide an address')
      return
    }

    const address = text.split(' ').filter((s) => isValidAddress(s))[0]?.toLowerCase()
    if (!address) {
      bot.sendMessage(chatId, 'Please provide a valid address')
      return
    }

    const user = await getUser(address)
    if (user && user.chatId !== chatId.toString()) {
      bot.sendMessage(chatId, 'This address is already in use by another user')
      return
    }

    await registerAddress(chatId.toString(), address)
    bot.sendMessage(chatId, registerMessage, {
      parse_mode: 'MarkdownV2',
    })
  },
}

const registerMessage = `Your address has been registered\\.

You can now make a commitment by sending native tokens using this address to the bot's /address
`
