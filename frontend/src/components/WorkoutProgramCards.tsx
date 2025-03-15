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
  useMediaQuery, 
  styled, 
  keyframes,
  Zoom as ZoomTransition,
  useTheme,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { AddCircleOutline, FitnessCenter, HourglassEmpty, Delete, Edit } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export interface WorkoutProgramCardData {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  category: string;
  image: string;
  progress: number;
  fav: number;
  isAvailable: boolean;
  isCustom?: boolean; 
  type?: string; // Tipo di programma: ipertrofia, skill progression, ecc.
}

export interface WorkoutProgramCardsProps {
  programs: WorkoutProgramCardData[];
  currentProgram?: string;
  onSelectProgram: (program: WorkoutProgramCardData) => void;
  onDeleteProgram?: (programId: string) => void; 
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
const AnimatedCard = styled(Card)(() => ({
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

const CategoryBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 56,
  left: 16,
  background: theme.palette.common.white,
  backdropFilter: 'blur(4px)',
  padding: '4px 10px',
  borderRadius: 20,
  color: theme.palette.primary.main,
  fontSize: '0.75rem',
  fontWeight: 600,
  zIndex: 2
}));

// Tab per il livello di difficoltà
/* Componente non utilizzato, commentato per evitare errori di lint
const ProgramTypeTab = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 16,
  background: theme.palette.common.white,
  padding: '4px 12px',
  borderRadius: '0 0 12px 12px',
  color: theme.palette.primary.main,
  fontSize: '0.7rem',
  fontWeight: 700,
  zIndex: 2,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
}));
*/

const StyledCardContent = styled(CardContent)(() => ({
  position: 'relative',
  zIndex: 2,
  marginTop: 'auto',
  transition: 'transform 0.3s ease',
}));

const DifficultyChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  left: 16,
  fontWeight: 600,
  zIndex: 2
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

// Funzione per ottenere l'etichetta del tipo di programma
/* Funzione non utilizzata, commentata per evitare errori di lint
const getProgramTypeLabel = (type?: string) => {
  if (!type) return '';
  
  switch (type.toLowerCase()) {
    case 'hypertrophy':
    case 'ipertrofia':
      return 'Ipertrofia';
    case 'strength':
    case 'forza':
      return 'Forza';
    case 'endurance':
    case 'resistenza':
      return 'Resistenza';
    case 'skill':
    case 'skill progression':
      return 'Skill Progression';
    case 'weight loss':
    case 'dimagrimento':
      return 'Dimagrimento';
    case 'cardio':
      return 'Cardio';
    case 'mobility':
    case 'mobilità':
      return 'Mobilità';
    default:
      return type;
  }
};
*/

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
  onSelectProgram,
  onDeleteProgram 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [activeProgram, setActiveProgram] = useState<string | undefined>(currentProgram);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<string | null>(null);

  // Filtra i programmi duplicati in base all'ID
  const workoutPrograms = programs.filter((program, index, self) => 
    index === self.findIndex((p) => p.id === program.id)
  );

  const handleProgramClick = (programId: string) => {
    const selectedProgram = workoutPrograms.find(p => p.id === programId);
    if (selectedProgram) {
      setActiveProgram(programId);
      onSelectProgram(selectedProgram);
    }
  };

  // Funzione per aprire il dialog di conferma eliminazione
  const handleDeleteClick = (event: React.MouseEvent, programId: string) => {
    event.stopPropagation(); // Impedisce che il click si propaghi alla card
    setProgramToDelete(programId);
    setDeleteDialogOpen(true);
  };

