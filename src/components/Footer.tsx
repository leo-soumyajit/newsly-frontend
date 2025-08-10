import { Link } from "react-router-dom";
// import { Logo } from "@/components/Logo"; // If available, you may use a Logo component instead
import {
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  User,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border text-muted-foreground">
      <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row justify-between gap-12">
        {/* Brand & About */}
        <div className="flex flex-col space-y-6 md:flex-1 max-w-sm">
          <Link to="/" className="flex items-center space-x-4">
            <img
              src="/newsLogo.png"
              alt="NewsHub Logo"
              className="h-20 w-auto object-contain rounded-md shadow-sm"
            />
          </Link>
          <p className="leading-relaxed text-sm md:text-base">
            Bringing you the latest stories, insights, and reports from around the world, all in one place.
          </p>

          <div className="flex space-x-6 text-muted-foreground">
            {/* Social icons with hover effects */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
              className="hover:text-primary transition-colors"
            >
              <Twitter className="w-6 h-6" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="hover:text-primary transition-colors"
            >
              <Facebook className="w-6 h-6" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="hover:text-primary transition-colors"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="hover:text-primary transition-colors"
            >
              <Instagram className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col space-y-10 md:flex-1 md:flex-row md:space-y-0 md:space-x-24">
          <div>
            <h3 className="text-foreground font-semibold mb-5 text-lg">Explore</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/news" className="hover:text-primary transition-colors">
                  News Feed
                </Link>
              </li>
              <li>
                <Link to="/news/sports" className="hover:text-primary transition-colors">
                  Sports
                </Link>
              </li>
              <li>
                <Link to="/news/tech" className="hover:text-primary transition-colors">
                  Tech
                </Link>
              </li>
              <li>
                <Link to="/news/health" className="hover:text-primary transition-colors">
                  Health
                </Link>
              </li>
              <li>
                <Link to="/create-post" className="hover:text-primary transition-colors">
                  Create Post
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-foreground font-semibold mb-5 text-lg">Support</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/signin" className="hover:text-primary transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-primary transition-colors">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact info & Developer info */}
        <div className="flex flex-col space-y-5 md:flex-1 max-w-xs">
          <h3 className="text-foreground font-semibold mb-5 text-lg">Contact Us</h3>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="w-5 h-5 text-primary" />
            <a href="tel:+917908288829" className="hover:text-primary transition-colors">
              +91 79082 88829
            </a>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-5 h-5 text-primary" />
            <a href="mailto:thepeoplespress8@gmail.com" className="hover:text-primary transition-colors">
              thepeoplespress8@gmail.com
            </a>
          </div>

          {/* Developer Section */}
          <div className="mt-8 border-t border-border pt-6">
            <h3 className="text-foreground font-semibold mb-3 text-lg">Developer</h3>
            <div className="flex items-center space-x-3">
              {/* Clickable portfolio icon */}
              <a
                href="https://soumyajitbanerjeeportfolio.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Soumyajit Banerjee Portfolio"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                <User className="w-6 h-6" />
              </a>
              <div>
                <p className="font-semibold text-foreground">Soumyajit Banerjee</p>
                <p className="text-muted-foreground text-sm">Software Engineer</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-auto select-none">
            &copy; {new Date().getFullYear()} THE PEOPLE'S PRESS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
