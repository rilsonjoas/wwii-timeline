import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Github, Film, Calendar, Users, Target, Code, Database, Send, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  const technologies = [
    { name: "React", description: "Framework principal da aplicação" },
    { name: "TypeScript", description: "Tipagem estática para maior confiabilidade" },
    { name: "Vite", description: "Build tool moderna e rápida" },
    { name: "Firebase", description: "Backend como serviço para dados em tempo real" },
    { name: "Tailwind CSS", description: "Framework CSS utilitário" },
    { name: "Radix UI", description: "Componentes acessíveis e customizáveis" },
  ];

  const features = [
    {
      icon: Calendar,
      title: "Timeline Interativa",
      description: "Navegue através dos anos da guerra de forma visual e intuitiva"
    },
    {
      icon: Film,
      title: "Filmes Relacionados",
      description: "Descubra filmes e séries sobre cada evento histórico"
    },
    {
      icon: Database,
      title: "Dados em Tempo Real",
      description: "Informações atualizadas dinamicamente via Firebase"
    },
    {
      icon: Target,
      title: "Filtros Avançados",
      description: "Filtre por tipo de evento, período e filmes específicos"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-sepia-medium bg-gradient-to-r from-background to-card">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-6">
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
                Sobre o Projeto
              </h1>
              <p className="text-muted-foreground">
                Conheça a história e tecnologia por trás do WWII Timeline
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Project Overview */}
        <Card className="bg-card border-sepia-medium p-8">
          <div className="flex items-start gap-6">
            <div className="p-3 rounded-lg bg-gradient-to-r from-amber-highlight to-military-olive">
              <Film className="h-8 w-8 text-background" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-display font-bold mb-4">
                WWII Timeline: História Através do Cinema
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                O WWII Timeline é uma aplicação web interativa que apresenta os principais eventos 
                da Segunda Guerra Mundial organizados cronologicamente, com uma coleção cuidadosamente 
                selecionada de filmes e séries que retratam cada momento histórico.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                O projeto combina educação histórica com entretenimento cinematográfico, 
                oferecendo uma experiência única para estudantes, professores e entusiastas 
                da história que desejam explorar este período crucial através das lentes do cinema.
              </p>
            </div>
          </div>
        </Card>

        {/* Features */}
        <div>
          <h3 className="text-xl font-display font-semibold mb-6 text-center">
            Principais Funcionalidades
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="bg-card border-sepia-medium p-6 hover:shadow-glow transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-amber-highlight/10">
                      <IconComponent className="h-6 w-6 text-amber-highlight" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Technologies */}
        <Card className="bg-card border-sepia-medium p-8">
          <div className="flex items-center gap-3 mb-6">
            <Code className="h-6 w-6 text-amber-highlight" />
            <h3 className="text-xl font-display font-semibold">
              Tecnologias Utilizadas
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {technologies.map((tech, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-sepia-medium hover:bg-background/50 transition-colors">
                <div>
                  <Badge variant="secondary" className="mb-1">
                    {tech.name}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {tech.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Team & Credits */}
        <Card className="bg-card border-sepia-medium p-8">
          <div className="flex items-center gap-3 mb-6">
            <Users className="h-6 w-6 text-amber-highlight" />
            <h3 className="text-xl font-display font-semibold">
              Desenvolvimento
            </h3>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground mb-6">
              Este projeto foi desenvolvido com o objetivo de demonstrar conhecimentos em 
              desenvolvimento web moderno, integração com bancos de dados em tempo real 
              e design de interfaces intuitivas e acessíveis.
            </p>
            
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="border-amber-highlight text-amber-highlight hover:bg-amber-highlight hover:text-background"
                onClick={() => window.open('https://github.com', '_blank')}
              >
                <Github className="h-4 w-4 mr-2" />
                Ver no GitHub
              </Button>
            </div>
          </div>
        </Card>

        {/* Historical Note */}
        <Card className="bg-gradient-to-r from-amber-highlight/5 to-military-olive/5 border-amber-highlight/20 p-8">
          <div className="text-center">
            <h3 className="text-xl font-display font-semibold mb-4">
              Nota Histórica
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Este projeto tem fins educacionais e de entretenimento. As informações históricas 
              apresentadas são baseadas em fontes confiáveis, mas sempre recomendamos a consulta 
              a múltiplas fontes acadêmicas para um estudo mais aprofundado dos eventos da 
              Segunda Guerra Mundial.
            </p>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-sepia-medium bg-card mt-12 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-3 text-amber-highlight">Links Rápidos</h4>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/')}
                  className="block text-muted-foreground hover:text-amber-highlight transition-colors cursor-pointer"
                >
                  Página Inicial
                </button>
                <a 
                  href="https://firebase.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-muted-foreground hover:text-amber-highlight transition-colors flex items-center gap-1"
                >
                  Firebase
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Contribute */}
            <div>
              <h4 className="font-semibold mb-3 text-amber-highlight">Contribua</h4>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('mailto:sugestoes@wwii-timeline.com?subject=Sugestão de Filme/Série&body=Olá! Gostaria de sugerir um filme ou série para ser incluído na timeline:%0A%0ATítulo: %0AAno: %0AEvento relacionado: %0AMotivo da sugestão: ', '_blank')}
                  className="w-full justify-start border-amber-highlight text-amber-highlight hover:bg-amber-highlight hover:text-background text-xs"
                >
                  <Send className="h-3 w-3 mr-2" />
                  Sugerir Filme
                </Button>
              </div>
            </div>

            {/* Tech Stack */}
            <div>
              <h4 className="font-semibold mb-3 text-amber-highlight">Tecnologias</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-background rounded border border-sepia-medium text-xs">React</span>
                <span className="px-2 py-1 bg-background rounded border border-sepia-medium text-xs">Firebase</span>
                <span className="px-2 py-1 bg-background rounded border border-sepia-medium text-xs">TypeScript</span>
              </div>
            </div>
          </div>

          <div className="border-t border-sepia-medium pt-6 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 WWII Timeline. Desenvolvido para fins educacionais.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;