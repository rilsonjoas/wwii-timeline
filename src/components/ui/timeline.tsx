import React from "react";
import { cn } from "@/lib/utils";
import { translateEventType } from "@/utils/translations";

interface TimelineEvent {
  id?: string;
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

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

const Timeline: React.FC<TimelineProps> = ({ events, className }) => {
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

  return (
    <div className={cn("relative", className)}>
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-highlight via-military-olive to-sepia-dark"></div>
      
      <div className="space-y-12">
        {events.map((event, index) => (
          <div key={event.id || `${event.year}-${index}`} className="relative flex items-start">
            {/* Timeline dot */}
            <div className="absolute left-6 w-4 h-4 rounded-full bg-amber-highlight border-2 border-background shadow-glow animate-timeline-pulse"></div>
            
            {/* Event content */}
            <div className="ml-16 group">
              <div className="bg-card border border-sepia-medium rounded-lg p-6 shadow-vintage hover:shadow-glow transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl" role="img" aria-label={event.type}>
                    {getEventIcon(event.type)}
                  </span>
                  <div>
                    <span className="text-amber-highlight font-semibold text-lg">{event.year}</span>
                    <p className="text-muted-foreground text-sm">{event.date}</p>
                  </div>
                </div>
                
                <h3 className="text-xl font-display font-semibold mb-2 text-foreground">
                  {event.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {event.description}
                </p>
                
                {event.movies && event.movies.length > 0 && (
                  <div className="border-t border-sepia-medium pt-4">
                    <h4 className="text-sm font-semibold text-amber-highlight mb-2">
                      📽️ Filmes relacionados:
                    </h4>
                    <div className="space-y-1">
                      {event.movies.map((movie, movieIndex) => (
                        <div key={movieIndex} className="flex items-center justify-between text-sm">
                          <span className="text-foreground font-medium">{movie.title}</span>
                          <span className="text-muted-foreground">({movie.year})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;