// Client-safe utility for handling Contentful image URLs
export function getImageUrl(asset: any): string {
  if (!asset?.fields?.file?.url) return ''
  
  let url = asset.fields.file.url
  
  // Ensure URL has protocol
  if (url.startsWith('//')) {
    url = `https:${url}`
  }
  
  return url
}