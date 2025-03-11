import React, { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';

const OfflineNotification: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    // Funzione per gestire lo stato online/offline
    const handleOnlineStatusChange = () => {
      setIsOffline(!navigator.onLine);
    };

    // Aggiungi event listener
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  return (
    <Snackbar 
      open={isOffline} 
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert severity="warning" sx={{ width: '100%' }}>
        Sei offline. Alcune funzionalità potrebbero non essere disponibili.
      </Alert>
    </Snackbar>
  );
};

export default OfflineNotification;