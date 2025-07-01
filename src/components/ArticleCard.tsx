import Image from 'next/image'
import Link from 'next/link'
import { Article } from '@/types/contentful'
import { getImageUrl } from '@/utils/imageUtils'

interface ArticleCardProps {
  article: Article
  size?: 'small' | 'medium' | 'large'
}

export default function ArticleCard({ article, size = 'medium' }: ArticleCardProps) {
  const { title, listImage, listImageAlt, slug, newSlug, metaDescription, publishedAt } = article.fields
  const articleSlug = newSlug || slug
  
  const imageUrl = listImage ? getImageUrl(listImage) : ''
  
  const sizeClasses = {
    small: 'max-w-sm',
    medium: 'max-w-md',
    large: 'max-w-lg'
  }
  
  return (
    <article className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${sizeClasses[size]}`}>
      <Link href={`/articles/${articleSlug}`}>
        {imageUrl && (
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={imageUrl}
              alt={listImageAlt || title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 font-geograph">
            {title}
          </h3>
          {metaDescription && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-3">
              {metaDescription}
            </p>
          )}
          {publishedAt && (
            <time className="text-xs text-gray-500">
              {new Date(publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          )}
        </div>
      </Link>
    </article>
  )
}