  // Funzione per confermare l'eliminazione
  const confirmDelete = () => {
    if (programToDelete && onDeleteProgram) {
      onDeleteProgram(programToDelete);
      setProgramToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  // Funzione per annullare l'eliminazione
  const cancelDelete = () => {
    setProgramToDelete(null);
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Grid container spacing={isMobile ? 2 : 3}>
        {workoutPrograms.map((program, index) => {
          const isActive = program.id === activeProgram;
          const progress = program.progress;
          
          return (
            <Grid item xs={12} sm={6} md={4} key={program.id} sx={{ mb: isMobile ? 1 : 2 }}>
              <ZoomTransition in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                <AnimatedCard 
                  sx={{
                    cursor: 'pointer',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onClick={() => handleProgramClick(program.id)}
                >
                  {/* Pulsante di eliminazione per i programmi personalizzati */}
                  {program.isCustom && onDeleteProgram && (
                    <IconButton 
                      aria-label="delete"
                      onClick={(e) => handleDeleteClick(e, program.id)}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        zIndex: 10,
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          color: theme.palette.error.main
                        }
                      }}
                    >
                      <Delete />
                    </IconButton>
                  )}

                  <CardMedia
                    component="img"
                    height={isMobile ? "160" : "220"}
                    image={getProgramImage(program.id)}
                    alt={program.title}
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
                      {program.title}
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
                            Categoria
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 600,
                              fontSize: isMobile ? '0.8rem' : '0.875rem'
                            }}
                          >
                            {program.category}
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
                              color: 'primary',
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
                            bgcolor: 'primary',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 4,
                              bgcolor: 'primary',
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
                    {program.isAvailable ? (
                      <Button
                        variant={isActive ? "contained" : "outlined"}
                        color={isActive ? "success" : "primary"}
                        onClick={() => handleProgramClick(program.id)}
                        sx={{
                          py: isMobile ? 1 : 1.5,
                          px: 3,
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                          fontSize: isMobile ? '0.85rem' : '1rem',
                          boxShadow: isActive ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                          backgroundColor: isActive ? '#4caf50' : 'transparent',
                          color: isActive ? '#fff' : 'primary',
                          minWidth: '180px',
                          width: '80%',
                          '&:hover': {
                            backgroundColor: isActive ? '#43a047' : 'primary',
                            transform: 'translateY(-2px)',
                            boxShadow: isActive ? '0 4px 8px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.1)',
                          }
                        }}
                        startIcon={isActive ? <FitnessCenter /> : <AddCircleOutline />}
                      >
                        {isActive ? "Continua Programma" : "Inizia Programma"}
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        disabled
                        sx={{
                          py: isMobile ? 1 : 1.5,
                          px: 3,
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                          fontSize: isMobile ? '0.85rem' : '1rem',
                          minWidth: '180px',
                          width: '80%',
                          color: 'text.disabled',
                          borderColor: 'divider',
                        }}
                        startIcon={<HourglassEmpty />}
                      >
                        Work in Progress
                      </Button>
                    )}
                  </Box>
                </AnimatedCard>
              </ZoomTransition>
            </Grid>
          );
        })}
        
        {/* Card per creare un nuovo programma personalizzato */}
        <Grid item xs={12} sm={6} md={4} sx={{ mb: isMobile ? 1 : 2 }}>
          <ZoomTransition in={true} style={{ transitionDelay: `${workoutPrograms.length * 100}ms` }}>
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
                borderColor: 'primary',
                backgroundColor: 'background.paper',
                boxShadow: 'none',
                overflow: 'visible',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'success.main',
                  '& .create-icon': {
                    color: 'success.main',
                    transform: 'scale(1.1) rotate(90deg)'
                  }
                }
              }}
              onClick={() => navigate('/workout-builder')}
            >
              <Edit 
                className="create-icon"
                sx={{ 
                  fontSize: isMobile ? 40 : 60, 
                  color: 'primary', 
                  mb: isMobile ? 1 : 2,
                  transition: 'all 0.3s ease'
                }} 
              />
              <Typography 
                variant={isMobile ? "h6" : "h5"} 
                component="h3" 
                gutterBottom 
                sx={{ fontWeight: 600 }}
              >
                Crea il Tuo Programma
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ 
                  mb: isMobile ? 1 : 2,
                  fontSize: isMobile ? '0.85rem' : '1rem'
                }}
              >
                Personalizza un programma di allenamento in base alle tue esigenze e obiettivi.
              </Typography>
              <Button
                variant="contained"
                color="success"
                startIcon={<AddCircleOutline />}
                sx={{
                  mt: 2,
                  py: 1,
                  px: 3,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: isMobile ? '0.85rem' : '1rem',
                }}
              >
                Inizia a Creare
              </Button>
            </AnimatedCard>
          </ZoomTransition>
        </Grid>
      </Grid>
      
      {/* Dialog di conferma eliminazione */}
      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Conferma eliminazione"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Sei sicuro di voler eliminare questo programma di allenamento? Questa azione non può essere annullata.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Annulla
          </Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            Elimina
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default WorkoutProgramCards;
