import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "@shared/schema";
import { AuthProvider } from "@/hooks/useAuth";
import { Helmet } from "react-helmet";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BLOG_CATEGORIES } from "@/lib/constants";
import { Search } from "lucide-react";
import BlogCard from "@/components/common/BlogCard";

const BlogContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery<{ success: boolean; data: BlogPost[] }>({
    queryKey: ["/api/blog-posts", { category: selectedCategory }],
  });

  const blogPosts = data?.data || [];

  // Filter posts based on search term
  const filteredPosts = blogPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Blog | SoulSyync</title>
        <meta name="description" content="Explore spiritual insights and practical wisdom for your daily life in our blog." />
      </Helmet>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-heading font-bold text-slate-800">Our Spiritual Blog</h1>
            <p className="mt-4 max-w-2xl text-xl text-slate-600 mx-auto">
              Explore spiritual insights and practical wisdom for your daily life.
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-80"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-center sm:justify-start">
              <Button
                variant={selectedCategory === null ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {BLOG_CATEGORIES.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-12">
            {isLoading ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-6 space-y-4">
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
                ))}
              </div>
            ) : error ? (
              <div className="text-center text-red-500">
                <p>Failed to load blog posts. Please try again later.</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-600">No blog posts found</h3>
                <p className="mt-2 text-gray-500">
                  {searchTerm ? 
                    "Try adjusting your search term or clear filters to see more content." :
                    "Check back soon for new articles!"
                  }
                </p>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.map(post => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

const Blog = () => {
  return (
    <AuthProvider>
      <BlogContent />
    </AuthProvider>
  );
};

export default Blog;
