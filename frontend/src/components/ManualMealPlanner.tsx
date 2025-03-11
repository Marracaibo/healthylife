import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Tabs,
  Tab,
  CircularProgress,
  InputAdornment,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  Chip,
  Tooltip
} from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import InfoIcon from '@mui/icons-material/Info';
// Importa sia il vecchio che il nuovo servizio
import * as hybridFoodService from '../services/hybridFoodService';
import foodServiceV2 from '../services/foodServiceV2';
import BarcodeScanner from './BarcodeScanner';

interface Food {
  name: string;
  amount: string;
  calories: number;
}

interface Meal {
  name: string;
  icon: JSX.Element;
  calories: number;
  foods: Food[];
}

interface DayPlan {
  date: Date;
  meals: Meal[];
  totalCalories: number;
}

interface ManualMealPlannerProps {
  onPlanSaved?: () => void;
  setActivePlan?: (plan: any) => void;
  onCreatePlan?: (template: MealTemplate) => void;
}

interface MealTemplate {
  id: string;
  name: string;
  description: string;
  dailyCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  meals: {
    name: string;
    foods: {
      name: string;
      amount: string;
      calories: number;
    }[];
  }[];
}

interface FoodSearchResult {
  id: string;
  name: string;
  description: string;
  calories: number;
  brand_name: string;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  health_labels: string[];
  serving_info: {
    type: string;
    default_quantity: string;
    unit: string;
  };
}

