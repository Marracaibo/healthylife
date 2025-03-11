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
import { CardioSkill } from '../../types/cardioSkill';
import { DirectionsRun, Speed, EmojiEvents, ArrowForward, LocalFireDepartment, DirectionsBike, Pool } from '@mui/icons-material';

interface CardioSkillsListProps {
  skills: CardioSkill[];
  onSelectSkill: (skill: CardioSkill) => void;
}

const CardioSkillsList: React.FC<CardioSkillsListProps> = ({ skills, onSelectSkill }) => {
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

  // Icone personalizzate per diversi tipi di cardio
  const getSkillIcon = (skillName: string) => {
    const skillNameLower = skillName.toLowerCase();
    
    // Controlla prima se esiste un'icona nella cartella /icons
    let iconPath = '';
    
    if (skillNameLower.includes('corsa') || skillNameLower.includes('run')) {
      iconPath = '/icons/running.png';
    } else if (skillNameLower.includes('bici') || skillNameLower.includes('cycl') || skillNameLower.includes('bike')) {
      iconPath = '/icons/cardio.png';
    } else if (skillNameLower.includes('nuoto') || skillNameLower.includes('swim')) {
      iconPath = '/icons/endurance.png';
    } else if (skillNameLower.includes('hiit') || skillNameLower.includes('interval')) {
      iconPath = '/icons/cardio.png';
    } else if (skillNameLower.includes('marathon des sables') || skillNameLower.includes('desert')) {
      iconPath = '/icons/endurance.png';
    } else if (skillNameLower.includes('antarctic') || skillNameLower.includes('ice marathon')) {
      iconPath = '/icons/endurance.png';
    } else if (skillNameLower.includes('ultra maratona') || skillNameLower.includes('ultra marathon')) {
      iconPath = '/icons/endurance.png';
    } else if (skillNameLower.includes('ironman') || skillNameLower.includes('triathlon')) {
      iconPath = '/icons/endurance.png';
    } else if (skillNameLower.includes('maratona') || skillNameLower.includes('marathon')) {
      iconPath = '/icons/running.png';
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
            target.src = '/icons/cardio.png'; // Icona generica di fallback
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
    if (skillNameLower.includes('corsa') || skillNameLower.includes('run')) {
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
          <DirectionsRun />
        </Box>
      );
    } else if (skillNameLower.includes('bici') || skillNameLower.includes('cycl') || skillNameLower.includes('bike')) {
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
          <DirectionsBike />
        </Box>
      );
    } else if (skillNameLower.includes('nuoto') || skillNameLower.includes('swim')) {
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
          <Pool />
        </Box>
      );
    } else if (skillNameLower.includes('hiit') || skillNameLower.includes('interval')) {
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
          <LocalFireDepartment />
        </Box>
      );
    } else if (skillNameLower.includes('marathon des sables') || skillNameLower.includes('desert')) {
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
          <DirectionsRun />
        </Box>
      );
    } else if (skillNameLower.includes('antarctic') || skillNameLower.includes('ice marathon')) {
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
          <DirectionsRun />
        </Box>
      );
    } else if (skillNameLower.includes('ultra maratona') || skillNameLower.includes('ultra marathon')) {
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
          <DirectionsRun />
        </Box>
      );
    } else if (skillNameLower.includes('ironman') || skillNameLower.includes('triathlon')) {
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
          <EmojiEvents />
        </Box>
      );
    } else if (skillNameLower.includes('maratona') || skillNameLower.includes('marathon')) {
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
          <DirectionsRun />
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
          <DirectionsRun />
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
              
              {skill.currentRecord && (
                <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.9), mb: 1 }}>
                  Attuale: {skill.currentRecord}
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
                  <Speed fontSize="small" sx={{ mr: 0.5, opacity: 0.7 }} />
                  {skill.progressions.length} Livelli
                </Typography>
                
                {skill.personalBest && (
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
                    PB: {skill.personalBest}
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

export default CardioSkillsList;
