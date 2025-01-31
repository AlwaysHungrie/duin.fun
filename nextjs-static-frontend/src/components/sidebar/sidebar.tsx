import React, { useEffect } from 'react'
import { useDocsStore } from '@/providers/docsProvider'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import NavigationItem from './navigationItem'
import { DOCS_INDEX } from '@/copy/docsIndex'

export default function Sidebar() {
  const router = useRouter()
  const { sidebarOpen, setSidebarOpen } = useDocsStore()

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize() // Call it initially to set the correct state

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [setSidebarOpen])

  return (
    <>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed top-0 left-0 w-full h-full bg-black/50 z-40 sm:hidden sm:pointer-events-none"
        />
      )}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-white border-r absolute h-screen sm:relative flex flex-col transition-all duration-300 ease-in-out sm:translate-x-0 z-50`}
      >
        {sidebarOpen && (
          <div
            className="p-4 border-b flex items-center gap-4 cursor-pointer group"
            onClick={() => router.push('/')}
          >
            <Image
              src="/squareLogo.svg"
              className="group-hover:rotate-3 group-hover:scale-110 transition-all duration-300"
              alt="Logo"
              width={56}
              height={56}
            />
          </div>
        )}

        {sidebarOpen && (
          <div className="flex-1 overflow-y-auto py-4">
            {DOCS_INDEX.map(({ key, label, items, link }) => (
              <NavigationItem key={key} label={label} items={items} link={link} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
