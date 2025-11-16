import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchPosts, type SanityPost } from '@/lib/sanity'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import ModernHeader from '@/components/ModernHeader'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import SEO from '@/components/SEO'

const Blog = () => {
  const [posts, setPosts] = useState<SanityPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await fetchPosts()
        setPosts(fetchedPosts)
      } catch (error) {
        console.error('Failed to load posts:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

  if (loading) {
    return (
      <>
        <SEO 
          title="Blog - ContentFarm"
          description="Latest insights, tips, and stories from the world of SaaS video production"
        />
        <ModernHeader />
        <main className="min-h-screen pt-20 cinematic-section">
          <Breadcrumb />
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <Skeleton className="h-12 w-64 mx-auto mb-4" />
                <Skeleton className="h-6 w-96 mx-auto" />
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-48 w-full rounded-lg" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-4 w-20" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <SEO 
        title="Blog - ContentFarm"
        description="Latest insights, tips, and stories from the world of SaaS video production"
      />
      <ModernHeader />
      <main className="min-h-screen pt-20 cinematic-section">
        <Breadcrumb />
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="cinematic-gradient-text">Our Blog</span>
              </h1>
              <p className="text-xl text-gray-200 max-w-3xl mx-auto">
                Insights, tips, and stories from the world of SaaS video production
              </p>
            </div>
            
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No blog posts available yet.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <Link key={post._id} to={`/blog/${post.slug?.current || post._id}`}>
                    <Card className="group hover:shadow-lg transition-shadow duration-300 h-full cursor-pointer">
                      {post.mainImage && (
                        <div className="overflow-hidden rounded-t-lg">
                          <img
                            src={post.mainImage.asset.url}
                            alt={post.mainImage.alt || post.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </CardTitle>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="w-fit">
                            {new Date(post.publishedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </Badge>
                          {post.author && (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage 
                                  src={post.author.image?.asset.url} 
                                  alt={post.author.name} 
                                />
                                <AvatarFallback className="text-xs">
                                  {post.author.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-muted-foreground">{post.author.name}</span>
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      {post.excerpt && (
                        <CardContent>
                          <p className="text-muted-foreground line-clamp-3">
                            {post.excerpt}
                          </p>
                        </CardContent>
                      )}
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default Blog