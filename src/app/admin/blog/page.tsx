"use client";

import { useState } from "react";
import { AdminTitle } from "@/components/admin/admin-title";
import { SectionTitle } from "@/components/admin/section-title";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Mock blog posts data
const mockPosts = [
  {
    id: "1",
    title: "The Future of Remote Device Management",
    slug: "future-of-remote-device-management",
    excerpt: "Explore how AI, automation, and advanced security are transforming remote device management for enterprises.",
    status: "published",
    author: "Alex Johnson",
    category: "Technology",
    publishedAt: "2023-06-15T00:00:00.000Z",
    views: 1245,
    comments: 8
  },
  {
    id: "2",
    title: "TeamViewer: The Ultimate Remote Access Solution",
    slug: "teamviewer-ultimate-remote-access",
    excerpt: "An in-depth look at TeamViewer's enterprise features and why it's the preferred choice for professional remote device management.",
    status: "published",
    author: "Sarah Chen",
    category: "Remote Access",
    publishedAt: "2023-05-22T00:00:00.000Z",
    views: 2890,
    comments: 15
  },
  {
    id: "3",
    title: "Securing Your Remote Access Infrastructure",
    slug: "securing-remote-access-infrastructure",
    excerpt: "Best practices for ensuring your remote access solutions are secure, compliant, and protected against emerging threats.",
    status: "published",
    author: "Michael Rodriguez",
    category: "Security",
    publishedAt: "2023-04-10T00:00:00.000Z",
    views: 1560,
    comments: 12
  },
  {
    id: "4",
    title: "Optimizing Remote Support for Enterprise Teams",
    slug: "optimizing-remote-support-enterprise",
    excerpt: "Strategies and tools to streamline remote support operations for large enterprise teams.",
    status: "draft",
    author: "Emily Watson",
    category: "Enterprise",
    publishedAt: null,
    views: 0,
    comments: 0
  },
  {
    id: "5",
    title: "The ROI of Integrated Remote Access Solutions",
    slug: "roi-integrated-remote-access",
    excerpt: "How businesses are achieving significant ROI by implementing integrated remote access platforms like SPEAR.",
    status: "scheduled",
    author: "David Park",
    category: "Business",
    publishedAt: "2023-07-05T00:00:00.000Z",
    views: 0,
    comments: 0
  }
];

// Mock categories
const categories = [
  { name: "Technology", count: 12 },
  { name: "Security", count: 8 },
  { name: "Enterprise", count: 5 },
  { name: "Comparison", count: 4 },
  { name: "Business", count: 7 },
  { name: "Tutorial", count: 6 }
];

// Mock SEO keywords
const seoKeywords = [
  { keyword: "remote access", volume: 12500, difficulty: 67, cpc: 4.25 },
  { keyword: "teamviewer enterprise", volume: 8200, difficulty: 42, cpc: 3.80 },
  { keyword: "teamviewer security features", volume: 6700, difficulty: 38, cpc: 3.50 },
  { keyword: "remote device management", volume: 5400, difficulty: 51, cpc: 5.20 },
  { keyword: "secure remote access", volume: 9800, difficulty: 62, cpc: 6.10 }
];

