import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  useTheme,
  useMediaQuery,
  CardActionArea,
  Stack,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab
} from '@mui/material';
import { monthlyMealTemplates, MonthlyMealTemplate } from '../data/monthlyMealTemplates';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';

// Definizione dell'interfaccia MealPlan (copiata da MealPlanner.tsx)
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

interface MonthlyTemplateBasedPlannerProps {
  onSavePlan: (plan: MealPlan) => Promise<void>;
  onCancel: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`template-tabpanel-${index}`}
      aria-labelledby={`template-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `template-tab-${index}`,
    'aria-controls': `template-tabpanel-${index}`,
  };
}

const MonthlyTemplateBasedPlanner: React.FC<MonthlyTemplateBasedPlannerProps> = ({ onSavePlan, onCancel }) => {
  const theme = useTheme();
  // Utilizziamo isMobile per il layout responsive
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedTemplate, setSelectedTemplate] = useState<MonthlyMealTemplate | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [dayIndex, setDayIndex] = useState(0);

  // Debug: verifichiamo che i template mensili siano caricati correttamente
  useEffect(() => {
    console.log('Template mensili disponibili:', monthlyMealTemplates);
    // Verifichiamo che ci siano template mensili disponibili
    if (monthlyMealTemplates.length === 0) {
      console.error('Nessun template mensile disponibile!');
    }
  }, []);

  const handleTemplateClick = (template: MonthlyMealTemplate) => {
    setSelectedTemplate(template);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleApplyTemplate = async () => {
    if (selectedTemplate) {
      // Convertiamo il template mensile in un formato compatibile con MealPlan
      const mealPlanFromTemplate: MealPlan = {
        id: undefined, // Lasciamo che il backend assegni un ID
        name: selectedTemplate.name,
        description: selectedTemplate.description,
        goal: selectedTemplate.goal || 'mantenimento',
        calories_target: selectedTemplate.dailyCalories,
        macros: {
          protein: selectedTemplate.macros.protein,
          carbs: selectedTemplate.macros.carbs,
          fat: selectedTemplate.macros.fat
        },
        dietary_restrictions: selectedTemplate.dietaryRestrictions || [],
        // Convertiamo i giorni e i pasti nel formato richiesto
        days: selectedTemplate.days.map(day => ({
          meals: day.meals.map(meal => ({
            name: meal.name,
            time: meal.time,
            foods: meal.foods.map(food => `${food.name} - ${food.quantity}${food.unit} (${food.calories} kcal)`)
          }))
        })),
        template_name: selectedTemplate.name,
        is_monthly_template: true // Aggiungiamo un flag per identificare i template mensili
      };
      
      await onSavePlan(mealPlanFromTemplate);
      setOpenDialog(false);
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDayChange = (_: React.SyntheticEvent, newValue: number) => {
    setDayIndex(newValue);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Piani Alimentari Mensili
      </Typography>
      <Typography variant="body1" paragraph>
        Seleziona un piano alimentare mensile per iniziare rapidamente. Puoi personalizzarlo successivamente.
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Template Disponibili
        </Typography>
        <Grid container spacing={isMobile ? 2 : 3}>
          {monthlyMealTemplates.map((template) => (
            <Grid item xs={12} sm={isMobile ? 12 : 6} key={template.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: 4
                  }
                }}
              >
                <CardActionArea onClick={() => handleTemplateClick(template)}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div" gutterBottom>
                      {template.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {template.description}
                    </Typography>
                    <Typography variant="body2">
                      Calorie: {template.dailyCalories} kcal
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                      <Chip 
                        label={`P: ${template.macros.protein}%`} 
                        size="small" 
                        sx={{ bgcolor: '#4caf50', color: 'white' }}
                      />
                      <Chip 
                        label={`C: ${template.macros.carbs}%`} 
                        size="small" 
                        sx={{ bgcolor: '#ff9800', color: 'white' }}
                      />
                      <Chip 
                        label={`G: ${template.macros.fat}%`} 
                        size="small" 
                        sx={{ bgcolor: '#f44336', color: 'white' }}
                      />
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={onCancel}
          startIcon={<CloseIcon />}
        >
          Annulla
        </Button>
        {selectedTemplate && (
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleApplyTemplate}
          >
            Applica Template
          </Button>
        )}
      </Box>

      {/* Dialog per visualizzare i dettagli del template */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: isMobile ? '95vh' : '90vh',
            overflowY: 'auto'
          }
        }}
      >
        {selectedTemplate && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">{selectedTemplate.name}</Typography>
              <IconButton edge="end" color="inherit" onClick={handleCloseDialog} aria-label="close">
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={tabValue} onChange={handleTabChange} aria-label="template tabs">
                    <Tab label="Panoramica" {...a11yProps(0)} />
                    <Tab label="Piano Giornaliero" {...a11yProps(1)} />
                    <Tab label="Variazioni" {...a11yProps(2)} />
                    <Tab label="Linee Guida" {...a11yProps(3)} />
                  </Tabs>
                </Box>
                
                {/* Tab Panoramica */}
                <TabPanel value={tabValue} index={0}>
                  <Typography variant="h6" gutterBottom>
                    Obiettivo: Dimagrimento
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    Calorie giornaliere: {selectedTemplate.dailyCalories} kcal
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    Macronutrienti: {selectedTemplate.macros.protein}% proteine / {selectedTemplate.macros.carbs}% carboidrati / {selectedTemplate.macros.fat}% grassi
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    Giorni disponibili: {selectedTemplate.days.length}
                  </Typography>
                  
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Caratteristiche del piano
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText 
                          primary="Piano mensile completo" 
                          secondary="Questo piano include variazioni per un mese intero, permettendo una dieta varia ed equilibrata."
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Pasti bilanciati" 
                          secondary="Ogni giorno include colazione, pranzo, cena e spuntini per mantenere stabile la glicemia."
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Personalizzabile" 
                          secondary="Puoi modificare qualsiasi pasto o alimento in base alle tue preferenze personali."
                        />
                      </ListItem>
                    </List>
                  </Box>
                </TabPanel>
                
                {/* Tab Piano Giornaliero */}
                <TabPanel value={tabValue} index={1}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                    <Tabs 
                      value={dayIndex} 
                      onChange={handleDayChange} 
                      variant="scrollable"
                      scrollButtons="auto"
                      aria-label="day tabs"
                    >
                      {selectedTemplate.days.map((_, index) => (
                        <Tab key={index} label={`Giorno ${index + 1}`} {...a11yProps(index)} />
                      ))}
                    </Tabs>
                  </Box>
                  
                  {selectedTemplate.days.map((day, index) => (
                    <Box key={index} hidden={dayIndex !== index}>
                      {dayIndex === index && (
                        <Box>
                          <Typography variant="h6" sx={{ mb: 2, borderBottom: '1px solid #e0e0e0', pb: 1 }}>
                            Piano Alimentare - Giorno {index + 1}
                          </Typography>
                          
                          {day.meals.map((meal, mealIndex) => (
                            <Card key={mealIndex} sx={{ mb: 3, border: '1px solid #e0e0e0' }}>
                              <CardContent>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                                  {meal.name} - {meal.time}
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1, color: '#555' }}>
                                    Alimenti:
                                  </Typography>
                                  {meal.foods.map((food, foodIndex) => (
                                    <Box key={foodIndex} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, pl: 2 }}>
                                      <Typography variant="body2">
                                        {food.name} ({food.quantity} {food.unit})
                                      </Typography>
                                      <Typography variant="body2">
                                        {food.calories} kcal
                                      </Typography>
                                    </Box>
                                  ))}
                                </Box>
                              </CardContent>
                            </Card>
                          ))}
                        </Box>
                      )}
                    </Box>
                  ))}
                </TabPanel>
                
                {/* Tab Variazioni */}
                <TabPanel value={tabValue} index={2}>
                  <Typography variant="body1" paragraph>
                    Queste sono le possibili variazioni che puoi applicare al tuo piano alimentare per renderlo più vario.
                  </Typography>
                  
                  {selectedTemplate.variations.map((variation, index) => (
                    <Accordion key={index} sx={{ mb: 2 }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle1">{variation.category}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <List dense>
                          {variation.options.map((option, optIndex) => (
                            <ListItem key={optIndex} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2">
                                {option.name} ({option.quantity})
                              </Typography>
                              <Typography variant="body2">
                                {option.calories} kcal
                              </Typography>
                            </ListItem>
                          ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </TabPanel>
                
                {/* Tab Linee Guida */}
                <TabPanel value={tabValue} index={3}>
                  {selectedTemplate.guidelines.map((guideline, index) => (
                    <Box key={index} sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {guideline.title}
                      </Typography>
                      <Typography variant="body2" component="pre" sx={{ 
                        whiteSpace: 'pre-wrap',
                        backgroundColor: '#f5f5f5',
                        p: 2,
                        borderRadius: 1,
                        fontFamily: 'inherit'
                      }}>
                        {guideline.content}
                      </Typography>
                    </Box>
                  ))}
                </TabPanel>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Annulla</Button>
              <Button 
                onClick={handleApplyTemplate} 
                variant="contained" 
                color="primary"
                sx={{ minWidth: 150 }}
              >
                Applica Questo Template
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default MonthlyTemplateBasedPlanner;
