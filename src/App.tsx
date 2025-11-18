import { useEffect, useState, useCallback, useRef } from "react";
import type { Movie } from "./api/movies";
import { searchMovies } from "./api/movies";
import SearchBox from "./components/SearchBox";
import MovieList from "./components/MovieList";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // to skip one suggestions fetch after user selects a suggestion
  const skipSuggestionsRef = useRef(false);


  // Execute a search when user submits form or picks a suggestion
  const runSearch = useCallback(async (term?: string) => {

    const searchTerm = (term ?? query).trim();
    if (!searchTerm) return;
  
    setIsLoadingResults(true);
    setError(null);

    try {
      const movies = await searchMovies(searchTerm);
      setResults(movies);

  
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch movie data."
      );
      setResults([]);
    } finally {
      setIsLoadingResults(false);
    }
  }, [query]);

  const handleSubmit = useCallback(() => {
    skipSuggestionsRef.current = true;
    setSuggestions([]);
    void runSearch();
  }, [runSearch]);

  const handleSuggestionClick = useCallback((movie: Movie) => {
    skipSuggestionsRef.current = true;
    setQuery(movie.name);
    setSuggestions([]);
    void runSearch(movie.name);
  }, [runSearch]);


  // Autocomplete suggestions (debounced on query change)
  useEffect(() => {
    const trimmed = query.trim();

    if (skipSuggestionsRef.current) {
      skipSuggestionsRef.current = false;
      return;
    }

    if (trimmed.length < 2) {
      setSuggestions([]);
      setResults([]);
      setIsLoadingSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);
    const abortController = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      try {
        const movies = await searchMovies(trimmed);
        setSuggestions(movies.slice(0, 5));
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        console.error("Suggestion fetch failed", err);
        setSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
      abortController.abort(); // Handles unmount and rapid query changes
    };
  }, [query]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Movie Search</h1>
        <p className="app-subtitle">
          Type a movie title to search. Suggestions appear as you type.
        </p>
      </header>

      <main className="app-main">
        <SearchBox
          query={query}
          suggestions={suggestions}
          isSuggestionsLoading={isLoadingSuggestions}
          onQueryChange={setQuery}
          onSubmit={handleSubmit}
          onSuggestionClick={handleSuggestionClick}
        />

        {error && <div className="error-message">{error}</div>}

        <section className="results-section">
          {isLoadingResults && <div className="loading">Searching…</div>}

          {!isLoadingResults && results.length === 0 && !error && query.trim() && (
            <p className="no-results">No results found for "{query.trim()}"</p>
          )}

          {!isLoadingResults && results.length === 0 && !error && !query.trim() && (
            <p className="no-results">No results yet. Try a search.</p>
          )}

          {!isLoadingResults && results.length > 0 && (
            <>
              <h2 className="results-title">
                Results ({results.length}) for "{query.trim()}"
              </h2>
              <MovieList movies={results} />
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;