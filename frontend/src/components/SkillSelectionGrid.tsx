import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Chip,
  Badge,
  Fade,
  Paper,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import { CheckCircle, FitnessCenter, DirectionsRun, AccessibilityNew, SportsGymnastics } from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { SkillProgression } from '../types/skillProgression';

interface SkillSelectionGridProps {
  skills: SkillProgression[];
  selectedSkills: Array<{id: string, startLevel: number}>;
  onSkillSelect: (skillId: string) => void;
  onSkillLevelChange: (skillId: string, level: number) => void;
  filter?: 'all' | 'calisthenics' | 'cardio' | 'powerlifting' | 'mobility';
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'calisthenics':
      return <SportsGymnastics />;
    case 'cardio':
      return <DirectionsRun />;
    case 'powerlifting':
      return <FitnessCenter />;
    case 'mobility':
      return <AccessibilityNew />;
    default:
      return <FitnessCenter />;
  }
};

const SkillSelectionGrid: React.FC<SkillSelectionGridProps> = ({
  skills,
  selectedSkills,
  onSkillSelect,
  onSkillLevelChange,
  filter = 'all'
}) => {
  const theme = useTheme();
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  // Filtra le skill in base alla categoria selezionata
  const filteredSkills = filter === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === filter);

  return (
    <Grid container spacing={2}>
      {filteredSkills.map((skill) => {
        const isSelected = selectedSkills.some(s => s.id === skill.id);
        const selectedSkillIndex = selectedSkills.findIndex(s => s.id === skill.id);
        const selectedLevel = selectedSkillIndex >= 0 ? selectedSkills[selectedSkillIndex].startLevel : 1;
        
        return (
          <Grid item xs={12} sm={6} md={4} lg={3} key={skill.id}>
            <Card 
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.3s ease',
                ...(isSelected ? {
                  borderColor: theme.palette.primary.main,
                  borderWidth: 2,
                  borderStyle: 'solid',
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
                } : {}),
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: `0 8px 16px ${alpha(theme.palette.grey[900], 0.2)}`
                }
              }}
              onMouseEnter={() => setHoveredSkill(skill.id)}
              onMouseLeave={() => setHoveredSkill(null)}
              onClick={() => onSkillSelect(skill.id)}
            >
              {isSelected && (
                <Badge
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    zIndex: 2
                  }}
                  badgeContent={
                    <CheckCircle 
                      color="primary" 
                      sx={{ 
                        bgcolor: 'white', 
                        borderRadius: '50%', 
                        fontSize: 24 
                      }} 
                    />
                  }
                />
              )}
              
              <CardMedia
                component="img"
                height="140"
                image={skill.coverImage || `/images/skills/${skill.id}-cover.jpg`}
                alt={skill.name}
                sx={{ 
                  objectFit: 'cover',
                  ...(isSelected && {
                    opacity: 0.9
                  })
                }}
              />
              
              <Box 
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 140,
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0) 100%)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  p: 2
                }}
              >
                <Chip 
                  icon={getCategoryIcon(skill.category)}
                  label={{
                    'calisthenics': 'Calisthenics',
                    'powerlifting': 'Powerlifting',
                    'cardio': 'Cardio',
                    'mobility': 'Mobilità'
                  }[skill.category] || skill.category}
                  sx={{ 
                    bgcolor: alpha('#fff', 0.85),
                    '& .MuiChip-icon': {
                      color: {
                        'calisthenics': theme.palette.info.main,
                        'powerlifting': theme.palette.error.main,
                        'cardio': theme.palette.success.main,
                        'mobility': theme.palette.warning.main
                      }[skill.category] || theme.palette.primary.main
                    }
                  }}
                  size="small"
                />
                
                <Chip
                  size="small"
                  label={`Difficoltà: ${skill.difficultyLevel}/5`}
                  sx={{ 
                    ml: 1,
                    bgcolor: alpha('#fff', 0.85),
                    '& .MuiChip-label': {
                      color: {
                        1: theme.palette.success.main,
                        2: theme.palette.success.dark,
                        3: theme.palette.warning.main,
                        4: theme.palette.warning.dark,
                        5: theme.palette.error.main
                      }[skill.difficultyLevel] || theme.palette.text.primary
                    }
                  }}
                />
              </Box>
              
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  {skill.name}
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  {skill.description.length > 100 
                    ? `${skill.description.substring(0, 100)}...` 
                    : skill.description}
                </Typography>
              </CardContent>
              
              <Fade in={isSelected || hoveredSkill === skill.id}>
                <Box sx={{ p: 2, pt: 0 }}>
                  {isSelected && (
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Livello iniziale:
                      </Typography>
                      <Box display="flex" alignItems="center" mb={1}>
                        <FormControl fullWidth size="small">
                          <Select
                            value={selectedLevel}
                            onChange={(e) => onSkillLevelChange(skill.id, Number(e.target.value))}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {skill.steps.map((step, index) => (
                              <MenuItem key={step.id} value={index + 1}>
                                {index + 1}. {step.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                  )}
                  
                  {!isSelected && hoveredSkill === skill.id && (
                    <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                      Clicca per selezionare questa skill
                    </Typography>
                  )}
                </Box>
              </Fade>
            </Card>
          </Grid>
        );
      })}
      
      {filteredSkills.length === 0 && (
        <Grid item xs={12}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              textAlign: 'center',
              bgcolor: alpha(theme.palette.background.paper, 0.6) 
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Nessuna skill disponibile
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Non ci sono skill disponibili per questa categoria.
            </Typography>
          </Paper>
        </Grid>
      )}
    </Grid>
  );
};

export default SkillSelectionGrid;
