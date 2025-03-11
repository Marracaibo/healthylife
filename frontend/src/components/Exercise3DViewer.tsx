import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Paper, Button, Grid } from '@mui/material';
import exerciseAPI from '../services/exerciseAPI';
import FallbackExerciseView from './FallbackExerciseView';

interface Exercise3DViewerProps {
  exerciseId: string;
  exerciseName: string;
}

const Exercise3DViewer: React.FC<Exercise3DViewerProps> = ({ exerciseId, exerciseName }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [exerciseDetails, setExerciseDetails] = useState<any>(null);

  useEffect(() => {
    const fetchExerciseDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Log per debug
        console.log(`Fetching exercise details for ID: ${exerciseId}`);
        
        // Verifica se l'ID è numerico o alfanumerico (formato corretto per ExerciseDB)
        const isValidId = /^[0-9a-zA-Z]+$/.test(exerciseId) && exerciseId.length > 3;
        
        if (!isValidId) {
          console.warn(`ID esercizio non valido: ${exerciseId}. L'API ExerciseDB richiede ID numerici o alfanumerici.`);
          setError(`ID esercizio non nel formato corretto. Contatta lo sviluppatore.`);
          setLoading(false);
          return;
        }
        
        // Ottieni dettagli dell'esercizio dall'API
        const details = await exerciseAPI.getExerciseById(exerciseId);
        
        if (details) {
          console.log('Exercise details retrieved:', details);
          setExerciseDetails(details);
        } else {
          console.error(`Nessun dettaglio trovato per l'ID: ${exerciseId}`);
          setError('Impossibile caricare i dettagli dell\'esercizio');
        }
      } catch (err) {
        console.error('Error fetching exercise details:', err);
        setError('Si è verificato un errore durante il caricamento dei dettagli dell\'esercizio');
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseDetails();
  }, [exerciseId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <FallbackExerciseView exerciseId={exerciseId} exerciseName={exerciseName} />;
  }

  return (
    <Paper elevation={3} sx={{ p: 0, overflow: 'hidden', borderRadius: 2 }}>
      <Box sx={{ bgcolor: '#f5f9ff', p: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          {exerciseName}
        </Typography>
      </Box>
      
      <Grid container spacing={0}>
        {/* Animazione */}
        <Grid item xs={12} md={6}>
          <Box 
            sx={{ 
              height: 300, 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              backgroundColor: '#fafafa',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {exerciseDetails?.gifUrl ? (
              <img 
                src={exerciseDetails.gifUrl} 
                alt={exerciseDetails.name}
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
              />
            ) : (
              <Typography color="text.secondary">
                Nessuna animazione disponibile
              </Typography>
            )}
          </Box>
        </Grid>
        
        {/* Dettagli */}
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
                    {exerciseDetails?.bodyPart || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Muscolo target:
                  </Typography>
                  <Typography variant="body1">
                    {exerciseDetails?.target || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Attrezzatura necessaria:
                  </Typography>
                  <Typography variant="body1">
                    {exerciseDetails?.equipment || 'Nessuna'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            
            {exerciseDetails?.secondaryMuscles?.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Muscoli secondari:
                </Typography>
                <Typography variant="body1">
                  {exerciseDetails.secondaryMuscles.join(', ')}
                </Typography>
              </Box>
            )}
            
            {exerciseDetails?.instructions?.length > 0 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 500 }}>
                  Istruzioni:
                </Typography>
                <ol style={{ paddingLeft: 16, margin: 0 }}>
                  {exerciseDetails.instructions.slice(0, 3).map((instruction: string, index: number) => (
                    <li key={index}>
                      <Typography variant="body2">
                        {instruction}
                      </Typography>
                    </li>
                  ))}
                </ol>
                {exerciseDetails.instructions.length > 3 && (
                  <Button 
                    size="small" 
                    sx={{ mt: 1 }}
                  >
                    Mostra tutte le istruzioni
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Exercise3DViewer;
