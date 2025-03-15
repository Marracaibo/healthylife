import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Chip,
  useTheme,
  useMediaQuery,
  CardActionArea,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { mealTemplates, MealTemplate } from '../data/mealTemplates';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';

// Definizione dell'interfaccia MealPlan
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
  dietary_restrictions: string[];
  created_at?: string;
  start_date?: string;
  days: {
    meals: {
      name: string;
      foods: string[];
      time: string;
    }[];
  }[];
  template_name?: string;
  is_monthly_template?: boolean;
}

interface TemplateBasedPlannerProps {
  onSavePlan: (plan: MealPlan) => Promise<void>;
  onCancel: () => void;
}

const TemplateBasedPlanner: React.FC<TemplateBasedPlannerProps> = ({ onSavePlan, onCancel }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<MealTemplate | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSelectTemplate = (template: MealTemplate) => {
    setSelectedTemplate(template);
  };

  const handleApplyTemplate = async () => {
    if (selectedTemplate) {
      const calculatedCalories = calculateTotalCalories(selectedTemplate);
      
      // Creiamo un oggetto che corrisponde alla struttura attesa da MealPlan
      const mealPlan: MealPlan = {
        name: selectedTemplate.name,
        description: selectedTemplate.description,
        goal: 'mantenimento', // Valore predefinito
        calories_target: selectedTemplate.dailyCalories || calculatedCalories,
        macros: {
          protein: selectedTemplate.macros.protein,
          carbs: selectedTemplate.macros.carbs,
          fat: selectedTemplate.macros.fat
        },
        dietary_restrictions: [],
        // Convertiamo i giorni e i pasti nel formato richiesto
        days: [{
          meals: selectedTemplate.meals.map(meal => ({
            name: meal.name,
            time: meal.time || '12:00',
            foods: meal.foods.map(food => `${food.name} - ${food.amount} (${food.calories} kcal)`)
          }))
        }],
        template_name: selectedTemplate.name
      };
      
      await onSavePlan(mealPlan);
    }
  };

  const calculateTotalCalories = (template: MealTemplate) => {
    return template.meals.reduce((total, meal) => {
      const mealCalories = meal.foods.reduce((sum, food) => sum + food.calories, 0);
      return total + mealCalories;
    }, 0);
  };

  return (
    <Box sx={{ py: isMobile ? 2 : 4 }}>
      <Typography variant={isMobile ? "h5" : "h6"} gutterBottom>
        Piani Alimentari Predefiniti
      </Typography>
      {!isMobile && (
        <Typography variant="body1" paragraph>
          Seleziona un piano alimentare predefinito per iniziare rapidamente. Puoi personalizzarlo successivamente.
        </Typography>
      )}

      <Grid container spacing={isMobile ? 2 : 3}>
        {/* Mobile: Visualizzazione a schermo intero quando non c'è nulla selezionato */}
        {isMobile && !selectedTemplate ? (
          <Grid item xs={12}>
            {mealTemplates.map((template) => (
              <Card 
                key={template.id}
                sx={{ 
                  mb: 2, 
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': { boxShadow: 2 }
                }}
                onClick={() => handleSelectTemplate(template)}
              >
                <CardActionArea>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle1" color="primary" gutterBottom>
                      {template.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
                      {template.description}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                      <Typography variant="caption">
                        <strong>Calorie:</strong> {template.dailyCalories} kcal
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <Chip 
                        label={`P: ${template.macros.protein}%`} 
                        size="small" 
                        sx={{ bgcolor: theme.palette.primary.light, color: 'white' }}
                      />
                      <Chip 
                        label={`C: ${template.macros.carbs}%`} 
                        size="small" 
                        sx={{ bgcolor: theme.palette.secondary.light, color: 'white' }}
                      />
                      <Chip 
                        label={`G: ${template.macros.fat}%`} 
                        size="small" 
                        sx={{ bgcolor: theme.palette.warning.light, color: 'white' }}
                      />
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Grid>
        ) : (
          // Desktop o Mobile con template selezionato
          <>
            <Grid item xs={12} md={6} sx={{ display: isMobile && selectedTemplate ? 'none' : 'block' }}>
              <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom>
                Template Disponibili
              </Typography>
              {mealTemplates.map((template) => (
                <Card 
                  key={template.id}
                  sx={{ 
                    mb: 2, 
                    cursor: 'pointer',
                    border: selectedTemplate?.id === template.id ? `2px solid ${theme.palette.primary.main}` : '1px solid',
                    borderColor: selectedTemplate?.id === template.id ? theme.palette.primary.main : 'divider',
                    '&:hover': { boxShadow: 3 }
                  }}
                  onClick={() => handleSelectTemplate(template)}
                >
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      {template.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {template.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">
                        <strong>Calorie:</strong> {template.dailyCalories} kcal
                      </Typography>
                      <Box>
                        <Chip 
                          label={`P: ${template.macros.protein}%`} 
                          size="small" 
                          sx={{ mr: 0.5, bgcolor: theme.palette.primary.light, color: 'white' }}
                        />
                        <Chip 
                          label={`C: ${template.macros.carbs}%`} 
                          size="small" 
                          sx={{ mr: 0.5, bgcolor: theme.palette.secondary.light, color: 'white' }}
                        />
                        <Chip 
                          label={`G: ${template.macros.fat}%`} 
                          size="small" 
                          sx={{ bgcolor: theme.palette.warning.light, color: 'white' }}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Grid>

            <Grid item xs={12} md={6}>
              {selectedTemplate ? (
                <Paper sx={{ p: isMobile ? 2 : 3 }}>
                  {isMobile && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1">
                        Template selezionato
                      </Typography>
                      <Button 
                        size="small" 
                        onClick={() => setSelectedTemplate(null)}
                        sx={{ minWidth: 'auto' }}
                      >
                        Cambia
                      </Button>
                    </Box>
                  )}
                  
                  <Typography variant={isMobile ? "h6" : "h6"} gutterBottom>
                    {selectedTemplate.name}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1">
                      <strong>Calorie giornaliere:</strong> {selectedTemplate.dailyCalories} kcal
                    </Typography>
                    <Typography variant="subtitle1">
                      <strong>Macronutrienti:</strong> Proteine {selectedTemplate.macros.protein}%, 
                      Carboidrati {selectedTemplate.macros.carbs}%, 
                      Grassi {selectedTemplate.macros.fat}%
                    </Typography>
                    <Typography variant="subtitle1">
                      <strong>Calorie totali (pasti):</strong> {calculateTotalCalories(selectedTemplate)} kcal
                    </Typography>
                  </Box>
                  
                  <Typography variant="h6" gutterBottom>
                    Pasti
                  </Typography>
                  
                  {isMobile ? (
                    // Mobile view: use accordions for meals
                    <Box sx={{ mb: 2 }}>
                      {selectedTemplate.meals.map((meal, index) => (
                        <Accordion key={index} disableGutters sx={{ 
                          mb: 1, 
                          '&:before': { display: 'none' }, 
                          boxShadow: 'none',
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography color="primary" fontWeight="medium">
                              {meal.name} - {meal.foods.reduce((sum, food) => sum + food.calories, 0)} kcal
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails sx={{ pt: 0 }}>
                            <Box>
                              {meal.foods.map((food, foodIndex) => (
                                <Box key={foodIndex} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                                  <Typography variant="body2">
                                    • {food.name} ({food.amount})
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {food.calories} kcal
                                  </Typography>
                                </Box>
                              ))}
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </Box>
                  ) : (
                    // Desktop view: use List
                    <List>
                      {selectedTemplate.meals.map((meal, index) => (
                        <React.Fragment key={index}>
                          <ListItem alignItems="flex-start" sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                            <ListItemText 
                              primary={meal.name} 
                              secondary={`Calorie totali: ${meal.foods.reduce((sum, food) => sum + food.calories, 0)} kcal`}
                              primaryTypographyProps={{ color: 'primary', fontWeight: 'bold' }}
                            />
                            <Box sx={{ pl: 2, width: '100%' }}>
                              {meal.foods.map((food, foodIndex) => (
                                <Box key={foodIndex} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                                  <Typography variant="body2">
                                    • {food.name} ({food.amount})
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {food.calories} kcal
                                  </Typography>
                                </Box>
                              ))}
                            </Box>
                          </ListItem>
                          {index < selectedTemplate.meals.length - 1 && <Divider component="li" />}
                        </React.Fragment>
                      ))}
                    </List>
                  )}
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      onClick={onCancel}
                      startIcon={<CloseIcon />}
                    >
                      Annulla
                    </Button>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={handleApplyTemplate}
                    >
                      Applica Template
                    </Button>
                  </Box>
                </Paper>
              ) : (
                <Paper sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
                  <Typography variant="body1" color="text.secondary">
                    Seleziona un template per vedere i dettagli
                  </Typography>
                </Paper>
              )}
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default TemplateBasedPlanner;
