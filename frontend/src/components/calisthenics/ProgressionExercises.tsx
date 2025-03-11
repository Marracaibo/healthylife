import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  LinearProgress,
  Button,
  Divider,
  Paper,
  Badge,
  CircularProgress,
  Tooltip,
  Grow
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { alpha, useTheme } from '@mui/material/styles';
import { FitnessCenter, PlayArrow, Check, Info, Timer, School } from '@mui/icons-material';
import { ProgressionExercise } from '../../types/calisthenicsSkill';
import { SkillProgression } from '../../types/skillProgression';

interface ProgressionExercisesProps {
  exercises: ProgressionExercise[];
  difficulty: number;
  skillIconUrl?: string;
  onStartWorkout?: () => void;
}

// Componente avatar stilizzato per gli esercizi
const ExerciseAvatar = styled(Avatar)(({ theme }) => ({
  width: 50,
  height: 50,
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  marginRight: theme.spacing(2),
  border: `2px solid ${theme.palette.background.paper}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& .MuiSvgIcon-root': {
    fontSize: '1.5rem'
  }
}));

// Badge per il livello di difficoltà
const DifficultyBadge = styled(Box)<{ difficulty: number }>(
  ({ theme, difficulty }) => {
    const getColor = () => {
      if (difficulty <= 2) return theme.palette.success.main;
      if (difficulty <= 3) return theme.palette.warning.main;
      return theme.palette.error.main;
    };
    
    return {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 10px',
      borderRadius: 12,
      backgroundColor: alpha(getColor(), 0.12),
      color: getColor(),
      fontSize: '0.75rem',
      fontWeight: 'bold',
      '& .MuiSvgIcon-root': {
        marginRight: theme.spacing(0.5),
        fontSize: '0.875rem'
      }
    };
  }
);

const ProgressionExercises: React.FC<ProgressionExercisesProps> = ({
  exercises,
  difficulty,
  skillIconUrl,
  onStartWorkout
}) => {
  const theme = useTheme();

  // Funzione per generare un colore basato sull'indice
  const getExerciseColor = (index: number) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.info.main,
      theme.palette.warning.main,
    ];
    return colors[index % colors.length];
  };

  // Funzione per ottenere l'icona appropriata in base al nome dell'esercizio
  const getExerciseIcon = (exerciseName: string) => {
    const name = exerciseName.toLowerCase();
    
    // Se è disponibile un'icona specifica per la skill, usala
    if (skillIconUrl) {
      return (
        <Box 
          component="img" 
          src={skillIconUrl} 
          alt={exerciseName}
          sx={{ width: '24px', height: '24px', objectFit: 'contain' }}
        />
      );
    }
    
    // Altrimenti usa icone basate sul nome dell'esercizio
    if (name.includes('pull') || name.includes('chin')) {
      return <Box component="img" src="/icons/pull-up.png" alt="Pull Up" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('dip')) {
      return <Box component="img" src="/icons/dip.png" alt="Dip" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('push')) {
      return <Box component="img" src="/icons/pushup.png" alt="Push Up" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('handstand') || name.includes('verticale')) {
      return <Box component="img" src="/icons/handstand.png" alt="Handstand" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('planche')) {
      return <Box component="img" src="/icons/planche.png" alt="Planche" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('l-sit') || name.includes('l sit')) {
      return <Box component="img" src="/icons/l-sit.png" alt="L-Sit" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('muscle up') || name.includes('muscle-up')) {
      return <Box component="img" src="/icons/muscleup.png" alt="Muscle Up" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('front lever')) {
      return <Box component="img" src="/icons/frontlever.png" alt="Front Lever" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('back lever')) {
      return <Box component="img" src="/icons/backlever.png" alt="Back Lever" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('flag')) {
      return <Box component="img" src="/icons/human flag.png" alt="Human Flag" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('stretch')) {
      return <Box component="img" src="/icons/flexibility.png" alt="Flexibility" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('tuck')) {
      return <Box component="img" src="/icons/tuck.png" alt="Tuck" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('squat')) {
      return <Box component="img" src="/icons/squats.png" alt="Squat" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('plank')) {
      return <Box component="img" src="/icons/plank.png" alt="Plank" sx={{ width: '24px', height: '24px' }} />;
    } else {
      return <FitnessCenter />;
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {skillIconUrl ? (
            <Box 
              component="img" 
              src={skillIconUrl} 
              alt="Skill Icon"
              sx={{ 
                width: '24px', 
                height: '24px', 
                mr: 1.5, 
                objectFit: 'contain' 
              }}
            />
          ) : (
            <FitnessCenter sx={{ mr: 1.5, color: theme.palette.text.secondary }} />
          )}
          <Typography variant="h6" fontWeight="bold">
            Esercizi della Progressione
          </Typography>
        </Box>
        
        <DifficultyBadge difficulty={difficulty}>
          <School />
          {Array(5).fill(0).map((_, i) => (
            <Box 
              component="span" 
              key={i} 
              sx={{ 
                ml: 0.5,
                opacity: i < difficulty ? 1 : 0.3,
                fontSize: '10px'
              }}
            >
              ●
            </Box>
          ))}
        </DifficultyBadge>
      </Box>

      <Box sx={{ position: 'relative' }}>
        {/* Linea di progresso verticale */}
        <Box 
          sx={{ 
            position: 'absolute', 
            left: 25, 
            top: 25, 
            bottom: 25, 
            width: 2, 
            bgcolor: alpha(theme.palette.divider, 0.4),
            zIndex: 0
          }}
        />
        
        {/* Esercizi */}
        {exercises.map((exercise, index) => (
          <Grow in={true} key={exercise.id} style={{ transformOrigin: '0 0 0', transitionDelay: `${index * 100}ms` }}>
            <Card 
              elevation={0}
              sx={{ 
                mb: 3, 
                borderRadius: 2, 
                position: 'relative',
                border: `1px solid ${theme.palette.divider}`,
                overflow: 'visible',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3
                }
              }}
            >
              {/* Badge con numero dell'esercizio */}
              <Box 
                sx={{ 
                  position: 'absolute', 
                  left: 0, 
                  top: '50%', 
                  transform: 'translate(-50%, -50%)',
                  zIndex: 2,
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: getExerciseColor(index),
                  color: 'white',
                  fontWeight: 'bold',
                  border: `4px solid ${theme.palette.background.paper}`,
                  boxShadow: 3
                }}
              >
                {index + 1}
              </Box>
              
              <CardContent sx={{ pl: 4, pt: 3, pb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={7}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                        {getExerciseIcon(exercise.name)}
                      </Box>
                      <Typography variant="h6" fontWeight="bold" sx={{ color: getExerciseColor(index) }}>
                        {exercise.name}
                      </Typography>
                      <Tooltip title="Informazioni sull'esercizio" arrow>
                        <Info 
                          sx={{ 
                            ml: 1, 
                            fontSize: '0.85rem', 
                            color: theme.palette.text.secondary,
                            cursor: 'pointer',
                            '&:hover': { color: theme.palette.primary.main }
                          }} 
                        />
                      </Tooltip>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {exercise.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                      <Badge 
                        badgeContent={exercise.sets} 
                        color="primary"
                        sx={{ 
                          mr: 2, 
                          '& .MuiBadge-badge': { 
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                          } 
                        }}
                      >
                        <Typography variant="body2" fontWeight="medium" sx={{ color: theme.palette.text.secondary }}>
                          Sets
                        </Typography>
                      </Badge>
                      
                      <Badge 
                        badgeContent={exercise.reps} 
                        color="secondary"
                        sx={{ 
                          '& .MuiBadge-badge': { 
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                          } 
                        }}
                      >
                        <Typography variant="body2" fontWeight="medium" sx={{ color: theme.palette.text.secondary }}>
                          Reps
                        </Typography>
                      </Badge>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                        <Timer sx={{ fontSize: '0.9rem', color: theme.palette.text.disabled, mr: 0.5 }} />
                        <Typography variant="caption" color="text.disabled">
                          Rest: {exercise.restSeconds}s
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={5}>
                    <Paper 
                      elevation={0} 
                      variant="outlined"
                      sx={{ 
                        p: 2, 
                        borderRadius: 2, 
                        height: '100%',
                        bgcolor: alpha(getExerciseColor(index), 0.03),
                        border: `1px solid ${alpha(getExerciseColor(index), 0.1)}`
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        Punti Chiave
                      </Typography>
                      <Box component="ul" sx={{ pl: 2, mb: 0, mt: 1 }}>
                        {exercise.keyPoints.map((point, i) => (
                          <Box 
                            component="li" 
                            key={i} 
                            sx={{ 
                              color: theme.palette.text.secondary,
                              fontSize: '0.85rem',
                              mb: 0.5,
                              '&::marker': { color: getExerciseColor(index) }
                            }}
                          >
                            {point}
                          </Box>
                        ))}
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
                
                {exercise.videoUrl && (
                  <Box sx={{ mt: 2, textAlign: 'right' }}>
                    <Button 
                      size="small" 
                      color="info" 
                      variant="text"
                      sx={{ borderRadius: 4 }}
                    >
                      Guarda Video
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grow>
        ))}
      </Box>
      
      {onStartWorkout && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button 
            variant="contained" 
            size="large"
            startIcon={<PlayArrow />}
            onClick={onStartWorkout}
            sx={{ 
              borderRadius: 28,
              px: 4,
              py: 1,
              boxShadow: 3,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 6
              }
            }}
          >
            Inizia Workout
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ProgressionExercises;
