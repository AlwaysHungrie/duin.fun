import { TransactionStatus } from '@prisma/client'
import prisma from './prisma'

export async function getTransaction(txHash: string) {
  return await prisma.transaction.findUnique({
    where: {
      txHash,
    },
  })
}

export async function getTransactionByMessageId(messageId: string) {
  return await prisma.transaction.findFirst({
    where: {
      processedMessageId: messageId,
    },
  })
}

export async function createTransaction(
  txHash: string,
  messageId: string,
  status: TransactionStatus,
  acceptingReplies: boolean,
  taskInfo?: string
) {
  return await prisma.transaction.create({
    data: {
      txHash,
      processedMessageId: messageId,
      status,
      acceptingReplies,
      taskInfo,
    },
  })
}

export async function updateRefundTransaction(
  txHash: string,
  refundTxHash: string,
  status: TransactionStatus
) {
  return await prisma.transaction.update({
    where: { txHash },
    data: { refundTxHash, status },
  })
}

export async function updateCompleteTransaction(
  txHash: string,
  completeTxHash: string,
  status: TransactionStatus
) {
  return await prisma.transaction.update({
    where: { txHash },
    data: { completeTxHash, status, acceptingReplies: false },
  })
}

export async function updateTransactionStatus(
  txHash: string,
  status: TransactionStatus
) {
  return await prisma.transaction.update({
    where: { txHash },
    data: { status },
  })
}
