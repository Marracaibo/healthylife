import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Fade,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography,
  useTheme,
  Alert,
  useMediaQuery,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { Add, Delete, DirectionsRun, Save, FitnessCenterOutlined, SportsGymnastics } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { saveWorkoutProgram } from '../services/workoutStorageService';
import { getCurrentWorkoutExercises, resetCurrentWorkout } from '../services/currentWorkoutService';

interface WorkoutBuilderProps {
  onBack?: () => void; // Proprietà opzionale per tornare indietro
}

// Interfaccia per le skill disponibili
interface Skill {
  id: string;
  name: string;
  description: string;
  exercises: Array<{
    name: string;
    type: string;
    sets: number;
    reps: string;
    duration?: number;
    distance?: number;
    rest: number;
    notes?: string;
  }>;
}

const WorkoutBuilder: React.FC<WorkoutBuilderProps> = ({ onBack }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();
  const [workoutDays, setWorkoutDays] = useState<Array<{
    id: string;
    name: string;
    exercises: Array<{
      id: string;
      name: string;
      type: string;
      sets: number;
      reps: string;
      duration: number;
      distance: number;
      rest: number;
      notes: string;
    }>;
  }>>([]);
  const [programDetails, setProgramDetails] = useState({ name: '', description: '' });
  const [loaded, setLoaded] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  // Stato per il metodo di creazione della scheda
  const [creationMethod, setCreationMethod] = useState<'manual' | 'skill'>('manual');
  // Stato per il livello di skill selezionato (principiante, intermedio, avanzato)
  const [skillLevel, setSkillLevel] = useState('principiante');
  // Stato per l'obiettivo dell'allenamento
  const [workoutGoal, setWorkoutGoal] = useState('forza');
  // Stato per le skill disponibili
  const availableSkills: Skill[] = [
    {
      id: 'pushup',
      name: 'Piegamenti',
      description: 'Progressione di piegamenti sulle braccia',
      exercises: [
        {
          name: 'Piegamenti a muro',
          type: 'bodyweight',
          sets: 3,
          reps: '10-15',
          rest: 60,
        },
        {
          name: 'Piegamenti inclinati',
          type: 'bodyweight',
          sets: 3,
          reps: '8-12',
          rest: 90,
        },
        {
          name: 'Piegamenti sulle ginocchia',
          type: 'bodyweight',
          sets: 3,
          reps: '8-12',
          rest: 90,
        },
        {
          name: 'Piegamenti completi',
          type: 'bodyweight',
          sets: 3,
          reps: '5-10',
          rest: 120,
        },
      ],
    },
    {
      id: 'pullup',
      name: 'Trazioni',
      description: 'Progressione di trazioni alla sbarra',
      exercises: [
        {
          name: 'Trazioni australiane',
          type: 'bodyweight',
          sets: 3,
          reps: '8-12',
          rest: 90,
        },
        {
          name: 'Trazioni negative',
          type: 'bodyweight',
          sets: 3,
          reps: '5-8',
          rest: 120,
        },
        {
          name: 'Trazioni con elastico',
          type: 'bodyweight',
          sets: 3,
          reps: '5-8',
          rest: 120,
        },
        {
          name: 'Trazioni complete',
          type: 'bodyweight',
          sets: 3,
          reps: '3-8',
          rest: 180,
        },
      ],
    },
    {
      id: 'squat',
      name: 'Squat',
      description: 'Progressione di squat',
      exercises: [
        {
          name: 'Squat assistito',
          type: 'bodyweight',
          sets: 3,
          reps: '10-15',
          rest: 60,
        },
        {
          name: 'Squat a corpo libero',
          type: 'bodyweight',
          sets: 3,
          reps: '10-15',
          rest: 90,
        },
        {
          name: 'Squat bulgaro',
          type: 'bodyweight',
          sets: 3,
          reps: '8-12 per gamba',
          rest: 90,
        },
        {
          name: 'Pistol squat',
          type: 'bodyweight',
          sets: 3,
          reps: '5-8 per gamba',
          rest: 120,
        },
      ],
    },
  ];
  // Stato per la skill selezionata
  const [selectedSkill, setSelectedSkill] = useState<string>('');

  // Hook per rilevare dispositivi mobili
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Imposta loaded a true dopo il caricamento iniziale
  useEffect(() => {
    setLoaded(true);
  }, []);

  // Funzione per generare un ID univoco
  const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  // Aggiunge un nuovo giorno di allenamento
  const addWorkoutDay = () => {
    const newDay = {
      id: generateId(),
      name: `Giorno ${workoutDays.length + 1}`,
      exercises: []
    };
    setWorkoutDays([...workoutDays, newDay]);
  };

  // Rimuove un giorno di allenamento
  const removeWorkoutDay = (dayId: string) => {
    setWorkoutDays(workoutDays.filter(day => day.id !== dayId));
  };

  // Carica gli esercizi dal workout corrente
  useEffect(() => {
    // Effetto per l'animazione di caricamento
    setLoaded(true);

    // Ottieni gli esercizi del workout corrente
    const currentExercises = getCurrentWorkoutExercises();

    // Se ci sono esercizi, crea un nuovo giorno e aggiungili
    if (currentExercises.length > 0) {
      const newDay = {
        id: generateId(),
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
      // Se non ci sono esercizi nel workout corrente e non ci sono giorni, aggiungi un giorno vuoto
      addWorkoutDay();
    }
  }, []);

  // Gestisce la modifica del nome di un giorno
  const handleDayNameChange = (dayId: string, newName: string) => {
    setWorkoutDays(workoutDays.map(day =>
      day.id === dayId ? { ...day, name: newName } : day
    ));
  };

  // Aggiunge un nuovo esercizio a un giorno
  const addExercise = (dayId: string) => {
    const newExercise = {
      id: generateId(),
      name: '',
      type: 'strength',
      sets: 3,
      reps: '10',
      duration: 0,
      distance: 0,
      rest: 60,
      notes: ''
    };

    setWorkoutDays(workoutDays.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          exercises: [...day.exercises, newExercise]
        };
      }
      return day;
    }));
  };

  // Rimuove un esercizio da un giorno
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

  // Gestisce i cambiamenti nei campi degli esercizi
  const handleExerciseChange = (dayId: string, exerciseId: string, field: string, value: any) => {
    setWorkoutDays(workoutDays.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          exercises: day.exercises.map(ex => {
            if (ex.id === exerciseId) {
              return {
                ...ex,
                [field]: value
              };
            }
            return ex;
          })
        };
      }
      return day;
    }));
  };

  // Genera una progressione basata sulla skill selezionata
  const generateSkillProgression = () => {
    if (!selectedSkill) {
      setSnackbarMessage('Seleziona una skill per generare una progressione');
      setSnackbarOpen(true);
      return;
    }

    // Trova la skill selezionata
    const skill = availableSkills.find(s => s.id === selectedSkill);
    if (!skill) return;

    // Determina quali esercizi includere in base al livello di abilità
    let exercisesToInclude = [];
    switch (skillLevel) {
      case 'principiante':
        // Per principianti, include solo i primi due esercizi della progressione
        exercisesToInclude = skill.exercises.slice(0, 2);
        break;
      case 'intermedio':
        // Per intermedi, include il secondo e il terzo esercizio
        exercisesToInclude = skill.exercises.slice(1, 3);
        break;
      case 'avanzato':
        // Per avanzati, include gli ultimi due esercizi
        exercisesToInclude = skill.exercises.slice(2, 4);
        break;
      default:
        exercisesToInclude = skill.exercises;
    }

    // Adatta i set e le ripetizioni in base all'obiettivo
    const adaptedExercises = exercisesToInclude.map(ex => {
      let adaptedEx = { ...ex, id: generateId() };
      
      switch (workoutGoal) {
        case 'forza':
          adaptedEx.sets = 5;
          adaptedEx.reps = '5';
          adaptedEx.rest = 180;
          break;
        case 'ipertrofia':
          adaptedEx.sets = 4;
          adaptedEx.reps = '8-12';
          adaptedEx.rest = 90;
          break;
        case 'dimagrimento':
          adaptedEx.sets = 3;
          adaptedEx.reps = '15-20';
          adaptedEx.rest = 60;
          break;
      }
      
      return adaptedEx;
    });

    // Crea un nuovo giorno con gli esercizi adattati
    const newDay = {
      id: generateId(),
      name: `${skill.name} - ${skillLevel.charAt(0).toUpperCase() + skillLevel.slice(1)}`,
      exercises: adaptedExercises.map(ex => ({
        id: ex.id || generateId(),
        name: ex.name,
        type: ex.type,
        sets: ex.sets,
        reps: ex.reps,
        duration: ex.duration || 0,
        distance: ex.distance || 0,
        rest: ex.rest,
        notes: ex.notes || ''
      }))
    };

    // Aggiunge il nuovo giorno alla scheda
    setWorkoutDays([...workoutDays, newDay]);
    
    // Mostra un messaggio di conferma
    setSnackbarMessage(`Progressione di ${skill.name} aggiunta con successo!`);
    setSnackbarOpen(true);
  };

  // Salva il programma di allenamento
  const saveProgram = () => {
    if (programDetails.name.trim() === '') {
      setSnackbarMessage('Inserisci un nome per il programma');
      setSnackbarOpen(true);
      return;
    }

    if (workoutDays.length === 0 || workoutDays.every(day => day.exercises.length === 0)) {
      setSnackbarMessage('Aggiungi almeno un esercizio al programma');
      setSnackbarOpen(true);
      return;
    }

    // Prepara il programma da salvare
    const programToSave = {
      id: generateId(),
      name: programDetails.name,
      description: programDetails.description,
      days: workoutDays.map(day => ({
        id: day.id,
        name: day.name,
        exercises: day.exercises.map(ex => ({
          id: ex.id,
          name: ex.name,
          type: ex.type,
          sets: ex.sets,
          reps: ex.reps,
          duration: ex.duration,
          distance: ex.distance,
          rest: ex.rest,
          notes: ex.notes
        }))
      })),
      // Aggiungi i campi mancanti richiesti dall'interfaccia WorkoutProgram
      phases: 1,
      duration: workoutDays.length,
      difficulty: skillLevel === 'principiante' ? 'easy' : skillLevel === 'intermedio' ? 'medium' : 'hard',
      category: workoutGoal,
      author: 'user',
      createdAt: new Date().toISOString()
    };

    // Salva il programma nel database
    const savedProgramId = saveWorkoutProgram(programToSave as any);
    console.log('Programma salvato con ID:', savedProgramId);

    // Mostra un messaggio di conferma
    setSnackbarMessage('Workout salvato con successo!');
    setSnackbarOpen(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5, px: { xs: 2, sm: 3, md: 4 } }}>
      <Fade in={loaded} timeout={800}>
        <Box sx={{ width: '100%' }}>
          {/* Header */}
          <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              Workout Builder
            </Typography>

            {/* Pulsante Indietro se onBack è definito */}
            {onBack && (
              <Button
                variant="outlined"
                onClick={onBack}
                sx={{ borderRadius: 2 }}
              >
                Indietro
              </Button>
            )}
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: 2, mb: 4 }}>
                <Typography variant="h5" component="h1" gutterBottom>
                  Crea il tuo workout
                </Typography>

                {/* Form per i dettagli del programma */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nome del programma"
                      value={programDetails.name}
                      onChange={(e) => setProgramDetails({ ...programDetails, name: e.target.value })}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Descrizione del programma"
                      value={programDetails.description}
                      onChange={(e) => setProgramDetails({ ...programDetails, description: e.target.value })}
                      multiline
                      rows={2}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: 'background.paper',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                  mb: 4
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h6" fontWeight="600" color="primary.main">
                    Giorni di Allenamento
                  </Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />
                
                {workoutDays.length === 0 ? (
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    py: 6,
                    textAlign: 'center'
                  }}>
                    <DirectionsRun sx={{ fontSize: 60, color: 'primary.light', opacity: 0.7, mb: 2 }} />
                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                      Nessun giorno di allenamento aggiunto.
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      onClick={addWorkoutDay}
                      startIcon={<Add />}
                      sx={{
                        borderRadius: 8,
                        px: 4,
                        py: 1.5,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                        textTransform: 'none',
                        fontSize: '1.1rem',
                        fontWeight: 500,
                        minWidth: '200px',
                      }}
                    >
                      Aggiungi Giorno
                    </Button>
                  </Box>
                ) : (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="medium"
                        onClick={addWorkoutDay}
                        startIcon={<Add />}
                        sx={{
                          borderRadius: 8,
                          px: 3,
                          py: 1,
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                          textTransform: 'none',
                          fontSize: '1rem',
                          fontWeight: 500,
                          mr: 2
                        }}
                      >
                        Aggiungi Giorno
                      </Button>
                    </Box>
                    
                    {workoutDays.map((day, index) => (
                      <Card 
                        key={day.id} 
                        variant="outlined" 
                        sx={{ 
                          mb: 3, 
                          borderRadius: 3,
                          borderColor: 'transparent',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                          overflow: 'visible',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
                          }
                        }}
                      >
                        <CardContent sx={{ pb: 2 }}>
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <TextField
                              label={`Giorno ${index + 1}`}
                              value={day.name}
                              onChange={(e) => handleDayNameChange(day.id, e.target.value)}
                              variant="outlined"
                              size="small"
                              sx={{ 
                                width: isMobile ? '100%' : '50%',
                                mb: isMobile ? 2 : 0,
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2
                                }
                              }}
                            />
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                startIcon={<Add />}
                                onClick={() => addExercise(day.id)}
                                sx={{
                                  borderRadius: 6,
                                  textTransform: 'none',
                                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                }}
                              >
                                {isMobile ? "Esercizio" : "Aggiungi Esercizio"}
                              </Button>
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => removeWorkoutDay(day.id)}
                                sx={{ 
                                  ml: 1,
                                  bgcolor: 'error.lighter',
                                  '&:hover': { bgcolor: 'error.light' } 
                                }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Box>
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
                                  borderRadius: 2,
                                  position: 'relative',
                                  transition: 'all 0.2s ease',
                                  '&:hover': {
                                    borderColor: theme.palette.primary.light,
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                                  }
                                }}
                              >
                                <IconButton 
                                  size="small" 
                                  sx={{ 
                                    position: 'absolute', 
                                    top: 8, 
                                    right: 8,
                                    bgcolor: 'error.lighter',
                                    '&:hover': { bgcolor: 'error.light' }
                                  }}
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
                                        sx={{
                                          '& .MuiOutlinedInput-root': {
                                            borderRadius: 2
                                          }
                                        }}
                                      />
                                      <FormControl sx={{ minWidth: 150 }} size="small">
                                        <InputLabel>Tipo</InputLabel>
                                        <Select
                                          value={exercise.type}
                                          label="Tipo"
                                          onChange={(e) => handleExerciseChange(day.id, exercise.id, 'type', e.target.value)}
                                          sx={{
                                            borderRadius: 2
                                          }}
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
                                          sx={{
                                            '& .MuiOutlinedInput-root': {
                                              borderRadius: 2
                                            }
                                          }}
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
                                          sx={{
                                            '& .MuiOutlinedInput-root': {
                                              borderRadius: 2
                                            }
                                          }}
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
                                          sx={{
                                            '& .MuiOutlinedInput-root': {
                                              borderRadius: 2
                                            }
                                          }}
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
                                          sx={{
                                            '& .MuiOutlinedInput-root': {
                                              borderRadius: 2
                                            }
                                          }}
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
                                          sx={{
                                            '& .MuiOutlinedInput-root': {
                                              borderRadius: 2
                                            }
                                          }}
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
                                      sx={{
                                        '& .MuiOutlinedInput-root': {
                                          borderRadius: 2
                                        }
                                      }}
                                    />
                                  </Grid>
                                </Grid>
                              </Box>
                            ))
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </>
                )}
              </Paper>

              {/* Selettore per il metodo di creazione della scheda */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <ToggleButtonGroup
                  exclusive
                  value={creationMethod}
                  onChange={(_, newMethod) => newMethod && setCreationMethod(newMethod)}
                  sx={{
                    '& .MuiToggleButtonGroup-grouped': {
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      '&.Mui-selected': {
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                      }
                    }
                  }}
                >
                  <ToggleButton value="manual">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <FitnessCenterOutlined sx={{ mr: 1 }} />
                      Manuale
                    </Box>
                  </ToggleButton>
                  <ToggleButton value="skill">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SportsGymnastics sx={{ mr: 1 }} />
                      Basato su Skill
                    </Box>
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {/* Selettore per il livello di skill */}
              {creationMethod === 'skill' && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                  <ToggleButtonGroup
                    exclusive
                    value={skillLevel}
                    onChange={(_, newLevel) => newLevel && setSkillLevel(newLevel)}
                    sx={{
                      '& .MuiToggleButtonGroup-grouped': {
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        '&.Mui-selected': {
                          backgroundColor: theme.palette.primary.main,
                          color: theme.palette.primary.contrastText,
                        }
                      }
                    }}
                  >
                    <ToggleButton value="principiante">
                      Principiante
                    </ToggleButton>
                    <ToggleButton value="intermedio">
                      Intermedio
                    </ToggleButton>
                    <ToggleButton value="avanzato">
                      Avanzato
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              )}

              {/* Selettore per l'obiettivo dell'allenamento */}
              {creationMethod === 'skill' && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                  <ToggleButtonGroup
                    exclusive
                    value={workoutGoal}
                    onChange={(_, newGoal) => newGoal && setWorkoutGoal(newGoal)}
                    sx={{
                      '& .MuiToggleButtonGroup-grouped': {
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        '&.Mui-selected': {
                          backgroundColor: theme.palette.primary.main,
                          color: theme.palette.primary.contrastText,
                        }
                      }
                    }}
                  >
                    <ToggleButton value="forza">
                      Forza
                    </ToggleButton>
                    <ToggleButton value="ipertrofia">
                      Ipertrofia
                    </ToggleButton>
                    <ToggleButton value="dimagrimento">
                      Dimagrimento
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              )}

              {/* Selettore per le skill */}
              {creationMethod === 'skill' && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                  <ToggleButtonGroup
                    exclusive
                    value={selectedSkill}
                    onChange={(_, newSkill) => setSelectedSkill(newSkill)}
                    sx={{
                      '& .MuiToggleButtonGroup-grouped': {
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        '&.Mui-selected': {
                          backgroundColor: theme.palette.primary.main,
                          color: theme.palette.primary.contrastText,
                        }
                      }
                    }}
                  >
                    {availableSkills.map(skill => (
                      <ToggleButton key={skill.id} value={skill.id}>
                        {skill.name}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </Box>
              )}

              {/* Pulsante per generare la progressione */}
              {creationMethod === 'skill' && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={generateSkillProgression}
                    size="large"
                    startIcon={<SportsGymnastics />}
                    sx={{
                      borderRadius: 28,
                      px: 4,
                      py: 1.5,
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      fontWeight: 500,
                    }}
                  >
                    Genera Progressione
                  </Button>
                </Box>
              )}

              {/* Pulsante salva scheda */}
              <Box display="flex" justifyContent="center" mt={4}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={saveProgram}
                  size="large"
                  startIcon={<Save />}
                  sx={{
                    borderRadius: 28,
                    px: 4,
                    py: 1.5,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 500,
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
