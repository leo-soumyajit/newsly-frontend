import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import HomePage from "./pages/HomePage";
import NewsFeed from "./pages/NewsFeed";
import CategoryPage from "./pages/CategoryPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import CreatePost from "./pages/CreatePost";
import PostDetails from "./pages/PostDetails";
import NotFound from "./pages/NotFound";
import Footer from "@/components/Footer"; // Adjust import as needed

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HelmetProvider>
        <BrowserRouter>
          <Routes>
            {/* Home/news */}
            <Route path="/" element={<HomePage />} />
            <Route path="/news" element={<NewsFeed />} />

            {/* Dynamic category route */}
            {/* Matches: /news/sports, /news/tech, /news/education etc. */}
            <Route path="/news/:category" element={<CategoryPage />} />

            {/* Auth */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Post create */}
            <Route path="/create-post" element={<CreatePost />} />

            {/* Post Details */}
            <Route path="/posts/:postId" element={<PostDetails />} />

            {/* Not found / catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </HelmetProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
