import React, { useState, useEffect, useCallback } from 'react';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import { 
  Container, 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  Divider, 
  Button, 
  IconButton,
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Card, 
  CardContent, 
  CardActions,
  Modal, 
  Alert, 
  Backdrop, 
  CircularProgress,
  Chip,
  LinearProgress,
  Fade,
  Collapse,
  Tabs,
  Tab
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import {
  FitnessCenter, 
  CalendarToday, 
  CheckCircle, 
  CheckCircleOutline as CheckCircleOutlineIcon,
  Info, 
  ArrowBack, 
  ArrowForward, 
  ExpandMore, 
  ExpandLess, 
  Lock, 
  LockOpen,
  Speed,
  InfoOutlined,
  Check,
  PlayCircleOutline,
  FitnessCenterOutlined,
  TimerOutlined,
  CountertopsOutlined,
  PlayArrow,
  Timeline,
  RestaurantMenu,
  BedOutlined,
  RadioButtonUnchecked,
  Dashboard,
  CalendarMonth,
  TrendingUp,
  Repeat as RepeatIcon,
  FitnessCenter as FitnessCenterIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import { 
  Timeline as MuiTimeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent
} from '@mui/lab';
import { bodyTransformationProgram, workoutPrograms } from '../data/workoutPrograms';
import { getWorkoutPrograms, getWorkoutProgramById } from '../services/workoutStorageService';
import { WorkoutPhase, WorkoutWeek, WorkoutDay, Exercise, WorkoutProgram } from '../types/workout';
import WorkoutCalendar from '../components/WorkoutCalendar';
import ExerciseGif from '../components/ExerciseGif';
import MusclesWorked from '../components/MusclesWorked';
import ExerciseBenefits from '../components/ExerciseBenefits';
import { useNavigate } from 'react-router-dom';

// Interfaccia per le props di TabPanel
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Interfaccia per i progressi dell'utente
interface UserProgress {
  completedWorkouts: Set<string>;
  currentPhase: string;
  currentWeek: string;
  currentDay: string;
}

// Interfaccia per le props del calendario degli allenamenti
interface WorkoutCalendarProps {
  program: WorkoutProgram;
  selectedPhase: WorkoutPhase | null;
  selectedWeek: WorkoutWeek | null;
  onPhaseSelect: (phase: WorkoutPhase) => void;
  onWeekSelect: (week: WorkoutWeek) => void;
  onDaySelect: (day: WorkoutDay) => void;
  completedWorkouts: Set<string>;
}

// Componente TabPanel
const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`workout-tabpanel-${index}`}
      aria-labelledby={`workout-tab-${index}`}
      {...other}
      style={{ width: '100%' }}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const Workout = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  
  // Stato per il tab corrente
  const [tabValue, setTabValue] = useState(0); 
  
  // Stato per il programma corrente e le fasi selezionate
  const [program, setProgram] = useState<WorkoutProgram | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<WorkoutPhase | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<WorkoutWeek | null>(null);
  const [selectedDay, setSelectedDay] = useState<WorkoutDay | null>(null);
  
  // Stato per gli esercizi
  const [expandedExercises, setExpandedExercises] = useState<Set<string>>(new Set());
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [completedWorkouts, setCompletedWorkouts] = useState<Set<string>>(new Set());
  
  // Stato per la data corrente del calendario
  const [currentCalendarDate, setCurrentCalendarDate] = useState<Date>(new Date());
  const [currentWeekNumber, setCurrentWeekNumber] = useState<number>(1); 
  
  // Funzione per calcolare il numero di settimana corrente in base alla data di inizio del programma
  const calculateCurrentWeek = useCallback((program: WorkoutProgram) => {
    if (!program.startDate) return 1;
    
    // Parsiamo la data di inizio
    const startDate = new Date(program.startDate);
    const today = new Date();
    
    // Se la data odierna è prima della data di inizio, siamo ancora alla settimana 1
    if (today < startDate) return 1;
    
    // Calcola la differenza di tempo in millisecondi
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    // Calcola la differenza in giorni
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    // Calcola la settimana corrente (aggiungi 1 perché le settimane iniziano da 1)
    const currentWeek = Math.floor(diffDays / 7) + 1;
    
    // Assicurati che la settimana non superi la durata totale del programma
    return Math.min(currentWeek, program.duration);
  }, []);

  // Carica il programma e seleziona la fase e la settimana corrente
  useEffect(() => {
    // Carica l'ID del programma corrente dal localStorage
    const currentProgramId = localStorage.getItem('currentWorkoutProgram');
    console.log('ID programma corrente:', currentProgramId);
    
    if (!currentProgramId) {
      console.log('Nessun ID programma trovato in localStorage');
      return;
    }
    
    // Carica tutti i programmi disponibili
    const userPrograms = getWorkoutPrograms();
    console.log('Programmi utente trovati:', userPrograms.length);
    console.log('Dettaglio programmi utente:', userPrograms.map(p => ({ id: p.id, name: p.name })));
    
    // Programmi predefiniti
    console.log('Programmi predefiniti:', workoutPrograms.map(p => ({ id: p.id, name: p.name })));
    
    const allPrograms = [
      ...workoutPrograms, 
      ...userPrograms // Programmi personalizzati
    ];
    
    console.log('Tutti i programmi disponibili:', allPrograms.map(p => ({ id: p.id, name: p.name })));
    
    // Verifica se gli ID sono stringhe o numeri
    console.log('Tipo dell\'ID cercato:', typeof currentProgramId);
    allPrograms.forEach(p => {
      console.log(`Programma ${p.name}, ID: ${p.id}, tipo: ${typeof p.id}`);
    });
    
    // Trova il programma corrente in base all'ID con confronto esplicito
    let loadedProgram = allPrograms.find(p => String(p.id) === String(currentProgramId));
    console.log('Programma trovato con confronto di stringhe:', loadedProgram ? loadedProgram.name : 'nessuno');
    
    // Se non troviamo il programma, proviamo a cercarlo direttamente in localStorage
    if (!loadedProgram) {
      try {
        console.log('Cerco il programma direttamente in localStorage');
        const programsJson = localStorage.getItem('healthylife_workout_programs');
        console.log('Contenuto di healthylife_workout_programs:', programsJson);
        
        if (programsJson) {
          const programs = JSON.parse(programsJson);
          console.log('Programmi parsati da localStorage:', programs);
          
          if (Array.isArray(programs)) {
            loadedProgram = programs.find(p => String(p.id) === String(currentProgramId));
            console.log('Programma trovato direttamente in localStorage:', loadedProgram ? loadedProgram.name : 'nessuno');
          }
        }
      } catch (error) {
        console.error('Errore nel recupero diretto da localStorage:', error);
      }
    }
    
    if (loadedProgram) {
      console.log('Caricamento del programma trovato:', loadedProgram.name);
      console.log('Struttura del programma:', JSON.stringify(loadedProgram, null, 2));
      setProgram(loadedProgram);
      
      // Calcola la settimana corrente
      const weekNumber = calculateCurrentWeek(loadedProgram);
      setCurrentWeekNumber(weekNumber);
      
      // Trova la fase corrente in base alla settimana
      let currentPhase: WorkoutPhase | null = null;
      let currentWeek: WorkoutWeek | null = null;
      
      // Debug della struttura del programma
      console.log('Fasi del programma:', loadedProgram.phases ? loadedProgram.phases.length : 'nessuna fase');
      
      if (loadedProgram.phases && loadedProgram.phases.length > 0) {
        for (const phase of loadedProgram.phases) {
          console.log(`Fase ${phase.id}: ${phase.name}, settimane: ${phase.weeks ? phase.weeks.length : 0}`);
          
          if (phase.weeks && phase.weeks.length > 0) {
            for (const w of phase.weeks) {
              console.log(`  Settimana ${w.id}: ${w.name}, numero: ${w.weekNumber}, giorni: ${w.days ? w.days.length : 0}`);
              
              if (w.weekNumber === weekNumber) {
                currentPhase = phase;
                currentWeek = w;
                break;
              }
            }
          } else {
            console.log('  Nessuna settimana trovata in questa fase');
          }
          
          if (currentPhase && currentWeek) break;
        }
      } else {
        console.log('Nessuna fase trovata nel programma');
      }
      
      // Se non troviamo la fase/settimana corrente, usa la prima fase e settimana
      if (!currentPhase && loadedProgram.phases && loadedProgram.phases.length > 0) {
        currentPhase = loadedProgram.phases[0];
        console.log('Usando la prima fase:', currentPhase.name);
        
        if (currentPhase.weeks && currentPhase.weeks.length > 0) {
          currentWeek = currentPhase.weeks[0];
          console.log('Usando la prima settimana:', currentWeek.name);
        } else {
          console.log('Nessuna settimana trovata nella prima fase');
        }
      }
      
      console.log('Fase selezionata:', currentPhase ? currentPhase.name : 'nessuna');
      console.log('Settimana selezionata:', currentWeek ? currentWeek.name : 'nessuna');
      
      setSelectedPhase(currentPhase);
      setSelectedWeek(currentWeek);
      
      // Se c'è una settimana selezionata, seleziona anche il primo giorno
      if (currentWeek && currentWeek.days && currentWeek.days.length > 0) {
        const firstDay = currentWeek.days[0];
        console.log('Selezionando il primo giorno:', firstDay.name);
        handleDaySelect(firstDay);
      } else {
        console.log('Nessun giorno disponibile nella settimana selezionata');
      }
      
      // Carica gli allenamenti completati dal localStorage
      const savedCompletedWorkouts = localStorage.getItem('completedWorkouts');
      if (savedCompletedWorkouts) {
        try {
          const parsed = JSON.parse(savedCompletedWorkouts);
          setCompletedWorkouts(new Set(parsed));
        } catch (e) {
          console.error('Errore nel parsing dei workout completati:', e);
          setCompletedWorkouts(new Set());
        }
      }
      
      const savedCompletedExercises = localStorage.getItem('completedExercises');
      if (savedCompletedExercises) {
        try {
          const parsed = JSON.parse(savedCompletedExercises);
          setCompletedExercises(new Set(parsed));
        } catch (e) {
          console.error('Errore nel parsing degli esercizi completati:', e);
          setCompletedExercises(new Set());
        }
      }
    }
  }, [calculateCurrentWeek]);

  // Salva gli allenamenti completati nel localStorage quando cambiano
  useEffect(() => {
    localStorage.setItem('completedWorkouts', JSON.stringify(Array.from(completedWorkouts)));
  }, [completedWorkouts]);
  
  // Salva gli esercizi completati nel localStorage quando cambiano
  useEffect(() => {
    localStorage.setItem('completedExercises', JSON.stringify(Array.from(completedExercises)));
  }, [completedExercises]);

  // Verifica se un workout è disponibile in base alla settimana corrente
  const isWorkoutAvailable = useCallback((phase: WorkoutPhase, week: WorkoutWeek) => {
    if (!program) return false;
    
    // Se non c'è una data di inizio, tutti i workout sono disponibili
    if (!program.startDate) return true;
    
    // Altrimenti, controlla se la settimana è minore o uguale alla settimana corrente
    return week.weekNumber <= currentWeekNumber;
  }, [program, currentWeekNumber]);

  // Handler per il cambio di tab
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Handler per la selezione della fase
  const handlePhaseSelect = (phase: WorkoutPhase) => {
    setSelectedPhase(phase);
    setSelectedWeek(phase.weeks[0]);
    setSelectedDay(null);
  };
  
  // Handler per la selezione della settimana
  const handleWeekSelect = (week: WorkoutWeek) => {
    setSelectedWeek(week);
    setSelectedDay(null);
  };
  
  // Handler per la selezione del giorno
  const handleDaySelect = (day: WorkoutDay) => {
    setSelectedDay(day);
    // Quando si seleziona un giorno, passa automaticamente alla tab degli esercizi
    setTabValue(1);
  };
  
  // Toggle per espandere/collassare un esercizio
  const toggleExerciseExpanded = (exerciseId: string) => {
    const newExpanded = new Set(expandedExercises);
    if (newExpanded.has(exerciseId)) {
      newExpanded.delete(exerciseId);
    } else {
      newExpanded.add(exerciseId);
    }
    setExpandedExercises(newExpanded);
  };
  
  // Toggle per segnare un esercizio come completato
  const toggleExerciseComplete = (exerciseId: string) => {
    const newCompleted = new Set(completedExercises);
    if (newCompleted.has(exerciseId)) {
      newCompleted.delete(exerciseId);
    } else {
      newCompleted.add(exerciseId);
    }
    setCompletedExercises(newCompleted);
  };
  
  // Toggle per segnare un allenamento come completato
  const toggleWorkoutComplete = (workoutId: string) => {
    const newCompleted = new Set(completedWorkouts);
    if (newCompleted.has(workoutId)) {
      newCompleted.delete(workoutId);
    } else {
      newCompleted.add(workoutId);
    }
    setCompletedWorkouts(newCompleted);
  };

  // Calcola il progresso del programma
  const progress = program ? (currentWeekNumber / program.duration) * 100 : 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{ mr: 2 }}
        >
          <ArrowBack />
        </IconButton>
        
        <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
          {program?.name || 'Programma di Allenamento'}
        </Typography>
      </Box>
      
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="workout tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Calendario" icon={<CalendarMonth />} iconPosition="start" />
            <Tab label="Esercizi" icon={<FitnessCenterIcon />} iconPosition="start" disabled={!selectedDay} />
            <Tab label="Progressi" icon={<TrendingUp />} iconPosition="start" />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <WorkoutCalendar
                  program={program}
                  selectedPhase={selectedPhase}
                  selectedWeek={selectedWeek}
                  onPhaseSelect={handlePhaseSelect}
                  onWeekSelect={handleWeekSelect}
                  onDaySelect={handleDaySelect}
                  completedWorkouts={completedWorkouts}
                />
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          {selectedDay && (
            <Box>
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {selectedDay.name}
                  </Typography>
                  <Chip 
                    label={selectedDay.type === 'workout' ? 'Allenamento' : selectedDay.type === 'test' ? 'Test' : 'Riposo'} 
                    color={selectedDay.type === 'workout' ? 'error' : selectedDay.type === 'test' ? 'warning' : 'success'} 
                    size="small" 
                    sx={{ mr: 1 }} 
                  />
                  {completedWorkouts.has(`${selectedPhase?.id || 'unknown'}-${selectedWeek?.id || 'unknown'}-${selectedDay.id}`) && (
                    <Chip label="Completato" color="success" size="small" icon={<CheckCircleOutlineIcon />} />
                  )}
                </Box>
                <Box>
                  {selectedDay.type === 'workout' && (
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<RepeatIcon />}
                      onClick={() => {
                        const workoutId = `${selectedPhase?.id || 'unknown'}-${selectedWeek?.id || 'unknown'}-${selectedDay.id}`;
                        if (!completedWorkouts.has(workoutId)) {
                          const newCompleted = new Set(completedWorkouts);
                          newCompleted.add(workoutId);
                          setCompletedWorkouts(newCompleted);
                          
                          // Opzionalmente, marca tutti gli esercizi di questo allenamento come completati
                          const newCompletedExercises = new Set(completedExercises);
                          selectedDay.exercises.forEach(exercise => {
                            newCompletedExercises.add(`${workoutId}-${exercise.id}`);
                          });
                          setCompletedExercises(newCompletedExercises);
                        }
                      }}
                      sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                      {completedWorkouts.has(`${selectedPhase?.id || 'unknown'}-${selectedWeek?.id || 'unknown'}-${selectedDay.id}`) ? 'Rifai allenamento' : 'Inizia allenamento'}
                    </Button>
                  )}
                  {selectedDay.type === 'test' && (
                    <Button
                      variant="contained"
                      color="warning"
                      startIcon={<RepeatIcon />}
                      onClick={() => {
                        const testId = `${selectedPhase?.id || 'unknown'}-${selectedWeek?.id || 'unknown'}-${selectedDay.id}`;
                        if (!completedWorkouts.has(testId)) {
                          const newCompleted = new Set(completedWorkouts);
                          newCompleted.add(testId);
                          setCompletedWorkouts(newCompleted);
                        }
                      }}
                      sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                      {completedWorkouts.has(`${selectedPhase?.id || 'unknown'}-${selectedWeek?.id || 'unknown'}-${selectedDay.id}`) ? 'Rifai test' : 'Inizia test'}
                    </Button>
                  )}
                </Box>
              </Box>
              
              {selectedDay.type !== 'rest' && (
                <List>
                  {selectedDay.exercises.map((exercise) => (
                    <ExerciseCard
                      key={`${selectedDay.id}-${exercise.id}`}
                      exercise={exercise}
                      isExpanded={expandedExercises.has(`${selectedDay.id}-${exercise.id}`)}
                      onToggle={() => toggleExerciseExpanded(`${selectedDay.id}-${exercise.id}`)}
                      isCompleted={completedExercises.has(`${selectedDay.id}-${exercise.id}`)}
                      onComplete={() => toggleExerciseComplete(`${selectedDay.id}-${exercise.id}`)}
                      type={selectedDay.type}
                    />
                  ))}
                </List>
              )}
              
              {selectedDay.type === 'rest' && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: alpha(theme.palette.success.main, 0.2),
                    backgroundColor: alpha(theme.palette.success.main, 0.05),
                    textAlign: 'center',
                  }}
                >
                  <Box sx={{ my: 4 }}>
                    <Dashboard sx={{ fontSize: 60, color: theme.palette.success.main, mb: 2 }} />
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.success.main }}>
                      Oggi è il tuo giorno di riposo!
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                      Il riposo è una parte fondamentale dell'allenamento. Usa questo giorno per recuperare e permettere ai tuoi muscoli di rigenerarsi.
                    </Typography>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="success"
                      startIcon={<CheckCircleOutlineIcon />}
                      onClick={() => {
                        const restDayId = `${selectedPhase?.id || 'unknown'}-${selectedWeek?.id || 'unknown'}-${selectedDay.id}`;
                        if (!completedWorkouts.has(restDayId)) {
                          const newCompleted = new Set(completedWorkouts);
                          newCompleted.add(restDayId);
                          setCompletedWorkouts(newCompleted);
                        }
                      }}
                      sx={{ mt: 2, borderRadius: 2, textTransform: 'none' }}
                    >
                      {completedWorkouts.has(`${selectedPhase?.id || 'unknown'}-${selectedWeek?.id || 'unknown'}-${selectedDay.id}`) ? 'Giorno di riposo completato' : 'Segna come completato'}
                    </Button>
                  </Box>
                </Paper>
              )}
            </Box>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Progressi
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Visualizza i tuoi progressi nel programma di allenamento.
            </Typography>
          </Box>
        </TabPanel>
      </Box>
    </Container>
  );
};

