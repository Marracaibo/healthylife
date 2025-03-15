import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  useTheme,
  alpha,
  Button,
  Fade,
  Tabs,
  Tab
} from '@mui/material';
import { 
  LocalDining as LocalDiningIcon, 
  MenuBook as MenuBookIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import MealPlanner from './MealPlanner';
import DailyDiary from './DailyDiary';
import SavedMealPlans from './SavedMealPlans'; // Import the new component

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
      id={`nutrition-tabpanel-${index}`}
      aria-labelledby={`nutrition-tab-${index}`}
      style={{ width: '100%' }}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `nutrition-tab-${index}`,
    'aria-controls': `nutrition-tabpanel-${index}`,
  };
}

const NutritionHub: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [showMealPlanner, setShowMealPlanner] = useState(false);

  // Gestisce il cambio di tab
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Gestisce l'apertura del meal planner
  const handleOpenMealPlanner = () => {
    setShowMealPlanner(true);
  };

  // Gestisce la chiusura del meal planner
  const handleCloseMealPlanner = () => {
    setShowMealPlanner(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3
        }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 'bold',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <LocalDiningIcon sx={{ mr: 1, fontSize: 36 }} />
            Nutrizione
          </Typography>
          {!showMealPlanner && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenMealPlanner}
              sx={{ 
                fontWeight: 'bold',
                boxShadow: 3,
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s'
              }}
            >
              Crea Piano Alimentare
            </Button>
          )}
          {showMealPlanner && (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<ArrowBackIcon />}
              onClick={handleCloseMealPlanner}
            >
              Torna al Diario
            </Button>
          )}
        </Box>

        {!showMealPlanner ? (
          <Box sx={{ width: '100%' }}>
            <Paper 
              elevation={3} 
              sx={{ 
                borderRadius: 2,
                overflow: 'hidden',
                mb: 3,
                background: 'linear-gradient(to right, #f5f7fa, #ffffff)'
              }}
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="nutrition tabs"
                variant="fullWidth"
                sx={{
                  '& .MuiTab-root': {
                    fontWeight: 'bold',
                    py: 2
                  },
                  '& .Mui-selected': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1)
                  },
                  borderBottom: 1,
                  borderColor: 'divider'
                }}
              >
                <Tab 
                  icon={<MenuBookIcon />} 
                  label="Diario Alimentare" 
                  iconPosition="start"
                  {...a11yProps(0)} 
                />
                <Tab 
                  icon={<LocalDiningIcon />} 
                  label="Piani Alimentari" 
                  iconPosition="start"
                  {...a11yProps(1)} 
                />
              </Tabs>

              <TabPanel value={tabValue} index={0}>
                <DailyDiary />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    I Tuoi Piani Alimentari
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Qui puoi visualizzare e gestire i tuoi piani alimentari salvati.
                  </Typography>
                  
                  {/* Lista dei piani alimentari salvati */}
                  <Box sx={{ mt: 3, mb: 3 }}>
                    <SavedMealPlans />
                  </Box>
                  
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleOpenMealPlanner}
                    sx={{ mt: 2 }}
                  >
                    Crea Nuovo Piano
                  </Button>
                </Box>
              </TabPanel>
            </Paper>
          </Box>
        ) : (
          <Fade in={showMealPlanner}>
            <Box>
              <MealPlanner />
            </Box>
          </Fade>
        )}
      </Box>
    </Container>
  );
};

export default NutritionHub;
