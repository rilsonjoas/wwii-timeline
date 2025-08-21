import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GitTimeline from "@/components/ui/git-timeline";
import { eventsService, type TimelineEvent } from "@/lib/firestore";
import { migrateDataToFirestore } from "@/utils/migrateData";
import { FirebaseSetupBanner } from "@/components/FirebaseSetupBanner";
import { Search, Filter, Calendar, Film, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Timeline = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [movieSearch, setMovieSearch] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingLocalData, setUsingLocalData] = useState(false);

  // Carregar eventos do Firebase
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Tentar carregar eventos do Firebase
        let firebaseEvents;
        try {
          firebaseEvents = await eventsService.getEvents();
        } catch (firebaseError) {
          if (firebaseError.code === 'permission-denied') {
            console.warn('⚠️ Permissões do Firestore não configuradas. Usando dados locais temporariamente.');
            // Fallback para dados locais
            const { sampleWWIIEvents } = await import('@/data/sampleEvents');
            setEvents(sampleWWIIEvents);
            setUsingLocalData(true);
            setLoading(false);
            return;
          } else {
            throw firebaseError;
          }
        }
        
        // Se não há eventos, fazer a migração
        if (firebaseEvents.length === 0) {
          console.log('Nenhum evento encontrado no Firebase. Iniciando migração...');
          await migrateDataToFirestore();
          const migratedEvents = await eventsService.getEvents();
          setEvents(migratedEvents);
        } else {
          setEvents(firebaseEvents);
        }
      } catch (err) {
        console.error('Erro ao carregar eventos:', err);
        setError('Erro ao carregar eventos do banco de dados');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Filter events based on search criteria
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = searchTerm === "" || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesMovieSearch = movieSearch === "" ||
        event.movies?.some(movie => 
          movie.title.toLowerCase().includes(movieSearch.toLowerCase()) ||
          movie.director?.toLowerCase().includes(movieSearch.toLowerCase())
        );
      
      const matchesPeriod = selectedPeriod === "all" || event.year === selectedPeriod;
      
      const matchesType = selectedType === "all" || event.type === selectedType;
      
      return matchesSearch && matchesMovieSearch && matchesPeriod && matchesType;
    });
  }, [searchTerm, movieSearch, selectedPeriod, selectedType]);

  // Get unique years for period filter
  const periods = useMemo(() => {
    const years = events.map(event => event.year);
    return [...new Set(years)].sort();
  }, [events]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-sepia-medium bg-gradient-to-r from-background to-card">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/")}
                className="border-amber-highlight text-amber-highlight hover:bg-amber-highlight hover:text-background"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-3xl font-display font-bold bg-gradient-accent bg-clip-text text-transparent">
                  Timeline WWII Interativa
                </h1>
                <p className="text-muted-foreground">
                  Explore a Segunda Guerra Mundial através do cinema
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-sepia-medium focus:border-amber-highlight"
              />
            </div>

            <div className="relative">
              <Film className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar filmes..."
                value={movieSearch}
                onChange={(e) => setMovieSearch(e.target.value)}
                className="pl-10 border-sepia-medium focus:border-amber-highlight"
              />
            </div>

            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="border-sepia-medium focus:border-amber-highlight">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os períodos</SelectItem>
                {periods.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="border-sepia-medium focus:border-amber-highlight">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="battle">Batalhas</SelectItem>
                <SelectItem value="political">Políticos</SelectItem>
                <SelectItem value="liberation">Libertação</SelectItem>
                <SelectItem value="tragedy">Tragédias</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Mostrando {filteredEvents.length} de {events.length} eventos
            </p>
            {(searchTerm || movieSearch || selectedPeriod !== "all" || selectedType !== "all") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setMovieSearch("");
                  setSelectedPeriod("all");
                  setSelectedType("all");
                }}
                className="text-amber-highlight border-amber-highlight hover:bg-amber-highlight hover:text-background"
              >
                Limpar filtros
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Timeline Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {usingLocalData && <FirebaseSetupBanner />}
        {loading ? (
          <Card className="bg-card border-sepia-medium p-12 text-center">
            <div className="max-w-md mx-auto">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-amber-highlight" />
              <h3 className="text-xl font-display font-semibold mb-2">
                Carregando eventos...
              </h3>
              <p className="text-muted-foreground">
                Conectando com o banco de dados Firebase
              </p>
            </div>
          </Card>
        ) : error ? (
          <Card className="bg-card border-sepia-medium p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-display font-semibold mb-2 text-destructive">
                Erro ao carregar dados
              </h3>
              <p className="text-muted-foreground mb-4">
                {error}
              </p>
              <Button 
                onClick={() => window.location.reload()}
                className="bg-military-olive hover:bg-olive-light"
              >
                Tentar novamente
              </Button>
            </div>
          </Card>
        ) : filteredEvents.length > 0 ? (
          <GitTimeline events={filteredEvents} />
        ) : (
          <Card className="bg-card border-sepia-medium p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-display font-semibold mb-2">
                Nenhum evento encontrado
              </h3>
              <p className="text-muted-foreground mb-4">
                Tente ajustar os filtros ou termos de busca para encontrar eventos.
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setMovieSearch("");
                  setSelectedPeriod("all");
                  setSelectedType("all");
                }}
                className="bg-military-olive hover:bg-olive-light"
              >
                Mostrar todos os eventos
              </Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Timeline;