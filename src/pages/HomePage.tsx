import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Users, Edit3, TrendingUp, Globe } from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-hero to-hero/90 text-hero-foreground py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Your Stories,
              <span className="text-accent"> Your Voice</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-hero-foreground/90 leading-relaxed">
              Join thousands of creators sharing breaking news, insights, and stories that matter. 
              Be the journalist of your community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
                <Link to="/signup">
                  Start Creating <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 border-hero-foreground/30 text-hero-foreground hover:bg-hero-foreground hover:text-hero">
                <Link to="/signin">
                  Sign In
                </Link>
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 text-hero-foreground/70">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>10,000+ Creators</span>
              </div>
              <div className="flex items-center gap-2">
                <Edit3 className="h-5 w-5" />
                <span>50,000+ Stories</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                <span>Global Reach</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose NewsHub?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful tools and features to help you create, share, and discover amazing content
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                <Edit3 className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Easy Publishing</h3>
              <p className="text-muted-foreground">
                Create and publish your stories with our intuitive editor. Add images, format text, and categorize your content effortlessly.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Reach Your Audience</h3>
              <p className="text-muted-foreground">
                Get discovered by readers interested in your topics. Our categorization system helps connect you with the right audience.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Community Driven</h3>
              <p className="text-muted-foreground">
                Join a vibrant community of storytellers, journalists, and content creators from around the world.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Explore Categories</h2>
            <p className="text-xl text-muted-foreground">
              Discover content across various topics and interests
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { name: "Sports", path: "/news/sports", color: "bg-red-500" },
              { name: "Education", path: "/news/education", color: "bg-blue-500" },
              { name: "Politics", path: "/news/politics", color: "bg-purple-500" },
              { name: "India", path: "/news/india", color: "bg-orange-500" },
              { name: "Foreign", path: "/news/foreign", color: "bg-green-500" },
              { name: "Health", path: "/news/health", color: "bg-pink-500" },
              { name: "Tech", path: "/news/tech", color: "bg-indigo-500" }
            ].map((category) => (
              <Card key={category.name} className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer group">
                <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                  <span className="text-white font-bold text-lg">{category.name[0]}</span>
                </div>
                <h3 className="font-semibold text-foreground">{category.name}</h3>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-accent to-accent/90">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-accent-foreground mb-4">
            Ready to Share Your Story?
          </h2>
          <p className="text-xl text-accent-foreground/90 mb-8 max-w-2xl mx-auto">
            Join our community of creators and start publishing your content today. 
            Your voice matters, and the world is waiting to hear it.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
            <Link to="/signup">
              Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;