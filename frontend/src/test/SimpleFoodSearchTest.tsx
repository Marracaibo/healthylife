/**
 * Componente di test semplificato per il servizio di ricerca alimenti
 */

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  Paper, 
  CircularProgress, 
  Alert,
  Divider
} from '@mui/material';

// Importazione diretta delle funzioni dal servizio
import { searchFoods, searchCombinedFoods } from '../services/hybridFoodService';

interface FoodResult {
  food_id: string;
  food_name: string;
  brand_name?: string;
  source?: string;
  nutrients?: any;
}

const SimpleFoodSearchTest: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<FoodResult[]>([]);
  const [useCombinedSearch, setUseCombinedSearch] = useState(false);
  
  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Inserisci un termine di ricerca');
      return;
    }
    
    setLoading(true);
    setError('');
    setResults([]);
    
    try {
      console.log(`Ricerca per "${query}" (${useCombinedSearch ? 'combinata' : 'standard'})`);
      
      let searchResults: FoodResult[];
      if (useCombinedSearch) {
        searchResults = await searchCombinedFoods(query);
      } else {
        searchResults = await searchFoods(query);
      }
      
      console.log('Risultati ricerca:', searchResults);
      setResults(searchResults);
      
      if (searchResults.length === 0) {
        setError(`Nessun risultato trovato per "${query}"`);
      }
    } catch (err) {
      console.error('Errore durante la ricerca:', err);
      setError(`Errore: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };
  
  const runPredefinedTests = async () => {
    const testQueries = ['bread', 'pane', 'milk', 'latte'];
    
    setResults([]);
    setError('');
    
    for (const testQuery of testQueries) {
      setQuery(testQuery);
      setLoading(true);
      
      try {
        console.log(`Test query: "${testQuery}"`);
        const results = await searchFoods(testQuery);
        console.log(`Risultati per "${testQuery}":`, results);
        
        setResults(prev => [
          ...prev, 
          { 
            food_id: `test-${testQuery}`,
            food_name: `TEST: ${testQuery}`,
            brand_name: `ha trovato ${results.length} risultati`,
            source: 'test'
          }
        ]);
      } catch (err) {
        console.error(`Errore per query "${testQuery}":`, err);
      }
    }
    
    setLoading(false);
  };
  
  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Test Ricerca Alimenti
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Termine di ricerca"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          sx={{ mb: 2 }}
        />
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? 'Ricerca...' : 'Cerca'}
          </Button>
          
          <Button
            variant="outlined"
            onClick={() => setUseCombinedSearch(!useCombinedSearch)}
            disabled={loading}
          >
            {useCombinedSearch ? 'Usa ricerca standard' : 'Usa ricerca combinata'}
          </Button>
          
          <Button 
            variant="outlined" 
            color="secondary"
            onClick={runPredefinedTests}
            disabled={loading}
          >
            Test automatici
          </Button>
        </Box>
      </Box>
      
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}
      
      {results.length > 0 && (
        <Paper sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ p: 2, bgcolor: 'primary.light', color: 'white' }}>
            Risultati ({results.length})
          </Typography>
          
          <List>
            {results.map((item, index) => (
              <React.Fragment key={item.food_id || index}>
                <ListItem>
                  <ListItemText
                    primary={item.food_name}
                    secondary={
                      <>
                        {item.brand_name && <span>Marca: {item.brand_name}<br /></span>}
                        {item.source && <span>Fonte: {item.source}</span>}
                      </>
                    }
                  />
                </ListItem>
                {index < results.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
      
      <Box sx={{ mt: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="subtitle2" color="textSecondary">
          Debug: {useCombinedSearch ? 'Ricerca combinata attiva' : 'Ricerca standard attiva'}
        </Typography>
      </Box>
    </Box>
  );
};

export default SimpleFoodSearchTest;
