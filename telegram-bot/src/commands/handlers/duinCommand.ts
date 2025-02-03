import { Message } from 'node-telegram-bot-api'
import bot from '../../bot'
import { Command } from '../command.interface'
import { findHash } from '../../web3/misc'
import {
  getTransactionDetails,
  TransactionDetails,
} from '../../web3/transaction'
import { extractTask } from '../../llm/taskUtils'
import { generateTaskResponse } from '../../llm/task'
import { handleAcceptance } from '../../web3/commitments'
import { handleRefund } from '../../web3/commitments'
import { getRegisteredAddress } from '../../db/user'
import config from '../../utils/config'
import { getTransaction } from '../../db/transaction'

const returnMessage = 'This commitment will be returned back.'
const acceptMessage = 'Reply to this message once you are done.'

export const duinCommand: Command = {
  command: 'duin',
  description: 'Commit to a task',
  handler: (message) => duinHandler(message, false),
}

export const duinPrivateCommand: Command = {
  command: 'duinprivate',
  description: 'Commit to a task privately',
  handler: (message) => duinHandler(message, true),
}

const duinHandler = async (message: Message, isPrivate: boolean) => {
  const chatId = message.chat.id
  const { address: registeredAddress, twitterHandle } =
    await getRegisteredAddress(chatId.toString())
  if (!registeredAddress) {
    bot.sendMessage(
      chatId,
      'Unable to find an address registered with this account. Please use /register <your address> first'
    )
    return
  }

  const {
    error: errorMessage,
    message: botMessage,
    initiateRefund,
    initiateAcceptance,
    transactionDetails,
    task,
    skipTwitterPost,
  } = await parseDuinMessage(message, registeredAddress, isPrivate)

  let responseText = botMessage ? botMessage : errorMessage
  if (transactionDetails) {
    if (initiateRefund) {
      responseText += `\n${returnMessage}`
    } else if (initiateAcceptance) {
      responseText += `\n${acceptMessage}`
    }
  }

  if (responseText) {
    const message = await bot.sendMessage(chatId, responseText)
    const messageId = message.message_id

    if (transactionDetails) {
      if (initiateRefund) {
        handleRefund(transactionDetails, `${chatId}-${messageId}`)
      } else if (initiateAcceptance) {
        handleAcceptance(
          transactionDetails,
          `${chatId}-${messageId}`,
          task || '<empty message>',
          skipTwitterPost ? null : twitterHandle
        )
      }
    }
    return
  }

  bot.sendMessage(
    chatId,
    'Something went wrong. Ideally this should not have happened, please reach out to the team at https://t.me/duin_fun_support'
  )
}

interface DuinResponse {
  transactionDetails: TransactionDetails | null
  initiateRefund: boolean
  initiateAcceptance: boolean
  error: string | null
  message: string | null
  task: string | null
  skipTwitterPost: boolean
}

async function parseDuinMessage(
  message: Message,
  registeredAddress: string,
  isPrivate: boolean
): Promise<DuinResponse> {
  const text = message.text
  console.log(text, config.CHECK_EXAMPLE_TASK, text === config.CHECK_EXAMPLE_TASK)

  if (text === config.CHECK_EXAMPLE_TASK) {
    return {
      transactionDetails: {
        sender: '0x0000000000000000000000000000000000000000',
        receiver: '0x0000000000000000000000000000000000000000',
        txHash:
          '0x04ed94c3f3eb6be159bc1de9cf49601b89e081e0b4e6ae00026d42b8b165adc4' +
          Date.now().toString(),
        amount: '0',
        network: 'base',
        success: true,
      },
      initiateRefund: false,
      initiateAcceptance: true,
      error: null,
      message:
        '(example)\nAdded the following task to your list: Implement a proof system for duin.fun bot responses and wallet keys to ensure they cannot be compromised or tampered with.',
      task: '<<example task>>',
      skipTwitterPost: true,
    }
  }

  let response: DuinResponse = {
    transactionDetails: null,
    initiateRefund: false,
    initiateAcceptance: false,
    error: null,
    message: null,
    task: null,
    skipTwitterPost: false,
  }
  if (isPrivate) {
    response.skipTwitterPost = true
  }

  if (!text) {
    response.error = 'Please provide a message.'
    return response
  }

  const txHash = findHash(text)
  if (!txHash) {
    response.error =
      'Unable to find a transaction hash in your message. Please provide a valid transaction hash or paste a complete explorer URL of your transaction. Use /example to see an example.'
    return response
  }

  const transaction = await getTransaction(txHash)
  if (transaction) {
    response.error =
      'This transaction has already been processed. Please use a different commitment.'
    return response
  }

  console.log('txHash', txHash)

  let transactionDetails = null
  try {
    transactionDetails = await getTransactionDetails(txHash)
    if (!transactionDetails) {
      throw new Error('Transaction not found on any network')
    }
  } catch (error) {
    response.error =
      'Error fetching transaction details. Please ensure the transaction hash is valid and is on a supported network.'
    return response
  }

  if (
    transactionDetails.sender.toLowerCase() !== registeredAddress.toLowerCase()
  ) {
    response.error =
      'Transaction is not sent from your registered address. Use /register to change your registered address.'
    return response
  }

  if (
    !transactionDetails.receiver ||
    transactionDetails.receiver.toLowerCase() !==
      config.BOT_ADDRESS.toLowerCase()
  ) {
    response.error =
      "Transaction is not sent to the correct address. Use /address to get the bot's address."
    return response
  }

  console.log('transactionDetails', transactionDetails)
  response.transactionDetails = transactionDetails
  response.initiateRefund = true

  const task = extractTask(text, txHash)
  response.task = task

  let responseObject = null

  try {
    const response = await generateTaskResponse(task)
    responseObject = JSON.parse(response)
    console.log('responseObj', responseObject)

    // check if responseObject has keys shouldAdd, task, reason
    if (
      responseObject['shouldAdd'] === undefined ||
      responseObject['task'] === undefined ||
      responseObject['reason'] === undefined
    ) {
      throw new Error('Invalid response object')
    }
  } catch (error) {
    console.error('Error generating response:', error)
    response.error =
      'Something went wrong. I am unable to generate a response at the moment. Please try again later.'
    return response
  }

  if (responseObject['shouldAdd']) {
    response.initiateRefund = false
    response.initiateAcceptance = true
    response.message = `Added the following task to your list: ${responseObject['task']}`
  } else {
    response.error = responseObject['reason']
  }

  return response
}
