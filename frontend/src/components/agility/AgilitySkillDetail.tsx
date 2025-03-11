import React from 'react';
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
  Tabs,
  Tab,
  IconButton
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { 
  ArrowBack, 
  CheckCircle, 
  RadioButtonUnchecked, 
  SportsGymnastics, 
  FlipCameraAndroid
} from '@mui/icons-material';
import { AgilitySkill } from '../../types/agilitySkill';

interface AgilitySkillDetailProps {
  skill: AgilitySkill;
  onBack: () => void;
}

const AgilitySkillDetail: React.FC<AgilitySkillDetailProps> = ({ skill, onBack }) => {
  const theme = useTheme();

  // Funzione per generare un gradiente basato sulla difficoltu00e0
  const getDifficultyGradient = (difficulty: string) => {
    switch(difficulty) {
      case 'beginner':
        return 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)';
      case 'intermediate':
        return 'linear-gradient(135deg, #2196F3 0%, #03A9F4 100%)';
      case 'advanced':
        return 'linear-gradient(135deg, #FF9800 0%, #FFCA28 100%)';
      case 'elite':
        return 'linear-gradient(135deg, #F44336 0%, #FF5722 100%)';
      default:
        return 'linear-gradient(135deg, #9C27B0 0%, #E040FB 100%)';
    }
  };

  // Icone personalizzate per diversi tipi di abilitu00e0 acrobatiche
  const getSkillIcon = (skillName: string) => {
    const skillNameLower = skillName.toLowerCase();
    
    if (skillNameLower.includes('backflip') || skillNameLower.includes('salto all\'indietro')) {
      return <FlipCameraAndroid />;
    } else if (skillNameLower.includes('frontflip') || skillNameLower.includes('salto in avanti')) {
      return <FlipCameraAndroid style={{ transform: 'scaleX(-1)' }} />;
    } else if (skillNameLower.includes('mezza volta') || skillNameLower.includes('rondata')) {
      return <SportsGymnastics />;
    } else if (skillNameLower.includes('ruota') || skillNameLower.includes('cartwheel')) {
      return <SportsGymnastics />;
    } else {
      return <SportsGymnastics />;
    }
  };

  // Funzione per ottenere l'icona appropriata in base al nome dell'esercizio
  function getExerciseIcon(exerciseName: string) {
    const name = exerciseName.toLowerCase();
    
    if (name.includes('pull') || name.includes('chin')) {
      return <Box component="img" src="/icons/pull-up.png" alt="Pull Up" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('row')) {
      return <Box component="img" src="/icons/rowing.png" alt="Rowing" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('dip')) {
      return <Box component="img" src="/icons/dip.png" alt="Dip" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('push')) {
      return <Box component="img" src="/icons/pushup.png" alt="Push Up" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('wall') || name.includes('walk')) {
      return <Box component="img" src="/icons/walking.png" alt="Walking" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('hollow') || name.includes('hold')) {
      return <Box component="img" src="/icons/hollow hold.png" alt="Hollow Hold" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('pike')) {
      return <Box component="img" src="/icons/flexibility.png" alt="Pike" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('plank')) {
      return <Box component="img" src="/icons/plank.png" alt="Plank" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('handstand')) {
      return <Box component="img" src="/icons/handstand.png" alt="Handstand" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('leg raise')) {
      return <Box component="img" src="/icons/leg raise.png" alt="Leg Raise" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('l-sit') || name.includes('l sit')) {
      return <Box component="img" src="/icons/l-sit.png" alt="L-Sit" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('pistol') || name.includes('pistol squat')) {
      return <Box component="img" src="/icons/pistol-squat.png" alt="Pistol Squat" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('stretch')) {
      return <Box component="img" src="/icons/flexibility.png" alt="Stretch" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('agility')) {
      return <Box component="img" src="/icons/agility.png" alt="Agility" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('backflip') || name.includes('salto all\'indietro')) {
      return <Box component="img" src="/icons/backflip.png" alt="Backflip" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('frontflip') || name.includes('salto in avanti')) {
      return <Box component="img" src="/icons/frontflip.png" alt="Frontflip" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('cartwheel') || name.includes('ruota')) {
      return <Box component="img" src="/icons/ruota.png" alt="Cartwheel" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('mezza volta')) {
      return <Box component="img" src="/icons/mezza volta.png" alt="Mezza Volta" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('principiante') || name.includes('beginner')) {
      return <Box component="img" src="/icons/beginner.png" alt="Beginner" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('intermedio') || name.includes('intermediate')) {
      return <Box component="img" src="/icons/medium.png" alt="Intermediate" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('avanzato') || name.includes('advanced')) {
      return <Box component="img" src="/icons/advanced.png" alt="Advanced" sx={{ width: '24px', height: '24px' }} />;
    } else if (name.includes('elite')) {
      return <Box component="img" src="/icons/elite.png" alt="Elite" sx={{ width: '24px', height: '24px' }} />;
    } else {
      return <SportsGymnastics />;
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch(difficulty) {
      case 'beginner': return 'Principiante';
      case 'intermediate': return 'Intermedio';
      case 'advanced': return 'Avanzato';
      case 'elite': return 'Elite';
      default: return 'Non specificato';
    }
  };

  return (
    <Box>
      <Button 
        startIcon={<ArrowBack />} 
        onClick={onBack}
        sx={{ mb: 3 }}
      >
        Torna alla lista
      </Button>
      
      <Box
        sx={{
          background: getDifficultyGradient(skill.difficulty),
          borderRadius: 3,
          p: 4,
          mb: 4,
          color: '#fff',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{ 
            position: 'absolute', 
            right: -50, 
            top: -50, 
            opacity: 0.1, 
            transform: 'rotate(10deg)', 
            fontSize: '20rem'
          }}
        >
          {getSkillIcon(skill.name)}
        </Box>
        
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: alpha('#ffffff', 0.2),
                color: '#ffffff',
                width: 64,
                height: 64,
                mr: 2
              }}
            >
              {getSkillIcon(skill.name)}
            </Avatar>
            
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold">
                {skill.name}
              </Typography>
              <Chip 
                label={getDifficultyLabel(skill.difficulty)}
                sx={{ 
                  bgcolor: alpha('#ffffff', 0.2),
                  color: '#ffffff',
                  fontWeight: 'bold',
                  mt: 1
                }} 
              />
            </Box>
          </Box>
          
          <Typography variant="body1" sx={{ mb: 2, maxWidth: '80%' }}>
            {skill.description}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ flex: 1, mr: 2 }}>
              <LinearProgress 
                variant="determinate" 
                value={skill.progress} 
                sx={{ 
                  height: 10, 
                  borderRadius: 5,
                  bgcolor: alpha('#ffffff', 0.2),
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#ffffff'
                  }
                }} 
              />
            </Box>
            <Typography variant="h6" fontWeight="bold">
              {skill.progress}%
            </Typography>
          </Box>
        </Box>
      </Box>
      
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Progressione
      </Typography>
      
      {skill.progressions.map((progression) => (
        <Card 
          key={progression.id}
          sx={{ 
            mb: 3, 
            borderRadius: 2,
            boxShadow: progression.completed ? `0 0 0 2px ${theme.palette.success.main}` : 'none',
            border: progression.completed ? 'none' : `1px solid ${theme.palette.divider}`
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
              <Avatar
                sx={{
                  bgcolor: progression.completed ? theme.palette.success.main : alpha(theme.palette.primary.main, 0.1),
                  color: progression.completed ? '#ffffff' : theme.palette.primary.main,
                  mr: 2
                }}
              >
                {progression.completed ? <CheckCircle /> : <RadioButtonUnchecked />}
              </Avatar>
              
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" fontWeight="bold">
                    Livello {progression.level}: {progression.name}
                  </Typography>
                  <Chip 
                    label={`${progression.progress}%`}
                    size="small"
                    color={progression.completed ? "success" : "default"}
                    variant={progression.completed ? "filled" : "outlined"}
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {progression.description}
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
              Obiettivo: {progression.targetAgility}
            </Typography>
            
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
              Esercizi di supporto:
            </Typography>
            
            <Grid container spacing={2}>
              {progression.supportExercises.map((exercise) => (
                <Grid item xs={12} sm={6} md={4} key={exercise.id}>
                  <Card variant="outlined" sx={{ borderRadius: 2 }}>
                    <Box 
                      sx={{ 
                        height: 100,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        position: 'relative',
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                        overflow: 'visible'
                      }}
                    >
                      <Box
                        sx={{
                          width: 70,
                          height: 70,
                          borderRadius: '50%',
                          bgcolor: theme.palette.primary.main,
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
                        {exercise.sets} serie x {exercise.duration}
                      </Typography>
                      {exercise.description && (
                        <Typography variant="body2" sx={{ mt: 1, fontSize: '0.8rem' }}>
                          {exercise.description}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default AgilitySkillDetail;
