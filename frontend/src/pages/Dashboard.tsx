import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Divider,
  Chip,
  Avatar,
  Alert,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Button,
  Tooltip,
  Badge,
  FormControlLabel,
  Switch,
  Card,
  CardContent,
  CardActions,
  Slider,
  Rating,
  TextField,
  Stack,
  useTheme
} from '@mui/material';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { 
  Restaurant,
  Opacity,
  FitnessCenter,
  Info as InfoIcon,
  EmojiEvents,
  Warning as WarningIcon,
  Error as ErrorIcon,
  LocalDrink,
  NightsStay,
  SentimentSatisfied,
  SentimentDissatisfied,
  SentimentVeryDissatisfied,
  SentimentSatisfiedAlt,
  SentimentVerySatisfied,
  Save as SaveIcon,
  Edit,
  CheckCircle as CheckCircleIcon,
  LocalFireDepartment,
  Description,
  Today,
  Add as AddIcon,
  Timer,
  Info,
  Cancel,
  Refresh as RefreshIcon,
  Flag,
  RestaurantMenu as RestaurantMenuIcon,
  ArrowUpward,
  ArrowDownward,
  FlagOutlined,
  ShoppingCart as ShoppingCartIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { Container } from '@mui/material';

interface MealPlan {
  id: number;
  name: string;
  goal: string;
  calories_target: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  dietary_restrictions: string[];
  days: Array<{
    date: string;
    meals: Array<{
      name: string;
      time: string;
      calories: number;
      macros: {
        protein: number;
        carbs: number;
        fat: number;
      };
      ingredients: Array<{
        name: string;
        amount: string;
        unit: string;
      }>;
      instructions: string[];
    }>;
  }>;
}

interface WellnessData {
  date: string;
  hydration: number; // numero di bicchieri d'acqua (0-8)
  sleep: {
    hours: number;
    quality: number; // 1-5 scala
  };
  mood: number; // 1-5 scala
  notes: string;
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1'];

export default function Dashboard() {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [todayMeals, setTodayMeals] = useState<any>(null);
  const [flaggedMeals, setFlaggedMeals] = useState<Set<string>>(new Set());
  const [calorieHistory, setCalorieHistory] = useState<Array<{date: string, calories: number}>>([]);
  const [macroTrends, setMacroTrends] = useState<Array<{date: string, protein: number, carbs: number, fat: number}>>([]);
  const [realtimeUpdates, setRealtimeUpdates] = useState(false);
  const [wellnessData, setWellnessData] = useState<WellnessData>({
    date: new Date().toISOString().split('T')[0],
    hydration: 0,
    sleep: {
      hours: 7,
      quality: 3
    },
    mood: 3,
    notes: ''
  });

  useEffect(() => {
    const handlePlanSelected = (event: any) => {
      console.log('Dashboard: Evento planSelected ricevuto', event.detail);
      if (event.detail && event.detail.plan) {
        console.log('Dashboard: Piano ricevuto dall\'evento', event.detail.plan);
        setPlan(normalizePlan(event.detail.plan));
        extractRealData(normalizePlan(event.detail.plan));
      }
    };

    window.addEventListener('planSelected', handlePlanSelected);
    
    // Carica il piano selezionato all'avvio
    loadSelectedPlan();
    
    // Carica i pasti flaggati
    loadFlaggedMeals();
    
    // Carica i dati di benessere dal localStorage
    loadWellnessData();
    
    // Imposta un intervallo per ricaricare i dati se gli aggiornamenti in tempo reale sono attivi
    const intervalId = setInterval(() => {
      if (realtimeUpdates) {
        console.log('Aggiornamento dati in tempo reale...');
        loadSelectedPlan();
      }
    }, 30000); // Aggiorna ogni 30 secondi
    
    return () => {
      window.removeEventListener('planSelected', handlePlanSelected);
      clearInterval(intervalId);
    };
  }, [realtimeUpdates]);

  const loadSelectedPlan = () => {
    try {
      setLoading(true);
      
      const selectedPlanIdString = localStorage.getItem('selectedPlanId');
      
      if (selectedPlanIdString) {
        console.log(`Dashboard: Caricamento piano con ID ${selectedPlanIdString}`);
        
        const selectedPlanJson = localStorage.getItem('selectedPlan');
        
        if (selectedPlanJson) {
          try {
            const loadedPlan = JSON.parse(selectedPlanJson);
            
            if (!loadedPlan || typeof loadedPlan !== 'object') {
              throw new Error('Piano non valido');
            }
            
            console.log('Piano caricato con successo:', loadedPlan);
            
            const normalizedPlan = normalizePlan(loadedPlan);
            
            setPlan(normalizedPlan);
            
            const today = new Date().toISOString().split('T')[0];
            const todayMealsData = normalizedPlan.days?.find((day: any) => 
              day.date.startsWith(today)
            );
            
            if (todayMealsData) {
              console.log('Pasti di oggi trovati:', todayMealsData);
              setTodayMeals(todayMealsData);
            } else if (normalizedPlan.days && normalizedPlan.days.length > 0) {
              console.log('Nessun pasto per oggi, uso il primo giorno come fallback');
              setTodayMeals(normalizedPlan.days[0]);
            }
            
            // Assicurati che i dati vengano estratti anche se il piano è vuoto o ha valori a zero
            console.log('Estrazione dati dal piano normalizzato...');
            extractRealData(normalizedPlan);
            
            // Aggiungi un log per verificare che i dati siano stati estratti
            console.log('Dati estratti - Calorie:', calorieHistory);
            console.log('Dati estratti - Macro:', macroTrends);
          } catch (parseError) {
            console.error('Errore nel parsing del piano:', parseError);
            handleError(parseError, 'parsing del piano');
          }
        } else {
          console.log('Piano selezionato non trovato nel localStorage');
          setError('Piano selezionato non trovato');
        }
      } else {
        console.log('Nessun piano selezionato trovato nel localStorage');
      }
      setLoading(false);
    } catch (err) {
      console.error('Errore nel caricamento del piano:', err);
      handleError(err, 'caricamento del piano');
    }
  };

  const normalizePlan = (plan: any): MealPlan => {
    if (!plan) {
      console.error('Piano non valido (null o undefined)');
      return {} as MealPlan;
    }
    
    console.log('Normalizzazione piano:', plan);
    
    // Verifica che l'ID del piano sia un numero
    const id = typeof plan.id === 'number' ? plan.id : 
               typeof plan.id === 'string' ? parseInt(plan.id, 10) : 
               -1;
    
    // Normalizza i macros a livello di piano
    const normalizedMacros = {
      protein: typeof plan.macros?.protein === 'number' ? plan.macros.protein : 0,
      carbs: typeof plan.macros?.carbs === 'number' ? plan.macros.carbs : 0,
      fat: typeof plan.macros?.fat === 'number' ? plan.macros.fat : 0
    };
    
    // Normalizza i giorni e i pasti
    const normalizedDays = Array.isArray(plan.days) ? plan.days.map((day: any, dayIndex: number) => {
      // Controlla che la data sia una stringa valida
      const date = typeof day.date === 'string' ? day.date : 
                   new Date(Date.now() + dayIndex * 86400000).toISOString().split('T')[0] + "T00:00:00.000Z";
      
      // Normalizza i pasti del giorno
      const normalizedMeals = Array.isArray(day.meals) ? day.meals.map((meal: any, mealIndex: number) => {
        // Normalizza i macros del pasto
        const mealMacros = {
          protein: typeof meal.macros?.protein === 'number' ? meal.macros.protein : 0,
          carbs: typeof meal.macros?.carbs === 'number' ? meal.macros.carbs : 0,
          fat: typeof meal.macros?.fat === 'number' ? meal.macros.fat : 0
        };
        
        // Calcola calorie dai macros se necessario
        let mealCalories = typeof meal.calories === 'number' ? meal.calories : 0;
        
        // Se le calorie sono 0 ma abbiamo macros, calcoliamo le calorie
        if (mealCalories === 0 && (mealMacros.protein > 0 || mealMacros.carbs > 0 || mealMacros.fat > 0)) {
          mealCalories = (mealMacros.protein * 4) + (mealMacros.carbs * 4) + (mealMacros.fat * 9);
          console.log(`Calorie calcolate per il pasto ${meal.name || `Pasto ${mealIndex}`}: ${mealCalories}`);
        }
        
        // Normalizza ingredients se presenti
        const normalizedIngredients = Array.isArray(meal.ingredients) ? meal.ingredients.map((ing: any) => ({
          name: typeof ing.name === 'string' ? ing.name : 'Ingrediente sconosciuto',
          amount: typeof ing.amount === 'string' ? ing.amount : 
                 typeof ing.amount === 'number' ? ing.amount.toString() : '0',
          unit: typeof ing.unit === 'string' ? ing.unit : 'g'
        })) : [];
        
        // Normalizza il campo foods o crealo a partire da ingredients se necessario
        let normalizedFoods = [];
        
        if (Array.isArray(meal.foods) && meal.foods.length > 0) {
          // Usa il campo foods esistente
          normalizedFoods = meal.foods.map((food: any) => ({
            name: typeof food.name === 'string' ? food.name : 'Cibo sconosciuto',
            quantity: typeof food.quantity === 'string' ? food.quantity : 
                     typeof food.amount === 'string' ? food.amount : '0g',
            calories: typeof food.calories === 'number' ? food.calories : 0,
            protein: typeof food.protein === 'number' ? food.protein : 0,
            carbs: typeof food.carbs === 'number' ? food.carbs : 0,
            fat: typeof food.fat === 'number' ? food.fat : 0
          }));
          
          // Se non ci sono macros a livello di pasto, calcoliamoli dai foods
          if (mealMacros.protein === 0 && mealMacros.carbs === 0 && mealMacros.fat === 0) {
            normalizedFoods.forEach((food: any) => {
              mealMacros.protein += food.protein || 0;
              mealMacros.carbs += food.carbs || 0;
              mealMacros.fat += food.fat || 0;
            });
            
            // Ricalcola le calorie dai macros se necessario
            if (mealCalories === 0) {
              mealCalories = (mealMacros.protein * 4) + (mealMacros.carbs * 4) + (mealMacros.fat * 9);
            }
            
            console.log(`Macros calcolati dai foods per il pasto ${meal.name || `Pasto ${mealIndex}`}:`, mealMacros);
          }
        } else if (Array.isArray(meal.ingredients) && meal.ingredients.length > 0) {
          // Crea foods a partire da ingredients
          const totalIngredients = meal.ingredients.length;
          const proteinPerIngredient = mealMacros.protein / totalIngredients;
          const carbsPerIngredient = mealMacros.carbs / totalIngredients;
          const fatPerIngredient = mealMacros.fat / totalIngredients;
          const caloriesPerIngredient = mealCalories / totalIngredients;
          
          normalizedFoods = meal.ingredients.map((ing: any) => ({
            name: typeof ing.name === 'string' ? ing.name : 'Ingrediente sconosciuto',
            quantity: typeof ing.amount === 'string' ? ing.amount : '0g',
            calories: caloriesPerIngredient,
            protein: proteinPerIngredient,
            carbs: carbsPerIngredient,
            fat: fatPerIngredient
          }));
        }
        
        console.log(`Pasto ${meal.name || `Pasto ${mealIndex}`} normalizzato con ${normalizedFoods.length} alimenti`);
        
        return {
          ...meal,
          name: typeof meal.name === 'string' ? meal.name : `Pasto ${mealIndex + 1}`,
          time: typeof meal.time === 'string' ? meal.time : '12:00',
          calories: mealCalories,
          macros: mealMacros,
          ingredients: normalizedIngredients,
          foods: normalizedFoods,
          instructions: Array.isArray(meal.instructions) ? meal.instructions : []
        };
      }) : [];
      
      return {
        ...day,
        date,
        meals: normalizedMeals
      };
    }) : [];
    
    const normalizedPlan = {
      ...plan,
      id,
      name: typeof plan.name === 'string' ? plan.name : 'Piano senza nome',
      type: typeof plan.type === 'string' ? plan.type : 'custom',
      macros: normalizedMacros,
      days: normalizedDays
    };
    
    console.log('Piano normalizzato:', normalizedPlan);
    return normalizedPlan as MealPlan;
  };

  const extractRealData = (loadedPlan: MealPlan) => {
    if (!loadedPlan || !loadedPlan.days || loadedPlan.days.length === 0) {
      console.log('Piano senza giorni, impossibile estrarre dati reali');
      return;
    }
    
    console.log('Estrazione dati reali dal piano:', loadedPlan);
    
    const calorieData: Array<{date: string, calories: number}> = [];
    const macroData: Array<{date: string, protein: number, carbs: number, fat: number}> = [];
    
    const sortedDays = [...loadedPlan.days].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    
    console.log('Giorni ordinati:', sortedDays);
    
    const daysToShow = sortedDays.slice(0, 7);
    
    daysToShow.forEach(day => {
      const dateString = day.date.split('T')[0];
      
      let totalCalories = 0;
      let totalProtein = 0;
      let totalCarbs = 0;
      let totalFat = 0;
      
      if (day.meals && Array.isArray(day.meals)) {
        console.log(`Elaborazione pasti per ${dateString}:`, day.meals);
        
        day.meals.forEach(meal => {
          console.log(`Pasto: ${meal.name}, Calorie: ${meal.calories}, Macros:`, meal.macros);
          
          // Calcola le calorie dal pasto
          if (meal && typeof meal.calories === 'number') {
            totalCalories += meal.calories;
          } else if (meal && meal.foods && Array.isArray(meal.foods)) {
            // Se non ci sono calorie a livello di pasto, somma le calorie dei singoli alimenti
            meal.foods.forEach(food => {
              if (food && typeof food.calories === 'number') {
                totalCalories += food.calories;
              }
            });
          } else {
            console.warn(`Calorie non valide per il pasto ${meal?.name}:`, meal?.calories);
          }
          
          // Calcola i macronutrienti dal pasto
          if (meal && meal.macros) {
            if (typeof meal.macros.protein === 'number') totalProtein += meal.macros.protein;
            if (typeof meal.macros.carbs === 'number') totalCarbs += meal.macros.carbs;
            if (typeof meal.macros.fat === 'number') totalFat += meal.macros.fat;
          } else if (meal && meal.foods && Array.isArray(meal.foods)) {
            // Se non ci sono macros a livello di pasto, somma i macros dei singoli alimenti
            meal.foods.forEach(food => {
              if (food) {
                if (typeof food.protein === 'number') totalProtein += food.protein;
                if (typeof food.carbs === 'number') totalCarbs += food.carbs;
                if (typeof food.fat === 'number') totalFat += food.fat;
              }
            });
          } else {
            console.warn(`Macros non validi per il pasto ${meal?.name}:`, meal?.macros);
          }
        });
      } else {
        console.warn(`Nessun pasto valido trovato per ${dateString}`);
      }
      
      console.log(`Dati calcolati per ${dateString}:`, { 
        calories: totalCalories, 
        protein: totalProtein, 
        carbs: totalCarbs, 
        fat: totalFat 
      });
      
      calorieData.push({
        date: dateString,
        calories: totalCalories
      });
      
      macroData.push({
        date: dateString,
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat
      });
    });
    
    console.log('Dati calorici estratti:', calorieData);
    console.log('Dati macronutrienti estratti:', macroData);
    
    setCalorieHistory(calorieData);
    setMacroTrends(macroData);
  };

  const loadFlaggedMeals = () => {
    try {
      const flaggedMealsJson = localStorage.getItem('flaggedMeals');
      if (flaggedMealsJson) {
        setFlaggedMeals(new Set(JSON.parse(flaggedMealsJson)));
      }
    } catch (e) {
      handleError(e, 'caricamento dei pasti flaggati');
    }
  };

  const toggleFlagMeal = (mealId: string) => {
    const newFlaggedMeals = new Set(flaggedMeals);
    
    if (newFlaggedMeals.has(mealId)) {
      newFlaggedMeals.delete(mealId);
    } else {
      newFlaggedMeals.add(mealId);
    }
    
    setFlaggedMeals(newFlaggedMeals);
    localStorage.setItem('flaggedMeals', JSON.stringify([...newFlaggedMeals]));
  };

  const handleRealtimeUpdatesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setRealtimeUpdates(checked);
    
    if (checked) {
      loadSelectedPlan();
      
      const message = document.createElement('div');
      message.textContent = 'Aggiornamenti in tempo reale attivati';
      message.style.position = 'fixed';
      message.style.bottom = '20px';
      message.style.right = '20px';
      message.style.backgroundColor = '#4caf50';
      message.style.color = 'white';
      message.style.padding = '10px 20px';
      message.style.borderRadius = '4px';
      message.style.zIndex = '9999';
      message.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
      
      document.body.appendChild(message);
      
      setTimeout(() => {
        document.body.removeChild(message);
      }, 3000);
    }
  };

  const handleError = (error: unknown, context: string) => {
    console.error(`Errore in ${context}:`, error);
    
    let errorMessage = 'Si è verificato un errore imprevisto';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String((error as { message: unknown }).message);
    }
    
    setError(`${context}: ${errorMessage}`);
    
    const errorNotification = document.createElement('div');
    errorNotification.textContent = `Errore: ${errorMessage}`;
    errorNotification.style.position = 'fixed';
    errorNotification.style.bottom = '20px';
    errorNotification.style.right = '20px';
    errorNotification.style.backgroundColor = '#f44336';
    errorNotification.style.color = 'white';
    errorNotification.style.padding = '10px 20px';
    errorNotification.style.borderRadius = '4px';
    errorNotification.style.zIndex = '9999';
    errorNotification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    
    document.body.appendChild(errorNotification);
    
    setTimeout(() => {
      document.body.removeChild(errorNotification);
    }, 5000);
    
    return false;
  };

  const renderCalorieChart = () => {
    if (loading) return <CircularProgress size={60} thickness={4} sx={{ mb: 2 }} />;
    if (error) return <Alert severity="error">{error}</Alert>;
    
    // Verifica se ci sono dati calorici validi
    const hasValidData = calorieHistory && calorieHistory.length > 0 && 
                        calorieHistory.some(item => item.calories > 0);
    
    if (!hasValidData) {
      return (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          p: 4, 
          minHeight: 300, 
          textAlign: 'center',
          bgcolor: alpha(theme.palette.warning.main, 0.03),
          borderRadius: 2,
          border: `1px dashed ${alpha(theme.palette.warning.main, 0.2)}` 
        }}>
          <LocalFireDepartment sx={{ fontSize: 60, color: alpha(theme.palette.warning.main, 0.4), mb: 2 }} />
          <Typography variant="h6" gutterBottom color="warning.main">
            Nessun dato calorico disponibile
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300, mb: 3 }}>
            Seleziona un piano pasto per visualizzare il grafico dell'andamento calorico
          </Typography>
          <Button 
            variant="outlined" 
            color="warning" 
            component={Link} 
            to="/meal-planner"
            size="small"
            startIcon={<AddIcon />}
          >
            Seleziona Piano
          </Button>
        </Box>
      );
    }

    return (
      <Box sx={{ height: 300, width: '100%' }}>
        <Typography variant="h6" gutterBottom>
          Andamento Calorico
        </Typography>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={calorieHistory}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 'dataMax + 500']} />
            <RechartsTooltip formatter={(value) => [`${value} kcal`, 'Calorie']} />
            <Legend />
            <Line
              type="monotone"
              dataKey="calories"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              name="Calorie"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    );
  };

  const renderMacroChart = () => {
    if (loading) return <CircularProgress size={60} thickness={4} sx={{ mb: 2 }} />;
    if (error) return <Alert severity="error">{error}</Alert>;
    
    // Verifica se ci sono dati sui macronutrienti validi
    const hasValidData = macroTrends && macroTrends.length > 0 && 
                         macroTrends.some(item => item.protein > 0 || item.carbs > 0 || item.fat > 0);
    
    if (!hasValidData) {
      return (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          p: 4, 
          minHeight: 300, 
          textAlign: 'center',
          bgcolor: alpha(theme.palette.primary.main, 0.03),
          borderRadius: 2,
          border: `1px dashed ${alpha(theme.palette.primary.main, 0.2)}`
        }}>
          <FitnessCenter sx={{ fontSize: 60, color: alpha(theme.palette.primary.main, 0.4), mb: 2 }} />
          <Typography variant="h6" gutterBottom color="primary.main">
            Nessun dato sui macronutrienti
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300, mb: 3 }}>
            Seleziona un piano pasto per visualizzare il grafico di distribuzione dei macronutrienti
          </Typography>
          <Button 
            variant="outlined" 
            color="primary" 
            component={Link} 
            to="/meal-planner"
            size="small"
            startIcon={<AddIcon />}
          >
            Seleziona Piano
          </Button>
        </Box>
      );
    }

    return (
      <Box sx={{ height: 300, width: '100%' }}>
        <Typography variant="h6" gutterBottom>
          Andamento Macronutrienti
        </Typography>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={macroTrends}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 'dataMax + 20']} />
            <RechartsTooltip formatter={(value, name) => [`${value}g`, name]} />
            <Legend />
            <Bar dataKey="protein" name="Proteine" fill="#8884d8" />
            <Bar dataKey="carbs" name="Carboidrati" fill="#82ca9d" />
            <Bar dataKey="fat" name="Grassi" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    );
  };

  const renderMacroDistribution = () => {
    if (loading) return <CircularProgress size={60} thickness={4} sx={{ mb: 2 }} />;
    if (error) return <Alert severity="error">{error}</Alert>;
    
    const calculateMacroDistribution = () => {
      if (!todayMeals || !todayMeals.meals || todayMeals.meals.length === 0) {
        return { protein: 0, carbs: 0, fat: 0, total: 0 };
      }
      
      let totalProtein = 0;
      let totalCarbs = 0;
      let totalFat = 0;
      
      todayMeals.meals.forEach(meal => {
        if (meal && meal.macros) {
          totalProtein += meal.macros.protein || 0;
          totalCarbs += meal.macros.carbs || 0;
          totalFat += meal.macros.fat || 0;
        }
      });
      
      const total = totalProtein + totalCarbs + totalFat;
      
      return {
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat,
        total
      };
    };
    
    const macroDistribution = calculateMacroDistribution();
    
    if (macroDistribution.total === 0) {
      return (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          p: 4, 
          minHeight: 300, 
          textAlign: 'center',
          bgcolor: alpha(theme.palette.info.main, 0.03),
          borderRadius: 2,
          border: `1px dashed ${alpha(theme.palette.info.main, 0.2)}` 
        }}>
          <Restaurant sx={{ fontSize: 60, color: alpha(theme.palette.info.main, 0.4), mb: 2 }} />
          <Typography variant="h6" gutterBottom color="info.main">
            Nessun dato sui macronutrienti per oggi
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300, mb: 3 }}>
            Seleziona un piano pasto o aggiungi alimenti al diario per visualizzare la distribuzione
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button 
              variant="outlined" 
              color="info" 
              component={Link} 
              to="/meal-planner"
              size="small"
              startIcon={<RestaurantMenuIcon />}
            >
              Piano Pasti
            </Button>
            <Button 
              variant="outlined" 
              color="info" 
              component={Link} 
              to="/diary"
              size="small"
              startIcon={<Today />}
            >
              Diario
            </Button>
          </Stack>
        </Box>
      );
    }
    
    const proteinPercent = Math.round((macroDistribution.protein / macroDistribution.total) * 100) || 0;
    const carbsPercent = Math.round((macroDistribution.carbs / macroDistribution.total) * 100) || 0;
    const fatPercent = Math.round((macroDistribution.fat / macroDistribution.total) * 100) || 0;
    
    const pieData = [
      { name: 'Proteine', value: macroDistribution.protein, color: '#8884d8' },
      { name: 'Carboidrati', value: macroDistribution.carbs, color: '#82ca9d' },
      { name: 'Grassi', value: macroDistribution.fat, color: '#ffc658' }
    ].filter(item => item.value > 0);
    
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Distribuzione Macronutrienti di Oggi
        </Typography>
        
        {pieData.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center' }}>
            <Box sx={{ height: 250, width: '100%', maxWidth: { md: '50%' } }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<></>} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            
            <Box sx={{ width: '100%', maxWidth: { md: '50%' }, mt: { xs: 2, md: 0 }, pl: { md: 4 } }}>
              <Typography variant="subtitle1" gutterBottom>
                Dettaglio Macronutrienti:
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Proteine: {macroDistribution.protein}g ({proteinPercent}%)
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={proteinPercent} 
                  sx={{ height: 8, borderRadius: 5, bgcolor: alpha('#8884d8', 0.2), '& .MuiLinearProgress-bar': { bgcolor: '#8884d8' } }} 
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Carboidrati: {macroDistribution.carbs}g ({carbsPercent}%)
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={carbsPercent} 
                  sx={{ height: 8, borderRadius: 5, bgcolor: alpha('#82ca9d', 0.2), '& .MuiLinearProgress-bar': { bgcolor: '#82ca9d' } }} 
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Grassi: {macroDistribution.fat}g ({fatPercent}%)
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={fatPercent} 
                  sx={{ height: 8, borderRadius: 5, bgcolor: alpha('#ffc658', 0.2), '& .MuiLinearProgress-bar': { bgcolor: '#ffc658' } }} 
                />
              </Box>
              
              <Typography variant="body2" sx={{ mt: 2 }}>
                Totale: {macroDistribution.total}g
              </Typography>
            </Box>
          </Box>
        ) : (
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            Nessun dato disponibile per oggi
          </Typography>
        )}
      </Box>
    );
  };

  const renderDayMeals = () => {
    if (!todayMeals?.meals) return null;

    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Pasti del Giorno
        </Typography>
        {todayMeals.meals.map((meal: any, index: number) => {
          let totalCalories = 0;
          let totalProtein = 0;
          let totalCarbs = 0;
          let totalFat = 0;

          // Utilizziamo sempre il campo foods normalizzato
          if (meal.foods && meal.foods.length > 0) {
            meal.foods.forEach((food: any) => {
              totalCalories += food.calories || 0;
              totalProtein += food.protein || 0;
              totalCarbs += food.carbs || 0;
              totalFat += food.fat || 0;
            });
          } else {
            // Fallback ai valori del pasto se foods non è disponibile
            totalCalories = meal.calories || 0;
            totalProtein = meal.macros?.protein || 0;
            totalCarbs = meal.macros?.carbs || 0;
            totalFat = meal.macros?.fat || 0;
          }

          const today = new Date().toISOString().split('T')[0];
          const mealId = `${today}-${meal.name}-${index}`;
          const isFlagged = flaggedMeals.has(mealId);

          return (
            <Card key={index} sx={{ mb: 2, position: 'relative', borderLeft: isFlagged ? '4px solid #FF6B6B' : undefined }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {meal.time} - {meal.name}
                  </Typography>
                  <IconButton 
                    color={isFlagged ? "error" : "default"} 
                    onClick={() => toggleFlagMeal(mealId)}
                    size="small"
                  >
                    {isFlagged ? <Flag /> : <FlagOutlined />}
                  </IconButton>
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {`${Math.round(totalCalories)} kcal [P: ${Math.round(totalProtein)}g C: ${Math.round(totalCarbs)}g G: ${Math.round(totalFat)}g]`}
                </Typography>
                
                <Divider sx={{ my: 1 }} />
                
                <List dense>
                  {meal.foods?.map((food: any, foodIndex: number) => (
                    <ListItem key={foodIndex} sx={{ py: 0.25 }}>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center">
                            <Typography variant="body2">
                              {food.name}, {food.quantity || "N/D"}
                            </Typography>
                            {(food.protein > 15 || food.carbs > 30 || food.fat > 15) && (
                              <Tooltip title={`P: ${food.protein}g, C: ${food.carbs}g, G: ${food.fat}g`}>
                                <Box>
                                  <IconButton size="small">
                                    <Info fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Tooltip>
                            )}
                          </Box>
                        }
                        secondary={`${food.calories || 0} kcal`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    );
  };

  const renderProgress = () => {
    if (calorieHistory.length === 0) return null;
    
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Progressi
        </Typography>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            data={calorieHistory}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <RechartsTooltip content={<></>} />
            <Area type="monotone" dataKey="calories" stroke="#FF6B6B" fill="#FF6B6B" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    );
  };
  
  const renderGoals = () => {
    if (macroTrends.length === 0) return null;
    
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Obiettivi
        </Typography>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={macroTrends}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <RechartsTooltip content={<></>} />
            <Legend />
            <Bar dataKey="protein" name="Proteine" fill="#FF6B6B" />
            <Bar dataKey="carbs" name="Carboidrati" fill="#4ECDC4" />
            <Bar dataKey="fat" name="Grassi" fill="#FFD93D" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    );
  };

  const renderShoppingList = () => {
    if (!plan?.days || plan.days.length === 0) return null;
    
    const allIngredients: Record<string, { amount: number, unit: string }> = {};
    
    try {
      plan.days.forEach(day => {
        if (!day || !day.meals) return;
        
        day.meals.forEach(meal => {
          if (!meal || !meal.ingredients) return;
          
          meal.ingredients.forEach(ingredient => {
            if (!ingredient || !ingredient.name) return;
            
            const name = ingredient.name.toLowerCase();
            const amount = parseFloat(ingredient.amount) || 0;
            const unit = ingredient.unit || 'g';
            
            if (allIngredients[name]) {
              allIngredients[name].amount += amount;
            } else {
              allIngredients[name] = { amount, unit };
            }
          });
        });
      });
      
      const ingredientList = Object.entries(allIngredients).map(([name, { amount, unit }]) => ({
        name,
        amount,
        unit
      }));
      
      ingredientList.sort((a, b) => a.name.localeCompare(b.name));
      
      return (
        <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <ShoppingCartIcon sx={{ mr: 1 }} /> Lista della Spesa
          </Typography>
          
          {ingredientList.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: 2 }}>
              Nessun ingrediente trovato nel piano attuale.
            </Typography>
          ) : (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {ingredientList.map((ingredient, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 1.5, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      bgcolor: alpha('#4caf50', 0.05),
                      borderRadius: 1,
                      border: `1px solid ${alpha('#4caf50', 0.2)}` 
                    }}
                  >
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {ingredient.name}
                    </Typography>
                    <Chip 
                      size="small" 
                      label={`${ingredient.amount} ${ingredient.unit}`}
                      sx={{ bgcolor: 'white' }}
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
              size="small" 
              startIcon={<ShoppingCartIcon />} 
              variant="contained"
              color="warning"
              onClick={() => window.open('https://www.amazon.it/s?k=' + encodeURIComponent(ingredientList.map(item => item.name).join('+')), '_blank')}
            >
              Compra su Amazon
            </Button>
            <Button 
              size="small" 
              startIcon={<PrintIcon />} 
              variant="outlined"
              onClick={() => window.print()}
            >
              Stampa Lista
            </Button>
          </Box>
        </Box>
      );
    } catch (error) {
      console.error('Errore nella generazione della lista della spesa:', error);
      return (
        <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
            <ShoppingCartIcon sx={{ mr: 1 }} /> Errore nella lista della spesa
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Si è verificato un errore durante la generazione della lista della spesa.
          </Typography>
        </Box>
      );
    }
  };

  const renderHydrationTracker = () => {
    const waterGlasses = 8; // Numero massimo di bicchieri
    
    return (
      <Box>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <LocalDrink sx={{ mr: 1, color: '#2196f3' }} /> Idratazione
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Tieni traccia dell'acqua bevuta oggi. Obiettivo: 8 bicchieri.
        </Typography>
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
          {Array.from({ length: waterGlasses }).map((_, index) => (
            <IconButton 
              key={index}
              onClick={() => handleHydrationChange(index + 1)}
              color={index < wellnessData.hydration ? 'primary' : 'default'}
              sx={{ 
                p: 1,
                bgcolor: index < wellnessData.hydration ? 'rgba(33, 150, 243, 0.1)' : 'transparent',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: index < wellnessData.hydration ? 'rgba(33, 150, 243, 0.2)' : 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              <LocalDrink fontSize="large" />
            </IconButton>
          ))}
        </Box>
        
        <Box sx={{ mt: 1, textAlign: 'center' }}>
          <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
            {wellnessData.hydration} / {waterGlasses}
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={(wellnessData.hydration / waterGlasses) * 100} 
            sx={{ mt: 1, height: 10, borderRadius: 5 }}
          />
        </Box>
      </Box>
    );
  };

  const renderSleepTracker = () => {
    return (
      <Box>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <NightsStay sx={{ mr: 1, color: '#673ab7' }} /> Sonno
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          <Typography id="sleep-hours-slider" gutterBottom>
            Ore di sonno: {wellnessData.sleep.hours}
          </Typography>
          <Slider
            value={wellnessData.sleep.hours}
            onChange={handleSleepHoursChange}
            aria-labelledby="sleep-hours-slider"
            valueLabelDisplay="auto"
            step={0.5}
            marks
            min={0}
            max={12}
            sx={{ color: '#673ab7' }}
          />
        </Box>
        
        <Box sx={{ mt: 3 }}>
          <Typography gutterBottom>
            Qualità del sonno:
          </Typography>
          <Rating
            name="sleep-quality"
            value={wellnessData.sleep.quality}
            onChange={handleSleepQualityChange}
            icon={<NightsStay fontSize="large" />}
            emptyIcon={<NightsStay fontSize="large" />}
            sx={{ '& .MuiRating-iconFilled': { color: '#673ab7' } }}
          />
        </Box>
      </Box>
    );
  };

  const renderMoodTracker = () => {
    const moodIcons = [
      <SentimentVeryDissatisfied fontSize="large" />,
      <SentimentDissatisfied fontSize="large" />,
      <SentimentSatisfied fontSize="large" />,
      <SentimentSatisfiedAlt fontSize="large" />,
      <SentimentVerySatisfied fontSize="large" />
    ];
    
    const moodLabels = [
      "Molto Negativo",
      "Negativo",
      "Neutro",
      "Positivo", 
      "Molto Positivo"
    ];
    
    return (
      <Box>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <SentimentSatisfied sx={{ mr: 1, color: '#4caf50' }} /> Umore
        </Typography>
        
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            {moodIcons.map((icon, index) => (
              <Box 
                key={index}
                onClick={() => handleMoodChange({}, index + 1)}
                sx={{
                  cursor: 'pointer',
                  opacity: wellnessData.mood === index + 1 ? 1 : 0.4,
                  transform: wellnessData.mood === index + 1 ? 'scale(1.2)' : 'scale(1)',
                  transition: 'all 0.2s',
                  mx: 1,
                  color: wellnessData.mood === index + 1 ? '#4caf50' : 'text.secondary',
                  '&:hover': {
                    opacity: 0.8,
                    transform: 'scale(1.1)'
                  }
                }}
              >
                {icon}
              </Box>
            ))}
          </Box>
          
          <Typography variant="body1" sx={{ mt: 1, fontWeight: 'medium' }}>
            {wellnessData.mood > 0 ? moodLabels[wellnessData.mood - 1] : 'Seleziona il tuo umore'}
          </Typography>
        </Box>
        
        <Box sx={{ mt: 3 }}>
          <Typography gutterBottom>
            Note del giorno:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            placeholder="Come ti senti oggi? Quali sono i tuoi pensieri?"
            value={wellnessData.notes}
            onChange={handleNotesChange}
          />
        </Box>
      </Box>
    );
  };

  const loadWellnessData = () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const wellnessDataString = localStorage.getItem(`wellnessData_${today}`);
      
      if (wellnessDataString) {
        const parsedData = JSON.parse(wellnessDataString);
        setWellnessData(parsedData);
      } else {
        // Inizializza con data di oggi e valori predefiniti
        setWellnessData({
          date: today,
          hydration: 0,
          sleep: {
            hours: 7,
            quality: 3
          },
          mood: 3,
          notes: ''
        });
      }
    } catch (error) {
      console.error('Errore nel caricamento dei dati di benessere:', error);
    }
  };

  const saveWellnessData = () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(`wellnessData_${today}`, JSON.stringify(wellnessData));
      
      // Feedback visivo potrebbe essere aggiunto qui
      console.log('Dati di benessere salvati con successo');
    } catch (error) {
      console.error('Errore nel salvataggio dei dati di benessere:', error);
    }
  };

  const handleHydrationChange = (value: number) => {
    setWellnessData(prev => ({
      ...prev,
      hydration: value
    }));
  };

  const handleSleepHoursChange = (event: any, value: number | number[]) => {
    setWellnessData(prev => ({
      ...prev,
      sleep: {
        ...prev.sleep,
        hours: value as number
      }
    }));
  };

  const handleSleepQualityChange = (event: any, value: number | null) => {
    setWellnessData(prev => ({
      ...prev,
      sleep: {
        ...prev.sleep,
        quality: value || 3
      }
    }));
  };

  const handleMoodChange = (event: any, value: number | null) => {
    setWellnessData(prev => ({
      ...prev,
      mood: value || 3
    }));
  };

  const handleNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setWellnessData(prev => ({
      ...prev,
      notes: event.target.value
    }));
  };

  const renderLoadingState = () => (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '300px' 
    }}>
      <CircularProgress size={60} thickness={4} sx={{ mb: 2 }} />
      <Typography variant="h6" color="text.secondary">
        Caricamento dashboard...
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Stiamo recuperando i tuoi dati
      </Typography>
    </Box>
  );

  const renderErrorState = () => (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '300px',
      p: 3,
      bgcolor: alpha('#f44336', 0.05),
      borderRadius: 2
    }}>
      <Cancel sx={{ fontSize: 60, color: '#f44336', mb: 2 }} />
      <Typography variant="h6" color="error" gutterBottom>
        Si è verificato un errore
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" sx={{ maxWidth: '600px', mb: 3 }}>
        {error}
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => {
          setError('');
          loadSelectedPlan();
        }}
        startIcon={<RefreshIcon />}
      >
        Riprova
      </Button>
    </Box>
  );

  const renderNoPlanState = () => (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '300px',
      p: 4,
      bgcolor: alpha(theme.palette.success.main, 0.05),
      borderRadius: 2,
      boxShadow: 1
    }}>
      <RestaurantMenuIcon sx={{ fontSize: 70, color: theme.palette.success.main, mb: 3, opacity: 0.8 }} />
      <Typography variant="h5" color="success.main" gutterBottom fontWeight="medium">
        Nessun piano alimentare selezionato
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" sx={{ maxWidth: '600px', mb: 4 }}>
        Per visualizzare la dashboard completa con grafici e statistiche, seleziona un piano alimentare esistente o creane uno nuovo.
      </Typography>
      <Button 
        variant="contained" 
        color="success" 
        component={Link}
        to="/meal-planner"
        startIcon={<AddIcon />}
        size="large"
        sx={{ px: 4, py: 1 }}
      >
        Crea Piano Alimentare
      </Button>
    </Box>
  );

  const LoadingComponent = ({ message = 'Caricamento in corso...' }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
      <CircularProgress size={60} thickness={4} sx={{ mb: 2 }} />
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );

  const ErrorComponent = ({ message = 'Si è verificato un errore' }) => (
    <Alert severity="error" sx={{ mb: 2 }}>
      {message}
    </Alert>
  );

  if (loading) {
    return <LoadingComponent message="Caricamento dashboard..." />;
  }

  if (error) {
    return <ErrorComponent message={error} />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard Salute
        </Typography>
        
        <FormControlLabel
          control={
            <Switch
              checked={realtimeUpdates}
              onChange={handleRealtimeUpdatesChange}
              color="primary"
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 1 }}>
                Aggiornamenti in tempo reale
              </Typography>
              {realtimeUpdates && (
                <CircularProgress size={16} thickness={6} sx={{ color: 'success.main' }} />
              )}
            </Box>
          }
        />
      </Box>

      <Paper sx={{ p: 3, mb: 4, borderRadius: 2, border: plan ? '2px solid #4caf50' : 'none' }}>
        <Typography variant="h5" gutterBottom>
          Riepilogo Piano Alimentare
        </Typography>
        
        {plan ? (
          <>
            <Typography variant="h6" color="primary" gutterBottom>
              {plan.name || 'Piano Personalizzato'}
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              {plan.calories_target && (
                <Chip 
                  icon={<LocalFireDepartment />} 
                  label={`${plan.calories_target} calorie`} 
                  color="primary" 
                  variant="outlined"
                />
              )}
              
              {plan.description && (
                <Chip 
                  icon={<Description />} 
                  label={plan.description} 
                  variant="outlined" 
                />
              )}
              
              <Chip 
                icon={<Today />} 
                label={`Aggiornato: ${new Date().toLocaleString()}`} 
                variant="outlined" 
              />
              
              <Chip 
                icon={<CheckCircleIcon />} 
                label="Piano Selezionato" 
                color="success"
                sx={{ fontWeight: 'bold' }}
              />
            </Box>
            
            <Button 
              variant="outlined" 
              color="primary" 
              startIcon={<Edit />}
              component={Link}
              to="/meal-planner"
              sx={{ mt: 1 }}
            >
              Modifica Piano
            </Button>
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Nessun piano alimentare selezionato
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
              component={Link}
              to="/meal-planner"
              sx={{ mt: 1 }}
            >
              Crea Piano Alimentare
            </Button>
          </Box>
        )}
      </Paper>

      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          {renderCalorieChart()}
        </Grid>
        <Grid item xs={12} md={6}>
          {renderMacroChart()}
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        {renderMacroDistribution()}
      </Paper>

      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        {renderDayMeals()}
      </Paper>

      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        {renderShoppingList()}
      </Paper>

      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}>
        Monitoraggio del Benessere
      </Typography>

      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            {renderHydrationTracker()}
          </Grid>
          <Grid item xs={12} md={4}>
            {renderSleepTracker()}
          </Grid>
          <Grid item xs={12} md={4}>
            {renderMoodTracker()}
          </Grid>
        </Grid>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<SaveIcon />}
            onClick={saveWellnessData}
            size="large"
          >
            Salva Dati di Benessere
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
