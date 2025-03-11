/**
 * Strumento diagnostico per il servizio di ricerca alimenti
 * 
 * Questo componente esegue una serie di test e diagnostiche sul servizio
 * hybridFoodService per identificare eventuali problemi e mostrare i risultati.
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  CircularProgress,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';

// Importiamo direttamente le funzioni dal servizio per evitare problemi di importazione
import { searchFoods, searchCombinedFoods } from '../../services/hybridFoodService';

interface TestResult {
  id: string;
  name: string;
  success: boolean;
  message: string;
  details?: any;
  error?: any;
}

const FoodServiceDiagnostic: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [overallStatus, setOverallStatus] = useState<'success' | 'warning' | 'error' | 'pending'>('pending');
  
  // Definizione dei test da eseguire
  const diagnosticTests = [
    {
      id: 'module-import',
      name: 'Verifica importazione modulo',
      test: async () => {
        try {
          // Verifichiamo che le funzioni importate siano definite
          const isSearchFoodsDefined = typeof searchFoods === 'function';
          const isSearchCombinedFoodsDefined = typeof searchCombinedFoods === 'function';
          
          if (isSearchFoodsDefined && isSearchCombinedFoodsDefined) {
            return {
              success: true,
              message: 'Funzioni di ricerca importate correttamente',
              details: { isSearchFoodsDefined, isSearchCombinedFoodsDefined }
            };
          } else {
            return {
              success: false,
              message: 'Problemi con l\'importazione delle funzioni',
              details: { isSearchFoodsDefined, isSearchCombinedFoodsDefined }
            };
          }
        } catch (error) {
          return {
            success: false,
            message: 'Errore durante la verifica dell\'importazione',
            error
          };
        }
      }
    },
    {
      id: 'backend-connectivity',
      name: 'Verifica connettività con il backend',
      test: async () => {
        try {
          // Test semplice per verificare se il backend è in esecuzione
          const response = await fetch('http://localhost:8000/api/health-check');
          const isBackendUp = response.ok;
          
          return {
            success: isBackendUp,
            message: isBackendUp 
              ? 'Backend accessibile' 
              : 'Backend non raggiungibile',
            details: { status: response.status, statusText: response.statusText }
          };
        } catch (error) {
          return {
            success: false,
            message: 'Errore durante la verifica della connettività',
            error
          };
        }
      }
    },
    {
      id: 'search-foods-basic',
      name: 'Test ricerca alimenti di base',
      test: async () => {
        try {
          const query = 'bread';
          const results = await searchFoods(query);
          
          const success = Array.isArray(results);
          return {
            success,
            message: success 
              ? `Ricerca eseguita con successo (${results.length} risultati trovati)` 
              : 'La funzione non ha restituito un array',
            details: { query, resultsCount: results?.length, isArray: Array.isArray(results) }
          };
        } catch (error) {
          return {
            success: false,
            message: 'Errore durante la ricerca di alimenti di base',
            error
          };
        }
      }
    },
    {
      id: 'search-foods-italian',
      name: 'Test ricerca alimenti con termini italiani',
      test: async () => {
        try {
          const query = 'pane';
          const results = await searchFoods(query);
          
          const success = Array.isArray(results);
          return {
            success,
            message: success 
              ? `Ricerca in italiano eseguita con successo (${results.length} risultati trovati)` 
              : 'La funzione non ha restituito un array per query italiana',
            details: { query, resultsCount: results?.length, isArray: Array.isArray(results) }
          };
        } catch (error) {
          return {
            success: false,
            message: 'Errore durante la ricerca con termini italiani',
            error
          };
        }
      }
    },
    {
      id: 'search-combined-foods',
      name: 'Test ricerca combinata alimenti',
      test: async () => {
        try {
          const query = 'milk';
          const results = await searchCombinedFoods(query);
          
          const success = Array.isArray(results);
          return {
            success,
            message: success 
              ? `Ricerca combinata eseguita con successo (${results.length} risultati trovati)` 
              : 'La funzione non ha restituito un array',
            details: { query, resultsCount: results?.length, isArray: Array.isArray(results) }
          };
        } catch (error) {
          return {
            success: false,
            message: 'Errore durante la ricerca combinata',
            error
          };
        }
      }
    }
  ];
  
  // Esegue tutti i test in sequenza
  const runAllTests = async () => {
    setLoading(true);
    setTestResults([]);
    setActiveStep(0);
    setOverallStatus('pending');
    
    const results: TestResult[] = [];
    let hasErrors = false;
    let hasWarnings = false;
    
    for (const [index, testDef] of diagnosticTests.entries()) {
      setActiveStep(index);
      
      try {
        console.log(`Esecuzione test: ${testDef.name}`);
        const result = await testDef.test();
        
        const testResult: TestResult = {
          id: testDef.id,
          name: testDef.name,
          success: result.success,
          message: result.message,
          details: result.details,
          error: result.error
        };
        
        results.push(testResult);
        setTestResults([...results]);
        
        if (!result.success) {
          hasErrors = true;
        }
      } catch (error) {
        console.error(`Errore test ${testDef.id}:`, error);
        
        results.push({
          id: testDef.id,
          name: testDef.name,
          success: false,
          message: 'Eccezione durante l\'esecuzione del test',
          error
        });
        
        setTestResults([...results]);
        hasErrors = true;
      }
      
      // Breve pausa tra i test
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setActiveStep(diagnosticTests.length);
    setOverallStatus(hasErrors ? 'error' : (hasWarnings ? 'warning' : 'success'));
    setLoading(false);
  };
  
  // Avvia i test automaticamente al caricamento del componente
  useEffect(() => {
    runAllTests();
  }, []);
  
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Diagnostica del Servizio Alimenti
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Questo strumento esegue una serie di test diagnostici sul servizio di ricerca alimenti
        per identificare eventuali problemi e proporre soluzioni.
      </Typography>
      
      <Paper sx={{ p: 3, my: 3 }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {diagnosticTests.map((test, index) => (
            <Step key={test.id}>
              <StepLabel>
                {test.name}
                {testResults[index] && (
                  <Chip 
                    size="small"
                    sx={{ ml: 1 }}
                    label={testResults[index].success ? 'OK' : 'Errore'}
                    color={testResults[index].success ? 'success' : 'error'}
                  />
                )}
              </StepLabel>
              <StepContent>
                {loading && index === activeStep ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                    <CircularProgress size={24} />
                    <Typography>Test in esecuzione...</Typography>
                  </Box>
                ) : (
                  testResults[index] && (
                    <Box>
                      <Alert severity={testResults[index].success ? 'success' : 'error'}>
                        {testResults[index].message}
                      </Alert>
                      
                      {testResults[index].error && (
                        <Box sx={{ mt: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: 1, fontSize: '0.8rem', fontFamily: 'monospace' }}>
                          {String(testResults[index].error)}
                        </Box>
                      )}
                    </Box>
                  )
                )}
              </StepContent>
            </Step>
          ))}
          
          {/* Step finale con risultati e raccomandazioni */}
          <Step>
            <StepLabel>
              Valutazione complessiva
              {overallStatus !== 'pending' && (
                <Chip 
                  size="small"
                  sx={{ ml: 1 }}
                  label={overallStatus === 'success' ? 'Tutto OK' : (overallStatus === 'warning' ? 'Attenzione' : 'Problemi riscontrati')}
                  color={overallStatus === 'success' ? 'success' : (overallStatus === 'warning' ? 'warning' : 'error')}
                />
              )}
            </StepLabel>
            <StepContent>
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                <Box>
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    Risultati dei test diagnostici
                  </Typography>
                  
                  <List dense>
                    {testResults.map(result => (
                      <ListItem key={result.id}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          {result.success ? (
                            <CheckCircleIcon color="success" fontSize="small" />
                          ) : (
                            <ErrorIcon color="error" fontSize="small" />
                          )}
                        </ListItemIcon>
                        <ListItemText 
                          primary={result.name}
                          secondary={result.message}
                        />
                      </ListItem>
                    ))}
                  </List>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    Raccomandazioni
                  </Typography>
                  
                  {overallStatus === 'success' ? (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      Tutti i test sono stati superati con successo! Il servizio di ricerca alimenti sembra funzionare correttamente.
                    </Alert>
                  ) : (
                    <>
                      <Alert severity="warning" sx={{ mb: 2 }}>
                        Sono stati rilevati alcuni problemi con il servizio di ricerca alimenti.
                      </Alert>
                      
                      <List dense>
                        {!testResults.find(r => r.id === 'module-import')?.success && (
                          <ListItem>
                            <ListItemIcon>
                              <WarningIcon color="warning" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Problema di importazione del modulo" 
                              secondary="Verifica che il file hybridFoodService.ts esporti correttamente le funzioni necessarie."
                            />
                          </ListItem>
                        )}
                        
                        {!testResults.find(r => r.id === 'backend-connectivity')?.success && (
                          <ListItem>
                            <ListItemIcon>
                              <WarningIcon color="warning" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Problema di connettività con il backend" 
                              secondary="Assicurati che il server backend sia in esecuzione sulla porta 8000."
                            />
                          </ListItem>
                        )}
                        
                        {!testResults.find(r => r.id === 'search-foods-basic')?.success && (
                          <ListItem>
                            <ListItemIcon>
                              <WarningIcon color="warning" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Problema con la funzione searchFoods" 
                              secondary="La funzione searchFoods non funziona correttamente. Verifica l'implementazione."
                            />
                          </ListItem>
                        )}
                        
                        {!testResults.find(r => r.id === 'search-combined-foods')?.success && (
                          <ListItem>
                            <ListItemIcon>
                              <WarningIcon color="warning" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Problema con la funzione searchCombinedFoods" 
                              secondary="La funzione searchCombinedFoods non funziona correttamente. Verifica l'implementazione."
                            />
                          </ListItem>
                        )}
                      </List>
                    </>
                  )}
                </Box>
              )}
            </StepContent>
          </Step>
        </Stepper>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
            onClick={runAllTests}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} /> : null}
          >
            {loading ? 'Test in corso...' : 'Esegui test di nuovo'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default FoodServiceDiagnostic;
