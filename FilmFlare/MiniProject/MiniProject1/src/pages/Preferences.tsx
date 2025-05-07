import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { useApp } from "@/context/AppContext";
import { genres, languages } from "@/data/movieData";
import client, { databases, account } from "../../appwrite/appwrite";
import { ID, Query } from "appwrite";
import { DATABASE_ID, MOVIE_PREFERENCE_ID } from "../../appwrite/appwrite";

const Preferences = () => {
  const navigate = useNavigate();
  const { setPreferences, preferences } = useApp();

  const [userId, setUserId] = useState<string | null>(null);
  const [docId, setDocId] = useState<string | null>(null); // to track existing doc
  const [selectedGenres, setSelectedGenres] = useState<string[]>(preferences?.genres || []);
  const [language, setLanguage] = useState<string>(preferences?.language || "English");
  const [actors, setActors] = useState<string>(preferences?.actors || "");
  const [directors, setDirectors] = useState<string>(preferences?.directors || "");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await account.get();
        setUserId(user.$id);

        // Check if preferences already exist
        const response = await databases.listDocuments(
          DATABASE_ID,
          MOVIE_PREFERENCE_ID,
          [Query.equal("userId", user.$id)]
        );

        if (response.total > 0) {
          const existing = response.documents[0];
          setDocId(existing.$id); // store for update
          setSelectedGenres(existing.Genres || []);
          setLanguage(existing.Languages?.[0] || "English");
          setActors(existing.Actors || "");
          setDirectors(existing.Directors || "");
        }
      } catch (error) {
        console.error("Failed to fetch user or preferences", error);
      }
    };

    fetchUser();
  }, []);

  const handleGenreChange = (genre: string, checked: CheckedState) => {
    if (checked) {
      setSelectedGenres([...selectedGenres, genre]);
    } else {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert("User not authenticated");
      return;
    }

    if (selectedGenres.length === 0) {
      alert("Please select at least one genre");
      return;
    }

    const data = {
      userId,
      Genres: selectedGenres,
      Languages: [language],
      Actors: actors,
      Directors: directors,
    };

    try {
      if (docId) {
        // Update existing
        const updated = await databases.updateDocument(
          DATABASE_ID,
          MOVIE_PREFERENCE_ID,
          docId,
          data
        );
        console.log("Preferences updated:", updated);
      } else {
        // Create new
        const created = await databases.createDocument(
          DATABASE_ID,
          MOVIE_PREFERENCE_ID,
          ID.unique(),
          data
        );
        console.log("Preferences created:", created);
      }

      await fetch("http://localhost:5000/UserDocuments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });      

      setPreferences({ genres: selectedGenres, language, actors, directors });
      navigate("/recommendations");
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert("Failed to save preferences. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-netflixBlack">
      <Navbar />
      <div className="pt-24 px-6 md:px-16 pb-16">
        <div className="max-w-2xl mx-auto bg-netflixGray rounded-lg shadow-xl overflow-hidden">
          <div className="p-6 md:p-8 bg-gradient-to-r from-netflixRed/90 to-netflixRed/70">
            <h1 className="text-3xl font-bold text-white">Tell Us What You Like</h1>
            <p className="text-white/80 mt-2">Customize your movie recommendations</p>
          </div>
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
            <div>
              <h2 className="text-xl text-white font-medium mb-4">Select Your Favorite Genres</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {genres.map((genre) => (
                  <div key={genre} className="flex items-center space-x-2">
                    <Checkbox 
                      id={genre} 
                      checked={selectedGenres.includes(genre)}
                      onCheckedChange={(checked) => handleGenreChange(genre, checked)}
                      className="border-netflixRed data-[state=checked]:bg-netflixRed"
                    />
                    <Label htmlFor={genre} className="text-gray-300 cursor-pointer">{genre}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-xl text-white font-medium mb-4">Preferred Language</h2>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="netflix-input w-full">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent className="bg-netflixGray border border-netflixDarkGray text-white">
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang} className="focus:bg-netflixRed">
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <h2 className="text-xl text-white font-medium mb-4">Favorite Actors & Directors (Optional)</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="actors" className="text-gray-300">Favorite Actors</Label>
                  <Input 
                    id="actors" 
                    value={actors}
                    onChange={(e) => setActors(e.target.value)}
                    placeholder="e.g. Leonardo DiCaprio, Meryl Streep" 
                    className="netflix-input w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="directors" className="text-gray-300">Favorite Directors</Label>
                  <Input 
                    id="directors" 
                    value={directors}
                    onChange={(e) => setDirectors(e.target.value)}
                    placeholder="e.g. Christopher Nolan, Greta Gerwig" 
                    className="netflix-input w-full"
                  />
                </div>
              </div>
            </div>
            <div className="pt-4">
              <button type="submit" className="netflix-btn w-full">
                Get Recommendations
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
