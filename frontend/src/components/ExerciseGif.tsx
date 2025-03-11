import React, { useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

interface ExerciseGifProps {
  exerciseId: string;
  exerciseName: string;
  gifUrl?: string;
}

/**
 * Componente che visualizza una GIF o video dell'esercizio.
 * Utilizza le GIF e video scaricati localmente.
 */
const ExerciseGif: React.FC<ExerciseGifProps> = ({ exerciseId, exerciseName, gifUrl }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Lista delle GIF e video disponibili localmente - aggiornata con tutti i file disponibili e le estensioni corrette
  const availableAssets = [
    // GIF formattate (correzione dell'estensione esattamente come nel filesystem)
    { name: 'horizontal-pull', ext: 'gif.gif' },
    { name: 'horizontal-push', ext: 'gif.gif' },
    { name: 'lunge-variations', ext: 'gif.gif' },
    { name: 'plank-variations', ext: 'gif.gif' },
    { name: 'squat-variations', ext: 'gif.jfif' },
    
    // File JFIF
    { name: 'anatomypullup', ext: 'jfif' },
    { name: 'anatomypushup', ext: 'jfif' },
    { name: 'anatomysquat', ext: 'jfif' },
    { name: 'rowanatomy', ext: 'jfif' },
    
    // File MP4
    { name: '33021201', ext: 'mp4' },
    { name: 'AboveHeadChestStretch', ext: 'mp4' },
    { name: 'Band AssistedPull-Up', ext: 'mp4' },
    { name: 'BodyweightStandingCalf Raise', ext: 'mp4' },
    { name: 'Clap Push Up', ext: 'mp4' },
    { name: 'Hanging Straight Leg Raise', ext: 'mp4' },
    { name: 'JumpingJack', ext: 'mp4' },
    { name: 'Single Arm Push-up', ext: 'mp4' },
    { name: 'Suspended Abdominal Fallout', ext: 'mp4' },
    { name: 'TricepsPress', ext: 'mp4' },
    { name: 'anatomycrunch', ext: 'mp4' },
    { name: 'anatomyplank', ext: 'mp4' },
    { name: 'archerpushup', ext: 'mp4' },
    { name: 'bulgariansquat', ext: 'mp4' },
    { name: 'burpee', ext: 'mp4' },
    { name: 'chestdip', ext: 'mp4' },
    { name: 'chinup', ext: 'mp4' },
    { name: 'closegripushup', ext: 'mp4' },
    { name: 'cobrapose', ext: 'mp4' },
    { name: 'diamondpushup', ext: 'mp4' },
    { name: 'diponchair', ext: 'mp4' },
    { name: 'handstandpushup', ext: 'mp4' },
    { name: 'hollowhold', ext: 'mp4' },
    { name: 'jumprope', ext: 'mp4' },
    { name: 'jumpsquat', ext: 'mp4' },
    { name: 'kneepushup', ext: 'mp4' },
    { name: 'legraises', ext: 'mp4' },
    { name: 'lsit', ext: 'mp4' },
    { name: 'lunge', ext: 'mp4' },
    { name: 'pikepushup', ext: 'mp4' },
    { name: 'pseudopushup', ext: 'mp4' },
    { name: 'sidelunge', ext: 'mp4' },
    { name: 'singlelagsquat', ext: 'mp4' },
    { name: 'singlelegdeadlift', ext: 'mp4' },
    { name: 'sit', ext: 'mp4' },
    { name: 'squat', ext: 'mp4' },
    { name: 'widehandpushup', ext: 'mp4' }
  ];

  // Determina il percorso dell'asset
  const getAssetPath = () => {
    // Cerca di abbinare l'ID o il nome dell'esercizio con gli asset disponibili
    const exerciseNameLower = exerciseName.toLowerCase().replace(/[-\s]+/g, '');
    const exerciseIdLower = exerciseId.toLowerCase().replace(/[-\s]+/g, '');
    
    let assetName = '';
    let assetExt = '';
    
    // Controlla se c'è una corrispondenza diretta con l'ID o una corrispondenza parziale nel nome
    for (const asset of availableAssets) {
      const formattedAsset = asset.name.toLowerCase().replace(/[-\s]+/g, '');
      
      if (exerciseIdLower === formattedAsset || 
          exerciseIdLower.includes(formattedAsset) || 
          formattedAsset.includes(exerciseIdLower) ||
          exerciseNameLower.includes(formattedAsset) || 
          formattedAsset.includes(exerciseNameLower)) {
        assetName = asset.name;
        assetExt = asset.ext;
        break;
      }
    }
    
    // Se abbiamo trovato una corrispondenza, costruisci il percorso
    if (assetName) {
      return { 
        path: `/gif/${assetName}.${assetExt}`, 
        type: assetExt === 'mp4' ? 'mp4' : 'image' 
      };
    }
    
    // Se è stato fornito un URL esterno, usalo come fallback
    if (gifUrl) {
      return { 
        path: gifUrl, 
        type: gifUrl.endsWith('.mp4') ? 'mp4' : 'image' 
      };
    }
    
    // Nessun asset disponibile
    return { path: '', type: '' };
  };

  const { path: assetPath, type: assetType } = getAssetPath();

  const handleMediaLoad = () => {
    setLoading(false);
  };

  const handleMediaError = () => {
    setLoading(false);
    setError(true);
    console.error(`Failed to load media: ${assetPath}`);
  };

  return (
    <Box 
      sx={{ 
        position: 'relative',
        height: 200,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 1,
        overflow: 'hidden'
      }}
      // Rimuoviamo aria-hidden per evitare problemi di accessibilità
      role="figure"
      aria-label={`Animazione dell'esercizio ${exerciseName}`}
    >
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            zIndex: 1,
          }}
        >
          <CircularProgress size={40} />
        </Box>
      )}
      
      {error ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%',
            p: 2,
            textAlign: 'center'
          }}
        >
          <FitnessCenterIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Animazione non disponibile per questo esercizio
          </Typography>
        </Box>
      ) : (
        assetPath && (
          assetType === 'mp4' ? (
            <video
              src={assetPath}
              autoPlay
              loop
              muted
              playsInline
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                display: loading ? 'none' : 'block'
              }}
              onLoadedData={handleMediaLoad}
              onError={handleMediaError}
              aria-label={`Video dell'esercizio ${exerciseName}`}
            />
          ) : (
            <img
              src={assetPath}
              alt={`Animazione dell'esercizio ${exerciseName}`}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                display: loading ? 'none' : 'block'
              }}
              onLoad={handleMediaLoad}
              onError={handleMediaError}
            />
          )
        )
      )}
    </Box>
  );
};

export default ExerciseGif;