export default function BlogAdminPage() {
  const [posts, setPosts] = useState(mockPosts);
  const [activeTab, setActiveTab] = useState("posts");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isNewPostDialogOpen, setIsNewPostDialogOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostExcerpt, setNewPostExcerpt] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("");

  // Filter posts based on search query and status filter
  const filteredPosts = posts.filter(post => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || post.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCreatePost = () => {
    if (!newPostTitle || !newPostExcerpt || !newPostCategory) {
      alert("Please fill in all required fields");
      return;
    }

    const slug = newPostTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newPost = {
      id: (posts.length + 1).toString(),
      title: newPostTitle,
      slug,
      excerpt: newPostExcerpt,
      status: "draft",
      author: "Current User",
      category: newPostCategory,
      publishedAt: null,
      views: 0,
      comments: 0
    };

    setPosts([newPost, ...posts]);
    setNewPostTitle("");
    setNewPostExcerpt("");
    setNewPostCategory("");
    setIsNewPostDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <AdminTitle
        title="Blog Management"
        description="Create and manage blog content with SEO optimization"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-2 flex-1">
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="sm:max-w-xs"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="sm:w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Dialog open={isNewPostDialogOpen} onOpenChange={setIsNewPostDialogOpen}>
              <DialogTrigger asChild>
                <Button>Create New Post</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Blog Post</DialogTitle>
                  <DialogDescription>
                    Create a new blog post draft. You can edit and publish it later.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="post-title">Post Title</Label>
                    <Input
                      id="post-title"
                      placeholder="Enter post title"
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="post-excerpt">Excerpt</Label>
                    <Textarea
                      id="post-excerpt"
                      placeholder="Enter a brief excerpt"
                      value={newPostExcerpt}
                      onChange={(e) => setNewPostExcerpt(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="post-category">Category</Label>
                    <Select value={newPostCategory} onValueChange={setNewPostCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.name} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label>SEO Keywords (Optional)</Label>
                    <Input placeholder="Enter keywords separated by commas" />
                    <p className="text-xs text-muted-foreground">
                      Adding relevant keywords will help with search engine optimization.
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewPostDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreatePost}>Create Draft</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p>{post.title}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-xs">
                          {post.excerpt}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{post.author}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{post.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        post.status === "published" ? "default" :
                        post.status === "draft" ? "secondary" :
                        "outline"
                      }>
                        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell>{post.views.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                        {post.status === "draft" && (
                          <Button variant="ghost" size="sm">Publish</Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredPosts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      <p className="text-muted-foreground">No posts found matching your filters</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => setIsNewPostDialogOpen(true)}
                      >
                        Create Your First Post
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <SectionTitle
            title="Blog Categories"
            description="Manage categories for organizing blog content"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card key={category.name}>
                <CardHeader className="pb-2">
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>{category.count} posts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${(category.count / 12) * 100}%` }}
                    ></div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="ghost" size="sm">Edit</Button>
                  <Button variant="ghost" size="sm">View Posts</Button>
                </CardFooter>
              </Card>
            ))}

            <Card className="border-dashed">
              <CardHeader className="pb-2">
                <CardTitle>Create Category</CardTitle>
                <CardDescription>Add a new blog category</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center py-6">
                <Button variant="outline">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M12 5v14M5 12h14"></path>
                  </svg>
                  Add Category
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comments" className="space-y-6">
          <SectionTitle
            title="Blog Comments"
            description="Manage and moderate user comments"
          />

          <div className="bg-card rounded-lg border p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Comment Management</h3>
            <p className="text-muted-foreground mb-6">
              Comment management features will be displayed here.
            </p>
            <Button>View Comments</Button>
          </div>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <SectionTitle
            title="SEO Optimization"
            description="Optimize blog content for search engines"
          />

          <Card>
            <CardHeader>
              <CardTitle>Keyword Analysis</CardTitle>
              <CardDescription>
                Track performance of target keywords
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Keyword</TableHead>
                      <TableHead>Search Volume</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead>CPC</TableHead>
                      <TableHead>Articles</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {seoKeywords.map((keyword) => (
                      <TableRow key={keyword.keyword}>
                        <TableCell className="font-medium">{keyword.keyword}</TableCell>
                        <TableCell>{keyword.volume.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden mr-2">
                              <div
                                className={`h-full ${
                                  keyword.difficulty < 40 ? "bg-green-500" :
                                  keyword.difficulty < 60 ? "bg-amber-500" :
                                  "bg-red-500"
                                }`}
                                style={{ width: `${keyword.difficulty}%` }}
                              ></div>
                            </div>
                            <span>{keyword.difficulty}/100</span>
                          </div>
                        </TableCell>
                        <TableCell>${keyword.cpc.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">3 articles</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Analyze</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Add Keyword</Button>
              <Button>Run SEO Analysis</Button>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Optimization</CardTitle>
                <CardDescription>
                  AI-powered content optimization suggestions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Content Score</span>
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                      <span className="font-medium">72/100</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Readability Score</span>
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                      <span className="font-medium">Good</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Keyword Density</span>
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                      <span className="font-medium">Needs Improvement</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Meta Descriptions</span>
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                      <span className="font-medium">Missing (2)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Optimize Content</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO Performance</CardTitle>
                <CardDescription>
                  Track search engine performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-muted rounded-md">
                  <p className="text-muted-foreground">SEO performance chart would be displayed here</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <span className="text-sm text-muted-foreground">Last updated: Today</span>
                <Button variant="outline">Refresh Data</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <SectionTitle
        title="Content Calendar"
        description="Plan and schedule upcoming blog content"
      />

      <Card>
        <CardHeader>
          <CardTitle>Content Schedule</CardTitle>
          <CardDescription>
            Upcoming and scheduled blog posts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center bg-muted rounded-md">
            <p className="text-muted-foreground">Content calendar would be displayed here</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">View Calendar</Button>
          <Button>Schedule Post</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
