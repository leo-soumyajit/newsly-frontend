import heroTennis from "@/assets/hero-tennis.jpg";
import footballNews from "@/assets/football-news.jpg";
import cricketNews from "@/assets/cricket-news.jpg";
import techNews from "@/assets/tech-news.jpg";

export interface NewsPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  publishedAt: string;
  readTime: string;
  views: number;
}

export const mockNewsData: NewsPost[] = [
  {
    id: "1",
    title: "Injuries helped redefine Tormo's relationship with tennis - report",
    excerpt: "Professional tennis player shares insights on how injuries shaped their career and mental approach to the game, leading to a new perspective on competitive sports.",
    image: heroTennis,
    category: "Sports",
    publishedAt: "2h ago",
    readTime: "3 min read",
    views: 12400
  },
  {
    id: "2", 
    title: "Ronaldo scores rare big games to make Swafi move",
    excerpt: "The football legend continues to make headlines with spectacular performances in crucial matches, showcasing why he remains one of the sport's greatest players.",
    image: footballNews,
    category: "Sports",
    publishedAt: "4h ago",
    readTime: "2 min read",
    views: 8900
  },
  {
    id: "3",
    title: "German soccer mourns teenager's death after youth match",
    excerpt: "The football community comes together to mourn the tragic loss of a young player, highlighting important discussions about player safety and support systems.",
    image: footballNews,
    category: "Sports", 
    publishedAt: "1h ago",
    readTime: "3 min read",
    views: 15600
  },
  {
    id: "4",
    title: "Golf Suites entertainment venue coming to Ogletree",
    excerpt: "New entertainment complex brings modern golf experience to the community with state-of-the-art facilities and innovative playing experiences.",
    image: cricketNews,
    category: "Sports",
    publishedAt: "6h ago", 
    readTime: "2 min read",
    views: 5200
  },
  {
    id: "5",
    title: "Tennis: Djokovic blasts disrespectful French Open crowd",
    excerpt: "The tennis star speaks out about crowd behavior during his recent matches, calling for more respect and sportsmanship from spectators.",
    image: heroTennis,
    category: "Sports",
    publishedAt: "3h ago",
    readTime: "4 min read", 
    views: 18900
  },
  {
    id: "6",
    title: "No stone is left unturned in the Wallabies pursuit",
    excerpt: "Behind the scenes look at the intensive preparation and training methods used by the national rugby team in their quest for excellence.",
    image: cricketNews,
    category: "Sports",
    publishedAt: "5h ago",
    readTime: "5 min read",
    views: 7300
  },
  {
    id: "7",
    title: "Tech Giants Announce Revolutionary AI Partnership",
    excerpt: "Major technology companies collaborate on groundbreaking artificial intelligence initiatives that could reshape the industry landscape.",
    image: techNews,
    category: "Tech",
    publishedAt: "2h ago",
    readTime: "6 min read",
    views: 22100
  },
  {
    id: "8",
    title: "Education Reform Bill Passes First Reading",
    excerpt: "New legislation aims to modernize the education system with increased funding for technology and teacher training programs.",
    image: techNews,
    category: "Education", 
    publishedAt: "4h ago",
    readTime: "4 min read",
    views: 9800
  },
  {
    id: "9",
    title: "Election Campaign Intensifies in Key States", 
    excerpt: "Political candidates ramp up their efforts as election day approaches, with focus on swing states and voter turnout strategies.",
    image: techNews,
    category: "Politics",
    publishedAt: "1h ago",
    readTime: "3 min read", 
    views: 16700
  },
  {
    id: "10",
    title: "India's Economic Growth Exceeds Expectations",
    excerpt: "Latest economic data shows stronger than predicted growth, driven by technology sector expansion and infrastructure investments.",
    image: techNews,
    category: "India",
    publishedAt: "6h ago",
    readTime: "5 min read",
    views: 11200
  },
  {
    id: "11", 
    title: "International Climate Summit Reaches Agreement",
    excerpt: "World leaders finalize new environmental accords aimed at reducing global carbon emissions and promoting sustainable development.",
    image: heroTennis,
    category: "Foreign",
    publishedAt: "8h ago",
    readTime: "7 min read",
    views: 28500
  },
  {
    id: "12",
    title: "Breakthrough in Cancer Treatment Research",
    excerpt: "Scientists announce promising results from clinical trials of new immunotherapy treatments showing significant improvement in patient outcomes.", 
    image: techNews,
    category: "Health",
    publishedAt: "3h ago",
    readTime: "4 min read",
    views: 19400
  }
];

export const getPostsByCategory = (category: string): NewsPost[] => {
  if (category.toLowerCase() === 'all') return mockNewsData;
  return mockNewsData.filter(post => 
    post.category.toLowerCase() === category.toLowerCase()
  );
};