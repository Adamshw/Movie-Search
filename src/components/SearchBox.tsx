import { type FormEvent, memo } from "react";
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

    const showSuggestions = query.trim().length >= 2 && suggestions.length > 0;

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
                    aria-autocomplete="list"
                    aria-controls={showSuggestions ? "suggestions-list" : undefined}
                    aria-expanded={showSuggestions}
                    autoComplete="off"
                    role="combobox"
                />
                <button type="submit" className="search-button" aria-label="Submit search">
                    Search
                </button>

                {showSuggestions && (
                    <ul 
                        id="suggestions-list"
                        className="suggestions-list"
                        role="listbox"
                        aria-label="Movie suggestions"
                    >
                        {suggestions.map((movie) => (
                            <li
                                key={movie.id}
                                className="suggestion-item"
                                onClick={() => onSuggestionClick(movie)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        onSuggestionClick(movie);
                                    }
                                }}
                                role="option"
                                tabIndex={0}
                                aria-selected={false}
                            >
                                {movie.name}
                            </li>
                        ))}
                    </ul>
                )}

                {isSuggestionsLoading && (
                    <div 
                        className="suggestions-loading" 
                        role="status" 
                        aria-live="polite"
                    >
                        Loading suggestions…
                    </div>
                )}
            </div>
        </form>
    );
};

export default memo(SearchBox);