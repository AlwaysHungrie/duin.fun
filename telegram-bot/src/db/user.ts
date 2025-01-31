import { generateSecret } from '../utils/secret'
import prisma from './prisma'

export async function registerAddress(chatId: string, address: string) {
  const secret = generateSecret()
  await prisma.user.upsert({
    where: {
      chatId,
    },
    update: {
      address,
      twitterNonce: secret,
      twitterHandle: null,
    },
    create: {
      chatId,
      address,
      twitterNonce: secret,
      twitterHandle: null,
    },
  })
  return secret
}

export async function updateUserTwitterHandle(
  chatId: string,
  twitterHandle: string
) {
  await prisma.user.update({
    where: { chatId },
    data: { twitterHandle, twitterNonce: null },
  })
}

export async function getRegisteredAddress(chatId: string) {
  const user = await prisma.user.findUnique({
    where: {
      chatId,
    },
  })
  return user?.address
}

export async function getUser(address: string) {
  return await prisma.user.findFirst({
    where: {
      address,
    },
  })
}

export async function getUserByChatId(chatId: string) {
  return await prisma.user.findFirst({
    where: {
      chatId,
    },
  })
}
