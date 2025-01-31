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

    const secret = await registerAddress(chatId.toString(), address)
    bot.sendMessage(chatId, registerMessage(secret), {
      parse_mode: 'MarkdownV2',
    })
  },
}

const registerMessage = (base64Secret: string) => `Your address has been registered\\.

You can now make a commitment by sending native tokens using this address to the bot's /address

But wait, there's more\\!
You can choose to associate your X handle with this wallet address\\. 

Associating an X handle will:
   • Allow duin bot to post your tasks anonymously on X 
   • Your X handle will be tagged when you add a task \\(_your telegram id always stays hidden_\\)
   • Get _cheered_ by the duin community and increase your staked amount
   • _Get a bigger commitment back_ than what you started with when you\\'re done with your task

Copy *only this secret below* and sign it directly from your wallet or by visiting duin\\.fun 

\`${base64Secret.replace(/\\/g, '').replace(/-/g, '\\-').replace(/_/g, '\\_')}\`

Tweet the signed message from your X handle
And use /claimxhandle \\<url of your tweet\\> to claim your X handle
Learn more at https://duin\\.fun/docs/cheer
`