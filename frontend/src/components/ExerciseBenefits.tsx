import React from 'react';
import { Box, Typography } from '@mui/material';

interface ExerciseBenefitsProps {
  exerciseId: string;
  exerciseName: string;
}

// Database dei benefici degli esercizi in italiano
const benefitsDatabase: Record<string, {
  description: string;
  benefits: string[];
}> = {
  'horizontal-pull': {
    description: 'Il rematore è un esercizio composto che lavora principalmente sulla parte superiore della schiena e sulle braccia, sviluppando forza e massa muscolare.',
    benefits: [
      'Rinforza i muscoli della schiena e delle ali (dorsali)',
      'Migliora la postura e previene problemi causati da debolezza muscolare',
      'Aumenta la forza generale del corpo',
      'Sviluppa la forza di presa delle mani',
      'Rafforza le braccia e i polsi',
      'Contribuisce a creare una silhouette a V del tronco'
    ]
  },
  'pull-up': {
    description: 'La trazione è uno degli esercizi composti più efficaci, che coinvolge quasi tutti i gruppi muscolari della parte superiore del corpo, fornendo sia ipertrofia che forza a corpo libero.',
    benefits: [
      'Rinforza i muscoli della schiena e delle ali (dorsali)',
      'Migliora la postura e previene problemi come la protrusione scapolare',
      'Aumenta la forza generale e la stabilità del core',
      'Offre benefici cardiovascolari quando eseguito a intervalli',
      'Sviluppa la forza di presa delle mani',
      'Rafforza braccia e polsi',
      'Contribuisce a creare una silhouette a V del tronco'
    ]
  },
  'squat-variations': {
    description: 'Lo squat è un esercizio fondamentale per la parte inferiore del corpo che rafforza gambe, glutei e core, migliorando la stabilità e la funzionalità quotidiana.',
    benefits: [
      'Aumenta forza e massa muscolare di gambe e glutei',
      'Migliora l\'equilibrio e la stabilità',
      'Aumenta la densità ossea e previene l\'osteoporosi',
      'Brucia molte calorie grazie all\'attivazione di grandi gruppi muscolari',
      'Sviluppa la forza funzionale utile nelle attività quotidiane',
      'Migliora la mobilità di anche, ginocchia e caviglie'
    ]
  },
  'horizontal-push': {
    description: 'I piegamenti (push-up) sono un esercizio completo che rafforza petto, spalle, tricipiti e core senza necessità di attrezzature.',
    benefits: [
      'Sviluppa forza e massa muscolare di petto, spalle e braccia',
      'Rinforza il core e migliora la stabilità',
      'Può essere modificato per vari livelli di difficoltà',
      'Migliora la postura e l\'allineamento del corpo',
      'Aumenta la forza funzionale utile nella vita quotidiana',
      'Può essere eseguito ovunque senza attrezzature'
    ]
  },
  'lunge-variations': {
    description: 'Gli affondi sono esercizi unilaterali che migliorano la forza, l\'equilibrio e la stabilità delle gambe, lavorando su quadricipiti, glutei e muscoli stabilizzatori.',
    benefits: [
      'Sviluppa forza e massa nei quadricipiti, glutei e hamstring',
      'Migliora l\'equilibrio e la coordinazione',
      'Corregge squilibri muscolari tra gamba destra e sinistra',
      'Aumenta la stabilità delle articolazioni di anche e ginocchia',
      'Migliora la mobilità dell\'anca',
      'Brucia efficacemente calorie e grassi'
    ]
  },
  'plank-variations': {
    description: 'Il plank è un esercizio isometrico che rafforza il core e la stabilità di tutto il corpo senza necessità di attrezzature.',
    benefits: [
      'Rafforza il core senza stressare la schiena',
      'Migliora la postura e riduce il mal di schiena',
      'Aumenta la stabilità e l\'equilibrio',
      'Tonifica addominali, schiena, spalle e gambe contemporaneamente',
      'Migliora la resistenza muscolare',
      'Può essere modificato per adattarsi a diversi livelli di fitness'
    ]
  },
  'hollow-body-crunch': {
    description: 'Il crunch è un esercizio mirato per gli addominali che rinforza il retto addominale e aiuta a definire i muscoli addominali.',
    benefits: [
      'Tonifica e definisce i muscoli addominali',
      'Rinforza il core e migliora la stabilità',
      'Aiuta a migliorare la postura',
      'Può essere eseguito senza attrezzature',
      'Migliora il controllo del corpo',
      'Supporta la salute della colonna vertebrale quando eseguito correttamente'
    ]
  }
};

const ExerciseBenefits: React.FC<ExerciseBenefitsProps> = ({ exerciseId, exerciseName }) => {
  // Cerca una corrispondenza basata sull'ID o sul nome dell'esercizio
  const getBenefitsInfo = () => {
    // Controlla per corrispondenza diretta dell'ID
    if (benefitsDatabase[exerciseId]) {
      return benefitsDatabase[exerciseId];
    }
    
    // Controlla per pull-up specificamente
    if (exerciseId.includes('pull') || exerciseName.toLowerCase().includes('pull')) {
      return benefitsDatabase['pull-up'];
    }
    
    // Controlla per corrispondenza parziale del nome
    const exerciseNameLower = exerciseName.toLowerCase();
    for (const key in benefitsDatabase) {
      if (exerciseNameLower.includes(key.replace('-', ' ')) || 
          key.includes(exerciseNameLower.replace(' ', '-'))) {
        return benefitsDatabase[key];
      }
    }
    
    // Fallback a informazioni generiche
    return {
      description: 'Questo esercizio aiuta a sviluppare forza e resistenza muscolare, migliorando la tua forma fisica complessiva.',
      benefits: [
        'Sviluppa la forza muscolare',
        'Migliora la resistenza',
        'Contribuisce alla salute generale',
        'Supporta un corretto metabolismo',
        'Aiuta nella gestione del peso'
      ]
    };
  };
  
  const benefitsInfo = getBenefitsInfo();
  
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
      <Typography variant="h6" sx={{ mb: 1, fontSize: '1rem', fontWeight: 600, color: '#1976d2' }}>
        BENEFICI DELL'ESERCIZIO
      </Typography>
      
      <Typography variant="body2" paragraph sx={{ mb: 2, fontStyle: 'italic' }}>
        {benefitsInfo.description}
      </Typography>
      
      <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
        {benefitsInfo.benefits.map((benefit, index) => (
          <li key={index}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              {benefit}
            </Typography>
          </li>
        ))}
      </ul>
    </Box>
  );
};

export default ExerciseBenefits;