const ManualMealPlanner: React.FC<ManualMealPlannerProps> = ({ onPlanSaved, setActivePlan, onCreatePlan }) => {
  const [selectedDay, setSelectedDay] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [portion, setPortion] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [planName, setPlanName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [dailyCalories] = useState(1950);

  // Stati per l'integrazione con Hybrid Food Service
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedHybridFood, setSelectedHybridFood] = useState<FoodSearchResult | null>(null);
  const [foodDetails, setFoodDetails] = useState<any | null>(null);

  // Stati per la gestione degli errori
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);

  // Stato per il dialogo dei dettagli dell'alimento
  const [selectedFoodDetails, setSelectedFoodDetails] = useState<any | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // Inizializzazione dei pasti base
  const defaultMeals: Meal[] = [
    { 
      name: 'Colazione', 
      icon: <WbSunnyIcon sx={{ color: '#FFB300' }} />, 
      calories: 0,
      foods: []
    },
    { 
      name: 'Pranzo', 
      icon: <RestaurantIcon sx={{ color: '#4FC3F7' }} />, 
      calories: 0,
      foods: []
    },
    { 
      name: 'Cena', 
      icon: <DinnerDiningIcon sx={{ color: '#FF7043' }} />, 
      calories: 0,
      foods: []
    },
    { 
      name: 'Snacks/Altro', 
      icon: <LocalCafeIcon sx={{ color: '#7E57C2' }} />, 
      calories: 0,
      foods: []
    },
  ];

  // Inizializzazione del piano settimanale
  const [weekPlan, setWeekPlan] = useState<DayPlan[]>(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return {
        date,
        meals: defaultMeals.map(meal => ({ ...meal, foods: [] })),
        totalCalories: 0
      };
    });
  });

  // Verifica della connessione al backend
  const checkBackend = async () => {
    console.log("Verifica connessione al backend...");
  };

  useEffect(() => {
    checkBackend();
  }, []);

  // Gestione del debounce per la ricerca
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Funzione per la ricerca degli alimenti tramite API Food Service V2
  const handleFoodSearch = async (query: string) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      setSearchQuery(query);
      
      if (query.length < 2) {
        setSearchResults([]);
        return;
      }
      
      setIsSearching(true);
      setError(null);
      
      try {
        console.log(`Ricerca con Food Service V2: ${query}`);
        // Usa il nuovo servizio V2 come servizio principale
        const v2Results = await foodServiceV2.searchFoods(query);
        
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
                unit: legacyFood.portion?.type === 'unit' ? 'unità' : 'g'
              }
            };
          });
          
          setSearchResults(convertedResults);
          console.log('Risultati ricerca V2:', convertedResults);
        } else {
          // Se non ci sono risultati, prova la ricerca con il servizio ibrido come fallback
          console.log("Nessun risultato trovato con V2, provo il servizio ibrido come fallback");
          const hybridResults = await hybridFoodService.searchFoods(query);
          
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
              unit: food.portion?.type === 'unit' ? 'unità' : 'g'
            }
          }));
          
          setSearchResults(mappedResults);
          console.log('Risultati ricerca fallback:', mappedResults);
          
          if (mappedResults.length === 0) {
            setError('Nessun risultato trovato.');
            setShowError(true);
          }
        }
      } catch (error) {
        console.error('Errore nella ricerca degli alimenti:', error);
        setError('Errore durante la ricerca degli alimenti.');
        setShowError(true);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);
  };

  // Funzione per ottenere i dettagli di un alimento
  const handleFoodSelect = async (food: FoodSearchResult | null) => {
    setSelectedHybridFood(food);
    setError(null);
    
    if (food) {
      // Con il servizio ibrido, i dettagli sono già inclusi nei risultati di ricerca
      // Non c'è bisogno di fare una chiamata separata
      setFoodDetails(food);
      
      // Prepara l'oggetto cibo per l'aggiunta al piano
      setSelectedFood({
        name: food.name,
        amount: food.serving_info.default_quantity || '100g',
        calories: food.calories || 0
      });
    } else {
      setFoodDetails(null);
      setSelectedFood(null);
    }
  };

  // Funzione per chiudere l'avviso di errore
  const handleCloseError = () => {
    setShowError(false);
  };

  const handleSaveClick = () => {
    if (!planName.trim()) {
      alert('Inserisci un nome per il piano alimentare');
      return;
    }

    try {
      // Creare un piano alimentare nel formato compatibile con MealTemplate
      const template: MealTemplate = {
        id: Date.now().toString(),
        name: planName,
        description: 'Piano alimentare creato manualmente',
        dailyCalories: weekPlan.reduce((sum, day) => sum + day.totalCalories, 0) / weekPlan.length,
        macros: {
          protein: 25, // Valori predefiniti, si potrebbero calcolare dai cibi
          carbs: 50,
          fat: 25
        },
        meals: weekPlan[0].meals.map(meal => ({
          name: meal.name,
          foods: meal.foods.map(food => ({
            name: food.name,
            amount: food.amount,
            calories: food.calories
          }))
        }))
      };

      // Se c'è una funzione onCreatePlan, utilizzarla per creare il piano
      if (onCreatePlan) {
        onCreatePlan(template);
        setShowSaveDialog(false);
      } else if (setActivePlan) {
        // Retrocompatibilità con il vecchio metodo
        setActivePlan(template);
        if (onPlanSaved) onPlanSaved();
        setShowSaveDialog(false);
      }
    } catch (error) {
      console.error('Errore durante il salvataggio del piano:', error);
      alert('Si è verificato un errore durante il salvataggio del piano');
    }
  };

  const handleDayChange = (event: React.SyntheticEvent, newValue: number) => {
    if (newValue >= 0 && newValue < 7) {
      setSelectedDay(newValue);
    }
  };

  const handleAddMeal = (mealName: string) => {
    setSelectedMeal(null);
    const meal = weekPlan[selectedDay].meals.find(meal => meal.name === mealName);
    if (meal) {
      setSelectedMeal(meal);
    }
    setSelectedFood(null);
    setPortion('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMeal(null);
    setSelectedFood(null);
    setPortion('');
  };

  const handleAddFood = () => {
    if (selectedFood && selectedMeal) {
      // Calcola le calorie in base alla porzione
      let calories = selectedFood.calories;
      let actualAmount = selectedFood.amount;
      
      // Se abbiamo informazioni sulla porzione, calcola le calorie proporzionalmente
      if (selectedHybridFood?.serving_info) {
        const servingInfo = selectedHybridFood.serving_info;
        
        // Estrai i valori numerici dalle stringhe di quantità
        const getNumericValue = (str: string): number => {
          const match = str.match(/[\d.]+/);
          return match ? parseFloat(match[0]) : 1;
        };
        
        // Ottieni la quantità di riferimento e quella attuale
        const defaultQuantity = getNumericValue(servingInfo.default_quantity);
        const currentQuantity = getNumericValue(actualAmount);
        
        // Calcola le calorie proporzionalmente
        if (defaultQuantity > 0 && currentQuantity > 0) {
          calories = (currentQuantity / defaultQuantity) * selectedHybridFood.calories;
        }
      }
      
      // Ottieni la porzione corrente dall'oggetto selectedFood (che potrebbe essere stata modificata nell'interfaccia)
      const newWeekPlan = [...weekPlan];
      const day = newWeekPlan[selectedDay];
      
      // Trova il pasto con il nome corrispondente
      const mealIndex = day.meals.findIndex(m => m.name === selectedMeal.name);
      if (mealIndex !== -1) {
        const newFood: Food = {
          name: selectedFood.name,
          amount: actualAmount,
          calories: Math.round(calories)
        };
        
        // Aggiungi il cibo al pasto
        const newMeals = [...day.meals];
        const newFoods = [...newMeals[mealIndex].foods, newFood];
        newMeals[mealIndex] = {
          ...newMeals[mealIndex],
          foods: newFoods,
          calories: newMeals[mealIndex].foods.reduce((sum, f) => sum + f.calories, 0) + newFood.calories
        };
        
        // Aggiorna il giorno con i nuovi pasti
        day.meals = newMeals;
        day.totalCalories = day.meals.reduce((sum, meal) => sum + meal.calories, 0);
        
        setWeekPlan(newWeekPlan);
        handleCloseDialog();
      }
    }
  };

  const getWeeklyAverageCalories = () => {
    const total = weekPlan.reduce((sum, day) => sum + day.totalCalories, 0);
    return Math.round(total / 7);
  };

  // Funzione per formattare la data in formato italiano
  const getDayLabel = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    return date.toLocaleDateString('it-IT', options);
  };

  // Pulizia quando il componente viene smontato
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
        debounceTimeout.current = null;
      }
    };
  }, []);

  const handleBarcodeResult = (food: any) => {
    // Converti il formato del cibo restituito dal barcode scanner
    const searchResult: FoodSearchResult = {
      id: food.food_id || '',
      name: food.food_name || '',
      description: food.brand_name ? `${food.brand_name}` : '',
      calories: food.nutrients.calories || 0,
      brand_name: food.brand_name || '',
      macros: {
        protein: food.nutrients.protein || 0,
        carbs: food.nutrients.carbs || 0,
        fat: food.nutrients.fat || 0,
      },
      health_labels: [],
      serving_info: {
        type: 'weight',
        default_quantity: '100g',
        unit: 'g'
      }
    };
    
    handleFoodSelect(searchResult);
    setOpenDialog(true);
  };

  // Funzione per aprire il dialogo dei dettagli
  const handleOpenDetails = (food: any) => {
    setSelectedFoodDetails(food);
    setDetailsDialogOpen(true);
  };

  // Funzione per chiudere il dialogo dei dettagli
  const handleCloseDetails = () => {
    setDetailsDialogOpen(false);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mt: 3 }}>
        Piano Settimanale
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="textSecondary">
            Media Calorie Giornaliere
          </Typography>
          <Typography variant="h4">
            {getWeeklyAverageCalories()}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            Target: {dailyCalories} kcal
          </Typography>
        </Box>
      </Paper>

      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={selectedDay}
          onChange={handleDayChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {weekPlan.map((day, index) => (
            <Tab 
              key={index} 
              label={getDayLabel(day.date)}
              sx={{ 
                minWidth: 'auto',
                '& .MuiTab-wrapper': { flexDirection: 'row' }
              }}
            />
          ))}
        </Tabs>
      </Paper>

      <Paper>
        <List>
          {weekPlan[selectedDay].meals.map((meal, index) => (
            <React.Fragment key={meal.name}>
              {index > 0 && <Divider />}
              <ListItem>
                <ListItemIcon>
                  {meal.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1">
                      {meal.name}
                    </Typography>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography component="span" variant="body2" color="textSecondary" display="block">
                        {Math.round(meal.calories)} kcal
                      </Typography>
                      {meal.foods.map((food, idx) => (
                        <Typography key={idx} component="span" variant="body2" color="textSecondary" display="block" sx={{ pl: 2 }}>
                          • {food.name} ({food.amount}) - {Math.round(food.calories)} kcal
                        </Typography>
                      ))}
                    </React.Fragment>
                  }
                />
                <ListItemSecondaryAction>
                  <Box sx={{ display: 'flex' }}>
                    <BarcodeScanner onFoodSelect={(food) => {
                      handleBarcodeResult(food);
                    }} />
                    <IconButton 
                      edge="end" 
                      aria-label="Aggiungi alimento"
                      onClick={() => handleAddMeal(meal.name)}
                      sx={{ color: 'primary.main' }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Aggiungi alimento a {selectedMeal?.name} - {getDayLabel(weekPlan[selectedDay].date)}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {error && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <Autocomplete
              options={searchResults}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderOption={(props, option) => {
                const { key, ...otherProps } = props;  
                return (
                  <li key={option.id || `${option.name}-${Math.random()}`} {...otherProps}>
                    <Box sx={{ width: '100%' }}>
                      <Typography variant="body1" fontWeight="medium">{option.name}</Typography>
                      
                      {/* Informazioni sul brand */}
                      {option.brand_name && option.brand_name !== 'Generic' && option.brand_name !== 'Unknown' && option.brand_name !== '' && (
                        <Typography variant="body2" color="primary" sx={{ fontWeight: 'medium' }}>
                          {option.brand_name}
                        </Typography>
                      )}
                      
                      {/* Etichette alimentari */}
                      {option.health_labels && option.health_labels.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, my: 0.5 }}>
                          {option.health_labels.slice(0, 6).map((label, idx) => (
                            <Chip 
                              key={`${option.id}-label-${idx}-${label}`} 
                              label={label} 
                              size="small" 
                              variant="outlined" 
                              sx={{ 
                                fontSize: '0.65rem', 
                                height: '18px', 
                                '& .MuiChip-label': { px: 0.5 } 
                              }} 
                            />
                          ))}
                          {option.health_labels.length > 6 && (
                            <Chip 
                              key={`${option.id}-label-more`}
                              label={`+${option.health_labels.length - 6}`} 
                              size="small" 
                              variant="outlined" 
                              sx={{ 
                                fontSize: '0.65rem', 
                                height: '18px', 
                                '& .MuiChip-label': { px: 0.5 } 
                              }} 
                            />
                          )}
                        </Box>
                      )}
                      
                      <Typography variant="body2" color="textSecondary">
                        {option.description || (option.calories ? `${Math.round(option.calories)} kcal` : '? kcal')}
                      </Typography>
                      
                      {/* Macronutrienti */}
                      {option.macros && (
                        <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center' }} key={`${option.id}-protein`}>
                            <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main', mr: 0.5 }} />
                            Proteine: {option.macros.protein}g
                          </Typography>
                          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center' }} key={`${option.id}-fat`}>
                            <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'warning.main', mr: 0.5 }} />
                            Grassi: {option.macros.fat}g
                          </Typography>
                          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center' }} key={`${option.id}-carbs`}>
                            <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'error.main', mr: 0.5 }} />
                            Carboidrati: {option.macros.carbs}g
                          </Typography>
                        </Box>
                      )}
                      
                      {/* Informazioni sulla porzione */}
                      {option.serving_info && (
                        <Typography variant="body2" color="textSecondary">
                          Porzione di default: {option.serving_info.default_quantity} {option.serving_info.unit}
                        </Typography>
                      )}
                    </Box>
                  </li>
                );
              }}
              value={selectedHybridFood}
              onChange={(event, newValue) => {
                handleFoodSelect(newValue);
              }}
              loading={isSearching}
              loadingText="Ricerca in corso..."
              noOptionsText={searchQuery.length < 2 ? "Digita almeno 2 caratteri" : "Nessun alimento trovato"}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Cerca alimento"
                  variant="outlined"
                  fullWidth
                  placeholder="Es: Pane integrale, Pizza, Yogurt greco..."
                  onChange={(e) => handleFoodSearch(e.target.value)}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                    endAdornment: (
                      <>
                        {isSearching ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            
            {selectedFood && (
              <Box sx={{ mt: 2 }}>
                <TextField
                  label="Porzione"
                  value={selectedFood.amount}
                  onChange={(e) => {
                    const newAmount = e.target.value;
                    
                    // Aggiorna automaticamente le calorie in base alla nuova porzione
                    if (selectedHybridFood?.serving_info) {
                      const servingInfo = selectedHybridFood.serving_info;
                      
                      // Estrai i valori numerici dalle stringhe di quantità
                      const getNumericValue = (str: string): number => {
                        const match = str.match(/[\d.]+/);
                        return match ? parseFloat(match[0]) : 1;
                      };
                      
                      // Ottieni la quantità di riferimento e quella attuale
                      const defaultQuantity = getNumericValue(servingInfo.default_quantity);
                      const currentQuantity = getNumericValue(newAmount);
                      
                      // Calcola le calorie proporzionalmente
                      if (defaultQuantity > 0 && currentQuantity > 0) {
                        // Assicurati che le calorie non siano mai inferiori a 1
                        const baseCalories = Math.max(selectedHybridFood.calories, 1);
                        const newCalories = Math.round((currentQuantity / defaultQuantity) * baseCalories);
                        setSelectedFood(prev => ({ ...prev, amount: newAmount, calories: Math.max(newCalories, 1) }));
                      } else {
                        setSelectedFood(prev => ({ ...prev, amount: newAmount }));
                      }
                    } else {
                      setSelectedFood(prev => ({ ...prev, amount: newAmount }));
                    }
                  }}
                  fullWidth
                  variant="outlined"
                  helperText={
                    selectedHybridFood?.serving_info?.type === 'unit' 
                      ? 'Inserisci un numero (es: 1, 2) o una descrizione (es: 1 fetta media)' 
                      : 'Inserisci la quantità in grammi (es: 100g)'
                  }
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  label="Calorie"
                  value={selectedFood.calories}
                  onChange={(e) => setSelectedFood({ ...selectedFood, calories: Number(e.target.value) })}
                  fullWidth
                  variant="outlined"
                  type="number"
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annulla</Button>
          <Button 
            onClick={handleAddFood} 
            variant="contained" 
            color="primary"
            disabled={!selectedFood}
          >
            Aggiungi
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog per salvare il piano */}
      <Dialog open={showSaveDialog} onClose={() => setShowSaveDialog(false)}>
        <DialogTitle>Salva Piano Settimanale</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome del Piano"
            fullWidth
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSaveDialog(false)}>Annulla</Button>
          <Button 
            onClick={handleSaveClick}
            variant="contained"
          >
            Salva Piano
          </Button>
        </DialogActions>
      </Dialog>

      {/* Aggiungi pulsante per salvare in fondo */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowSaveDialog(true)}
          disabled={weekPlan.length === 0}
        >
          Salva Piano Settimanale
        </Button>
      </Box>

      {/* Dialogo per visualizzare i dettagli dell'alimento */}
      <Dialog
        open={detailsDialogOpen}
        onClose={handleCloseDetails}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedFoodDetails?.name}
          {selectedFoodDetails?.brand_name && selectedFoodDetails.brand_name !== 'Generic' && selectedFoodDetails.brand_name !== 'Brand' && (
            <Typography variant="subtitle1" color="textSecondary">
              {selectedFoodDetails.brand_name}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          {selectedFoodDetails && (
            <Box>
              <Typography variant="body1" gutterBottom>
                <strong>Calorie:</strong> {selectedFoodDetails.calories} kcal
              </Typography>
              
              <Box mt={2}>
                <Typography variant="body1" gutterBottom>
                  <strong>Macronutrienti (per 100g):</strong>
                </Typography>
                <Box display="flex" flexWrap="wrap" mt={1}>
                  <Chip 
                    label={`Proteine: ${selectedFoodDetails.macros?.protein?.toFixed(1) || '0'}g`} 
                    color="primary" 
                    size="small" 
                    style={{ margin: '0 4px 4px 0' }} 
                  />
                  <Chip 
                    label={`Carboidrati: ${selectedFoodDetails.macros?.carbs?.toFixed(1) || '0'}g`} 
                    color="success" 
                    size="small" 
                    style={{ margin: '0 4px 4px 0' }} 
                  />
                  <Chip 
                    label={`Grassi: ${selectedFoodDetails.macros?.fat?.toFixed(1) || '0'}g`} 
                    color="error" 
                    size="small" 
                    style={{ margin: '0 4px 4px 0' }} 
                  />
                </Box>
              </Box>
              
              {selectedFoodDetails.description && (
                <Typography variant="body2" color="textSecondary" mt={2}>
                  <strong>Descrizione:</strong> {selectedFoodDetails.description}
                </Typography>
              )}
              
              <Typography variant="body2" mt={2}>
                <strong>Porzione standard:</strong> {selectedFoodDetails.serving_info?.default_quantity || '100g'}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Chiudi</Button>
          <Button 
            onClick={() => {
              handleFoodSelect(selectedFoodDetails);
              handleCloseDetails();
            }} 
            color="primary"
          >
            Seleziona
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar per mostrare errori */}
      <Snackbar 
        open={showError} 
        autoHideDuration={6000} 
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default ManualMealPlanner;
