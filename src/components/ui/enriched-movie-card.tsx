import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Play, ExternalLink, User, Calendar, Film } from "lucide-react";
import type { EnrichedMovieData } from "@/lib/tmdb";
import { translateGenres } from "@/utils/translations";

interface EnrichedMovieCardProps {
  title: string;
  year: number;
  director?: string;
  tmdbData?: EnrichedMovieData;
  loading?: boolean;
  error?: string;
  isExpanded?: boolean;
}

export const EnrichedMovieCard: React.FC<EnrichedMovieCardProps> = ({
  title,
  year,
  director,
  tmdbData,
  loading,
  error,
  isExpanded = false
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Use TMDB data if available, fallback to original data
  const displayTitle = tmdbData?.title || title;
  const displayYear = tmdbData ? new Date(tmdbData.releaseDate).getFullYear() : year;
  const displayDirector = tmdbData?.director || director;

  if (loading) {
    return (
      <div className="flex items-center justify-between p-3 bg-background rounded border border-sepia-medium animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-12 h-16 bg-sepia-medium rounded"></div>
          <div>
            <div className="h-4 w-32 bg-sepia-medium rounded mb-1"></div>
            <div className="h-3 w-24 bg-sepia-medium rounded"></div>
          </div>
        </div>
        <div className="h-6 w-12 bg-sepia-medium rounded"></div>
      </div>
    );
  }

  if (error && !tmdbData) {
    return (
      <div className="flex items-center justify-between p-3 bg-background rounded border border-sepia-medium opacity-75">
        <div className="flex items-center gap-3">
          <div className="w-12 h-16 bg-sepia-medium rounded flex items-center justify-center">
            <Film className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <span className="text-sm font-medium">{displayTitle}</span>
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <span>{displayYear}</span>
              {displayDirector && (
                <>
                  <span>•</span>
                  <span>{displayDirector}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleTrailerClick = () => {
    if (tmdbData?.trailerKey) {
      window.open(`https://www.youtube.com/watch?v=${tmdbData.trailerKey}`, '_blank');
    }
  };

  const handleIMDbClick = () => {
    if (tmdbData?.imdbId) {
      window.open(`https://www.imdb.com/title/${tmdbData.imdbId}`, '_blank');
    }
  };

  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${isExpanded ? 'ring-2 ring-amber-highlight' : ''}`}>
      <div className="flex gap-4 p-4">
        {/* Poster */}
        <div className="flex-shrink-0">
          {tmdbData?.posterPath && !imageError ? (
            <div className="relative w-16 h-24 rounded overflow-hidden bg-sepia-medium">
              <img
                src={tmdbData.posterPath}
                alt={`${displayTitle} poster`}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Film className="h-6 w-6 text-muted-foreground animate-pulse" />
                </div>
              )}
            </div>
          ) : (
            <div className="w-16 h-24 bg-sepia-medium rounded flex items-center justify-center">
              <Film className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Movie Info */}
        <div className="flex-grow min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="min-w-0 flex-grow">
              <h4 className="font-semibold text-sm leading-tight mb-1 truncate">
                {displayTitle}
              </h4>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{displayYear}</span>
                </div>
                {displayDirector && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span className="truncate max-w-24">{displayDirector}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Rating */}
            {tmdbData?.rating && (
              <div className="flex items-center gap-1 ml-2">
                <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                <span className="text-xs font-medium">{tmdbData.rating}</span>
              </div>
            )}
          </div>

          {/* Genres */}
          {tmdbData?.genres && tmdbData.genres.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {translateGenres(tmdbData.genres).slice(0, 2).map((genre, index) => (
                <Badge key={index} variant="secondary" className="text-xs px-2 py-0">
                  {genre}
                </Badge>
              ))}
            </div>
          )}

          {/* Overview (if expanded) */}
          {isExpanded && tmdbData?.overview && (
            <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-3">
              {tmdbData.overview}
            </p>
          )}

          {/* Cast (if expanded) */}
          {isExpanded && tmdbData?.cast && tmdbData.cast.length > 0 && (
            <div className="mb-3">
              <div className="text-xs font-medium mb-1">Elenco:</div>
              <div className="flex flex-wrap gap-1">
                {tmdbData.cast.slice(0, 3).map((actor, index) => (
                  <span key={index} className="text-xs text-muted-foreground">
                    {actor.name}
                    {index < Math.min(2, tmdbData.cast.length - 1) && ', '}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          {tmdbData && (
            <div className="flex gap-2">
              {tmdbData.trailerKey && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTrailerClick}
                  className="text-xs h-6 px-2"
                >
                  <Play className="h-3 w-3 mr-1" />
                  Trailer
                </Button>
              )}
              {tmdbData.imdbId && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleIMDbClick}
                  className="text-xs h-6 px-2"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  IMDb
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default EnrichedMovieCard;