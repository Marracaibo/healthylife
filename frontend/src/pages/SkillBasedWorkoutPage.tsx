import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Divider,
  Tabs,
  Tab,
  Snackbar,
  Alert
} from '@mui/material';
import { FitnessCenter, EmojiEvents, SportsGymnastics, DirectionsRun, AccessibilityNew } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { generateWorkoutFromSkills } from '../services/skillBasedWorkoutGenerator';
import { skillProgressions } from '../data/skillProgressions';
import { saveWorkoutProgram } from '../services/workoutStorageService';
import SkillSelectionGrid from '../components/SkillSelectionGrid';
import SkillBasedWorkoutDisplay from '../components/SkillBasedWorkoutDisplay';

const SkillBasedWorkoutPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Stati per la gestione della pagina
  const [selectedSkills, setSelectedSkills] = useState<Array<{id: string, startLevel: number}>>([]);
  const [daysPerWeek, setDaysPerWeek] = useState<number>(3);
  const [generatedWorkout, setGeneratedWorkout] = useState<any>(null);
  const [skillFilter, setSkillFilter] = useState<string>('all');
  const [programDetails, setProgramDetails] = useState({
    name: '',
    description: '',
    difficulty: 'intermediate',
    duration: 4,
    category: '',
    targetAreas: []
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Funzione per gestire la selezione delle skill
  const handleSkillSelect = (skillId: string) => {
    setSelectedSkills(prev => {
      // Se la skill è già selezionata, la rimuoviamo
      if (prev.some(skill => skill.id === skillId)) {
        return prev.filter(skill => skill.id !== skillId);
      }
      // Altrimenti, la aggiungiamo con il livello iniziale 1
      return [...prev, { id: skillId, startLevel: 1 }];
    });
  };

  // Funzione per gestire il cambio di livello di una skill
  const handleSkillLevelChange = (skillId: string, level: number) => {
    setSelectedSkills(prev => {
      return prev.map(skill => {
        if (skill.id === skillId) {
          return { ...skill, startLevel: level };
        }
        return skill;
      });
    });
  };

  // Funzione per generare un programma basato sulle skill selezionate
  const generateWorkoutFromSelectedSkills = () => {
    if (selectedSkills.length === 0) {
      setSnackbarMessage('Seleziona almeno una skill per generare la scheda');
      setSnackbarOpen(true);
      return;
    }

    // Genera il programma utilizzando il servizio
    const generatedProgram = generateWorkoutFromSkills(selectedSkills, daysPerWeek);
    
    if (!generatedProgram) {
      setSnackbarMessage('Errore nella generazione della scheda. Riprova.');
      setSnackbarOpen(true);
      return;
    }

    // Aggiorna i dettagli del programma
    setProgramDetails({
      ...programDetails,
      name: programDetails.name || generatedProgram.name,
      description: programDetails.description || generatedProgram.description,
      difficulty: generatedProgram.difficulty,
      targetAreas: generatedProgram.targetAreas || []
    });

    setGeneratedWorkout(generatedProgram);
    setSnackbarMessage('Scheda generata con successo!');
    setSnackbarOpen(true);
  };

  // Funzione per salvare il workout generato
  const handleSaveWorkout = async () => {
    if (!generatedWorkout) {
      setSnackbarMessage('Genera prima un workout da salvare');
      setSnackbarOpen(true);
      return;
    }

    try {
      // Combina i dettagli del programma con il workout generato
      const workoutToSave = {
        ...generatedWorkout,
        name: programDetails.name || generatedWorkout.name,
        description: programDetails.description || generatedWorkout.description
      };

      await saveWorkoutProgram(workoutToSave);
      setSnackbarMessage('Workout salvato con successo!');
      setSnackbarOpen(true);
      
      // Opzionalmente, reindirizza l'utente alla pagina dei workout
      // navigate('/workout-library');
    } catch (error) {
      console.error('Errore durante il salvataggio:', error);
      setSnackbarMessage('Errore durante il salvataggio del workout');
      setSnackbarOpen(true);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Creazione Workout Basata su Skill
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nome del programma"
              value={programDetails.name}
              onChange={(e) => setProgramDetails({...programDetails, name: e.target.value})}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Giorni di allenamento a settimana</InputLabel>
              <Select
                value={daysPerWeek}
                onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                label="Giorni di allenamento a settimana"
              >
                {[2, 3, 4, 5, 6].map((num) => (
                  <MenuItem key={num} value={num}>{num} giorni</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descrizione del programma"
              value={programDetails.description}
              onChange={(e) => setProgramDetails({...programDetails, description: e.target.value})}
              multiline
              rows={2}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Paper>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Seleziona le skill da allenare
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Scegli le skill che desideri ottenere e verrà generato un programma di allenamento personalizzato.
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Tabs 
            value={skillFilter} 
            onChange={(_, newValue) => setSkillFilter(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: 3 }}
          >
            <Tab 
              icon={<FitnessCenter />} 
              label="Tutte" 
              value="all" 
            />
            <Tab 
              icon={<SportsGymnastics />} 
              label="Calisthenics" 
              value="calisthenics" 
            />
            <Tab 
              icon={<DirectionsRun />} 
              label="Cardio" 
              value="cardio" 
            />
            <Tab 
              icon={<FitnessCenter />} 
              label="Powerlifting" 
              value="powerlifting" 
            />
            <Tab 
              icon={<AccessibilityNew />} 
              label="Mobilità" 
              value="mobility" 
            />
          </Tabs>
          
          <SkillSelectionGrid 
            skills={skillProgressions}
            selectedSkills={selectedSkills}
            onSkillSelect={handleSkillSelect}
            onSkillLevelChange={handleSkillLevelChange}
            filter={skillFilter}
          />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            disabled={selectedSkills.length === 0}
            onClick={generateWorkoutFromSelectedSkills}
            startIcon={<FitnessCenter />}
            sx={{ minWidth: 240 }}
          >
            Genera Workout
          </Button>
        </Box>
      </Paper>
      
      {/* Visualizzazione del workout generato in formato calendario */}
      {generatedWorkout && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Il tuo programma di allenamento
            </Typography>
            
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveWorkout}
              startIcon={<FitnessCenter />}
            >
              Salva Workout
            </Button>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <SkillBasedWorkoutDisplay workoutProgram={generatedWorkout} />
        </Paper>
      )}
      
      {/* Snackbar per notifiche */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={4000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SkillBasedWorkoutPage;
