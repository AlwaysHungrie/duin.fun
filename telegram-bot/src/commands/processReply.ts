import TelegramBot from "node-telegram-bot-api";
import { getTransactionByMessageId, updateCompleteTransaction, updateTransactionStatus } from "../db/transaction";
import { getTransactionDetails } from "../web3/transaction";
import { checkTaskCompletionResponse } from "../llm/task";
import { handleCompletion } from "../web3/commitments";
import { TransactionStatus } from "@prisma/client";

const tryAgainMessage = 'Please try again by sending a reply to the original message.'
const taskCompleteMessage = 'Awesome! You\'ve completed your task. You commitment has been released.'

export default async function processReply(message: TelegramBot.Message, bot: TelegramBot) {
  const chatId = message.chat.id
  const replyToMessage = message.reply_to_message
  if (!replyToMessage) {
    return
  }
  const messageId = replyToMessage.message_id

  const transaction = await getTransactionByMessageId(`${chatId}-${messageId}`)
  if (!transaction || !transaction.acceptingReplies) {
    return
  }

  if (message.text === 'I have completed the task. You can see my latest commit at https://github.com/duin-fun' && transaction.taskInfo === '<<example task>>') {
    await updateCompleteTransaction(transaction.txHash, '', TransactionStatus.COMPLETED)
    bot.sendMessage(chatId, '(The user confirmed that they have completed the task and provided a link to their latest commit as evidence.)\nAwesome! You\'ve completed your task. You commitment has been released.')
    return
  }

  const { txHash, taskInfo, status } = transaction

  if (status === TransactionStatus.PROCESSING) {
    bot.sendMessage(chatId, 'This task is already in progress. Please wait for it to complete.')
    return
  } else if (status === TransactionStatus.COMPLETED) {
    bot.sendMessage(chatId, 'This task has been completed.')
    return
  } else if (status === TransactionStatus.FAILED) {
    bot.sendMessage(chatId, 'Unable to process your commitment due to network error. I will try to release your commitment again in a few hours.')
    return
  }
  await updateTransactionStatus(txHash, TransactionStatus.PROCESSING)

  const transactionDetails = await getTransactionDetails(txHash)
  let responseObject = null

  try {
    const response = await checkTaskCompletionResponse(taskInfo ?? "<empty task>", message.text ?? "<empty response>")
    responseObject = JSON.parse(response)
    console.log('responseObj', responseObject)

    // check if responseObject has keys isComplete, reason
    if (
      responseObject['isComplete'] === undefined ||
      responseObject['reason'] === undefined
    ) {
      throw new Error('Invalid response object')
    }
  } catch (error) {
    await updateTransactionStatus(txHash, TransactionStatus.NOT_STARTED)
    console.error('Error generating response:', error)
    bot.sendMessage(chatId, `Something went wrong. I am unable to understand your response. ${tryAgainMessage}`)
    return
  }

  if (!responseObject['isComplete']) {
    await updateTransactionStatus(txHash, TransactionStatus.NOT_STARTED)
    bot.sendMessage(chatId, `(${responseObject['reason']})\n${tryAgainMessage}`)
    return
  }

  bot.sendMessage(chatId, `(${responseObject['reason']})\n${taskCompleteMessage}`)
  handleCompletion(transactionDetails)
}
