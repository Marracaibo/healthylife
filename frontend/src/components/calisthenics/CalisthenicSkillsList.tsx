import React from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  Grid, 
  Avatar, 
  LinearProgress, 
  IconButton,
  SvgIcon
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { ArrowForward, FitnessCenter } from '@mui/icons-material';
import { CalisthenicsSkill } from '../../types/calisthenicsSkill';
import { SkillProgression } from '../../types/skillProgression';

interface CalisthenicSkillsListProps {
  skills: CalisthenicsSkill[] | SkillProgression[];
  onSelectSkill: (skill: CalisthenicsSkill | SkillProgression) => void;
}

const SkillIcon: React.FC<{ skill: CalisthenicsSkill | SkillProgression }> = ({ skill }) => {
  // Usa l'icona dalla skill progression se disponibile
  if ('iconUrl' in skill && skill.iconUrl) {
    return (
      <Box
        component="img"
        src={skill.iconUrl}
        alt={skill.name}
        onError={(e) => {
          // In caso di errore nel caricamento dell'immagine, sostituisci con un'icona generica
          const target = e.target as HTMLImageElement;
          target.onerror = null; // Previene loop infiniti
          target.src = '/icons/strength.png'; // Icona generica di fallback
        }}
        sx={{
          width: '48px',
          height: '48px',
          objectFit: 'contain',
          backgroundColor: 'transparent',
          borderRadius: '50%',
          padding: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      />
    );
  }
  
  // Controlla anche la proprietà 'icon' per le CalisthenicsSkill
  if ('icon' in skill && skill.icon) {
    return (
      <Box
        component="img"
        src={skill.icon}
        alt={skill.name}
        onError={(e) => {
          // In caso di errore nel caricamento dell'immagine, sostituisci con un'icona generica
          const target = e.target as HTMLImageElement;
          target.onerror = null; // Previene loop infiniti
          target.src = '/icons/strength.png'; // Icona generica di fallback
        }}
        sx={{
          width: '48px',
          height: '48px',
          objectFit: 'contain',
          backgroundColor: 'transparent',
          borderRadius: '50%',
          padding: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      />
    );
  }
  
  // Mappa delle icone basata sul nome della skill
  const skillNameLower = skill.name.toLowerCase();
  let iconPath = '';
  
  if (skillNameLower.includes('muscle up')) {
    iconPath = '/icons/muscleup.png';
  } else if (skillNameLower.includes('front lever')) {
    iconPath = '/icons/frontlever.png';
  } else if (skillNameLower.includes('back lever')) {
    iconPath = '/icons/backlever.png';
  } else if (skillNameLower.includes('pistol') || skillNameLower.includes('squat')) {
    iconPath = '/icons/squats.png';
  } else if (skillNameLower.includes('handstand') || skillNameLower.includes('verticale')) {
    iconPath = '/icons/handstand.png';
  } else if (skillNameLower.includes('v-sit') || skillNameLower.includes('flessibilità')) {
    iconPath = '/icons/flexibility.png';
  } else if (skillNameLower.includes('pull up') || skillNameLower.includes('trazione')) {
    iconPath = '/icons/pull-up.png';
  } else if (skillNameLower.includes('human flag')) {
    iconPath = '/icons/human%20flag.png';
  } else if (skillNameLower.includes('push up') || skillNameLower.includes('piegamento')) {
    iconPath = '/icons/pushup.png';
  } else if (skillNameLower.includes('one arm handstand')) {
    iconPath = '/icons/one%20arm%20handstand.png';
  } else if (skillNameLower.includes('iron cross')) {
    iconPath = '/icons/iron%20cross.png';
  } else if (skillNameLower.includes('planche') || skillNameLower.includes('plank')) {
    iconPath = '/icons/plank.png';
  } else if (skillNameLower.includes('dip')) {
    iconPath = '/icons/dip.png';
  } else if (skillNameLower.includes('correr') || skillNameLower.includes('run')) {
    iconPath = '/icons/running.png';
  } else if (skillNameLower.includes('panca')) {
    iconPath = '/icons/panca%20piana.png';
  }
  
  // Se abbiamo trovato un'icona corrispondente, la mostriamo
  if (iconPath) {
    return (
      <Box
        component="img"
        src={iconPath}
        alt={skill.name}
        onError={(e) => {
          // In caso di errore nel caricamento dell'immagine, sostituisci con un'icona generica
          const target = e.target as HTMLImageElement;
          target.onerror = null; // Previene loop infiniti
          target.src = '/icons/strength.png'; // Icona generica di fallback
        }}
        sx={{
          width: '48px',
          height: '48px',
          objectFit: 'contain',
          backgroundColor: 'transparent',
          borderRadius: '50%',
          padding: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      />
    );
  }
  
  // Fallback alle icone SVG predefinite
  if (skillNameLower.includes('muscle up')) {
    return (
      <SvgIcon viewBox="0 0 24 24">
        <path d="M13,4.2V3C13,2.4 12.6,2 12,2V4.2C9.8,4.6 8,6.6 8,9C8,11.4 9.8,13.4 12,13.8V20H11V22H13V13.8C15.2,13.4 17,11.4 17,9C17,6.6 15.2,4.6 13,4.2M12,6A3,3 0 0,1 15,9A3,3 0 0,1 12,12A3,3 0 0,1 9,9A3,3 0 0,1 12,6M12,7A2,2 0 0,0 10,9A2,2 0 0,0 12,11A2,2 0 0,0 14,9A2,2 0 0,0 12,7Z" />
      </SvgIcon>
    );
  } else if (skillNameLower.includes('front lever')) {
    return (
      <SvgIcon viewBox="0 0 24 24">
        <path d="M11,3V7H13V3H11M4.9,13.1L6.3,14.5L9.15,11.65L7.75,10.25L4.9,13.1M19.1,13.1L16.25,10.25L14.85,11.65L17.7,14.5L19.1,13.1M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8M12,18C11.42,19.83 10.36,20 8,20C5.64,20 4.58,19.83 4,18C4,17.06 6.13,14.67 8,14C9.87,14.67 12,17.06 12,18Z" />
      </SvgIcon>
    );
  } else if (skillNameLower.includes('verticale') || skillNameLower.includes('handstand')) {
    return (
      <SvgIcon viewBox="0 0 24 24">
        <path d="M13,4.2V3C13,2.4 12.6,2 12,2V4.2C9.8,4.6 8,6.6 8,9C8,11.4 9.8,13.4 12,13.8V20H11V22H13V13.8C15.2,13.4 17,11.4 17,9C17,6.6 15.2,4.6 13,4.2M12,6A3,3 0 0,1 15,9A3,3 0 0,1 12,12A3,3 0 0,1 9,9A3,3 0 0,1 12,6M12,7A2,2 0 0,0 10,9A2,2 0 0,0 12,11A2,2 0 0,0 14,9A2,2 0 0,0 12,7Z" />
      </SvgIcon>
    );
  } else if (skillNameLower.includes('correr') || skillNameLower.includes('5km')) {
    return (
      <SvgIcon viewBox="0 0 24 24">
        <path d="M13.5,5.5C14.59,5.5 15.5,4.58 15.5,3.5C15.5,2.38 14.59,1.5 13.5,1.5C12.39,1.5 11.5,2.38 11.5,3.5C11.5,4.58 12.39,5.5 13.5,5.5M9.89,19.38L10.89,15L13,17V23H15V15.5L12.89,13.5L13.5,10.5C14.79,12 16.79,13 19,13V11C17.09,11 15.5,10 14.69,8.58L13.69,7C13.29,6.38 12.69,6 12,6C11.69,6 11.5,6.08 11.19,6.08L6,8.28V13H8V9.58L9.79,8.88L8.19,17L3.29,16L2.89,18L9.89,19.38Z" />
      </SvgIcon>
    );
  } else if (skillNameLower.includes('panca') || skillNameLower.includes('bench')) {
    return (
      <SvgIcon viewBox="0 0 24 24">
        <path d="M20.57,14.86L22,13.43L20.57,12L17,15.57L8.43,7L12,3.43L10.57,2L9.14,3.43L7.71,2L5.57,4.14L4.14,2.71L2.71,4.14L4.14,5.57L2,7.71L3.43,9.14L2,10.57L3.43,12L7,8.43L15.57,17L12,20.57L13.43,22L14.86,20.57L16.29,22L18.43,19.86L19.86,21.29L21.29,19.86L19.86,18.43L22,16.29L20.57,14.86Z" />
      </SvgIcon>
    );
  } else {
    // Icona predefinita
    return (
      <Box sx={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <FitnessCenter />
      </Box>
    );
  }
};

const CalisthenicSkillsList: React.FC<CalisthenicSkillsListProps> = ({
  skills,
  onSelectSkill,
}) => {
  const theme = useTheme();

  // Mappa dei colori sfumati per ogni skill
  const getSkillGradient = (skillName: string) => {
    const skillNameLower = skillName.toLowerCase();
    
    if (skillNameLower.includes('muscle up')) {
      return `linear-gradient(135deg, ${alpha('#4a148c', 0.05)} 0%, ${alpha('#7b1fa2', 0.2)} 100%)`;
    } else if (skillNameLower.includes('front lever')) {
      return `linear-gradient(135deg, ${alpha('#b71c1c', 0.05)} 0%, ${alpha('#e57373', 0.2)} 100%)`;
    } else if (skillNameLower.includes('verticale')) {
      return `linear-gradient(135deg, ${alpha('#1565c0', 0.05)} 0%, ${alpha('#42a5f5', 0.2)} 100%)`;
    } else if (skillNameLower.includes('correr')) {
      return `linear-gradient(135deg, ${alpha('#2e7d32', 0.05)} 0%, ${alpha('#66bb6a', 0.2)} 100%)`;
    } else if (skillNameLower.includes('panca')) {
      return `linear-gradient(135deg, ${alpha('#ef6c00', 0.05)} 0%, ${alpha('#ffa726', 0.2)} 100%)`;
    } else {
      return `linear-gradient(135deg, ${alpha(theme.palette.grey[700], 0.05)} 0%, ${alpha(theme.palette.grey[500], 0.2)} 100%)`;
    }
  };

  return (
    <Box sx={{ py: 2 }}>
      <Grid container spacing={2}>
        {skills.map((skill) => (
          <Grid item xs={12} key={skill.id}>
            <Card 
              onClick={() => onSelectSkill(skill)}
              sx={{ 
                display: 'flex', 
                p: 1.5, 
                boxShadow: 'none', 
                border: '1px solid',
                borderColor: theme.palette.divider,
                borderRadius: 2,
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                background: getSkillGradient(skill.name)
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  width: '100%',
                  position: 'relative',
                  zIndex: 1
                }}
              >
                <Avatar 
                  sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    width: 56, 
                    height: 56,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid rgba(255,255,255,0.8)',
                    boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
                    '& .MuiSvgIcon-root': {
                      fontSize: '1.8rem'
                    }
                  }}
                >
                  <SkillIcon skill={skill} />
                </Avatar>
                <Box sx={{ flex: 1, ml: 2 }}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {skill.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    <Box sx={{ flex: 1, mr: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={'progress' in skill ? skill.progress : 0} 
                        sx={{ 
                          height: 6, 
                          borderRadius: 3,
                          bgcolor: alpha(theme.palette.grey[500], 0.2),
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 3,
                          }
                        }}
                      />
                    </Box>
                    <Typography variant="caption" fontWeight="bold" color="text.secondary">
                      {'progress' in skill ? `${skill.progress}%` : ''}
                    </Typography>
                  </Box>
                </Box>
                <IconButton 
                  size="small" 
                  edge="end" 
                  sx={{ 
                    ml: 1,
                    color: theme.palette.text.secondary
                  }}
                >
                  <ArrowForward fontSize="small" />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CalisthenicSkillsList;
