import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { BlogPost as BlogPostType } from "@shared/schema";
import { AuthProvider } from "@/hooks/useAuth";
import { Helmet } from "react-helmet";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Calendar, User } from "lucide-react";

const BlogPostContent = () => {
  const { id } = useParams();
  const postId = parseInt(id);

  const { data, isLoading, error } = useQuery<{ success: boolean; data: BlogPostType }>({
    queryKey: [`/api/blog-posts/${postId}`],
  });

  const post = data?.data;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-10 w-3/4 mb-4" />
        <div className="flex items-center space-x-4 mb-8">
          <div className="flex items-center">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24 ml-2" />
          </div>
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-64 w-full mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-heading font-bold text-red-500">Error Loading Blog Post</h1>
        <p className="mt-4 text-gray-600">Sorry, we couldn't load this blog post. It may not exist or there was an error.</p>
        <Link href="/blog">
          <Button className="mt-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | SoulSyync Blog</title>
        <meta name="description" content={post.content.substring(0, 160).replace(/<[^>]*>/g, '')} />
      </Helmet>

      <article className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog">
            <Button variant="link" className="mb-6 pl-0 flex items-center text-primary-600">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to all articles
            </Button>
          </Link>

          <div className="mb-6">
            <span className="inline-block text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
              {post.category}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-800 mb-6">
            {post.title}
          </h1>
          
          <div className="flex items-center text-sm text-slate-500 mb-8">
            <div className="flex items-center mr-6">
              <User className="h-4 w-4 mr-2" />
              <span>Author Name</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
          </div>
          
          {post.imageUrl && (
            <div className="mb-8">
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          )}
          
          <div 
            className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-slate-800 prose-p:text-slate-600"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-heading font-semibold text-slate-800 mb-4">
              Share this article
            </h3>
            <div className="flex space-x-4">
              <Button variant="outline" size="sm">
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
                Facebook
              </Button>
              <Button variant="outline" size="sm">
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
                Twitter
              </Button>
              <Button variant="outline" size="sm">
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.418-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                </svg>
                LinkedIn
              </Button>
            </div>
          </div>
        </div>
      </article>
    </>
  );
};

const BlogPost = () => {
  return (
    <AuthProvider>
      <BlogPostContent />
    </AuthProvider>
  );
};

export default BlogPost;
