import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper,
  useTheme,
  alpha,
  Button,
  Fade,
  Slide
} from '@mui/material';
import WorkoutProgramCards from '../components/WorkoutProgramCards';
import { workoutPrograms } from '../data/workoutPrograms';
import { WorkoutProgram } from '../types/workout';
import { useNavigate } from 'react-router-dom';
import { FitnessCenter } from '@mui/icons-material';
import { getWorkoutPrograms } from '../services/workoutStorageService';

// Definizione di programmi aggiuntivi per la demo
const additionalPrograms: WorkoutProgram[] = [
  {
    id: 'strength-master',
    name: 'Strength Master',
    description: 'Un programma focalizzato sullo sviluppo della forza massimale con esercizi composti e progressione del carico.',
    phases: [],
    duration: 16,
    difficulty: 'advanced',
    category: 'Strength Training',
    targetAreas: ['Strength', 'Power', 'Muscle Mass'],
    isAvailable: true
  },
  {
    id: 'hiit-cardio',
    name: 'HIIT & Cardio',
    description: 'Allenamenti ad alta intensità intervallati con sessioni cardio per massimizzare il consumo calorico e migliorare la resistenza.',
    phases: [],
    duration: 12,
    difficulty: 'intermediate',
    category: 'Cardio & Conditioning',
    targetAreas: ['Fat Loss', 'Endurance', 'Cardiovascular Health'],
    isAvailable: true
  },
  {
    id: 'core-power',
    name: 'Core Power',
    description: 'Programma specializzato per rafforzare il core e migliorare la stabilità con esercizi mirati per addominali e zona lombare.',
    phases: [],
    duration: 8,
    difficulty: 'beginner',
    category: 'Core & Stability',
    targetAreas: ['Core Strength', 'Posture', 'Stability'],
    isAvailable: true
  }
];

