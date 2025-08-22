import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar, Film } from "lucide-react";
import EnrichedMovieCard from "@/components/ui/enriched-movie-card";
import { translateEventType } from "@/utils/translations";

import type { EnrichedTimelineEvent } from "@/utils/enrichWithTMDB";

interface TimelineEvent {
  year: string;
  date: string;
  title: string;
  description: string;
  movies?: Array<{
    title: string;
    year: number;
    director?: string;
  }>;
  enrichedMovies?: Array<{
    title: string;
    year: number;
    director?: string;
    tmdbData?: any;
    loading?: boolean;
    error?: string;
  }>;
  type: 'battle' | 'political' | 'liberation' | 'tragedy';
}

interface GitTimelineProps {
  events: TimelineEvent[];
  className?: string;
}

const GitTimeline: React.FC<GitTimelineProps> = ({ events, className }) => {
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 5 });
  const timelineRef = useRef<HTMLDivElement>(null);

  // Group events by year for better visualization
  const eventsByYear = events.reduce((acc, event, index) => {
    const year = event.year;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push({ ...event, originalIndex: index });
    return acc;
  }, {} as Record<string, Array<TimelineEvent & { originalIndex: number }>>);

  const years = Object.keys(eventsByYear).sort((a, b) => parseInt(a) - parseInt(b));
  const visibleYears = years.slice(visibleRange.start, visibleRange.end);

  const getEventTypeColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'battle':
        return 'from-red-500 to-red-700';
      case 'political':
        return 'from-blue-500 to-blue-700';
      case 'liberation':
        return 'from-green-500 to-green-700';
      case 'tragedy':
        return 'from-gray-500 to-gray-700';
      default:
        return 'from-amber-500 to-amber-700';
    }
  };

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'battle':
        return '⚔️';
      case 'political':
        return '📜';
      case 'liberation':
        return '🕊️';
      case 'tragedy':
        return '💔';
      default:
        return '📅';
    }
  };

  const scrollTimeline = (direction: 'left' | 'right') => {
    if (direction === 'left' && visibleRange.start > 0) {
      setVisibleRange(prev => ({
        start: prev.start - 1,
        end: prev.end - 1
      }));
    } else if (direction === 'right' && visibleRange.end < years.length) {
      setVisibleRange(prev => ({
        start: prev.start + 1,
        end: prev.end + 1
      }));
    }
  };

  useEffect(() => {
    if (timelineRef.current && visibleRange.start > 0) {
      timelineRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [visibleRange]);

  return (
    <div className={cn("w-full", className)}>
      {/* Timeline Navigation */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => scrollTimeline('left')}
            disabled={visibleRange.start === 0}
            className="border-amber-highlight text-amber-highlight hover:bg-amber-highlight hover:text-background"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">
              {visibleYears[0]} - {visibleYears[visibleYears.length - 1]}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => scrollTimeline('right')}
            disabled={visibleRange.end >= years.length}
            className="border-amber-highlight text-amber-highlight hover:bg-amber-highlight hover:text-background"
          >
            Próximo
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {years.length} períodos • {events.length} eventos
        </div>
      </div>

      {/* Git-style Timeline */}
      <div ref={timelineRef} className="relative overflow-hidden">
        {/* Main timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-highlight via-military-olive to-sepia-dark opacity-60"></div>
        
        {/* Year nodes and branches */}
        <div className="space-y-12">
          {visibleYears.map((year, yearIndex) => {
            const yearEvents = eventsByYear[year];
            return (
              <div key={year} className="relative">
                {/* Year marker */}
                <div className="flex items-center mb-6">
                  <div className="relative z-10">
                    <div className="w-6 h-6 rounded-full bg-amber-highlight border-4 border-background shadow-glow flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-background"></div>
                    </div>
                  </div>
                  <div className="ml-4 bg-card border border-sepia-medium rounded-lg px-4 py-2 shadow-vintage">
                    <h3 className="text-lg font-bold text-amber-highlight">{year}</h3>
                  </div>
                </div>

                {/* Events for this year */}
                <div className="ml-16 space-y-4">
                  {yearEvents.map((event, eventIndex) => {
                    const isSelected = selectedEvent === event.originalIndex;
                    return (
                      <div key={event.originalIndex} className="relative">
                        {/* Branch line */}
                        <div className="absolute -left-14 top-6 w-12 h-0.5 bg-gradient-to-r from-military-olive to-amber-highlight opacity-60"></div>
                        
                        {/* Event node */}
                        <div className={`absolute -left-16 top-4 w-4 h-4 rounded-full bg-gradient-to-r ${getEventTypeColor(event.type)} border-2 border-background shadow-glow`}></div>
                        
                        {/* Event card */}
                        <Card 
                          className={cn(
                            "cursor-pointer transition-all duration-300 hover:shadow-glow hover:scale-[1.02] border-sepia-medium",
                            isSelected && "ring-2 ring-amber-highlight shadow-glow scale-[1.02]"
                          )}
                          onClick={() => setSelectedEvent(isSelected ? null : event.originalIndex)}
                        >
                          <div className="p-6">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl" role="img" aria-label={event.type}>
                                  {getEventIcon(event.type)}
                                </span>
                                <div>
                                  <h4 className="font-display font-semibold text-foreground">
                                    {event.title}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">{event.date}</p>
                                </div>
                              </div>
                              <div className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r",
                                getEventTypeColor(event.type),
                                "text-white"
                              )}>
                                {translateEventType(event.type)}
                              </div>
                            </div>
                            
                            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                              {event.description}
                            </p>
                            
                            {((event.enrichedMovies && event.enrichedMovies.length > 0) || (event.movies && event.movies.length > 0)) && (
                              <div className="border-t border-sepia-medium pt-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <Film className="h-4 w-4 text-amber-highlight" />
                                  <span className="text-sm font-semibold text-amber-highlight">
                                    {(event.enrichedMovies?.length || event.movies?.length || 0)} filme{(event.enrichedMovies?.length || event.movies?.length || 0) > 1 ? 's' : ''}
                                  </span>
                                  {event.enrichedMovies && (
                                    <span className="text-xs text-muted-foreground">
                                      • com dados TMDB
                                    </span>
                                  )}
                                </div>
                                
                                {isSelected && (
                                  <div className="space-y-2 mt-3">
                                    {event.enrichedMovies ? (
                                      // Show enriched movies with TMDB data
                                      event.enrichedMovies.map((movie, movieIndex) => (
                                        <EnrichedMovieCard
                                          key={movieIndex}
                                          title={movie.title}
                                          year={movie.year}
                                          director={movie.director}
                                          tmdbData={movie.tmdbData}
                                          loading={movie.loading}
                                          error={movie.error}
                                          isExpanded={true}
                                        />
                                      ))
                                    ) : (
                                      // Fallback to basic movie display
                                      event.movies?.map((movie, movieIndex) => (
                                        <EnrichedMovieCard
                                          key={movieIndex}
                                          title={movie.title}
                                          year={movie.year}
                                          director={movie.director}
                                          isExpanded={true}
                                        />
                                      ))
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Timeline progress indicator */}
        <div className="mt-8 bg-card border border-sepia-medium rounded-lg p-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Progresso da Timeline</span>
            <span>{Math.round(((visibleRange.start + visibleYears.length) / years.length) * 100)}%</span>
          </div>
          <div className="w-full bg-sepia-medium rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-amber-highlight to-military-olive h-2 rounded-full transition-all duration-300"
              style={{ width: `${((visibleRange.start + visibleYears.length) / years.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => scrollTimeline('left')}
            disabled={visibleRange.start === 0}
            className="border-amber-highlight text-amber-highlight hover:bg-amber-highlight hover:text-background"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
          
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <span>
              {visibleYears[0]} - {visibleYears[visibleYears.length - 1]}
            </span>
          </div>
          
          <Button
            variant="outline"
            onClick={() => scrollTimeline('right')}
            disabled={visibleRange.end >= years.length}
            className="border-amber-highlight text-amber-highlight hover:bg-amber-highlight hover:text-background"
          >
            Próximo
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GitTimeline;