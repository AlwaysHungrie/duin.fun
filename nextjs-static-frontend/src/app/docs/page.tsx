import Markdown from '@/components/markdown'
import { INTRODUCTION } from './getting-started/introduction/page'

export default function DocsPage() {
  return <Markdown content={INTRODUCTION} />
}

