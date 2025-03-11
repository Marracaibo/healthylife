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
import { AgilitySkill } from '../../types/agilitySkill';
import { ArrowForward, FlipCameraAndroid, SportsGymnastics, BlurOn, FlightTakeoff } from '@mui/icons-material';

interface AgilitySkillsListProps {
  skills: AgilitySkill[];
  onSelectSkill: (skill: AgilitySkill) => void;
}

const AgilitySkillsList: React.FC<AgilitySkillsListProps> = ({ skills, onSelectSkill }) => {
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
    
    // Controlla prima se esiste un'icona nella cartella /icons
    let iconPath = '';
    
    if (skillNameLower.includes('backflip') || skillNameLower.includes('salto all\'indietro')) {
      iconPath = '/icons/backflip.png';
    } else if (skillNameLower.includes('frontflip') || skillNameLower.includes('salto in avanti')) {
      iconPath = '/icons/frontlever.png'; // Utilizziamo un'icona simile in assenza di una specifica
    } else if (skillNameLower.includes('mezza volta') || skillNameLower.includes('rondata') || skillNameLower.includes('round')) {
      iconPath = '/icons/mezza%20volta.png';
    } else if (skillNameLower.includes('ruota') || skillNameLower.includes('cartwheel')) {
      iconPath = '/icons/ruota.png';
    }
    
    // Se abbiamo trovato un'icona corrispondente, la mostriamo
    if (iconPath) {
      return (
        <Box
          component="img"
          src={iconPath}
          alt={skillNameLower}
          onError={(e) => {
            // In caso di errore nel caricamento dell'immagine, sostituisci con un'icona generica
            const target = e.target as HTMLImageElement;
            target.onerror = null; // Previene loop infiniti
            target.src = '/icons/strength.png'; // Icona generica di fallback
          }}
          sx={{
            width: '32px',
            height: '32px',
            objectFit: 'contain',
            backgroundColor: 'transparent',
            borderRadius: '50%',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        />
      );
    }
    
    // Fallback alle icone di Material-UI
    if (skillNameLower.includes('backflip') || skillNameLower.includes('salto all\'indietro')) {
      return (
        <Box sx={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <FlipCameraAndroid />
        </Box>
      );
    } else if (skillNameLower.includes('frontflip') || skillNameLower.includes('salto in avanti')) {
      return (
        <Box sx={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <FlightTakeoff />
        </Box>
      );
    } else if (skillNameLower.includes('mezza volta') || skillNameLower.includes('rondata') || skillNameLower.includes('round')) {
      return (
        <Box sx={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 2C14.24 2 12 4.24 12 7C12 9.76 14.24 12 17 12C19.76 12 22 9.76 22 7C22 4.24 19.76 2 17 2ZM17 10C15.34 10 14 8.66 14 7C14 5.34 15.34 4 17 4C18.66 4 20 5.34 20 7C20 8.66 18.66 10 17 10Z" fill="currentColor"/>
            <path d="M7 12C4.24 12 2 14.24 2 17C2 19.76 4.24 22 7 22C9.76 22 12 19.76 12 17C12 14.24 9.76 12 7 12ZM7 20C5.34 20 4 18.66 4 17C4 15.34 5.34 14 7 14C8.66 14 10 15.34 10 17C10 18.66 8.66 20 7 20Z" fill="currentColor"/>
            <path d="M16 16.5L12.5 13L9 16.5L7 14.5L11 10.5L16 15.5L18.5 13L20.5 15L16 19.5L13.5 17L16 16.5Z" fill="currentColor"/>
          </svg>
        </Box>
      );
    } else if (skillNameLower.includes('ruota') || skillNameLower.includes('cartwheel')) {
      return (
        <Box sx={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <SportsGymnastics />
        </Box>
      );
    } else {
      return (
        <Box sx={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <SportsGymnastics />
        </Box>
      );
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
              
              <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.9), mb: 1 }}>
                Focus: {skill.areaFocus}
              </Typography>
              
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
                  <BlurOn fontSize="small" sx={{ mr: 0.5, opacity: 0.7 }} />
                  {skill.progressions.length} Livelli
                </Typography>
                
                <Chip 
                  label={skill.areaFocus}
                  variant="outlined"
                  size="small"
                  sx={{ 
                    fontSize: '0.75rem', 
                    height: 24,
                    borderRadius: 1.5
                  }} 
                />
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

export default AgilitySkillsList;
