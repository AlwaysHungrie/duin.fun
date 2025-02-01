import bot from '../../bot'
import { getRegisteredAddress, getUser, getUserByChatId, registerAddress, updateUserTwitterHandle } from '../../db/user'
import { getTweet } from '../../twitter/getTweet'
import { isValidAddress } from '../../web3/misc'
import { verifySignature } from '../../web3/signature'
import { Command } from '../command.interface'

export const claimXHandleCommand: Command = {
  command: 'claimxhandle',
  description:
    'Connect X handle with registered address with a tweet of the signed secret. Example: /claimxhandle https://x.com/anyuser/status/1234567890',
  handler: async (message) => {
    console.log(message)
    const chatId = message.chat.id
    const text = message.text
    if (!text) {
      bot.sendMessage(chatId, 'Please provide an url of your tweet')
      return
    }

    const user = await getUserByChatId(chatId.toString())
    if (!user || !user.address) {
      bot.sendMessage(
        chatId,
        'Unable to find an address registered with this account. Please use /register <your address> first'
      )
      return
    }

    if (!user.twitterNonce) {
      bot.sendMessage(chatId, 'An X handle is might already be associated with this account. Please use /register <your address> again')
      return
    }

    const tweet = await getTweet(text)
    if (!tweet) {
      bot.sendMessage(chatId, 'Unable to find a tweet with this url')
      return
    }

    console.log(tweet.text, user.twitterNonce, user.address)

    const isVerified = verifySignature(user.twitterNonce, tweet.text, user.address)
    if (!isVerified) {
      bot.sendMessage(
        chatId,
        'Unable to verify the tweet, ensure that the secret provided to you was signed by the registered address'
      )
      return
    }

    await updateUserTwitterHandle(user.chatId, tweet.author)
    bot.sendMessage(
      chatId,
      'X handle claimed successfully. All your tasks will be posted to your X handle'
    )
  },
}

