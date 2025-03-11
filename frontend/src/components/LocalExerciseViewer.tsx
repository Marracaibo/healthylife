import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, CircularProgress } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

interface LocalExerciseViewerProps {
  exerciseId: string;
  exerciseName: string;
}

/**
 * Componente che mostra GIF locali degli esercizi
 * Non dipende dall'API ExerciseDB
 */
const LocalExerciseViewer: React.FC<LocalExerciseViewerProps> = ({ 
  exerciseId, 
  exerciseName 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Istruzioni ed informazioni per esercizi comuni
  const exerciseInfo: Record<string, { 
    bodyPart: string; 
    target: string; 
    instructions: string[];
  }> = {
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
    'pull-up': {
      bodyPart: 'schiena',
      target: 'dorsali',
      instructions: [
        'Afferra la sbarra con le mani rivolte lontano da te',
        'Appendi il corpo con le braccia completamente estese',
        'Tira il corpo verso l\'alto fino a quando il mento supera la sbarra',
        'Abbassa il corpo lentamente con controllo'
      ]
    },
    'deadlift': {
      bodyPart: 'schiena',
      target: 'lombari',
      instructions: [
        'Stai in piedi con i piedi alla larghezza delle anche e il bilanciere sopra i piedi',
        'Piega le ginocchia e i fianchi per afferrare il bilanciere con presa overhand',
        'Solleva il bilanciere mantenendo la schiena dritta e il core attivato',
        'Estendi completamente anche e ginocchia, poi inverti il movimento'
      ]
    },
    'bench-press': {
      bodyPart: 'petto',
      target: 'pettorali',
      instructions: [
        'Sdraiati sulla panca con i piedi sul pavimento',
        'Afferra il bilanciere con una presa leggermente più ampia delle spalle',
        'Abbassa il bilanciere al petto, quindi spingilo fino all\'estensione completa delle braccia',
        'Mantieni i polsi dritti e le scapole retratte durante tutto l\'esercizio'
      ]
    },
    'shoulder-press': {
      bodyPart: 'spalle',
      target: 'deltoidi',
      instructions: [
        'Siedi su una panca con supporto per la schiena o in piedi con i piedi alla larghezza delle spalle',
        'Tieni i manubri all\'altezza delle spalle con i palmi rivolti in avanti',
        'Spingi i pesi verso l\'alto fino all\'estensione completa delle braccia',
        'Abbassa i pesi lentamente alla posizione di partenza'
      ]
    },
    'lunges': {
      bodyPart: 'gambe',
      target: 'quadricipiti',
      instructions: [
        'Stai in piedi con i piedi alla larghezza delle anche',
        'Fai un passo avanti con una gamba e abbassa il corpo fino a quando entrambe le ginocchia formano un angolo di 90 gradi',
        'Mantieni il busto eretto e le spalle rilassate',
        'Spingi attraverso il tallone anteriore per tornare alla posizione di partenza'
      ]
    },
    'plank': {
      bodyPart: 'core',
      target: 'addominali',
      instructions: [
        'Posizionati in appoggio sugli avambracci e sulla punta dei piedi',
        'Mantieni il corpo in una linea retta dalla testa ai talloni',
        'Contrai il core e i glutei per mantenere la posizione',
        'Respira normalmente e mantieni la posizione'
      ]
    }
  };

  // Trova l'esercizio più simile in base al nome
  const getExerciseData = () => {
    const exerciseNameLower = exerciseName.toLowerCase();
    
    // Cerca una corrispondenza esatta o parziale nel nome dell'esercizio
    for (const [key, data] of Object.entries(exerciseInfo)) {
      if (exerciseNameLower.includes(key)) {
        return { ...data, found: true };
      }
    }
    
    // Se non trovato, restituisci dati generici
    return {
      bodyPart: 'corpo',
      target: 'muscoli',
      instructions: [
        'Mantieni una postura corretta',
        'Respira regolarmente durante l\'esercizio',
        'Mantieni i muscoli coinvolti in tensione',
        'Esegui l\'esercizio con movimenti controllati'
      ],
      found: false
    };
  };

  const exercise = getExerciseData();

  // Simuliamo il caricamento per una migliore esperienza utente
  useEffect(() => {
    setLoading(true);
    
    // Simuliamo un breve caricamento
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [exerciseId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

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
              p: 2,
              flexDirection: 'column'
            }}
          >
            <FitnessCenterIcon sx={{ fontSize: 80, color: '#e0e0e0', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" align="center" gutterBottom>
              {exerciseName}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Esegui questo esercizio seguendo le istruzioni dettagliate →
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
                    {exercise.bodyPart}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Muscolo target:
                  </Typography>
                  <Typography variant="body1">
                    {exercise.target}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 500 }}>
                Istruzioni:
              </Typography>
              <ol style={{ paddingLeft: 16, margin: 0 }}>
                {exercise.instructions.map((instruction, index) => (
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
    </Paper>
  );
};

export default LocalExerciseViewer;
