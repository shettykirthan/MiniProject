import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { useApp } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { account } from "../../appwrite/appwrite"; 
const Profile = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [emailid, setEmailid] = useState('');
  const { preferences, favorites, setPreferences } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is authenticated by fetching from localStorage
    const storedUserData = localStorage.getItem("userDetails");
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      setUsername(userData?.name || "User");
      setEmailid(userData?.email || "email");
      setIsAuthenticated(true);
    }
  }, []);

  const resetPreferences = () => {
    if (confirm("Are you sure you want to reset your preferences?")) {
      setPreferences({ genres: [], language: "English" });
      navigate("/preferences");
    }
  };
  const handleLogout = async () => {
    try {
      // Delete the current session from Appwrite
      await account.deleteSession('current');
    } catch (error) {
      console.error("Error deleting session:", error);
    }
    localStorage.removeItem("userDetails");
    localStorage.removeItem("userData");
    localStorage.removeItem("cookieFallback");
    localStorage.removeItem("favorites");
    
    window.location.reload();
  };
  
  const topGenres = () => {
    if (!favorites.length) return [];
    
    const genreCounts: Record<string, number> = {};
    
    favorites.forEach(movie => {
      movie.genres.forEach(genre => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    });
    
    return Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([genre]) => genre);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-netflixBlack">
        <Navbar />
        <div className="pt-24 px-6 md:px-16 pb-16">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center gap-4 mb-8">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-netflixRed hover:bg-netflixRed/90">
                    Login
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-netflixGray border-netflixDarkGray">
                  <LoginForm />
                </DialogContent>
              </Dialog>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-netflixRed text-netflixRed hover:bg-netflixRed/10">
                    Sign Up
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-netflixGray border-netflixDarkGray">
                  <SignupForm />
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="text-center text-white/80">
              <h2 className="text-2xl font-bold mb-4">Welcome to Film Flare</h2>
              <p>Please login or sign up to access your profile</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflixBlack">
      <Navbar />
      <div className="pt-24 px-6 md:px-16 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="bg-netflixGray rounded-lg overflow-hidden shadow-xl">
            <div className="p-6 md:p-8 bg-gradient-to-r from-netflixRed/90 to-netflixRed/70">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-netflixGray overflow-hidden border-4 border-white/20">
                  <img 
                    src="https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" 
                    alt="Profile picture" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white text-center md:text-left">{username}</h1>
                  <p className="text-white/80 mt-1 text-center md:text-left">{emailid}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 md:p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">Viewing Preferences</h2>
                
                {preferences ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-gray-400 text-sm">Favorite Genres</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {preferences.genres.map(genre => (
                          <span key={genre} className="px-3 py-1 bg-netflixRed/20 text-white rounded-full text-sm">
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-gray-400 text-sm">Preferred Language</h3>
                      <p className="text-white">{preferences.language}</p>
                    </div>
                    
                    {preferences.actors && (
                      <div>
                        <h3 className="text-gray-400 text-sm">Favorite Actors</h3>
                        <p className="text-white">{preferences.actors}</p>
                      </div>
                    )}
                    
                    {preferences.directors && (
                      <div>
                        <h3 className="text-gray-400 text-sm">Favorite Directors</h3>
                        <p className="text-white">{preferences.directors}</p>
                      </div>
                    )}
                    
                    <div className="flex gap-3 pt-2">
                      <button 
                        onClick={() => navigate("/preferences")}
                        className="px-4 py-2 bg-netflixGray border border-white/20 text-white rounded-md hover:bg-netflixDarkGray transition-colors"
                      >
                        Edit Preferences
                      </button>
                      <button 
                        onClick={resetPreferences}
                        className="px-4 py-2 bg-netflixGray border border-white/20 text-white rounded-md hover:bg-netflixDarkGray transition-colors"
                      >
                        Reset Preferences
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-300 mb-4">You haven't set any preferences yet</p>
                    <button 
                      onClick={() => navigate("/preferences")}
                      className="netflix-btn"
                    >
                      Set Preferences
                    </button>
                  </div>
                )}
              </section>
              
              <div className="border-t border-netflixDarkGray my-6"></div>
              
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">Viewing History</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-gray-400 text-sm">Favorites Count</h3>
                    <p className="text-white text-xl font-medium">{favorites.length} movies</p>
                  </div>
                  
                  {favorites.length > 0 && (
                    <div>
                      <h3 className="text-gray-400 text-sm">Top Genres Based on Favorites</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {topGenres().map(genre => (
                          <span key={genre} className="px-3 py-1 bg-netflixRed/20 text-white rounded-full text-sm">
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-2">
                    <button 
                      onClick={() => navigate("/favorites")}
                      className="netflix-btn"
                    >
                      View Favorites
                    </button>

                  </div>
                </div>
              </section>
              <center><button 
                  onClick={handleLogout}
                  className="netflix-btn"
                >
                  Logout
                </button></center>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;