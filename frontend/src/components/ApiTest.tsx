import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import exerciseAPI from '../services/exerciseAPI';

const ApiTest: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{success: boolean; message: string} | null>(null);
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    // Ottieni la chiave API dall'env
    const key = import.meta.env.VITE_RAPIDAPI_KEY || '';
    setApiKey(key ? key.substring(0, 5) + '...' + key.substring(key.length - 5) : 'Non impostata');
  }, []);

  const testApi = async () => {
    setLoading(true);
    setTestResult(null);
    
    try {
      const success = await exerciseAPI.testConnection();
      
      if (success) {
        setTestResult({
          success: true,
          message: 'Connessione all\'API riuscita! L\'API è configurata correttamente.'
        });
      } else {
        setTestResult({
          success: false,
          message: 'La connessione all\'API ha fallito. Controlla la console per i dettagli.'
        });
      }
    } catch (error) {
      console.error('Error testing API:', error);
      setTestResult({
        success: false,
        message: `Errore durante il test dell'API: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Test Connessione API ExerciseDB
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" gutterBottom>
          Questo componente verifica se la tua connessione all'API ExerciseDB funziona correttamente.
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          <strong>Chiave API:</strong> {apiKey}
        </Typography>
        
        <Typography variant="body2" color="text.secondary">
          <strong>Base URL:</strong> {exerciseAPI['baseUrl']}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Button 
          variant="contained" 
          onClick={testApi}
          disabled={loading}
        >
          {loading ? 'Testing...' : 'Test Connessione API'}
        </Button>
      </Box>
      
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
      
      {testResult && (
        <Alert severity={testResult.success ? 'success' : 'error'} sx={{ mt: 2 }}>
          {testResult.message}
        </Alert>
      )}
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle2" gutterBottom>
          Istruzioni per risolvere problemi:
        </Typography>
        <ol>
          <li>
            <Typography variant="body2">
              Assicurati di esserti iscritto al piano Basic (gratuito) di ExerciseDB su RapidAPI
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              Verifica che la chiave API nel file .env sia corretta
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              Controlla la console del browser per eventuali errori dettagliati
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              Riavvia l'applicazione dopo aver apportato modifiche al file .env
            </Typography>
          </li>
        </ol>
      </Box>
    </Paper>
  );
};

export default ApiTest;
