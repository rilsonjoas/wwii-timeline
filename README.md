# ⏰🎬 WWII Timeline

**Cinema e História da Segunda Guerra Mundial**

Uma timeline interativa que conecta a história da Segunda Guerra Mundial com suas representações cinematográficas. Explore eventos históricos e descubra filmes e séries que os retratam.

## ✨ Funcionalidades

- 📅 **Timeline Interativa**: Navegue cronologicamente pelos eventos de 1939-1945
- 🎭 **Conexão Cinema-História**: Descubra filmes e séries relacionados a cada evento
- 🔍 **Sistema de Busca**: Encontre eventos específicos ou produções audiovisuais
- 🎯 **Filtros Avançados**: Filtre por ano, tipo de evento, ou gênero cinematográfico
- 📱 **Interface Responsiva**: Experiência otimizada para todos os dispositivos
- 🎨 **Design Temático**: Interface com elementos visuais da época

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18 com TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Build**: Vite
- **Roteamento**: React Router DOM
- **Ícones**: Lucide React
- **Componentes**: Timeline horizontal customizada
- **Animações**: CSS transitions e transformations

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone <url-do-repositorio>

# Entre no diretório
cd wwii-timeline

# Instale as dependências
npm install

# Execute o projeto
npm run dev
```

O projeto estará disponível em `http://localhost:8080`

## 📁 Estrutura do Projeto

```
wwii-timeline/
├── src/
│   ├── components/
│   │   ├── ui/                 # Componentes de UI (shadcn/ui)
│   │   ├── timeline.tsx        # Componente de timeline vertical
│   │   └── horizontal-timeline.tsx  # Timeline horizontal
│   ├── pages/
│   │   ├── Index.tsx          # Página inicial
│   │   └── Timeline.tsx       # Página da timeline
│   ├── data/
│   │   └── sampleEvents.ts    # Dados dos eventos da WWII
│   ├── assets/                # Imagens e recursos
│   └── main.tsx              # Ponto de entrada
├── public/                    # Arquivos estáticos
└── index.html                # Template HTML
```

## 🎨 Design System

### Paleta de Cores
- **Militar**: Verde oliva (#6B7280, #374151)
- **Destacue**: Âmbar dourado (#F59E0B)
- **Gradientes**: Temáticos da época
- **Background**: Tons neutros históricos

### Elementos Visuais
- Tipografia com fontes display elegantes
- Gradientes que remetem à era militar
- Sombras e efeitos vintage
- Animações suaves e contextuais

## 📖 Scripts Disponíveis

- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa linting do código

## 📚 Fontes de Dados

Os eventos históricos e conexões cinematográficas são baseados em:
- Registros históricos oficiais da Segunda Guerra Mundial
- Bases de dados de filmes e séries históricas
- Análise de precisão histórica de produções audiovisuais

## 🤝 Contribuição

Contribuições são bem-vindas! Especialmente:

- Adição de novos eventos históricos
- Conexões com filmes/séries não catalogados
- Melhorias na timeline interativa
- Correções históricas

### Como Contribuir
1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/novo-evento`)
3. Commit suas mudanças (`git commit -m 'Adiciona evento da Batalha de Stalingrado'`)
4. Push para a branch (`git push origin feature/novo-evento`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🎯 Objetivos Educacionais

Este projeto tem como objetivo:
- Tornar a história da WWII mais acessível através do cinema
- Conectar entretenimento com educação histórica
- Promover o pensamento crítico sobre representações históricas
- Facilitar o estudo chronológico dos eventos

---

**Desenvolvido com 🎖️ para estudantes e entusiastas de história**
