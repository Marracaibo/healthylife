import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Card, 
  CardContent, 
  Tabs, 
  Tab, 
  Avatar, 
  LinearProgress, 
  useTheme, 
  Grid,
  Divider,
  IconButton,
  Paper,
  Badge,
  Zoom,
  Chip,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { 
  ArrowBack, 
  History, 
  FitnessCenter, 
  SportsGymnastics, 
  Timer, 
  LinearScale, 
  PlayArrow, 
  CheckCircle, 
  ArrowDropUp, 
  ArrowDropDown, 
  EmojiEvents, 
  MonitorWeight, 
  FitnessCenterOutlined, 
  DirectionsRun,
  PoolOutlined
} from '@mui/icons-material';
import { WeightliftingSkill, SkillProgression } from '../../types/weightliftingSkill';

interface WeightliftingSkillDetailProps {
  skill: WeightliftingSkill;
  onBack: () => void;
}

const WeightliftingSkillDetail: React.FC<WeightliftingSkillDetailProps> = ({ 
  skill, 
  onBack
}) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');
  const [selectedProgression, setSelectedProgression] = useState<number>(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: 'details' | 'history') => {
    setActiveTab(newValue);
  };

  const handleProgressionSelect = (index: number) => {
    setSelectedProgression(index === selectedProgression ? -1 : index);
  };

  const getProgressionColor = (level: number) => {
    const colors = [
      '#4CAF50', // Verde
      '#8BC34A', // Verde chiaro
      '#2196F3', // Blu
      '#03A9F4', // Azzurro
      '#FF9800', // Arancione
      '#FFCA28', // Giallo
      '#F44336', // Rosso
      '#E91E63', // Rosa
    ];
    
    return colors[level % colors.length];
  };

  // Funzione per ottenere l'icona appropriata in base al nome dell'esercizio
  function getExerciseIcon(exerciseName: string) {
    const name = exerciseName.toLowerCase();
    
    if (name.includes('pull') || name.includes('chin')) {
      return <FitnessCenter />;
    } else if (name.includes('row')) {
      return <DirectionsRun />;
    } else if (name.includes('dip')) {
      return <FitnessCenterOutlined />;
    } else if (name.includes('push')) {
      return <SportsGymnastics />;
    } else if (name.includes('wall') || name.includes('walk')) {
      return <FitnessCenter />;
    } else if (name.includes('hollow') || name.includes('hold')) {
      return <LinearScale />;
    } else if (name.includes('pike')) {
      return <FitnessCenterOutlined />;
    } else if (name.includes('plank')) {
      return <FitnessCenter />;
    } else if (name.includes('handstand')) {
      return <SportsGymnastics />;
    } else if (name.includes('leg raise')) {
      return <DirectionsRun />;
    } else if (name.includes('l-sit') || name.includes('l sit')) {
      return <PoolOutlined />;
    } else if (name.includes('stretch')) {
      return <FitnessCenter />;
    } else if (name.includes('bench') || name.includes('press')) {
      return <FitnessCenterOutlined />;
    } else if (name.includes('squat')) {
      return <FitnessCenter />;
    } else if (name.includes('deadlift')) {
      return <FitnessCenter />;
    } else {
      return <FitnessCenterOutlined />;
    }
  };

  // Funzione per ottenere l'icona appropriata in base al livello di progressione
  function getProgressionIcon(progressionName: string) {
    const name = progressionName.toLowerCase();
    
    // Controlla le icone disponibili nella cartella icons
    if (name.includes('squat')) {
      return <Box component="img" src="/icons/squats.png" alt="Squat" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('panca') || name.includes('bench')) {
      return <Box component="img" src="/icons/panca piana.png" alt="Bench Press" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('stacco') || name.includes('deadlift')) {
      return <Box component="img" src="/icons/strength.png" alt="Deadlift" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('press') || name.includes('shoulder')) {
      return <Box component="img" src="/icons/strength.png" alt="Press" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('principiante') || name.includes('beginner')) {
      return <Box component="img" src="/icons/beginner.png" alt="Beginner" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('intermedio') || name.includes('intermediate')) {
      return <Box component="img" src="/icons/medium.png" alt="Intermediate" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('avanzato') || name.includes('advanced')) {
      return <Box component="img" src="/icons/advanced.png" alt="Advanced" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('elite')) {
      return <Box component="img" src="/icons/elite.png" alt="Elite" sx={{ width: '24px', height: '24px' }} />;
    } else {
      return <MonitorWeight />;
    }
  };

  return (
    <Box>
      {/* Header con background e informazioni principali */}
      <Box 
        sx={{ 
          mb: 4, 
          height: 200, 
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 3,
          background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8)), url(${skill.image || '/images/default-weightlifting.jpg'}) no-repeat center/cover`,
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
          {skill.progressions.map((progression, index) => {
            const isSelected = selectedProgression === index;
            const progressionColor = getProgressionColor(index);
            
            return (
              <Zoom in={true} key={progression.id} style={{ transitionDelay: `${index * 50}ms` }}>
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
                  <ListItem 
                    button
                    onClick={() => handleProgressionSelect(index)}
                    sx={{ 
                      pt: 3, 
                      pb: 2,
                      px: 3,
                      borderLeft: `4px solid ${progressionColor}`,
                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8,
                      bgcolor: isSelected ? alpha(progressionColor, 0.08) : 'transparent'
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
                          {isSelected ? <ArrowDropUp /> : <ArrowDropDown />}
                        </Box>
                      </Box>
                      
                      <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary', pl: 7 }}>
                        {progression.description}
                      </Typography>
                    </Box>
                  </ListItem>
                  
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
                              <EmojiEvents sx={{ color: progressionColor, mr: 1 }} />
                              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: progressionColor }}>
                                Obiettivo
                              </Typography>
                            </Box>
                            <Typography variant="body2">
                              {progression.description}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                              <CheckCircle sx={{ color: progressionColor, mr: 1, fontSize: '1.1rem' }} />
                              <Typography variant="body2" fontWeight="medium">
                                {progression.targetWeight}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>

                        {/* Titolo esercizi di supporto */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <FitnessCenter sx={{ mr: 1, color: theme.palette.text.secondary }} />
                          <Typography variant="subtitle1" fontWeight="bold">
                            Esercizi di supporto
                          </Typography>
                        </Box>
                        
                        {/* Esercizi di supporto */}
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                          {progression.supportExercises.map((exercise) => (
                            <Grid item xs={6} sm={3} key={exercise.id}>
                              <Card 
                                sx={{ 
                                  height: '100%',
                                  borderRadius: 2,
                                  transition: 'transform 0.2s',
                                  '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 2
                                  }
                                }}
                                elevation={2}
                              >
                                <Box 
                                  sx={{ 
                                    height: 100,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bgcolor: alpha(progressionColor, 0.1),
                                    position: 'relative',
                                    borderTopLeftRadius: 8,
                                    borderTopRightRadius: 8,
                                    overflow: 'visible'
                                  }}
                                >
                                  {/* Icona grande e ben visibile */}
                                  <Box
                                    sx={{
                                      width: 70,
                                      height: 70,
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
                                  {exercise.weight && (
                                    <Typography variant="body2" fontWeight="medium" color="text.primary" sx={{ mt: 0.5 }}>
                                      {exercise.weight}
                                    </Typography>
                                  )}
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
                          >
                            INIZIA WORKOUT
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Card>
              </Zoom>
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
    </Box>
  );
};

export default WeightliftingSkillDetail;
