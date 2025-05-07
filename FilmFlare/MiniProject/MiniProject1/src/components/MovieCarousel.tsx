import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard, { Movie } from "./MovieCard";

interface MovieCarouselProps {
  movies: Movie[];
  onAddToFavorites: (movie: Movie) => void;
  favorites: number[]; // array of favorite movie IDs
}

const MovieCarousel = ({ movies, onAddToFavorites, favorites }: MovieCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative group">
      {/* Left Arrow */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/40 hover:bg-black/70 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition"
      >
        <ChevronLeft size={32} />
      </button>

      {/* Scrollable Movie Cards */}
      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth px-6"
      >
        {movies.map((movie) => (
          <div key={movie.id} className="min-w-[200px] max-w-[200px]">
            <MovieCard
              movie={movie}
              onAddToFavorites={onAddToFavorites}
              isFavorite={favorites.includes(movie.id)}
            />
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/40 hover:bg-black/70 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition"
      >
        <ChevronRight size={32} />
      </button>
    </div>
  );
};

export default MovieCarousel;
