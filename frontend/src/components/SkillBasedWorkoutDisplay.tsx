import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Grid,
  useTheme
} from '@mui/material';
import { Fitness, FitnessCenter, AccessibilityNew, DirectionsRun } from '@mui/icons-material';
import { WorkoutProgram } from '../types/workout';

interface SkillBasedWorkoutDisplayProps {
  workoutProgram: WorkoutProgram | null;
  selectedDate?: Date;
}

const SkillBasedWorkoutDisplay: React.FC<SkillBasedWorkoutDisplayProps> = ({ 
  workoutProgram, 
  selectedDate = new Date() 
}) => {
  const theme = useTheme();
  
  if (!workoutProgram) {
    return (
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mt: 2 }}>
        <Typography variant="subtitle1" color="text.secondary" align="center">
          Seleziona delle skill e genera un programma di allenamento per visualizzarlo qui
        </Typography>
      </Paper>
    );
  }

  // Funzione per formattare una data
  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    return date.toLocaleDateString('it-IT', options);
  };

  // Genera un array di date per il periodo del programma
  const generateDates = (startDate: Date, numberOfDays: number): Date[] => {
    const dates: Date[] = [];
    for (let i = 0; i < numberOfDays; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // Genera le date a partire dalla data selezionata
  const programDates = generateDates(selectedDate, workoutProgram.phases[0].days.length);

  // Ottieni l'icona appropriata per il tipo di esercizio
  const getExerciseIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'forza':
        return <FitnessCenter fontSize="small" />;
      case 'cardio':
        return <DirectionsRun fontSize="small" />;
      case 'mobilità':
        return <AccessibilityNew fontSize="small" />;
      default:
        return <Fitness fontSize="small" />;
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
          {workoutProgram.name}
        </Typography>
        
        <Typography variant="body1" paragraph>
          {workoutProgram.description}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip 
            label={`Difficoltà: ${workoutProgram.difficulty}`} 
            color="primary" 
            variant="outlined" 
            size="small"
          />
          <Chip 
            label={`Durata: ${workoutProgram.duration} settimane`} 
            color="primary" 
            variant="outlined" 
            size="small"
          />
          {workoutProgram.targetAreas && workoutProgram.targetAreas.map((area, index) => (
            <Chip 
              key={index}
              label={area}
              color="primary"
              variant="outlined"
              size="small"
            />
          ))}
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Calendario Allenamenti
        </Typography>
        
        {programDates.map((date, dateIndex) => {
          const dayWorkout = workoutProgram.phases[0].days[dateIndex];
          
          // Se il giorno non ha esercizi, mostra un messaggio di riposo
          if (!dayWorkout || !dayWorkout.exercises || dayWorkout.exercises.length === 0) {
            return (
              <Paper 
                key={dateIndex} 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  mb: 2, 
                  backgroundColor: theme.palette.grey[50],
                  borderRadius: 1
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {formatDate(date)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Giorno di riposo
                </Typography>
              </Paper>
            );
          }
          
          return (
            <Paper 
              key={dateIndex} 
              elevation={1} 
              sx={{ 
                p: 2, 
                mb: 2, 
                borderRadius: 1,
                borderLeft: `4px solid ${theme.palette.primary.main}`
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {formatDate(date)}
              </Typography>
              <Typography variant="h6" color="primary" gutterBottom>
                {dayWorkout.name}
              </Typography>
              
              <List sx={{ width: '100%' }}>
                {dayWorkout.exercises.map((exercise, exerciseIndex) => (
                  <React.Fragment key={exerciseIndex}>
                    {exerciseIndex > 0 && <Divider component="li" />}
                    <ListItem alignItems="flex-start" sx={{ py: 1 }}>
                      <ListItemText
                        primary={
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item>
                              {getExerciseIcon(exercise.type || 'forza')}
                            </Grid>
                            <Grid item xs>
                              <Typography variant="subtitle2">
                                {exercise.name}
                              </Typography>
                            </Grid>
                          </Grid>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Chip
                              label={`${exercise.sets} series × ${exercise.reps}`}
                              size="small"
                              sx={{ mr: 1, mb: 1 }}
                            />
                            <Chip
                              label={`Riposo: ${exercise.rest}s`}
                              size="small"
                              sx={{ mr: 1, mb: 1 }}
                            />
                            {exercise.notes && (
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {exercise.notes}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          );
        })}
      </Paper>
    </Box>
  );
};

export default SkillBasedWorkoutDisplay;
