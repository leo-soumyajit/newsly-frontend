import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@/context/ThemeContext";
import HomePage from "./pages/HomePage";
import NewsFeed from "./pages/NewsFeed";
import CategoryPage from "./pages/CategoryPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import CreatePost from "./pages/CreatePost";
import PostDetails from "./pages/PostDetails";
import NotFound from "./pages/NotFound";
import Footer from "@/components/Footer";
// ⬇ import the profile page component
import Profile from "./components/Profile";

const queryClient = new QueryClient();
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HelmetProvider>
        <ThemeProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/news" element={<NewsFeed />} />
              <Route path="/news/:category" element={<CategoryPage />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/posts/:postId" element={<PostDetails />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </BrowserRouter>
        </ThemeProvider>
      </HelmetProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;