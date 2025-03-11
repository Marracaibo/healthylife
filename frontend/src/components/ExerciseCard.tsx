import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Chip, 
  IconButton,
  Collapse,
  Divider,
  Button,
  useTheme,
  alpha
} from '@mui/material';
import { 
  ExpandMore, 
  ExpandLess, 
  FitnessCenter, 
  PlayArrow, 
  AccessTime,
  Check
} from '@mui/icons-material';
import { Exercise } from '../types/workout';

interface ExerciseCardProps {
  exercise: Exercise;
  isExpanded: boolean;
  onToggle: () => void;
  isCompleted: boolean;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  isExpanded,
  onToggle,
  isCompleted
}) => {
  const theme = useTheme();
  const [isGifLoaded, setIsGifLoaded] = useState(false);
  const [showGif, setShowGif] = useState(false);

  const handleGifLoad = () => {
    setIsGifLoaded(true);
  };

  return (
    <Paper 
      elevation={isExpanded ? 3 : 1} 
      sx={{ 
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        border: isCompleted ? `1px solid ${alpha(theme.palette.success.main, 0.3)}` : 'none',
        position: 'relative'
      }}
    >
      {isCompleted && (
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 12, 
            right: 12, 
            zIndex: 1,
            backgroundColor: alpha(theme.palette.success.main, 0.1),
            borderRadius: '50%',
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Check fontSize="small" color="success" />
        </Box>
      )}
      
      <Box 
        sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          cursor: 'pointer',
          backgroundColor: isExpanded 
            ? alpha(theme.palette.primary.main, 0.05) 
            : 'transparent',
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.05)
          }
        }}
        onClick={onToggle}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box 
            sx={{ 
              backgroundColor: theme.palette.primary.main,
              color: '#fff',
              width: 40,
              height: 40,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <FitnessCenter />
          </Box>
          
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
              {exercise.name}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
              <Chip 
                label={exercise.category} 
                size="small" 
                color="primary" 
                variant="outlined" 
                sx={{ height: 20, fontSize: '0.625rem' }} 
              />
              
              {exercise.targetMuscles && exercise.targetMuscles.length > 0 && (
                <Chip 
                  label={exercise.targetMuscles.join(', ')} 
                  size="small" 
                  variant="outlined" 
                  sx={{ height: 20, fontSize: '0.625rem' }} 
                />
              )}
              
              {exercise.videoDuration && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AccessTime fontSize="small" sx={{ fontSize: 14, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {exercise.videoDuration}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
        
        <IconButton size="small" onClick={onToggle}>
          {isExpanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>
      
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <Divider />
        
        <Box sx={{ p: 2 }}>
          {/* GIF dell'esercizio */}
          {exercise.gifUrl && (
            <Box 
              sx={{ 
                mb: 2, 
                display: 'flex', 
                justifyContent: 'center',
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                height: showGif || !isGifLoaded ? 200 : 0,
                transition: 'height 0.3s ease'
              }}
            >
              {!isGifLoaded && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  backgroundColor: alpha(theme.palette.primary.main, 0.1)
                }}>
                  <Typography variant="caption" color="text.secondary">
                    Caricamento animazione...
                  </Typography>
                </Box>
              )}
              <img 
                src={exercise.gifUrl} 
                alt={`Animazione ${exercise.name}`}
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '200px', 
                  objectFit: 'contain',
                  display: isGifLoaded ? 'block' : 'none'
                }}
                onLoad={handleGifLoad}
              />
            </Box>
          )}
          
          {exercise.gifUrl && (
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              sx={{ 
                mb: 2, 
                borderRadius: 2,
                backgroundColor: showGif ? alpha(theme.palette.secondary.main, 0.1) : 'transparent'
              }}
              onClick={() => setShowGif(!showGif)}
            >
              {showGif ? 'Nascondi Animazione' : 'Mostra Animazione'}
            </Button>
          )}
          
          {exercise.description && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                Descrizione
              </Typography>
              <Typography variant="body2">
                {exercise.description || 'Nessuna descrizione disponibile'}
              </Typography>
            </Box>
          )}
          
          {/* Istruzioni e dettagli */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Dettagli
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {exercise.sets && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Serie
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {exercise.sets}
                  </Typography>
                </Box>
              )}
              {exercise.reps && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Ripetizioni
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {exercise.reps}
                  </Typography>
                </Box>
              )}
              {exercise.rest && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Recupero
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {exercise.rest}
                  </Typography>
                </Box>
              )}
              {exercise.tempo && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Tempo
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {exercise.tempo}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
          
          {exercise.videoUrl && (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<PlayArrow />}
              fullWidth
              sx={{ mt: 1, borderRadius: 2 }}
              href={exercise.videoUrl}
              target="_blank"
            >
              Guarda il Video dell'Esercizio
            </Button>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default ExerciseCard;
