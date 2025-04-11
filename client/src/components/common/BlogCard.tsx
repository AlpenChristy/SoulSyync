import { Link } from "wouter";
import { BlogPost } from "@shared/schema";
import { formatDate, getInitials, truncateText } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  // Strip HTML tags and truncate the content for preview
  const plainTextContent = post.content.replace(/<[^>]*>/g, '');
  
  return (
    <article className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="md:flex">
        <div className="md:flex-shrink-0">
          <img 
            className="h-48 w-full object-cover md:w-48" 
            src={`/api/blog-posts/${post.id}/image`}  
            alt={post.title}
          />
        </div>
        <div className="p-6">
          <div className="flex items-center">
            <Badge variant="outline" className="text-primary-600 bg-primary-50 border-primary-200">
              {post.category}
            </Badge>
            {post.featured && (
              <Badge className="ml-2 bg-accent-500 hover:bg-accent-600">Featured</Badge>
            )}
          </div>
          <Link href={`/blog/${post.id}`} className="block mt-2">
            <h3 className="text-lg font-heading font-semibold text-slate-800 hover:text-primary-600 transition-colors">
              {post.title}
            </h3>
          </Link>
          <p className="mt-2 text-slate-600 text-sm line-clamp-2">
            {truncateText(plainTextContent, 140)}
          </p>
          <div className="mt-4 flex items-center">
            <div className="flex-shrink-0">
              <span className="sr-only">Author</span>
              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-xs text-primary-600 font-semibold">
                  {/* {post.authorId === 1 ? "SA" : getInitials("Author")} */}
                  {/* {post.aaauthorName} */}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-800">
                {/* {post.authorId === 1 ? "SoulSyync Admin" : "Author"} */}
                {post.aaauthorName}
              </p>
              <div className="flex space-x-1 text-sm text-slate-500">
                <time dateTime={post.publishedAt.toString()}>{formatDate(post.publishedAt)}</time>
                <span aria-hidden="true">&middot;</span>
                <span>{Math.ceil(plainTextContent.length / 1000)} min read</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
