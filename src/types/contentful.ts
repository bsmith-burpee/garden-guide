import { Document } from '@contentful/rich-text-types'
import { Asset, Entry } from 'contentful'

export interface ContentfulAsset extends Asset {
  fields: {
    title: string
    description?: string
    file: {
      url: string
      details: {
        size: number
        image?: {
          width: number
          height: number
        }
      }
      fileName: string
      contentType: string
    }
  }
}

export interface ArticleFields {
  title: string
  body: Document
  publishedAt?: string
  featuredImage?: ContentfulAsset
  imageAlt?: string
  listImage?: ContentfulAsset
  listImageStandard?: ContentfulAsset
  listImageWide?: ContentfulAsset
  listImageAlt?: string
  slug: string
  newSlug?: string
  metaTitle?: string
  metaDescription?: string
}

export interface Article extends Entry<ArticleFields> {
  contentTypeId: 'article'
}

export interface RecipeFields {
  title: string
  body?: Document
  publishedAt?: string
  recipeIngredients?: Entry<IngredientFields>[]
  instructions?: string[]
  featuredImage?: ContentfulAsset
  imageAlt?: string
  listImage?: ContentfulAsset
  listImageStandard?: ContentfulAsset
  listImageWide?: ContentfulAsset
  listImageAlt?: string
  slug?: string
  newSlug?: string
  metaTitle?: string
  metaDescription?: string
}

export interface Recipe extends Entry<RecipeFields> {
  contentTypeId: 'recipe'
}

export interface IngredientFields {
  amount?: string
  ingredientName?: string
}

export interface Ingredient extends Entry<IngredientFields> {
  contentTypeId: 'ingredient'
}

export interface ProductFields {
  externalId?: string
  title: string
  externalUrl?: string
  slug?: string
  productId?: string
  media?: ContentfulAsset[]
  productSkus?: Entry<ProductSkuFields>[]
}

export interface Product extends Entry<ProductFields> {
  contentTypeId: 'product'
}

export interface ProductSkuFields {
  externalId?: string
  productName?: string
  productId: string
  itemType?: string
}

export interface ProductSku extends Entry<ProductSkuFields> {
  contentTypeId: 'productSku'
}

export interface ArticleStyleFields {
  articlestyle?: 'How To' | 'General Article'
}

export interface ArticleStyle extends Entry<ArticleStyleFields> {
  contentTypeId: 'articleStyle'
}

export type ContentfulEntry = Article | Recipe | Product | Ingredient | ProductSku | ArticleStyle