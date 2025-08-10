import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Search, User, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

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

// Hook for live date/time
function useDateTime() {
  const [dateTime, setDateTime] = useState("");
  useEffect(() => {
    const update = () => {
      setDateTime(
        new Date().toLocaleString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };
    update();
    const intv = setInterval(update, 60000);
    return () => clearInterval(intv);
  }, []);
  return dateTime;
}

// Hook for weather
function useWeather() {
  const [weather, setWeather] = useState({
    city: "",
    temp: null as number | null,
    icon: "",
  });

  useEffect(() => {
    function fetchWeather(q: string) {
      fetch(
        `http://api.weatherstack.com/current?access_key=c1139fd7e9d67428e6e293cce603e6ea&query=${q}`
      )
        .then((res) => res.json())
        .then((data) => {
          setWeather({
            city: data.location?.name || "",
            temp: data.current?.temperature ?? null,
            icon: data.current?.weather_icons?.[0] || "",
          });
        })
        .catch(() => {
          setWeather({ city: "N/A", temp: null, icon: "" });
        });
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(`${pos.coords.latitude},${pos.coords.longitude}`),
        () => fetchWeather("New York")
      );
    } else {
      fetchWeather("New York");
    }
  }, []);

  return weather;
}

export const Navigation = () => {
  const location = useLocation();
  const dateTime = useDateTime();
  const weather = useWeather();

  // Dark mode state with localStorage persistence
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
      // Default to system preference
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  // Update <html> class and localStorage on darkMode change
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // state for holding the profile image
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // fetch profile once when navbar loads
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    fetch("http://localhost:8000/api/v1/user-profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfileImage(data?.data?.profileImage || null);
      })
      .catch(() => {
        setProfileImage(null);
      });
  }, []);

  // Logo src switch
  const logoSrc = darkMode ? "/newslogodark.png" : "/newsLogo.png";

  return (
    <nav className="bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        {/* --- TOP BAR --- */}
        <div className="flex items-center justify-between py-3">
          {/* Left: Date/Time stacked with Weather */}
          <div className="hidden md:flex flex-col items-start text-sm">
            {/* Date/Time */}
            <span className="text-muted-foreground font-medium">{dateTime}</span>

            {/* Weather below */}
            {weather.temp !== null && (
              <span className="mt-1 inline-flex items-center gap-2 px-2 py-1 rounded-md bg-muted text-muted-foreground/90 text-xs shadow-sm">
                {/* live pulse */}
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                {weather.icon ? (
                  <img
                    src={weather.icon}
                    alt="Weather icon"
                    className="w-4 h-4 object-contain"
                  />
                ) : (
                  <Sun className="w-4 h-4" />
                )}
                <span className="font-semibold">{weather.temp}°C</span>
                <span>{weather.city}</span>
              </span>
            )}
          </div>

          {/* Center: Logo */}
          <Link to="/" className="flex items-center space-x-4">
            <img
              src={logoSrc}
              alt="NewsHub Logo"
              className="h-30 w-auto  object-contain "
              style={{ maxHeight: "180px" }}
            />
          </Link>

          {/* Right: Search & Profile & Dark Mode Toggle */}
          <div className="flex items-center space-x-1">
            {/* Search Button */}
            {/* <Button
              variant="ghost"
              size="icon"
              className="hover:bg-accent hover:text-accent-foreground"
              title="Search"
            >
              <Search className="h-5 w-5" />
            </Button> */}

            {/* Dark Mode Toggle */}
            <button
              aria-label="Toggle Dark Mode"
              title="Toggle Dark Mode"
              onClick={() => setDarkMode((prev) => !prev)}
              className="relative w-14 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center px-1 cursor-pointer select-none transition-colors"
              role="switch"
              aria-checked={darkMode}
            >
              <span
                className={cn(
                  "w-7 h-7 bg-white rounded-full shadow-md transform transition-transform",
                  darkMode ? "translate-x-6" : "translate-x-0"
                )}
              >
                {darkMode ? (
                  <Moon className="text-gray-700" style={{ marginTop: 2, marginLeft: 2 }} />
                ) : (
                  <Sun className="text-yellow-400" style={{ marginTop: 2, marginLeft: 2 }} />
                )}
              </span>
            </button>

            {/* Profile Button -> routes to /profile */}
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="hover:bg-accent hover:text-accent-foreground"
              title="Profile"
            >
              <Link to="/profile">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </Link>
            </Button>
          </div>
        </div>

        {/* --- CATEGORY BAR --- */}
        <div className="flex items-center justify-center overflow-x-auto border-t border-border">
          <div className="flex space-x-6 py-3 text-sm font-medium">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.path}
                className={cn(
                  "transition-colors whitespace-nowrap hover:text-accent",
                  location.pathname === category.path
                    ? "text-accent font-semibold"
                    : "text-muted-foreground"
                )}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
