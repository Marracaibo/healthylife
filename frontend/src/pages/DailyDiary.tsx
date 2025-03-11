import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  IconButton,
  Grid,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Chip,
  Button,
  Tooltip,
  useTheme,
  CircularProgress,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import {
  Restaurant,
  LocalDining,
  FreeBreakfast,
  Coffee,
  NavigateBefore,
  NavigateNext,
  Add,
  CheckCircle,
  LocalFireDepartment,
  WaterDrop,
  EggAlt,
  GrassOutlined,
  Timer,
  CalendarMonth,
  ViewWeek,
  Edit,
  QrCodeScanner,
  Delete
} from '@mui/icons-material';
import { format, startOfWeek, addDays, isSameDay, isToday } from 'date-fns';
import { it } from 'date-fns/locale';
import { alpha, styled } from '@mui/material/styles';
import MonthlyCalendar from '../components/MonthlyCalendar';
import FoodSearchDialog from '../components/FoodSearchDialog';
import BarcodeScanner from '../components/BarcodeScanner';
import { nutritionCalculationService } from '../services/nutritionCalculationService';

// Interfacce
interface Food {
  name: string;
  amount?: string;
  calories: number;
  macros?: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface Meal {
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

interface DayPlan {
  date: string;
  meals: Meal[];
  totalCalories: number;
  totalMacros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface MealPlan {
  id: number;
  name: string;
  goal: string;
  calories_target: number;
  days: DayPlan[];
}

// Componenti stilizzati
const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(10)
}));

const HeaderCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.primary.contrastText,
  borderRadius: 20,
  marginBottom: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

const WeekNavigator = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  marginBottom: theme.spacing(3),
  borderRadius: 15,
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(10px)',
}));

const DayButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'selected' && prop !== 'isToday',
})<{ selected?: boolean; isToday?: boolean }>(({ theme, selected, isToday }) => ({
  minWidth: 0,
  borderRadius: 12,
  padding: theme.spacing(1, 2),
  margin: theme.spacing(0, 0.5),
  backgroundColor: selected 
    ? theme.palette.primary.main
    : isToday
    ? alpha(theme.palette.primary.main, 0.1)
    : 'transparent',
  color: selected
    ? theme.palette.primary.contrastText
    : theme.palette.text.primary,
  '&:hover': {
    backgroundColor: selected
      ? theme.palette.primary.dark
      : alpha(theme.palette.primary.main, 0.2),
  },
}));

const MealCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: 16,
  background: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(10px)',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const MacroChip = styled(Chip)(({ theme }) => ({
  borderRadius: 8,
  height: 28,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  '& .MuiChip-icon': {
    color: theme.palette.primary.main,
  },
}));

