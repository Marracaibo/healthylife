import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Divider,
  LinearProgress,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  useTheme,
  IconButton,
  Badge,
  Paper,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  ButtonBase
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { 
  ArrowBack, 
  CheckCircle, 
  RadioButtonUnchecked, 
  SportsGymnastics, 
  FitnessCenterOutlined, 
  DirectionsRun,
  LinearScale, 
  PoolOutlined,
  History,
  PlayArrow
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { CalisthenicsSkill } from '../../types/calisthenicsSkill';
import { SkillProgression } from '../../types/skillProgression';

interface CalisthenicSkillDetailProps {
  skill: CalisthenicsSkill | SkillProgression;
  onBack: () => void;
}

const CalisthenicSkillDetail: React.FC<CalisthenicSkillDetailProps> = ({ 
  skill, 
  onBack
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');
  const [selectedProgression, setSelectedProgression] = useState<number | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);

  // Funzione per ottenere l'icona appropriata in base al nome dell'esercizio
  function getExerciseIcon(exerciseName: string) {
    const name = exerciseName.toLowerCase();
    
    // Controlla le icone disponibili nella cartella icons
    if (name.includes('pull') || name.includes('chin')) {
      return <Box component="img" src="/icons/pull-up.png" alt="Pull Up" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('dip')) {
      return <Box component="img" src="/icons/dip.png" alt="Dip" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('push')) {
      return <Box component="img" src="/icons/pushup.png" alt="Push Up" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('handstand') || name.includes('verticale')) {
      return <Box component="img" src="/icons/handstand.png" alt="Handstand" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('planche')) {
      return <SportsGymnastics />;
    } else if (name.includes('l-sit') || name.includes('l sit')) {
      return <PoolOutlined />;
    } else if (name.includes('muscle up') || name.includes('muscle-up')) {
      return <Box component="img" src="/icons/muscleup.png" alt="Muscle Up" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('front lever')) {
      return <Box component="img" src="/icons/frontlever.png" alt="Front Lever" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('back lever')) {
      return <Box component="img" src="/icons/backlever.png" alt="Back Lever" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('flag')) {
      return <Box component="img" src="/icons/human flag.png" alt="Human Flag" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('stretch') || name.includes('flessibilitu00e0')) {
      return <Box component="img" src="/icons/flexibility.png" alt="Flexibility" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('tuck lever')) {
      return <Box component="img" src="/icons/tuck lever.png" alt="Tuck Lever" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('tuck')) {
      return <Box component="img" src="/icons/tuck.png" alt="Tuck" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('pistol') || name.includes('pistol squat')) {
      return <Box component="img" src="/icons/pistol squat.png" alt="Pistol Squat" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('squat')) {
      return <Box component="img" src="/icons/squats.png" alt="Squat" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('plank')) {
      return <Box component="img" src="/icons/plank.png" alt="Plank" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('v sit')) {
      return <Box component="img" src="/icons/v sit.png" alt="V Sit" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('hefesto')) {
      return <Box component="img" src="/icons/hefesto.png" alt="Hefesto" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('hollow') || name.includes('hold')) {
      return <Box component="img" src="/icons/hollow hold.png" alt="Hollow Hold" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('jumping')) {
      return <DirectionsRun />;
    } else if (name.includes('high')) {
      return <LinearScale />;
    } else if (name.includes('kipping')) {
      return <FitnessCenterOutlined />;
    } else if (name.includes('explosive')) {
      return <LinearScale />;
    } else if (name.includes('transition')) {
      return <FitnessCenterOutlined />;
    } else {
      return <SportsGymnastics />;
    }
  }

  // Funzione per ottenere l'icona appropriata in base al livello di progressione
  function getProgressionIcon(progressionName: string) {
    const name = progressionName.toLowerCase();
    
    // Controlla le icone disponibili nella cartella icons
    if (name.includes('pull up') || name.includes('pull-up') || name.includes('trazione')) {
      return <Box component="img" src="/icons/pull-up.png" alt="Pull Up" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('dip') || name.includes('piegamento')) {
      return <Box component="img" src="/icons/dip.png" alt="Dip" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('push up') || name.includes('push-up') || name.includes('piegamento')) {
      return <Box component="img" src="/icons/pushup.png" alt="Push Up" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('handstand') || name.includes('verticale')) {
      return <Box component="img" src="/icons/handstand.png" alt="Handstand" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('planche')) {
      return <Box component="img" src="/icons/plank.png" alt="Planche" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('l-sit') || name.includes('l sit')) {
      return <PoolOutlined />;
    } else if (name.includes('muscle up') || name.includes('muscle-up')) {
      return <Box component="img" src="/icons/muscleup.png" alt="Muscle Up" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('front lever')) {
      return <Box component="img" src="/icons/frontlever.png" alt="Front Lever" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('back lever')) {
      return <FitnessCenterOutlined />;
    } else if (name.includes('flag')) {
      return <Box component="img" src="/icons/human flag.png" alt="Human Flag" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('stretch') || name.includes('flessibilitu00e0')) {
      return <Box component="img" src="/icons/flexibility.png" alt="Flexibility" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('tuck')) {
      return <Box component="img" src="/icons/tuck.png" alt="Tuck" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('pistol') || name.includes('pistol squat')) {
      return <Box component="img" src="/icons/pistol-squat.png" alt="Pistol Squat" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('squat')) {
      return <Box component="img" src="/icons/squats.png" alt="Squat" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('plank')) {
      return <Box component="img" src="/icons/plank.png" alt="Plank" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('hollow') || name.includes('hold')) {
      return <Box component="img" src="/icons/hollow-hold.png" alt="Hollow Hold" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('jumping')) {
      return <DirectionsRun />;
    } else if (name.includes('high')) {
      return <LinearScale />;
    } else if (name.includes('kipping')) {
      return <FitnessCenterOutlined />;
    } else if (name.includes('explosive')) {
      return <LinearScale />;
    } else if (name.includes('transition')) {
      return <FitnessCenterOutlined />;
    } else {
      return <SportsGymnastics />;
    }
  }

  // Funzione per avviare un workout con gli esercizi di supporto della progressione selezionata
  const startWorkout = (progression: any) => {
    try {
      // Verifica se la progressione ha supportExercises
      if (progression.supportExercises && Array.isArray(progression.supportExercises)) {
        // Usa direttamente supportExercises se disponibile
        const exercises = progression.supportExercises.map((exercise: any, index: number) => ({
          id: `exercise-${Date.now()}-${index}`,
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
        }));
        
        // addSupportExercisesToWorkout(exercises);
      } else if (progression.instructions && Array.isArray(progression.instructions)) {
        // Crea esercizi dalle istruzioni se supportExercises non è disponibile
        const exercises = progression.instructions.map((instruction: string, index: number) => ({
          id: `exercise-${Date.now()}-${index}`,
          name: instruction,
          sets: 3,
          reps: 8,
        }));
        
        // addSupportExercisesToWorkout(exercises);
      }
      
      setShowSnackbar(true);
      
      // Opzionalmente, reindirizza l'utente alla pagina del workout builder
      // navigate('/workout-builder');
    } catch (error) {
      console.error('Errore durante l\'aggiunta degli esercizi al workout:', error);
    }
  };

  // Funzione per ottenere il colore di sfondo per ciascuna progressione
  const getProgressionColor = (index: number) => {
    const colors = [
      '#2196f3', // Blu
      '#4caf50', // Verde
      '#ff9800', // Arancione
      '#9c27b0', // Viola
      '#f44336'  // Rosso
    ];
    return colors[index % colors.length];
  };

  // Gestione del cambio di tab
  const handleTabChange = (_event: React.SyntheticEvent, newValue: 'details' | 'history') => {
    setActiveTab(newValue);
  };
  
  const handleProgressionSelect = (index: number) => {
    setSelectedProgression(index === selectedProgression ? null : index);
  };

  return (
    <Box>
      {/* Header con immagine di sfondo */}
      <Box 
        sx={{ 
          position: 'relative',
          height: 180, 
          borderRadius: 2,
          mb: 3,
          overflow: 'hidden',
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(https://images.unsplash.com/photo-1605296867424-35fc25c9212a?q=80&w=2070)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={onBack} sx={{ color: '#ffffff', mr: 1 }}>
            <ArrowBack />
          </IconButton>
        </Box>

        <Box sx={{ p: 3, zIndex: 1 }}>
          <Typography variant="h4" component="h1" fontWeight="bold" sx={{ color: '#ffffff', mb: 1 }}>
            {skill.name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LinearProgress 
              variant="determinate" 
              value={skill.progress} 
              sx={{ 
                flex: 1,
                height: 10, 
                mr: 2,
                borderRadius: 5,
                backgroundColor: alpha('#ffffff', 0.3),
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#ffffff'
                }
              }}
            />
            <Badge 
              badgeContent={skill.progress + '%'} 
              color="primary"
              sx={{ 
                '& .MuiBadge-badge': {
                  fontSize: '0.9rem',
                  height: 24,
                  minWidth: 44,
                  fontWeight: 'bold'
                }
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Tabs per navigare tra dettagli e storia */}
      <Paper 
        elevation={0} 
        variant="outlined" 
        sx={{ 
          mb: 3, 
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTabs-indicator': { 
              height: 4, 
              borderRadius: '4px 4px 0 0' 
            }
          }}
        >
          <Tab 
            icon={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{
                  width: 28, 
                  height: 28, 
                  bgcolor: activeTab === 'details' ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.1),
                  color: activeTab === 'details' ? '#ffffff' : theme.palette.primary.main,
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
                  mr: 1
                }}>
                  1
                </Avatar>
                <Typography sx={{ fontWeight: activeTab === 'details' ? 'bold' : 'medium' }}>
                  Details
                </Typography>
              </Box>
            }
            value="details" 
            sx={{ textTransform: 'none', py: 1.5 }}
          />
          <Tab 
            icon={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{
                  width: 28, 
                  height: 28, 
                  bgcolor: activeTab === 'history' ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.1),
                  color: activeTab === 'history' ? '#ffffff' : theme.palette.primary.main,
                  mr: 1
                }}>
                  <History sx={{ fontSize: 16 }} />
                </Avatar>
                <Typography sx={{ fontWeight: activeTab === 'history' ? 'bold' : 'medium' }}>
                  History
                </Typography>
              </Box>
            }
            value="history" 
            sx={{ textTransform: 'none', py: 1.5 }}
          />
        </Tabs>
      </Paper>

      {/* Tab Content - Details */}
      {activeTab === 'details' && (
        <Box>
          {skill?.progressions?.map((progression: any, index: number) => {
            const isSelected = selectedProgression === index;
            const progressionColor = getProgressionColor(index);
            
            return (
              <Box key={progression.id} style={{ transitionDelay: `${index * 50}ms` }}>
                <Card 
                  elevation={isSelected ? 1 : 0}
                  sx={{ 
                    mb: 2, 
                    borderRadius: 2,
                    border: `1px solid ${isSelected ? progressionColor : theme.palette.divider}`,
                    overflow: 'visible',
                    position: 'relative',
                    transition: 'all 0.3s'
                  }}
                >
                  {/* Badge di livello */}
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      left: 20, 
                      top: '-12px',
                      zIndex: 9,
                      height: 24,
                      minWidth: 24,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 12,
                      bgcolor: progressionColor,
                      color: '#ffffff',
                      fontWeight: 'bold',
                      px: 1.5,
                      fontSize: '0.85rem',
                      boxShadow: isSelected ? 3 : 0
                    }}
                  >
                    Level {index + 1}
                  </Box>
                  
                  {/* Header della progressione */}
                  <ButtonBase 
                    onClick={() => handleProgressionSelect(index)}
                    sx={{ 
                      pt: 3, 
                      pb: 2,
                      px: 3,
                      borderLeft: isSelected ? `4px solid ${theme.palette.primary.main}` : '4px solid transparent',
                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8,
                      bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                      width: '100%',
                      display: 'block',
                      textAlign: 'left'
                    }}
                  >
                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: alpha(progressionColor, 0.2),
                              color: progressionColor,
                              mr: 2
                            }}
                          >
                            {getProgressionIcon(progression.name)}
                          </Avatar>
                          <Typography variant="h6" fontWeight="bold" sx={{ color: progressionColor }}>
                            {progression.name}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Chip 
                            label={`${progression.progress}%`}
                            size="small"
                            sx={{ 
                              fontWeight: 'bold',
                              bgcolor: alpha(progressionColor, 0.1),
                              color: progressionColor,
                              mr: 1
                            }}
                          />
                          {isSelected ? <RadioButtonUnchecked /> : <RadioButtonUnchecked />}
                        </Box>
                      </Box>
                      
                      <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary', pl: 7 }}>
                        {progression.description}
                      </Typography>
                    </Box>
                  </ButtonBase>
                  
                  {/* Contenuto espanso */}
                  {isSelected && (
                    <Box>
                      <Divider />
                      <Box sx={{ p: 3, bgcolor: alpha(theme.palette.background.default, 0.5) }}>
                        {/* Card con obiettivo */}
                        <Card 
                          sx={{ 
                            mb: 3, 
                            bgcolor: alpha(progressionColor, 0.05),
                            border: `1px solid ${alpha(progressionColor, 0.2)}`,
                            borderRadius: 2
                          }}
                        >
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <CheckCircle sx={{ color: progressionColor, mr: 1 }} />
                              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: progressionColor }}>
                                Obiettivo per sbloccare il livello successivo
                              </Typography>
                            </Box>
                            <Typography variant="body2">
                              {progression.description}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, bgcolor: alpha(progressionColor, 0.1), p: 1.5, borderRadius: 2 }}>
                              <CheckCircle sx={{ color: progressionColor, mr: 1, fontSize: '1.1rem' }} />
                              <Typography variant="body2" fontWeight="bold">
                                {progression.targetReps}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>

                        {/* Titolo esercizi di supporto */}
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 3, mb: 2 }}>
                          Esercizi di supporto
                        </Typography>
                        
                        {/* Esercizi di supporto */}
                        <Grid container spacing={2}>
                          {progression.supportExercises.map((exercise: any, index: number) => (
                            <Grid item xs={6} sm={3} key={index}>
                              <Card 
                                sx={{ 
                                  height: '100%',
                                  display: 'flex', 
                                  flexDirection: 'column',
                                  transition: 'transform 0.3s, box-shadow 0.3s',
                                  '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: 6
                                  },
                                  borderRadius: 2,
                                  overflow: 'hidden'
                                }}
                              >
                                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                                  <Box
                                    sx={{
                                      width: 50,
                                      height: 50,
                                      borderRadius: '50%',
                                      bgcolor: progressionColor,
                                      color: '#ffffff',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                                      border: '3px solid white',
                                    }}
                                  >
                                    {getExerciseIcon(exercise.name)}
                                  </Box>
                                </Box>
                                
                                <CardContent sx={{ textAlign: 'center', py: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                    {exercise.name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {exercise.sets} Sets · {exercise.reps}
                                  </Typography>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>

                        {/* Pulsante Workout */}
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Button 
                            variant="contained" 
                            size="large"
                            startIcon={<PlayArrow />}
                            sx={{ 
                              bgcolor: progressionColor,
                              '&:hover': {
                                bgcolor: alpha(progressionColor, 0.8)
                              },
                              borderRadius: 6,
                              px: 4,
                              py: 1,
                              fontWeight: 'bold',
                              boxShadow: 3
                            }}
                            onClick={() => startWorkout(progression)}
                          >
                            INIZIA WORKOUT
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Card>
              </Box>
            );
          })}
        </Box>
      )}

      {/* Tab Content - History */}
      {activeTab === 'history' && (
        <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Box 
            sx={{ 
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2
            }}
          >
            <History sx={{ fontSize: 40, color: theme.palette.primary.main }} />
          </Box>
          <Typography variant="h6" gutterBottom>
            Non ci sono ancora dati storici disponibili
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 500, mx: 'auto' }}>
            Inizia ad allenarti e traccia i tuoi progressi per vedere la tua storia qui.
            Potrai visualizzare i tuoi miglioramenti nel tempo e confrontare i risultati.
          </Typography>
          <Button 
            variant="outlined" 
            color="primary" 
            sx={{ mt: 3, borderRadius: 6 }}
          >
            Inizia un allenamento
          </Button>
        </Paper>
      )}
      
      {/* Snackbar di notifica */}
      <Snackbar 
        open={showSnackbar} 
        autoHideDuration={3000} 
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSnackbar(false)} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          Esercizi aggiunti al Workout Builder!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CalisthenicSkillDetail;
