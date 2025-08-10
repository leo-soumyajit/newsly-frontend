import { Link as RouterLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CountUp from "react-countup";
import { Link as ScrollLink } from "react-scroll";

import {
  ArrowRight, ArrowDown, Users, Edit3, TrendingUp, Globe, Newspaper, Rocket, Shield, Sparkles
} from "lucide-react";

const heroImage = "/newspaperImage.jpeg";
import cricketImg from "@/assets/cricket-news.jpg";
import footballImg from "@/assets/football-news.jpg";
import techImg from "@/assets/tech-news.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: i => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 * i, duration: 0.7, ease: [0.6, -0.05, 0.01, 0.99] }
  }),
};

const HomePage = () => {
  const canonical = typeof window !== "undefined"
    ? `${window.location.origin}${window.location.pathname}`
    : "https://newshub.example";

  return (
    <div className="flex flex-col min-h-screen bg-background scroll-smooth">
      <Helmet>
        <title>NewsHub — Your Stories, Your Voice</title>
        <meta
          name="description"
          content="NewsHub is a modern news platform to create and discover breaking news, analysis, and stories that matter."
        />
        <link rel="canonical" href={canonical} />
      </Helmet>

      {/* HERO */}
      <header className="relative h-screen w-full overflow-hidden flex items-center" id="hero">
        <motion.img
          src={heroImage}
          alt="NewsHub hero background"
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ objectPosition: "center", filter: "brightness(0.6)" }}
          initial={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
        />
        <div className="absolute inset-0 w-full h-full z-10 bg-gradient-to-b from-black/80 via-black/20 to-transparent" />
        
        <motion.div
          className="relative z-20 flex flex-col justify-center items-center h-full text-center w-full"
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg leading-tight"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            NewsHub: Your Stories,
            <span className="bg-gradient-to-r from-pink-500 to-yellow-500 bg-clip-text text-transparent animate-pulse"> Your Voice</span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-2xl text-white/85 mb-10 max-w-2xl mx-auto drop-shadow"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.10, duration: 0.7 }}
          >
            Create, curate, and consume news with a powerful, community-driven platform.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.20, duration: 0.5 }}
          >
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6 shadow-xl hover:scale-105 transition-transform"
            >
              <RouterLink to="/signup">
                Start Creating <ArrowRight className="ml-2 h-5 w-5" />
              </RouterLink>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-2 border-accent text-white bg-black/30 hover:bg-accent hover:text-white transition"
            >
              <RouterLink to="/news">Explore News</RouterLink>
            </Button>
          </motion.div>

          {/* Stats with CountUp */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-8 text-white/90 font-semibold"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.10 } }
            }}
          >
            {[
              [Users, 10000, "Creators"],
              [Edit3, 50000, "Stories"],
              [Globe, 120, "Countries"]
            ].map(([Icon, num, label], i) => (
              <motion.div
                key={label}
                variants={fadeUp}
                custom={i + 2}
                className="flex items-center gap-2"
              >
                <Icon className="h-5 w-5" />
                <span><CountUp end={num} duration={2.5} separator="," />+ {label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll Down Indicator */}
          <ScrollLink to="features" smooth={true} offset={-70} duration={600}>
            <ArrowDown className="mt-12 h-8 w-8 text-white animate-bounce cursor-pointer" />
          </ScrollLink>
        </motion.div>
      </header>

      {/* FEATURES */}
      <motion.section
        id="features"
        className="py-16 md:py-20 px-4 bg-gradient-to-b from-background via-muted/20 to-background"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <motion.div className="container mx-auto" variants={fadeUp} custom={0}>
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-4">Built for Modern News</h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Powerful tools for creators and a delightful reading experience for everyone.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Easy Publishing', desc: 'Compose rich stories with images, embeds, and categories.', Icon: Newspaper },
              { title: 'Grow Your Audience', desc: 'Get discovered by readers who love your topics.', Icon: TrendingUp },
              { title: 'Secure & Reliable', desc: 'Your content and identity are protected end-to-end.', Icon: Shield },
              { title: 'Blazing Fast', desc: 'Optimized for performance with smooth interactions.', Icon: Rocket }
            ].map(({ title, desc, Icon }, i) => (
              <motion.div key={title} variants={fadeUp} custom={i}>
                <Card className="p-6 bg-white/70 backdrop-blur-md border border-transparent hover:border-accent transition-all duration-300 hover:shadow-xl hover:scale-105">
                  <motion.div whileHover={{ rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Icon className="h-6 w-6 text-accent mb-4" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2">{title}</h3>
                  <p className="text-muted-foreground">{desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.section>

      {/* CATEGORIES */}
      <motion.section
        className="py-16 px-4 bg-muted/30"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
      >
        <div className="container mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-4xl font-bold">Explore Categories</h2>
              <p className="text-muted-foreground">Dive into topics you love, from sports to technology.</p>
            </div>
            <span className="hidden md:inline-flex items-center text-accent">
              <Sparkles className="mr-2 h-5 w-5" /> Curated for you
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Cricket', path: '/news/sports', image: cricketImg },
              { name: 'Football', path: '/news/sports', image: footballImg },
              { name: 'Technology', path: '/news/tech', image: techImg },
              { name: 'Top Stories', path: '/news', image: heroImage }
            ].map((cat, i) => (
              <motion.div key={cat.name} variants={fadeUp} custom={i}>
                <RouterLink to={cat.path} className="group">
                  <motion.article
                    className="relative overflow-hidden rounded-xl border bg-card text-card-foreground hover:shadow-2xl"
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <img
                      src={cat.image}
                      alt={`${cat.name} news`}
                      loading="lazy"
                      className="h-44 w-full object-cover transition-transform group-hover:scale-110 duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="text-lg font-semibold">{cat.name}</h3>
                      <p className="text-sm text-muted-foreground">Tap to explore</p>
                    </div>
                  </motion.article>
                </RouterLink>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        className="py-20 px-4 bg-gradient-to-r from-accent to-accent/90"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.5 }}
      >
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-accent-foreground mb-4">Ready to Share Your Story?</h2>
          <p className="text-lg md:text-xl text-accent-foreground/90 mb-8 max-w-2xl mx-auto">
            Join our community of creators and start publishing today. Your voice matters.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6 shadow-xl hover:scale-105 transition">
            <RouterLink to="/signup">Get Started <ArrowRight className="ml-2 h-5 w-5" /></RouterLink>
          </Button>
        </div>
      </motion.section>

      {/* FOOTER */}
      <footer className="py-10 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} NewsHub. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
