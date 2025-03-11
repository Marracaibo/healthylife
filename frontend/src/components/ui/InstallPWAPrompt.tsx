import React, { useState, useEffect } from 'react';
import { Button, Snackbar, Box, Typography } from '@mui/material';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed', platform: string }>;
}

const InstallPWAPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Intercetta l'evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      // Previeni la visualizzazione automatica del prompt
      e.preventDefault();
      // Salva l'evento per poterlo attivare più tardi
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Mostra il nostro prompt personalizzato
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (!deferredPrompt) return;

    // Mostra il prompt di installazione nativo
    deferredPrompt.prompt();

    // Attendi la scelta dell'utente
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('Utente ha accettato l\'installazione');
      } else {
        console.log('Utente ha rifiutato l\'installazione');
      }
      // Resetta lo stato
      setDeferredPrompt(null);
      setShowPrompt(false);
    });
  };

  const handleClose = () => {
    setShowPrompt(false);
  };

  return (
    <Snackbar
      open={showPrompt}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Box sx={{
        bgcolor: 'background.paper',
        p: 2,
        borderRadius: 1,
        boxShadow: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: 400
      }}>
        <Typography variant="body1">
          Installa l'app per un'esperienza migliore
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleInstallClick}
          size="small"
          sx={{ ml: 2 }}
        >
          Installa
        </Button>
      </Box>
    </Snackbar>
  );
};

export default InstallPWAPrompt;