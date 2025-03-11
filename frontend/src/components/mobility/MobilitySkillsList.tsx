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
import { MobilitySkill } from '../../types/mobilitySkill';
import { ArrowForward, BlurOn, FitnessCenter } from '@mui/icons-material';

interface MobilitySkillsListProps {
  skills: MobilitySkill[];
  onSelectSkill: (skill: MobilitySkill) => void;
}

const MobilitySkillsList: React.FC<MobilitySkillsListProps> = ({ skills, onSelectSkill }) => {
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

  // Icone personalizzate per diversi tipi di mobilitu00e0
  const getSkillIcon = (skillName: string) => {
    const skillNameLower = skillName.toLowerCase();
    
    // Controlla prima se esiste un'icona nella cartella /icons
    let iconPath = '';
    
    if (skillNameLower.includes('spaccata') || skillNameLower.includes('split')) {
      iconPath = '/icons/flexibility.png';
    } else if (skillNameLower.includes('ponte') || skillNameLower.includes('bridge')) {
      iconPath = '/icons/bridge.png';
    } else if (skillNameLower.includes('firefly') || skillNameLower.includes('lucciola')) {
      iconPath = '/icons/firefly-pose.png';
      // Assicuriamoci che l'URL sia codificato correttamente
      iconPath = iconPath.replace(/ /g, '%20');
    } else if (skillNameLower.includes('scorpion') || skillNameLower.includes('scorpione')) {
      iconPath = '/icons/scorpion-pose.png';
      // Assicuriamoci che l'URL sia codificato correttamente
      iconPath = iconPath.replace(/ /g, '%20');
    } else if (skillNameLower.includes('flessibilitu00e0') || skillNameLower.includes('flexibility')) {
      iconPath = '/icons/flexibility.png';
    } else if (skillNameLower.includes('mobilitu00e0') || skillNameLower.includes('mobility')) {
      iconPath = '/icons/flexibility.png';
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
            target.src = '/icons/flexibility.png'; // Icona generica di fallback
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
    
    // Fallback alle icone SVG predefinite
    if (skillNameLower.includes('spaccata') || skillNameLower.includes('split')) {
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
            <path d="M17 5.92L9 2V20H11V12L17 15.08V5.92Z" fill="currentColor"/>
            <path d="M13 2V9L21 13V6L13 2Z" fill="currentColor"/>
          </svg>
        </Box>
      );
    } else if (skillNameLower.includes('ponte') || skillNameLower.includes('bridge')) {
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
            <path d="M6 8H4V18H6V8Z" fill="currentColor"/>
            <path d="M20 8H18V18H20V8Z" fill="currentColor"/>
            <path d="M15.5 3.08C14.68 2.9 13.74 3.2 13 4C11.46 5.7 12.42 8.51 12.67 9.67L8.08 13.08C7.16 12.83 4.3 12.17 3 14C2.26 14.74 1.9 15.68 2.08 16.5C2.26 17.32 2.93 17.96 3.76 18.11C4.59 18.26 5.45 17.97 6 17.41C7.5 15.91 6.9 13 6.75 12.08L11.33 8.67C12.25 8.92 15.1 9.58 16.4 7.75C17.14 7.01 17.5 6.07 17.32 5.25C17.14 4.43 16.47 3.79 15.64 3.64C15.59 3.63 15.55 3.62 15.5 3.62V3.08Z" fill="currentColor"/>
          </svg>
        </Box>
      );
    } else if (skillNameLower.includes('firefly') || skillNameLower.includes('lucciola')) {
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
          <FitnessCenter />
        </Box>
      );
    } else if (skillNameLower.includes('scorpion') || skillNameLower.includes('scorpione')) {
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
          <FitnessCenter />
        </Box>
      );
    } else if (skillNameLower.includes('shoulder') || skillNameLower.includes('spalle')) {
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
            <path d="M12 4C13.1046 4 14 3.10457 14 2C14 0.895431 13.1046 0 12 0C10.8954 0 10 0.895431 10 2C10 3.10457 10.8954 4 12 4Z" fill="currentColor"/>
            <path d="M20 17L18 17L17 11L14 10L14 15C14 15.5523 13.5523 16 13 16L11 16C10.4477 16 10 15.5523 10 15L10 10L7 11L6 17L4 17C3.44771 17 3 17.4477 3 18C3 18.5523 3.44771 19 4 19L6 19L8 19L10 19L14 19L16 19L18 19L20 19C20.5523 19 21 18.5523 21 18C21 17.4477 20.5523 17 20 17Z" fill="currentColor"/>
          </svg>
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
          <FitnessCenter />
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

export default MobilitySkillsList;
