
import { Movie } from "@/components/MovieCard";
import movieData from "../../server/response.json";

export const sampleMovies: Movie[] = movieData;
export const genres = [
  "Action", "Adventure", "Animation", "Biography", "Comedy", "Crime", 
  "Documentary", "Drama", "Family", "Fantasy", "History", "Horror", 
  "Music", "Mystery", "Romance", "Sci-Fi", "Sport", "Thriller", "War", "Western"
];

export const languages = [
  "English", "Spanish", "French", "German", "Italian", "Japanese", 
  "Korean", "Chinese", "Russian", "Hindi", "Portuguese", "Arabic"
];

export function getRecommendations(preferences: {
  genres: string[];
  language: string;
  actors?: string;
  directors?: string;
}): Movie[] {
  return sampleMovies;
}
