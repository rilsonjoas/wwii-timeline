import { sampleWWIIEvents } from '@/data/sampleEvents';
import { eventsService } from '@/lib/firestore';

export const migrateDataToFirestore = async (): Promise<void> => {
  try {
    console.log('🚀 Iniciando migração dos dados para o Firestore...');
    
    // Verificar se já existem dados
    const existingEvents = await eventsService.getEvents();
    
    if (existingEvents.length > 0) {
      console.log(`ℹ️  Já existem ${existingEvents.length} eventos no Firestore. Migração cancelada.`);
      return;
    }
    
    // Migrar cada evento
    let migratedCount = 0;
    
    for (const event of sampleWWIIEvents) {
      try {
        await eventsService.addEvent(event);
        migratedCount++;
        console.log(`✅ Evento migrado: ${event.title} (${event.year})`);
      } catch (error) {
        console.error(`❌ Erro ao migrar evento "${event.title}":`, error);
      }
    }
    
    console.log(`🎉 Migração concluída! ${migratedCount} de ${sampleWWIIEvents.length} eventos foram migrados com sucesso.`);
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    throw error;
  }
};