import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Paper,
  alpha
} from '@mui/material';
import { EmojiEvents } from '@mui/icons-material';
import { SkillProgression } from '../types/skillProgression';
import { useTheme } from '@mui/material/styles';

interface SkillSelectionSectionProps {
  skillProgressions: SkillProgression[];
  selectedSkills: Array<{id: string, startLevel: number}>;
  handleSkillSelect: (skillId: string) => void;
  daysPerWeek: number;
  setDaysPerWeek: (days: number) => void;
  programDetails: {
    name: string;
    description: string;
    [key: string]: any;
  };
  setProgramDetails: (details: any) => void;
  generateWorkoutFromSelectedSkills: () => void;
}

const SkillSelectionSection: React.FC<SkillSelectionSectionProps> = ({
  skillProgressions,
  selectedSkills,
  handleSkillSelect,
  daysPerWeek,
  setDaysPerWeek,
  programDetails,
  setProgramDetails,
  generateWorkoutFromSelectedSkills
}) => {
  const theme = useTheme();

  return (
    <>
      {/* Sezione per la selezione delle skill */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          borderRadius: 2, 
          mb: 4,
          border: '1px solid',
          borderColor: theme.palette.divider
        }}
      >
        <Typography variant="h6" fontWeight="500" color="primary" mb={2}>
          Seleziona le Skill da Imparare
        </Typography>
        <Typography variant="body2" mb={3}>
          Scegli le skill che desideri padroneggiare. Genereremo automaticamente un programma 
          di allenamento personalizzato per aiutarti a raggiungere i tuoi obiettivi.
        </Typography>
        
        <Grid container spacing={2}>
          {skillProgressions.map((skill) => (
            <Grid item xs={12} sm={6} md={4} key={skill.id}>
              <Card 
                variant="outlined"
                sx={{ 
                  borderColor: selectedSkills.some(s => s.id === skill.id) 
                    ? theme.palette.primary.main 
                    : theme.palette.divider,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: theme.palette.primary.light,
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  },
                  bgcolor: selectedSkills.some(s => s.id === skill.id) 
                    ? alpha(theme.palette.primary.main, 0.1) 
                    : 'transparent'
                }}
                onClick={() => handleSkillSelect(skill.id)}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    {skill.iconUrl && (
                      <Box 
                        component="img" 
                        src={skill.iconUrl} 
                        alt={skill.name}
                        sx={{ width: 24, height: 24, mr: 1 }}
                      />
                    )}
                    <Typography variant="subtitle1" fontWeight="500">
                      {skill.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{mb: 1}} noWrap>
                    {skill.description}
                  </Typography>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="caption" color="text.secondary">
                      Difficoltà: {"★".repeat(skill.difficultyLevel)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {skill.estimatedTimeToAchieve}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
      
      {/* Sezione parametri della scheda */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          borderRadius: 2, 
          mb: 4,
          border: '1px solid',
          borderColor: theme.palette.divider
        }}
      >
        <Typography variant="h6" fontWeight="500" color="primary" mb={2}>
          Parametri della Scheda
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nome della scheda"
              variant="outlined"
              value={programDetails.name}
              onChange={(e) => setProgramDetails({...programDetails, name: e.target.value})}
              margin="normal"
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal" size="small">
              <InputLabel>Giorni settimanali</InputLabel>
              <Select
                value={daysPerWeek}
                label="Giorni settimanali"
                onChange={(e) => setDaysPerWeek(Number(e.target.value))}
              >
                {[2, 3, 4, 5, 6].map(num => (
                  <MenuItem key={num} value={num}>{num} giorni</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descrizione"
              variant="outlined"
              value={programDetails.description}
              onChange={(e) => setProgramDetails({...programDetails, description: e.target.value})}
              margin="normal"
              multiline
              rows={2}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Button 
              variant="contained" 
              color="primary"
              fullWidth
              disabled={selectedSkills.length === 0}
              onClick={generateWorkoutFromSelectedSkills}
              startIcon={<EmojiEvents />}
              size="large"
              sx={{ py: 1.5 }}
            >
              Genera Scheda dalle Skill Selezionate
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default SkillSelectionSection;
