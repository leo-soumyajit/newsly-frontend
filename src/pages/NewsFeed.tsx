import { Navigation } from "@/components/Navigation";
import { NewsCard } from "@/components/NewsCard";
import { LiveMatches } from "@/components/LiveMatches";
import { TrendingNews } from "@/components/TrendingNews";
import { mockNewsData } from "@/data/mockNews";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const NewsFeed = () => {
  const heroPost = mockNewsData[0];
  const featuredPosts = mockNewsData.slice(1, 4);
  const recentPosts = mockNewsData.slice(4, 8);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Create Post Button - Fixed Position */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button asChild size="lg" className="rounded-full shadow-lg">
          <Link to="/create-post">
            <Plus className="h-5 w-5 mr-2" />
            Create Post
          </Link>
        </Button>
      </div>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Hero Section */}
            <div className="mb-8">
              <NewsCard post={heroPost} variant="hero" />
            </div>

            {/* Trending News */}
            <TrendingNews posts={featuredPosts} />

            {/* Featured News Grid */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Featured News</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recentPosts.map((post) => (
                  <NewsCard key={post.id} post={post} variant="medium" />
                ))}
              </div>
            </section>

            {/* All News Grid */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">All News</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockNewsData.slice(8).map((post) => (
                  <NewsCard key={post.id} post={post} variant="large" />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <LiveMatches />
              
              {/* Top Story */}
              <div className="bg-card rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-foreground mb-4">Top Story</h3>
                <NewsCard post={mockNewsData[5]} variant="small" />
              </div>

              {/* Recent News */}
              <div className="bg-card rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-foreground mb-4">Recent News</h3>
                <div className="space-y-4">
                  {mockNewsData.slice(-3).map((post) => (
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

export default NewsFeed;