const ProgressIndicator = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: 120,
  height: 120,
  borderRadius: '50%',
  background: `conic-gradient(${theme.palette.primary.main} var(--progress), ${alpha(theme.palette.primary.main, 0.1)} 0deg)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: '10%',
    borderRadius: '50%',
    background: theme.palette.background.paper,
  },
}));

const DailyDiary = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [navValue, setNavValue] = useState(2); // 2 rappresenta "Diario" nella barra di navigazione
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [todayMeals, setTodayMeals] = useState<Meal[]>([]);
  const [calorieConsumate, setCalorieConsumate] = useState(0);
  const [completedMeals, setCompletedMeals] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [mealsData, setMealsData] = useState<Array<{date: string, mealsCount: number}>>([]);
  const [openFoodSearchDialog, setOpenFoodSearchDialog] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [showMealTypeDialog, setShowMealTypeDialog] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('');
  const [confirmRemoveDialog, setConfirmRemoveDialog] = useState(false);
  const [mealToRemove, setMealToRemove] = useState<Meal | null>(null);
  const [mealTypeOptions] = useState([
    { value: 'Colazione', icon: <FreeBreakfast /> },
    { value: 'Spuntino mattutino', icon: <Coffee /> },
    { value: 'Pranzo', icon: <LocalDining /> },
    { value: 'Spuntino pomeridiano', icon: <Coffee /> },
    { value: 'Cena', icon: <LocalDining /> },
    { value: 'Spuntino serale', icon: <Coffee /> }
  ]);

  // Calcola i giorni della settimana
  useEffect(() => {
    const startDate = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const days = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
    setCurrentWeek(days);
  }, [selectedDate]);

  // Carica il piano pasti dal localStorage
  useEffect(() => {
    try {
      const planJson = localStorage.getItem('selectedPlan');
      if (planJson) {
        const plan = JSON.parse(planJson);
        setMealPlan(plan);
        
        // Prepara i dati per il calendario mensile
        if (plan && plan.days) {
          const mealsDataArray = plan.days.map((day: DayPlan) => ({
            date: day.date.split('T')[0],
            mealsCount: day.meals.length
          }));
          setMealsData(mealsDataArray);
        }
      }
      
      // Carica i pasti completati
      const completedJson = localStorage.getItem('completedMeals');
      if (completedJson) {
        setCompletedMeals(new Set(JSON.parse(completedJson)));
      }
    } catch (error) {
      console.error('Errore nel caricamento del piano pasti:', error);
    }
  }, []);

  // Aggiorna i pasti del giorno selezionato
  useEffect(() => {
    if (!mealPlan) return;
    
    // Formato data ISO: YYYY-MM-DD
    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
    
    // Trova il giorno corrispondente nel piano
    const dayPlan = mealPlan.days.find(day => {
      // Compara solo la data (senza l'ora)
      const dayDate = day.date.split('T')[0];
      return dayDate === selectedDateStr;
    });
    
    if (dayPlan) {
      setTodayMeals(dayPlan.meals || []);
      // Calcola calorie totali
      const totalCalories = dayPlan.meals.reduce((total, meal) => {
        return total + (meal.calories || 0);
      }, 0);
      setCalorieConsumate(totalCalories);
    } else {
      setTodayMeals([]);
      setCalorieConsumate(0);
    }
  }, [mealPlan, selectedDate]);

  // Gestisci la selezione del giorno
  const handleDaySelect = (date: Date) => {
    setSelectedDate(date);
  };

  // Gestisci la settimana precedente
  const handlePrevWeek = () => {
    const newDate = addDays(currentWeek[0], -7);
    setSelectedDate(newDate);
  };

  // Gestisci la settimana successiva
  const handleNextWeek = () => {
    const newDate = addDays(currentWeek[0], 7);
    setSelectedDate(newDate);
  };

  // Gestisci il completamento dei pasti
  const toggleMealCompleted = (mealId: string) => {
    const newCompletedMeals = new Set(completedMeals);
    
    if (newCompletedMeals.has(mealId)) {
      newCompletedMeals.delete(mealId);
    } else {
      newCompletedMeals.add(mealId);
    }
    
    setCompletedMeals(newCompletedMeals);
    
    // Salva lo stato nel localStorage
    localStorage.setItem('completedMeals', JSON.stringify(Array.from(newCompletedMeals)));
  };

  // Restituisci l'icona appropriata per il tipo di pasto
  const getMealIcon = (mealType: string) => {
    switch(mealType?.toLowerCase()) {
      case 'colazione':
        return <FreeBreakfast />;
      case 'pranzo':
        return <Restaurant />;
      case 'cena':
        return <LocalDining />;
      case 'spuntino':
      case 'snack':
        return <Coffee />;
      default:
        return <Restaurant />;
    }
  };

  // Gestisci il cambio della vista
  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: 'week' | 'month' | null,
  ) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  // Gestisci l'aggiunta di un pasto
  const handleAddMeal = () => {
    setSelectedMeal(null);
    setSelectedMealType(getDefaultMealName());
    setShowMealTypeDialog(true);
  };

  // Gestisci la modifica di un pasto
  const handleEditMeal = (meal: Meal) => {
    setSelectedMeal(meal);
    setSelectedMealType(meal.name);
    setOpenFoodSearchDialog(true);
  };

  // Gestisci la chiusura del dialog di ricerca cibo
  const handleCloseFoodSearchDialog = () => {
    setOpenFoodSearchDialog(false);
    setSelectedMeal(null); // Resetta il pasto selezionato quando si chiude il dialog
  };

  // Gestisci la selezione di un alimento dal dialog
  const handleFoodSelect = (food: any) => {
    // Crea una copia del piano pasti o creane uno nuovo se non esiste
    let updatedPlan: MealPlan;
    
    if (!mealPlan) {
      // Se non c'è un piano, creane uno temporaneo
      updatedPlan = {
        id: Date.now(),
        name: "Piano Personalizzato",
        goal: "Personalizzato",
        calories_target: 2000,
        days: []
      };
    } else {
      // Altrimenti usa una copia del piano esistente
      updatedPlan = JSON.parse(JSON.stringify(mealPlan));
    }

    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
    
    // Trova o crea il giorno selezionato nel piano
    let dayIndex = -1;
    if (updatedPlan.days && updatedPlan.days.length > 0) {
      dayIndex = updatedPlan.days.findIndex(day => day.date.split('T')[0] === selectedDateStr);
    }
    
    if (dayIndex === -1) {
      // Se il giorno non esiste, crealo
      const newDay: DayPlan = {
        date: `${selectedDateStr}T00:00:00`,
        meals: [],
        totalCalories: 0,
        totalMacros: { protein: 0, carbs: 0, fat: 0 }
      };
      if (!updatedPlan.days) {
        updatedPlan.days = [];
      }
      updatedPlan.days.push(newDay);
      dayIndex = updatedPlan.days.length - 1; // Imposta dayIndex al giorno appena aggiunto
    }
    
    // Usa il servizio di calcolo nutrizionale per garantire consistenza
    const macros = food.macros || { protein: 0, carbs: 0, fat: 0 };
    
    // Log per debug
    console.log('Aggiungo alimento al pasto:', {
      alimento: food.name,
      calorie: food.calories,
      macros: macros
    });
    
    if (selectedMeal) {
      // Modifica un pasto esistente: aggiungi l'alimento al pasto
      const mealIndex = updatedPlan.days[dayIndex].meals.findIndex(m => m.name === selectedMeal.name);
      
      if (mealIndex !== -1) {
        // Aggiungi il cibo al pasto
        updatedPlan.days[dayIndex].meals[mealIndex].foods.push(food);
        
        // Aggiorna le calorie del pasto
        updatedPlan.days[dayIndex].meals[mealIndex].calories += food.calories;
        
        // Aggiorna i macronutrienti del pasto
        updatedPlan.days[dayIndex].meals[mealIndex].macros.protein += macros.protein;
        updatedPlan.days[dayIndex].meals[mealIndex].macros.carbs += macros.carbs;
        updatedPlan.days[dayIndex].meals[mealIndex].macros.fat += macros.fat;
      }
    } else {
      // Aggiungi un nuovo pasto
      const newMeal: Meal = {
        name: selectedMealType,
        time: getDefaultMealTime(),
        type: selectedMealType,
        calories: food.calories,
        foods: [food],
        macros: { ...macros }
      };
      
      updatedPlan.days[dayIndex].meals.push(newMeal);
    }
    
    // Aggiorna le calorie totali e i macronutrienti del giorno
    updatedPlan.days[dayIndex].totalCalories += food.calories;
    updatedPlan.days[dayIndex].totalMacros.protein += macros.protein;
    updatedPlan.days[dayIndex].totalMacros.carbs += macros.carbs;
    updatedPlan.days[dayIndex].totalMacros.fat += macros.fat;
    
    // Salva il piano aggiornato
    setMealPlan(updatedPlan);
    localStorage.setItem('selectedPlan', JSON.stringify(updatedPlan));
    
    // Aggiorna i pasti del giorno
    setTodayMeals(updatedPlan.days[dayIndex].meals);
    setCalorieConsumate(updatedPlan.days[dayIndex].totalCalories);
    
    // Aggiorna i dati per il calendario mensile
    const mealsDataArray = updatedPlan.days.map((day: DayPlan) => ({
      date: day.date.split('T')[0],
      mealsCount: day.meals.length
    }));
    setMealsData(mealsDataArray);
    
    // Chiudi il dialog
    setOpenFoodSearchDialog(false);
  };

  // Funzione per ottenere un nome predefinito per il nuovo pasto
  const getDefaultMealName = (): string => {
    const hour = selectedDate.getHours();
    
    if (hour < 10) return "Colazione";
    if (hour < 12) return "Spuntino mattutino";
    if (hour < 15) return "Pranzo";
    if (hour < 18) return "Spuntino pomeridiano";
    if (hour < 22) return "Cena";
    return "Spuntino serale";
  };
  
  // Funzione per ottenere un orario predefinito per il nuovo pasto
  const getDefaultMealTime = (): string => {
    const hour = selectedDate.getHours();
    const minutes = selectedDate.getMinutes();
    return `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleMealTypeSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMealType(event.target.value);
    setOpenFoodSearchDialog(true);
    setShowMealTypeDialog(false);
  };

  // Funzione per gestire l'aggiunta di alimenti tramite barcode scanner
  const handleAddFood = (food: Food, meal: Meal) => {
    setSelectedMeal(meal);
    handleFoodSelect(food);
  };

  // Gestisci la rimozione di un pasto
  const handleRemoveMeal = (meal: Meal) => {
    setMealToRemove(meal);
    setConfirmRemoveDialog(true);
  };

  // Conferma la rimozione del pasto
  const confirmRemoveMeal = () => {
    if (!mealToRemove) return;
    
    // Crea una copia del piano pasti
    if (!mealPlan) {
      setConfirmRemoveDialog(false);
      return;
    }
    
    const updatedPlan = JSON.parse(JSON.stringify(mealPlan));
    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
    
    // Trova il giorno nel piano
    const dayIndex = updatedPlan.days.findIndex((day: DayPlan) => day.date.split('T')[0] === selectedDateStr);
    
    if (dayIndex === -1) {
      setConfirmRemoveDialog(false);
      return;
    }
    
    // Trova e rimuovi il pasto
    const mealIndex = updatedPlan.days[dayIndex].meals.findIndex((m: Meal) => m.name === mealToRemove.name);
    
    if (mealIndex !== -1) {
      // Rimuovi il pasto
      const removedMeal = updatedPlan.days[dayIndex].meals.splice(mealIndex, 1)[0];
      
      // Aggiorna le calorie totali del giorno
      updatedPlan.days[dayIndex].totalCalories -= removedMeal.calories;
      
      // Aggiorna i macronutrienti totali del giorno
      if (removedMeal.macros) {
        updatedPlan.days[dayIndex].totalMacros.protein -= removedMeal.macros.protein;
        updatedPlan.days[dayIndex].totalMacros.carbs -= removedMeal.macros.carbs;
        updatedPlan.days[dayIndex].totalMacros.fat -= removedMeal.macros.fat;
      }
      
      // Salva il piano aggiornato
      setMealPlan(updatedPlan);
      localStorage.setItem('selectedPlan', JSON.stringify(updatedPlan));
      
      // Aggiorna i pasti del giorno
      setTodayMeals(updatedPlan.days[dayIndex].meals);
      setCalorieConsumate(updatedPlan.days[dayIndex].totalCalories);
      
      // Aggiorna i dati per il calendario mensile
      const mealsDataArray = updatedPlan.days.map((day: DayPlan) => ({
        date: day.date.split('T')[0],
        mealsCount: day.meals.length
      }));
      setMealsData(mealsDataArray);
      
      // Rimuovi il pasto dai pasti completati se presente
      const mealId = `${selectedDateStr}-${mealToRemove.name}`;
      if (completedMeals.has(mealId)) {
        const newCompletedMeals = new Set(completedMeals);
        newCompletedMeals.delete(mealId);
        setCompletedMeals(newCompletedMeals);
        localStorage.setItem('completedMeals', JSON.stringify(Array.from(newCompletedMeals)));
      }
    }
    
    setConfirmRemoveDialog(false);
    setMealToRemove(null);
  };

  return (
    <StyledContainer>
      {/* Header */}
      <HeaderCard>
        <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
          {format(selectedDate, 'EEEE d MMMM', { locale: it })}
        </Typography>
        
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <ProgressIndicator style={{ '--progress': `${(calorieConsumate / (mealPlan?.calories_target || 2000)) * 100}%` }} />
          <Typography variant="body2" sx={{ fontWeight: 500, whiteSpace: 'nowrap', ml: 2 }}>
            {calorieConsumate} / {mealPlan?.calories_target || 2000} kcal
          </Typography>
        </Box>
      </HeaderCard>

      {/* Istruzioni per l'utilizzo */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: 'info.light', color: 'info.contrastText' }}>
        <Typography variant="body2">
          <strong>Come utilizzare il diario alimentare:</strong>
          <br />
          1. Usa il grande pulsante <Add fontSize="small" sx={{ verticalAlign: 'middle' }}/> blu centrale per aggiungere un nuovo pasto (Colazione, Pranzo, Cena, ecc.)
          <br />
          2. Usa il pulsante <Add fontSize="small" sx={{ verticalAlign: 'middle' }}/> verde accanto al nome del pasto per aggiungere alimenti a un pasto esistente
          <br />
          3. Usa il pulsante <QrCodeScanner fontSize="small" sx={{ verticalAlign: 'middle' }}/> per scansionare il codice a barre di un alimento e aggiungerlo al pasto
          <br />
          4. Usa <CheckCircle fontSize="small" sx={{ verticalAlign: 'middle' }}/> per segnare un pasto come completato
        </Typography>
      </Paper>

      {/* Toggle per cambiare vista */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewChange}
          aria-label="vista calendario"
          size="small"
          sx={{ mb: 2 }}
        >
          <ToggleButton value="week" aria-label="vista settimanale">
            <ViewWeek fontSize="small" sx={{ mr: 1 }} />
            Settimana
          </ToggleButton>
          <ToggleButton value="month" aria-label="vista mensile">
            <CalendarMonth fontSize="small" sx={{ mr: 1 }} />
            Mese
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Vista calendario */}
      {viewMode === 'week' ? (
        <WeekNavigator>
          <IconButton onClick={handlePrevWeek} size="small">
            <NavigateBefore />
          </IconButton>
          
          <Box sx={{ display: 'flex', overflowX: 'auto' }}>
            {currentWeek.map((date, index) => (
              <DayButton key={index} selected={isSameDay(date, selectedDate)} isToday={isToday(date)} onClick={() => handleDaySelect(date)}>
                {format(date, 'd')}
              </DayButton>
            ))}
          </Box>
          
          <IconButton onClick={handleNextWeek} size="small">
            <NavigateNext />
          </IconButton>
        </WeekNavigator>
      ) : (
        <MonthlyCalendar 
          selectedDate={selectedDate} 
          onDateSelect={handleDaySelect} 
          mealsData={mealsData}
        />
      )}

      {/* Lista pasti */}
      {todayMeals.length > 0 ? (
        todayMeals.map((meal, index) => {
          const mealId = `${format(selectedDate, 'yyyy-MM-dd')}-${meal.name}`;
          const isCompleted = completedMeals.has(mealId);
          
          return (
            <MealCard key={index}>
              <CardContent sx={{ pt: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    {meal.name}
                  </Typography>
                  <Box>
                    {/* Pulsante per aggiungere un alimento al pasto */}
                    <IconButton 
                      onClick={() => handleEditMeal(meal)} 
                      size="small"
                      sx={{ 
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        color: 'success.main',
                        mr: 1,
                        '&:hover': {
                          backgroundColor: 'rgba(76, 175, 80, 0.2)',
                        }
                      }}
                    >
                      <Add />
                    </IconButton>
                    
                    {/* Pulsante per la scansione del codice a barre */}
                    <BarcodeScanner onFoodSelect={(food) => {
                      handleAddFood(food, meal);
                    }} />
                    
                    {/* Pulsante per rimuovere il pasto */}
                    <IconButton 
                      onClick={() => handleRemoveMeal(meal)}
                      size="small"
                      sx={{ 
                        backgroundColor: 'rgba(211, 47, 47, 0.1)',
                        color: 'error.main',
                        mr: 1,
                        '&:hover': {
                          backgroundColor: 'rgba(211, 47, 47, 0.2)',
                        }
                      }}
                    >
                      <Delete />
                    </IconButton>
                    
                    {/* Pulsante per segnare il pasto come completato */}
                    <IconButton 
                      onClick={() => toggleMealCompleted(mealId)}
                      sx={{ 
                        backgroundColor: isCompleted ? theme.palette.primary.main : 'rgba(255, 255, 255, 0.1)',
                        color: isCompleted ? 'white' : 'inherit',
                        '&:hover': {
                          backgroundColor: isCompleted ? theme.palette.primary.dark : 'rgba(255, 255, 255, 0.2)',
                        }
                      }}
                      size="small"
                    >
                      {isCompleted ? <CheckCircle /> : <CheckCircle color="disabled" />}
                    </IconButton>
                  </Box>
                </Box>
                
                <List dense disablePadding>
                  {(meal.foods || []).map((food, idx) => (
                    <ListItem key={idx} disablePadding>
                      <ListItemButton dense sx={{ py: 0.5 }}>
                        <ListItemText 
                          primary={food.name} 
                          secondary={`${food.amount || ''} • ${food.calories} kcal`}
                          primaryTypographyProps={{ 
                            variant: 'body2',
                            sx: {
                              textDecoration: isCompleted ? 'line-through' : 'none',
                              opacity: isCompleted ? 0.7 : 1
                            }
                          }}
                          secondaryTypographyProps={{ 
                            variant: 'caption',
                            sx: {
                              opacity: isCompleted ? 0.5 : 0.7
                            }
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                  <MacroChip label={`Proteine: ${meal.macros.protein}g`} icon={<EggAlt />} />
                  <MacroChip label={`Carboidrati: ${meal.macros.carbs}g`} icon={<GrassOutlined />} />
                  <MacroChip label={`Grassi: ${meal.macros.fat}g`} icon={<WaterDrop />} />
                </Box>
              </CardContent>
            </MealCard>
          );
        })
      ) : (
        <Box sx={{ 
          py: 8, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
        }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Restaurant sx={{ fontSize: 60, color: theme => theme.palette.primary.main, opacity: 0.7 }} />
            <Typography variant="h5" align="center" sx={{ fontWeight: 500 }}>
              {mealPlan ? 'Nessun pasto pianificato per questo giorno' : 'Nessun piano pasti caricato'}
            </Typography>
            <Typography variant="body1" align="center" color="text.secondary" sx={{ maxWidth: '80%' }}>
              {mealPlan 
                ? 'Aggiungi dei pasti a questo giorno per iniziare a tracciare la tua alimentazione' 
                : 'Crea o seleziona un piano pasti per iniziare a tracciare la tua alimentazione'
              }
            </Typography>
          </Paper>
        </Box>
      )}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        my: 3,
        position: 'relative',
      }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleAddMeal}
          startIcon={<Add />}
          sx={{
            borderRadius: 8,
            px: 4,
            py: 1.5,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            textTransform: 'none',
            fontSize: '1.1rem',
            fontWeight: 500,
            minWidth: '200px',
          }}
        >
          Aggiungi pasto
        </Button>
      </Box>

      {/* Dialog per la selezione del tipo di pasto */}
      <Dialog
        open={showMealTypeDialog}
        onClose={() => setShowMealTypeDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 0 }}>
          <Box sx={{ typography: 'h5', fontWeight: 600 }}>Scegli il tipo di pasto</Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
            Seleziona il tipo di pasto che desideri aggiungere al tuo diario
          </Typography>
          <RadioGroup
            value={selectedMealType}
            onChange={handleMealTypeSelect}
          >
            {mealTypeOptions.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio color="primary" />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {React.cloneElement(option.icon, { color: 'primary', fontSize: 'small' })}
                    <Typography fontWeight={500}>{option.value}</Typography>
                  </Box>
                }
                sx={{ 
                  my: 0.5, 
                  p: 1,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                  }
                }}
              />
            ))}
          </RadioGroup>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setShowMealTypeDialog(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Annulla
          </Button>
          <Button 
            onClick={() => {
              if (selectedMealType) {
                setOpenFoodSearchDialog(true);
                setShowMealTypeDialog(false);
              }
            }}
            variant="contained"
            disabled={!selectedMealType}
            sx={{ borderRadius: 2 }}
          >
            Continua
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog per confermare la rimozione del pasto */}
      <Dialog
        open={confirmRemoveDialog}
        onClose={() => setConfirmRemoveDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Conferma rimozione pasto
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Sei sicuro di voler rimuovere il pasto "{mealToRemove?.name}" dal diario?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Questa azione non può essere annullata e tutti gli alimenti associati verranno rimossi.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmRemoveDialog(false)} color="primary">
            Annulla
          </Button>
          <Button onClick={confirmRemoveMeal} color="error" variant="contained" autoFocus>
            Rimuovi
          </Button>
        </DialogActions>
      </Dialog>

      <FoodSearchDialog 
        open={openFoodSearchDialog} 
        onClose={handleCloseFoodSearchDialog} 
        selectedMeal={selectedMeal}
        mealType={selectedMealType} 
        onFoodSelect={handleFoodSelect}
      />
    </StyledContainer>
  );
};

export default DailyDiary;
