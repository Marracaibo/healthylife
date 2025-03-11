/**
 * Test per verificare il funzionamento del servizio hybridFoodService
 */

import React, { useState } from 'react';
import { Button, Box, Typography, Paper, CircularProgress, List, ListItem, ListItemText } from '@mui/material';
import { searchFoods } from '../services/hybridFoodService';

const HybridFoodTest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState('');
  
  // Queries di test
  const testQueries = [
    'pane',
    'latte',
    'bread',
    'milk'
  ];
  
  const runTest = async (query: string) => {
    setLoading(true);
    setError('');
    
    try {
      console.log(`Searching for: ${query}`);
      
      // Test searchFoods
      const results = await searchFoods(query);
      console.log('Results:', results);
      
      setResults(prev => [...prev, { query, results, success: true }]);
    } catch (err) {
      console.error('Error:', err);
      setError(`${err}`);
      setResults(prev => [...prev, { query, results: [], success: false, error: `${err}` }]);
    } finally {
      setLoading(false);
    }
  };
  
  const runAllTests = async () => {
    setResults([]);
    
    for (const query of testQueries) {
      await runTest(query);
    }
  };
  
  return (
    <Paper elevation={3} sx={{ p: 3, m: 2 }}>
      <Typography variant="h4" gutterBottom>Test HybridFoodService</Typography>
      
      <Box sx={{ mb: 2 }}>
        <Button 
          variant="contained" 
          onClick={runAllTests}
          disabled={loading}
          sx={{ mr: 1 }}
        >
          Esegui tutti i test
        </Button>
        
        {testQueries.map(query => (
          <Button 
            key={query}
            variant="outlined" 
            onClick={() => runTest(query)}
            disabled={loading}
            sx={{ mr: 1 }}
          >
            Test "{query}"
          </Button>
        ))}
      </Box>
      
      {loading && (
        <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
          <CircularProgress size={24} sx={{ mr: 1 }} />
          <Typography>Test in corso...</Typography>
        </Box>
      )}
      
      {error && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
          <Typography color="error.dark">{error}</Typography>
        </Box>
      )}
      
      <List>
        {results.map((result, index) => (
          <ListItem key={index} sx={{ 
            mb: 1, 
            p: 2, 
            bgcolor: result.success ? 'success.light' : 'error.light',
            borderRadius: 1
          }}>
            <ListItemText
              primary={`Query: "${result.query}"`}
              secondary={
                <React.Fragment>
                  <Typography component="span" variant="body2">
                    {result.success 
                      ? `Trovati ${result.results.length} risultati` 
                      : `Errore: ${result.error}`}
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default HybridFoodTest;
