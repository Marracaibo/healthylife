import React from 'react';
import { Box, Typography, Paper, Button, Grid } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

interface FallbackExerciseViewProps {
  exerciseId: string;
  exerciseName: string;
  instructions?: string[];
}

/**
 * Componente di fallback quando non è possibile caricare le animazioni 3D
 * Mostra istruzioni base e informazioni statiche sull'esercizio
 */
const FallbackExerciseView: React.FC<FallbackExerciseViewProps> = ({ 
  exerciseId, 
  exerciseName, 
  instructions = [] 
}) => {
  // Istruzioni predefinite per alcuni esercizi comuni
  const commonExercises: Record<string, { instructions: string[], bodyPart: string, target: string }> = {
    'squat': {
      bodyPart: 'gambe',
      target: 'quadricipiti',
      instructions: [
        'Stai in piedi con i piedi alla larghezza delle spalle',
        'Abbassa i fianchi come se stessi per sederti su una sedia',
        'Mantieni la schiena dritta e le ginocchia dietro la punta dei piedi',
        'Spingi attraverso i talloni per tornare alla posizione di partenza'
      ]
    },
    'push-up': {
      bodyPart: 'petto',
      target: 'pettorali',
      instructions: [
        'Inizia in posizione di plank con le mani leggermente più larghe delle spalle',
        'Abbassa il corpo piegando i gomiti fino a quando il petto è vicino al pavimento',
        'Mantieni il corpo in linea retta durante l\'esercizio',
        'Spingi con le braccia per tornare alla posizione di partenza'
      ]
    },
    'deadlift': {
      bodyPart: 'schiena',
      target: 'lombari',
      instructions: [
        'Stai in piedi con i piedi alla larghezza delle anche e il bilanciere sopra i piedi',
        'Piega le ginocchia e i fianchi per afferrare il bilanciere con presa overhand',
        'Solleva il bilanciere mantenendo la schiena dritta e il core attivato',
        'Estendi completamente anche e ginocchia, poi inverti il movimento per tornare alla posizione iniziale'
      ]
    }
  };

  // Cerca informazioni per l'esercizio corrente o trova il più simile
  const getExerciseInfo = () => {
    const exerciseNameLower = exerciseName.toLowerCase();
    
    // Controlla corrispondenza esatta
    for (const [key, value] of Object.entries(commonExercises)) {
      if (exerciseNameLower.includes(key)) {
        return value;
      }
    }
    
    // Fallback alle istruzioni fornite o generiche
    return {
      bodyPart: 'corpo',
      target: 'muscoli',
      instructions: instructions.length > 0 ? instructions : [
        'Mantieni una postura corretta',
        'Respira regolarmente durante l\'esercizio',
        'Mantieni i muscoli coinvolti in tensione',
        'Esegui l\'esercizio con movimenti controllati'
      ]
    };
  };

  const exerciseInfo = getExerciseInfo();

  return (
    <Paper elevation={3} sx={{ p: 0, overflow: 'hidden', borderRadius: 2 }}>
      <Box sx={{ bgcolor: '#f5f9ff', p: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          {exerciseName}
        </Typography>
      </Box>
      
      <Grid container spacing={0}>
        <Grid item xs={12} md={6}>
          <Box 
            sx={{ 
              height: 300, 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              backgroundColor: '#fafafa',
              position: 'relative',
              flexDirection: 'column',
              p: 2
            }}
          >
            <FitnessCenterIcon sx={{ fontSize: 60, color: '#e0e0e0', mb: 2 }} />
            <Typography color="text.secondary" align="center">
              Animazione 3D non disponibile
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
              Le animazioni vengono caricate da ExerciseDB API.
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
              Dettagli
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Parte del corpo:
                  </Typography>
                  <Typography variant="body1">
                    {exerciseInfo.bodyPart}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Muscolo target:
                  </Typography>
                  <Typography variant="body1">
                    {exerciseInfo.target}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 500 }}>
                Istruzioni:
              </Typography>
              <ol style={{ paddingLeft: 16, margin: 0 }}>
                {exerciseInfo.instructions.map((instruction, index) => (
                  <li key={index}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {instruction}
                    </Typography>
                  </li>
                ))}
              </ol>
            </Box>
          </Box>
        </Grid>
      </Grid>
      
      <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderTop: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <InfoIcon sx={{ color: 'info.main', mr: 1, fontSize: 20 }} />
          <Typography variant="body2" color="text.secondary">
            Non è stato possibile caricare l'animazione 3D per questo esercizio. 
            Assicurati di essere connesso a internet e di aver configurato correttamente l'API ExerciseDB.
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default FallbackExerciseView;
