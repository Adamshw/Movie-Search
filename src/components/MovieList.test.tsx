import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MovieList from './MovieList';
import type { Movie } from '../api/movies';

const mockMovies: Movie[] = [
    {
        id: '1',
        name: 'The Matrix',
        description: 'A computer hacker learns about reality',
        thumbnail: 'https://example.com/matrix.jpg',
        rating: 8.7,
        duration: 136,
        genres: ['Action', 'Sci-Fi'],
        releasedAt: '1999-03-31',
    },
    {
        id: '2',
        name: 'Inception',
        description: 'A thief who steals secrets through dreams',
        thumbnail: '',
        rating: 8.8,
        duration: 148,
        genres: ['Action', 'Sci-Fi', 'Thriller'],
        releasedAt: '2010-07-16',
    },
];

describe('MovieList', () => {
    it('should render movie cards', () => {
        render(<MovieList movies={mockMovies} />);

        expect(screen.getByText('The Matrix')).toBeInTheDocument();
        expect(screen.getByText('Inception')).toBeInTheDocument();
    });

    it('should display movie ratings', () => {
        render(<MovieList movies={mockMovies} />);

        expect(screen.getByText('8.7/10')).toBeInTheDocument();
        expect(screen.getByText('8.8/10')).toBeInTheDocument();
    });

    it('should display movie descriptions', () => {
        render(<MovieList movies={mockMovies} />);

        expect(screen.getByText(/computer hacker learns/i)).toBeInTheDocument();
        expect(screen.getByText(/thief who steals secrets/i)).toBeInTheDocument();
    });

    it('should display release years', () => {
        render(<MovieList movies={mockMovies} />);

        expect(screen.getByText(/1999/)).toBeInTheDocument();
        expect(screen.getByText(/2010/)).toBeInTheDocument();
    });

    it('should render thumbnail when available', () => {
        render(<MovieList movies={mockMovies} />);

        const img = screen.getByAltText('The Matrix poster');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', 'https://example.com/matrix.jpg');
        expect(img).toHaveAttribute('loading', 'lazy');
    });

    it('should not render thumbnail when not available', () => {
        render(<MovieList movies={mockMovies} />);

        expect(screen.queryByAltText('Inception poster')).not.toBeInTheDocument();
    });

    it('should render empty list', () => {
        render(<MovieList movies={[]} />);

        const list = screen.getByRole('list');
        expect(list).toBeInTheDocument();
        expect(list.children).toHaveLength(0);
    });


});

