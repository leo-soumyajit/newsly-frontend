import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { NewsCard } from "@/components/NewsCard";
import { LiveMatches } from "@/components/LiveMatches";
import { NewsFeedSkeleton } from "@/components/NewsFeedSkeleton";

const categoryMap = [
  "sports", "education", "politics", "india", "foreign", "health", "tech",
];

const CategoryPage = () => {
  const { category } = useParams<{ category?: string }>();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let apiEndpoint;
    if (category && categoryMap.includes(category.toLowerCase())) {
      apiEndpoint = `http://localhost:8000/api/v1/posts/category/${category.toLowerCase()}`;
    } else {
      apiEndpoint = `http://localhost:8000/api/v1/posts`;
    }
    setLoading(true);
    fetch(apiEndpoint)
      .then((res) => res.json())
      .then((data) => {
        const srcData = data.data ?? data;
        const postsWithImage = srcData.map((post: any) => ({
          ...post,
          image:
            Array.isArray(post.images) && post.images.length > 0
              ? post.images[0]
              : "/no-image.jpg",
          publishedAt: post.createdAt || "",
          excerpt: post.description?.slice(0, 180) + "...",
          readTime: post.readTime || "2 min read",
          views: typeof post.views === "number" ? post.views : Math.floor(Math.random() * 4000 + 100),
        }));
        setPosts(postsWithImage);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [category]);

  // --- THIS IS THE REAL FACEBOOK-STYLE LOADER ---
  if (loading) return <NewsFeedSkeleton />;

  if (!posts.length) return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          No posts in {category ?? "this"} category.
        </h1>
      </main>
    </div>
  );

  const categoryTitle =
    category && category.toLowerCase() !== "all"
      ? category.charAt(0).toUpperCase() + category.slice(1)
      : "All News";

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content: Left 3 columns */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">{categoryTitle}</h1>
              <p className="text-muted-foreground">
                Latest updates from {categoryTitle.toLowerCase()}
              </p>
            </div>

            {/* Hero Post - WRAP in Link */}
            {posts.length > 0 && (
              <div className="mb-8">
                <Link to={`/posts/${posts[0].id}`}>
                  <NewsCard post={posts[0]} variant="hero" />
                </Link>
              </div>
            )}

            {/* Posts Grid - WRAP in Link */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.slice(1, 7).map((post) => (
                <Link key={post.id} to={`/posts/${post.id}`} className="block hover:underline">
                  <NewsCard post={post} variant="large" />
                </Link>
              ))}
            </div>

            {/* Featured posts section if more than 7 - WRAP in Link */}
            {posts.length > 7 && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  More {categoryTitle}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {posts.slice(7, 11).map((post) => (
                    <Link key={post.id} to={`/posts/${post.id}`} className="block hover:underline">
                      <NewsCard post={post} variant="medium" />
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar: Right column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <LiveMatches />
              {/* Recent News */}
              <div className="bg-card rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-foreground mb-4">Recent News</h3>
                <div className="space-y-4">
                  {posts.slice(-4).map((post) => (
                    <Link
                      key={post.id}
                      to={`/posts/${post.id}`}
                      className="flex items-center gap-4 rounded-md hover:bg-muted/60 transition group py-2 pr-2"
                    >
                      <div className="relative h-16 w-24 min-w-[6rem] rounded-md overflow-hidden bg-muted">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                          style={{ aspectRatio: "2/1" }}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm text-foreground line-clamp-2 group-hover:text-accent">{post.title}</div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span>
                            {typeof post.views === "number"
                              ? post.views.toLocaleString()
                              : "0"}{" "}
                            views
                          </span>
                          <span>•</span>
                          <span>
                            {post.publishedAt
                              ? new Date(post.publishedAt).toLocaleDateString()
                              : ""}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              {/* /Recent News */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CategoryPage;
