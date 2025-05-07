import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import MovieCard from "@/components/MovieCard";
import { useApp } from "@/context/AppContext";
import { sampleMovies } from "@/data/topMovies";

const Index = () => {
  const navigate = useNavigate();
  const { addToFavorites, removeFromFavorites, isFavorite } = useApp();
  const scrollRef = useRef<HTMLDivElement>(null);

  const popularMovies = sampleMovies.slice(0, 20); // show more movies

  const handleAddToFavorites = (movie: any) => {
    if (isFavorite(movie.id)) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-netflixBlack">
      <Navbar />
      <HeroBanner />

      <section className="px-6 md:px-16 py-12 max-w-screen-xl mx-auto -mt-16 relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Popular Movies</h2>

        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
          >
            <ChevronLeft size={28} />
          </button>

          <div
            ref={scrollRef}
            className="flex space-x-6 overflow-x-auto scrollbar-hide scroll-smooth px-12"
          >
            {popularMovies.map((movie) => (
              <div key={movie.id} className="flex-shrink-0 w-[200px]">
                <MovieCard
                  movie={movie}
                  onAddToFavorites={handleAddToFavorites}
                  isFavorite={isFavorite(movie.id)}
                />
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
          >
            <ChevronRight size={28} />
          </button>
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => navigate("/preferences")}
            className="netflix-btn"
          >
            Get Personalized Recommendations
          </button>
        </div>
      </section>

      <section className="px-6 md:px-16 py-16 bg-netflixGray">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">Discover Your Next Favorite Movie</h2>
              <p className="text-gray-300 mb-6">
                Cine Noir analyzes your preferences to recommend movies you'll love.
                Tell us your favorite genres, actors, and directors, and we'll do the rest.
              </p>
              <button
                onClick={() => navigate("/preferences")}
                className="netflix-btn"
              >
                Start Now
              </button>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -top-4 -left-4 w-full h-full bg-netflixRed rounded-md"></div>
                <img
                  src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=725&q=80"
                  alt="Movie collection"
                  className="relative z-10 rounded-md w-full h-auto shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="px-6 md:px-16 py-8 bg-netflixBlack border-t border-netflixGray">
        <div className="max-w-screen-xl mx-auto text-center text-gray-400">
          <p>© 2025 Cine Noir. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
