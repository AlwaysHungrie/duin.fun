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
    },
    create: {
      chatId,
      address,
      twitterNonce: secret,
    },
  })
  return secret
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
