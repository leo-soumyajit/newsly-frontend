import { NewsCard } from "./NewsCard";

interface NewsPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  publishedAt: string;
  readTime: string;
  views: number;
}

interface TrendingNewsProps {
  posts: NewsPost[];
}

export const TrendingNews = ({ posts }: TrendingNewsProps) => {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Trending News</h2>
        <div className="flex space-x-2">
          <button className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent hover:bg-accent hover:text-accent-foreground transition-colors">
            ←
          </button>
          <button className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground hover:bg-accent/80 transition-colors">
            →
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.slice(0, 3).map((post) => (
          <NewsCard key={post.id} post={post} variant="large" />
        ))}
      </div>
    </section>
  );
};  