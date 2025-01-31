import dotenv from 'dotenv'

dotenv.config()
const token = process.env.BOT_TOKEN
if (!token) {
  throw new Error('BOT_TOKEN is required')
}

const botAddress = process.env.BOT_ADDRESS
if (!botAddress) {
  throw new Error('BOT_ADDRESS is required')
}

const botPrivateKey = process.env.BOT_PRIVATE_KEY
if (!botPrivateKey) {
  throw new Error('BOT_PRIVATE_KEY is required')
}

const supportedNetworks = process.env.SUPPORTED_NETWORKS
if (!supportedNetworks) {
  throw new Error('SUPPORTED_NETWORKS is required')
}

const openaiApiKey = process.env.OPENAI_API_KEY
if (!openaiApiKey) {
  throw new Error('OPENAI_API_KEY is required')
}

const baseRpcUrl = process.env.BASE_RPC_URL || 'https://mainnet.base.org'
const scrollRpcUrl = process.env.SCROLL_RPC_URL || 'https://scroll-mainnet.chainstacklabs.com'
const ethereumRpcUrl = process.env.ETHEREUM_RPC_URL || 'https://eth.llamarpc.com'

export default {
  BOT_TOKEN: token,
  BOT_ADDRESS: botAddress,
  BOT_PRIVATE_KEY: botPrivateKey,
  SUPPORTED_NETWORKS: supportedNetworks,
  BASE_RPC_URL: baseRpcUrl,
  SCROLL_RPC_URL: scrollRpcUrl,
  ETHEREUM_RPC_URL: ethereumRpcUrl,
  OPENAI_API_KEY: openaiApiKey,
}