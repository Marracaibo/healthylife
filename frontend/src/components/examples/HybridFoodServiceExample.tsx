import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Container, 
  Card, 
  CardContent, 
  Chip, 
  CircularProgress,
  FormControlLabel,
  Switch,
  Divider,
  Alert,
  Paper,
  Grid
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import * as hybridFoodService from '../../services/hybridFoodService';
import { Food } from '../../services/hybridFoodService';
import HybridFoodSearchDialog from '../HybridFoodSearchDialog';

/**
 * Example component to demonstrate hybrid food service integration
 */
const HybridFoodServiceExample: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Food[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useCombinedSearch, setUseCombinedSearch] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFoods, setSelectedFoods] = useState<any[]>([]);
  const [searchStats, setSearchStats] = useState<{
    total: number;
    usda?: number;
    edamam?: number;
    time?: number;
  } | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Per favore inserisci un termine di ricerca');
      return;
    }
    
    setLoading(true);
    setError(null);
    setResults([]);
    setSearchStats(null);
    
    const startTime = Date.now();
    
    try {
      let searchResults;
      
      if (useCombinedSearch) {
        // Effettua una ricerca combinata
        searchResults = await hybridFoodService.searchCombinedFoods(query);
        
        // Estrai le statistiche dalla risposta
        setSearchStats({
          total: searchResults.length,
          usda: (searchResults as any).usda_count,
          edamam: (searchResults as any).edamam_count,
          time: (Date.now() - startTime) / 1000
        });
      } else {
        // Effettua una ricerca standard (a cascata)
        searchResults = await hybridFoodService.searchFoods(query);
        
        setSearchStats({
          total: searchResults.length,
          time: (Date.now() - startTime) / 1000
        });
      }
      
      setResults(searchResults);
      
      if (searchResults.length === 0) {
        setError(`Nessun risultato trovato per "${query}"`);
      }
    } catch (err) {
      setError('Errore durante la ricerca. Riprova più tardi.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFoodSelect = (food: any) => {
    setSelectedFoods([...selectedFoods, food]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Test Servizio Ibrido USDA-Edamam
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Ricerca diretta
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Cerca alimento"
            variant="outlined"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={useCombinedSearch}
                  onChange={(e) => setUseCombinedSearch(e.target.checked)}
                />
              }
              label={useCombinedSearch ? "Ricerca combinata" : "Ricerca a cascata"}
            />
            
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              startIcon={<SearchIcon />}
              disabled={loading}
            >
              Cerca
            </Button>
          </Box>
        </Box>
        
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}
        
        {error && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {searchStats && (
          <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              Statistiche di ricerca:
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Chip 
                label={`${searchStats.total} risultati`} 
                color="primary" 
              />
              {searchStats.usda !== undefined && (
                <Chip 
                  label={`${searchStats.usda} da USDA`} 
                  variant="outlined" 
                />
              )}
              {searchStats.edamam !== undefined && (
                <Chip 
                  label={`${searchStats.edamam} da Edamam`} 
                  variant="outlined" 
                />
              )}
              <Chip 
                label={`${searchStats.time?.toFixed(2)}s`} 
                variant="outlined" 
              />
            </Box>
          </Box>
        )}
      </Paper>
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Tramite Dialog
        </Typography>
        
        <Box sx={{ my: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<RestaurantIcon />}
            onClick={() => setDialogOpen(true)}
          >
            Apri Dialog Ricerca Alimenti
          </Button>
        </Box>
        
        <HybridFoodSearchDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onFoodSelect={handleFoodSelect}
          title="Ricerca Alimenti Ibrida"
        />
        
        {selectedFoods.length > 0 && (
          <>
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
              Alimenti selezionati:
            </Typography>
            
            <Grid container spacing={2}>
              {selectedFoods.map((food, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1">{food.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {food.amount}
                      </Typography>
                      <Typography variant="body2">
                        {food.calories} kcal
                      </Typography>
                      {food.macros && (
                        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          <Chip size="small" label={`P: ${food.macros.protein?.toFixed(1)}g`} />
                          <Chip size="small" label={`C: ${food.macros.carbs?.toFixed(1)}g`} />
                          <Chip size="small" label={`G: ${food.macros.fat?.toFixed(1)}g`} />
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Paper>
      
      {results.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Risultati della ricerca ({results.length})
          </Typography>
          
          <Grid container spacing={2}>
            {results.map((food) => (
              <Grid item xs={12} sm={6} md={4} key={food.food_id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle1">{food.food_name}</Typography>
                    
                    {food.brand_name && (
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        {food.brand_name}
                      </Typography>
                    )}
                    
                    <Box sx={{ mt: 1 }}>
                      <Chip 
                        label={`${food.nutrients.calories || 0} kcal`} 
                        color="secondary" 
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Chip 
                        label={hybridFoodService.getSourceName(food.source || '')} 
                        variant="outlined" 
                        size="small"
                      />
                    </Box>
                    
                    {food.ingredients && (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mt: 1, 
                          fontSize: '0.75rem', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {food.ingredients}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default HybridFoodServiceExample;
