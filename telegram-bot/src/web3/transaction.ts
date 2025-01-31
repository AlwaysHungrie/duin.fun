import { ethers } from 'ethers'
import config from '../utils/config'

export interface TransactionDetails {
  network: string
  amount: string
  sender: string
  receiver: string | null
  success: boolean
  txHash: string
}

export async function getTransactionDetails(
  txHash: string
): Promise<TransactionDetails> {
  // Connect to networks
  const providers = {
    base: new ethers.JsonRpcProvider(config.BASE_RPC_URL),
    scroll: new ethers.JsonRpcProvider(config.SCROLL_RPC_URL),
    ethereum: new ethers.JsonRpcProvider(config.ETHEREUM_RPC_URL),
  }

  // Try each network to find the transaction
  for (const [network, provider] of Object.entries(providers)) {
    try {
      const tx = await provider.getTransaction(txHash)
      if (tx) {
        const receipt = await provider.getTransactionReceipt(txHash)
        if (receipt) {
          return {
            network,
            amount: ethers.formatEther(tx.value), // Convert from wei to ETH
            sender: tx.from,
            receiver: tx.to,
            success: receipt.status === 1,
            txHash,
          }
        }
      }
    } catch (error) {
      continue // Try next network if this one fails
    }
  }

  throw new Error('Transaction not found on any network')
}

export async function makeTransaction(
  network: string,
  amount: string,
  receiver: string
): Promise<string> {
  try {
    let provider
    if (network === 'ethereum') {
      provider = new ethers.JsonRpcProvider(config.ETHEREUM_RPC_URL)
    } else if (network === 'base') {
      provider = new ethers.JsonRpcProvider(config.BASE_RPC_URL)
    } else if (network === 'scroll') {
      provider = new ethers.JsonRpcProvider(config.SCROLL_RPC_URL)
    } else {
      throw new Error('Invalid network')
    }

    const wallet = new ethers.Wallet(config.BOT_PRIVATE_KEY, provider)

    const transaction = {
      to: receiver,
      value: ethers.parseEther(amount),
    }

    const gasLimit = await provider.estimateGas(transaction)
    console.log('gasLimit', gasLimit)
    const gasFees = (await provider.getFeeData()).gasPrice
    console.log('gasFees', gasFees)

    if (!gasFees) {
      throw new Error('Failed to get gas fees')
    }

    const gasCost = gasFees * gasLimit
    console.log('gasCost', gasCost)

    // Get L1 fee estimation for Scroll
    let l1Fee = BigInt(0) as bigint
    if (network === 'scroll') {
      try {
        // TODO: code to get L1 fees for SCROLL
        l1Fee = gasCost / BigInt(2)
      } catch (error) {
        console.warn(
          'Failed to estimate L1 fee, might not be on Scroll:',
          error
        )
      }
    }

    
    const totalFees = gasCost + l1Fee
    console.log('totalFees (including L1):', totalFees)
    const amountInWei = ethers.parseEther(amount)
    console.log('amountInWei', amountInWei)
    const finalAmount = amountInWei - totalFees
    console.log('finalAmount', finalAmount)

    if (finalAmount <= 0) {
      return '0x0000000000000000000000000000000000000000000000000000000000000000'
    }

    const tx = await wallet.sendTransaction({
      to: receiver,
      value: finalAmount,
      gasLimit: gasLimit,
      gasPrice: gasFees,
    })
    return tx.hash
  } catch (error) {
    console.error('Error making transaction', error)
    return '0x0000000000000000000000000000000000000000000000000000000000000000'
  }
}
