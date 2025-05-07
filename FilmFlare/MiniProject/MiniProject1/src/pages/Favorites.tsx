
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import { useApp } from "@/context/AppContext";

const Favorites = () => {
  const navigate = useNavigate();
  const { favorites, removeFromFavorites, isFavorite } = useApp();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFavorites = searchTerm
    ? favorites.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        movie.genres.some(genre => genre.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : favorites;

  const handleRemoveFromFavorites = (movie: any) => {
    removeFromFavorites(movie.id);
  };

  return (
    <div className="min-h-screen bg-netflixBlack">
      <Navbar />
      
      <div className="pt-24 px-6 md:px-16 pb-16">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Your Favorites</h1>
              <p className="text-gray-300">Movies you've saved for later</p>
            </div>
            
            <div className="w-full md:w-64">
              <input
                type="text"
                placeholder="Search favorites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="netflix-input w-full px-4 py-2"
              />
            </div>
          </div>
          
          {filteredFavorites.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {filteredFavorites.map((movie) => (
                <div key={movie.id} className="movie-card-hover">
                  <MovieCard 
                    movie={movie} 
                    onAddToFavorites={handleRemoveFromFavorites}
                    isFavorite={true}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-netflixGray rounded-lg">
              {searchTerm ? (
                <>
                  <h2 className="text-2xl text-white font-bold mb-2">No matches found</h2>
                  <p className="text-gray-300 mb-4">Try a different search term</p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl text-white font-bold mb-2">Your favorites list is empty</h2>
                  <p className="text-gray-300 mb-6">Start adding movies to your favorites</p>
                  <button 
                    onClick={() => navigate("/recommendations")}
                    className="netflix-btn"
                  >
                    Browse Recommendations
                  </button>
                </>
              )}
            </div>
          )}
          
          {filteredFavorites.length > 0 && (
            <div className="mt-12 text-center">
              <button 
                onClick={() => navigate("/recommendations")}
                className="netflix-btn"
              >
                Back to Recommendations
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
