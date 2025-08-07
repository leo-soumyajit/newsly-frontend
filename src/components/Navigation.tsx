import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  { name: "All News", path: "/news" },
  { name: "Sports", path: "/news/sports" },
  { name: "Education", path: "/news/education" },
  { name: "Politics", path: "/news/politics" },
  { name: "India", path: "/news/india" },
  { name: "Foreign", path: "/news/foreign" },
  { name: "Health", path: "/news/health" },
  { name: "Tech", path: "/news/tech" },
];

export const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-lg">N</span>
            </div>
            <span className="text-xl font-bold text-foreground">NewsHub</span>
          </Link>

          {/* Categories */}
          <div className="hidden md:flex items-center space-x-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-accent",
                  location.pathname === category.path
                    ? "text-accent"
                    : "text-foreground"
                )}
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};