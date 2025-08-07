import { useParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { NewsCard } from "@/components/NewsCard";
import { LiveMatches } from "@/components/LiveMatches";
import { getPostsByCategory } from "@/data/mockNews";

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const posts = getPostsByCategory(category || "all");
  
  const categoryTitle = category 
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : "All News";

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">{categoryTitle}</h1>
              <p className="text-muted-foreground">Latest updates from {categoryTitle.toLowerCase()}</p>
            </div>

            {/* Hero Post */}
            {posts.length > 0 && (
              <div className="mb-8">
                <NewsCard post={posts[0]} variant="hero" />
              </div>
            )}

            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.slice(1, 7).map((post) => (
                <NewsCard key={post.id} post={post} variant="large" />
              ))}
            </div>

            {/* Featured News Section */}
            {posts.length > 7 && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold text-foreground mb-6">More {categoryTitle}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {posts.slice(7, 11).map((post) => (
                    <NewsCard key={post.id} post={post} variant="medium" />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <LiveMatches />
              
              {/* Recent News */}
              <div className="bg-card rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-foreground mb-4">Recent News</h3>
                <div className="space-y-4">
                  {posts.slice(-4).map((post) => (
                    <NewsCard key={post.id} post={post} variant="small" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CategoryPage;