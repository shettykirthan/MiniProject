
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Home, User } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-16 transition-colors duration-300 ${
        isScrolled ? "bg-netflixBlack shadow-md" : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-netflixRed text-3xl font-bold tracking-tight mr-2">FILM</span>
          <span className="text-white text-3xl font-medium">FLARE</span>
        </Link>
        
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-white hover:text-netflixRed transition-colors flex items-center gap-2">
            <Home size={20} />
            <span className="hidden md:inline">Home</span>
          </Link>
          <Link to="/favorites" className="text-white hover:text-netflixRed transition-colors flex items-center gap-2">
            <Heart size={20} />
            <span className="hidden md:inline">Favorites</span>
          </Link>
          <Link to="/profile" className="text-white hover:text-netflixRed transition-colors flex items-center gap-2">
            <User size={20} />
            <span className="hidden md:inline">Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
