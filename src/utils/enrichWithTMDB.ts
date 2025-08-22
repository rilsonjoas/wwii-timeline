import { tmdbService, type EnrichedMovieData } from '@/lib/tmdb';
import { tmdbCache } from '@/lib/tmdb-cache';
import type { TimelineEvent } from '@/lib/firestore';

export interface EnrichedTimelineEvent extends TimelineEvent {
  enrichedMovies?: Array<{
    title: string;
    year: number;
    director?: string;
    tmdbData?: EnrichedMovieData;
    loading?: boolean;
    error?: string;
  }>;
}

/**
 * Enrich a single event with TMDB data for all its movies
 */
export async function enrichEventWithTMDB(event: TimelineEvent): Promise<EnrichedTimelineEvent> {
  if (!event.movies || event.movies.length === 0) {
    return event;
  }

  console.log(`🎬 Enriching event "${event.title}" with ${event.movies.length} movies...`);

  const enrichedMovies = await Promise.all(
    event.movies.map(async (movie) => {
      try {
        console.log(`  📡 Fetching TMDB data for: ${movie.title} (${movie.year})`);
        
        const tmdbData = await tmdbService.enrichMovieData(
          movie.title,
          movie.year,
          movie.director
        );

        if (tmdbData) {
          console.log(`  ✅ Found TMDB data for: ${movie.title}`);
        } else {
          console.log(`  ⚠️ No TMDB data found for: ${movie.title}`);
        }

        return {
          title: movie.title,
          year: movie.year,
          director: movie.director,
          tmdbData,
          loading: false,
          error: tmdbData ? undefined : 'No TMDB data found'
        };
      } catch (error) {
        console.error(`  ❌ Error enriching ${movie.title}:`, error);
        return {
          title: movie.title,
          year: movie.year,
          director: movie.director,
          tmdbData: undefined,
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    })
  );

  return {
    ...event,
    enrichedMovies
  };
}

/**
 * Enrich multiple events with TMDB data
 */
export async function enrichEventsWithTMDB(events: TimelineEvent[]): Promise<EnrichedTimelineEvent[]> {
  console.log(`🚀 Starting TMDB enrichment for ${events.length} events...`);
  
  // Test TMDB connection first
  const isConnected = await tmdbService.testConnection();
  if (!isConnected) {
    console.error('❌ TMDB API not available. Returning events without enrichment.');
    return events;
  }

  const enrichedEvents: EnrichedTimelineEvent[] = [];
  
  // Process events in batches to avoid rate limiting
  const BATCH_SIZE = 3;
  
  for (let i = 0; i < events.length; i += BATCH_SIZE) {
    const batch = events.slice(i, i + BATCH_SIZE);
    console.log(`📦 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(events.length / BATCH_SIZE)}`);
    
    const batchPromises = batch.map(event => enrichEventWithTMDB(event));
    const batchResults = await Promise.all(batchPromises);
    
    enrichedEvents.push(...batchResults);
    
    // Small delay between batches to be respectful to the API
    if (i + BATCH_SIZE < events.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  console.log('✅ TMDB enrichment completed!');
  
  // Log cache statistics
  tmdbCache.logStats();
  
  return enrichedEvents;
}

/**
 * Get statistics about TMDB enrichment
 */
export function getTMDBEnrichmentStats(events: EnrichedTimelineEvent[]) {
  let totalMovies = 0;
  let enrichedMovies = 0;
  let failedMovies = 0;

  events.forEach(event => {
    if (event.enrichedMovies) {
      totalMovies += event.enrichedMovies.length;
      enrichedMovies += event.enrichedMovies.filter(m => m.tmdbData).length;
      failedMovies += event.enrichedMovies.filter(m => m.error).length;
    }
  });

  return {
    totalMovies,
    enrichedMovies,
    failedMovies,
    successRate: totalMovies > 0 ? Math.round((enrichedMovies / totalMovies) * 100) : 0
  };
}