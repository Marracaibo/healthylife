import React, { useState, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  IconButton, 
  Grid,
  Chip,
  Divider,
  Card,
  CardContent,
  Slider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon, 
  VolumeUp as VolumeUpIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  MusicNote as MusicNoteIcon,
  Videocam as VideocamIcon,
  FormatQuote as FormatQuoteIcon,
  Add as AddIcon
} from '@mui/icons-material';

import { PreWorkoutBooster } from '../../types/motivation';

// Dati di esempio per il Pre-Workout Booster
const sampleBoosters: PreWorkoutBooster[] = [
  {
    id: 'booster-1',
    title: 'Energia Massima',
    type: 'audio',
    content: '/audio/boosters/energy-max.mp3',
    speaker: 'Marco Trainer',
    duration: 45,
    intensity: 'extreme',
    category: 'energy',
    tags: ['energia', 'potenza', 'forza'],
    plays: 1245,
    likes: 356
  },
  {
    id: 'booster-2',
    title: 'Focus Mentale',
    type: 'audio',
    content: '/audio/boosters/mental-focus.mp3',
    speaker: 'Laura Coach',
    duration: 30,
    intensity: 'moderate',
    category: 'focus',
    tags: ['concentrazione', 'mente', 'chiarezza'],
    plays: 987,
    likes: 241
  },
  {
    id: 'booster-3',
    title: 'Potenza Esplosiva',
    type: 'audio',
    content: '/audio/boosters/explosive-power.mp3',
    speaker: 'Andrea Pro',
    duration: 60,
    intensity: 'intense',
    category: 'power',
    tags: ['esplosività', 'potenza', 'adrenalina'],
    plays: 1653,
    likes: 420
  },
  {
    id: 'booster-4',
    title: 'Motivazione da Campione',
    type: 'quote',
    content: 'Non contano le dimensioni del cane nella lotta, è la dimensione della lotta nel cane che conta!',
    speaker: 'Mark Trainer',
    intensity: 'extreme',
    category: 'motivation',
    tags: ['motivazione', 'determinazione', 'grinta'],
    plays: 2156,
    likes: 589
  }
];

interface PreWorkoutBoosterProps {
  onSelectBooster?: (booster: PreWorkoutBooster) => void;
}

const PreWorkoutBoosterComponent: React.FC<PreWorkoutBoosterProps> = ({ onSelectBooster }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeBooster, setActiveBooster] = useState<PreWorkoutBooster | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState<number>(80);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleBoosterSelect = (booster: PreWorkoutBooster) => {
    setActiveBooster(booster);
    setIsPlaying(false);
    
    if (onSelectBooster) {
      onSelectBooster(booster);
    }
  };

  const handlePlayPause = () => {
    if (!activeBooster) return;
    
    if (activeBooster.type === 'audio') {
      if (isPlaying) {
        audioRef.current?.pause();
      } else {
        audioRef.current?.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    const newVol = newValue as number;
    setVolume(newVol);
    
    if (audioRef.current) {
      audioRef.current.volume = newVol / 100;
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

  // Render del contenuto del booster attivo
  const renderActiveBoosterContent = () => {
    if (!activeBooster) {
      return (
        <Box sx={{ 
          height: 200, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          bgcolor: theme.palette.grey[100],
          borderRadius: 2,
          p: 3
        }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Seleziona un booster per iniziare
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Un boost motivazionale prima del tuo allenamento ti aiuterà a dare il massimo!
          </Typography>
        </Box>
      );
    }

    return (
      <Paper 
        elevation={3} 
        sx={{ 
          p: isMobile ? 2 : 3, 
          mb: isMobile ? 2 : 4, 
          borderRadius: 2,
          backgroundImage: 'linear-gradient(135deg, #6b73ff 10%, #000dff 100%)',
          color: 'white'
        }}
      >
        <Grid container spacing={isMobile ? 1 : 2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <Typography 
              variant={isMobile ? "subtitle1" : "h6"} 
              sx={{ 
                fontWeight: 'bold', 
                display: 'flex', 
                alignItems: 'center',
                fontSize: isMobile ? '1rem' : '1.25rem'
              }}
            >
              {activeBooster.type === 'audio' && <MusicNoteIcon sx={{ mr: 1 }} />}
              {activeBooster.type === 'video' && <VideocamIcon sx={{ mr: 1 }} />}
              {activeBooster.type === 'quote' && <FormatQuoteIcon sx={{ mr: 1 }} />}
              {activeBooster.title}
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                opacity: 0.9, 
                mt: 0.5,
                fontSize: isMobile ? '0.8rem' : '0.875rem'
              }}
            >
              {activeBooster.speaker}
            </Typography>
            
            {activeBooster.type === 'quote' && (
              <Typography 
                variant="body1" 
                sx={{ 
                  fontStyle: 'italic', 
                  mt: 2, 
                  p: 2, 
                  backgroundColor: 'rgba(255,255,255,0.1)', 
                  borderRadius: 1,
                  fontSize: isMobile ? '1rem' : '1.1rem',
                  lineHeight: 1.6 
                }}
              >
                "{activeBooster.content}"
              </Typography>
            )}
          </Grid>
        </Grid>
      </Paper>
    );
  };

  // Renderizzo l'interfaccia UI
  return (
    <Box>
      <Typography 
        variant={isMobile ? "h5" : "h4"} 
        component="h2" 
        gutterBottom 
        sx={{ 
          fontWeight: 700, 
          textAlign: isMobile ? 'center' : 'left',
          mb: isMobile ? 2 : 3,
          fontSize: isMobile ? '1.5rem' : '2.125rem'
        }}
      >
        Pre-Workout Booster
      </Typography>

      {/* Player attivo */}
      {activeBooster && (
        renderActiveBoosterContent()
      )}

      {/* Lista dei boosters */}
      <Grid container spacing={isMobile ? 2 : 3}>
        {sampleBoosters.map((booster) => (
          <Grid item key={booster.id} xs={12} sm={6} md={4} lg={3}>
            <Card 
              sx={{ 
                mb: 2, 
                cursor: 'pointer',
                borderLeft: activeBooster?.id === booster.id 
                  ? `4px solid ${theme.palette.primary.main}` 
                  : 'none',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateX(5px)',
                  boxShadow: 3
                }
              }}
              onClick={() => handleBoosterSelect(booster)}
            >
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%', 
                      bgcolor: theme.palette.primary.light,
                      mr: 2
                    }}
                  >
                    {renderBoosterTypeIcon(booster.type)}
                  </Box>
                  
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2">
                      {booster.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Chip 
                        label={booster.intensity} 
                        size="small" 
                        sx={{ 
                          height: 20, 
                          fontSize: '0.6rem',
                          mr: 1
                        }} 
                      />
                      <Typography variant="caption" color="text.secondary">
                        {booster.type === 'audio' && booster.duration 
                          ? `${Math.floor(booster.duration / 60)}:${(booster.duration % 60).toString().padStart(2, '0')}`
                          : booster.category}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                      {booster.likes}
                    </Typography>
                    <FavoriteIcon fontSize="small" sx={{ color: theme.palette.grey[500] }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
        
        <Grid item xs={12}>
          <Button 
            variant="outlined" 
            fullWidth 
            startIcon={<AddIcon />}
            sx={{ mt: 2 }}
          >
            Visualizza tutti i boosters
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PreWorkoutBoosterComponent;
