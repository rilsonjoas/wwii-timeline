import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GitTimeline from "@/components/ui/git-timeline";
import ImmersiveTimeline from "@/components/ui/immersive-timeline";
import { eventsService, type TimelineEvent } from "@/lib/firestore";
import { migrateDataToFirestore } from "@/utils/migrateData";
import { FirebaseSetupBanner } from "@/components/FirebaseSetupBanner";
import { enrichEventsWithTMDB, getTMDBEnrichmentStats, type EnrichedTimelineEvent } from "@/utils/enrichWithTMDB";
import { Film, Clock, BookOpen, Zap, Search, Filter, Calendar, Loader2, Github, Mail, ExternalLink, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-background.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [movieSearch, setMovieSearch] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [events, setEvents] = useState<EnrichedTimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingLocalData, setUsingLocalData] = useState(false);
  const [tmdbEnriching, setTmdbEnriching] = useState(false);

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
          await migrateDataToFirestore();
          const migratedEvents = await eventsService.getEvents();
          setEvents(migratedEvents);
        } else {
          setEvents(firebaseEvents);
        }
        
        setUsingLocalData(false);
        
        // Enriquecer com dados do TMDB após carregar os eventos
        if (firebaseEvents.length > 0) {
          setTmdbEnriching(true);
          try {
            console.log('🎬 Starting TMDB enrichment...');
            const enrichedEvents = await enrichEventsWithTMDB(firebaseEvents);
            setEvents(enrichedEvents);
            
            const stats = getTMDBEnrichmentStats(enrichedEvents);
            console.log('📊 TMDB Enrichment Stats:', stats);
          } catch (tmdbError) {
            console.error('❌ TMDB enrichment failed:', tmdbError);
            // Continue with non-enriched data
          } finally {
            setTmdbEnriching(false);
          }
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
  }, [events, searchTerm, movieSearch, selectedPeriod, selectedType]);

  // Get unique years for period filter
  const periods = useMemo(() => {
    const years = events.map(event => event.year);
    return [...new Set(years)].sort();
  }, [events]);

  // Calculate real statistics from data
  const stats = useMemo(() => {
    const totalMovies = events.reduce((count, event) => {
      return count + (event.movies?.length || 0);
    }, 0);
    
    const yearsSpan = events.length > 0 ? {
      start: parseInt(periods[0]) || 1939,
      end: parseInt(periods[periods.length - 1]) || 1945
    } : { start: 1939, end: 1945 };
    
    const yearsCount = yearsSpan.end - yearsSpan.start + 1;
    
    // Get TMDB enrichment stats
    const tmdbStats = getTMDBEnrichmentStats(events);
    
    const calculatedStats = {
      movies: totalMovies,
      years: yearsCount,
      events: events.length,
      tmdbEnriched: tmdbStats.enrichedMovies,
      tmdbSuccessRate: tmdbStats.successRate
    };
    
    // Log comparison and TMDB stats
    if (events.length > 0) {
      console.log('📊 === ESTATÍSTICAS DO HERO ===');
      console.log('🎬 Filmes:');
      console.log('  - Valor antigo: 100+');
      console.log(`  - Valor real: ${totalMovies}+`);
      console.log(`  - Com dados TMDB: ${tmdbStats.enrichedMovies}/${tmdbStats.totalMovies} (${tmdbStats.successRate}%)`);
      console.log('📅 Anos:');
      console.log('  - Valor antigo: 6 anos');
      console.log(`  - Valor real: ${yearsCount} anos (${yearsSpan.start}-${yearsSpan.end})`);
      console.log('📋 Eventos:');
      console.log('  - Valor antigo: 50+');
      console.log(`  - Valor real: ${events.length}`);
      console.log('✨ Os dados agora são calculados dinamicamente do Firebase e enriquecidos com TMDB!');
    }
    
    return calculatedStats;
  }, [events, periods]);

  // Scroll to timeline section
  const scrollToTimeline = () => {
    const timelineSection = document.getElementById('timeline-section');
    if (timelineSection) {
      timelineSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="WWII Timeline Hero Background"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-hero opacity-80"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="animate-float">
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 bg-gradient-accent bg-clip-text text-transparent">
              WWII Timeline
            </h1>
            <div className="w-24 h-1 bg-amber-highlight mx-auto mb-8 animate-glow"></div>
          </div>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
            Explore a Segunda Guerra Mundial através do cinema. Descubra filmes e séries que retratam 
            os momentos mais marcantes da história, organizados em uma linha do tempo interativa.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              onClick={scrollToTimeline}
              className="bg-military-olive hover:bg-olive-light text-foreground font-semibold px-8 py-4 rounded-lg shadow-vintage hover:shadow-glow transition-all duration-300"
            >
              <Film className="mr-2 h-5 w-5" />
              Explorar Timeline
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => navigate('/about')}
              className="border-amber-highlight text-amber-highlight hover:bg-amber-highlight hover:text-background font-semibold px-8 py-4 rounded-lg transition-all duration-300"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Sobre o Projeto
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <Card className="bg-card/80 backdrop-blur-sm border-sepia-medium p-6">
              <div className="text-2xl font-bold text-amber-highlight mb-2">
                {loading ? "..." : `${stats.movies}+`}
              </div>
              <div className="text-sm text-muted-foreground">Filmes mapeados</div>
            </Card>
            <Card className="bg-card/80 backdrop-blur-sm border-sepia-medium p-6">
              <div className="text-2xl font-bold text-amber-highlight mb-2">
                {loading ? "..." : `${stats.years} anos`}
              </div>
              <div className="text-sm text-muted-foreground">De história detalhada</div>
            </Card>
            <Card className="bg-card/80 backdrop-blur-sm border-sepia-medium p-6">
              <div className="text-2xl font-bold text-amber-highlight mb-2">
                {loading ? "..." : stats.events}
              </div>
              <div className="text-sm text-muted-foreground">Eventos históricos</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Como Funciona</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Navegue pela história e descubra como o cinema retrata os momentos decisivos da Segunda Guerra
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-card border-sepia-medium p-8 text-center hover:shadow-glow transition-all duration-300">
              <div className="bg-military-olive w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-foreground" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-4">Timeline Interativa</h3>
              <p className="text-muted-foreground">
                Navegue pelos anos de 1939-1945 e explore os eventos que moldaram o mundo
              </p>
            </Card>

            <Card className="bg-card border-sepia-medium p-8 text-center hover:shadow-glow transition-all duration-300">
              <div className="bg-amber-highlight w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Film className="h-8 w-8 text-background" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-4">Cinema & História</h3>
              <p className="text-muted-foreground">
                Descubra filmes e séries que retratam cada momento histórico com precisão
              </p>
            </Card>

            <Card className="bg-card border-sepia-medium p-8 text-center hover:shadow-glow transition-all duration-300">
              <div className="bg-sepia-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-foreground" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-4">Experiência Imersiva</h3>
              <p className="text-muted-foreground">
                Aprenda história de forma envolvente através da linguagem cinematográfica
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive Timeline */}
      <section id="timeline-section" className="py-20 px-6 bg-gradient-timeline">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Timeline Interativa</h2>
            <p className="text-xl text-muted-foreground">
              Explore todos os momentos marcantes da Segunda Guerra Mundial
            </p>
          </div>

          {/* Search and Filter Controls */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
            <div className="flex items-center justify-between">
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

          {/* Timeline Content */}
          {usingLocalData && <FirebaseSetupBanner />}
          
          {/* TMDB Enrichment Banner */}
          {tmdbEnriching && (
            <Card className="bg-blue-50 border-blue-200 p-4 mb-6">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">
                    🎬 Enriquecendo dados com TMDB
                  </h4>
                  <p className="text-blue-700 text-sm">
                    Buscando informações detalhadas dos filmes (posters, ratings, trailers)...
                  </p>
                </div>
              </div>
            </Card>
          )}
          
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
            <ImmersiveTimeline events={filteredEvents} />
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
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-sepia-medium bg-card py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Project Info */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-display font-bold mb-4 bg-gradient-accent bg-clip-text text-transparent">
                WWII Timeline
              </h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Conectando história e cinema para uma experiência educativa única. 
                Explore os momentos mais marcantes da Segunda Guerra Mundial através das lentes do cinema.
              </p>
              <div className="w-16 h-1 bg-amber-highlight mb-4"></div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 text-amber-highlight">Links Rápidos</h4>
              <div className="space-y-2">
                <button
                  onClick={scrollToTimeline}
                  className="block text-muted-foreground hover:text-amber-highlight transition-colors cursor-pointer"
                >
                  Timeline Interativa
                </button>
                <button
                  onClick={() => navigate('/about')}
                  className="block text-muted-foreground hover:text-amber-highlight transition-colors cursor-pointer"
                >
                  Sobre o Projeto
                </button>
                
              </div>
            </div>

            {/* Contact & Suggestions */}
            <div>
              <h4 className="font-semibold mb-4 text-amber-highlight">Contribua</h4>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('mailto:rilsonjoas10@gmail.com?subject=Sugestão de Filme/Série&body=Olá! Gostaria de sugerir um filme ou série para ser incluído na timeline:%0A%0ATítulo: %0AAno: %0AEvento relacionado: %0AMotivo da sugestão: ', '_blank')}
                  className="w-full justify-start border-amber-highlight text-amber-highlight hover:bg-amber-highlight hover:text-background"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Enviar sugestão
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://github.com/rilsonjoas/wwii-timeline', '_blank')}
                  className="w-full justify-start border-sepia-medium text-muted-foreground hover:border-amber-highlight hover:text-amber-highlight"
                >
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-sepia-medium pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-muted-foreground">
                &copy; 2025 WWII Timeline. Desenvolvido para fins educacionais.
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
