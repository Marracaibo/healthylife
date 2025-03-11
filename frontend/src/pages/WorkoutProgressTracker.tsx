import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Divider,
  Card,
  CardContent,
  Box,
  CircularProgress,
  LinearProgress,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Fab,
  Tooltip
} from '@mui/material';
import { FitnessCenter, TrendingUp, EmojiEvents, Add, DirectionsRun, AccessTime, CalendarToday } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { 
  getTotalWorkoutsCompleted, 
  getConsecutiveWorkoutDays, 
  getRecentWorkouts,
  getWorkoutPrograms,
  saveWorkoutProgress,
  WorkoutProgress
} from '../services/workoutStorageService';
import { WorkoutProgram } from '../types/workout';
import WorkoutLogForm from '../components/workout/WorkoutLogForm';

const WorkoutProgressTracker: React.FC = () => {
  const theme = useTheme();
  const [workoutStats, setWorkoutStats] = useState({
    totalWorkouts: 0,
    consecutiveDays: 0,
  });
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutProgress[]>([]);
  const [programs, setPrograms] = useState<WorkoutProgram[]>([]);
  const [logFormOpen, setLogFormOpen] = useState(false);

  // Carica i dati all'inizializzazione
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Carica statistiche
    const totalWorkouts = getTotalWorkoutsCompleted();
    const consecutiveDays = getConsecutiveWorkoutDays();
    
    setWorkoutStats({
      totalWorkouts,
      consecutiveDays,
    });

    // Carica allenamenti recenti
    setRecentWorkouts(getRecentWorkouts(5));

    // Carica programmi di allenamento
    setPrograms(getWorkoutPrograms());
  };

  const handleSaveProgress = (progress: WorkoutProgress) => {
    saveWorkoutProgress(progress);
    loadData(); // Ricarica i dati dopo il salvataggio
  };

  // Funzione per formattare la data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getExerciseIcon = (type?: string) => {
    switch (type) {
      case 'cardio':
        return <DirectionsRun color="primary" />;
      case 'strength':
        return <FitnessCenter color="secondary" />;
      default:
        return <AccessTime />;
    }
  };

  // Adatta i programmi al formato atteso dal form
  const adaptWorkoutPrograms = (programs: WorkoutProgram[]) => {
    // Creiamo una versione semplificata compatibile con WorkoutLogForm
    return programs.map(program => {
      // Estraiamo i giorni da tutte le fasi e settimane del programma
      const days = program.phases.flatMap(phase => 
        phase.weeks.flatMap(week => 
          week.days.map(day => ({
            id: day.id,
            name: day.name,
            exercises: day.exercises.map(exercise => {
              // Converte il rest da string a number se necessario
              let restValue: number | undefined = undefined;
              if (exercise.rest) {
                // Rimuovi eventuali indicazioni di tempo (es. "60s" -> 60)
                const numericRest = parseInt(exercise.rest.replace(/[^0-9]/g, ''));
                if (!isNaN(numericRest)) {
                  restValue = numericRest;
                }
              }
              
              return {
                id: exercise.id,
                name: exercise.name,
                type: exercise.type || 'strength',
                sets: exercise.sets,
                reps: exercise.reps,
                rest: restValue,
                notes: exercise.notes || ''
              };
            })
          }))
        )
      );

      return {
        id: program.id,
        name: program.name,
        days
      };
    });
  };

  const getProgramName = (programId: string) => {
    const program = programs.find(p => p.id === programId);
    return program ? program.name : 'Allenamento';
  };

  const getDayName = (programId: string, dayId: string) => {
    const program = programs.find(p => p.id === programId);
    if (!program) return 'Giorno di allenamento';
    
    // Cerca il giorno in tutte le fasi e settimane
    for (const phase of program.phases) {
      for (const week of phase.weeks) {
        const day = week.days.find(d => d.id === dayId);
        if (day) return day.name;
      }
    }
    
    return 'Giorno di allenamento';
  };

  // Determina un tipo approssimativo per l'allenamento basato sugli esercizi
  const getWorkoutType = (workout: WorkoutProgress) => {
    // Se non ci sono esercizi, ritorna un tipo generico
    if (!workout.exercises || workout.exercises.length === 0) {
      return 'strength';
    }
    
    // Conta quanti esercizi sono cardio vs forza
    const cardioCount = workout.exercises.filter(e => e.actualDuration || e.actualDistance).length;
    const strengthCount = workout.exercises.filter(e => e.actualSets || e.actualReps).length;
    
    if (cardioCount > strengthCount) return 'cardio';
    return 'strength';
  };

  const getWorkoutNotes = (workout: WorkoutProgress) => {
    if (!workout.exercises) return '';
    
    // Combina tutte le note degli esercizi
    return workout.exercises
      .filter(e => e.notes && e.notes.trim() !== '')
      .map(e => `${e.name}: ${e.notes}`)
      .join('; ');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
        <FitnessCenter sx={{ mr: 1, verticalAlign: 'middle' }} />
        Tracciamento Progressi Allenamento
      </Typography>
      
      <Grid container spacing={3}>
        {/* Statistiche di riepilogo */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Le tue statistiche
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
                  <CardContent>
                    <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                      <CircularProgress 
                        variant="determinate" 
                        value={100} 
                        size={80} 
                        thickness={5}
                        sx={{ color: theme.palette.success.main }}
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="h4" color="text.secondary">
                          {workoutStats.totalWorkouts}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="h6" align="center">
                      Allenamenti Completati
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
                  <CardContent>
                    <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                      <CircularProgress 
                        variant="determinate" 
                        value={workoutStats.consecutiveDays > 0 ? 100 : 0} 
                        size={80} 
                        thickness={5}
                        sx={{ color: theme.palette.info.main }}
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="h4" color="text.secondary">
                          {workoutStats.consecutiveDays}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="h6" align="center">
                      Giorni Consecutivi
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
                  <CardContent>
                    <EmojiEvents sx={{ fontSize: 80, color: theme.palette.warning.main, mb: 2 }} />
                    <Typography variant="h6" align="center">
                      {workoutStats.consecutiveDays >= 7 ? 'Streak settimanale!' : 'Prossimo obiettivo'}
                    </Typography>
                    {workoutStats.consecutiveDays < 7 && (
                      <Box sx={{ width: '100%', mt: 2 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={(workoutStats.consecutiveDays / 7) * 100} 
                          sx={{ height: 10, borderRadius: 5 }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {workoutStats.consecutiveDays}/7 giorni per completare una settimana
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Allenamenti recenti */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                <TrendingUp sx={{ mr: 1, verticalAlign: 'middle', fontSize: '1.2rem' }} />
                I tuoi progressi recenti
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<Add />}
                onClick={() => setLogFormOpen(true)}
              >
                Registra Workout
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {recentWorkouts.length === 0 ? (
              <Typography variant="body1">
                Non hai ancora registrato allenamenti. Quando completerai i tuoi workout, vedrai qui i tuoi progressi!
              </Typography>
            ) : (
              <List>
                {recentWorkouts.map((workout, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <Divider component="li" />}
                    <ListItem alignItems="flex-start">
                      <ListItemIcon>
                        {getExerciseIcon(getWorkoutType(workout))}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1">
                              {getProgramName(workout.programId) || 'Allenamento'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <CalendarToday sx={{ fontSize: '0.8rem', mr: 0.5, verticalAlign: 'middle' }} />
                              {formatDate(workout.date)}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {getDayName(workout.programId, workout.dayId) || 'Giorno di allenamento'}
                            </Typography>
                            {getWorkoutNotes(workout) && (
                              <Typography variant="body2" color="text.secondary">
                                Note: {getWorkoutNotes(workout)}
                              </Typography>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Form per registrare un nuovo workout */}
      <WorkoutLogForm 
        open={logFormOpen} 
        onClose={() => setLogFormOpen(false)}
        onSave={handleSaveProgress}
        programs={adaptWorkoutPrograms(programs)}
      />

      {/* Floating Action Button per aggiungere rapidamente un workout */}
      <Tooltip title="Registra nuovo allenamento">
        <Fab 
          color="primary" 
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => setLogFormOpen(true)}
        >
          <Add />
        </Fab>
      </Tooltip>
    </Container>
  );
};

export default WorkoutProgressTracker;
