import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: 'l1yv9p7a',
  dataset: 'production',
  token: 'skfec8zSBxkfI5504Q1A0A28OKmXqQhip5A2pJY9F5AAukW8i3WT17TMjsRJiee3umEIbNpDfXSOXL1oRpzNX3tAzRxodSri3ImfTO1HqmnpycIEWoNamIUvYOC03jo3pDrSTHXxeDshCODxJFHMks9a66XZjNYVNLpbjRu05yOaUlt8xxqa',
  useCdn: true,
  apiVersion: '2025-07-23',
  perspective: 'published'
})

export interface SanityPost {
  _id: string
  title: string
  slug: {
    current: string
  }
  excerpt?: string
  publishedAt: string
  body?: any
  mainImage?: {
    asset: {
      url: string
    }
    alt: string
  }
  author?: {
    name: string
    image?: {
      asset: {
        url: string
      }
    }
  }
}

export const fetchPosts = async (): Promise<SanityPost[]> => {
  try {
    const posts = await sanityClient.fetch(`
      *[_type == "post"] | order(publishedAt desc) [0...6] {
        _id,
        title,
        slug,
        excerpt,
        publishedAt,
        "mainImage": mainImage{
          "asset": asset->{
            url
          },
          alt
        },
        "author": author->{
          name,
          "image": image{
            "asset": asset->{
              url
            }
          }
        }
      }
    `)
    return posts
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

export const fetchPostBySlug = async (slug: string): Promise<SanityPost | null> => {
  try {
    const post = await sanityClient.fetch(`
      *[_type == "post" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        excerpt,
        publishedAt,
        body,
        "mainImage": mainImage{
          "asset": asset->{
            url
          },
          alt
        },
        "author": author->{
          name,
          "image": image{
            "asset": asset->{
              url
            }
          }
        }
      }
    `, { slug })
    return post || null
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}