import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Switch,
  FormControlLabel,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  Stack,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  CardActionArea,
  Fab,
  Zoom,
  SwipeableDrawer,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import TemplateBasedPlanner from './TemplateBasedPlanner';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';

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
}

const MealPlanner: React.FC = () => {
  const [savedPlans, setSavedPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'ai' | 'manual'>('ai');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('');
  const [calorieRange, setCalorieRange] = useState<[number, number]>([1500, 3000]);
  const [showRestrictions, setShowRestrictions] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    loadSavedPlans();
  }, []);

  const loadSavedPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/api/meal-plans');
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to load meal plans: ${errorText}`);
      }
      const data = await response.json();
      setSavedPlans(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading meal plans:', error);
      setError('Errore nel caricamento dei piani salvati');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlan = async (plan: MealPlan) => {
    try {
      const response = await fetch('http://localhost:8000/api/meal-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(plan),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save meal plan: ${errorText}`);
      }

      await loadSavedPlans();
      setMode('ai');
    } catch (error) {
      console.error('Error saving meal plan:', error);
      setError('Failed to save meal plan');
    }
  };

  const handleTemplateSelect = (template: MealPlan) => {
    handleSavePlan({
      ...template,
      name: `${template.name} - ${new Date().toLocaleDateString()}`,
    });
  };

  const handleModeChange = (event: React.SyntheticEvent, newMode: 'ai' | 'manual') => {
    setMode(newMode);
  };

  const toggleFilterDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setFilterDrawerOpen(open);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress size={isMobile ? 40 : 48} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ px: isMobile ? 1 : 2 }}>
      <Box sx={{ py: isMobile ? 2 : 4 }}>
        {/* Header Section */}
        <Paper
          elevation={0}
          sx={{
            p: isMobile ? 2 : 3,
            mb: 3,
            borderRadius: 2,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Grid container spacing={isMobile ? 1 : 3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant={isMobile ? "h5" : "h4"} component="h1" gutterBottom>
                Pianificatore Pasti
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Tabs
                value={mode}
                onChange={handleModeChange}
                indicatorColor="primary"
                textColor="primary"
                variant={isMobile ? "fullWidth" : "fullWidth"}
                aria-label="meal planner mode"
              >
                <Tab
                  icon={<AutoFixHighIcon />}
                  iconPosition="start"
                  label={isMobile ? "AI" : "Piano AI"}
                  value="ai"
                  sx={{ minHeight: isMobile ? '48px' : '56px' }}
                />
                <Tab
                  icon={<AddIcon />}
                  iconPosition="start"
                  label={isMobile ? "Template" : "Da Template"}
                  value="manual"
                  sx={{ minHeight: isMobile ? '48px' : '56px' }}
                />
              </Tabs>
            </Grid>
          </Grid>
        </Paper>

        {/* Conditional Content Based on Mode */}
        {mode === 'ai' ? (
          <>
            {/* Search and Filters Section - Mobile Version */}
            {isMobile ? (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  mb: 3,
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: filtersExpanded ? 2 : 0 }}>
                  <TextField
                    fullWidth
                    label="Cerca piano"
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    size="small"
                    sx={{ mr: 1 }}
                    InputProps={{
                      endAdornment: searchQuery && (
                        <IconButton 
                          size="small" 
                          onClick={() => setSearchQuery('')}
                          sx={{ padding: '8px' }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      ),
                    }}
                  />
                  <IconButton 
                    onClick={() => setFilterDrawerOpen(true)} 
                    color="primary"
                    sx={{ 
                      padding: '12px',
                      backgroundColor: filterDrawerOpen ? 'action.selected' : 'transparent'
                    }}
                  >
                    <FilterListIcon />
                  </IconButton>
                </Box>
              </Paper>
            ) : (
              /* Desktop Filters */
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Cerca piano"
                      variant="outlined"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Obiettivo</InputLabel>
                      <Select
                        value={selectedGoal}
                        label="Obiettivo"
                        onChange={(e) => setSelectedGoal(e.target.value)}
                      >
                        <MenuItem value="">Seleziona un Piano</MenuItem>
                        <MenuItem value="mantenimento">Mantenimento</MenuItem>
                        <MenuItem value="dimagrimento">Dimagrimento</MenuItem>
                        <MenuItem value="massa">Massa Muscolare</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ px: 2 }}>
                      <Typography gutterBottom>Range Calorie</Typography>
                      <Slider
                        value={calorieRange}
                        onChange={(_, newValue) => setCalorieRange(newValue as [number, number])}
                        valueLabelDisplay="auto"
                        min={1000}
                        max={4000}
                        step={100}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={showRestrictions}
                          onChange={(e) => setShowRestrictions(e.target.checked)}
                        />
                      }
                      label="Con Restrizioni"
                    />
                  </Grid>
                </Grid>
              </Paper>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Content Section */}
            <Paper
              elevation={0}
              sx={{
                p: isMobile ? 2 : 3,
                borderRadius: 2,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              {/* Manual Creation Section */}
              <Box sx={{ mb: 4 }}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item>
                    <AutoFixHighIcon color="primary" />
                  </Grid>
                  <Grid item>
                    <Typography variant={isMobile ? "subtitle1" : "h6"}>
                      Crea Manualmente
                    </Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 2 }} />
                {/* Manual creation form will go here */}
              </Box>

              {/* Saved Plans Section */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant={isMobile ? "subtitle1" : "h6"}>
                    Piani Salvati
                  </Typography>
                  {isMobile && (
                    <Tooltip title="Aggiorna">
                      <IconButton 
                        onClick={loadSavedPlans} 
                        size="small"
                        sx={{ padding: '8px' }}
                      >
                        <RefreshIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
                <Divider sx={{ mb: 2 }} />

                {savedPlans.length === 0 ? (
                  <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                    Nessun piano pasti salvato. Seleziona un template per iniziare!
                  </Typography>
                ) : (
                  <Grid container spacing={isMobile ? 2 : 3}>
                    {savedPlans.map((plan) => (
                      <Grid item xs={12} sm={6} md={4} key={plan.id}>
                        {isMobile ? (
                          <Card sx={{
                            mb: 1,
                            '&:hover': { boxShadow: 1 }
                          }}>
                            <CardActionArea sx={{ minHeight: '48px', p: 1 }}>
                              <CardContent sx={{ p: '8px' }}>
                                <Typography variant="subtitle1" gutterBottom>
                                  {plan.name}
                                </Typography>
                                {plan.description && (
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    {plan.description}
                                  </Typography>
                                )}
                                <Divider sx={{ my: 1 }} />
                                <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
                                  <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <strong>Obiettivo:</strong> {plan.goal}
                                  </Typography>
                                  <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <strong>Calorie:</strong> {plan.calories_target} kcal
                                  </Typography>
                                </Stack>
                                <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center' }}>
                                  <strong>Macros:</strong> P{plan.macros.protein}% C{plan.macros.carbs}% F{plan.macros.fat}%
                                </Typography>
                              </CardContent>
                            </CardActionArea>
                          </Card>
                        ) : (
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              height: '100%',
                              border: '1px solid',
                              borderColor: 'divider',
                              borderRadius: 2,
                              '&:hover': {
                                boxShadow: 1,
                              },
                            }}
                          >
                            <Typography variant="h6" gutterBottom>
                              {plan.name}
                            </Typography>
                            {plan.description && (
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                {plan.description}
                              </Typography>
                            )}
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="body2">
                              Obiettivo: {plan.goal}
                            </Typography>
                            <Typography variant="body2">
                              Calorie: {plan.calories_target} kcal
                            </Typography>
                            <Typography variant="body2">
                              Macros: P{plan.macros.protein}% C{plan.macros.carbs}% F{plan.macros.fat}%
                            </Typography>
                          </Paper>
                        )}
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            </Paper>
          </>
        ) : (
          <TemplateBasedPlanner onApplyTemplate={handleTemplateSelect} />
        )}
      </Box>

      {/* Floating Action Button for mobile */}
      {isMobile && mode === 'ai' && (
        <Zoom in={true}>
          <Fab 
            color="primary" 
            aria-label="add new meal plan" 
            sx={{ 
              position: 'fixed', 
              bottom: '16px', 
              right: '16px',
              height: '56px',
              width: '56px'
            }}
          >
            <AddIcon />
          </Fab>
        </Zoom>
      )}

      {/* Mobile Filter Drawer */}
      {isMobile && (
        <SwipeableDrawer
          anchor="bottom"
          open={filterDrawerOpen}
          onClose={toggleFilterDrawer(false)}
          onOpen={toggleFilterDrawer(true)}
          disableSwipeToOpen={false}
          swipeAreaWidth={30}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <Box sx={{ p: 2, maxHeight: '80vh', overflowY: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="medium">Filtri</Typography>
              <IconButton 
                onClick={toggleFilterDrawer(false)}
                sx={{ padding: '8px' }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel>Obiettivo</InputLabel>
                  <Select
                    value={selectedGoal}
                    label="Obiettivo"
                    onChange={(e) => setSelectedGoal(e.target.value)}
                  >
                    <MenuItem value="">Seleziona un Piano</MenuItem>
                    <MenuItem value="mantenimento">Mantenimento</MenuItem>
                    <MenuItem value="dimagrimento">Dimagrimento</MenuItem>
                    <MenuItem value="massa">Massa Muscolare</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ px: 1 }}>
                  <Typography variant="body2" gutterBottom>Range Calorie</Typography>
                  <Slider
                    value={calorieRange}
                    onChange={(_, newValue) => setCalorieRange(newValue as [number, number])}
                    valueLabelDisplay="auto"
                    min={1000}
                    max={4000}
                    step={100}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showRestrictions}
                      onChange={(e) => setShowRestrictions(e.target.checked)}
                      size="small"
                    />
                  }
                  label={<Typography variant="body2">Con Restrizioni</Typography>}
                />
              </Grid>
              <Grid item xs={12}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  onClick={toggleFilterDrawer(false)}
                  sx={{ mt: 2, height: '48px' }}
                >
                  Applica Filtri
                </Button>
              </Grid>
            </Grid>
          </Box>
        </SwipeableDrawer>
      )}
    </Container>
  );
};

export default MealPlanner;
