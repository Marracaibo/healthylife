import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';
import * as hybridFoodService from '../services/hybridFoodService';
import foodServiceV2 from '../services/foodServiceV2';
import { Meal } from '../types/meal';
import { Food } from '../types/food';

interface FoodSearchDialogProps {
  open: boolean;
  onClose: () => void;
  onFoodSelect: (food: Food, mealType?: string) => void;
  title?: string;
  selectedMeal?: Meal;
  mealType?: string;
}

const FoodSearchDialog: React.FC<FoodSearchDialogProps> = ({
  open,
  onClose,
  onFoodSelect,
  title,
  selectedMeal,
  mealType
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [query, setQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Food[]>([]);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [portion, setPortion] = useState<number>(100);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);
  const [foodDetailsOpen, setFoodDetailsOpen] = useState<boolean>(false);
  const [foodDetails, setFoodDetails] = useState<any | null>(null);
  const dialogTitle = title || (selectedMeal ? `Aggiungi alimento a ${selectedMeal.name}` : 'Cerca alimento');
  
  // Debounce per la ricerca
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);
    if (selectedFood) setSelectedFood(null);
    
    // Debounce la ricerca
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        handleSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 500);
  };

  const handlePortionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setPortion(value);
    }
  };

  const handleSearch = async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) return;

    setIsSearching(true);
    setError('');
    setShowError(false);

    try {
      console.log(`Ricerca con Food Service V2: ${searchQuery}`);
      // Usa il nuovo servizio V2 come servizio principale
      const v2Results = await foodServiceV2.searchFoods(searchQuery);
      
      if (v2Results.length > 0) {
        // Converti i risultati nel formato legacy
        const convertedResults = v2Results.map(food => {
          const legacyFood = foodServiceV2.convertToLegacyFormat(food);
          
          return {
            id: legacyFood.food_id || '',
            name: legacyFood.food_name || '',
            description: legacyFood.description || '',
            calories: legacyFood.nutrients.calories || 0,
            brand_name: legacyFood.brand_name || '',
            macros: {
              protein: legacyFood.nutrients.protein || 0,
              carbs: legacyFood.nutrients.carbs || 0,
              fat: legacyFood.nutrients.fat || 0
            },
            health_labels: [],
            serving_info: {
              type: legacyFood.portion?.type || 'weight',
              default_quantity: legacyFood.portion?.standard_quantity || '100g',
              unit: legacyFood.portion?.type === 'unit' ? 'unitu00e0' : 'g'
            }
          };
        });
        
        setSearchResults(convertedResults);
        console.log('Risultati ricerca V2:', convertedResults);
      } else {
        // Se non ci sono risultati, prova la ricerca con il servizio ibrido come fallback
        console.log("Nessun risultato trovato con V2, provo il servizio ibrido come fallback");
        const hybridResults = await hybridFoodService.searchFoods(searchQuery);
        
        // Mappa i risultati nel formato atteso
        const mappedResults = hybridResults.map(food => ({
          id: food.food_id || '',
          name: food.food_name || '',
          description: food.brand_name || '',
          calories: typeof food.nutrients?.calories === 'number' ? food.nutrients.calories : parseFloat(food.nutrients?.calories || '0'),
          brand_name: food.brand_name || '',
          macros: {
            protein: typeof food.nutrients?.protein === 'number' ? food.nutrients.protein : parseFloat(food.nutrients?.protein || '0'),
            carbs: typeof food.nutrients?.carbs === 'number' ? food.nutrients.carbs : parseFloat(food.nutrients?.carbs || '0'),
            fat: typeof food.nutrients?.fat === 'number' ? food.nutrients.fat : parseFloat(food.nutrients?.fat || '0')
          },
          health_labels: [],
          serving_info: {
            type: food.portion?.type || 'weight',
            default_quantity: food.portion?.standard_quantity || '100g',
            unit: food.portion?.type === 'unit' ? 'unitu00e0' : 'g'
          }
        }));
        
        setSearchResults(mappedResults);
        console.log('Risultati ricerca fallback:', mappedResults);
        
        if (mappedResults.length === 0) {
          setError('Nessun risultato trovato.');
          setShowError(true);
        }
      }
    } catch (err) {
      console.error('Errore nella ricerca degli alimenti:', err);
      setError('Errore durante la ricerca degli alimenti.');
      setShowError(true);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFoodSelect = (food: Food) => {
    setSelectedFood(food);
    setPortion(100); // Reset to default portion
  };

  const handleAddFood = () => {
    if (selectedFood && portion > 0) {
      const foodWithPortion = {
        ...selectedFood,
        amount: `${portion}g`
      };
      onFoodSelect(foodWithPortion, mealType);
      handleClose();
    }
  };

  const handleClose = () => {
    setQuery('');
    setSearchResults([]);
    setSelectedFood(null);
    setPortion(100);
    setIsSearching(false);
    setError('');
    setShowError(false);
    onClose();
  };

  const handleOpenDetails = (food: Food) => {
    setFoodDetails(food);
    setFoodDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setFoodDetailsOpen(false);
  };

  useEffect(() => {
    if (!open) {
      // Reset state when dialog is closed
      setQuery('');
      setSearchResults([]);
      setSelectedFood(null);
      setPortion(100);
      setFoodDetailsOpen(false);
    }
  }, [open]);

  // Funzione per renderizzare i chip dei macronutrienti
  const renderMacroChip = (label: string, value: number | undefined, color: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'default') => {
    if (!value && value !== 0) return null;
    
    return (
      <Chip 
        label={`${label}: ${value.toFixed(1)}g`} 
        color={color} 
        size="small" 
        style={{ margin: '0 4px 4px 0' }} 
      />
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      fullScreen={isMobile}
      maxWidth="sm"
      aria-labelledby="food-search-dialog-title"
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          m: isMobile ? 0 : 2,
        }
      }}
    >
      <DialogTitle id="food-search-dialog-title"
        sx={{
          px: isMobile ? 2 : 3,
          py: isMobile ? 1.5 : 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box component="span">{dialogTitle}</Box>
        {isMobile && (
          <IconButton
            edge="end"
            onClick={handleClose}
            sx={{ mr: -1 }}
          >
            <Box sx={{
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              backgroundColor: theme.palette.action.hover
            }}>
              u00d7
            </Box>
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent sx={{ px: isMobile ? 2 : 3, py: isMobile ? 1 : 2 }}>
        <Box sx={{ mt: isMobile ? 1 : 2 }}>
          {showError && error && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexDirection: isMobile ? 'column' : 'row',
              width: '100%'
            }}
          >
            <Box sx={{ position: 'relative', width: '100%' }}>
              <TextField
                autoFocus
                fullWidth
                placeholder="Cerca un alimento..."
                value={query}
                onChange={handleSearchChange}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: isSearching ? (
                    <InputAdornment position="end">
                      <CircularProgress size={20} />
                    </InputAdornment>
                  ) : null
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Box>
          </Box>

          {/* Risultati della ricerca */}
          <Box sx={{ mt: 2, maxHeight: 400, overflow: 'auto' }}>
            {isSearching ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            ) : searchResults.length > 0 ? (
              <List sx={{ p: 0 }}>
                {searchResults.map((food, index) => (
                  <React.Fragment key={`food-${index}`}>
                    <ListItem 
                      button 
                      onClick={() => handleFoodSelect(food)}
                      selected={selectedFood?.id === food.id}
                    >
                      <ListItemText
                        primary={food.name}
                        secondary={
                          <React.Fragment>
                            {food.brand_name && food.brand_name !== 'Generic' && food.brand_name !== 'Brand' && (
                              <Typography variant="body2" component="span" color="textSecondary">
                                {food.brand_name} | 
                              </Typography>
                            )}
                            <Typography variant="body2" component="span" color="textSecondary">
                              {food.calories} kcal
                            </Typography>
                          </React.Fragment>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetails(food);
                        }}>
                          <InfoIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < searchResults.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : query.length >= 2 && !isSearching ? (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography color="textSecondary">
                  Nessun risultato trovato. Prova a modificare la ricerca.
                </Typography>
              </Box>
            ) : null}
          </Box>

          {/* Sezione per la selezione della porzione */}
          {selectedFood && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                {selectedFood.name}
                {selectedFood.brand_name && selectedFood.brand_name !== 'Generic' && selectedFood.brand_name !== 'Brand' && (
                  <Typography variant="body2" component="span" color="primary" sx={{ ml: 1 }}>
                    ({selectedFood.brand_name})
                  </Typography>
                )}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Typography variant="body2" sx={{ mr: 2 }}>
                  Porzione (g):
                </Typography>
                <TextField
                  type="number"
                  value={portion}
                  onChange={handlePortionChange}
                  variant="outlined"
                  size="small"
                  inputProps={{ min: 1, step: 10 }}
                  sx={{ width: 100 }}
                />
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Calorie per {portion}g: {Math.round((selectedFood.calories / 100) * portion)} kcal
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 1 }}>
                  {renderMacroChip('Proteine', (selectedFood.macros?.protein / 100) * portion, 'primary')}
                  {renderMacroChip('Carboidrati', (selectedFood.macros?.carbs / 100) * portion, 'success')}
                  {renderMacroChip('Grassi', (selectedFood.macros?.fat / 100) * portion, 'error')}
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} variant="outlined">
          Annulla
        </Button>
        <Button
          onClick={handleAddFood}
          variant="contained"
          color="primary"
          disabled={!selectedFood}
        >
          Aggiungi
        </Button>
      </DialogActions>

      {/* Dialog per visualizzare i dettagli dell'alimento */}
      <Dialog
        open={foodDetailsOpen}
        onClose={handleCloseDetails}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {foodDetails?.name}
          {foodDetails?.brand_name && foodDetails.brand_name !== 'Generic' && foodDetails.brand_name !== 'Brand' && (
            <Typography variant="subtitle1" color="textSecondary">
              {foodDetails.brand_name}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          {foodDetails && (
            <Box>
              <Typography variant="body1" gutterBottom>
                <strong>Calorie:</strong> {foodDetails.calories} kcal
              </Typography>
              
              <Box mt={2}>
                <Typography variant="body1" gutterBottom>
                  <strong>Macronutrienti (per 100g):</strong>
                </Typography>
                <Box display="flex" flexWrap="wrap" mt={1}>
                  {renderMacroChip('Proteine', foodDetails.macros?.protein, 'primary')}
                  {renderMacroChip('Carboidrati', foodDetails.macros?.carbs, 'success')}
                  {renderMacroChip('Grassi', foodDetails.macros?.fat, 'error')}
                </Box>
              </Box>
              
              {foodDetails.description && (
                <Typography variant="body2" color="textSecondary" mt={2}>
                  <strong>Descrizione:</strong> {foodDetails.description}
                </Typography>
              )}
              
              <Typography variant="body2" mt={2}>
                <strong>Porzione standard:</strong> {foodDetails.serving_info?.default_quantity || '100g'}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Chiudi</Button>
          <Button 
            onClick={() => {
              handleFoodSelect(foodDetails);
              handleCloseDetails();
            }} 
            color="primary"
          >
            Seleziona
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default FoodSearchDialog;
