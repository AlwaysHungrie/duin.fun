'use client'

import Sidebar from '@/components/sidebar/sidebar'
import { DOCS_INDEX } from '@/copy/docsIndex'
import { useDocsStore } from '@/providers/docsProvider'
import { usePathname } from 'next/navigation'
import React from 'react'
import { HiMenu } from 'react-icons/hi'
import { HiChevronRight, HiMagnifyingGlass } from 'react-icons/hi2'

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { sidebarOpen, setSidebarOpen } =
    useDocsStore()

  const _path = usePathname()
  const path = _path === '/docs' ? '/docs/getting-started/introduction' : _path

  const [, , currentSectionPath, currentPagePath] = path.split('/')
  const currentSection = DOCS_INDEX.find(
    (section) => section.key === currentSectionPath
  ) ?? DOCS_INDEX[0]
  const currentPage = currentSection?.items.find(
    (item) => item.key === currentPagePath
  ) ?? currentSection?.items[0]

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Top Bar */}
        <div className="h-16 bg-white border-b px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <HiMenu
              className="h-5 w-5 text-gray-600 sm:hidden cursor-pointer"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            />
            <div className="flex items-center gap-2 text-gray-600">
              <span>{currentSection.label}</span>
              <HiChevronRight className="h-4 w-4" />
              <span className="text-gray-900">{currentPage.label}</span>
            </div>
          </div>

          <div className="items-center gap-4 hidden lg:flex">
            <div className="relative">
              <input
                type="text"
                placeholder="Search docs..."
                className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <HiMagnifyingGlass className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-64px)]">
          {children}
        </div>
      </div>
    </div>
  )
}
