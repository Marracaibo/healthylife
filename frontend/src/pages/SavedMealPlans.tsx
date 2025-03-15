import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  LocalDining as LocalDiningIcon
} from '@mui/icons-material';

interface MealPlan {
  id?: number;
  name: string;
  description?: string;
  goal: string;
  calories_target: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  days: {
    meals: {
      name: string;
      time: string;
      foods: {
        name: string;
        quantity: number;
        unit: string;
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
      }[];
    }[];
  }[];
}

const SavedMealPlans: React.FC = () => {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<MealPlan | null>(null);

  const loadSavedPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      // Prova a caricare i piani dal localStorage se il backend non è disponibile
      const localPlans = localStorage.getItem('mealPlans');
      if (localPlans) {
        setMealPlans(JSON.parse(localPlans));
        setLoading(false);
        return;
      }

      // Altrimenti prova a caricare dal backend
      const response = await fetch('http://localhost:8000/api/meal-plans');
      if (!response.ok) {
        throw new Error(`Errore nel caricamento dei piani: ${response.statusText}`);
      }
      const data = await response.json();
      const plans = Array.isArray(data) ? data : [];
      
      // Salva anche in localStorage come backup
      localStorage.setItem('mealPlans', JSON.stringify(plans));
      
      setMealPlans(plans);
    } catch (error) {
      console.error('Errore nel caricamento dei piani alimentari:', error);
      setError('Non è stato possibile caricare i piani alimentari. Verifica la connessione al server.');
      
      // Prova a caricare dal localStorage come fallback
      const localPlans = localStorage.getItem('mealPlans');
      if (localPlans) {
        setMealPlans(JSON.parse(localPlans));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async (id: number | undefined) => {
    if (!id) return;
    
    try {
      // Prova a eliminare dal backend
      const response = await fetch(`http://localhost:8000/api/meal-plans/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Errore nell'eliminazione del piano: ${response.statusText}`);
      }
      
      // Aggiorna lo stato locale
      const updatedPlans = mealPlans.filter(plan => plan.id !== id);
      setMealPlans(updatedPlans);
      
      // Aggiorna anche il localStorage
      localStorage.setItem('mealPlans', JSON.stringify(updatedPlans));
    } catch (error) {
      console.error('Errore nell\'eliminazione del piano alimentare:', error);
      
      // Fallback: aggiorna solo localmente
      const updatedPlans = mealPlans.filter(plan => plan.id !== id);
      setMealPlans(updatedPlans);
      localStorage.setItem('mealPlans', JSON.stringify(updatedPlans));
    }
  };

  const handleViewPlan = (plan: MealPlan) => {
    setSelectedPlan(plan);
  };

  const handleCloseDialog = () => {
    setSelectedPlan(null);
  };

  useEffect(() => {
    loadSavedPlans();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (mealPlans.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        Non hai ancora salvato nessun piano alimentare. Crea il tuo primo piano!
      </Alert>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {mealPlans.map((plan, index) => (
          <Grid item xs={12} sm={6} md={4} key={plan.id || index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {plan.name}
                </Typography>
                {plan.description && (
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {plan.description}
                  </Typography>
                )}
                <Box sx={{ mt: 1, mb: 1 }}>
                  <Chip 
                    icon={<LocalDiningIcon />} 
                    label={`${plan.calories_target} kcal`} 
                    size="small" 
                    color="primary" 
                    sx={{ mr: 1, mb: 1 }} 
                  />
                  <Chip 
                    label={plan.goal} 
                    size="small" 
                    color="secondary" 
                    sx={{ mb: 1 }} 
                  />
                </Box>
                <Typography variant="body2">
                  Macros: {plan.macros?.protein || 0}g P / {plan.macros?.carbs || 0}g C / {plan.macros?.fat || 0}g F
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  startIcon={<VisibilityIcon />}
                  onClick={() => handleViewPlan(plan)}
                >
                  Visualizza
                </Button>
                <Button 
                  size="small" 
                  color="error" 
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeletePlan(plan.id)}
                >
                  Elimina
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog per visualizzare i dettagli del piano */}
      <Dialog
        open={!!selectedPlan}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: '90vh',
            height: 'auto',
            overflowY: 'auto'
          }
        }}
      >
        {selectedPlan && (
          <>
            <DialogTitle>
              {selectedPlan.name}
              <IconButton
                aria-label="close"
                onClick={handleCloseDialog}
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <DeleteIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Obiettivo: {selectedPlan.goal}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Calorie giornaliere: {selectedPlan.calories_target} kcal
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Macronutrienti: {selectedPlan.macros?.protein || 0}g proteine / {selectedPlan.macros?.carbs || 0}g carboidrati / {selectedPlan.macros?.fat || 0}g grassi
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ mb: 2, borderBottom: '1px solid #e0e0e0', pb: 1 }}>
                  Piano Alimentare Completo
                </Typography>
                {selectedPlan.days && selectedPlan.days.length > 0 ? (
                  selectedPlan.days.map((day, dayIndex) => (
                    <Box key={dayIndex} sx={{ mb: 4, pb: 2, borderBottom: dayIndex < selectedPlan.days.length - 1 ? '1px dashed #e0e0e0' : 'none' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, backgroundColor: '#f5f5f5', p: 1, borderRadius: 1 }}>
                        Giorno {dayIndex + 1}
                      </Typography>
                      {day.meals && day.meals.length > 0 ? (
                        day.meals.map((meal, mealIndex) => (
                          <Card key={mealIndex} sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
                            <CardContent>
                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                                {meal.name} - {meal.time}
                              </Typography>
                              <Box sx={{ mt: 2 }}>
                                {Array.isArray(meal.foods) && meal.foods.length > 0 ? (
                                  <>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1, color: '#555' }}>
                                      Alimenti:
                                    </Typography>
                                    {meal.foods.map((food, foodIndex) => {
                                      // Se food è una stringa, mostriamo solo il nome
                                      if (typeof food === 'string') {
                                        return (
                                          <Box key={foodIndex} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, pl: 2 }}>
                                            <Typography variant="body2">{food}</Typography>
                                          </Box>
                                        );
                                      }
                                      
                                      // Altrimenti, assumiamo che sia un oggetto con proprietà
                                      return (
                                        <Box key={foodIndex} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, pl: 2 }}>
                                          <Typography variant="body2">
                                            {food.name} ({food.quantity || 0} {food.unit || 'g'})
                                          </Typography>
                                          <Typography variant="body2">
                                            {food.calories || 0} kcal
                                          </Typography>
                                        </Box>
                                      );
                                    })}
                                  </>
                                ) : (
                                  <Typography variant="body2">Nessun alimento specificato</Typography>
                                )}
                              </Box>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <Typography variant="body2">Nessun pasto specificato per questo giorno</Typography>
                      )}
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2">Nessun piano giornaliero specificato</Typography>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Chiudi</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default SavedMealPlans;
