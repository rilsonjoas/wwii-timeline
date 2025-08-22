import { tmdbCache } from './tmdb-cache';

// TMDB API Service
const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const TMDB_ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
const TMDB_IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';

export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  video: boolean;
  popularity: number;
}

export interface TMDBSearchResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

export interface TMDBMovieDetails extends TMDBMovie {
  budget: number;
  revenue: number;
  runtime: number;
  status: string;
  tagline: string;
  homepage: string;
  imdb_id: string;
  genres: Array<{
    id: number;
    name: string;
  }>;
  production_companies: Array<{
    id: number;
    name: string;
    logo_path: string | null;
  }>;
  credits?: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }>;
    crew: Array<{
      id: number;
      name: string;
      job: string;
      department: string;
    }>;
  };
  videos?: {
    results: Array<{
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
      official: boolean;
    }>;
  };
}

export interface EnrichedMovieData {
  originalTitle: string;
  originalYear: number;
  originalDirector?: string;
  tmdbId: number;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string;
  rating: number;
  voteCount: number;
  genres: string[];
  runtime: number;
  imdbId: string;
  trailerKey: string | null;
  cast: Array<{
    name: string;
    character: string;
    profilePath: string | null;
  }>;
  director: string | null;
}

class TMDBService {
  private readonly headers: HeadersInit;

  constructor() {
    if (!TMDB_ACCESS_TOKEN) {
      throw new Error('TMDB Access Token not found. Please check your environment variables.');
    }

    this.headers = {
      'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
      'Content-Type': 'application/json;charset=utf-8',
    };
  }

  /**
   * Get full image URL
   */
  getImageUrl(path: string | null, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string | null {
    if (!path) return null;
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
  }

  /**
   * Search for movies by title and year
   */
  async searchMovie(title: string, year?: number): Promise<TMDBMovie[]> {
    try {
      const params = new URLSearchParams({
        query: title,
        include_adult: 'false',
        language: 'pt-BR'
      });

      if (year) {
        params.append('year', year.toString());
      }

      const response = await fetch(`${TMDB_BASE_URL}/search/movie?${params}`, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
      }

      const data: TMDBSearchResponse = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error searching movies:', error);
      return [];
    }
  }

  /**
   * Get movie details by ID
   */
  async getMovieDetails(movieId: number): Promise<TMDBMovieDetails | null> {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/${movieId}?language=pt-BR&append_to_response=credits,videos`,
        {
          method: 'GET',
          headers: this.headers
        }
      );

      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching movie details:', error);
      return null;
    }
  }

  /**
   * Find best match for a movie based on title and year
   */
  async findBestMatch(title: string, year?: number, director?: string): Promise<TMDBMovie | null> {
    const searchResults = await this.searchMovie(title, year);
    
    if (searchResults.length === 0) {
      // Try search without year if no results
      if (year) {
        return this.findBestMatch(title, undefined, director);
      }
      return null;
    }

    // Score each result
    const scoredResults = searchResults.map(movie => {
      let score = 0;
      
      // Title similarity (basic)
      const titleMatch = this.calculateTitleSimilarity(title, movie.title) || 
                        this.calculateTitleSimilarity(title, movie.original_title);
      score += titleMatch * 50;

      // Year proximity
      if (year && movie.release_date) {
        const movieYear = new Date(movie.release_date).getFullYear();
        const yearDiff = Math.abs(year - movieYear);
        score += Math.max(0, 20 - yearDiff);
      }

      // Popularity bonus (higher rated movies get slight preference)
      score += Math.min(movie.vote_average, 10);

      return { movie, score };
    });

    // Return the highest scored match
    scoredResults.sort((a, b) => b.score - a.score);
    return scoredResults[0].movie;
  }

  /**
   * Basic title similarity calculation
   */
  private calculateTitleSimilarity(title1: string, title2: string): number {
    const normalize = (str: string) => 
      str.toLowerCase()
         .replace(/[^\w\s]/g, '')
         .replace(/\s+/g, ' ')
         .trim();

    const normalized1 = normalize(title1);
    const normalized2 = normalize(title2);

    if (normalized1 === normalized2) return 1;
    if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) return 0.8;
    
    // Simple word overlap
    const words1 = normalized1.split(' ');
    const words2 = normalized2.split(' ');
    const overlap = words1.filter(word => words2.includes(word)).length;
    
    return overlap / Math.max(words1.length, words2.length);
  }

  /**
   * Enrich movie data with TMDB information
   */
  async enrichMovieData(title: string, year?: number, director?: string): Promise<EnrichedMovieData | null> {
    try {
      // Check cache first
      const cached = tmdbCache.get(title, year, director);
      if (cached) {
        return cached;
      }

      // Find the best matching movie
      const movie = await this.findBestMatch(title, year, director);
      if (!movie) {
        console.warn(`No TMDB match found for: ${title} (${year})`);
        return null;
      }

      // Get detailed information
      const details = await this.getMovieDetails(movie.id);
      if (!details) {
        console.warn(`Failed to get details for TMDB ID: ${movie.id}`);
        return null;
      }

      // Extract trailer
      const trailer = details.videos?.results.find(
        video => video.type === 'Trailer' && video.site === 'YouTube'
      );

      // Extract director
      const movieDirector = details.credits?.crew.find(
        person => person.job === 'Director'
      );

      // Extract main cast (first 5)
      const cast = details.credits?.cast.slice(0, 5).map(actor => ({
        name: actor.name,
        character: actor.character,
        profilePath: this.getImageUrl(actor.profile_path, 'w185')
      })) || [];

      const enrichedData: EnrichedMovieData = {
        originalTitle: title,
        originalYear: year || 0,
        originalDirector: director,
        tmdbId: details.id,
        title: details.title,
        overview: details.overview,
        posterPath: this.getImageUrl(details.poster_path, 'w500'),
        backdropPath: this.getImageUrl(details.backdrop_path, 'w780'),
        releaseDate: details.release_date,
        rating: Math.round(details.vote_average * 10) / 10,
        voteCount: details.vote_count,
        genres: details.genres.map(genre => genre.name),
        runtime: details.runtime,
        imdbId: details.imdb_id,
        trailerKey: trailer?.key || null,
        cast,
        director: movieDirector?.name || director || null
      };

      // Cache the enriched data
      tmdbCache.set(title, enrichedData, year, director);

      return enrichedData;
    } catch (error) {
      console.error(`Error enriching movie data for ${title}:`, error);
      return null;
    }
  }

  /**
   * Test API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${TMDB_BASE_URL}/configuration`, {
        method: 'GET',
        headers: this.headers
      });
      
      const isConnected = response.ok;
      console.log(isConnected ? '✅ TMDB API connected successfully!' : '❌ TMDB API connection failed');
      
      return isConnected;
    } catch (error) {
      console.error('❌ TMDB API connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const tmdbService = new TMDBService();

// Export utility functions
export const getTMDBImageUrl = (path: string | null, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500') => {
  return tmdbService.getImageUrl(path, size);
};