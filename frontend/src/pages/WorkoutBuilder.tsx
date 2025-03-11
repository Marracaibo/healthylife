import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Card,
  CardContent,
  Grid,
  Fade,
  Slide,
  alpha,
  Snackbar,
  Alert
} from '@mui/material';
import { FitnessCenter, Add, Delete, Refresh } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { saveWorkoutProgram } from '../services/workoutStorageService';
import { getCurrentWorkoutExercises, resetCurrentWorkout } from '../services/currentWorkoutService';

const WorkoutBuilder: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
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
    navigate('/skills-library');
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
              Workout Builder
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
              Crea la tua scheda di allenamento personalizzata
            </Typography>
          </Box>

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
                  bgcolor: alpha(theme.palette.primary.main, 0.9),
                  borderRadius: 0,
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  }
                }}
                onClick={() => navigate('/workout-programs')}
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
                onClick={() => navigate('/skills-progression')}
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
                  bgcolor: 'primary.main',
                  borderRadius: 0,
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  }
                }}
                onClick={() => {}} // Già nella pagina corrente
              >
                Workout Builder
              </Button>
            </Paper>
          </Box>

          <Slide direction="up" in={loaded} timeout={1000} mountOnEnter unmountOnExit>
            <Container maxWidth="lg" sx={{ py: 4 }}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  mb: 4, 
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                  color: 'white',
                  border: '1px solid',
                  borderColor: theme.palette.primary.light
                }}
              >
                <Box display="flex" alignItems="center" mb={2}>
                  <FitnessCenter sx={{ mr: 2, fontSize: 32 }} />
                  <Typography variant="h5" component="h1" fontWeight="500">
                    Crea la Tua Scheda di Allenamento
                  </Typography>
                </Box>
                <Typography variant="body2">
                  Inserisci manualmente gli esercizi, serie e ripetizioni per costruire la tua scheda personalizzata.
                </Typography>
              </Paper>

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
                <Typography variant="h6" gutterBottom fontWeight="500" color="primary">
                  Dettagli della Scheda
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nome della scheda"
                      variant="outlined"
                      value={programDetails.name}
                      onChange={(e) => setProgramDetails({...programDetails, name: e.target.value})}
                      margin="normal"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal" size="small">
                      <InputLabel>Difficoltà</InputLabel>
                      <Select
                        value={programDetails.difficulty}
                        label="Difficoltà"
                        onChange={(e) => setProgramDetails({...programDetails, difficulty: e.target.value as 'beginner' | 'intermediate' | 'advanced'})}
                      >
                        <MenuItem value="beginner">Principiante</MenuItem>
                        <MenuItem value="intermediate">Intermedio</MenuItem>
                        <MenuItem value="advanced">Avanzato</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Descrizione"
                      variant="outlined"
                      value={programDetails.description}
                      onChange={(e) => setProgramDetails({...programDetails, description: e.target.value})}
                      margin="normal"
                      multiline
                      rows={2}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Categoria"
                      variant="outlined"
                      value={programDetails.category}
                      onChange={(e) => setProgramDetails({...programDetails, category: e.target.value})}
                      margin="normal"
                      placeholder="Es: Forza, Ipertrofia, Definizione..."
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Durata (settimane)"
                      variant="outlined"
                      type="number"
                      value={programDetails.duration}
                      onChange={(e) => setProgramDetails({...programDetails, duration: parseInt(e.target.value) || 0})}
                      margin="normal"
                      InputProps={{ inputProps: { min: 1, max: 52 } }}
                      size="small"
                    />
                  </Grid>
                </Grid>
              </Paper>

              {/* Sezione per aggiungere giorni di allenamento */}
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
            </Container>
          </Slide>
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
