import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Calendar, Film } from "lucide-react";
import { translateEventType } from "@/utils/translations";

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
  type: 'battle' | 'political' | 'liberation' | 'tragedy';
}

interface HorizontalTimelineProps {
  events: TimelineEvent[];
  className?: string;
}

const HorizontalTimeline: React.FC<HorizontalTimelineProps> = ({ events, className }) => {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(events[0] || null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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

  const getEventColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'battle':
        return 'border-red-500 bg-red-500/10';
      case 'political':
        return 'border-blue-500 bg-blue-500/10';
      case 'liberation':
        return 'border-green-500 bg-green-500/10';
      case 'tragedy':
        return 'border-orange-500 bg-orange-500/10';
      default:
        return 'border-amber-highlight bg-amber-highlight/10';
    }
  };

  const updateScrollButtons = () => {
    if (timelineRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = timelineRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollToEvent = (index: number) => {
    if (timelineRef.current) {
      const eventElement = timelineRef.current.children[index] as HTMLElement;
      if (eventElement) {
        eventElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (timelineRef.current) {
      const scrollAmount = 300;
      timelineRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleEventClick = (event: TimelineEvent, index: number) => {
    setSelectedEvent(event);
    setCurrentIndex(index);
    scrollToEvent(index);
  };

  const navigateEvent = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? Math.max(0, currentIndex - 1)
      : Math.min(events.length - 1, currentIndex + 1);
    
    if (newIndex !== currentIndex) {
      setSelectedEvent(events[newIndex]);
      setCurrentIndex(newIndex);
      scrollToEvent(newIndex);
    }
  };

  useEffect(() => {
    updateScrollButtons();
    const timelineElement = timelineRef.current;
    if (timelineElement) {
      timelineElement.addEventListener('scroll', updateScrollButtons);
      return () => timelineElement.removeEventListener('scroll', updateScrollButtons);
    }
  }, [events]);

  useEffect(() => {
    if (events.length > 0 && !selectedEvent) {
      setSelectedEvent(events[0]);
      setCurrentIndex(0);
    }
  }, [events, selectedEvent]);

  if (events.length === 0) return null;

  return (
    <div className={cn("space-y-8", className)}>
      {/* Timeline Navigation */}
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-display font-bold">Linha do Tempo</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              className="border-amber-highlight text-amber-highlight hover:bg-amber-highlight hover:text-background disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              className="border-amber-highlight text-amber-highlight hover:bg-amber-highlight hover:text-background disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Horizontal Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-amber-highlight via-military-olive to-sepia-dark"></div>
          
          {/* Timeline Events */}
          <div 
            ref={timelineRef}
            className="flex gap-8 overflow-x-auto pb-4 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {events.map((event, index) => (
              <div
                key={`${event.year}-${index}`}
                className="flex-shrink-0 relative cursor-pointer group"
                onClick={() => handleEventClick(event, index)}
              >
                {/* Event Dot */}
                <div className={cn(
                  "w-8 h-8 rounded-full border-4 flex items-center justify-center text-sm transition-all duration-300 relative z-10",
                  selectedEvent === event 
                    ? "bg-amber-highlight border-background shadow-glow scale-125" 
                    : "bg-card border-amber-highlight hover:scale-110",
                  getEventColor(event.type)
                )}>
                  <span className="text-xs" role="img" aria-label={event.type}>
                    {getEventIcon(event.type)}
                  </span>
                </div>

                {/* Event Label */}
                <div className="mt-4 text-center max-w-24">
                  <div className={cn(
                    "text-sm font-semibold transition-colors duration-300",
                    selectedEvent === event ? "text-amber-highlight" : "text-muted-foreground"
                  )}>
                    {event.year}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {event.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Event Details */}
      {selectedEvent && (
        <Card className="bg-card border-sepia-medium p-8 animate-fade-in">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-full border-2 flex items-center justify-center text-2xl",
                getEventColor(selectedEvent.type)
              )}>
                <span role="img" aria-label={selectedEvent.type}>
                  {getEventIcon(selectedEvent.type)}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-bold text-amber-highlight">
                    {selectedEvent.year}
                  </span>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{selectedEvent.date}</span>
                  </div>
                </div>
                <h3 className="text-2xl font-display font-bold text-foreground">
                  {selectedEvent.title}
                </h3>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateEvent('prev')}
                disabled={currentIndex === 0}
                className="border-amber-highlight text-amber-highlight hover:bg-amber-highlight hover:text-background disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateEvent('next')}
                disabled={currentIndex === events.length - 1}
                className="border-amber-highlight text-amber-highlight hover:bg-amber-highlight hover:text-background disabled:opacity-50"
              >
                Próximo
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <p className="text-muted-foreground mb-6 leading-relaxed text-lg">
            {selectedEvent.description}
          </p>

          {/* Movies Section */}
          {selectedEvent.movies && selectedEvent.movies.length > 0 && (
            <div className="border-t border-sepia-medium pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Film className="h-5 w-5 text-amber-highlight" />
                <h4 className="text-lg font-semibold text-amber-highlight">
                  Filmes relacionados
                </h4>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedEvent.movies.map((movie, movieIndex) => (
                  <Card key={movieIndex} className="bg-background border-sepia-medium p-4 hover:shadow-glow transition-all duration-300">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-semibold text-foreground text-sm leading-tight">
                        {movie.title}
                      </h5>
                      <span className="text-amber-highlight font-medium text-sm">
                        {movie.year}
                      </span>
                    </div>
                    {movie.director && (
                      <p className="text-muted-foreground text-xs">
                        Dir: {movie.director}
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default HorizontalTimeline;