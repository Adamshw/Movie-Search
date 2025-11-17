
import type { FormEvent } from "react";
import type { Movie } from "../api/movies";

interface SearchBoxProps {
    query: string;
    suggestions: Movie[];
    isSuggestionsLoading: boolean;
    onQueryChange: (value: string) => void;
    onSubmit: () => void;
    onSuggestionClick: (movie: Movie) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({
    query,
    suggestions,
    isSuggestionsLoading,
    onQueryChange,
    onSubmit,
    onSuggestionClick,
}) => {
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit();
    };
    return (
        <form className="search-form" onSubmit={handleSubmit}>
            <div className="search-input-wrapper">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    placeholder="Search for a movie (e.g. The Godfather)"
                    className="search-input"
                    aria-label="Search movies"
                />
                <button type="submit" className="search-button">
                    Search
                </button>

                {query.trim().length >= 2 && suggestions.length > 0 && (
                    <ul className="suggestions-list">
                        {suggestions.map((movie) => (
                            <li
                                key={movie.id}
                                className="suggestion-item"
                                onClick={() => onSuggestionClick(movie)}
                            >
                                {movie.name}
                            </li>
                        ))}
                    </ul>
                )}

                {isSuggestionsLoading && (
                    <div className="suggestions-loading">Loading suggestions…</div>
                )}
            </div>
        </form>
    );
};

export default SearchBox;
