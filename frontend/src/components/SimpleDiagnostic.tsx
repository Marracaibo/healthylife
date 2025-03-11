import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Button, Paper, CircularProgress, Alert } from '@mui/material';
import { API_BASE_URL } from '../config/constants';

const SimpleDiagnostic: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [message, setMessage] = useState<string>('');
  const [searchResult, setSearchResult] = useState<string>('');

  const checkBackend = async () => {
    setStatus('checking');
    setMessage('Verificando connessione...');
    
    try {
      // Tentiamo una semplice richiesta al backend
      const response = await axios.get(`${API_BASE_URL}/docs`, { timeout: 5000 });
      setStatus('online');
      setMessage(`Connessione al backend: OK (Status: ${response.status})`);
      return true;
    } catch (error: any) {
      setStatus('offline');
      setMessage(`Errore di connessione: ${error.message}`);
      return false;
    }
  };

  const testFoodSearch = async () => {
    setSearchResult('Ricerca in corso...');
    
    try {
      const response = await axios.get(`${API_BASE_URL}/hybrid-food/search`, {
        params: {
          query: 'bread',
          max_results: 5
        }
      });
      
      if (response.data?.results?.length > 0) {
        setSearchResult(`Risultati trovati: ${response.data.results.length}`);
      } else {
        setSearchResult('Nessun risultato trovato');
      }
    } catch (error: any) {
      setSearchResult(`Errore di ricerca: ${error.message}`);
    }
  };

  useEffect(() => {
    const runTests = async () => {
      const backendOk = await checkBackend();
      if (backendOk) {
        await testFoodSearch();
      }
    };
    
    runTests();
  }, []);

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Diagnostica API
      </Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Stato Backend
        </Typography>
        
        {status === 'checking' ? (
          <Box display="flex" alignItems="center">
            <CircularProgress size={20} sx={{ mr: 1 }} />
            <Typography>{message}</Typography>
          </Box>
        ) : status === 'online' ? (
          <Alert severity="success">{message}</Alert>
        ) : (
          <Alert severity="error">{message}</Alert>
        )}
      </Paper>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Test Ricerca Alimenti
        </Typography>
        
        {searchResult ? (
          <Typography variant="body1">{searchResult}</Typography>
        ) : (
          <CircularProgress size={20} />
        )}
      </Paper>
      
      <Button 
        variant="contained" 
        onClick={async () => {
          const backendOk = await checkBackend();
          if (backendOk) {
            await testFoodSearch();
          }
        }}
      >
        Riavvia Test
      </Button>
    </Box>
  );
};

export default SimpleDiagnostic;
