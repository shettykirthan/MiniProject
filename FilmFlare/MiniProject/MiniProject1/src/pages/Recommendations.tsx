
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import MovieCard, { Movie } from "@/components/MovieCard";
import { useApp } from "@/context/AppContext";
import { getRecommendations } from "@/data/movieData";

const Recommendations = () => {
  const navigate = useNavigate();
  const { preferences, addToFavorites, removeFromFavorites, isFavorite } = useApp();
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If no preferences are set, redirect to preferences page
    if (!preferences) {
      navigate("/preferences");
      return;
    }

    // Simulate API request delay
    setLoading(true);
    const timer = setTimeout(() => {
      const recommendedMovies = getRecommendations(preferences);
      setRecommendations(recommendedMovies);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [preferences, navigate]);

  const handleAddToFavorites = (movie: Movie) => {
    if (isFavorite(movie.id)) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  return (
    <div className="min-h-screen bg-netflixBlack">
      <Navbar />
      
      <div className="pt-24 px-6 md:px-16 pb-16">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Your Recommendations</h1>
            {preferences && (
              <p className="text-gray-300">
                Based on your preference for {preferences.genres.join(", ")} movies in {preferences.language}
                {preferences.actors && ` featuring ${preferences.actors}`}
                {preferences.directors && ` directed by ${preferences.directors}`}
              </p>
            )}
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center min-h-[50vh]">
              <div className="w-12 h-12 border-4 border-netflixRed border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {recommendations.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                  {recommendations.map((movie) => (
                    <div key={movie.id} className="movie-card-hover">
                      <MovieCard 
                        movie={movie} 
                        onAddToFavorites={handleAddToFavorites}
                        isFavorite={isFavorite(movie.id)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h2 className="text-2xl text-white font-bold mb-4">No movies found</h2>
                  <p className="text-gray-300 mb-6">Try adjusting your preferences to see more recommendations.</p>
                  <button 
                    onClick={() => navigate("/preferences")}
                    className="netflix-btn"
                  >
                    Update Preferences
                  </button>
                </div>
              )}
              
              <div className="mt-12 text-center">
                <button 
                  onClick={() => navigate("/preferences")}
                  className="bg-netflixGray hover:bg-netflixDarkGray text-white font-bold py-3 px-6 rounded 
                           transition-all duration-300 ease-in-out mr-4"
                >
                  Update Preferences
                </button>
                <button 
                  onClick={() => navigate("/favorites")}
                  className="netflix-btn"
                >
                  View Favorites
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
