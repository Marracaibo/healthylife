import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Box,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  InputAdornment,
  FormControlLabel,
  Switch,
  Tooltip,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
// Importa direttamente le funzioni necessarie
import { searchFoods, searchCombinedFoods, getSourceName, Food as HybridFood } from '../services/hybridFoodService';
import { nutritionCalculationService } from '../services/nutritionCalculationService';
import { createLogger } from '../utils/logger';

const logger = createLogger('HybridFoodSearchDialog');

export interface Food {
  name: string;
  amount: string;
  calories: number;
  macros?: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface Meal {
  name: string;
  time?: string;
  type?: string;
  calories: number;
  foods: Food[];
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface HybridFoodSearchDialogProps {
  open: boolean;
  onClose: () => void;
  onFoodSelect: (food: Food) => void;
  title?: string;
  selectedMeal?: Meal | null;
}

const HybridFoodSearchDialog: React.FC<HybridFoodSearchDialogProps> = ({
  open,
  onClose,
  onFoodSelect,
  title = 'Cerca Alimento',
  selectedMeal
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [query, setQuery] = useState<string>('');
  const [amount, setAmount] = useState('100');
  const [unit, setUnit] = useState('g');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [foodResults, setFoodResults] = useState<HybridFood[]>([]);
  const [selectedFood, setSelectedFood] = useState<HybridFood | null>(null);
  const [useCombinedSearch, setUseCombinedSearch] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (open) {
      // Reset state when dialog opens
      setQuery('');
      setAmount('100');
      setUnit('g');
      setSelectedFood(null);
      setFoodResults([]);
      setError(null);
    } else {
      // Pulisci il timeout quando il dialog viene chiuso
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
        debounceTimeout.current = null;
      }
    }
    
    // Pulizia quando il componente viene smontato
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
        debounceTimeout.current = null;
      }
    };
  }, [open]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    // Implementa il debounce
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    
    if (newQuery.length >= 2) {
      debounceTimeout.current = setTimeout(() => {
        setLoading(true);
        setError(null);
        setFoodResults([]);
        
        const searchFn = async () => {
          try {
            let results;
            if (useCombinedSearch) {
              results = await searchCombinedFoods(newQuery);
            } else {
              results = await searchFoods(newQuery);
            }
            
            setFoodResults(results);
            console.log("Risultati ricerca:", results);
            
            if (results.length === 0) {
              setError(`Nessun risultato trovato per "${newQuery}"`);
            }
          } catch (err) {
            setError('Errore durante la ricerca. Riprova più tardi.');
            logger.error('Search error:', err);
          } finally {
            setLoading(false);
          }
        };
        
        searchFn();
      }, 500); // Attendi 500ms prima di eseguire la ricerca
    } else {
      setFoodResults([]);
    }
  };

  const handleFoodSelect = (food: HybridFood | null) => {
    setSelectedFood(food);
  };

  const handleAddFood = () => {
    if (!selectedFood) return;

    const calculatedCalories = selectedFood.nutrients.calories || 0;

    // Convert string to number and handle invalid input
    const amountNum = parseFloat(amount) || 0;
    
    // Utilizza il nuovo servizio per i calcoli
    const macros = nutritionCalculationService.calculateMacros(selectedFood.nutrients, amountNum);
    
    // Log per debugging
    console.log('Aggiunta alimento con macronutrienti:', {
      nome: selectedFood.food_name,
      originali: selectedFood.nutrients,
      calcolati: macros,
      quantità: amountNum
    });
    
    const foodToAdd: Food = {
      name: selectedFood.food_name,
      amount: `${amountNum} ${unit}`,
      calories: nutritionCalculationService.calculateCalories(selectedFood.nutrients.calories || 0, amountNum),
      macros: macros
    };

    onFoodSelect(foodToAdd);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle>
        <Box 
          component="span"
          sx={{
            fontSize: isMobile ? '1.25rem' : 'inherit',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {title}
          {isMobile && (
            <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: isMobile ? 2 : 3 }}>
          <TextField
            fullWidth
            label="Cerca alimento"
            variant="outlined"
            value={query}
            onChange={handleQueryChange}
            sx={{ mb: 2, mt: 1 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => handleQueryChange({ target: { value: query } } as any)} edge="end">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            size={isMobile ? "small" : "medium"}
          />
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={useCombinedSearch}
                  onChange={(e) => setUseCombinedSearch(e.target.checked)}
                  size={isMobile ? "small" : "medium"}
                />
              }
              label={<Typography variant={isMobile ? "body2" : "body1"}>Ricerca combinata</Typography>}
            />
            <Tooltip title="La ricerca combinata utilizza sia USDA che Edamam per trovare più risultati, ma può essere più lenta">
              <InfoIcon color="action" fontSize={isMobile ? "small" : "medium"} sx={{ ml: 1 }} />
            </Tooltip>
          </Box>

          {error && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: isMobile ? 2 : 4 }}>
              <CircularProgress size={isMobile ? 30 : 40} />
            </Box>
          ) : (
            <>
              {foodResults.length > 0 && (
                <>
                  <Typography variant={isMobile ? "caption" : "subtitle2"} gutterBottom>
                    {foodResults.length} risultati trovati
                  </Typography>
                  <Autocomplete
                    id="food-select"
                    options={foodResults}
                    getOptionLabel={(option) => `${option.food_name}${option.brand_name ? ` (${option.brand_name})` : ''}`}
                    renderOption={(props, option) => (
                      <Box component="li" {...props} sx={{ py: isMobile ? 1.5 : 1 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant={isMobile ? "body2" : "body1"}>{option.food_name}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
                            {option.brand_name && (
                              <Typography variant="caption" color="text.secondary">
                                {option.brand_name}
                              </Typography>
                            )}
                            <Typography variant="caption" color="text.secondary">
                              {option.nutrients.calories} kcal/100g
                            </Typography>
                            {option.source && (
                              <Chip 
                                label={getSourceName(option.source)} 
                                size="small" 
                                variant="outlined"
                              />
                            )}
                          </Box>
                        </Box>
                      </Box>
                    )}
                    value={selectedFood}
                    onChange={(_, newValue) => handleFoodSelect(newValue)}
                    fullWidth
                    sx={{ mt: 2 }}
                    size={isMobile ? "small" : "medium"}
                  />
                </>
              )}
            </>
          )}
        </Box>

        {selectedFood && (
          <Box sx={{ 
            mt: isMobile ? 2 : 3, 
            p: isMobile ? 1.5 : 2, 
            bgcolor: 'background.paper', 
            borderRadius: 1,
            fontSize: isMobile ? '0.9rem' : '1rem' 
          }}>
            <Typography variant={isMobile ? "subtitle1" : "h6"}>{selectedFood.food_name}</Typography>
            {selectedFood.brand_name && (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {selectedFood.brand_name}
              </Typography>
            )}
            
            <Box sx={{ display: 'flex', gap: isMobile ? 1 : 2, mt: isMobile ? 1 : 2, mb: isMobile ? 2 : 3, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
              <TextField
                label="Quantità"
                type="number"
                inputProps={{ min: "0", step: "10" }}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                sx={{ width: isMobile ? '45%' : '30%' }}
                size={isMobile ? "small" : "medium"}
              />
              <TextField
                label="Unità"
                select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                sx={{ width: isMobile ? '45%' : '30%' }}
                SelectProps={{
                  native: true,
                }}
                size={isMobile ? "small" : "medium"}
              >
                <option value="g">grammi</option>
                <option value="ml">millilitri</option>
                <option value="oz">once</option>
                <option value="cups">tazze</option>
              </TextField>
            </Box>

            <Typography variant={isMobile ? "body2" : "subtitle1"}>Informazioni Nutrizionali</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? 1 : 2, mt: 1 }}>
              <Chip 
                label={`${nutritionCalculationService.calculateCalories(selectedFood.nutrients.calories || 0, parseFloat(amount) || 0)} kcal`} 
                color="secondary" 
                size={isMobile ? "small" : "medium"}
              />
              {selectedFood.nutrients.protein && (
                <Chip 
                  label={`Proteine: ${nutritionCalculationService.calculateMacros(selectedFood.nutrients, parseFloat(amount) || 0).protein.toFixed(1)}g`} 
                  size={isMobile ? "small" : "medium"}
                />
              )}
              {selectedFood.nutrients.carbs && (
                <Chip 
                  label={`Carboidrati: ${nutritionCalculationService.calculateMacros(selectedFood.nutrients, parseFloat(amount) || 0).carbs.toFixed(1)}g`}
                  size={isMobile ? "small" : "medium"}
                />
              )}
              {selectedFood.nutrients.fat && (
                <Chip 
                  label={`Grassi: ${nutritionCalculationService.calculateMacros(selectedFood.nutrients, parseFloat(amount) || 0).fat.toFixed(1)}g`} 
                  size={isMobile ? "small" : "medium"}
                />
              )}
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: isMobile ? 2 : 1, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 1 : 0 }}>
        <Button 
          onClick={onClose} 
          color="inherit"
          fullWidth={isMobile}
          sx={{ mb: isMobile ? 1 : 0 }}
        >
          Annulla
        </Button>
        <Button 
          onClick={handleAddFood} 
          variant="contained" 
          color="primary"
          disabled={!selectedFood || !amount || parseFloat(amount) <= 0}
          fullWidth={isMobile}
          sx={{ 
            height: isMobile ? '48px' : 'auto',
            fontSize: isMobile ? '1rem' : 'inherit'
          }}
        >
          Aggiungi
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HybridFoodSearchDialog;
