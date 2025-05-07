
import { useState } from "react";
import { Heart, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export interface Movie {
  id: number;
  title: string;
  poster: string;
  description: string;
  year: string;
  rating: string;
  genres: string[];
}

interface MovieCardProps {
  movie: Movie;
  onAddToFavorites: (movie: Movie) => void;
  isFavorite?: boolean;
}

const MovieCard = ({ movie, onAddToFavorites, isFavorite = false }: MovieCardProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const handleAddToFavorites = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card click from opening the modal
    onAddToFavorites(movie);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: `${movie.title} has been ${isFavorite ? "removed from" : "added to"} your favorites`,
      duration: 2000,
    });
  };

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div 
        className="movie-card aspect-[2/3] h-full cursor-pointer"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={handleCardClick}
      >
        <img 
          src={movie.poster} 
          alt={`${movie.title} poster`}
          className="w-full h-full object-cover rounded-md"
        />
        
        <div className={`movie-card-content ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
          <h3 className="text-white font-bold text-lg">{movie.title}</h3>
          <div className="flex items-center text-sm text-gray-300 mt-1 space-x-2">
            <span>{movie.year}</span>
            <span>•</span>
            <span>{movie.rating}</span>
          </div>
          <p className="text-gray-300 text-sm mt-2 line-clamp-3">{movie.description}</p>
          
          <button 
            onClick={handleAddToFavorites}
            className="mt-3 flex items-center gap-2 text-white bg-netflixRed/80 hover:bg-netflixRed 
                     px-4 py-2 rounded-md transition-colors duration-200"
          >
            <Heart size={16} className={isFavorite ? "fill-white" : ""} />
            <span>{isFavorite ? "Remove from Favorites" : "Add to Favorites"}</span>
          </button>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-netflixDarkGray text-white border-netflixGray max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{movie.title}</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <img 
                src={movie.poster} 
                alt={`${movie.title} poster`}
                className="w-full h-auto object-cover rounded-md"
              />
            </div>
            <div>
              <div className="flex items-center text-sm text-gray-300 mb-3 space-x-2">
                <span>{movie.year}</span>
                <span>•</span>
                <span>{movie.rating}</span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres.map((genre) => (
                  <span 
                    key={genre} 
                    className="px-3 py-1 bg-netflixGray/50 rounded-full text-xs"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              
              <p className="text-gray-300 mb-6">{movie.description}</p>
              
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToFavorites(e as React.MouseEvent);
                }}
                className="flex items-center gap-2 text-white bg-netflixRed hover:bg-netflixRed/90 
                         px-4 py-2 rounded-md transition-colors duration-200"
              >
                <Heart size={16} className={isFavorite ? "fill-white" : ""} />
                <span>{isFavorite ? "Remove from Favorites" : "Add to Favorites"}</span>
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MovieCard;
