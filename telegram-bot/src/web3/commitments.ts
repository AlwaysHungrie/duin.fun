import { TransactionStatus } from '@prisma/client'
import {
  createTransaction,
  updateCompleteTransaction,
  updateRefundTransaction,
} from '../db/transaction'
import { makeTransaction, TransactionDetails } from './transaction'
import { createEndTaskTweet, createTaskTweet } from '../twitter/createTweet'

export const handleRefund = async (
  transactionDetails: TransactionDetails,
  messageId: string
) => {
  await createTransaction(
    transactionDetails.txHash,
    messageId,
    TransactionStatus.PROCESSING,
    false
  )
  const { sender, amount, network } = transactionDetails

  let refundTxHash = ''
  let retryCount = 0
  while (retryCount < 3) {
    refundTxHash = await makeTransaction(network, amount, sender)
    if (refundTxHash !== '') {
      break
    }
    retryCount++
  }

  let status: TransactionStatus = TransactionStatus.FAILED
  if (refundTxHash !== '') {
    status = TransactionStatus.COMPLETED
  }

  await updateRefundTransaction(transactionDetails.txHash, refundTxHash, status)
  return refundTxHash
}

export const handleAcceptance = async (
  transactionDetails: TransactionDetails,
  messageId: string,
  taskInfo: string,
  twitterHandle: string | null | undefined
) => {
  let taskTweetId = null
  if (twitterHandle && taskInfo) {
    taskTweetId = await createTaskTweet(taskInfo, twitterHandle)
  }
  await createTransaction(
    transactionDetails.txHash,
    messageId,
    TransactionStatus.NOT_STARTED,
    true,
    taskInfo,
    taskTweetId ?? undefined
  )
}

export const handleCompletion = async (
  transactionDetails: TransactionDetails,
  reason?: string,
  taskTweetId?: string | null
) => {
  const { sender, amount, network } = transactionDetails

  let completionTxHash = ''
  let retryCount = 0
  while (retryCount < 3) {
    completionTxHash = await makeTransaction(network, amount, sender)
    if (completionTxHash !== '') {
      break
    }
    retryCount++
  }

  let status: TransactionStatus = TransactionStatus.FAILED
  if (completionTxHash !== '') {
    status = TransactionStatus.COMPLETED
  }

  let endTaskTweetId = null
  if (taskTweetId && reason) {
    endTaskTweetId = await createEndTaskTweet(reason, taskTweetId)
  }

  await updateCompleteTransaction(
    transactionDetails.txHash,
    completionTxHash,
    status,
    endTaskTweetId ?? undefined
  )
  return completionTxHash
}
