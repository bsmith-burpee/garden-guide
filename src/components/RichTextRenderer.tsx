import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types'
import { Document } from '@contentful/rich-text-types'
import Image from 'next/image'
import Link from 'next/link'

interface RichTextRendererProps {
  document: Document
}

const options = {
  renderMark: {
    [MARKS.BOLD]: (text: any) => <strong className="font-semibold">{text}</strong>,
    [MARKS.ITALIC]: (text: any) => <em className="italic">{text}</em>,
    [MARKS.UNDERLINE]: (text: any) => <u className="underline">{text}</u>,
    [MARKS.CODE]: (text: any) => (
      <code className="bg-gray-100 rounded px-1 py-0.5 text-sm font-mono">{text}</code>
    ),
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node: any, children: any) => (
      <p className="mb-4 leading-relaxed text-gray-700">{children}</p>
    ),
    [BLOCKS.HEADING_1]: (node: any, children: any) => (
      <h1 className="text-4xl font-medium mb-6 text-gray-900 font-reckless">{children}</h1>
    ),
    [BLOCKS.HEADING_2]: (node: any, children: any) => (
      <h2 className="text-3xl font-medium mb-4 mt-8 text-gray-900 font-reckless">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (node: any, children: any) => (
      <h3 className="text-2xl font-medium mb-3 mt-6 text-gray-900 font-reckless">{children}</h3>
    ),
    [BLOCKS.HEADING_4]: (node: any, children: any) => (
      <h4 className="text-xl font-medium mb-2 mt-4 text-gray-900 font-reckless">{children}</h4>
    ),
    [BLOCKS.HEADING_5]: (node: any, children: any) => (
      <h5 className="text-lg font-medium mb-2 mt-4 text-gray-900 font-reckless">{children}</h5>
    ),
    [BLOCKS.HEADING_6]: (node: any, children: any) => (
      <h6 className="text-base font-medium mb-2 mt-4 text-gray-900 font-reckless">{children}</h6>
    ),
    [BLOCKS.UL_LIST]: (node: any, children: any) => (
      <ul className="list-disc list-outside ml-6 mb-4 space-y-2 text-gray-700">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (node: any, children: any) => (
      <ol className="list-decimal list-outside ml-6 mb-4 space-y-2 text-gray-700">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (node: any, children: any) => (
      <li>{children}</li>
    ),
    [BLOCKS.QUOTE]: (node: any, children: any) => (
      <blockquote className="border-l-4 border-green-500 pl-4 py-2 mb-4 italic text-gray-600 bg-green-50">
        {children}
      </blockquote>
    ),
    [BLOCKS.HR]: () => <hr className="border-gray-300 my-8" />,
    [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
      const asset = node.data.target
      if (asset?.fields?.file?.url) {
        const url = asset.fields.file.url.startsWith('//')
          ? `https:${asset.fields.file.url}`
          : asset.fields.file.url
        
        return (
          <div className="my-8">
            <Image
              src={url}
              alt={asset.fields.title || asset.fields.description || ''}
              width={asset.fields.file.details.image?.width || 800}
              height={asset.fields.file.details.image?.height || 600}
              className="rounded-lg shadow-md mx-auto"
            />
            {asset.fields.description && (
              <p className="text-sm text-gray-500 text-center mt-2">
                {asset.fields.description}
              </p>
            )}
          </div>
        )
      }
      return null
    },
    [INLINES.HYPERLINK]: (node: any, children: any) => {
      const url = node.data.uri
      
      // Check if it's an internal link
      if (url.startsWith('/')) {
        return (
          <Link href={url} className="text-green-600 hover:text-green-700 underline">
            {children}
          </Link>
        )
      }
      
      // External link
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-600 hover:text-green-700 underline"
        >
          {children}
        </a>
      )
    },
    [INLINES.ENTRY_HYPERLINK]: (node: any, children: any) => {
      // Handle links to other entries
      return (
        <Link href="#" className="text-green-600 hover:text-green-700 underline">
          {children}
        </Link>
      )
    },
  },
}

export default function RichTextRenderer({ document }: RichTextRendererProps) {
  return <div className="prose max-w-none">{documentToReactComponents(document, options)}</div>
}