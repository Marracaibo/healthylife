import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Alert,
  SelectChangeEvent,
  IconButton,
  Snackbar,
  Tabs,
  Tab,
  Divider,
  Chip,
  Avatar,
  Stack,
  CardHeader,
  CardMedia,
  CardActions,
  Tooltip,
  useTheme
} from '@mui/material';
import { 
  Restaurant, 
  Delete as DeleteIcon, 
  Edit as EditIcon, 
  Visibility as VisibilityIcon, 
  Dashboard as DashboardIcon,
  FitnessCenter as FitnessCenterIcon,
  LocalDining as LocalDiningIcon,
  Fastfood as FastfoodIcon,
  Add as AddIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import TemplateBasedPlanner from '../components/TemplateBasedPlanner';
import ManualMealPlanner from '../components/ManualMealPlanner';
import { MealTemplate } from '../data/mealTemplates';
import { sampleMealPlans } from '../data/sampleMealPlans';
import { mealTemplates } from '../data/mealTemplates';
import { monthlyMealTemplates } from '../data/monthlyMealTemplates';

import { useMediaQuery } from '@mui/material';
import { Theme } from '@mui/material/styles';

interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

interface MealMacros {
  protein: number;
  carbs: number;
  fat: number;
}

interface Meal {
  name: string;
  time: string;
  calories: number;
  macros: MealMacros;
  ingredients: Ingredient[];
  instructions: string[];
  foods?: any[];
}

interface DayPlan {
  date: string;
  meals: Meal[];
}

interface MealPlan {
  id: number;
  name: string;
  goal: string;
  calories_target: number;
  macros: MealMacros;
  dietary_restrictions: string[];
  days: DayPlan[];
}

// Utilizziamo la variabile d'ambiente per l'URL dell'API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const MealPlanner: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [plans, setPlans] = useState<MealPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<MealPlan | null>(null);
  const [goal, setGoal] = useState('general_health');
  const [caloriesTarget, setCaloriesTarget] = useState(2000);
  const [macros, setMacros] = useState({
    protein: 30,
    carbs: 40,
    fat: 30
  });
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarVariant, setSnackbarVariant] = useState('success');
  const [mode, setMode] = useState<'ai' | 'template' | 'manual'>('ai');
  const [isEditingPlanName, setIsEditingPlanName] = useState(false);
  const [editedPlanName, setEditedPlanName] = useState('');

  // Aggiungi i valori validi per gli obiettivi
  const VALID_GOALS = [
    { value: 'weight_loss', label: 'Perdita di peso' },
    { value: 'muscle_gain', label: 'Aumento massa muscolare' },
    { value: 'maintenance', label: 'Mantenimento' },
    { value: 'general_health', label: 'Salute generale' }
  ];

  const navigate = useNavigate();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Impostiamo un timeout di sicurezza per uscire dallo stato di loading dopo 5 secondi
      const loadingTimeout = setTimeout(() => {
        if (loading) {
          console.log("Timeout di caricamento raggiunto, uscita forzata dallo stato di loading");
          setLoading(false);
        }
      }, 5000);
      
      // Carichiamo prima i piani dal localStorage
      let localPlans: MealPlan[] = [];
      try {
        const storedPlans = localStorage.getItem('mealPlans');
        if (storedPlans) {
          const parsedPlans = JSON.parse(storedPlans);
          if (Array.isArray(parsedPlans)) {
            localPlans = parsedPlans;
            console.log("Piani caricati dal localStorage:", localPlans.length);
          }
        }
      } catch (e) {
        console.error("Errore nel parsing dei piani dal localStorage:", e);
      }
      
      // Poi tentiamo di caricare i piani dal backend con meccanismo di retry
      let backendPlans: MealPlan[] = [];
      let retryCount = 0;
      const maxRetries = 3;
      
      const fetchBackendPlans = async () => {
        try {
          // Aggiungiamo un timeout per evitare lunghe attese se il backend non risponde
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 secondi di timeout
          
          try {
            console.log(`Tentativo di connessione al backend (${retryCount + 1}/${maxRetries})...`);
            const response = await fetch(`${API_BASE_URL}/meal-plans`, {
              signal: controller.signal
            });
            clearTimeout(timeoutId);
            
            if (response.ok) {
              const data = await response.json();
              if (Array.isArray(data)) {
                backendPlans = data;
                console.log("Piani caricati dal backend:", backendPlans.length);
              }
            } else {
              console.log("Risposta non valida dal backend:", response.status);
              
              if (retryCount < maxRetries - 1) {
                retryCount++;
                console.log(`Riprovo tra 3 secondi... (tentativo ${retryCount + 1}/${maxRetries})`);
                setTimeout(fetchBackendPlans, 3000);
                return;
              }
            }
          } catch (fetchError) {
            clearTimeout(timeoutId);
            if (fetchError.name === 'AbortError') {
              console.log("La richiesta al backend è scaduta");
            } else {
              console.error("Errore nella connessione al backend:", fetchError);
            }
            
            // Riprova se non abbiamo raggiunto il numero massimo di tentativi
            if (retryCount < maxRetries - 1) {
              retryCount++;
              console.log(`Riprovo tra 3 secondi... (tentativo ${retryCount + 1}/${maxRetries})`);
              setTimeout(fetchBackendPlans, 3000);
              return;
            }
          }
        } catch (e) {
          console.error("Errore nel caricamento dei piani dal backend:", e);
        }
        
        // Questo codice viene eseguito se abbiamo dati dal backend o se abbiamo esaurito i tentativi
        finishLoading();
      };
      
      const finishLoading = () => {
        // Combiniamo i piani dal localStorage e dal backend, dando priorità ai piani locali
        const localPlanIds = new Set(localPlans.map(p => p.id));
        const uniqueBackendPlans = backendPlans.filter(p => !localPlanIds.has(p.id));
        const allPlans = [...localPlans, ...uniqueBackendPlans];
        
        // Se non ci sono piani, utilizza i piani di esempio
        if (allPlans.length === 0) {
          console.log("Nessun piano trovato, utilizzo piani di esempio");
          allPlans.push(...sampleMealPlans);
        }
        
        setPlans(allPlans);
        console.log("Totale piani combinati:", allPlans.length);

        // Ora carichiamo il piano selezionato
        try {
          const storedPlanId = localStorage.getItem('selectedPlanId');
          if (storedPlanId) {
            const planId = parseInt(storedPlanId);
            // Cerchiamo prima nei piani combinati
            const selectedPlan = allPlans.find(p => p.id === planId);
            
            if (selectedPlan) {
              console.log("Piano selezionato trovato:", selectedPlan.name);
              setSelectedPlanId(planId);
              setSelectedPlan(selectedPlan);
            } else {
              // Se il piano non è stato trovato nei piani combinati, proviamo a caricarlo direttamente
              console.log("Piano selezionato non trovato nei piani combinati, cerco direttamente");
              const storedPlanJson = localStorage.getItem('selectedPlan');
              if (storedPlanJson) {
                try {
                  const localPlan = JSON.parse(storedPlanJson);
                  console.log("Piano selezionato caricato direttamente:", localPlan.name);
                  setSelectedPlanId(localPlan.id);
                  setSelectedPlan(localPlan);
                  
                  // Aggiungiamo questo piano all'elenco dei piani se non è già presente
                  if (!allPlans.some(p => p.id === localPlan.id)) {
                    const updatedPlans = [...allPlans, localPlan];
                    setPlans(updatedPlans);
                    localStorage.setItem('mealPlans', JSON.stringify(updatedPlans));
                    console.log("Piano selezionato aggiunto all'elenco dei piani");
                  }
                } catch (e) {
                  console.error('Errore nel parsing del piano salvato:', e);
                  // Rimuovi i dati corrotti
                  localStorage.removeItem('selectedPlan');
                  localStorage.removeItem('selectedPlanId');
                }
              }
            }
          }
        } catch (err) {
          console.error('Errore nel caricamento del piano salvato:', err);
          // Rimuovi i dati corrotti
          localStorage.removeItem('selectedPlan');
          localStorage.removeItem('selectedPlanId');
        }
        
        setLoading(false);
        clearTimeout(loadingTimeout); // Puliamo il timeout se usciamo prima
      };
      
      // Avvia il processo di caricamento
      fetchBackendPlans();
    } catch (err) {
      console.error('Errore generale nel caricamento dei dati:', err);
      setError('Errore nel caricamento dei dati: ' + (err instanceof Error ? err.message : String(err)));
      setLoading(false);
      clearTimeout(loadingTimeout); // Puliamo il timeout se usciamo prima
    }
  };

  const selectPlan = (planId: number) => {
    try {
      console.log(`MealPlanner: Selezionando piano con ID ${planId}`);
      const selectedPlan = plans.find(p => p.id === planId);
      
      if (!selectedPlan) {
        setError(`Piano con ID ${planId} non trovato`);
        return;
      }
      
      console.log('MealPlanner: Piano trovato:', selectedPlan);
      
      // Assicuriamoci che il piano abbia tutti i campi necessari
      // e che i pasti abbiano il campo foods per la dashboard
      const normalizedPlan = { ...selectedPlan };
      
      // Verifica e normalizza i pasti per garantire che abbiano sia ingredients che foods
      if (normalizedPlan.days && normalizedPlan.days.length > 0) {
        normalizedPlan.days = normalizedPlan.days.map(day => {
          if (day.meals && day.meals.length > 0) {
            day.meals = day.meals.map(meal => {
              // Se il pasto ha ingredients ma non foods, crea foods dagli ingredients
              if ((!meal.foods || meal.foods.length === 0) && meal.ingredients && meal.ingredients.length > 0) {
                const totalIngredients = meal.ingredients.length;
                const mealMacros = meal.macros || { protein: 0, carbs: 0, fat: 0 };
                const mealCalories = meal.calories || 0;
                
                const proteinPerIngredient = mealMacros.protein / totalIngredients;
                const carbsPerIngredient = mealMacros.carbs / totalIngredients;
                const fatPerIngredient = mealMacros.fat / totalIngredients;
                const caloriesPerIngredient = mealCalories / totalIngredients;
                
                meal.foods = meal.ingredients.map(ing => ({
                  name: ing.name,
                  quantity: ing.amount,
                  calories: caloriesPerIngredient,
                  protein: proteinPerIngredient,
                  carbs: carbsPerIngredient,
                  fat: fatPerIngredient
                }));
                
                console.log(`MealPlanner: Creato ${meal.foods.length} foods per il pasto ${meal.name}`, meal.foods);
              }
              return meal;
            });
          }
          return day;
        });
      }
      
      setSelectedPlanId(planId);
      setSelectedPlan(normalizedPlan);
      
      // Salva nel localStorage
      localStorage.setItem('selectedPlanId', String(planId));
      localStorage.setItem('selectedPlan', JSON.stringify(normalizedPlan));
      
      // Invia un evento per notificare la dashboard
      const event = new CustomEvent('planSelected', { 
        detail: { 
          planId,
          plan: normalizedPlan 
        } 
      });
      window.dispatchEvent(event);
      console.log('MealPlanner: Evento planSelected inviato con piano completo:', normalizedPlan);
      
      setSnackbarMessage('Piano selezionato con successo');
      setSnackbarVariant('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Errore nella selezione del piano:', error);
      setError(error instanceof Error ? error.message : 'Errore nella selezione del piano');
    }
  };

  const handlePlanSelect = (plan: MealPlan) => {
    selectPlan(plan.id);
  };

  const generateMealPlan = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      // Ottieni la data di oggi nel formato corretto
      const today = new Date();

      // Prepara il body della richiesta
      const requestBody = {
        goal,
        calories_target: caloriesTarget,
        macros: {
          protein: macros.protein,
          carbs: macros.carbs,
          fat: macros.fat
        },
        dietary_restrictions: dietaryRestrictions ? dietaryRestrictions.split(',').map(r => r.trim()).filter(r => r) : [],
        start_date: today.toISOString()
      };

      // Tenta di generare piano dal backend
      let newPlan: MealPlan;
      
      try {
        const response = await fetch(`${API_BASE_URL}/meal-plans/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Errore dal server:', errorData);
          let errorMessage = 'Errore sconosciuto';

          if (errorData.detail) {
            if (Array.isArray(errorData.detail)) {
              errorMessage = errorData.detail.map((err: any) => {
                if (err.loc && err.msg) {
                  return `${err.loc.join('.')}: ${err.msg}`;
                }
                return err.toString();
              }).join('\n');
            } else if (typeof errorData.detail === 'object') {
              errorMessage = JSON.stringify(errorData.detail, null, 2);
            } else {
              errorMessage = errorData.detail;
            }
          }

          throw new Error(`Errore nella generazione del piano:\n${errorMessage}`);
        }

        newPlan = await response.json();
      } catch (backendError) {
        console.warn('Errore nella generazione del piano dal backend, utilizzo piano locale:', backendError);
        
        // Se il backend fallisce, crea un piano locale
        newPlan = {
          id: Date.now(), // Timestamp come ID univoco
          name: `Piano ${new Date().toLocaleDateString()}`,
          goal: goal,
          calories_target: caloriesTarget,
          macros: {
            protein: macros.protein,
            carbs: macros.carbs,
            fat: macros.fat
          },
          dietary_restrictions: dietaryRestrictions ? dietaryRestrictions.split(',').map(r => r.trim()).filter(r => r) : [],
          days: [] // Piano vuoto, da popolare in futuro
        };
      }
      
      console.log('Nuovo piano generato:', newPlan);
      
      // Assicuriamoci che l'ID sia definito
      if (!newPlan.id) {
        newPlan.id = Date.now();
      }
      
      // Normalizza i pasti per assicurarsi che abbiano tutti i campi necessari
      if (newPlan.days && newPlan.days.length > 0) {
        newPlan.days = newPlan.days.map(day => {
          if (day.meals && day.meals.length > 0) {
            day.meals = day.meals.map(meal => {
              // Assicurati che ogni pasto abbia macros
              if (!meal.macros) {
                meal.macros = { protein: 0, carbs: 0, fat: 0 };
              }
              
              // Assicurati che ogni pasto abbia foods
              if (!meal.foods || meal.foods.length === 0) {
                // Se ci sono total_calories, usale
                const mealCalories = meal.total_calories || meal.calories || 0;
                
                // Crea foods dagli alimenti menzionati nel pasto
                meal.foods = (meal.foods || []).map(food => ({
                  name: food.name,
                  quantity: food.amount,
                  calories: food.calories,
                  protein: food.protein || 0,
                  carbs: food.carbs || 0,
                  fat: food.fat || 0
                }));
                
                // Se non ci sono foods, crea un food generico
                if (meal.foods.length === 0 && mealCalories > 0) {
                  meal.foods = [{
                    name: meal.name || 'Pasto',
                    calories: mealCalories,
                    protein: meal.macros.protein || 0,
                    carbs: meal.macros.carbs || 0,
                    fat: meal.macros.fat || 0
                  }];
                }
              }
              
              // Assicurati che il campo calories sia definito
              if (!meal.calories && meal.total_calories) {
                meal.calories = meal.total_calories;
              }
              
              return meal;
            });
          }
          return day;
        });
      }
      
      console.log('Nuovo piano normalizzato:', newPlan);
      
      // Aggiorna lo stato e il localStorage
      setPlans(prevPlans => [...prevPlans, newPlan]);
      setSelectedPlanId(newPlan.id);
      setSelectedPlan(newPlan);
      
      // Salva nel localStorage
      try {
        localStorage.setItem('selectedPlanId', String(newPlan.id));
        localStorage.setItem('selectedPlan', JSON.stringify(newPlan));
        
        // Aggiorna la lista completa dei piani
        const updatedPlans = [...plans, newPlan];
        localStorage.setItem('mealPlans', JSON.stringify(updatedPlans));

        // Invia un evento personalizzato per notificare la dashboard
        const event = new CustomEvent('planSelected', { 
          detail: { 
            planId: newPlan.id, 
            plan: newPlan 
          } 
        });
        window.dispatchEvent(event);
        console.log('MealPlanner: Evento planSelected inviato con piano completo:', newPlan);

        const verifyPlan = localStorage.getItem('selectedPlan');
        const verifyPlans = localStorage.getItem('mealPlans');
        
        if (!verifyPlan || !verifyPlans) {
          throw new Error("Verifica del salvataggio fallita");
        }
      } catch (e) {
        console.error('Errore nel salvataggio nel localStorage:', e);
        setError('Problema nel salvataggio del piano. Prova a liberare spazio nel browser.');
        return;
      }
      
      setSnackbarMessage('Piano generato con successo');
      setSnackbarVariant('success');
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Errore:', err);
      setError(err instanceof Error ? err.message : 'Errore nella generazione del piano');
      setSnackbarMessage('Errore nella generazione del piano');
      setSnackbarVariant('error');
      setSnackbarOpen(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyTemplate = (template: any) => {
    try {
      console.log('MealPlanner: Inizio applicazione template', template.name || 'Senza nome');
      
      // Verifica che il template sia un oggetto valido
      if (!template || typeof template !== 'object') {
        console.error('Template non valido:', template);
        throw new Error('Il template fornito non è valido');
      }

      // Standardizziamo le proprietà del template per garantire compatibilità
      // Gestiamo sia dailyCalories che calories_target
      if (template.calories_target && !template.dailyCalories) {
        template.dailyCalories = template.calories_target;
        console.log('Standardizzazione: calories_target -> dailyCalories', template.dailyCalories);
      } else if (!template.dailyCalories && !template.calories_target) {
        // Se mancano entrambi, impostiamo un valore predefinito
        template.dailyCalories = 2000;
        console.log('Impostato valore predefinito per dailyCalories:', template.dailyCalories);
      }

      // Verifichiamo e correggiamo i macros se necessario
      if (!template.macros || typeof template.macros !== 'object') {
        template.macros = { protein: 20, carbs: 50, fat: 30 };
        console.log('Impostati macros predefiniti:', template.macros);
      }

      // Assicuriamoci che i pasti siano validi
      if (!template.meals || !Array.isArray(template.meals) || template.meals.length === 0) {
        console.log('Creazione pasti predefiniti per il template');
        // Creiamo pasti predefiniti
        template.meals = [
          {
            name: 'Colazione',
            time: '08:00',
            foods: [
              { name: 'Yogurt greco', amount: '150g', calories: 150 },
              { name: 'Miele', amount: '1 cucchiaino', calories: 30 },
              { name: 'Frutta fresca', amount: '1 porzione', calories: 60 }
            ]
          },
          {
            name: 'Pranzo',
            time: '13:00',
            foods: [
              { name: 'Pasta integrale', amount: '80g', calories: 280 },
              { name: 'Pomodorini', amount: '100g', calories: 20 },
              { name: 'Olio extravergine', amount: '1 cucchiaio', calories: 120 }
            ]
          },
          {
            name: 'Cena',
            time: '20:00',
            foods: [
              { name: 'Pesce azzurro', amount: '150g', calories: 200 },
              { name: 'Verdure grigliate', amount: '200g', calories: 70 },
              { name: 'Pane integrale', amount: '1 fetta', calories: 80 }
            ]
          }
        ];
      } else {
        // Verifichiamo e correggiamo ogni pasto
        template.meals = template.meals.map(meal => {
          // Assicuriamoci che il pasto abbia un nome
          if (!meal.name) {
            meal.name = 'Pasto';
          }
          
          // Assicuriamoci che il pasto abbia un orario
          if (!meal.time) {
            meal.time = '12:00';
          }
          
          // Assicuriamoci che il pasto abbia cibi validi
          if (!meal.foods || !Array.isArray(meal.foods) || meal.foods.length === 0) {
            meal.foods = [
              { name: 'Alimento predefinito', amount: '100g', calories: 100 }
            ];
          } else {
            // Verifichiamo e correggiamo ogni cibo
            meal.foods = meal.foods.map(food => {
              return {
                name: food.name || 'Alimento sconosciuto',
                amount: food.amount || food.quantity || '100g',
                calories: food.calories || 100
              };
            });
          }
          
          return meal;
        });
      }

      // Convertiamo il template nel formato di un piano pasto
      const today = new Date();

      // Verifichiamo che template.meals esista e sia un array
      if (!template.meals || !Array.isArray(template.meals)) {
        console.error('Template senza pasti validi:', template);
        template.meals = [];
      }

      // Calculate total calories from foods for verification
      let totalCaloriesFromFoods = 0;
      
      // Verifichiamo che template.meals esista e sia un array
      if (template.meals && Array.isArray(template.meals)) {
        totalCaloriesFromFoods = template.meals.reduce((total, meal) => {
          // Verifichiamo che meal.foods esista e sia un array
          const mealFoods = meal.foods && Array.isArray(meal.foods) ? meal.foods : [];
          return total + mealFoods.reduce((sum, food) => {
            // Verifichiamo che food.calories sia un numero
            const calories = typeof food.calories === 'number' ? food.calories : 0;
            return sum + calories;
          }, 0);
        }, 0);
      }
      
      console.log('Template daily calories:', template.dailyCalories);
      console.log('Calculated calories from foods:', totalCaloriesFromFoods);
      
      // Verify we have valid calorie data
      if ((template.dailyCalories <= 0 || isNaN(template.dailyCalories)) && totalCaloriesFromFoods <= 0) {
        console.error('Dati calorici mancanti:', { templateCalories: template.dailyCalories, calculatedCalories: totalCaloriesFromFoods });
        // Invece di lanciare un errore, impostiamo un valore predefinito
        const defaultCalories = 2000; // Valore calorico predefinito
        console.log(`Utilizzo valore calorico predefinito: ${defaultCalories} kcal`);
        template.dailyCalories = defaultCalories;
      }
      
      // Use the most reliable source of calories
      const effectiveDailyCalories = (template.dailyCalories > 0 && !isNaN(template.dailyCalories)) ? 
        template.dailyCalories : totalCaloriesFromFoods;

      // Assicuriamoci che template.macros esista, altrimenti usa valori predefiniti
      const templateMacros = template.macros || { protein: 25, carbs: 50, fat: 25 };

      // Create meals with proper calorie and macro distribution
      const dayPlan: DayPlan = {
        date: today.toISOString().split('T')[0] + "T00:00:00.000Z", // Formato coerente per la data
        meals: template.meals.map(meal => {
          // Calculate actual calories for this meal from its foods
          const mealFoods = meal.foods && Array.isArray(meal.foods) ? meal.foods : [];
          const mealCalories = mealFoods.reduce((sum, food) => sum + (food.calories || 0), 0);
          
          // Calculate the proportion this meal represents of the total calories
          const mealProportion = totalCaloriesFromFoods > 0 ? 
            mealCalories / totalCaloriesFromFoods : 
            1 / template.meals.length;
          
          console.log(`Meal ${meal.name}: Proportion ${mealProportion.toFixed(2)}, Calories ${mealCalories}`);
          
          // Calculate actual macros based on the template percentages
          const proteinGrams = (effectiveDailyCalories * (templateMacros.protein / 100) / 4) * mealProportion;
          const carbsGrams = (effectiveDailyCalories * (templateMacros.carbs / 100) / 4) * mealProportion;
          const fatGrams = (effectiveDailyCalories * (templateMacros.fat / 100) / 9) * mealProportion;
          
          console.log(`Meal ${meal.name} macros: P=${proteinGrams.toFixed(1)}g, C=${carbsGrams.toFixed(1)}g, F=${fatGrams.toFixed(1)}g`);
          
          // Verify calculated macros against provided calories
          const calculatedCalories = (proteinGrams * 4) + (carbsGrams * 4) + (fatGrams * 9);
          console.log(`Meal calories from macros: ${calculatedCalories.toFixed(1)} vs direct ${mealCalories}`);
          
          // Choose the most reliable calorie value
          const finalCalories = mealCalories > 0 ? mealCalories : Math.round(calculatedCalories);
          
          // Costruisci il campo "foods" per compatibilità con i piani AI
          const foodsForDashboard = mealFoods.map(food => ({
            name: food.name,
            quantity: food.amount,
            calories: food.calories,
            protein: (food.calories / mealCalories) * proteinGrams,
            carbs: (food.calories / mealCalories) * carbsGrams,
            fat: (food.calories / mealCalories) * fatGrams
          }));
          
          // Distribute macros according to meal proportion
          return {
            name: meal.name,
            time: "12:00", // Orario predefinito
            calories: finalCalories, // Use actual calculated calories
            macros: {
              protein: Math.round(proteinGrams * 10) / 10,
              carbs: Math.round(carbsGrams * 10) / 10,
              fat: Math.round(fatGrams * 10) / 10
            },
            // Mantieni sia ingredients che foods per compatibilità
            ingredients: mealFoods.map(food => ({
              name: food.name,
              amount: food.amount,
              unit: "g" // Unità predefinita
            })),
            foods: foodsForDashboard, // Aggiungi il campo foods per compatibilità con Dashboard
            instructions: ["Segui le istruzioni sulla confezione"] // Istruzioni predefinite
          };
        })
      };
      
      // Crea un nuovo piano basato sul template
      const newPlan: MealPlan = {
        id: Date.now(), // Timestamp come ID univoco
        name: `${template.name} - ${today.toLocaleDateString()}`,
        goal: "general_health", // Valore predefinito
        calories_target: effectiveDailyCalories,
        macros: templateMacros, // Usa templateMacros per mantenere la coerenza
        dietary_restrictions: [],
        days: [dayPlan]
      };

      console.log('Nuovo piano creato da template:', newPlan);

      // Aggiorna lo stato
      setPlans(prevPlans => [...prevPlans, newPlan]);
      setSelectedPlanId(newPlan.id);
      setSelectedPlan(newPlan);

      // Salva nel localStorage
      try {
        localStorage.setItem('selectedPlanId', String(newPlan.id));
        localStorage.setItem('selectedPlan', JSON.stringify(newPlan));
        
        // Aggiorna la lista completa dei piani
        const updatedPlans = [...plans, newPlan];
        localStorage.setItem('mealPlans', JSON.stringify(updatedPlans));

        // Invia un evento personalizzato per notificare la dashboard
        const event = new CustomEvent('planSelected', { 
          detail: { 
            planId: newPlan.id, 
            plan: newPlan 
          } 
        });
        window.dispatchEvent(event);
        console.log('MealPlanner: Evento planSelected inviato con piano completo:', newPlan);

        const verifyPlan = localStorage.getItem('selectedPlan');
        const verifyPlans = localStorage.getItem('mealPlans');
        
        if (!verifyPlan || !verifyPlans) {
          throw new Error("Verifica del salvataggio fallita");
        }
      } catch (e) {
        console.error('Errore nel salvataggio nel localStorage:', e);
        setError('Problema nel salvataggio del piano. Prova a liberare spazio nel browser.');
        return;
      }

      // Mostra notifica di successo
      setSnackbarMessage('Piano basato su template creato e salvato con successo');
      setSnackbarVariant('success');
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Errore nell\'applicazione del template:', err);
      setError(err instanceof Error ? err.message : 'Errore nell\'applicazione del template');
      setSnackbarMessage('Errore nella creazione del piano');
      setSnackbarVariant('error');
      setSnackbarOpen(true);
    }
  };

  const handleModeChange = (event: React.SyntheticEvent, newMode: 'ai' | 'template' | 'manual') => {
    setMode(newMode);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleApplyPlan = () => {
    if (selectedPlan) {
      console.log('Piano selezionato prima del salvataggio:', selectedPlan);
      // Assicuriamoci che il piano abbia tutti i dati necessari
      const planToSave = {
        ...selectedPlan,
        days: selectedPlan.days.map((day: any) => ({
          ...day,
          meals: day.meals.map((meal: any) => ({
            ...meal,
            // Verifica se meal.foods esiste prima di usare map
            foods: meal.foods ? meal.foods.map((food: any) => ({
              ...food,
              nutrients: food.nutrients || {
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0
              }
            })) : [],  // Se foods non esiste, usa un array vuoto
            // Assicuriamoci che ingredients esista
            ingredients: meal.ingredients || []
          }))
        }))
      };
      console.log('Piano preparato per il salvataggio:', planToSave);
      localStorage.setItem('selectedPlan', JSON.stringify(planToSave));
      localStorage.setItem('selectedPlanId', String(planToSave.id));
      navigate('/'); 
    }
  };

  const handleViewDashboard = () => {
    if (selectedPlanId && selectedPlan) {
      console.log('Piano da salvare:', selectedPlan);
      localStorage.setItem('selectedPlanId', String(selectedPlanId));
      localStorage.setItem('selectedPlan', JSON.stringify(selectedPlan));
      navigate('/');
    }
  };

  const handleDeletePlan = async (planId: number) => {
    // Prima rimuovi il piano dalla lista locale
    const updatedPlans = plans.filter(plan => plan.id !== planId);
    setPlans(updatedPlans);
    
    // Aggiorna il localStorage
    localStorage.setItem('mealPlans', JSON.stringify(updatedPlans));

    // Poi tenta di rimuoverlo dal backend (se disponibile)
    try {
      if (planId) {
        // Tenta direttamente l'eliminazione senza verificare prima l'esistenza
        // Questo evita una chiamata API aggiuntiva e potenziali errori 500
        const response = await fetch(`${API_BASE_URL}/meal-plans/${planId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          console.log('Piano rimosso con successo dal backend.');
        } else {
          // Se il backend restituisce un errore, lo gestiamo senza interrompere il flusso
          console.log(`Piano rimosso localmente. Stato backend: ${response.status}`);
        }
      }
    } catch (error) {
      // Cattura qualsiasi errore di rete o altro
      console.log('Errore durante la comunicazione con il backend, piano rimosso solo localmente:', error);
    }
    
    setSnackbarMessage('Piano eliminato con successo');
    setSnackbarVariant('success');
    setSnackbarOpen(true);
  };

  const handleRenamePlan = () => {
    if (selectedPlan && editedPlanName.trim()) {
      console.log(`Rinomino piano da "${selectedPlan.name}" a "${editedPlanName}"`);
      
      // Aggiorna il piano selezionato
      const updatedPlan = {
        ...selectedPlan,
        name: editedPlanName.trim()
      };
      
      // Aggiorna lo stato locale
      setSelectedPlan(updatedPlan);
      
      // Aggiorna l'elenco dei piani
      const updatedPlans = plans.map(plan => 
        plan.id === selectedPlan.id ? updatedPlan : plan
      );
      
      setPlans(updatedPlans);
      
      // Aggiorna localStorage
      localStorage.setItem('selectedPlan', JSON.stringify(updatedPlan));
      localStorage.setItem('mealPlans', JSON.stringify(updatedPlans));

      // Notify dashboard
      const event = new CustomEvent('planUpdated', { 
        detail: { 
          planId: selectedPlan.id, 
          plan: updatedPlan 
        } 
      });
      window.dispatchEvent(event);
      
      // Chiudi il dialog
      setIsEditingPlanName(false);
      
      // Mostra conferma
      setSnackbarMessage('Piano rinominato con successo');
      setSnackbarVariant('success');
      setSnackbarOpen(true);
    } else {
      setError('Il nome non può essere vuoto');
    }
  };

  const startEditingPlanName = () => {
    if (selectedPlan) {
      setEditedPlanName(selectedPlan.name);
      setIsEditingPlanName(true);
    }
  };

  const cancelEditingPlanName = () => {
    setIsEditingPlanName(false);
    setEditedPlanName('');
  };

  // Hook per rilevare dispositivi mobili
  const theme = useTheme<Theme>();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ py: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ 
          fontWeight: 'bold', 
          color: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          mb: 3
        }}>
          <LocalDiningIcon sx={{ mr: 1, fontSize: 36 }} />
          Pianificazione Pasti
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                borderRadius: 2,
                background: 'linear-gradient(to right, #f5f7fa, #ffffff)'
              }}
            >
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  color: 'text.primary'
                }}
              >
                <FastfoodIcon sx={{ mr: 1 }} />
                Piani Salvati
              </Typography>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : plans.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                  {plans.map((plan) => (
                    <Card 
                      key={`plan-${plan.id}`} 
                      sx={{ 
                        position: 'relative',
                        width: 200,
                        transition: 'all 0.3s',
                        transform: selectedPlanId === plan.id ? 'scale(1.05)' : 'scale(1)',
                        boxShadow: selectedPlanId === plan.id ? 6 : 1,
                        border: selectedPlanId === plan.id ? '2px solid' : 'none',
                        borderColor: 'primary.main',
                        '&:hover': {
                          boxShadow: 4,
                          transform: 'translateY(-5px)'
                        }
                      }}
                      onClick={() => handlePlanSelect(plan)}
                    >
                      <CardMedia
                        component="div"
                        sx={{
                          height: 60,
                          backgroundColor: plan.goal === 'weight_loss' ? '#4caf50' :
                                          plan.goal === 'muscle_gain' ? '#2196f3' :
                                          plan.goal === 'maintenance' ? '#ff9800' :
                                          '#9c27b0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white'
                        }}
                      >
                        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                          {plan.goal === 'weight_loss' ? 'Perdita di Peso' :
                           plan.goal === 'muscle_gain' ? 'Aumento Massa' :
                           plan.goal === 'maintenance' ? 'Mantenimento' :
                           'Salute Generale'}
                        </Typography>
                      </CardMedia>
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                          {plan.name || `Piano #${plan.id}`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {plan.calories_target} kcal/giorno
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
                          <Chip 
                            label={`P: ${plan.macros?.protein || 0}%`} 
                            size="small" 
                            sx={{ bgcolor: '#e3f2fd', fontSize: '0.7rem' }}
                          />
                          <Chip 
                            label={`C: ${plan.macros?.carbs || 0}%`} 
                            size="small" 
                            sx={{ bgcolor: '#e8f5e9', fontSize: '0.7rem' }}
                          />
                          <Chip 
                            label={`G: ${plan.macros?.fat || 0}%`} 
                            size="small" 
                            sx={{ bgcolor: '#fff3e0', fontSize: '0.7rem' }}
                          />
                        </Box>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'flex-end', p: 1 }}>
                        <Tooltip title="Elimina piano">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePlan(plan.id);
                            }}
                            sx={{
                              color: 'error.main',
                              '&:hover': {
                                bgcolor: 'error.light',
                                color: 'white',
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </CardActions>
                    </Card>
                  ))}
                </Box>
              ) : (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Nessun piano salvato. Crea un nuovo piano o utilizza un template.
                </Alert>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                borderRadius: 2,
                background: 'linear-gradient(to right, #f5f7fa, #ffffff)'
              }}
            >
              <Tabs
                value={mode}
                onChange={handleModeChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                sx={{ 
                  mb: 3,
                  '& .MuiTab-root': {
                    fontWeight: 'bold',
                    borderRadius: '4px 4px 0 0',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    padding: { xs: '6px 8px', sm: '12px 16px' },
                    minHeight: { xs: '48px', sm: '48px' },
                  },
                  '& .Mui-selected': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)'
                  },
                  '& .MuiTab-iconWrapper': {
                    marginRight: { xs: '4px', sm: '8px' },
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }
                }}
              >
                <Tab 
                  key="ai-tab" 
                  value="ai" 
                  label={isMobile ? "Crea con AI" : "Generazione AI"} 
                  icon={<AddIcon />} 
                  iconPosition="start"
                />
                <Tab 
                  key="template-tab" 
                  value="template" 
                  label={isMobile ? "Template" : "Utilizza Template"} 
                  icon={<FitnessCenterIcon />} 
                  iconPosition="start"
                />
                <Tab 
                  key="manual-tab" 
                  value="manual" 
                  label={isMobile ? "Manuale" : "Creazione Manuale"} 
                  icon={<EditIcon />} 
                  iconPosition="start"
                />
              </Tabs>

              <Box sx={{ mt: 3 }}>
                {mode === 'ai' ? (
                  <Box>
                    <Typography 
                      variant="h6" 
                      gutterBottom 
                      sx={{ 
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        color: 'text.primary',
                        mb: 3
                      }}
                    >
                      <AddIcon sx={{ mr: 1 }} />
                      Genera Nuovo Piano con AI
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel id="goal-label">Obiettivo</InputLabel>
                          <Select
                            labelId="goal-label"
                            value={goal}
                            onChange={(e: SelectChangeEvent<string>) => setGoal(e.target.value)}
                            label="Obiettivo"
                          >
                            {VALID_GOALS.map((g) => (
                              <MenuItem key={g.value} value={g.value}>
                                {g.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth variant="outlined">
                          <TextField
                            label="Target Calorico Giornaliero"
                            type="number"
                            value={caloriesTarget}
                            onChange={(e) => setCaloriesTarget(parseInt(e.target.value))}
                            InputProps={{ inputProps: { min: 500, max: 5000 } }}
                            variant="outlined"
                          />
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                          Distribuzione Macronutrienti
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <FormControl fullWidth variant="outlined">
                          <TextField
                            label="% Proteine"
                            type="number"
                            value={macros.protein}
                            onChange={(e) => setMacros({...macros, protein: parseInt(e.target.value)})}
                            InputProps={{ inputProps: { min: 0, max: 100 } }}
                            variant="outlined"
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <FormControl fullWidth variant="outlined">
                          <TextField
                            label="% Carboidrati"
                            type="number"
                            value={macros.carbs}
                            onChange={(e) => setMacros({...macros, carbs: parseInt(e.target.value)})}
                            InputProps={{ inputProps: { min: 0, max: 100 } }}
                            variant="outlined"
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <FormControl fullWidth variant="outlined">
                          <TextField
                            label="% Grassi"
                            type="number"
                            value={macros.fat}
                            onChange={(e) => setMacros({...macros, fat: parseInt(e.target.value)})}
                            InputProps={{ inputProps: { min: 0, max: 100 } }}
                            variant="outlined"
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl fullWidth variant="outlined">
                          <TextField
                            label="Restrizioni Dietetiche (separate da virgola)"
                            value={dietaryRestrictions}
                            onChange={(e) => setDietaryRestrictions(e.target.value)}
                            placeholder="Es: glutine, lattosio, vegano"
                            helperText="Inserisci eventuali restrizioni dietetiche separate da virgola"
                            variant="outlined"
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          onClick={generateMealPlan}
                          disabled={isGenerating}
                          startIcon={isGenerating ? <CircularProgress size={24} color="inherit" /> : <Restaurant />}
                          size="large"
                          sx={{ 
                            py: 1.5, 
                            mt: 1,
                            fontWeight: 'bold',
                            boxShadow: 3,
                            '&:hover': {
                              boxShadow: 6,
                              transform: 'translateY(-2px)'
                            },
                            transition: 'all 0.3s'
                          }}
                        >
                          {isGenerating ? 'Generazione in corso...' : 'Genera Piano Alimentare'}
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                ) : mode === 'template' ? (
                  <TemplateBasedPlanner 
                    onApplyTemplate={(plan) => Promise.resolve(handleApplyTemplate(plan))} 
                  />
                ) : (
                  <ManualMealPlanner onCreatePlan={handleApplyTemplate} />
                )}
              </Box>
            </Paper>
          </Grid>

          {selectedPlan ? (
            <Grid item xs={12}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  background: 'linear-gradient(to right, #f5f7fa, #ffffff)'
                }}
              >
                <Box sx={{ mb: 3 }}>
                  {isEditingPlanName ? (
                    <Box sx={{ mb: 2 }}>
                      <TextField
                        label="Nuovo Nome Piano"
                        value={editedPlanName}
                        onChange={(e) => setEditedPlanName(e.target.value)}
                        fullWidth
                        variant="outlined"
                        autoFocus
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleRenamePlan}
                          sx={{ mr: 1 }}
                          startIcon={<SaveIcon />}
                        >
                          Salva
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={cancelEditingPlanName}
                          startIcon={<CancelIcon />}
                        >
                          Annulla
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      mb: 2,
                      pb: 2,
                      borderBottom: '1px solid',
                      borderColor: 'divider'
                    }}>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          fontWeight: 'bold',
                          color: 'primary.main' 
                        }}
                      >
                        {selectedPlan.name}
                      </Typography>
                      <Box>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={startEditingPlanName}
                          size="small"
                          startIcon={<EditIcon />}
                          sx={{ mr: 1 }}
                        >
                          Rinomina
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleViewDashboard}
                          size="small"
                          startIcon={<DashboardIcon />}
                        >
                          Dashboard
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>

                <Box sx={{ 
                  mb: 3, 
                  p: 2, 
                  bgcolor: 'background.paper', 
                  borderRadius: 1,
                  boxShadow: 1
                }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        p: 1,
                        borderRadius: 1,
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText'
                      }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          Obiettivo: {selectedPlan.goal === 'weight_loss' ? 'Perdita di Peso' :
                                     selectedPlan.goal === 'muscle_gain' ? 'Aumento Massa' :
                                     selectedPlan.goal === 'maintenance' ? 'Mantenimento' :
                                     'Salute Generale'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        p: 1,
                        borderRadius: 1,
                        bgcolor: 'success.light',
                        color: 'success.contrastText'
                      }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          Calorie: {selectedPlan.calories_target || 0} kcal
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        p: 1,
                        borderRadius: 1,
                        bgcolor: 'info.light',
                        color: 'info.contrastText'
                      }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          Macros: P:{selectedPlan.macros?.protein || 0}% C:{selectedPlan.macros?.carbs || 0}% G:{selectedPlan.macros?.fat || 0}%
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'text.primary',
                    mb: 2
                  }}
                >
                  <FastfoodIcon sx={{ mr: 1 }} />
                  Calendario Pasti
                </Typography>
                <Box sx={{ maxHeight: 500, overflow: 'auto', pr: 1 }}>
                  {selectedPlan.days?.map((day, dayIndex) => (
                    <Card 
                      key={`day-${dayIndex}-${day.date}`} 
                      sx={{ 
                        mb: 3, 
                        bgcolor: 'background.paper',
                        boxShadow: 2,
                        borderRadius: 2,
                        overflow: 'hidden'
                      }}
                    >
                      <CardHeader
                        title={`Giorno ${dayIndex + 1} - ${day.date}`}
                        sx={{ 
                          bgcolor: 'primary.main', 
                          color: 'white',
                          py: 1
                        }}
                      />
                      <CardContent>
                        {day.meals?.map((meal, mealIndex) => (
                          <Box 
                            key={`meal-${dayIndex}-${mealIndex}`} 
                            sx={{ 
                              mb: 2,
                              p: 2,
                              borderRadius: 1,
                              bgcolor: 'background.default',
                              boxShadow: 1
                            }}
                          >
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              mb: 1,
                              pb: 1,
                              borderBottom: '1px solid',
                              borderColor: 'divider'
                            }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                {meal.name} - {meal.time}
                              </Typography>
                              <Chip 
                                label={`${meal.calories} kcal`} 
                                color="primary" 
                                size="small" 
                                variant="outlined"
                              />
                            </Box>
                            
                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                              <Chip 
                                label={`P: ${meal.macros?.protein || 0}g`} 
                                size="small" 
                                sx={{ bgcolor: '#e3f2fd' }}
                              />
                              <Chip 
                                label={`C: ${meal.macros?.carbs || 0}g`} 
                                size="small" 
                                sx={{ bgcolor: '#e8f5e9' }}
                              />
                              <Chip 
                                label={`G: ${meal.macros?.fat || 0}g`} 
                                size="small" 
                                sx={{ bgcolor: '#fff3e0' }}
                              />
                            </Box>
                            
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 1 }}>
                              Ingredienti:
                            </Typography>
                            <List dense sx={{ bgcolor: 'background.paper', borderRadius: 1, mt: 0.5 }}>
                              {meal.ingredients?.map((ingredient, i) => (
                                <ListItem key={`ingredient-${i}`} sx={{ py: 0.5 }}>
                                  <ListItemText 
                                    primary={`${ingredient.name} - ${ingredient.amount} ${ingredient.unit}`} 
                                    primaryTypographyProps={{ variant: 'body2' }}
                                  />
                                </ListItem>
                              ))}
                            </List>
                            
                            {meal.instructions && meal.instructions.length > 0 && (
                              <>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 2 }}>
                                  Istruzioni:
                                </Typography>
                                <List dense sx={{ bgcolor: 'background.paper', borderRadius: 1, mt: 0.5 }}>
                                  {meal.instructions.map((instruction, i) => (
                                    <ListItem key={`instruction-${i}`} sx={{ py: 0.5 }}>
                                      <ListItemText 
                                        primary={instruction} 
                                        primaryTypographyProps={{ variant: 'body2' }}
                                      />
                                    </ListItem>
                                  ))}
                                </List>
                              </>
                            )}
                          </Box>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </Box>
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleApplyPlan}
                    size="large"
                    startIcon={<DashboardIcon />}
                    sx={{ 
                      py: 1.5, 
                      px: 4,
                      fontWeight: 'bold',
                      boxShadow: 3,
                      '&:hover': {
                        boxShadow: 6,
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s'
                    }}
                  >
                    Applica Piano e Vai alla Dashboard
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ) : null}
        </Grid>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarVariant === 'success' ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MealPlanner;
