import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import { FitnessCenter, Today } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

interface WorkoutDay {
  id: string;
  name: string;
  exercises: {
    id: string;
    name: string;
    type: string;
    sets?: number;
    reps?: string;
    duration?: number;
    distance?: number;
    rest?: number;
    notes: string;
  }[];
}

interface WorkoutProgram {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  category: string;
  duration: number;
  days: WorkoutDay[];
}

// Mock data di programmi salvati
const savedPrograms: WorkoutProgram[] = [
  {
    id: 'program-1',
    name: 'Programma Misto Cardio e Forza',
    description: 'Un programma di allenamento che combina esercizi cardio e forza per un fitness completo',
    difficulty: 'intermediate',
    category: 'Total Body',
    duration: 4,
    days: [
      {
        id: 'day-1',
        name: 'Giorno 1 - Corsa e Parte Superiore',
        exercises: [
          {
            id: 'ex-1',
            name: 'Corsa all\'aperto',
            type: 'cardio',
            duration: 30,
            distance: 5,
            notes: 'Intensità media'
          },
          {
            id: 'ex-2',
            name: 'Panca piana',
            type: 'strength',
            sets: 3,
            reps: '8-10',
            rest: 90,
            notes: 'Carico moderato'
          },
          {
            id: 'ex-3',
            name: 'Pull-up',
            type: 'bodyweight',
            sets: 3,
            reps: '6-8',
            rest: 120,
            notes: 'Utilizzare elastic band se necessario'
          }
        ]
      },
      {
        id: 'day-2',
        name: 'Giorno 2 - Corpo Libero',
        exercises: [
          {
            id: 'ex-4',
            name: 'Push-up',
            type: 'bodyweight',
            sets: 4,
            reps: '12-15',
            rest: 60,
            notes: 'Variare la larghezza delle mani'
          },
          {
            id: 'ex-5',
            name: 'Squat',
            type: 'bodyweight',
            sets: 4,
            reps: '15-20',
            rest: 60,
            notes: 'Mantenere la schiena dritta'
          },
          {
            id: 'ex-6',
            name: 'Plank',
            type: 'bodyweight',
            sets: 3,
            reps: '30-60 sec',
            rest: 45,
            notes: 'Mantenere la posizione corretta'
          }
        ]
      }
    ]
  }
];

// Funzione per ottenere una data formattata per un giorno specifico a partire da oggi
const getDateForDayOffset = (dayOffset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  return date.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' });
};

