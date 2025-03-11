import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Divider,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  SelectChangeEvent
} from '@mui/material';
import { FitnessCenter, DirectionsRun, AccessTime, Cancel, Save } from '@mui/icons-material';
import { WorkoutProgress } from '../../services/workoutStorageService';

interface WorkoutExercise {
  id: string;
  name: string;
  type: string;
  sets?: number;
  reps?: string;
  duration?: number;
  distance?: number;
  rest?: number;
  notes: string;
}

interface WorkoutDay {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
}

interface WorkoutProgram {
  id: string;
  name: string;
  days: WorkoutDay[];
}

interface WorkoutLogFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (progress: WorkoutProgress) => void;
  programs: WorkoutProgram[];
}

const getCurrentDate = (): string => {
  const now = new Date();
  return now.toISOString().split('T')[0]; // formato YYYY-MM-DD
};

const WorkoutLogForm = ({ open, onClose, onSave, programs }: WorkoutLogFormProps) => {
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [exerciseProgress, setExerciseProgress] = useState<Record<string, {
    actualSets?: number;
    actualReps?: string;
    actualWeight?: number;
    actualDuration?: number;
    actualDistance?: number;
    notes?: string;
  }>>({});

  // Funzione per aggiornare il progresso degli esercizi
  const handleExerciseProgressChange = (exerciseId: string, field: keyof typeof exerciseProgress[string], value: any) => {
    setExerciseProgress(prev => {
      const updatedProgress = { ...prev };
      if (!updatedProgress[exerciseId]) {
        updatedProgress[exerciseId] = {};
      }
      updatedProgress[exerciseId][field] = value;
      return updatedProgress;
    });
  };

  const updateExerciseProgress = handleExerciseProgressChange;

  const handleProgramChange = (event: SelectChangeEvent) => {
    const programId = event.target.value;
    setSelectedProgram(programId);
    setSelectedDay('');
    setExerciseProgress({});
  };

  const handleDayChange = (event: SelectChangeEvent) => {
    const dayId = event.target.value;
    setSelectedDay(dayId);
    setExerciseProgress({});
  };

  const handleSave = () => {
    const program = programs.find(p => p.id === selectedProgram);
    const day = program?.days.find(d => d.id === selectedDay);
    
    if (!program || !day) return;
    
    const progress: WorkoutProgress = {
      date: selectedDate,
      programId: selectedProgram,
      dayId: selectedDay,
      completed: true,
      exercises: day.exercises.map(exercise => {
        // Filtriamo valori undefined o vuoti
        const exerciseData = exerciseProgress[exercise.id] || {};
        return {
          id: exercise.id,
          name: exercise.name,
          actualSets: exerciseData.actualSets || undefined,
          actualReps: exerciseData.actualReps || undefined,
          actualWeight: exerciseData.actualWeight || undefined,
          actualDuration: exerciseData.actualDuration || undefined,
          actualDistance: exerciseData.actualDistance || undefined,
          notes: exerciseData.notes || undefined
        };
      }).filter(e => {
        // Manteniamo solo esercizi con almeno un valore compilato
        return e.actualSets || e.actualReps || e.actualWeight || e.actualDuration || e.actualDistance || e.notes;
      })
    };
    
    // Verifica che ci sia almeno un esercizio con dati
    if (progress.exercises.length === 0) {
      alert('Inserisci almeno un dato di esercizio prima di salvare');
      return;
    }
    
    onSave(progress);
    onClose();
  };

  const getSelectedProgram = () => programs.find(p => p.id === selectedProgram);
  const getSelectedDay = () => {
    const program = getSelectedProgram();
    return program?.days.find(d => d.id === selectedDay);
  };

  const getExerciseIcon = (type: string) => {
    switch (type) {
      case 'cardio':
        return <DirectionsRun color="primary" />;
      case 'strength':
      case 'bodyweight':
        return <FitnessCenter color="secondary" />;
      default:
        return <AccessTime />;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ 
        backgroundColor: theme => theme.palette.primary.main, 
        color: 'white',
        py: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <FitnessCenter />
        Registra Allenamento Completato
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Sezione Principale */}
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h6" color="primary" gutterBottom>
                Informazioni Generali
              </Typography>
              <TextField
                label="Data"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                fullWidth
                margin="normal"
                required
                InputLabelProps={{ shrink: true }}
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel id="program-label">Programma</InputLabel>
                <Select
                  labelId="program-label"
                  value={selectedProgram}
                  onChange={handleProgramChange}
                  label="Programma"
                >
                  <MenuItem value=""><em>Seleziona un programma</em></MenuItem>
                  {programs.map((program) => (
                    <MenuItem key={program.id} value={program.id}>
                      {program.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal" required disabled={!selectedProgram}>
                <InputLabel id="day-label">Giorno</InputLabel>
                <Select
                  labelId="day-label"
                  value={selectedDay}
                  onChange={handleDayChange}
                  label="Giorno"
                >
                  <MenuItem value=""><em>Seleziona un giorno</em></MenuItem>
                  {getSelectedProgram()?.days.map((day) => (
                    <MenuItem key={day.id} value={day.id}>
                      {day.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Paper>
          </Grid>

          {/* Lista degli esercizi */}
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" color="primary" gutterBottom>
                Esercizi Completati
              </Typography>
              {!selectedDay ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                  <Typography variant="body1" color="text.secondary">
                    Seleziona un programma e un giorno per visualizzare gli esercizi
                  </Typography>
                </Box>
              ) : (
                <>
                  {getSelectedDay()?.exercises.length === 0 ? (
                    <Typography variant="body1" color="text.secondary" sx={{ p: 2 }}>
                      Nessun esercizio trovato per questo giorno
                    </Typography>
                  ) : (
                    <List sx={{ 
                      maxHeight: '400px', 
                      overflow: 'auto',
                      borderRadius: 1,
                      backgroundColor: theme => theme.palette.grey[50],
                      mt: 2
                    }}>
                      {getSelectedDay()?.exercises.map((exercise, index) => (
                        <React.Fragment key={exercise.id}>
                          {index > 0 && <Divider />}
                          <ListItem 
                            alignItems="flex-start" 
                            sx={{ 
                              p: 2,
                              transition: 'all 0.2s',
                              '&:hover': {
                                backgroundColor: theme => theme.palette.grey[100],
                              }
                            }}
                          >
                            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                <ListItemIcon sx={{ minWidth: '32px' }}>
                                  {getExerciseIcon(exercise.type)}
                                </ListItemIcon>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  {exercise.name}
                                </Typography>
                              </Box>

                              <Grid container spacing={2} alignItems="center">
                                {(exercise.type === 'strength' || exercise.type === 'bodyweight') && (
                                  <>
                                    <Grid item xs={12} sm={4}>
                                      <TextField
                                        label="Serie"
                                        type="number"
                                        value={exerciseProgress[exercise.id]?.actualSets || ''}
                                        onChange={(e) => updateExerciseProgress(exercise.id, 'actualSets', parseInt(e.target.value))}
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        InputProps={{ inputProps: { min: 0 } }}
                                      />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                      <TextField
                                        label="Ripetizioni"
                                        value={exerciseProgress[exercise.id]?.actualReps || ''}
                                        onChange={(e) => updateExerciseProgress(exercise.id, 'actualReps', e.target.value)}
                                        placeholder="Es: 8-10-12"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                      />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                      <TextField
                                        label="Peso (kg)"
                                        type="number"
                                        value={exerciseProgress[exercise.id]?.actualWeight || ''}
                                        onChange={(e) => updateExerciseProgress(exercise.id, 'actualWeight', parseFloat(e.target.value))}
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        InputProps={{ inputProps: { min: 0, step: 0.5 } }}
                                      />
                                    </Grid>
                                  </>
                                )}  

                                {exercise.type === 'cardio' && (
                                  <>
                                    <Grid item xs={12} sm={6}>
                                      <TextField
                                        label="Durata (minuti)"
                                        type="number"
                                        value={exerciseProgress[exercise.id]?.actualDuration || ''}
                                        onChange={(e) => updateExerciseProgress(exercise.id, 'actualDuration', parseInt(e.target.value))}
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        InputProps={{ inputProps: { min: 0 } }}
                                      />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                      <TextField
                                        label="Distanza (km)"
                                        type="number"
                                        value={exerciseProgress[exercise.id]?.actualDistance || ''}
                                        onChange={(e) => updateExerciseProgress(exercise.id, 'actualDistance', parseFloat(e.target.value))}
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        InputProps={{ inputProps: { min: 0, step: 0.1 } }}
                                      />
                                    </Grid>
                                  </>
                                )}

                                <Grid item xs={12}>
                                  <TextField
                                    label="Note"
                                    value={exerciseProgress[exercise.id]?.notes || ''}
                                    onChange={(e) => updateExerciseProgress(exercise.id, 'notes', e.target.value)}
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    multiline
                                    rows={2}
                                    placeholder="Inserisci eventuali note su questo esercizio..."
                                  />
                                </Grid>
                              </Grid>
                            </Box>
                          </ListItem>
                        </React.Fragment>
                      ))}
                    </List>
                  )}
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit" startIcon={<Cancel />}>
          Annulla
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          color="primary" 
          startIcon={<Save />}
          disabled={!selectedProgram || !selectedDay}
        >
          Salva Allenamento
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WorkoutLogForm;
