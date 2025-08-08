import { Link } from "react-router-dom";
// import { Logo } from "@/components/Logo"; // If you have a logo component
import {
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  Mail,
  Phone,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border text-muted-foreground">
      <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row justify-between gap-12">
        {/* Brand & About */}
        <div className="flex flex-col space-y-4 md:flex-1">
          <Link to="/" className="flex items-center space-x-3">
            {/* Replace with your logo */}
            {/* <Logo className="h-10 w-10 text-primary" /> */}
            <span className="font-extrabold text-xl text-foreground select-none">NewsHub</span>
          </Link>
          <p className="max-w-sm leading-relaxed">
            Bringing you the latest stories, insights, and reports from around the world, all in one place.
          </p>

          <div className="flex space-x-6">
            {/* Social icons */}
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="hover:text-primary transition-colors">
              <Twitter className="w-6 h-6" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-primary transition-colors">
              <Facebook className="w-6 h-6" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-primary transition-colors">
              <Linkedin className="w-6 h-6" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-primary transition-colors">
              <Instagram className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col space-y-6 md:flex-1 md:flex-row md:space-y-0 md:space-x-20">
          <div>
            <h3 className="text-foreground font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/news" className="hover:text-primary transition-colors">News Feed</Link>
              </li>
              <li>
                <Link to="/news/sports" className="hover:text-primary transition-colors">Sports</Link>
              </li>
              <li>
                <Link to="/news/tech" className="hover:text-primary transition-colors">Tech</Link>
              </li>
              <li>
                <Link to="/news/health" className="hover:text-primary transition-colors">Health</Link>
              </li>
              <li>
                <Link to="/create-post" className="hover:text-primary transition-colors">Create Post</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-foreground font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/signin" className="hover:text-primary transition-colors">Sign In</Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-primary transition-colors">Sign Up</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact info - optional */}
        <div className="flex flex-col space-y-4 md:flex-1 max-w-xs">
          <h3 className="text-foreground font-semibold mb-4">Contact Us</h3>
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-primary" />
            <span>+1 (555) 123-4567</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            <span>support@newshub.com</span>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            &copy; {new Date().getFullYear()} NewsHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
