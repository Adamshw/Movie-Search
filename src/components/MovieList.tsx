import type { Movie } from "../api/movies";
import { formatDurationMinutes } from "../utils/format";


interface MovieListProps {
    movies: Movie[];
}

const MovieList: React.FC<MovieListProps> = ({ movies }) => {
    return (
        <ul className="results-list">
            {movies.map((movie) => (
                <li key={movie.id} className="result-card">
                    <div className="result-thumbnail-wrapper">
                        {movie.thumbnail && (
                            <img
                                src={movie.thumbnail}
                                alt={movie.name}
                                className="result-thumbnail"
                            />
                        )}
                    </div>
                    <div className="result-content">
                        <h3 className="result-title">
                            {movie.name}
                            {typeof movie.rating === "number" && (
                                <span className="result-rating">
                                    {movie.rating.toFixed(1)}/10
                                </span>
                            )}
                        </h3>
                        <div className="result-meta">
                            <span>
                                {formatDurationMinutes(movie.duration)} •{" "}
                                {movie.genres.join(", ")}
                            </span>
                            {movie.releasedAt && (
                                <span> • {new Date(movie.releasedAt).getFullYear()}</span>
                            )}
                        </div>
                        <p className="result-description">{movie.description}</p>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default MovieList;