// Componente per la scheda di un esercizio
const ExerciseCard = ({ 
  exercise, 
  isExpanded, 
  onToggle, 
  isCompleted,
  onComplete,
  type = 'workout'
}: { 
  exercise: Exercise, 
  isExpanded: boolean, 
  onToggle: () => void, 
  isCompleted: boolean,
  onComplete?: () => void,
  type?: 'workout' | 'test'
}) => {
  const theme = useTheme();
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  // Funzione per determinare il video URL basato sul nome o ID dell'esercizio
  const getExerciseVideoUrl = () => {
    const exerciseNameLower = exercise.name.toLowerCase().replace(/[-\s]+/g, '');
    const exerciseIdLower = exercise.id.toLowerCase().replace(/[-\s]+/g, '');
    
    // Lista dei video disponibili con le estensioni corrette
    const availableVideos = [
      { id: 'squat', file: 'squat.mp4' },
      { id: 'pushup', file: 'closegripushup.mp4' },
      { id: 'lunge', file: 'lunge.mp4' },
      { id: 'pullup', file: 'Band AssistedPull-Up.mp4' },
      { id: 'jumpingjack', file: 'JumpingJack.mp4' },
      { id: 'burpee', file: 'burpee.mp4' },
      { id: 'plank', file: 'anatomyplank.mp4' },
      { id: 'crunch', file: 'anatomycrunch.mp4' },
      { id: 'bulgariansquat', file: 'bulgariansquat.mp4' },
      { id: 'jumpsquat', file: 'jumpsquat.mp4' },
      { id: 'singlelegsquat', file: 'singlelagsquat.mp4' },
      { id: 'sidelunge', file: 'sidelunge.mp4' },
      { id: 'tricepspress', file: 'TricepsPress.mp4' },
      { id: 'legdeadlift', file: 'singlelegdeadlift.mp4' },
      { id: 'diamond', file: 'diamondpushup.mp4' },
      { id: 'dip', file: 'diponchair.mp4' },
      { id: 'chestsretch', file: 'AboveHeadChestStretch.mp4' },
      { id: 'calfraise', file: 'BodyweightStandingCalf Raise.mp4' },
      { id: 'hollowhold', file: 'hollowhold.mp4' },
      { id: 'archer', file: 'archerpushup.mp4' },
      { id: 'chinup', file: 'chinup.mp4' },
      { id: 'cobra', file: 'cobrapose.mp4' },
      { id: 'handstand', file: 'handstandpushup.mp4' },
      { id: 'pike', file: 'pikepushup.mp4' },
      { id: 'pseudo', file: 'pseudopushup.mp4' },
      { id: 'legraise', file: 'legraises.mp4' },
      // Correzione delle estensioni per i file GIF
      { id: 'horizontalpull', file: 'horizontal-pull.gif.gif', isGif: true },
      { id: 'horizontalpush', file: 'horizontal-push.gif.gif', isGif: true },
      { id: 'lungevariations', file: 'lunge-variations.gif.gif', isGif: true },
      { id: 'plankvariations', file: 'plank-variations.gif.gif', isGif: true },
      { id: 'squatvariations', file: 'squat-variations.gif.jfif', isGif: true }
    ];
    
    // Cerca corrispondenza nel nome o ID
    for (const video of availableVideos) {
      if (exerciseNameLower.includes(video.id) || exerciseIdLower.includes(video.id)) {
        return {
          path: `/gif/${video.file}`,
          isGif: video.isGif || false
        };
      }
    }
    
    // Se non c'è corrispondenza ma esiste un videoUrl nell'esercizio
    if (exercise.videoUrl) {
      return {
        path: exercise.videoUrl,
        isGif: exercise.videoUrl.endsWith('.gif') || exercise.videoUrl.includes('.gif.')
      };
    }
    
    return { path: '', isGif: false };
  };

  const handleOpenVideoModal = () => {
    const { path, isGif } = getExerciseVideoUrl();
    if (path) {
      setVideoUrl(path);
      setVideoModalOpen(true);
    }
  };

  const handleCloseVideoModal = () => {
    setVideoModalOpen(false);
  };

  // Determina se il video è disponibile
  const videoAvailable = getExerciseVideoUrl().path !== '';

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 2,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
      }}
    >
      <ListItem
        button
        onClick={onToggle}
        secondaryAction={
          <IconButton
            edge="end"
            onClick={(e) => {
              e.stopPropagation();
              onComplete && onComplete();
            }}
          >
            {isCompleted ? (
              <CheckCircleOutlineIcon color="success" />
            ) : (
              <RadioButtonUnchecked color="disabled" />
            )}
          </IconButton>
        }
      >
        <ListItemIcon>
          <Box
            sx={{
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              backgroundColor: type === 'workout' 
                ? alpha(theme.palette.error.main, 0.1)
                : alpha(theme.palette.warning.main, 0.1),
              color: type === 'workout' 
                ? theme.palette.error.main
                : theme.palette.warning.main,
            }}
          >
            <FitnessCenterIcon />
          </Box>
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 'bold',
                textDecoration: isCompleted
                  ? 'line-through'
                  : 'none',
              }}
            >
              {exercise.name}
            </Typography>
          }
          secondary={
            <Typography variant="body2">
              {exercise.sets} serie × {exercise.reps}
              {exercise.rm && ` | RM: ${exercise.rm}`}
              {exercise.repSpeed && ` | Rep Speed: ${exercise.repSpeed}`}
            </Typography>
          }
        />
        <IconButton>
          {isExpanded ? (
            <ExpandLess />
          ) : (
            <RepeatIcon />
          )}
        </IconButton>
      </ListItem>
      
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <Box sx={{ p: 3, pt: 0 }}>
          {/* GIF dell'esercizio */}
          {exercise.gifUrl && (
            <Box sx={{ mb: 2 }}>
              <ExerciseGif 
                exerciseId={exercise.id} 
                exerciseName={exercise.name} 
                gifUrl={exercise.gifUrl} 
              />
            </Box>
          )}
          
          {exercise.description && (
            <Typography variant="body2" paragraph>
              {exercise.description}
            </Typography>
          )}
          
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={3}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Serie
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {exercise.sets}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Ripetizioni
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {exercise.reps}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                RM
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {exercise.rm || '-'}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Rep Speed
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {exercise.repSpeed || '-'}
              </Typography>
            </Grid>
          </Grid>
          
          {exercise.rest && (
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Recupero
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {exercise.rest}
                </Typography>
              </Grid>
              {exercise.tempo && (
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Tempo
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {exercise.tempo}
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
          
          <Box>
            <Typography component="div" variant="body2" color="text.secondary">
              <Box sx={{ display: 'flex', mb: 0.5, alignItems: 'center' }}>
                <FitnessCenterIcon sx={{ mr: 1, fontSize: 18 }} />
                <Box component="span" fontWeight="bold" sx={{ mr: 0.5 }}>Sets:</Box>
                <Box component="span">{exercise.sets}</Box>
              </Box>
              <Box sx={{ display: 'flex', mb: 0.5, alignItems: 'center' }}>
                <RepeatIcon sx={{ mr: 1, fontSize: 18 }} />
                <Box component="span" fontWeight="bold" sx={{ mr: 0.5 }}>Reps:</Box>
                <Box component="span">{exercise.reps}</Box>
              </Box>
              {exercise.rm && (
                <Box sx={{ display: 'flex', mb: 0.5, alignItems: 'center' }}>
                  <FitnessCenterIcon sx={{ mr: 1, fontSize: 18 }} />
                  <Box component="span" fontWeight="bold" sx={{ mr: 0.5 }}>RM:</Box>
                  <Box component="span">{exercise.rm}</Box>
                </Box>
              )}
              {exercise.repSpeed && (
                <Box sx={{ display: 'flex', mb: 0.5, alignItems: 'center' }}>
                  <SpeedIcon sx={{ mr: 1, fontSize: 18 }} />
                  <Box component="span" fontWeight="bold" sx={{ mr: 0.5 }}>Rep Speed:</Box>
                  <Box component="span">{exercise.repSpeed}</Box>
                </Box>
              )}
              {exercise.targetMuscles && exercise.targetMuscles.length > 0 && (
                <Box sx={{ display: 'flex', mb: 0.5, alignItems: 'center' }}>
                  <FitnessCenterIcon sx={{ mr: 1, fontSize: 18 }} />
                  <Box component="span" fontWeight="bold" sx={{ mr: 0.5 }}>Target:</Box>
                  <Box component="span">{exercise.targetMuscles.join(', ')}</Box>
                </Box>
              )}
            </Typography>
          </Box>
          
          <Button
            fullWidth
            variant="outlined"
            color={type === 'workout' ? 'error' : 'warning'}
            startIcon={<RepeatIcon />}
            sx={{ mt: 1, borderRadius: 2, textTransform: 'none' }}
            onClick={handleOpenVideoModal}
            disabled={!videoAvailable}
          >
            {videoAvailable ? 'Guarda il Video dell\'Esercizio' : 'Video non disponibile'}
          </Button>
          
          {/* Mostra animazione dell'esercizio se disponibile */}
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Paper elevation={1} sx={{ p: 1, height: '100%' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Animazione dell'esercizio
                  </Typography>
                  <ExerciseGif
                    exerciseId={exercise.id}
                    exerciseName={exercise.name}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper elevation={1} sx={{ p: 1, height: '100%' }}>
                  <MusclesWorked
                    exerciseId={exercise.id}
                    exerciseName={exercise.name}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper elevation={1} sx={{ p: 1, height: '100%' }}>
                  <ExerciseBenefits
                    exerciseId={exercise.id}
                    exerciseName={exercise.name}
                  />
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Collapse>

      {/* Modal per visualizzare il video dell'esercizio */}
      <Modal
        aria-labelledby="video-modal-title"
        aria-describedby="video-modal-description"
        open={videoModalOpen}
        onClose={handleCloseVideoModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={videoModalOpen}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: {xs: '95%', sm: '80%', md: '70%'},
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxHeight: '90vh',
            overflow: 'auto',
            outline: 'none' // Rimuove l'outline per accessibilità
          }}
          tabIndex={-1} // Previene il focus automatico che causa problemi di aria-hidden
          >
            <Typography id="video-modal-title" variant="h6" component="h2" gutterBottom>
              {exercise.name}
            </Typography>
            <Box sx={{ position: 'relative', width: '100%', pt: '56.25%' /* 16:9 Aspect Ratio */ }}>
              {videoUrl.endsWith('.mp4') ? (
                <video
                  autoPlay
                  controls
                  loop
                  style={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: 8
                  }}
                  src={videoUrl}
                  aria-label={`Video dell'esercizio ${exercise.name}`}
                />
              ) : (
                <img
                  src={videoUrl}
                  alt={`Animazione dell'esercizio ${exercise.name}`}
                  style={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    maxWidth: '100%',
                    maxHeight: '100%',
                    borderRadius: 8,
                    objectFit: 'contain'
                  }}
                />
              )}
            </Box>
            <Button 
              variant="outlined" 
              onClick={handleCloseVideoModal} 
              sx={{ mt: 2 }}
            >
              Chiudi
            </Button>
          </Box>
        </Fade>
      </Modal>
    </Paper>
  );
};

// Componente di panoramica del programma
const WorkoutOverview: React.FC<{ 
  program: WorkoutProgram | null;
  currentWeek: number;
  progress: number;
}> = ({ program, currentWeek, progress }) => {
  if (!program) return null;
  
  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          {program.name}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          {program.description}
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Settimana Attuale
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
              <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                {currentWeek}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                di {program.duration}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: (theme) => alpha(theme.palette.success.main, 0.08),
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Progresso Complessivo
            </Typography>
            
            <Box sx={{ width: '100%', mt: 1 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                {Math.round(progress)}%
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: (theme) => alpha(theme.palette.warning.main, 0.08),
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Livello
            </Typography>
            
            <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
              {program.difficulty}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: (theme) => alpha(theme.palette.info.main, 0.08),
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Data di Inizio
            </Typography>
            
            <Typography variant="h6">
              {program.startDate ? new Date(program.startDate).toLocaleDateString() : 'Non specificata'}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 3 }} />
      
      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Aree Principali
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
        {program.targetAreas.map((area) => (
          <Chip 
            key={area}
            label={area} 
            color="primary" 
            variant="outlined" 
            size="small"
          />
        ))}
      </Box>
      
      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Obiettivi
      </Typography>
      
      <Typography variant="body2" paragraph>
        {program.goals}
      </Typography>
    </Paper>
  );
};

export default Workout;
