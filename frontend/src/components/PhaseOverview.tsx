import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Chip, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Badge,
  useTheme,
  alpha
} from '@mui/material';
import { 
  FitnessCenter, 
  ExpandMore, 
  AccessTime, 
  Info, 
  PlayCircleOutline,
  Lock,
  LockOpen,
  Check,
  Spa,
  Science
} from '@mui/icons-material';
import { WorkoutPhase, WorkoutWeek, WorkoutDay } from '../types/workout';

interface PhaseOverviewProps {
  phase: WorkoutPhase;
  selectedWeek: WorkoutWeek | null;
  onWeekSelect: (week: WorkoutWeek) => void;
  onDaySelect: (day: WorkoutDay) => void;
  userProgress: {
    currentPhase: number;
    currentWeek: number;
    currentDay: number;
    completedWorkouts: Set<string>;
  };
  isWorkoutAvailable: (phase: WorkoutPhase, week: WorkoutWeek) => boolean;
}

const PhaseOverview: React.FC<PhaseOverviewProps> = ({
  phase,
  selectedWeek,
  onWeekSelect,
  onDaySelect,
  userProgress,
  isWorkoutAvailable
}) => {
  const theme = useTheme();
  const [expandedWeek, setExpandedWeek] = useState<string | false>(
    selectedWeek ? selectedWeek.id : false
  );

  // Gestisce l'espansione/contrazione della settimana
  const handleWeekExpand = (weekId: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedWeek(isExpanded ? weekId : false);
    
    // Se stiamo espandendo una settimana, anche selezionarla
    if (isExpanded) {
      const week = phase.weeks.find(w => w.id === weekId);
      if (week) {
        onWeekSelect(week);
      }
    }
  };

  // Calcola quanti giorni di allenamento sono stati completati in una settimana
  const getCompletedWorkoutsCount = (week: WorkoutWeek) => {
    return week.days.filter(day => day.type !== 'rest' && userProgress.completedWorkouts.has(day.id)).length;
  };

  // Calcola il numero totale di giorni di allenamento in una settimana
  const getTotalWorkoutsCount = (week: WorkoutWeek) => {
    return week.days.filter(day => day.type !== 'rest').length;
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              {phase.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {phase.description || 'Descrizione non disponibile'}
            </Typography>
          </Box>
          
          <Chip 
            icon={<FitnessCenter />} 
            label={`${phase.weeks.length} Settimane`} 
            color="primary" 
            variant="outlined" 
          />
        </Box>
        
        {phase.explanations && phase.explanations.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Spiegazioni degli Esercizi
            </Typography>
            
            <Grid container spacing={2}>
              {phase.explanations.map((explanation, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      borderRadius: 2, 
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.05)
                      },
                      cursor: 'pointer'
                    }}
                  >
                    <PlayCircleOutline color="primary" />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {explanation.title}
                      </Typography>
                      {explanation.videoDuration && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTime fontSize="small" sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {explanation.videoDuration}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Paper>
      
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', px: 1, mb: 2 }}>
        Settimane di Allenamento
      </Typography>
      
      {phase.weeks.map((week) => {
        const isAvailable = isWorkoutAvailable(phase, week);
        const completedCount = getCompletedWorkoutsCount(week);
        const totalCount = getTotalWorkoutsCount(week);
        
        return (
          <Accordion 
            key={week.id}
            expanded={expandedWeek === week.id}
            onChange={handleWeekExpand(week.id)}
            disabled={!isAvailable}
            sx={{
              mb: 2,
              borderRadius: 2,
              '&:before': {
                display: 'none',
              },
              boxShadow: expandedWeek === week.id ? 3 : 1,
              border: isAvailable ? 'none' : `1px solid ${theme.palette.divider}`,
              backgroundColor: week.isTestWeek 
                ? alpha(theme.palette.warning.main, 0.05)
                : 'background.paper'
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls={`week-${week.id}-content`}
              id={`week-${week.id}-header`}
              sx={{ 
                minHeight: 56,
                '& .MuiAccordionSummary-content': {
                  margin: '12px 0',
                },
                borderRadius: expandedWeek === week.id ? '8px 8px 0 0' : 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                <Box sx={{ 
                  backgroundColor: week.isTestWeek 
                    ? theme.palette.warning.main
                    : theme.palette.primary.main,
                  color: '#fff',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  opacity: isAvailable ? 1 : 0.5
                }}>
                  {week.weekNumber}
                </Box>
                
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                    {week.name}
                    {week.isTestWeek && (
                      <Chip 
                        label="Test" 
                        size="small" 
                        color="warning" 
                        sx={{ ml: 1, height: 20, fontSize: '0.625rem' }} 
                      />
                    )}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {week.days.length} giorni
                    </Typography>
                    {isAvailable && (
                      <Typography variant="body2" color="text.secondary">
                        • {completedCount}/{totalCount} completati
                      </Typography>
                    )}
                  </Box>
                </Box>
                
                {!isAvailable && (
                  <Lock color="disabled" fontSize="small" />
                )}
                
                {isAvailable && completedCount === totalCount && totalCount > 0 && (
                  <Check color="success" />
                )}
              </Box>
            </AccordionSummary>
            
            <AccordionDetails sx={{ pt: 0 }}>
              <Divider sx={{ mt: 1, mb: 2 }} />
              
              <List disablePadding>
                {week.days.map((day) => (
                  <ListItem 
                    key={day.id}
                    button
                    onClick={() => onDaySelect(day)}
                    sx={{ 
                      borderRadius: 1,
                      mb: 1,
                      backgroundColor: 'background.paper',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.05)
                      }
                    }}
                  >
                    <ListItemIcon>
                      {day.type === 'workout' && <FitnessCenter color="primary" />}
                      {day.type === 'test' && <Science color="warning" />}
                      {day.type === 'rest' && <Spa color="success" />}
                    </ListItemIcon>
                    
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body1">
                            {day.name}
                          </Typography>
                          <Chip 
                            label={day.code} 
                            size="small" 
                            color={
                              day.type === 'workout' ? "primary" : 
                              day.type === 'test' ? "warning" : 
                              "success"
                            }
                            variant="outlined"
                            sx={{ ml: 1, height: 20, fontSize: '0.625rem' }} 
                          />
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          Giorno {day.dayNumber}
                          {day.type === 'workout' && ` • ${day.exercises.length} esercizi`}
                        </Typography>
                      }
                    />
                    
                    {userProgress.completedWorkouts.has(day.id) && (
                      <Check color="success" />
                    )}
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};

export default PhaseOverview;
