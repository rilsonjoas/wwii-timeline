import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X, ExternalLink } from 'lucide-react';

export const FirebaseSetupBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <Card className="bg-amber-50 border-amber-200 p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-amber-800 mb-1">
            🔧 Configuração do Firebase Necessária
          </h4>
          <p className="text-amber-700 text-sm mb-3">
            Atualmente usando dados locais. Para habilitar o Firebase, configure as regras do Firestore:
          </p>
          <div className="bg-amber-100 p-3 rounded-md mb-3 font-mono text-sm">
            <div className="text-amber-800 font-semibold mb-1">Regras do Firestore:</div>
            <pre className="text-amber-700 text-xs">{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /events/{document} {
      allow read, write: if true;
    }
  }
}`}</pre>
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              className="border-amber-300 text-amber-700 hover:bg-amber-100"
              onClick={() => window.open('https://console.firebase.google.com/project/wwii-timeline/firestore/rules', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Abrir Firebase Console
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => setIsVisible(false)}
              className="text-amber-600 hover:bg-amber-100"
            >
              <X className="h-4 w-4 mr-1" />
              Dispensar
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};