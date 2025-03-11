import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Divider,
  TextField,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

const ApiDiagnosticTool: React.FC = () => {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [hybridFoodApiStatus, setHybridFoodApiStatus] = useState<'checking' | 'working' | 'error'>('checking');
  const [searchQuery, setSearchQuery] = useState<string>('bread');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [errorDetails, setErrorDetails] = useState<string>('');
  const [diagnosisLog, setDiagnosisLog] = useState<string[]>([]);
  
  // Test della connessione al backend
  const testBackendConnection = async () => {
    addToLog('Verifica connessione al backend...');
    setBackendStatus('checking');
    
    try {
      const response = await axios.get(`${API_BASE_URL}/docs`, { timeout: 5000 });
      if (response.status === 200) {
        setBackendStatus('online');
        addToLog('✅ Connessione al backend: OK');
        return true;
      } else {
        setBackendStatus('offline');
        addToLog(`❌ Connessione al backend fallita: Status ${response.status}`);
        return false;
      }
    } catch (error: any) {
      setBackendStatus('offline');
      addToLog(`❌ Connessione al backend fallita: ${error.message}`);
      setErrorDetails(JSON.stringify(error, null, 2));
      return false;
    }
  };
  
  // Test dell'API di ricerca alimenti
  const testFoodSearchApi = async (query: string = searchQuery) => {
    addToLog(`Verifica API di ricerca alimenti (query='${query}')...`);
    setHybridFoodApiStatus('checking');
    setIsSearching(true);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/hybrid-food/search`, {
        params: {
          query,
          max_results: 5
        },
        timeout: 8000
      });
      
      if (response.status === 200) {
        const results = response.data.results || [];
        setSearchResults(results);
        setHybridFoodApiStatus('working');
        addToLog(`✅ API di ricerca alimenti: OK (${results.length} risultati)`);
        
        // Log dei dettagli della risposta
        if (results.length > 0) {
          addToLog('📗 Primi risultati:');
          results.slice(0, 2).forEach((item: any, index: number) => {
            addToLog(`   ${index + 1}. ${item.name} (${item.source})`);
          });
        } else {
          addToLog('⚠️ Nessun risultato trovato');
        }
        
        return true;
      } else {
        setHybridFoodApiStatus('error');
        addToLog(`❌ API di ricerca alimenti fallita: Status ${response.status}`);
        return false;
      }
    } catch (error: any) {
      setHybridFoodApiStatus('error');
      setErrorDetails(JSON.stringify(error, null, 2));
      addToLog(`❌ API di ricerca alimenti fallita: ${error.message}`);
      return false;
    } finally {
      setIsSearching(false);
    }
  };
  
  // Funzione per raccogliere informazioni di debug
  const gatherDebugInfo = () => {
    addToLog('Raccolta informazioni di debug...');
    
    // Informazioni sul browser
    const browserInfo = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      online: navigator.onLine,
      cookies: navigator.cookieEnabled
    };
    
    // URL base dell'API
    const apiBaseUrl = API_BASE_URL;
    
    // Configurazione axios
    const axiosConfig = {
      baseURL: axios.defaults.baseURL,
      timeout: axios.defaults.timeout,
      headers: axios.defaults.headers
    };
    
    const debugInfo = {
      timestamp: new Date().toISOString(),
      browser: browserInfo,
      apiBaseUrl,
      axiosConfig,
      backendStatus,
      hybridFoodApiStatus
    };
    
    addToLog('Informazioni di debug raccolte');
    setErrorDetails(JSON.stringify(debugInfo, null, 2));
  };
  
  // Funzione per eseguire tutti i test
  const runAllTests = async () => {
    setDiagnosisLog(['🔄 Inizio diagnosi - ' + new Date().toLocaleString()]);
    
    const backendOk = await testBackendConnection();
    if (backendOk) {
      await testFoodSearchApi();
    }
    
    gatherDebugInfo();
    
    addToLog('🏁 Diagnosi completata');
  };
  
  // Helper per aggiungere messaggi al log
  const addToLog = (message: string) => {
    setDiagnosisLog(prev => [...prev, message]);
  };
  
  // Esegui i test all'avvio del componente
  useEffect(() => {
    runAllTests();
  }, []);
  
  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Strumento di Diagnostica API
      </Typography>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Stato Connessione
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ mr: 1 }}>
                Backend:
              </Typography>
              {backendStatus === 'checking' ? (
                <CircularProgress size={20} />
              ) : backendStatus === 'online' ? (
                <Chip 
                  icon={<CheckCircleIcon />} 
                  label="Online" 
                  color="success" 
                  size="small" 
                />
              ) : (
                <Chip 
                  icon={<ErrorIcon />} 
                  label="Offline" 
                  color="error" 
                  size="small" 
                />
              )}
            </Box>
          </Grid>
          
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ mr: 1 }}>
                API Alimenti:
              </Typography>
              {hybridFoodApiStatus === 'checking' ? (
                <CircularProgress size={20} />
              ) : hybridFoodApiStatus === 'working' ? (
                <Chip 
                  icon={<CheckCircleIcon />} 
                  label="Funzionante" 
                  color="success" 
                  size="small" 
                />
              ) : (
                <Chip 
                  icon={<ErrorIcon />} 
                  label="Errore" 
                  color="error" 
                  size="small" 
                />
              )}
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />}
            onClick={runAllTests}
            sx={{ mr: 2 }}
          >
            Riavvia Test
          </Button>
          
          <Typography variant="body2" color="text.secondary">
            API Base: {API_BASE_URL}
          </Typography>
        </Box>
      </Paper>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Test Ricerca Alimenti
        </Typography>
        
        <Box sx={{ display: 'flex', mb: 2 }}>
          <TextField
            label="Query di ricerca"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mr: 2, flexGrow: 1 }}
          />
          <Button
            variant="contained"
            onClick={() => testFoodSearchApi()}
            disabled={isSearching || backendStatus !== 'online'}
          >
            {isSearching ? <CircularProgress size={24} /> : 'Cerca'}
          </Button>
        </Box>
        
        {searchResults.length > 0 ? (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              {searchResults.length} risultati trovati
            </Typography>
            
            <Box sx={{ maxHeight: 200, overflow: 'auto', mt: 1 }}>
              {searchResults.map((item, index) => (
                <Box key={index} sx={{ p: 1, borderBottom: '1px solid #eee' }}>
                  <Typography variant="subtitle2">
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fonte: {item.source} | Calorie: {item.nutrients?.calories || 'N/A'}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        ) : hybridFoodApiStatus === 'working' ? (
          <Alert severity="info">Nessun risultato trovato</Alert>
        ) : null}
      </Paper>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Log di Diagnosi</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box 
            sx={{ 
              p: 1, 
              bgcolor: '#f5f5f5', 
              borderRadius: 1,
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              maxHeight: 300,
              overflow: 'auto'
            }}
          >
            {diagnosisLog.map((log, index) => (
              <Typography key={index} variant="body2" component="div" sx={{ whiteSpace: 'pre-wrap', mb: 0.5 }}>
                {log}
              </Typography>
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>
      
      {errorDetails && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Dettagli Errore / Debug</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box 
              sx={{ 
                p: 1, 
                bgcolor: '#f5f5f5', 
                borderRadius: 1,
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                maxHeight: 300,
                overflow: 'auto'
              }}
            >
              <pre>{errorDetails}</pre>
            </Box>
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
};

export default ApiDiagnosticTool;
