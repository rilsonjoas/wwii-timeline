import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Film, 
  Clock,
  MapPin,
  Zap,
  Target,
  Shield,
  Flame,
  Users,
  Award
} from "lucide-react";
import EnrichedMovieCard from "@/components/ui/enriched-movie-card";
import { translateEventType } from "@/utils/translations";

import type { EnrichedTimelineEvent } from "@/utils/enrichWithTMDB";

interface ImmersiveTimelineProps {
  events: EnrichedTimelineEvent[];
  className?: string;
}

const ImmersiveTimeline: React.FC<ImmersiveTimelineProps> = ({ events, className }) => {
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [currentYear, setCurrentYear] = useState<string>(events[0]?.year || "1939");
  const [timelinePosition, setTimelinePosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Group events by year for better visualization
  const eventsByYear = events.reduce((acc, event, index) => {
    const year = event.year;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push({ ...event, originalIndex: index });
    return acc;
  }, {} as Record<string, Array<EnrichedTimelineEvent & { originalIndex: number }>>);

  const years = Object.keys(eventsByYear).sort((a, b) => parseInt(a) - parseInt(b));
  const totalYears = years.length;

  // Get enhanced icons based on event type
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'battle':
        return <Target className="h-5 w-5" />;
      case 'political':
        return <Shield className="h-5 w-5" />;
      case 'liberation':
        return <Award className="h-5 w-5" />;
      case 'tragedy':
        return <Flame className="h-5 w-5" />;
      default:
        return <Zap className="h-5 w-5" />;
    }
  };

  // Get themed colors for different event types
  const getEventTheme = (type: string) => {
    switch (type) {
      case 'battle':
        return {
          bg: 'from-red-900/20 via-red-800/10 to-red-900/20',
          border: 'border-red-500/50',
          dot: 'bg-red-500',
          accent: 'text-red-400',
          glow: 'shadow-red-500/20'
        };
      case 'political':
        return {
          bg: 'from-blue-900/20 via-blue-800/10 to-blue-900/20',
          border: 'border-blue-500/50',
          dot: 'bg-blue-500',
          accent: 'text-blue-400',
          glow: 'shadow-blue-500/20'
        };
      case 'liberation':
        return {
          bg: 'from-green-900/20 via-green-800/10 to-green-900/20',
          border: 'border-green-500/50',
          dot: 'bg-green-500',
          accent: 'text-green-400',
          glow: 'shadow-green-500/20'
        };
      case 'tragedy':
        return {
          bg: 'from-orange-900/20 via-orange-800/10 to-orange-900/20',
          border: 'border-orange-500/50',
          dot: 'bg-orange-500',
          accent: 'text-orange-400',
          glow: 'shadow-orange-500/20'
        };
      default:
        return {
          bg: 'from-amber-900/20 via-amber-800/10 to-amber-900/20',
          border: 'border-amber-500/50',
          dot: 'bg-amber-500',
          accent: 'text-amber-400',
          glow: 'shadow-amber-500/20'
        };
    }
  };

  // Auto-play functionality
  const startAutoPlay = () => {
    if (intervalRef.current) return;
    
    setIsPlaying(true);
    intervalRef.current = setInterval(() => {
      setTimelinePosition(prev => {
        const nextPosition = prev + 1;
        if (nextPosition >= totalYears) {
          setIsPlaying(false);
          return 0;
        }
        setCurrentYear(years[nextPosition]);
        return nextPosition;
      });
    }, 3000);
  };

  const stopAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
  };

  const navigateToYear = (direction: 'prev' | 'next') => {
    stopAutoPlay();
    const currentIndex = years.indexOf(currentYear);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = Math.max(0, currentIndex - 1);
    } else {
      newIndex = Math.min(years.length - 1, currentIndex + 1);
    }
    
    setCurrentYear(years[newIndex]);
    setTimelinePosition(newIndex);
    setSelectedEvent(null);
  };

  const jumpToYear = (yearIndex: number) => {
    stopAutoPlay();
    setCurrentYear(years[yearIndex]);
    setTimelinePosition(yearIndex);
    setSelectedEvent(null);
  };

  // Calculate timeline progress
  const progressPercentage = totalYears > 0 ? ((timelinePosition + 1) / totalYears) * 100 : 0;

  // Current year events
  const currentYearEvents = eventsByYear[currentYear] || [];

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Set initial year
  useEffect(() => {
    if (years.length > 0 && !currentYear) {
      setCurrentYear(years[0]);
    }
  }, [years, currentYear]);

  return (
    <div className={cn("w-full space-y-8", className)}>
      {/* Time Travel Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-900/50 border border-amber-500/20 p-8">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/400')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Clock className="h-12 w-12 text-amber-400 animate-pulse" />
              <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl"></div>
            </div>
            
            <div>
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                {currentYear}
              </h2>
              <p className="text-slate-400 text-lg mt-1">
                {currentYearEvents.length} evento{currentYearEvents.length !== 1 ? 's' : ''} • Segunda Guerra Mundial
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="lg"
              onClick={isPlaying ? stopAutoPlay : startAutoPlay}
              className="border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 text-amber-400 backdrop-blur-sm"
            >
              {isPlaying ? (
                <>
                  <span className="h-4 w-4 bg-amber-400 rounded-sm mr-2 animate-pulse"></span>
                  Pausar Viagem
                </>
              ) : (
                <>
                  <span className="h-4 w-4 bg-amber-400 rounded-full mr-2"></span>
                  Viajar no Tempo
                </>
              )}
            </Button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-6 relative">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>1939 • Início da Guerra</span>
            <span>{Math.round(progressPercentage)}% Explorado</span>
            <span>1945 • Fim da Guerra</span>
          </div>
          <div className="h-3 bg-slate-800/50 rounded-full overflow-hidden border border-slate-700/50">
            <div 
              className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-1000 ease-out relative"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Year Navigator */}
      <div className="flex items-center justify-between bg-card/50 backdrop-blur border border-sepia-medium rounded-xl p-4">
        <Button
          variant="outline"
          onClick={() => navigateToYear('prev')}
          disabled={timelinePosition === 0}
          className="border-amber-highlight/30 hover:border-amber-highlight hover:bg-amber-highlight/10 disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          {years[timelinePosition - 1] || 'Anterior'}
        </Button>

        {/* Year dots navigator */}
        <div className="flex items-center space-x-2 overflow-x-auto max-w-md">
          {years.map((year, index) => {
            const isActive = index === timelinePosition;
            const isPast = index < timelinePosition;
            return (
              <button
                key={year}
                onClick={() => jumpToYear(index)}
                className={cn(
                  "relative flex-shrink-0 w-3 h-3 rounded-full border-2 transition-all duration-300 hover:scale-125",
                  isActive && "w-4 h-4 border-amber-400 bg-amber-400 shadow-lg shadow-amber-400/50",
                  isPast && !isActive && "border-amber-600/50 bg-amber-600/30",
                  !isPast && !isActive && "border-slate-600 hover:border-amber-400/50"
                )}
                title={year}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-amber-400 rounded-full animate-ping opacity-20"></div>
                )}
              </button>
            );
          })}
        </div>

        <Button
          variant="outline"
          onClick={() => navigateToYear('next')}
          disabled={timelinePosition === years.length - 1}
          className="border-amber-highlight/30 hover:border-amber-highlight hover:bg-amber-highlight/10 disabled:opacity-30"
        >
          {years[timelinePosition + 1] || 'Próximo'}
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Events Timeline */}
      <div className="relative">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-amber-400/20 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-amber-300/30 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
          <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-amber-500/25 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
        </div>

        {/* Main timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400/50 via-military-olive/30 to-amber-400/50 rounded-full"></div>
        
        <div className="space-y-8">
          {currentYearEvents.map((event, index) => {
            const theme = getEventTheme(event.type);
            const isExpanded = selectedEvent === event.originalIndex;
            
            return (
              <div key={event.originalIndex} className="relative animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                {/* Connection line */}
                <div className="absolute left-7 top-8 w-8 h-0.5 bg-gradient-to-r from-amber-400/60 to-transparent"></div>
                
                {/* Event marker */}
                <div className={cn(
                  "absolute left-4 top-6 w-6 h-6 rounded-full border-4 border-background flex items-center justify-center transition-all duration-500 z-10",
                  theme.dot,
                  isExpanded && "scale-125 shadow-2xl",
                  theme.glow
                )}>
                  <div className={cn("w-2 h-2 rounded-full", isExpanded ? "bg-background" : "bg-background/80")}></div>
                  {isExpanded && (
                    <div className={cn("absolute inset-0 rounded-full animate-ping", theme.dot, "opacity-20")}></div>
                  )}
                </div>

                {/* Event Card */}
                <div className="ml-16">
                  <Card
                    className={cn(
                      "cursor-pointer transition-all duration-500 hover:scale-[1.02] backdrop-blur-sm",
                      "bg-gradient-to-br", theme.bg,
                      theme.border,
                      isExpanded && "ring-2 ring-amber-400/50 shadow-2xl",
                      theme.glow
                    )}
                    onClick={() => setSelectedEvent(isExpanded ? null : event.originalIndex)}
                  >
                    <div className="p-6">
                      {/* Event Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className={cn(
                            "w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-colors duration-300",
                            theme.border, theme.accent
                          )}>
                            {getEventIcon(event.type)}
                          </div>
                          
                          <div>
                            <h3 className="text-xl font-bold text-foreground mb-1 leading-tight">
                              {event.title}
                            </h3>
                            <div className="flex items-center space-x-3 text-sm">
                              <div className="flex items-center space-x-1 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>{event.date}</span>
                              </div>
                              <div className={cn(
                                "px-3 py-1 rounded-full text-xs font-medium border",
                                theme.border, theme.accent
                              )}>
                                {translateEventType(event.type)}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Expand indicator */}
                        <div className={cn(
                          "transition-transform duration-300",
                          isExpanded && "rotate-180"
                        )}>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>

                      {/* Event Description */}
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {event.description}
                      </p>

                      {/* Movies Section */}
                      {((event.enrichedMovies && event.enrichedMovies.length > 0) || (event.movies && event.movies.length > 0)) && (
                        <div className="border-t border-current/10 pt-4">
                          <div className="flex items-center space-x-2 mb-3">
                            <Film className="h-4 w-4 text-amber-400" />
                            <span className="text-sm font-semibold text-amber-400">
                              {(event.enrichedMovies?.length || event.movies?.length || 0)} filme{(event.enrichedMovies?.length || event.movies?.length || 0) > 1 ? 's' : ''} relacionado{(event.enrichedMovies?.length || event.movies?.length || 0) > 1 ? 's' : ''}
                            </span>
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                              <span className="text-xs text-muted-foreground">TMDB integrado</span>
                            </div>
                          </div>
                          
                          {isExpanded && (
                            <div className="grid gap-4 mt-4 animate-fade-in">
                              {event.enrichedMovies ? (
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
              </div>
            );
          })}
        </div>
      </div>

      {/* Historical Context Footer */}
      <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 border border-amber-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <MapPin className="h-5 w-5 text-amber-400" />
            <div>
              <h4 className="font-semibold text-amber-400">Contexto Histórico</h4>
              <p className="text-sm text-slate-400">
                Ano {currentYear} • {currentYearEvents.length} eventos documentados
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-slate-400">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>{events.length} eventos totais</span>
            </div>
            <div className="flex items-center space-x-2">
              <Film className="h-4 w-4" />
              <span>{events.reduce((acc, event) => acc + (event.enrichedMovies?.length || event.movies?.length || 0), 0)} filmes catalogados</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImmersiveTimeline;