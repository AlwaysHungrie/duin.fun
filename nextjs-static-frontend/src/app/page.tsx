'use client'

import ConnectWallet from '@/components/connectWallet/connectWallet'
import { CONFIG } from '@/config'
// import ConnectWallet from '@/components/connectWallet/connectWallet'
import { LANDING_PAGE } from '@/copy/landingPage'
// import { usePrivy, useWallets } from '@privy-io/react-auth'
import Image from 'next/image'
import Link from 'next/link'
import { HiArrowRight } from 'react-icons/hi2'

export default function Home() {
  const handleLaunchOnTelegram = () => {
    window.open(CONFIG.TELEGRAM_URL, '_blank')
  }

  return (
    <div className="bg-homeBg min-h-screen font-redditSans">
      <div className="flex flex-col items-center h-screen p-4 overflow-hidden w-screen relative">
        <div className="flex w-full z-10 pt-2">
          <ConnectWallet isHomePage={true} />
        </div>
        <div
          onClick={handleLaunchOnTelegram}
          className={`mt-auto z-10 w-full max-w-[400px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[825px] relative aspect-video rounded-3xl lg:rounded-[32px] overflow-hidden cursor-pointer hover:rotate-1 hover:scale-105 transition-all duration-300 group`}
        >
          <Image src="/heroCard.svg" alt="hero" fill className="object-cover" />
          <div className="absolute top-4 right-4">
            <Image src="/telegram.svg" alt="hero" height={56} width={56} />
          </div>
          <div className="absolute bottom-0 left-0 w-full h-full flex flex-col items-center justify-center p-4 text-center">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[128px] leading-tight sm:leading-tight md:leading-tight lg:leading-[164px] font-semibold text-white">
              {LANDING_PAGE.TITLE}
            </h1>
            <p className="text-sm sm:text-lg md:text-xl lg:text-[24px] leading-snug sm:leading-snug md:leading-snug lg:leading-[24px] font-semibold text-white">
              {LANDING_PAGE.DESCRIPTION}
            </p>
            <button className="mt-6 bg-white text-[#9E60ED] px-2 py-1 md:px-4 md:py-2 rounded-full font-semibold text-sm md:text-base">
              <HiArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 md:group-hover:scale-150 transition-all duration-300" />
            </button>
          </div>
        </div>
        <div className="absolute bottom-[-60px] sm:bottom-[-80px] md:bottom-[-100px] lg:bottom-[-120px] left-0 w-[442px] sm:w-[600px] md:w-[700px] lg:w-[884px] h-[422px] sm:h-[600px] md:h-[700px] lg:h-[845px] animate-spin-slow-mobile md:animate-spin-slow">
          <Image
            src="/landing/artifact1.svg"
            alt="decorative artifact"
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute top-[-60px] sm:top-[-80px] md:top-[-100px] lg:top-[-120px] right-[-270px] sm:right-[-360px] md:right-[-450px] lg:right-[-540px] w-[398px] sm:w-[500px] md:w-[650px] lg:w-[796px] h-[614px] sm:h-[800px] md:h-[1000px] lg:h-[1229px] animate-bounce-slow-mobile md:animate-bounce-slow ">
          <Image
            src="/landing/artifact2.svg"
            alt="decorative artifact"
            fill
            className="object-contain"
          />
        </div>

        <Link href="/docs" className="z-10 text-sm md:text-base mb-auto mt-4 cursor-pointer opacity-40 hover:opacity-70">
          {LANDING_PAGE.LEARN_MORE}
        </Link>
      </div>
    </div>
  )
}
