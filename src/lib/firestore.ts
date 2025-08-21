import { collection, getDocs, addDoc, query, orderBy, where } from 'firebase/firestore';
import { db } from './firebase';

export interface TimelineEvent {
  id?: string;
  year: string;
  date: string;
  title: string;
  description: string;
  type: 'battle' | 'political' | 'liberation' | 'tragedy';
  movies?: Array<{
    title: string;
    year: number;
    director?: string;
  }>;
}

const COLLECTION_NAME = 'events';

export const eventsService = {
  // Buscar todos os eventos
  async getEvents(): Promise<TimelineEvent[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('year', 'asc'));
      const querySnapshot = await getDocs(q);
      
      const events = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as TimelineEvent));
      return events;
    } catch (error) {
      console.error('❌ Erro detalhado ao buscar eventos:');
      console.error('- Tipo do erro:', error.constructor.name);
      console.error('- Mensagem:', error.message);
      console.error('- Código:', error.code);
      console.error('- Stack:', error.stack);
      throw error;
    }
  },

  // Adicionar um evento
  async addEvent(event: Omit<TimelineEvent, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), event);
      return docRef.id;
    } catch (error) {
      console.error('Erro ao adicionar evento:', error);
      throw error;
    }
  },

  // Buscar eventos filtrados
  async getFilteredEvents(filters: {
    type?: string;
    year?: string;
  }): Promise<TimelineEvent[]> {
    try {
      let q = query(collection(db, COLLECTION_NAME), orderBy('year', 'asc'));
      
      if (filters.type && filters.type !== 'all') {
        q = query(q, where('type', '==', filters.type));
      }
      
      if (filters.year && filters.year !== 'all') {
        q = query(q, where('year', '==', filters.year));
      }
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as TimelineEvent));
    } catch (error) {
      console.error('Erro ao buscar eventos filtrados:', error);
      throw error;
    }
  }
};