
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Movie } from "@/components/MovieCard";

interface UserPreferences {
  genres: string[];
  language: string;
  actors?: string;
  directors?: string;
}

interface AppContextType {
  favorites: Movie[];
  addToFavorites: (movie: Movie) => void;
  removeFromFavorites: (movieId: number) => void;
  isFavorite: (movieId: number) => boolean;
  preferences: UserPreferences | null;
  setPreferences: (preferences: UserPreferences) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);

  // Load favorites from localStorage on initial render
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error("Failed to parse favorites:", error);
      }
    }
    
    const savedPreferences = localStorage.getItem("preferences");
    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
      } catch (error) {
        console.error("Failed to parse preferences:", error);
      }
    }
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);
  
  // Save preferences to localStorage whenever it changes
  useEffect(() => {
    if (preferences) {
      localStorage.setItem("preferences", JSON.stringify(preferences));
    }
  }, [preferences]);

  const addToFavorites = (movie: Movie) => {
    if (!isFavorite(movie.id)) {
      setFavorites([...favorites, movie]);
    }
  };

  const removeFromFavorites = (movieId: number) => {
    setFavorites(favorites.filter((movie) => movie.id !== movieId));
  };

  const isFavorite = (movieId: number) => {
    return favorites.some((movie) => movie.id === movieId);
  };

  const savePreferences = (newPreferences: UserPreferences) => {
    setPreferences(newPreferences);
  };

  return (
    <AppContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        preferences,
        setPreferences: savePreferences,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
