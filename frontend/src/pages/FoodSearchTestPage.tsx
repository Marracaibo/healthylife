import React, { useState, useCallback, useRef } from 'react';
import {
  Container,
  Typography,
  TextField,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Chip,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';
import * as hybridFoodService from '../services/hybridFoodService';
import foodServiceV2 from '../services/foodServiceV2';
import { Food as FoodV2 } from '../services/foodServiceV2';
import { Food as FoodV1 } from '../services/hybridFoodService';

const FoodSearchTestPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [service, setService] = useState('v2');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [v1Results, setV1Results] = useState<FoodV1[]>([]);
  const [v2Results, setV2Results] = useState<FoodV2[]>([]);
  const [selectedFood, setSelectedFood] = useState<any | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setService(e.target.value);
  };

  const handleSearch = useCallback(async () => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (searchQuery.length < 2) {
      setError('Inserisci almeno 2 caratteri per la ricerca');
      return;
    }

    setIsSearching(true);
    setError(null);
    setSelectedFood(null);

    try {
      if (service === 'v1') {
        const results = await hybridFoodService.searchFoods(searchQuery);
        setV1Results(results);
        setV2Results([]);
      } else {
        const results = await foodServiceV2.searchFoods(searchQuery);
        setV2Results(results);
        setV1Results([]);
      }
    } catch (err) {
      console.error('Errore nella ricerca:', err);
      setError('Si è verificato un errore durante la ricerca');
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, service]);

  const handleFoodSelect = (food: any) => {
    setSelectedFood(food);
  };

  const renderMacroChip = (label: string, value: number | string | undefined, color: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'default') => {
    if (!value && value !== 0) return null;
    
    let numValue: number;
    
    if (typeof value === 'string') {
      // Gestione speciale per il formato "Per 100g - 158kcal"
      if (value.includes('kcal')) {
        const match = value.match(/([\d.]+)kcal/);
        numValue = match ? parseFloat(match[1]) : 0;
      } else {
        // Gestione per formati come "30.86g"
        const match = value.toString().match(/([\d.]+)/);
        numValue = match ? parseFloat(match[1]) : 0;
      }
    } else {
      numValue = value;
    }
    
    if (isNaN(numValue)) return null;
    
    return (
      <Chip 
        label={`${label}: ${numValue.toFixed(1)}g`} 
        color={color} 
        size="small" 
        style={{ margin: '0 4px 4px 0' }} 
      />
    );
  };

  return (
    <Container maxWidth="lg">
      <Box mt={4} mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Test Ricerca Alimenti
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Confronto tra i servizi di ricerca alimenti V1 (Hybrid) e V2 (FatSecret)
        </Typography>
      </Box>

      <Box mb={4}>
        <Card variant="outlined">
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Cerca alimenti"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Es. pasta, pizza, mela..."
                  InputProps={{
                    endAdornment: isSearching ? <CircularProgress size={24} /> : null,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Servizio</FormLabel>
                  <RadioGroup row value={service} onChange={handleServiceChange}>
                    <FormControlLabel value="v2" control={<Radio />} label="V2 (FatSecret)" />
                    <FormControlLabel value="v1" control={<Radio />} label="V1 (Hybrid)" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleSearch}
                  startIcon={<SearchIcon />}
                  disabled={isSearching || searchQuery.length < 2}
                >
                  Cerca
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Risultati di ricerca */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Risultati ({service === 'v1' ? v1Results.length : v2Results.length})
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {isSearching ? (
                <Box display="flex" justifyContent="center" my={4}>
                  <CircularProgress />
                </Box>
              ) : (
                <List>
                  {service === 'v1' ? (
                    v1Results.length > 0 ? (
                      v1Results.map((food, index) => (
                        <ListItem 
                          key={`v1-${food.food_id || index}`}
                          button
                          onClick={() => handleFoodSelect(food)}
                          divider
                          selected={selectedFood?.food_id === food.food_id}
                        >
                          <ListItemText
                            primary={food.food_name}
                            secondary={
                              <React.Fragment>
                                {food.brand_name && (
                                  <Typography variant="body2" component="span" color="textSecondary">
                                    {food.brand_name} | 
                                  </Typography>
                                )}
                                <Typography variant="body2" component="span" color="textSecondary">
                                  {food.nutrients?.calories} kcal
                                </Typography>
                              </React.Fragment>
                            }
                          />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() => handleFoodSelect(food)}>
                              <InfoIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))
                    ) : (
                      <Typography variant="body2" color="textSecondary" sx={{ py: 2, textAlign: 'center' }}>
                        Nessun risultato trovato
                      </Typography>
                    )
                  ) : (
                    v2Results.length > 0 ? (
                      v2Results.map((food, index) => (
                        <ListItem 
                          key={`v2-${food.food_id || index}`}
                          button
                          onClick={() => handleFoodSelect(food)}
                          divider
                          selected={selectedFood?.food_id === food.food_id}
                        >
                          <ListItemText
                            primary={food.food_name}
                            secondary={
                              <React.Fragment>
                                {food.brand && food.brand !== 'Generic' && (
                                  <Typography variant="body2" component="span" color="textSecondary">
                                    {food.brand} | 
                                  </Typography>
                                )}
                                <Typography variant="body2" component="span" color="textSecondary">
                                  {typeof food.nutrition?.calories === 'string' && food.nutrition.calories.includes('kcal') 
                                    ? food.nutrition.calories.match(/([\d.]+)kcal/)?.[1] || '0'
                                    : food.nutrition?.calories || '0'} kcal
                                </Typography>
                              </React.Fragment>
                            }
                          />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() => handleFoodSelect(food)}>
                              <InfoIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))
                    ) : (
                      <Typography variant="body2" color="textSecondary" sx={{ py: 2, textAlign: 'center' }}>
                        Nessun risultato trovato
                      </Typography>
                    )
                  )}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Dettagli alimento selezionato */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Dettagli alimento selezionato
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {selectedFood ? (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {selectedFood.food_name || selectedFood.name}
                  </Typography>
                  
                  {/* Brand */}
                  {(selectedFood.brand_name || selectedFood.brand) && 
                    (selectedFood.brand_name !== 'Generic' && selectedFood.brand !== 'Generic') && (
                    <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                      {selectedFood.brand_name || selectedFood.brand}
                    </Typography>
                  )}

                  <Divider sx={{ my: 2 }} />
                  
                  {/* Informazioni nutrizionali */}
                  <Typography variant="subtitle2" gutterBottom>
                    Informazioni nutrizionali:
                  </Typography>
                  
                  {service === 'v1' ? (
                    <Box mt={1}>
                      <Typography variant="body1" gutterBottom>
                        <strong>Calorie:</strong> {selectedFood.nutrients?.calories || 0} kcal
                      </Typography>
                      <Box display="flex" flexWrap="wrap" mt={1}>
                        {renderMacroChip('Proteine', selectedFood.nutrients?.protein, 'primary')}
                        {renderMacroChip('Carboidrati', selectedFood.nutrients?.carbs, 'success')}
                        {renderMacroChip('Grassi', selectedFood.nutrients?.fat, 'error')}
                        {renderMacroChip('Fibre', selectedFood.nutrients?.fiber, 'info')}
                        {renderMacroChip('Zuccheri', selectedFood.nutrients?.sugar, 'warning')}
                      </Box>
                      
                      <Typography variant="body2" color="textSecondary" mt={2}>
                        <strong>Porzione:</strong> {selectedFood.serving_size || ''} {selectedFood.serving_unit || ''}
                      </Typography>
                      
                      <Typography variant="caption" color="textSecondary" display="block" mt={1}>
                        <strong>Fonte:</strong> {selectedFood.source || 'Sconosciuta'}
                      </Typography>
                    </Box>
                  ) : (
                    <Box mt={1}>
                      <Typography variant="body1" gutterBottom>
                        <strong>Calorie:</strong> {typeof selectedFood.nutrition?.calories === 'string' && selectedFood.nutrition.calories.includes('kcal')
                          ? selectedFood.nutrition.calories.match(/([\d.]+)kcal/)?.[1] || '0'
                          : selectedFood.nutrition?.calories || 0} kcal
                      </Typography>
                      <Box display="flex" flexWrap="wrap" mt={1}>
                        {renderMacroChip('Proteine', selectedFood.nutrition?.protein, 'primary')}
                        {renderMacroChip('Carboidrati', selectedFood.nutrition?.carbs, 'success')}
                        {renderMacroChip('Grassi', selectedFood.nutrition?.fat, 'error')}
                        {renderMacroChip('Fibre', selectedFood.nutrition?.fiber, 'info')}
                        {renderMacroChip('Zuccheri', selectedFood.nutrition?.sugar, 'warning')}
                      </Box>
                      
                      <Typography variant="body2" color="textSecondary" mt={2}>
                        <strong>Descrizione:</strong> {selectedFood.description || 'Nessuna descrizione disponibile'}
                      </Typography>
                      
                      <Typography variant="caption" color="textSecondary" display="block" mt={1}>
                        <strong>Fonte:</strong> {selectedFood.source || 'FatSecret'}
                      </Typography>
                    </Box>
                  )}
                </Box>
              ) : (
                <Typography variant="body2" color="textSecondary" sx={{ py: 4, textAlign: 'center' }}>
                  Seleziona un alimento dalla lista per visualizzarne i dettagli
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FoodSearchTestPage;
