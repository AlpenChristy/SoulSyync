import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { BlogPost } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import BlogCard from "@/components/common/BlogCard";

const BlogPreview = () => {
  const { data, isLoading, error } = useQuery<{ success: boolean; data: BlogPost[] }>({
    queryKey: ["/api/blog-posts", { featured: true }],
  });

  console.log("BlogPreview - API response:", data);
  console.log("BlogPreview - Query params:", { featured: true });
  
  const blogPosts = data?.data || [];
  console.log("BlogPreview - Parsed blog posts:", blogPosts);

  return (
    <div className="lg:w-1/2 mt-12 lg:mt-0">
      <h2 className="text-2xl font-heading font-bold text-slate-800">Latest From Our Blog</h2>
      <p className="mt-2 text-slate-600">Explore spiritual insights and practical wisdom for your daily life.</p>
      
      {isLoading ? (
        <div className="mt-6 space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="md:flex">
                <Skeleton className="h-48 w-full md:w-48" />
                <div className="p-6 w-full space-y-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <div className="flex items-center">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="ml-3 space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="mt-6 text-center text-red-500">
          <p>Failed to load blog posts. Please try again later.</p>
        </div>
      ) : (
        <>
          <div className="mt-6 space-y-6">
            {blogPosts.slice(0, 2).map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
          
          <div className="text-center mt-6">
            <Link href="/blog">
              <Button variant="link" className="text-primary-600 hover:text-primary-700 inline-flex items-center gap-2">
                View all blog posts
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default BlogPreview;
