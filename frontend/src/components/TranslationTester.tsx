import React, { useEffect, useState } from 'react';
import { Button, Box, Typography, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import { prepareSearchQuery } from '../services/hybridFoodService';

// Definizione dell'interfaccia per i risultati dei test
interface TestResult {
  query: string;
  result: string;
  passed: boolean;
}

const TranslationTester: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);
  
  // Queries di test - stesse del file test_translation.ts
  const testQueries = [
    'pane',
    'latte',
    'mela',
    'pasta',
    'carne',
    'pesce',
    'bread', // controllo inglese
    'milk'   // controllo inglese
  ];
  
  // Funzione che esegue i test
  const runTests = () => {
    setRunning(true);
    setResults([]);
    
    setTimeout(() => {
      const newResults = testQueries.map(query => {
        const result = prepareSearchQuery(query);
        return {
          query,
          result,
          passed: query === result // Il test u00e8 superato se la query non viene tradotta
        };
      });
      
      setResults(newResults);
      setRunning(false);
    }, 100);
  };
  
  // Esegui i test automaticamente al caricamento del componente
  useEffect(() => {
    runTests();
  }, []);
  
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom>Test Disabilitazione Traduzione</Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1">
          Questo test verifica se il sistema di traduzione u00e8 stato completamente disabilitato.
          Le query non dovrebbero essere tradotte.
        </Typography>
      </Box>
      
      <Button 
        variant="contained" 
        onClick={runTests} 
        disabled={running}
        sx={{ mb: 3 }}
      >
        {running ? 'Test in corso...' : 'Esegui test'}
      </Button>
      
      <List>
        {results.map((result, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <ListItemText 
                primary={
                  <Box display="flex" alignItems="center">
                    <Typography>{`"${result.query}" => "${result.result}"`}</Typography>
                    <Box ml={2} color={result.passed ? 'success.main' : 'error.main'} fontWeight="bold">
                      {result.passed ? 'u2713 OK' : 'u274c TRADOTTA!'}
                    </Box>
                  </Box>
                }
              />
            </ListItem>
            {index < results.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
      
      <Box mt={2}>
        <Typography color={results.every(r => r.passed) ? 'success.main' : 'error.main'} fontWeight="bold">
          {results.every(r => r.passed) 
            ? 'SUCCESSO: Nessuna traduzione rilevata. Sistema disabilitato correttamente!' 
            : 'ERRORE: Alcune query vengono ancora tradotte. La disabilitazione non u00e8 completa!'}
        </Typography>
      </Box>
    </Paper>
  );
};

export default TranslationTester;
