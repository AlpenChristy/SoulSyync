import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { BlogPost, insertBlogPostSchema } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { BLOG_CATEGORIES } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/utils";
import { Plus, Pencil, Trash2 } from "lucide-react";

const BlogEditor = () => {
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Form schema extending the insert schema
  // const formSchema = insertBlogPostSchema.extend({
  //   id: z.number().optional(),
  //   imageUrl: z.string().nullable().optional().transform(val => val || ""),
  //   featured: z.boolean().nullable().optional().transform(val => Boolean(val)),
  // });

  const formSchema = insertBlogPostSchema
    .omit({ authorId: true }) // remove it from form-level validation
    .extend({
      id: z.number().optional(),
      imageUrl: z.string().nullable().optional().transform(val => val || ""),
      aaauthorName: z.string().min(1, "Author name is required"),
      featured: z.boolean().nullable().optional().transform(val => Boolean(val)),
    });



  type FormValues = z.infer<typeof formSchema>;

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      category: BLOG_CATEGORIES[0],
      imageUrl: "",
      featured: false,
    },
  });

  // Fetch all blog posts
  const { data, isLoading, refetch: refetchBlogPosts } = useQuery<{ success: boolean; data: BlogPost[] }>({
    queryKey: ["/api/blog-posts"],
  });

  const blogPosts = data?.data || [];

  // Create blog post mutation
  const createBlogPost = useMutation({
    mutationFn: async (formValues: FormValues) => {
      console.log("Creating blog post with values:", formValues);
      // const { user } = useAuth();
      const postData = {
        ...formValues,
        authorId: user?.id,
      };
      const res = await apiRequest("POST", "/api/blog-posts", postData);
      return res.json();
    },
    onSuccess: (data, variables) => {
      console.log("Blog post creation response:", data);
      if (data.success) {
        toast({
          title: "Success",
          description: "Blog post created successfully",
        });
        // Invalidate all blog-related queries to ensure UI updates
        queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });

        // Also invalidate specific queries that might be used elsewhere
        if (variables.featured) {
          queryClient.invalidateQueries({ queryKey: ["/api/blog-posts", { featured: true }] });
        }
        if (variables.category) {
          queryClient.invalidateQueries({ queryKey: ["/api/blog-posts", { category: variables.category }] });
        }

        form.reset();
        setIsCreating(false);

        // Manual refetch to ensure data is up to date
        refetchBlogPosts();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to create blog post",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      console.error("Error creating blog post:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  // Update blog post mutation
  const updateBlogPost = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!editingPostId) return null;
      const res = await apiRequest("PUT", `/api/blog-posts/${editingPostId}`, values);
      return res.json();
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast({
          title: "Success",
          description: "Blog post updated successfully",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
        form.reset();
        setEditingPostId(null);
      } else {
        toast({
          title: "Error",
          description: data?.message || "Failed to update blog post",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  // Delete blog post mutation
  const deleteBlogPost = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/blog-posts/${id}`, {});
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Success",
          description: "Blog post deleted successfully",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete blog post",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  // const onSubmit = (values: FormValues) => {
  //   if (editingPostId) {
  //     updateBlogPost.mutate(values);
  //   } else {
  //     createBlogPost.mutate(values);
  //   }
  // };


  const onSubmit = (values: FormValues) => {
    console.log("Form submitted with values:", values);

    if (editingPostId) {
      console.log("Updating post ID:", editingPostId);
      updateBlogPost.mutate(values);
    } else {
      console.log("Creating new blog post");
      createBlogPost.mutate(values);
    }
  };

  // Edit blog post
  const handleEditPost = (post: BlogPost) => {
    setEditingPostId(post.id);
    form.reset({
      title: post.title,
      content: post.content,
      category: post.category,
      imageUrl: post.imageUrl || "",
      featured: post.featured,
    });
    setIsCreating(true);
  };

  // Delete blog post with confirmation
  const handleDeletePost = (id: number) => {
    if (window.confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
      deleteBlogPost.mutate(id);
    }
  };

  // Reset form when cancelling
  const handleCancel = () => {
    form.reset();
    setEditingPostId(null);
    setIsCreating(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-heading font-semibold">Blog Management</h2>
        <Button
          onClick={() => setIsCreating(!isCreating)}
          variant={isCreating ? "outline" : "default"}
          className="flex items-center gap-1"
        >
          {isCreating ? "Cancel" : (
            <>
              <Plus className="h-4 w-4" />
              <span>New Post</span>
            </>
          )}
        </Button>
      </div>

      {isCreating ? (
        <Card>
          <CardHeader>
            <CardTitle>{editingPostId ? "Edit" : "Create"} Blog Post</CardTitle>
            <CardDescription>
              {editingPostId
                ? "Update the details of your existing blog post"
                : "Create a new blog post for your audience"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
                console.log("Validation errors:", errors);
              })} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a compelling title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="aaauthorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter author name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {BLOG_CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter an image URL" {...field} />
                      </FormControl>
                      <FormDescription>
                        Provide a URL to an image that represents your post
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your blog post content here..."
                          className="min-h-[300px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        You can use HTML tags for formatting
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Featured Post</FormLabel>
                        <FormDescription>
                          This post will be highlighted on the homepage
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createBlogPost.isPending || updateBlogPost.isPending}>
                    {(createBlogPost.isPending || updateBlogPost.isPending)
                      ? "Saving..."
                      : editingPostId ? "Update Post" : "Create Post"
                    }
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Blog Posts</CardTitle>
            <CardDescription>
              Manage your existing blog posts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading blog posts...</div>
            ) : blogPosts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No blog posts found</p>
                <Button
                  onClick={() => setIsCreating(true)}
                  className="mt-4"
                >
                  Create Your First Post
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {blogPosts.map(post => (
                  <div
                    key={post.id}
                    className="border rounded-md p-4 flex justify-between items-start"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{post.title}</h3>
                        {post.featured && (
                          <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {post.category} • {formatDate(post.publishedAt)}
                      </p>
                      <p className="text-sm mt-2 text-gray-700">
                        {post.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPost(post)}
                        className="flex items-center gap-1"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeletePost(post.id)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BlogEditor;
