import { cn } from "@/lib/utils";
import { Clock, Eye } from "lucide-react";

interface NewsPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  publishedAt?: string; // made optional
  readTime?: string;
  views?: number; // made optional
}

interface NewsCardProps {
  post: NewsPost;
  variant?: "hero" | "large" | "medium" | "small";
  className?: string;
}

export const NewsCard = ({ post, variant = "medium", className }: NewsCardProps) => {
  const isHero = variant === "hero";
  const isLarge = variant === "large";
  const isSmall = variant === "small";

  // Safe image fallback
  const safeImage = post.image && post.image.trim() !== "" ? post.image : "/no-image.jpg";

  // Safely format views count
  const viewsDisplay =
    typeof post.views === "number" ? post.views.toLocaleString() : "0";

  // Safely format published date
  const dateDisplay = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString()
    : "";

  // Safe readTime
  const readTimeDisplay = post.readTime ?? "";

  return (
    <article
      className={cn(
        "group cursor-pointer transition-all duration-300 hover:transform hover:scale-[1.02]",
        {
          "relative overflow-hidden rounded-lg": isHero,
          "bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md": !isHero,
        },
        className
      )}
    >
      {isHero ? (
        <div className="relative h-[400px] bg-hero rounded-lg overflow-hidden">
          <img
            src={safeImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-hero-foreground">
            <div className="inline-block bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-medium mb-3">
              {post.category}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
              {post.title}
            </h1>
            <p className="text-gray-200 mb-4 text-sm md:text-base line-clamp-2">
              {post.excerpt}
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-300">
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{readTimeDisplay}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-3 w-3" />
                <span>{viewsDisplay}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={cn("flex", { "flex-col": !isSmall, "flex-row space-x-3": isSmall })}>
          <div
            className={cn("relative overflow-hidden", {
              "h-48": isLarge,
              "h-32": variant === "medium",
              "w-20 h-16 flex-shrink-0": isSmall,
            })}
          >
            <img
              src={safeImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className={cn("p-4", { "flex-1": isSmall })}>
            <div className="flex items-center justify-between mb-2">
              <span className="inline-block bg-accent/10 text-accent px-2 py-1 rounded text-xs font-medium">
                {post.category}
              </span>
              <span className="text-xs text-muted-foreground">
                {dateDisplay}
              </span>
            </div>
            <h3
              className={cn(
                "font-semibold leading-tight mb-2 group-hover:text-accent transition-colors",
                {
                  "text-lg": isLarge,
                  "text-base": variant === "medium",
                  "text-sm": isSmall,
                }
              )}
            >
              {post.title}
            </h3>
            {!isSmall && (
              <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                {post.excerpt}
              </p>
            )}
            <div className="flex items-center space-x-3 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{readTimeDisplay}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-3 w-3" />
                <span>{viewsDisplay}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};
