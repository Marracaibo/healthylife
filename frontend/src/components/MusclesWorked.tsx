import React, { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Tab, Tabs } from '@mui/material';

interface MusclesWorkedProps {
  exerciseId: string;
  exerciseName: string;
}

// Database con i muscoli coinvolti per ogni esercizio
const musclesDatabase: Record<string, {
  target: string;
  synergists: string[];
  stabilizers?: string[];
  dynamicStabilizers?: string[];
  anatomyImage?: string;
}> = {
  'squat-variations': {
    target: 'Quadricipiti',
    synergists: ['Glutei', 'Erettori spinali', 'Adduttori', 'Hamstring'],
    stabilizers: ['Addominali', 'Lombari', 'Obliqui', 'Trasverso dell\'addome'],
    anatomyImage: '/gif/anatomysquat.jfif'
  },
  'horizontal-pull': {
    target: 'Latissimus Dorsi',
    synergists: ['Infraspinatus', 'Teres Minor', 'Teres Major', 'Posterior Deltoid', 'Trapezius', 'Rhomboids', 'Levator Scapulae', 'Biceps Brachii', 'Brachialis', 'Brachioradialis', 'Pectoralis Minor'],
    stabilizers: ['Rectus Abdominis', 'External oblique', 'Internal oblique'],
    dynamicStabilizers: ['Triceps'],
    anatomyImage: '/gif/rowanatomy.jfif'
  },
  'horizontal-push': {
    target: 'Pettorali',
    synergists: ['Deltoide anteriore', 'Tricipiti'],
    stabilizers: ['Addominali', 'Rotatori della cuffia'],
    anatomyImage: '/gif/anatomypushup.jfif'
  },
  'lunge-variations': {
    target: 'Quadricipiti',
    synergists: ['Glutei', 'Hamstring', 'Adduttori'],
    stabilizers: ['Core', 'Lombari']
  },
  'plank-variations': {
    target: 'Retto addominale',
    synergists: ['Obliqui', 'Trasverso dell\'addome'],
    stabilizers: ['Erettori spinali', 'Glutei']
  },
  'hollow-body-crunch': {
    target: 'Retto addominale',
    synergists: ['Obliqui', 'Flessori dell\'anca', 'Quadricipiti'],
    stabilizers: ['Lombari', 'Trasverso dell\'addome']
  },
  'pull-up': {
    target: 'Latissimus Dorsi',
    synergists: ['Infraspinatus', 'Teres Minor', 'Teres Major', 'Posterior Deltoid', 'Trapezius', 'Rhomboids', 'Levator Scapulae', 'Biceps Brachii', 'Brachialis', 'Brachioradialis', 'Pectoralis Minor'],
    stabilizers: ['Rectus Abdominis', 'External oblique', 'Internal oblique'],
    dynamicStabilizers: ['Triceps'],
    anatomyImage: '/gif/anatomypullup.jfif'
  }
};

// Mappe dei muscoli generici (usati quando non abbiamo immagini specifiche)
const genericMuscleImages = {
  'upper-body': {
    anatomyImage: 'https://static.vecteezy.com/system/resources/previews/000/553/532/original/male-muscular-system-full-anatomical-body-diagram-vector.jpg'
  },
  'lower-body': {
    anatomyImage: 'https://static.vecteezy.com/system/resources/previews/000/553/532/original/male-muscular-system-full-anatomical-body-diagram-vector.jpg'
  },
  'core': {
    anatomyImage: 'https://static.vecteezy.com/system/resources/previews/000/553/532/original/male-muscular-system-full-anatomical-body-diagram-vector.jpg'
  }
};

const MusclesWorked: React.FC<MusclesWorkedProps> = ({ exerciseId, exerciseName }) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Cerca una corrispondenza basata sull'ID o sul nome dell'esercizio
  const getMusclesInfo = () => {
    // Per il pull-up, usiamo specificamente quell'entry
    if (exerciseId.includes('pull') || exerciseName.toLowerCase().includes('pull')) {
      return musclesDatabase['pull-up'];
    }
    
    // Controlla per corrispondenza diretta dell'ID
    if (musclesDatabase[exerciseId]) {
      return musclesDatabase[exerciseId];
    }
    
    // Controlla per corrispondenza parziale del nome
    const exerciseNameLower = exerciseName.toLowerCase();
    for (const key in musclesDatabase) {
      if (exerciseNameLower.includes(key.replace('-', ' ')) || 
          key.includes(exerciseNameLower.replace(' ', '-'))) {
        return musclesDatabase[key];
      }
    }
    
    // Fallback a informazioni generiche
    return {
      target: 'Muscoli primari',
      synergists: ['Muscoli sinergici'],
      stabilizers: ['Muscoli stabilizzatori'],
      anatomyImage: genericMuscleImages['upper-body'].anatomyImage
    };
  };
  
  const musclesInfo = getMusclesInfo();
  
  // Determina quale immagine usare (locale o generica)
  const getMuscleImage = () => {
    if (musclesInfo.anatomyImage) {
      return musclesInfo.anatomyImage;
    }
    
    // Fallback a immagini generiche
    return genericMuscleImages['upper-body'].anatomyImage;
  };
  
  const renderMusclesList = (
    title: string, 
    color: string, 
    muscles: string[] | undefined
  ) => {
    if (!muscles || muscles.length === 0) return null;
    
    return (
      <Box sx={{ mb: 1 }}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            backgroundColor: color, 
            color: '#fff', 
            p: 0.5, 
            pl: 1, 
            borderRadius: 1 
          }}
        >
          {title}
        </Typography>
        <List dense disablePadding>
          {muscles.map((muscle, index) => (
            <ListItem key={index} sx={{ py: 0 }}>
              <ListItemText 
                primary={muscle} 
                primaryTypographyProps={{ 
                  variant: 'body2',
                  sx: { fontWeight: title.includes('Target') ? 'bold' : 'normal' }
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    );
  };
  
  return (
    <Box 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden',
        borderRadius: 1,
        p: 2
      }}
    >
      <Typography variant="h6" sx={{ mb: 1, fontSize: '1rem', fontWeight: 600 }}>
        MUSCOLI COINVOLTI IN {exerciseName.toUpperCase()}
      </Typography>
      
      <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ mb: 2 }}>
        <Tab label="Anatomia" />
        <Tab label="Dettagli" />
      </Tabs>
      
      {tabValue === 0 && (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            flexGrow: 1,
            overflow: 'hidden'
          }}
        >
          <img 
            src={getMuscleImage()} 
            alt={`Muscoli coinvolti in ${exerciseName}`} 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '100%', 
              objectFit: 'contain' 
            }}
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = genericMuscleImages['upper-body'].anatomyImage;
            }}
          />
        </Box>
      )}
      
      {tabValue === 1 && (
        <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
          {renderMusclesList(
            `Target - ${musclesInfo.target}`, 
            '#d32f2f', 
            [musclesInfo.target]
          )}
          
          {renderMusclesList(
            'Synergisti', 
            '#1976d2', 
            musclesInfo.synergists
          )}
          
          {renderMusclesList(
            'Stabilizzatori', 
            '#00acc1', 
            musclesInfo.stabilizers
          )}
          
          {renderMusclesList(
            'Stabilizzatori Dinamici', 
            '#00bfa5', 
            musclesInfo.dynamicStabilizers
          )}
        </Box>
      )}
    </Box>
  );
};

export default MusclesWorked;
