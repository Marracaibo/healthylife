import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Tab, 
  Tabs, 
  Button, 
  Fade,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import WorkoutProgramCards from '../components/WorkoutProgramCards';
import QuoteCard from '../components/motivation/QuoteCard';
import VideoCard from '../components/motivation/VideoCard';
import PreWorkoutBoosterComponent from '../components/motivation/PreWorkoutBooster';
import SkillsProgression from './SkillsProgression';
import { WorkoutProgram } from '../types/workout';
import { getWorkoutPrograms, deleteWorkoutProgram } from '../services/workoutStorageService';

// Dati di esempio per la motivazione
import { 
  sampleQuotes, 
  sampleVideos, 
  sampleBoosters 
} from '../data/motivationSampleData';

// Dati di esempio per i programmi di allenamento
import { workoutPrograms } from '../data/workoutPrograms';

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
      id={`motivation-tabpanel-${index}`}
      aria-labelledby={`motivation-tab-${index}`}
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
    id: `motivation-tab-${index}`,
    'aria-controls': `motivation-tabpanel-${index}`,
  };
}

const WorkoutPrograms: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [allPrograms, setAllPrograms] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);
  
  // Stato per le tabs principali (Workout Programs / Motivation)
  const [mainTab, setMainTab] = useState(0);
  
  // Stato per le tabs della sezione Motivation
  const [motivationTab, setMotivationTab] = useState(0);
  
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
      isAvailable: program.isAvailable,
      isCustom: program.isCustom, // Assicurati che questa proprietà sia passata
      type: program.type // Aggiungo il tipo di programma per visualizzare il tab bianco
    };
  };

  // Funzione per caricare i programmi
  const loadPrograms = () => {
    // Ottieni i programmi personalizzati creati dall'utente
    const userPrograms = getWorkoutPrograms();
    console.log('Programmi utente caricati:', userPrograms);
    
    // Assicurati che tutti i programmi predefiniti abbiano il campo type impostato
    const updatedWorkoutPrograms = workoutPrograms.map(program => {
      if (!program.type) {
        if (program.id === 'body-transformation') {
          return {...program, type: 'Ipertrofia'};
        } else if (program.category.toLowerCase().includes('skill')) {
          return {...program, type: 'Skill Progression'};
        } else if (program.category.toLowerCase().includes('forza')) {
          return {...program, type: 'Forza'};
        } else if (program.category.toLowerCase().includes('cardio')) {
          return {...program, type: 'Cardio'};
        } else {
          return {...program, type: 'Personalizzato'};
        }
      }
      return program;
    });
    
    // Assicurati che tutti i programmi utente abbiano il campo type impostato
    const updatedUserPrograms = userPrograms.map(program => {
      if (!program.type) {
        if (program.category.toLowerCase().includes('skill')) {
          return {...program, type: 'Skill Progression', isCustom: true};
        } else if (program.category.toLowerCase().includes('forza')) {
          return {...program, type: 'Forza', isCustom: true};
        } else if (program.category.toLowerCase().includes('ipertrofia')) {
          return {...program, type: 'Ipertrofia', isCustom: true};
        } else if (program.category.toLowerCase().includes('cardio')) {
          return {...program, type: 'Cardio', isCustom: true};
        } else {
          return {...program, type: 'Personalizzato', isCustom: true};
        }
      }
      return {...program, isCustom: true};
    });
    
    // Converte tutti i programmi nel formato corretto per i cards
    const convertedPrograms = [...updatedWorkoutPrograms, ...updatedUserPrograms]
      .map(program => convertToWorkoutProgramCard(program));
    
    // Imposta i programmi convertiti nello state
    setAllPrograms(convertedPrograms);
  };

  useEffect(() => {
    loadPrograms();
    setLoaded(true);
  }, []);

  // Funzione per gestire il click su un programma
  const handleProgramClick = (program: any) => {
    // Salva l'ID del programma corrente nel localStorage
    localStorage.setItem('currentWorkoutProgramId', program.id);
    console.log('Programma selezionato:', program.id);
    
    // Naviga alla pagina di allenamento
    navigate('/workout');
  };

  // Funzione per gestire l'eliminazione di un programma
  const handleDeleteProgram = (programId: string) => {
    deleteWorkoutProgram(programId);
    loadPrograms(); // Ricarica i programmi dopo l'eliminazione
  };

  // Gestione delle tabs principali
  const handleMainTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setMainTab(newValue);
  };

  // Gestione delle tabs della sezione Motivation
  const handleMotivationTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setMotivationTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ 
        position: 'relative',
        mb: 4,
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        backgroundImage: 'linear-gradient(135deg, #1b5e20 0%, #388e3c 100%)',
        color: 'white',
        py: { xs: 4, md: 6 },
        px: { xs: 2, md: 4 }
      }}>
        <Box sx={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(/images/workout-banner-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.2,
          zIndex: 0
        }} />
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            align="center"
            sx={{ 
              fontWeight: 700,
              mb: 2,
              textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}
          >
            Trasforma il Tuo Corpo
          </Typography>
          <Typography 
            variant="h6" 
            component="p" 
            align="center"
            sx={{ 
              maxWidth: 800,
              mx: 'auto',
              opacity: 0.9,
              mb: 3
            }}
          >
            Scegli un programma personalizzato e inizia oggi stesso il tuo percorso verso una versione migliore di te.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              color="warning"
              size="large"
              sx={{ 
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                '&:hover': {
                  boxShadow: '0 6px 15px rgba(0,0,0,0.3)',
                  transform: 'translateY(-2px)'
                }
              }}
              onClick={() => navigate('/workout-builder')}
            >
              Avvia Allenamento
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Tabs principali */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs 
          value={mainTab} 
          onChange={handleMainTabChange} 
          aria-label="main tabs"
          centered
          sx={{
            '& .MuiTab-root': {
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              minWidth: 120,
              py: 2
            },
            '& .Mui-selected': {
              color: theme.palette.primary.main,
            },
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette.primary.main,
              height: 3
            }
          }}
        >
          <Tab label="Programmi di Allenamento" {...a11yProps(0)} />
          <Tab label="Motivazione" {...a11yProps(1)} />
          <Tab label="Libreria Esercizi" {...a11yProps(2)} />
        </Tabs>
      </Box>

      {/* Pannello Programmi di Allenamento */}
      <TabPanel value={mainTab} index={0}>
        {loaded && (
          <Fade in={loaded} timeout={800}>
            <Box>
              <WorkoutProgramCards 
                programs={allPrograms} 
                onSelectProgram={handleProgramClick}
                onDeleteProgram={handleDeleteProgram}
              />
            </Box>
          </Fade>
        )}
      </TabPanel>

      {/* Pannello Motivazione */}
      <TabPanel value={mainTab} index={1}>
        <Box sx={{ mb: 4 }}>
          <Tabs 
            value={motivationTab} 
            onChange={handleMotivationTabChange} 
            aria-label="motivation tabs"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                fontSize: '0.9rem',
                fontWeight: 600,
                textTransform: 'none',
                minWidth: 100,
              },
              '& .Mui-selected': {
                color: theme.palette.primary.main,
              },
              '& .MuiTabs-indicator': {
                backgroundColor: theme.palette.primary.main,
              }
            }}
          >
            <Tab label="Citazioni Motivazionali" {...a11yProps(0)} />
            <Tab label="Video Motivazionali" {...a11yProps(1)} />
            <Tab label="Pre-Workout Booster" {...a11yProps(2)} />
          </Tabs>
        </Box>

        {/* Citazioni Motivazionali */}
        <Box sx={{ display: motivationTab === 0 ? 'block' : 'none' }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
              Citazioni Motivazionali
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Lasciati ispirare da queste citazioni per dare il massimo nei tuoi allenamenti.
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            {sampleQuotes.map((quote) => (
              <QuoteCard 
                key={quote.id}
                quote={quote}
                onLike={() => console.log('Like quote:', quote.id)}
              />
            ))}
          </Box>
        </Box>

        {/* Video Motivazionali */}
        <Box sx={{ display: motivationTab === 1 ? 'block' : 'none' }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
              Video Motivazionali
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Guarda questi video per trovare la motivazione per i tuoi allenamenti.
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 3 }}>
            {sampleVideos.map((video) => (
              <VideoCard 
                key={video.id}
                video={video}
                onLike={() => console.log('Like video:', video.id)}
              />
            ))}
          </Box>
        </Box>

        {/* Pre-Workout Booster */}
        <Box sx={{ display: motivationTab === 2 ? 'block' : 'none' }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
              Pre-Workout Booster
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Trova la motivazione per i tuoi allenamenti con questi booster.
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            {sampleBoosters.map((booster) => (
              <PreWorkoutBoosterComponent 
                key={booster.id}
                booster={booster}
              />
            ))}
          </Box>
        </Box>
      </TabPanel>

      {/* Pannello Libreria Esercizi */}
      <TabPanel value={mainTab} index={2}>
        <SkillsProgression />
      </TabPanel>
    </Container>
  );
};

export default WorkoutPrograms;
