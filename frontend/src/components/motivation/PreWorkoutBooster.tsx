import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Chip,
  Card,
  CardContent,
  useTheme
} from '@mui/material';
import { 
  Favorite as FavoriteIcon,
  MusicNote as MusicNoteIcon,
  Videocam as VideocamIcon,
  FormatQuote as FormatQuoteIcon
} from '@mui/icons-material';

import { PreWorkoutBooster } from '../../types/motivation';

interface PreWorkoutBoosterProps {
  booster?: PreWorkoutBooster;
  onSelectBooster?: (booster: PreWorkoutBooster) => void;
}

const PreWorkoutBoosterComponent: React.FC<PreWorkoutBoosterProps> = ({ booster, onSelectBooster }) => {
  const theme = useTheme();

  const handleBoosterSelect = (booster: PreWorkoutBooster) => {    
    if (onSelectBooster) {
      onSelectBooster(booster);
    }
  };

  // Render l'icona appropriata in base al tipo di booster
  const renderBoosterTypeIcon = (type: 'audio' | 'video' | 'quote') => {
    switch (type) {
      case 'audio':
        return <MusicNoteIcon />;
      case 'video':
        return <VideocamIcon />;
      case 'quote':
        return <FormatQuoteIcon />;
      default:
        return <MusicNoteIcon />;
    }
  };

  // Render delle card dei booster
  return (
    <Card 
      elevation={3} 
      sx={{ 
        borderRadius: 2, 
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
        }
      }}
    >
      <CardContent sx={{ p: 0, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header del booster */}
        <Box 
          sx={{ 
            p: 2, 
            bgcolor: booster?.category === 'energy' ? '#4caf50' : 
                    booster?.category === 'focus' ? '#2196f3' : 
                    booster?.category === 'power' ? '#ff9800' : 
                    booster?.category === 'motivation' ? '#9c27b0' : 
                    theme.palette.primary.main,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Box 
            sx={{ 
              width: 40, 
              height: 40, 
              borderRadius: '50%', 
              bgcolor: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {renderBoosterTypeIcon(booster?.type || 'audio')}
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, flexGrow: 1 }}>
            {booster?.title || 'Booster'}
          </Typography>
          <Chip 
            label={booster?.intensity || 'normal'} 
            size="small" 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)', 
              color: 'white',
              fontWeight: 600,
              fontSize: '0.7rem',
              height: 24
            }} 
          />
        </Box>

        {/* Contenuto del booster */}
        <Box sx={{ p: 2, flexGrow: 1 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Speaker:</strong> {booster?.speaker || 'Coach'}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Durata:</strong> {booster?.duration || 0} secondi
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
            {booster?.tags?.map((tag, index) => (
              <Chip 
                key={index}
                label={tag}
                size="small"
                sx={{ 
                  bgcolor: theme.palette.grey[100],
                  fontSize: '0.7rem',
                  height: 24
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Footer con statistiche */}
        <Box 
          sx={{ 
            p: 2, 
            borderTop: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FavoriteIcon fontSize="small" color="error" />
            <Typography variant="body2" color="text.secondary">
              {booster?.likes || 0}
            </Typography>
          </Box>
          
          <Button 
            variant="contained" 
            size="small"
            onClick={() => booster && handleBoosterSelect(booster)}
            sx={{ 
              borderRadius: 4,
              textTransform: 'none',
              px: 2
            }}
          >
            Usa Booster
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PreWorkoutBoosterComponent;
