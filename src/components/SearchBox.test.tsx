import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBox from './SearchBox';
import type { Movie } from '../api/movies';

const mockMovies: Movie[] = [
    {
        id: '1',
        name: 'The Matrix',
        description: 'A computer hacker learns about reality',
        thumbnail: 'matrix.jpg',
        rating: 8.7,
        duration: 136,
        genres: ['Action', 'Sci-Fi'],
        releasedAt: '1999-03-31',
    },
    {
        id: '2',
        name: 'The Matrix Reloaded',
        description: 'Neo and friends fight the machines',
        thumbnail: 'reloaded.jpg',
        rating: 7.2,
        duration: 138,
        genres: ['Action', 'Sci-Fi'],
        releasedAt: '2003-05-15',
    },
];

describe('SearchBox', () => {
    const defaultProps = {
        query: '',
        suggestions: [],
        isSuggestionsLoading: false,
        onQueryChange: vi.fn(),
        onSubmit: vi.fn(),
        onSuggestionClick: vi.fn(),
    };

    it('should render search input and button', () => {
        render(<SearchBox {...defaultProps} />);

        expect(screen.getByPlaceholderText(/search for a movie/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /submit search/i })).toBeInTheDocument();
    });



    it('should call onSubmit when form is submitted', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(<SearchBox {...defaultProps} query="matrix" onSubmit={onSubmit} />);

        const button = screen.getByRole('button', { name: /submit search/i });
        await user.click(button);

        expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it('should display suggestions when query is valid', () => {
        render(
            <SearchBox
                {...defaultProps}
                query="matrix"
                suggestions={mockMovies}
            />
        );

        expect(screen.getByText('The Matrix')).toBeInTheDocument();
        expect(screen.getByText('The Matrix Reloaded')).toBeInTheDocument();
    });

    it('should not display suggestions when query is too short', () => {
        render(
            <SearchBox
                {...defaultProps}
                query="m"
                suggestions={mockMovies}
            />
        );

        expect(screen.queryByText('The Matrix')).not.toBeInTheDocument();
    });

    it('should call onSuggestionClick when clicking a suggestion', async () => {
        const user = userEvent.setup();
        const onSuggestionClick = vi.fn();

        render(
            <SearchBox
                {...defaultProps}
                query="matrix"
                suggestions={mockMovies}
                onSuggestionClick={onSuggestionClick}
            />
        );

        const suggestion = screen.getByText('The Matrix');
        await user.click(suggestion);

        expect(onSuggestionClick).toHaveBeenCalledWith(mockMovies[0]);
    });

    it('should show loading indicator when loading suggestions', () => {
        render(
            <SearchBox
                {...defaultProps}
                query="matrix"
                isSuggestionsLoading={true}
            />
        );

        expect(screen.getByText(/loading suggestions/i)).toBeInTheDocument();
    });

    it('should support keyboard navigation on suggestions', async () => {
        const user = userEvent.setup();
        const onSuggestionClick = vi.fn();

        render(
            <SearchBox
                {...defaultProps}
                query="matrix"
                suggestions={mockMovies}
                onSuggestionClick={onSuggestionClick}
            />
        );

        const suggestion = screen.getByText('The Matrix');
        suggestion.focus();
        await user.keyboard('{Enter}');

        expect(onSuggestionClick).toHaveBeenCalledWith(mockMovies[0]);
    });
});