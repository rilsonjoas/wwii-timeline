import { db } from '@/lib/firebase';
import { collection, getDocs, connectFirestoreEmulator, connectFirestoreEmulator as connectEmulator } from 'firebase/firestore';

export const testFirebaseConnection = async (): Promise<boolean> => {
  try {
    console.log('🔧 Testando conexão com Firebase...');
    
    // Teste simples: tentar acessar uma collection
    const testCollection = collection(db, 'test');
    console.log('✅ Collection criada com sucesso');
    
    // Tentar fazer uma query simples
    await getDocs(testCollection);
    console.log('✅ Query executada com sucesso');
    
    console.log('🎉 Firebase está funcionando corretamente!');
    return true;
  } catch (error) {
    console.error('❌ Erro na conexão com Firebase:');
    console.error('- Tipo:', error.constructor.name);
    console.error('- Código:', error.code);
    console.error('- Mensagem:', error.message);
    
    if (error.code === 'permission-denied') {
      console.error('🔐 PROBLEMA: Regras do Firestore não permitem acesso');
      console.error('📋 Solução: Configure as regras no Firebase Console');
    } else if (error.code === 'unauthenticated') {
      console.error('🔑 PROBLEMA: Não autenticado');
      console.error('📋 Solução: Verificar configurações de autenticação');
    } else if (error.code === 'unavailable') {
      console.error('🌐 PROBLEMA: Firestore indisponível');
      console.error('📋 Solução: Verificar conexão com internet');
    }
    
    return false;
  }
};

export const getFirebaseInfo = () => {
  console.log('🔍 Informações do Firebase:');
  console.log('- App:', db.app.name);
  console.log('- Project ID:', db.app.options.projectId);
  console.log('- Auth Domain:', db.app.options.authDomain);
};