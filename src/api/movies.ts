export interface Movie {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  rating: number;
  duration: number;
  genres: string[];
  releasedAt: string;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://movies-mock-api-677053851485.europe-north1.run.app";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `API error ${res.status}: ${res.statusText}${text ? ` — ${text}` : ""}`
    );
  }
  return res.json() as Promise<T>;
}


export async function searchMovies(
  query: string,
  signal?: AbortSignal
): Promise<Movie[]> {
  const url = new URL("/api/movies", API_BASE_URL);
  url.searchParams.set("q", query);

  const res = await fetch(url, { signal });
  return handleResponse<Movie[]>(res);
}

