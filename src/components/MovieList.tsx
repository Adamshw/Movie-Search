import { memo } from "react";
import type { Movie } from "../api/movies";
import { formatDurationMinutes } from "../utils/format";

interface MovieListProps {
    movies: Movie[];
}

const MovieList: React.FC<MovieListProps> = ({ movies }) => {
    return (
        <ul className="results-list">
            {movies.map((movie) => {
                const hasRating = typeof movie.rating === "number";
                const releaseYear = movie.releasedAt 
                    ? new Date(movie.releasedAt).getFullYear() 
                    : null;

                return (
                    <li key={movie.id} className="result-card">
                        {movie.thumbnail && (
                            <div className="result-thumbnail-wrapper">
                                <img
                                    src={movie.thumbnail}
                                    alt={`${movie.name} poster`}
                                    className="result-thumbnail"
                                    loading="lazy"
                                />
                            </div>
                        )}
                        <div className="result-content">
                            <h3 className="result-title">
                                {movie.name}
                                {hasRating && (
                                    <span 
                                        className="result-rating" 
                                        aria-label={`Rating ${movie.rating} out of 10`}
                                    >
                                        {movie.rating.toFixed(1)}/10
                                    </span>
                                )}
                            </h3>
                            <div className="result-meta">
                                <span>
                                    {formatDurationMinutes(movie.duration)}
                                    {movie.genres.length > 0 && (
                                        <> • {movie.genres.join(", ")}</>
                                    )}
                                    {releaseYear && <> • {releaseYear}</>}
                                </span>
                            </div>
                            {movie.description && (
                                <p className="result-description">{movie.description}</p>
                            )}
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};

export default memo(MovieList);