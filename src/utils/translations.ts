/**
 * Utilitários de tradução para textos da aplicação
 */

export const eventTypeTranslations: Record<string, string> = {
  'battle': 'Batalha',
  'political': 'Político',
  'liberation': 'Libertação',
  'tragedy': 'Tragédia'
};

export const genreTranslations: Record<string, string> = {
  'Action': 'Ação',
  'Adventure': 'Aventura',
  'Animation': 'Animação',
  'Biography': 'Biografia',
  'Comedy': 'Comédia',
  'Crime': 'Crime',
  'Documentary': 'Documentário',
  'Drama': 'Drama',
  'Family': 'Família',
  'Fantasy': 'Fantasia',
  'History': 'História',
  'Horror': 'Terror',
  'Music': 'Música',
  'Mystery': 'Mistério',
  'Romance': 'Romance',
  'Science Fiction': 'Ficção Científica',
  'Thriller': 'Suspense',
  'War': 'Guerra',
  'Western': 'Faroeste'
};

/**
 * Traduz o tipo de evento para português
 */
export const translateEventType = (type: string): string => {
  return eventTypeTranslations[type] || type;
};

/**
 * Traduz gêneros de filmes para português
 */
export const translateGenre = (genre: string): string => {
  return genreTranslations[genre] || genre;
};

/**
 * Traduz uma lista de gêneros para português
 */
export const translateGenres = (genres: string[]): string[] => {
  return genres.map(genre => translateGenre(genre));
};