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
            <p className="mb-4 leading-relaxed">{children}</p>
          ),
          code: ({ children }) => (
            <code className="bg-homeBg p-1 rounded text-sm break-all">{children}</code>
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
            <a href={href} className="text-blue-500 hover:underline">
              {children}
            </a>
          ),
          hr: () => <hr className="mt-8 mb-2" />,
        }}
      >
        {content}
      </Markdown>
    </div>
  )

  // const lines = content.split('\n').map(line => line.trim())
  // return (
  //   <div className="max-w-4xl mx-auto py-12 px-8">
  //     {lines.map((line, index) => {
  //       if (line.startsWith('# ')) {
  //         return (
  //           <h1 key={index} className="text-4xl font-bold mb-6">
  //             {line.substring(2)}
  //           </h1>
  //         )
  //       }
  //       if (line.startsWith('## ')) {
  //         return (
  //           <h2 key={index} className="text-2xl font-semibold mb-4 mt-8">
  //             {line.substring(3)}
  //           </h2>
  //         )
  //       }
  //       if (line.startsWith('- ')) {
  //         return (
  //           <li key={index} className="ml-4 mb-2">
  //             {line.substring(2)}
  //           </li>
  //         )
  //       }
  //       if (line.startsWith('```')) {
  //         return (
  //           <pre
  //             key={index}
  //             className="bg-gray-900 text-gray-100 p-4 rounded-lg my-4 font-mono"
  //           >
  //             {line}
  //           </pre>
  //         )
  //       }
  //       if (line.trim() === '') {
  //         return <div key={index} className="h-4"></div>
  //       }
  //       return (
  //         <p key={index} className="mb-4 leading-relaxed">
  //           {line}
  //         </p>
  //       )
  //     })}
  //   </div>
  // )
}
