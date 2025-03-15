import React, { useState, useEffect } from 'react';
import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Divider,
  Snackbar,
  Alert,
  Fade,
  Slide,
  Tabs,
  Tab
} from '@mui/material';
import { FitnessCenter, Add, Delete, Refresh, EmojiEvents, DirectionsRun, SportsGymnastics, AccessibilityNew, ArrowBack } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { saveWorkoutProgram } from '../services/workoutStorageService';
import { getCurrentWorkoutExercises, resetCurrentWorkout } from '../services/currentWorkoutService';
import { generateWorkoutFromSkills } from '../services/skillBasedWorkoutGenerator';
import { skillProgressions } from '../data/skillProgressions';
import SkillSelectionGrid from '../components/SkillSelectionGrid';

interface WorkoutBuilderProps {
  onBack?: () => void; // Proprietà opzionale per tornare indietro
}

const WorkoutBuilder: React.FC<WorkoutBuilderProps> = ({ onBack }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Modalità di creazione del workout: manuale o basata su skill
  const [creationMode, setCreationMode] = useState<'manual' | 'skill-based'>('manual');
  
  // Stati per la creazione basata su skill
  const [selectedSkills, setSelectedSkills] = useState<Array<{id: string, startLevel: number}>>([]);
  const [skillFilter, setSkillFilter] = useState<'all' | 'calisthenics' | 'cardio' | 'powerlifting' | 'mobility'>('all');
  const [generatedWorkout, setGeneratedWorkout] = useState<any>(null);
  const [daysPerWeek, setDaysPerWeek] = useState<number>(3);
  
  // Imposta loaded a true dopo il caricamento iniziale
  useEffect(() => {
    setLoaded(true);
  }, []);

  // Stato per i dettagli principali del programma
  const [programDetails, setProgramDetails] = useState({
    name: '',
    description: '',
    difficulty: 'intermediate' as 'beginner' | 'intermediate' | 'advanced',
    duration: 4,
    category: '',
    targetAreas: [] as string[]
  });

  // Stato per i giorni di allenamento
  const [workoutDays, setWorkoutDays] = useState<{
    id: string;
    name: string;
    exercises: {
      id: string;
      name: string;
      type: string; // 'cardio', 'strength', 'bodyweight', etc.
      sets: number;
      reps: string;
      duration: number; // per esercizi cardio (in minuti)
      distance: number; // per esercizi cardio (in km)
      rest: number;
      notes: string;
    }[];
  }[]>([]);

  // Carica gli esercizi trasferiti dalla pagina delle skill quando il componente si monta
  useEffect(() => {
    // Effetto per l'animazione di caricamento
    setLoaded(true);
    
    // Ottieni gli esercizi del workout corrente
    const currentExercises = getCurrentWorkoutExercises();
    
    // Se ci sono esercizi, crea un nuovo giorno e aggiungili
    if (currentExercises.length > 0) {
      const newDay = {
        id: `day-${Date.now()}`,
        name: `Giorno 1`,
        exercises: currentExercises
      };
      
      setWorkoutDays([newDay]);
      
      // Mostra un messaggio di conferma
      setSnackbarMessage('Esercizi aggiunti al workout con successo!');
      setSnackbarOpen(true);
      
      // Resetta il workout corrente dopo averlo caricato
      resetCurrentWorkout();
    } else if (workoutDays.length === 0) {
      // Se non ci sono esercizi e non ci sono giorni, crea almeno un giorno vuoto
      addWorkoutDay();
    }
  }, []);

  // Gestisce l'aggiunta di un nuovo giorno di workout
  const addWorkoutDay = () => {
    const newDay = {
      id: `day-${Date.now()}`,
      name: `Giorno ${workoutDays.length + 1}`,
      exercises: []
    };
    setWorkoutDays([...workoutDays, newDay]);
  };

  // Gestisce la modifica del nome di un giorno
  const handleDayNameChange = (dayId: string, newName: string) => {
    setWorkoutDays(workoutDays.map(day => 
      day.id === dayId ? {...day, name: newName} : day
    ));
  };

  // Gestisce l'aggiunta di un nuovo esercizio a un giorno
  const addExercise = (dayId: string) => {
    setWorkoutDays(workoutDays.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          exercises: [
            ...day.exercises,
            {
              id: `exercise-${Date.now()}`,
              name: '',
              type: '',
              sets: 3,
              reps: '8-12',
              duration: 0,
              distance: 0,
              rest: 60,
              notes: ''
            }
          ]
        };
      }
      return day;
    }));
  };

  // Gestisce la rimozione di un esercizio
  const removeExercise = (dayId: string, exerciseId: string) => {
    setWorkoutDays(workoutDays.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          exercises: day.exercises.filter(ex => ex.id !== exerciseId)
        };
      }
      return day;
    }));
  };

  // Gestisce la modifica di un esercizio
  const handleExerciseChange = (dayId: string, exerciseId: string, field: string, value: string | number) => {
    setWorkoutDays(workoutDays.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          exercises: day.exercises.map(ex => {
            if (ex.id === exerciseId) {
              return { ...ex, [field]: value };
            }
            return ex;
          })
        };
      }
      return day;
    }));
  };

  // Funzione per importare gli esercizi dalla libreria
  const importExercisesFromLibrary = () => {
    // Naviga alla pagina della libreria di esercizi
    navigate('/exercise-library');
  };

  // Funzione per salvare il programma
  const saveProgram = () => {
    if (!programDetails.name) {
      alert('Inserisci un nome per la scheda di allenamento');
      return;
    }

    if (workoutDays.length === 0) {
      alert('Aggiungi almeno un giorno di allenamento');
      return;
    }

    // Verifica che ogni giorno abbia almeno un esercizio
    const emptyDays = workoutDays.filter(day => day.exercises.length === 0);
    if (emptyDays.length > 0) {
      alert(`Aggiungi almeno un esercizio ai seguenti giorni: ${emptyDays.map(d => d.name).join(', ')}`);
      return;
    }

    // Crea la struttura del programma conforme all'interfaccia WorkoutProgram
    const program = {
      id: `program-${Date.now()}`,
      name: programDetails.name,
      description: programDetails.description,
      difficulty: programDetails.difficulty,
      duration: programDetails.duration,
      category: programDetails.category,
      targetAreas: programDetails.targetAreas,
      phases: [
        {
          id: `phase-1`,
          number: 1,
          name: 'Fase 1',
          weeks: [
            {
              id: `week-1`,
              phaseId: `phase-1`,
              weekNumber: 1,
              name: 'Settimana 1',
              isTestWeek: false,
              days: workoutDays.map((day, index) => ({
                id: day.id,
                code: `Giorno ${index + 1}`,
                name: day.name,
                dayNumber: index + 1,
                type: 'workout' as 'workout' | 'rest' | 'test',
                exercises: day.exercises.map(ex => {
                  // Converti il tipo dell'esercizio al formato corretto
                  let exerciseType: 'strength' | 'cardio' | 'mobility' | undefined;
                  
                  if (ex.type === 'strength' || ex.type === 'bodyweight') {
                    exerciseType = 'strength';
                  } else if (ex.type === 'cardio') {
                    exerciseType = 'cardio';
                  } else if (ex.type === 'stretching') {
                    exerciseType = 'mobility';
                  } else {
                    exerciseType = undefined;
                  }
                  
                  return {
                    id: ex.id,
                    name: ex.name,
                    sets: ex.sets,
                    reps: ex.reps,
                    rest: `${ex.rest}s`,
                    notes: ex.notes || '',
                    type: exerciseType
                  };
                })
              })),
              isAvailable: true
            }
          ]
        }
      ],
      isAvailable: true
    };

    // Salva il programma usando il servizio
    try {
      saveWorkoutProgram(program);
      setSnackbarOpen(true);
      setSnackbarMessage('Scheda di allenamento salvata con successo!');
      navigate('/workout-programs');
    } catch (error) {
      console.error('Errore durante il salvataggio:', error);
      setSnackbarOpen(true);
      setSnackbarMessage('Si è verificato un errore durante il salvataggio della scheda');
    }
  };

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

    // Prepara i dati del programma da salvare
    const programToSave = {
      ...generatedProgram,
      name: programDetails.name || generatedProgram.name,
      description: programDetails.description || generatedProgram.description,
      // Assicuriamoci che abbia tutti i campi necessari
      id: generatedProgram.id || `program-${Date.now()}`,
      type: generatedProgram.type || 'skill-based',
      author: 'HealthyLife AI',
      targetAreas: generatedProgram.targetAreas || []
    };

    // Salva il programma nel database
    const savedProgramId = saveWorkoutProgram(programToSave);
    console.log('Programma salvato con ID:', savedProgramId);
    
    // Salva l'ID del programma in localStorage
    localStorage.setItem('currentWorkoutProgram', savedProgramId);
    console.log('ID programma salvato in localStorage');
    
    setGeneratedWorkout(programToSave);
    setSnackbarMessage('Workout salvato con successo!');
    setSnackbarOpen(true);
    
    // Reindirizza alla pagina dei programmi di allenamento
    setTimeout(() => {
      navigate(`/workout-programs?id=${savedProgramId}`);
    }, 1500);
  };

  const addExerciseToDay = (dayIndex: number, exercise: any) => {
    setWorkoutDays(prev => {
      const newWorkout = [...prev];
      if (!newWorkout[dayIndex]) {
        newWorkout[dayIndex] = [];
      }
      newWorkout[dayIndex] = [...newWorkout[dayIndex], exercise];
      return newWorkout;
    });
  };

  const handleRemoveExercise = (dayIndex: number, exerciseIndex: number) => {
    setWorkoutDays(prev => {
      const newWorkout = [...prev];
      newWorkout[dayIndex] = newWorkout[dayIndex].filter((_, i) => i !== exerciseIndex);
      return newWorkout;
    });
  };

  const handleSaveWorkout = async () => {
    const workoutProgram = {
      name: programDetails.name || 'Il mio workout',
      description: programDetails.description || 'Programma di allenamento personalizzato',
      days: workoutDays.map((day, index) => ({
        name: `Giorno ${index + 1}`,
        exercises: day.exercises
      }))
    };

    await saveWorkoutProgram(workoutProgram);
    setSnackbarOpen(true);
    setSnackbarMessage('Scheda di allenamento salvata con successo!');
    setTimeout(() => setSnackbarOpen(false), 3000);
  };

  const handleReset = () => {
    setWorkoutDays([]);
    setProgramDetails({
      name: '',
      description: '',
      difficulty: 'intermediate',
      duration: 4,
      category: '',
      targetAreas: []
    });
    resetCurrentWorkout();
    setSelectedSkills([]);
    setGeneratedWorkout(null);
  };

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

  const handleDaysPerWeekChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setDaysPerWeek(event.target.value as number);
  };

  const handleCreationModeChange = (event: React.MouseEvent<HTMLElement>, newMode: 'manual' | 'skill-based') => {
    if (newMode !== null) {
      setCreationMode(newMode);
      
      // Resetta il workout quando si cambia modalità
      setWorkoutDays([]);
      setGeneratedWorkout(null);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5, px: { xs: 2, sm: 3, md: 4 } }}>
      <Fade in={loaded} timeout={800}>
        <Box>
          {/* Header */}
          <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              Crea il tuo workout
            </Typography>
            
            {/* Pulsante Indietro se onBack è definito */}
            {onBack && (
              <Button
                variant="outlined"
                color="primary"
                startIcon={<ArrowBack />}
                onClick={onBack}
                sx={{ mr: 2 }}
              >
                Indietro
              </Button>
            )}
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" component="h1" gutterBottom>
                  Crea il tuo workout
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <ToggleButtonGroup
                    value={creationMode}
                    exclusive
                    onChange={handleCreationModeChange}
                    aria-label="modalità di creazione"
                    sx={{ mb: 2 }}
                  >
                    <ToggleButton value="manual" aria-label="creazione manuale">
                      <FitnessCenter sx={{ mr: 1 }} /> Creazione Manuale
                    </ToggleButton>
                    <ToggleButton value="skill-based" aria-label="creazione basata su skill">
                      <EmojiEvents sx={{ mr: 1 }} /> Creazione Basata su Skill
                    </ToggleButton>
                  </ToggleButtonGroup>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {creationMode === 'manual' 
                      ? 'Crea manualmente il tuo workout aggiungendo esercizi a ciascun giorno.'
                      : 'Seleziona le skill che vuoi ottenere e genera automaticamente un programma personalizzato.'}
                  </Typography>
                </Box>
                
                {/* Form per i dettagli del programma */}
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
            </Grid>
            
            {creationMode === 'skill-based' && (
              <Grid item xs={12}>
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
              </Grid>
            )}
            
            {/* Qui il resto del codice esistente per la creazione manuale del workout */}
            
            <Grid item xs={12}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  mb: 4,
                  border: '1px solid',
                  borderColor: theme.palette.divider
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight="500" color="primary">
                    Giorni di Allenamento
                  </Typography>
                  <Button 
                    variant="outlined" 
                    startIcon={<Add />}
                    onClick={addWorkoutDay}
                    size="small"
                  >
                    Aggiungi Giorno
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<Add />}
                    onClick={importExercisesFromLibrary}
                    size="small"
                  >
                    Importa Esercizi dalla Libreria
                  </Button>
                </Box>

                <Divider sx={{ mb: 3 }} />
                
                {workoutDays.length === 0 ? (
                  <Typography color="text.secondary" textAlign="center" py={4}>
                    Nessun giorno di allenamento aggiunto. Usa il pulsante "Aggiungi Giorno" per iniziare.
                  </Typography>
                ) : (
                  workoutDays.map((day, index) => (
                    <Card 
                      key={day.id} 
                      variant="outlined" 
                      sx={{ 
                        mb: 3, 
                        borderColor: theme.palette.divider,
                        '&:hover': {
                          borderColor: theme.palette.primary.light,
                          transition: '0.3s'
                        }
                      }}
                    >
                      <CardContent sx={{ pb: 1 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                          <TextField
                            label={`Giorno ${index + 1}`}
                            value={day.name}
                            onChange={(e) => handleDayNameChange(day.id, e.target.value)}
                            variant="outlined"
                            size="small"
                            sx={{ width: '50%' }}
                          />
                          <Button
                            variant="outlined"
                            startIcon={<Add />}
                            size="small"
                            onClick={() => addExercise(day.id)}
                          >
                            Aggiungi Esercizio
                          </Button>
                        </Box>
                        
                        {day.exercises.length === 0 ? (
                          <Typography color="text.secondary" textAlign="center" py={2}>
                            Nessun esercizio aggiunto a questo giorno.
                          </Typography>
                        ) : (
                          day.exercises.map((exercise) => (
                            <Box 
                              key={exercise.id} 
                              sx={{ 
                                p: 2, 
                                mb: 2, 
                                border: '1px solid', 
                                borderColor: 'divider',
                                borderRadius: 1,
                                position: 'relative',
                                '&:hover': {
                                  borderColor: theme.palette.primary.light,
                                  transition: '0.3s'
                                }
                              }}
                            >
                              <IconButton 
                                size="small" 
                                sx={{ position: 'absolute', top: 5, right: 5 }}
                                onClick={() => removeExercise(day.id, exercise.id)}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                              
                              <Grid container spacing={2}>
                                <Grid item xs={12}>
                                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                                    <TextField
                                      fullWidth
                                      label="Nome Esercizio"
                                      value={exercise.name}
                                      onChange={(e) => handleExerciseChange(day.id, exercise.id, 'name', e.target.value)}
                                      variant="outlined"
                                      size="small"
                                    />
                                    <FormControl sx={{ minWidth: 150 }} size="small">
                                      <InputLabel>Tipo</InputLabel>
                                      <Select
                                        value={exercise.type}
                                        label="Tipo"
                                        onChange={(e) => handleExerciseChange(day.id, exercise.id, 'type', e.target.value)}
                                      >
                                        <MenuItem value="strength">Forza (Palestra)</MenuItem>
                                        <MenuItem value="bodyweight">Corpo Libero</MenuItem>
                                        <MenuItem value="cardio">Cardio</MenuItem>
                                        <MenuItem value="stretching">Stretching</MenuItem>
                                        <MenuItem value="other">Altro</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </Box>
                                </Grid>

                                {/* Campi condizionali in base al tipo di esercizio */}
                                {(exercise.type === 'strength' || exercise.type === 'bodyweight') && (
                                  <>
                                    <Grid item xs={6} sm={3}>
                                      <TextField
                                        fullWidth
                                        label="Serie"
                                        type="number"
                                        value={exercise.sets}
                                        onChange={(e) => handleExerciseChange(day.id, exercise.id, 'sets', parseInt(e.target.value) || 0)}
                                        variant="outlined"
                                        size="small"
                                        InputProps={{ inputProps: { min: 1 } }}
                                      />
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                      <TextField
                                        fullWidth
                                        label="Ripetizioni"
                                        value={exercise.reps}
                                        onChange={(e) => handleExerciseChange(day.id, exercise.id, 'reps', e.target.value)}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Es: 10 o 8-12"
                                      />
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                      <TextField
                                        fullWidth
                                        label="Recupero (sec)"
                                        type="number"
                                        value={exercise.rest}
                                        onChange={(e) => handleExerciseChange(day.id, exercise.id, 'rest', parseInt(e.target.value) || 0)}
                                        variant="outlined"
                                        size="small"
                                        InputProps={{ inputProps: { min: 0 } }}
                                      />
                                    </Grid>
                                  </>
                                )}
                                
                                {exercise.type === 'cardio' && (
                                  <>
                                    <Grid item xs={6} sm={4}>
                                      <TextField
                                        fullWidth
                                        label="Durata (min)"
                                        type="number"
                                        value={exercise.duration}
                                        onChange={(e) => handleExerciseChange(day.id, exercise.id, 'duration', parseInt(e.target.value) || 0)}
                                        variant="outlined"
                                        size="small"
                                        InputProps={{ inputProps: { min: 0 } }}
                                      />
                                    </Grid>
                                    <Grid item xs={6} sm={4}>
                                      <TextField
                                        fullWidth
                                        label="Distanza (km)"
                                        type="number"
                                        value={exercise.distance}
                                        onChange={(e) => handleExerciseChange(day.id, exercise.id, 'distance', parseInt(e.target.value) || 0)}
                                        variant="outlined"
                                        size="small"
                                        InputProps={{ inputProps: { min: 0, step: 0.1 } }}
                                      />
                                    </Grid>
                                  </>
                                )}

                                <Grid item xs={12}>
                                  <TextField
                                    fullWidth
                                    label="Note"
                                    multiline
                                    rows={2}
                                    value={exercise.notes}
                                    onChange={(e) => handleExerciseChange(day.id, exercise.id, 'notes', e.target.value)}
                                    variant="outlined"
                                    size="small"
                                    placeholder="Inserisci dettagli aggiuntivi..."
                                  />
                                </Grid>
                              </Grid>
                            </Box>
                          ))
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </Paper>

              {/* Pulsante salva scheda */}
              <Box display="flex" justifyContent="center" mt={4}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={saveProgram}
                  size="large"
                  sx={{
                    borderRadius: 28,
                    px: 4,
                    py: 1
                  }}
                >
                  Salva Scheda di Allenamento
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Fade>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default WorkoutBuilder;