const WorkoutPrograms: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [allPrograms, setAllPrograms] = useState<any[]>([]);
  const [currentProgram, setCurrentProgram] = useState<string | undefined>();
  const [loaded, setLoaded] = useState(false);

  // Funzione per convertire WorkoutProgram in WorkoutProgramCard
  const convertToWorkoutProgramCard = (program: WorkoutProgram): any => {
    return {
      id: program.id,
      title: program.name,
      description: program.description,
      difficulty: program.difficulty,
      duration: `${program.duration} settimane`,
      category: program.category,
      image: program.id === 'body-transformation' ? '/images/program-1.jpg' : 
             program.id === 'strength-master' ? '/images/program-2.jpg' : 
             program.id === 'hiit-cardio' ? '/images/program-3.jpg' : 
             program.id === 'core-power' ? '/images/program-4.jpg' : 
             '/images/custom-program.jpg',
      progress: 0, // Da calcolare se necessario
      fav: 0,
      isAvailable: program.isAvailable
    };
  };

  useEffect(() => {
    // Ottieni i programmi personalizzati creati dall'utente
    const userPrograms = getWorkoutPrograms();
    
    // Converte tutti i programmi nel formato corretto per i cards
    const convertedPrograms = [...workoutPrograms, ...additionalPrograms, ...userPrograms]
      .map(program => convertToWorkoutProgramCard(program));
    
    // Imposta i programmi convertiti nello state
    setAllPrograms(convertedPrograms);
    
    // Controlla se l'utente ha già un programma attivo
    const savedProgress = localStorage.getItem('workoutProgress');
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        if (progress.programId) {
          setCurrentProgram(progress.programId);
        } else {
          // Se non c'è un programId nel progresso salvato, impostiamo il default
          setCurrentProgram('body-transformation');
        }
      } catch (error) {
        console.error('Error parsing workout progress:', error);
        setCurrentProgram('body-transformation');
      }
    } else {
      // Se non c'è progresso salvato, impostiamo il default
      setCurrentProgram('body-transformation');
    }
    
    // Indica che i dati sono stati caricati
    setLoaded(true);
  }, []);

  // Funzione per gestire la selezione di un programma
  const handleSelectProgram = (program: any) => {
    // Salva il programma selezionato in localStorage
    try {
      localStorage.setItem('currentWorkoutProgram', program.id);
      
      // Inizializza lo stato del programma se è la prima volta
      if (!localStorage.getItem('workoutProgress')) {
        const initialProgress = {
          programId: program.id,
          currentPhase: 0,
          currentWeek: 1,
          currentDay: 1
        };
        localStorage.setItem('workoutProgress', JSON.stringify(initialProgress));
      }
      
      setCurrentProgram(program.id);
      
      // Navigate to workout page
      navigate('/workout');
    } catch (error) {
      console.error('Error saving program selection:', error);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 5, px: { xs: 2, sm: 3, md: 4 } }}>
      <Fade in={loaded} timeout={800}>
        <Box>
          <Box 
            sx={{ 
              position: 'relative',
              mb: 6,
              mt: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              overflow: 'hidden',
              borderRadius: 4,
              p: { xs: 4, md: 6 },
            }}
          >
            <Box 
              sx={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${alpha(theme.palette.primary.light, 0.8)} 100%)`,
                zIndex: -1,
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `radial-gradient(circle at 30% 40%, ${alpha('#000', 0)} 0%, ${alpha('#000', 0.3)} 100%)`,
                zIndex: -1,
              }}
            />
            
            <Typography 
              variant="h2" 
              component="h1"
              sx={{ 
                fontWeight: 800, 
                color: 'white',
                letterSpacing: -1,
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                mb: 2,
                textShadow: '0 2px 10px rgba(0,0,0,0.2)'
              }}
            >
              Trasforma il Tuo Corpo
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 400, 
                color: 'white',
                maxWidth: '800px',
                mb: 4,
                opacity: 0.9,
                textShadow: '0 1px 5px rgba(0,0,0,0.1)'
              }}
            >
              Scegli un programma personalizzato e inizia oggi stesso il tuo percorso verso una versione migliore di te.
            </Typography>
            
            <Button 
              variant="contained" 
              color="secondary"
              size="large"
              sx={{ 
                py: 1.5, 
                px: 4, 
                borderRadius: 2,
                fontWeight: 'bold',
                boxShadow: theme.shadows[10],
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[15],
                },
                transition: 'all 0.3s ease'
              }}
              onClick={() => navigate('/workout')}
            >
              Avvia Allenamento
            </Button>
          </Box>
        </Box>
      </Fade>
      
      {/* Menu di navigazione per le tre sezioni principali */}
      <Box sx={{ mb: 5, display: 'flex', justifyContent: 'center' }}>
        <Paper 
          elevation={3}
          sx={{ 
            display: 'flex', 
            borderRadius: 3,
            overflow: 'hidden',
            flexDirection: { xs: 'column', sm: 'row' }
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<FitnessCenter />}
            sx={{
              py: 2,
              px: 3,
              fontWeight: 700,
              bgcolor: 'primary.main',
              borderRadius: 0,
              '&:hover': {
                bgcolor: 'primary.dark',
              }
            }}
            onClick={() => {}} // Già nella pagina corrente
          >
            Programmi Workout
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<FitnessCenter />}
            sx={{
              py: 2,
              px: 3,
              fontWeight: 700,
              bgcolor: alpha(theme.palette.primary.main, 0.9),
              borderRadius: 0,
              '&:hover': {
                bgcolor: 'primary.dark',
              }
            }}
            onClick={() => navigate('/exercise-library')}
          >
            Libreria Esercizi
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<FitnessCenter />}
            sx={{
              py: 2,
              px: 3,
              fontWeight: 700,
              bgcolor: alpha(theme.palette.primary.main, 0.9),
              borderRadius: 0,
              '&:hover': {
                bgcolor: 'primary.dark',
              }
            }}
            onClick={() => navigate('/workout-builder')}
          >
            Workout Builder
          </Button>
        </Paper>
      </Box>
      
      <Box id="programs-section">
        <Slide direction="up" in={loaded} timeout={1000} mountOnEnter unmountOnExit>
          <Box>
            <Box sx={{ position: 'relative', mb: 5 }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 1.5,
                  textAlign: 'center',
                  position: 'relative',
                  display: 'inline-block',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: '25%',
                    width: '50%',
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: theme.palette.primary.main,
                  }
                }}
              >
                Programmi di Allenamento
              </Typography>
              
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ 
                  mb: 5, 
                  maxWidth: 800, 
                  mx: 'auto',
                  textAlign: 'center',
                  fontSize: '1.1rem',
                  lineHeight: 1.6
                }}
              >
                Ogni programma è progettato scientificamente per massimizzare i risultati 
                e adattarsi progressivamente al tuo livello di fitness.
              </Typography>
            </Box>
            
            <Box sx={{ position: 'relative' }}>
              {/* Animated shapes for the background */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -30,
                  right: -20,
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: alpha(theme.palette.primary.light, 0.1),
                  zIndex: -1,
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 40,
                  left: -40,
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  background: alpha(theme.palette.secondary.light, 0.05),
                  zIndex: -1,
                }}
              />
              
              <WorkoutProgramCards 
                programs={allPrograms} 
                currentProgram={currentProgram}
                onSelectProgram={handleSelectProgram}
              />
            </Box>
          </Box>
        </Slide>
      </Box>
    </Container>
  );
};

export default WorkoutPrograms;
