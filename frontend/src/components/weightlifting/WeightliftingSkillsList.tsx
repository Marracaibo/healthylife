import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Grid,
  LinearProgress,
  useTheme
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { WeightliftingSkill } from '../../types/weightliftingSkill';
import { FitnessCenter, EmojiEvents, Timer, ArrowForward } from '@mui/icons-material';

interface WeightliftingSkillsListProps {
  skills: WeightliftingSkill[];
  onSelectSkill: (skill: WeightliftingSkill) => void;
}

const WeightliftingSkillsList: React.FC<WeightliftingSkillsListProps> = ({ skills, onSelectSkill }) => {
  const theme = useTheme();

  // Funzione per generare un gradiente basato sulla difficoltà
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

  // Icone personalizzate per diversi tipi di esercizi di weightlifting
  const getSkillIcon = (skillName: string) => {
    const skillNameLower = skillName.toLowerCase();
    
    // Controlla prima se esiste un'icona nella cartella /icons
    let iconPath = '';
    
    if (skillNameLower.includes('squat')) {
      iconPath = '/icons/squats.png';
    } else if (skillNameLower.includes('panca') || skillNameLower.includes('bench')) {
      iconPath = '/icons/panca%20piana.png';
    } else if (skillNameLower.includes('stacco') || skillNameLower.includes('deadlift')) {
      iconPath = '/icons/stacco%20da%20terra.png';
    } else if (skillNameLower.includes('press') || skillNameLower.includes('shoulder')) {
      iconPath = '/icons/strength.png';
    } else if (skillNameLower.includes('workout') || skillNameLower.includes('allenamento')) {
      iconPath = '/icons/workout.png';
    }
    
    // Se abbiamo trovato un'icona corrispondente, la mostriamo
    if (iconPath) {
      return (
        <Box
          component="img"
          src={iconPath}
          alt={skillNameLower}
          sx={{
            width: '32px',
            height: '32px',
            objectFit: 'contain'
          }}
        />
      );
    }
    
    // Fallback alle icone SVG predefinite
    if (skillNameLower.includes('squat')) {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4C13.1046 4 14 3.10457 14 2C14 0.895431 13.1046 0 12 0C10.8954 0 10 0.895431 10 2C10 3.10457 10.8954 4 12 4Z" fill="currentColor"/>
          <path d="M17 6H7C6.45 6 6 6.45 6 7C6 7.55 6.45 8 7 8H8V18H10V8H14V18H16V8H17C17.55 8 18 7.55 18 7C18 6.45 17.55 6 17 6Z" fill="currentColor"/>
          <path d="M8 20H16V22H8V20Z" fill="currentColor"/>
        </svg>
      );
    } else if (skillNameLower.includes('panca') || skillNameLower.includes('bench')) {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 10H17V8C17 7.45 16.55 7 16 7H8C7.45 7 7 7.45 7 8V10H4C3.45 10 3 10.45 3 11V15C3 15.55 3.45 16 4 16H7V18C7 18.55 7.45 19 8 19H16C16.55 19 17 18.55 17 18V16H20C20.55 16 21 15.55 21 15V11C21 10.45 20.55 10 20 10Z" fill="currentColor"/>
        </svg>
      );
    } else if (skillNameLower.includes('deadlift') || skillNameLower.includes('stacco')) {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4C13.1046 4 14 3.10457 14 2C14 0.895431 13.1046 0 12 0C10.8954 0 10 0.895431 10 2C10 3.10457 10.8954 4 12 4Z" fill="currentColor"/>
          <path d="M18 10H13.5V6H10.5V10H6C4.9 10 4 10.9 4 12V19H6V12H18V19H20V12C20 10.9 19.1 10 18 10Z" fill="currentColor"/>
          <path d="M7 20H17V22H7V20Z" fill="currentColor"/>
        </svg>
      );
    } else if (skillNameLower.includes('shoulder') || skillNameLower.includes('spalle') || skillNameLower.includes('press')) {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4C13.1046 4 14 3.10457 14 2C14 0.895431 13.1046 0 12 0C10.8954 0 10 0.895431 10 2C10 3.10457 10.8954 4 12 4Z" fill="currentColor"/>
          <path d="M16.5 8H7.5C6.67 8 6 8.67 6 9.5V12.5C6 13.33 6.67 14 7.5 14H8V21H16V14H16.5C17.33 14 18 13.33 18 12.5V9.5C18 8.67 17.33 8 16.5 8Z" fill="currentColor"/>
        </svg>
      );
    } else {
      return <FitnessCenter />;
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
    <Grid container spacing={3}>
      {skills.map((skill) => (
        <Grid item xs={12} sm={6} md={4} key={skill.id}>
          <Card 
            onClick={() => onSelectSkill(skill)}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 3,
              overflow: 'hidden',
              transition: 'transform 0.3s, box-shadow 0.3s',
              cursor: 'pointer',
              boxShadow: 2,
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: 8
              }
            }}
          >
            <Box
              sx={{
                background: getDifficultyGradient(skill.difficulty),
                p: 3,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box 
                sx={{ 
                  position: 'absolute', 
                  right: -20, 
                  top: -20, 
                  opacity: 0.15, 
                  transform: 'rotate(10deg)', 
                  fontSize: '12rem'
                }}
              >
                {getSkillIcon(skill.name)}
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 1, position: 'relative' }}>
                <Avatar
                  sx={{
                    bgcolor: '#ffffff',
                    color: theme.palette.primary.main,
                    width: 56,
                    height: 56,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    mb: 2
                  }}
                >
                  {getSkillIcon(skill.name)}
                </Avatar>
                
                <Chip 
                  label={getDifficultyLabel(skill.difficulty)}
                  sx={{ 
                    bgcolor: alpha('#ffffff', 0.2),
                    color: '#ffffff',
                    fontWeight: 'bold',
                    '& .MuiChip-label': {
                      px: 1
                    }
                  }} 
                />
              </Box>
              
              <Typography variant="h5" component="h2" fontWeight="bold" sx={{ color: '#ffffff', mb: 0.5 }}>
                {skill.name}
              </Typography>
              
              {skill.currentWeight && (
                <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.9), mb: 1 }}>
                  Attuale: {skill.currentWeight}
                </Typography>
              )}
              
              <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.8), height: 40, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Obiettivo: {skill.firstLevelName}
              </Typography>
            </Box>
            
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography 
                  variant="body2" 
                  color="textSecondary"
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    fontWeight: 500
                  }}
                >
                  <Timer fontSize="small" sx={{ mr: 0.5, opacity: 0.7 }} />
                  {skill.progressions.length} Livelli
                </Typography>
                
                {skill.personalRecord && (
                  <Typography 
                    variant="body2" 
                    color="textSecondary"
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      fontWeight: 500 
                    }}
                  >
                    <EmojiEvents fontSize="small" sx={{ mr: 0.5, color: '#FFD700' }} />
                    PR: {skill.personalRecord}
                  </Typography>
                )}
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={skill.progress} 
                  sx={{ 
                    flex: 1, 
                    mr: 2, 
                    height: 8, 
                    borderRadius: 4
                  }} 
                />
                <Typography 
                  variant="body2" 
                  color="textSecondary" 
                  fontWeight="bold"
                >
                  {skill.progress}%
                </Typography>
              </Box>
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end', 
                  alignItems: 'center', 
                  mt: 3 
                }}
              >
                <Typography variant="body2" color="primary" sx={{ fontWeight: 'medium' }}>
                  Vedi dettagli
                </Typography>
                <ArrowForward color="primary" sx={{ ml: 0.5, fontSize: 16 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default WeightliftingSkillsList;
