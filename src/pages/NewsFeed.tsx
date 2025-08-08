import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { NewsCard } from "@/components/NewsCard";
import { LiveMatches } from "@/components/LiveMatches";
import { TrendingNews } from "@/components/TrendingNews";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { fetchAllPosts } from "@/utils/api";

// Shuffle posts each reload
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Helper: Chunk array for Featured News blocks
function getFeaturedBlocks(list: any[], blockCount: number = 2) {
  const blocks = [];
  let idx = 4; // skip first 4 posts (used for hero/trending)
  for (let b = 0; b < blockCount; b++) {
    // Each block is 1 big, 4 small (5 total)
    const big = list[idx];
    const small = list.slice(idx + 1, idx + 5); // 4 small
    if (!big) break;
    blocks.push({ big, smalls: small });
    idx += 5;
  }
  return blocks;
}

const NewsFeed = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllPosts()
      .then((data) => setPosts(shuffleArray(data)))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!posts.length) return <div>No posts available.</div>;

  // Slicing for all sections
  const heroPost = posts[0];
  const trendingPosts = posts.length > 1 ? posts.slice(1, 4) : [];
  const featuredBlocks = getFeaturedBlocks(posts, 2); // show 2 blocks (change to 1 for single)
  // Remove all posts used by Featured section from All News
  // Posts used: 1 (hero) + 3 (trending) + N*5 (blocks)
  const totalFeatured = featuredBlocks.length * 5;
  const allPosts = posts.slice(4 + totalFeatured);
  const topStory = posts.length > 5 ? posts[5] : heroPost;
  const recentPosts = posts.length >= 3 ? posts.slice(-3) : posts;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Create Post button fixed bottom-right */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button asChild size="lg" className="rounded-full shadow-lg">
          <Link to="/create-post" className="flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Create Post
          </Link>
        </Button>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Hero */}
            <div className="mb-8">
              <NewsCard post={heroPost} variant="hero" />
            </div>

            {/* Trending News */}
            <TrendingNews posts={trendingPosts} />

            {/* ------ FEATURED NEWS CUSTOM BLOCK LAYOUT ------ */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Featured News</h2>
              <div className="space-y-10">
                {featuredBlocks.map((block, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 md:grid-cols-5 gap-6 items-stretch"
                  >
                    {/* Left: One big post with small, truncated title below */}
                    <div className="col-span-1 md:col-span-2 flex flex-col h-full">
                      <NewsCard post={block.big} variant="large" className="h-full" />
                      <div className="mt-1">
                        <h3 className="text-sm font-semibold text-foreground leading-tight line-clamp-1">
                          {block.big.title}
                        </h3>
                      </div>
                    </div>
                    {/* Right: 4 small posts stacked */}
                    <div className="col-span-1 md:col-span-3 flex flex-col gap-3 justify-between">
                      {block.smalls.map(
                        (post: any, sidx: number) =>
                          post && (
                            <NewsCard
                              key={post.id}
                              post={post}
                              variant="small"
                              className="flex-row"
                            />
                          )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* All News section unchanged */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">All News</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allPosts.map((post) => (
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
                <NewsCard post={topStory} variant="small" />
              </div>

              {/* Recent News */}
              <div className="bg-card rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-foreground mb-4">Recent News</h3>
                <div className="space-y-4">
                  {recentPosts.map((post) => (
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
