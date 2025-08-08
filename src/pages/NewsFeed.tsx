import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { NewsCard } from "@/components/NewsCard";
import { LiveMatches } from "@/components/LiveMatches";
import { TrendingNews } from "@/components/TrendingNews";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { fetchAllPosts } from "@/utils/api";
import { NewsFeedSkeleton } from "@/components/NewsFeedSkeleton";

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getFeaturedBlocks(list: any[], blockCount: number = 2) {
  const blocks = [];
  let idx = 4;
  for (let b = 0; b < blockCount; b++) {
    const big = list[idx];
    const small = list.slice(idx + 1, idx + 5);
    if (!big) break;
    blocks.push({ big, smalls: small });
    idx += 5;
  }
  return blocks;
}

function getRandomIndex(length: number) {
  return Math.floor(Math.random() * length);
}

const HIGHLIGHT_YELLOW = "rgb(234,255,0)";
const SIDEBAR_CARD_HEIGHT = 88;
const SIDEBAR_CARD_IMG = 56;
const TITLE_FONT = "1.02rem";
const TITLE_WEIGHT = 600;

const NewsFeed = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllPosts()
      .then((data) => setPosts(shuffleArray(data)))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <NewsFeedSkeleton />;
  if (posts.length === 0) return <div>No posts available.</div>;

  const heroPost = posts[0];
  const trendingPosts = posts.length > 1 ? posts.slice(1, 4) : [];
  const featuredBlocks = getFeaturedBlocks(posts, 2);
  const totalFeatured = featuredBlocks.length * 5;
  const allPosts = posts.slice(4 + totalFeatured);
  const topStory = posts.length > 5 ? posts[5] : heroPost;
  const recentPosts = posts.length >= 3 ? posts.slice(-3) : posts;
  const highlightRecentIdx = getRandomIndex(recentPosts.length);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

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
          <div className="lg:col-span-3">
            {/* Hero Post */}
            <div className="mb-8">
              <Link to={`/posts/${heroPost.id}`} className="block">
                <NewsCard post={heroPost} variant="hero" />
              </Link>
            </div>

            {/* Trending */}
            <TrendingNews
              posts={trendingPosts.map((post) => ({
                ...post,
                link: `/posts/${post.id}`,
              }))}
            />

            {/* Featured */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-6 font-libertinus">
                Featured News
              </h2>
              <div className="space-y-10">
                {featuredBlocks.map((block, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 md:grid-cols-5 gap-6 items-stretch"
                  >
                    <div className="col-span-1 md:col-span-2 flex flex-col h-full">
                      <Link to={`/posts/${block.big.id}`} className="block h-full">
                        <NewsCard post={block.big} variant="large" className="h-full" />
                      </Link>
                      <div className="mt-1">
                        <Link
                          to={`/posts/${block.big.id}`}
                          className="text-sm font-semibold text-foreground leading-tight line-clamp-1 hover:underline font-libertinus"
                        >
                          {block.big.title}
                        </Link>
                      </div>
                    </div>
                    <div className="col-span-1 md:col-span-3 flex flex-col gap-3 justify-between">
                      {block.smalls.map(
                        (post: any) =>
                          post && (
                            <Link
                              key={post.id}
                              to={`/posts/${post.id}`}
                              className="block flex-row hover:underline"
                            >
                              <NewsCard post={post} variant="small" className="flex-row" />
                            </Link>
                          )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* All Posts */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6 font-libertinus">All News</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allPosts.map((post) => (
                  <Link key={post.id} to={`/posts/${post.id}`} className="block hover:underline">
                    <NewsCard post={post} variant="large" />
                  </Link>
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
                <h3 className="font-semibold text-foreground mb-4 font-libertinus">Top Story</h3>
                {topStory && (
                  <Link to={`/posts/${topStory.id}`} className="block">
                    <div
                      className="flex items-center gap-3 px-4 py-4 rounded-xl shadow"
                      style={{
                        background: HIGHLIGHT_YELLOW,
                        borderLeft: `7px solid ${HIGHLIGHT_YELLOW}`,
                        minHeight: SIDEBAR_CARD_HEIGHT,
                        maxHeight: SIDEBAR_CARD_HEIGHT,
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={topStory.image}
                        alt={topStory.title}
                        style={{
                          height: SIDEBAR_CARD_IMG,
                          width: SIDEBAR_CARD_IMG,
                          objectFit: "cover",
                          borderRadius: 14,
                          marginRight: 10,
                        }}
                        className="flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0 flex items-center">
                        <span
                          className="font-libertinus font-semibold text-foreground leading-tight truncate"
                          style={{
                            fontSize: TITLE_FONT,
                            fontWeight: TITLE_WEIGHT as any,
                            maxWidth: "98%",
                          }}
                          title={topStory.title}
                        >
                          {topStory.title}
                        </span>
                      </div>
                    </div>
                  </Link>
                )}
              </div>

              {/* Recent News */}
              <div className="bg-card rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-foreground mb-4 font-libertinus">Recent News</h3>
                <div className="space-y-4">
                  {recentPosts.map((post, idx) => {
                    const isHighlighted = idx === highlightRecentIdx;
                    if (!post) return null;
                    const cardStyles = {
                      minHeight: SIDEBAR_CARD_HEIGHT,
                      maxHeight: SIDEBAR_CARD_HEIGHT,
                      alignItems: "center",
                      ...(isHighlighted
                        ? {
                            background: HIGHLIGHT_YELLOW,
                            borderLeft: `7px solid ${HIGHLIGHT_YELLOW}`,
                          }
                        : {}),
                    };
                    return (
                      <Link
                        key={post.id}
                        to={`/posts/${post.id}`}
                        className={`flex items-center gap-3 px-4 py-4 rounded-xl shadow ${
                          isHighlighted ? "" : "border"
                        }`}
                        style={cardStyles}
                      >
                        <img
                          src={post.image}
                          alt={post.title}
                          style={{
                            height: SIDEBAR_CARD_IMG,
                            width: SIDEBAR_CARD_IMG,
                            objectFit: "cover",
                            borderRadius: 14,
                            marginRight: 10,
                          }}
                          className="flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0 flex items-center">
                          <span
                            className="font-libertinus font-semibold text-foreground leading-tight truncate"
                            style={{
                              fontSize: TITLE_FONT,
                              maxWidth: "98%",
                            }}
                            title={post.title}
                          >
                            {post.title}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
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
