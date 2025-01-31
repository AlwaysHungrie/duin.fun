'use client'

import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { HiChevronRight } from 'react-icons/hi2'

export default function NavigationItem({
  label,
  items,
}: {
  label: string
  items: { key: string; label: string; link: string }[]
}) {
  const [isOpen, setIsOpen] = useState(true)
  const router = useRouter()
  const _path = usePathname()
  const path = _path === '/docs' ? '/docs/getting-started/introduction' : _path

  return (
    <div className="mb-0">
      <div
        className="flex items-center gap-2 p-2 hover:bg-secondaryAccent rounded cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <HiChevronRight
          className={`h-4 w-4 transform transition-transform ${
            isOpen ? 'rotate-90' : ''
          }`}
        />
        <span className="font-medium">{label}</span>
      </div>
      {isOpen && (
        <div>
          {items.map(({ key, label, link }) => (
            <div
              key={key}
              className={`py-2 pr-2 pl-8 cursor-pointer rounded hover:bg-homeBg ${
                path === link ? 'bg-homeBg' : ''
              }`}
              onClick={() => {
                console.log(link)
                router.push(link)
              }}
            >
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
