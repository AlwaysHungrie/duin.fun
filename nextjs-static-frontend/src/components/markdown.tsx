'use client'

import remarkGfm from 'remark-gfm'
import Markdown from 'react-markdown'
import { HiDuplicate } from 'react-icons/hi'

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="max-w-4xl mx-auto py-12 px-8">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-4xl font-bold mb-4">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold mb-4 mt-8">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold mb-4 mt-8">{children}</h3>
          ),
          li: ({ children }) => <li className="ml-4 mb-2">{children}</li>,
          p: ({ children }) => (
            <p className="leading-relaxed">{children}</p>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal ml-4 mb-2">{children}</ol>
          ),
          code: ({ children }) => (
            <code className="bg-homeBg rounded text-sm break-all">{children}</code>
          ),
          pre: ({ children }) => (
            <pre className="bg-homeBg p-4 rounded my-4 font-mono text-sm whitespace-pre-wrap relative">
              <HiDuplicate
                className="w-4 h-4 absolute top-2 right-2 cursor-pointer hover:text-gray-500"
                // @ts-expect-error fix type script later
                onClick={() => navigator.clipboard.writeText(children?.props?.children ?? '')}
              />
              {children}
            </pre>
          ),
          a: ({ children, href }) => (
            <a href={href} className="text-blue-500 hover:underline" target="_blank">
              {children}
            </a>
          ),
          hr: () => <hr className="mt-8 mb-2" />,
          blockquote: ({ children }) => (
            <blockquote className="bg-white shadow-sm p-2 my-4 border-l-8 border-homeBg pl-4 text-sm">
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </Markdown>
    </div>
  )
}
