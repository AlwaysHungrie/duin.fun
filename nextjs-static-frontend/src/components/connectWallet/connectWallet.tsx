'use client'

import { ConnectedWallet, usePrivy, useWallets } from '@privy-io/react-auth'
import { useDialogStore } from '@/providers/dialog'
import WalletDetails from '@/components/dialogs/walletDetails'
import { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { HiArrowRight } from 'react-icons/hi2'
import { formatWeiBalance, formatAddress } from '@/utils/formatting'

export default function ConnectWallet({
  isHomePage = false,
}: {
  isHomePage: boolean
}) {
  const { login, ready, authenticated, user } = usePrivy()
  const { wallets } = useWallets()
  const { openDialog } = useDialogStore()
  const [balanceInWei, setBalanceInWei] = useState<bigint>()

  const activeWallet = wallets[0]

  const getBalance = useCallback(async (wallet: ConnectedWallet) => {
    const provider = await wallet.getEthereumProvider()
    const ethersProvider = new ethers.BrowserProvider(provider)
    const balanceInWei = await ethersProvider.getBalance(wallet?.address)
    setBalanceInWei(balanceInWei)
  }, [])

  useEffect(() => {
    if (!activeWallet) {
      return
    }

    getBalance(activeWallet)
  }, [activeWallet, authenticated, ready, getBalance, isHomePage])

  const showWalletDetails = useCallback(() => {
    if (!authenticated || !activeWallet?.address) {
      return
    }

    openDialog(<WalletDetails />)
  }, [activeWallet, authenticated, openDialog])

  if (authenticated && user?.wallet?.address) {
    return (
      <button
        onClick={showWalletDetails}
        className="group px-2 py-2 h-[42px] rounded-full bg-black text-white max-w-[224px] w-full flex items-center hover:bg-black/80 transition-colors duration-300"
      >
        <div className="bg-white rounded-full w-[26px] h-[26px] flex items-center justify-center overflow-hidden"></div>

        <div className="text-white text-xs flex gap-2 mx-auto px-2">
          <span className="text-center">
            {formatAddress(user?.wallet?.address)}
          </span>
          <span className="text-center">|</span>
          <span className="text-center">
            {formatWeiBalance(balanceInWei)} ETH
          </span>
        </div>
      </button>
    )
  }

  return (
    <button
      onClick={() => {
        login()
      }}
      disabled={!ready}
      className="group px-2 py-2 h-[42px] rounded-full bg-black text-white max-w-[224px] w-full flex items-center hover:bg-black/80 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="bg-white rounded-full w-[26px] h-[26px] flex items-center justify-center" />
      <span className="text-white text-sm font-bold mx-auto">
        {isHomePage ? 'Get Duing' : 'Connect Wallet'}
      </span>
      <div className="rounded-full w-[26px] h-[26px] flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors duration-300">
        <HiArrowRight className="text-white group-hover:text-black" />
      </div>
    </button>
  )
}
