import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Timeline from "@/components/ui/timeline";
import { sampleWWIIEvents } from "@/data/sampleEvents";
import { Film, Clock, BookOpen, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-background.jpg";

const Index = () => {
  const navigate = useNavigate();
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
              onClick={() => navigate('/timeline')}
              className="bg-military-olive hover:bg-olive-light text-foreground font-semibold px-8 py-4 rounded-lg shadow-vintage hover:shadow-glow transition-all duration-300"
            >
              <Film className="mr-2 h-5 w-5" />
              Explorar Timeline
            </Button>
            <Button variant="outline" size="lg" className="border-amber-highlight text-amber-highlight hover:bg-amber-highlight hover:text-background font-semibold px-8 py-4 rounded-lg transition-all duration-300">
              <BookOpen className="mr-2 h-5 w-5" />
              Sobre o Projeto
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <Card className="bg-card/80 backdrop-blur-sm border-sepia-medium p-6">
              <div className="text-2xl font-bold text-amber-highlight mb-2">100+</div>
              <div className="text-sm text-muted-foreground">Filmes mapeados</div>
            </Card>
            <Card className="bg-card/80 backdrop-blur-sm border-sepia-medium p-6">
              <div className="text-2xl font-bold text-amber-highlight mb-2">6 anos</div>
              <div className="text-sm text-muted-foreground">De história detalhada</div>
            </Card>
            <Card className="bg-card/80 backdrop-blur-sm border-sepia-medium p-6">
              <div className="text-2xl font-bold text-amber-highlight mb-2">50+</div>
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

      {/* Timeline Preview */}
      <section className="py-20 px-6 bg-gradient-timeline">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Preview da Timeline</h2>
            <p className="text-xl text-muted-foreground">
              Veja alguns dos momentos mais marcantes da Segunda Guerra Mundial
            </p>
          </div>

          <Timeline events={sampleWWIIEvents} className="max-w-3xl mx-auto" />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-sepia-medium py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-display font-bold mb-4">WWII Timeline</h3>
          <p className="text-muted-foreground mb-6">
            Conectando história e cinema para uma experiência educativa única
          </p>
          <div className="w-16 h-1 bg-amber-highlight mx-auto"></div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
