import Image from 'next/image'
import Link from 'next/link'
import { Article } from '@/types/contentful'
import { getImageUrl } from '@/utils/imageUtils'

interface ArticleCardProps {
  article: Article
}

export default function ArticleCard({ article, size = 'medium' }: ArticleCardProps) {
  const { title, listImage, listImageAlt, slug, newSlug, metaDescription, publishedAt } = article.fields
  const articleSlug = newSlug || slug
  
  const imageUrl = listImage ? getImageUrl(listImage) : ''
  
  return (
    <article className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-brand-green group">
      <Link href={`/articles/${articleSlug}`} className="block">
        <div className="relative h-40 w-full overflow-hidden bg-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={listImageAlt || title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100">
              <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-brand-green text-white">
              Article
            </span>
            {publishedAt && (
              <time className="text-xs text-gray-500">
                {new Date(publishedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </time>
            )}
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-3 font-geograph group-hover:text-brand-green transition-colors leading-tight">
            {title}
          </h3>
          {metaDescription && (
            <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">
              {metaDescription}
            </p>
          )}
        </div>
      </Link>
    </article>
  )
}