const WorkoutCalendar: React.FC = () => {
  const theme = useTheme();
  const [programs] = useState<WorkoutProgram[]>(savedPrograms);
  const [selectedProgram, setSelectedProgram] = useState<WorkoutProgram | null>(null);
  const [calendarView, setCalendarView] = useState<{ [key: string]: WorkoutDay | null }>({});
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [dayToSchedule, setDayToSchedule] = useState<string>('');

  // Inizializza il calendario per i prossimi 7 giorni
  useEffect(() => {
    const initialCalendar: { [key: string]: WorkoutDay | null } = {};
    for (let i = 0; i < 7; i++) {
      initialCalendar[i.toString()] = null;
    }
    setCalendarView(initialCalendar);
  }, []);

  const handleProgramSelect = (program: WorkoutProgram) => {
    setSelectedProgram(program);
  };

  const openScheduleDialog = (dayIndex: string) => {
    setDayToSchedule(dayIndex);
    setDialogOpen(true);
  };

  const scheduleWorkoutDay = (day: WorkoutDay | null) => {
    setCalendarView(prevCalendar => ({
      ...prevCalendar,
      [dayToSchedule]: day
    }));
    setDialogOpen(false);
  };

  const getDayDetails = (day: WorkoutDay) => {
    const cardioCount = day.exercises.filter(ex => ex.type === 'cardio').length;
    const strengthCount = day.exercises.filter(ex => ex.type === 'strength').length;
    const bodyweightCount = day.exercises.filter(ex => ex.type === 'bodyweight').length;
    const totalExercises = day.exercises.length;
    
    let details = '';
    if (cardioCount > 0) details += `${cardioCount} cardio, `;
    if (strengthCount > 0) details += `${strengthCount} forza, `;
    if (bodyweightCount > 0) details += `${bodyweightCount} corpo libero, `;
    
    return details ? `${totalExercises} esercizi (${details.slice(0, -2)})` : `${totalExercises} esercizi`;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
        <Today sx={{ mr: 1, verticalAlign: 'middle' }} />
        Pianificazione Allenamenti
      </Typography>
      
      <Grid container spacing={3}>
        {/* Colonna sinistra - Programmi disponibili */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Programmi di Allenamento
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {programs.map(program => (
              <Card 
                key={program.id} 
                sx={{ 
                  mb: 2, 
                  cursor: 'pointer',
                  border: selectedProgram?.id === program.id ? `2px solid ${theme.palette.primary.main}` : 'none',
                }}
                onClick={() => handleProgramSelect(program)}
              >
                <CardHeader
                  title={program.name}
                  subheader={`${program.difficulty} - ${program.category}`}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {program.description}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <FitnessCenter sx={{ mr: 1, verticalAlign: 'middle', fontSize: '0.9rem' }} />
                    {program.days.length} giorni di allenamento
                  </Typography>
                </CardContent>
              </Card>
            ))}
            
            <Button 
              variant="outlined" 
              fullWidth 
              sx={{ mt: 2 }}
              onClick={() => window.location.href = '/workout-builder'}
            >
              Crea Nuovo Programma
            </Button>
          </Paper>
        </Grid>
        
        {/* Colonna destra - Calendario settimanale */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Il Tuo Calendario Settimanale
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              {Object.keys(calendarView).map((dayIndex) => {
                const dayNum = parseInt(dayIndex);
                const scheduledDay = calendarView[dayIndex];
                return (
                  <Grid item xs={12} sm={6} md={4} key={dayIndex}>
                    <Card sx={{ height: '100%' }}>
                      <CardHeader
                        title={getDateForDayOffset(dayNum)}
                        sx={{ backgroundColor: theme.palette.grey[100], py: 1 }}
                      />
                      <CardContent sx={{ p: 1.5 }}>
                        {scheduledDay ? (
                          <Box>
                            <Typography variant="subtitle1">{scheduledDay.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {getDayDetails(scheduledDay)}
                            </Typography>
                            <Button 
                              size="small" 
                              sx={{ mt: 1 }}
                              onClick={() => openScheduleDialog(dayIndex)}
                            >
                              Cambia
                            </Button>
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              height: 100,
                            }}
                          >
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Nessun allenamento programmato
                            </Typography>
                            <Button 
                              size="small"
                              variant="outlined"
                              onClick={() => openScheduleDialog(dayIndex)}
                              disabled={!selectedProgram}
                            >
                              Pianifica
                            </Button>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Dialog per scegliere il giorno di allenamento */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Scegli Giorno di Allenamento</DialogTitle>
        <DialogContent>
          {selectedProgram ? (
            <List>
              {selectedProgram.days.map(day => (
                <ListItem 
                  button 
                  key={day.id}
                  onClick={() => scheduleWorkoutDay(day)}
                >
                  <ListItemIcon>
                    <FitnessCenter />
                  </ListItemIcon>
                  <ListItemText 
                    primary={day.name}
                    secondary={getDayDetails(day)}
                  />
                </ListItem>
              ))}
              <Divider sx={{ my: 2 }} />
              <ListItem button onClick={() => scheduleWorkoutDay(null)}>
                <ListItemText primary="Rimuovi allenamento programmato" />
              </ListItem>
            </List>
          ) : (
            <Typography>Seleziona prima un programma di allenamento</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Annulla</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WorkoutCalendar;
