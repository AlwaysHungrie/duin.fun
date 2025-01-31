import { formatAddress, formatWeiBalance } from '@/utils/formatting'
import { HiCheck, HiCog, HiDuplicate, HiX } from 'react-icons/hi'
import { useCallback, useEffect, useState } from 'react'
import { ConnectedWallet, usePrivy, useWallets } from '@privy-io/react-auth'
import { ethers } from 'ethers'
import { useDialogStore } from '@/providers/dialog'
import { useRouter } from 'next/navigation'
import { CONFIG } from '@/config'

export default function WalletDetails() {
  const router = useRouter()
  const { logout, exportWallet, signMessage } = usePrivy()
  const { wallets } = useWallets()
  const [showCopySuccess, setShowCopySuccess] = useState(false)
  const [balanceInWei, setBalanceInWei] = useState<bigint>()
  const { closeDialog } = useDialogStore()
  const [message, setMessage] = useState<string>('')
  const [signature, setSignature] = useState<string>()

  const allowSignMessage = message && message.length === 44

  const activeWallet = wallets[0]

  const getBalance = useCallback(async (wallet: ConnectedWallet) => {
    const provider = await wallet.getEthereumProvider()
    const ethersProvider = new ethers.BrowserProvider(provider)
    const balanceInWei = await ethersProvider.getBalance(wallet?.address)
    setBalanceInWei(balanceInWei)
  }, [])

  const address = activeWallet?.address
  const network = activeWallet?.chainId

  const onDisconnect = async () => {
    await logout()
    closeDialog()
  }

  const isPrivyManaged = activeWallet?.walletClientType === 'privy'
  const onExport = () => {
    exportWallet()
  }
  const onSwitchNetwork = () => {
    activeWallet?.switchChain(CONFIG.SUPPORTED_CHAINS[0].id)
  }

  useEffect(() => {
    if (!activeWallet) {
      return
    }

    getBalance(activeWallet)
  }, [activeWallet, getBalance])

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address)
    setShowCopySuccess(true)
    setTimeout(() => {
      setShowCopySuccess(false)
    }, 2000) // Show check mark for 2 seconds
  }

  const handleSignMessage = async () => {
    if (!message) {
      return
    }

    if (!activeWallet) {
      return
    }

    if (isPrivyManaged) {
      const { signature } = await signMessage({ message })
      setSignature(signature)
      return
    }

    const provider = await activeWallet.getEthereumProvider()
    const address = activeWallet.address

    const signature = await provider.request({
      method: 'personal_sign',
      params: [message, address],
    })
    setSignature(signature)
  }

  console.log(network)

  const isChainValid = network in CONFIG.VALID_CHAINS_LABELS
  const chainName = isChainValid
    ? CONFIG.VALID_CHAINS_LABELS[
        network as keyof typeof CONFIG.VALID_CHAINS_LABELS
      ]
    : 'Unknown'

  return (
    <div className="w-full flex flex-col md:flex-row gap-0">
      {/* Left Column */}
      <div className="flex flex-col items-center flex-[1] py-4 border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50 relative">
        <div className="flex items-center justify-center mt-2 md:mt-8 mx-4 md:mx-8 h-40 w-40 overflow-hidden rounded-full bg-white relative">
          <div
            onClick={() => {
              router.push(`/${address}`)
              closeDialog()
            }}
            className="opacity-0 hover:opacity-100 transition-all duration-300 bg-black/50 absolute top-0 left-0 w-full h-full flex items-center justify-center text-white text-sm font-semibold cursor-pointer"
          >
            View My Tasks
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg">{formatAddress(address)}</span>
          {showCopySuccess ? (
            <HiCheck className="h-4 w-4 text-green-500" />
          ) : (
            <HiDuplicate
              className="h-4 w-4 cursor-pointer text-gray-400 hover:text-gray-600"
              onClick={handleCopyAddress}
            />
          )}
        </div>
        {isChainValid ? (
          <div className="mt-2 md:mt-8 text-sm text-gray-400">
            Connected to&nbsp;
            <span className="font-bold">{chainName}</span>
          </div>
        ) : (
          <div
            className="mt-2 md:mt-8 text-sm text-gray-400"
            onClick={() => {
              onSwitchNetwork()
            }}
          >
            <span className="font-bold">Switch Network</span>
          </div>
        )}
      </div>

      {/* Right Column */}
      <div className="flex flex-col justify-between flex-[2] p-4 relative md:max-w-[calc(66.7%-32px)]">
        {isPrivyManaged && (
          <div
            className="absolute top-0 left-2 md:-left-6 text-xs text-gray-400 py-2 flex items-center hover:text-gray-600 cursor-pointer"
            onClick={onExport}
          >
            <HiCog className="h-4 w-4 mr-1" />
            Managed by&nbsp;
            <span className="font-bold">Privy</span>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-400">{'Balance'}</div>
            <div className="text-xl font-bold">{`${formatWeiBalance(
              balanceInWei,
              8
            )} ETH`}</div>
          </div>
          <div className="text-right">
            <div className="text-sm mb-1 text-gray-400">{'Sign Message'}</div>

            {signature ? (
              <div className="flex gap-1 items-center">
                <div className="text-xl font-bold overflow-hidden text-ellipsis w-full">
                  {signature}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(signature)
                  }}
                  className="text-sm hover:bg-black hover:text-white rounded-lg px-2 py-1"
                >
                  Copy
                </button>
                <HiX
                  className="h-4 w-4 cursor-pointer text-gray-400 hover:text-gray-600"
                  onClick={() => {
                    setSignature('')
                    setMessage('')
                  }}
                />
              </div>
            ) : (
              <div className="flex gap-1 items-center">
                <input
                  type="text"
                  placeholder="Paste 44 char secret here"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg focus:outline-none p-2 mt-1"
                />
                <button
                  onClick={handleSignMessage}
                  disabled={!allowSignMessage}
                  className="text-sm hover:bg-black hover:text-white rounded-lg px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sign
                </button>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={onDisconnect}
          className="rounded-lg border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50 cursor-pointer mt-4"
        >
          Disconnect Wallet
        </button>
      </div>
    </div>
  )
}
