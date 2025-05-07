
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const featuredMovies = [
  {
    id: 1,
    title: "Inception",
    backdrop: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
  },
  {
    id: 2,
    title: "The Dark Knight",
    backdrop: "https://images.unsplash.com/photo-1497124401559-3e75ec2ed794?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
  },
  {
    id: 3,
    title: "Interstellar",
    backdrop: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
  }
];

const HeroBanner = () => {
  const [currentMovie, setCurrentMovie] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMovie((prev) => (prev + 1) % featuredMovies.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const movie = featuredMovies[currentMovie];

  return (
    <div className="relative h-[80vh] md:h-[90vh] w-full overflow-hidden">
      {/* Backdrop Image */}
      <div className="absolute inset-0 w-full h-full transition-opacity duration-1000">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-netflixBlack/50 to-netflixBlack" />
        <img 
          src={movie.backdrop} 
          alt={movie.title} 
          className="w-full h-full object-cover object-center animate-fade-in"
        />
      </div>
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 max-w-screen-lg mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-white text-shadow mb-4 animate-fade-in">
          {movie.title}
        </h1>
        <p className="text-lg md:text-xl text-white text-shadow mb-8 max-w-2xl animate-fade-in">
          {movie.description}
        </p>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => navigate("/preferences")}
            className="netflix-btn"
          >
            Start Recommending
          </button>
          <button 
            className="bg-white/30 backdrop-blur-sm hover:bg-white/40 text-white font-bold py-3 px-6 rounded 
                     transition-all duration-300 ease-in-out"
          >
            Learn More
          </button>
        </div>
      </div>
      
      {/* Progress Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentMovie(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentMovie ? "bg-netflixRed w-6" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
