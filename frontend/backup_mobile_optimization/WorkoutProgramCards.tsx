import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Chip, 
  LinearProgress,
  useTheme,
  alpha,
  styled,
  keyframes,
  Badge,
  IconButton,
  Tooltip,
  Zoom,
  useMediaQuery
} from '@mui/material';
import { 
  FitnessCenter, 
  AccessTime, 
  ArrowForward,
  Star,
  StarBorder,
  InfoOutlined,
  AddCircleOutline
} from '@mui/icons-material';
import { WorkoutProgram } from '../types/workout';
import { useNavigate } from 'react-router-dom';

interface WorkoutProgramCardsProps {
  programs: WorkoutProgram[];
  currentProgram?: string;
  onSelectProgram: (program: WorkoutProgram) => void;
}

// Animations
const zoomIn = keyframes`
  from { transform: scale(1); }
  to { transform: scale(1.03); }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled components
const AnimatedCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
  borderRadius: 12,
  overflow: 'visible',
  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  animation: `${fadeInUp} 0.6s ease-out both`,
  marginBottom: 16,
  '&:hover': {
    animation: `${zoomIn} 0.2s forwards`,
    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15), 0 8px 10px rgba(0, 0, 0, 0.1)',
    '& .card-content': {
      transform: 'translateY(-5px)',
    },
    '& .start-button': {
      opacity: 1,
      transform: 'translateY(0)',
    }
  }
}));

const CardOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)',
  zIndex: 1
}));

const ProgramChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  right: 16,
  fontWeight: 600,
  zIndex: 2
}));

const DifficultyChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  left: 16,
  fontWeight: 600,
  zIndex: 2
}));

const CategoryBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 56,
  left: 16,
  background: alpha(theme.palette.common.white, 0.2),
  backdropFilter: 'blur(4px)',
  padding: '4px 10px',
  borderRadius: 20,
  color: 'white',
  fontSize: '0.75rem',
  fontWeight: 600,
  zIndex: 2
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  marginTop: 'auto',
  transition: 'transform 0.3s ease',
}));

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return 'success';
    case 'intermediate':
      return 'warning';
    case 'advanced':
      return 'error';
    default:
      return 'primary';
  }
};

const getDifficultyLabel = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return 'Principiante';
    case 'intermediate':
      return 'Intermedio';
    case 'advanced':
      return 'Avanzato';
    default:
      return difficulty;
  }
};

const getProgramImage = (programId: string) => {
  const imageMap: {[key: string]: string} = {
    'body-transformation': 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=1000',
    'strength-building': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1000',
    'hiit-cardio': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000',
    'yoga-flexibility': 'https://images.unsplash.com/photo-1607962837359-5e7e89f86776?q=80&w=1000',
    'fat-loss': 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1000'
  };
  
  return imageMap[programId] || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000';
};

const WorkoutProgramCards: React.FC<WorkoutProgramCardsProps> = ({ 
  programs, 
  currentProgram,
  onSelectProgram 
}) => {
  const theme = useTheme();
  const [hoveredProgram, setHoveredProgram] = useState<string | null>(null);
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Funzione per calcolare il progresso
  const getProgress = (programId: string): number => {
    // Per esempio basato sul programma attivo
    if (programId === currentProgram) {
      // More visible for demonstration
      return 30;
    }
    return 0;
  };

  // Funzione per gestire il click su un programma
  const handleProgramClick = (programId: string) => {
    // Call the onSelectProgram with the entire program object instead of just the ID
    const selectedProgram = programs.find(program => program.id === programId);
    if (selectedProgram) {
      onSelectProgram(selectedProgram);
    }
  };

  // Funzione per renderizzare le stelle di difficoltà
  const renderDifficultyStars = (difficulty: string) => {
    const difficultyMap: Record<string, number> = {
      'beginner': 1,
      'intermediate': 2,
      'advanced': 3
    };
    
    const stars = difficultyMap[difficulty] || 1;
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {[...Array(3)].map((_, index) => (
          index < stars ? 
            <Star key={index} fontSize="small" sx={{ color: theme.palette.warning.main }} /> : 
            <StarBorder key={index} fontSize="small" color="disabled" />
        ))}
      </Box>
    );
  };

  // Traduzione delle difficoltà
  const difficultyTranslation: Record<string, string> = {
    'beginner': 'Principiante',
    'intermediate': 'Intermedio',
    'advanced': 'Avanzato'
  };

  return (
    <Grid container spacing={isMobile ? 2 : 4} sx={{ py: isMobile ? 1 : 2 }}>
      {programs.map((program, index) => {
        const isActive = program.id === currentProgram;
        const animationDelay = index * 0.1;
        
        // Calculate fake progress for UI demo
        const progress = getProgress(program.id);
        
        return (
          <Grid item xs={12} sm={6} md={4} key={program.id} sx={{ mb: isMobile ? 1 : 2 }}>
            <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
              <AnimatedCard 
                sx={{ 
                  animationDelay: `${animationDelay}s`,
                  border: isActive ? 2 : 0,
                  borderColor: isActive ? 'primary.main' : 'transparent',
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onClick={() => handleProgramClick(program.id)}
                onMouseOver={() => !isMobile && setHoveredProgram(program.id)}
                onMouseOut={() => !isMobile && setHoveredProgram(null)}
                onTouchStart={() => isMobile && setHoveredProgram(program.id)}
                onTouchEnd={() => isMobile && setHoveredProgram(null)}
              >
                <CardMedia
                  component="img"
                  height={isMobile ? "160" : "220"}
                  image={getProgramImage(program.id)}
                  alt={program.name}
                  sx={{ 
                    objectFit: 'cover',
                  }}
                />
                
                {/* Difficulty badge */}
                <DifficultyChip
                  label={getDifficultyLabel(program.difficulty)}
                  size="small"
                  variant="filled"
                  color={getDifficultyColor(program.difficulty) as "success" | "warning" | "error" | "primary"}
                  sx={{
                    fontSize: isMobile ? '0.65rem' : '0.75rem',
                    height: isMobile ? 24 : 32
                  }}
                />
                
                {/* Category badge */}
                <CategoryBadge 
                  sx={{
                    fontSize: isMobile ? '0.65rem' : '0.75rem',
                    height: isMobile ? 24 : 32,
                    maxWidth: isMobile ? '70%' : '80%',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden'
                  }}
                >
                  {program.category}
                </CategoryBadge>
                
                <StyledCardContent 
                  className="card-content" 
                  sx={{ 
                    flexGrow: 1, 
                    p: isMobile ? 2 : 3,
                    pb: isMobile ? 0 : 3
                  }}
                >
                  <Typography 
                    variant={isMobile ? "h6" : "h5"}
                    component="h2" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 700,
                      fontSize: isMobile ? '1rem' : '1.25rem'
                    }}
                  >
                    {program.name}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: isMobile ? 1 : 2,
                      height: isMobile ? 48 : 60,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: isMobile ? 2 : 3,
                      WebkitBoxOrient: 'vertical',
                      fontSize: isMobile ? '0.8rem' : '0.875rem'
                    }}
                  >
                    {program.description.split('.')[0] + '.'}
                  </Typography>
                  
                  <Grid container spacing={isMobile ? 1 : 2} sx={{ mb: isMobile ? 1 : 2 }}>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="caption" color="text.secondary" gutterBottom>
                          Durata
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 600,
                            fontSize: isMobile ? '0.8rem' : '0.875rem'
                          }}
                        >
                          {program.duration} {program.duration === 1 ? 'settimana' : 'settimane'}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="caption" color="text.secondary" gutterBottom>
                          Fasi
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 600,
                            fontSize: isMobile ? '0.8rem' : '0.875rem'
                          }}
                        >
                          {program.phases?.length || 0}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  
                  {isActive && (
                    <Box sx={{ width: '100%', mt: 1, mb: isMobile ? 1 : 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontWeight: 600,
                            fontSize: isMobile ? '0.65rem' : '0.75rem'
                          }}
                        >
                          Progresso
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontWeight: 600, 
                            color: 'primary.main',
                            fontSize: isMobile ? '0.65rem' : '0.75rem'
                          }}
                        >
                          {progress}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={progress} 
                        sx={{ 
                          height: isMobile ? 6 : 8, 
                          borderRadius: 4,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            bgcolor: theme.palette.primary.main,
                          }
                        }} 
                      />
                    </Box>
                  )}
                </StyledCardContent>
                
                {/* Contenitore per il pulsante con margini uniformi */}
                <Box sx={{ 
                  width: '100%', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  px: 2,
                  mb: 2 
                }}>
                  <Button
                    variant={isActive ? "contained" : "outlined"}
                    color={isActive ? "success" : "primary"}
                    onClick={() => navigate('/workout')}
                    sx={{
                      py: isMobile ? 1 : 1.5,
                      px: 3,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: isMobile ? '0.85rem' : '1rem',
                      boxShadow: isActive ? theme.shadows[4] : 'none',
                      backgroundColor: isActive ? '#4caf50' : 'transparent',
                      color: isActive ? '#fff' : theme.palette.primary.main,
                      minWidth: '180px',
                      width: '80%',
                      '&:hover': {
                        backgroundColor: isActive ? '#43a047' : alpha(theme.palette.primary.main, 0.1),
                        transform: 'translateY(-2px)',
                        boxShadow: isActive ? theme.shadows[6] : theme.shadows[2],
                      }
                    }}
                    startIcon={isActive ? <FitnessCenter /> : <AddCircleOutline />}
                  >
                    {isActive ? "Continua Programma" : "Inizia Programma"}
                  </Button>
                </Box>
              </AnimatedCard>
            </Zoom>
          </Grid>
        );
      })}
      
      {/* Card per programmi futuri */}
      <Grid item xs={12} sm={6} md={4} sx={{ mb: isMobile ? 1 : 2 }}>
        <Zoom in={true} style={{ transitionDelay: `${programs.length * 100}ms` }}>
          <AnimatedCard 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              p: isMobile ? 3 : 4,
              textAlign: 'center',
              border: '2px dashed',
              borderColor: alpha(theme.palette.primary.main, 0.3),
              backgroundColor: alpha(theme.palette.background.paper, 0.7),
              boxShadow: 'none',
              overflow: 'visible',
            }}
          >
            <AddCircleOutline 
              sx={{ 
                fontSize: isMobile ? 40 : 60, 
                color: alpha(theme.palette.primary.main, 0.5), 
                mb: isMobile ? 1 : 2 
              }} 
            />
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              component="h3" 
              gutterBottom 
              sx={{ fontWeight: 600 }}
            >
              Nuovi Programmi in Arrivo
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ 
                mb: isMobile ? 1 : 2,
                fontSize: isMobile ? '0.85rem' : '1rem'
              }}
            >
              Presto disponibili programmi specifici per i tuoi obiettivi di fitness.
            </Typography>
          </AnimatedCard>
        </Zoom>
      </Grid>
    </Grid>
  );
};

export default WorkoutProgramCards;
