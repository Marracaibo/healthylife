import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Card,
  CardContent,
  Divider,
  Alert,
  Grid
} from '@mui/material';
import { FitnessCenter, Save, NavigateNext, NavigateBefore } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import workoutProgramGenerator, { CustomProgramParams } from '../services/workoutProgramGenerator';
import { WorkoutProgram } from '../types/workout';

// Passi del wizard
const steps = ['Obiettivi', 'Livello di fitness', 'Pianificazione', 'Preferenze', 'Risultati'];

const CustomWorkoutGenerator: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [programGenerated, setProgramGenerated] = useState(false);
  const [generatedProgram, setGeneratedProgram] = useState<WorkoutProgram | null>(null);
  
  const [customParams, setCustomParams] = useState<CustomProgramParams>({
    goalType: 'general',
    fitnessLevel: 'beginner',
    daysPerWeek: 3,
    programDuration: 8,
    focusAreas: [],
    limitations: [],
    equipment: ['bodyweight']
  });

  const handleNext = () => {
    if (activeStep === steps.length - 2) {
      generateProgram();
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSaveProgram = () => {
    if (generatedProgram) {
      // Salva il programma generato in localStorage
      const savedPrograms = JSON.parse(localStorage.getItem('customWorkoutPrograms') || '[]');
      savedPrograms.push(generatedProgram);
      localStorage.setItem('customWorkoutPrograms', JSON.stringify(savedPrograms));
      
      // Imposta come programma corrente
      localStorage.setItem('currentWorkoutProgram', generatedProgram.id);
      
      // Inizializza lo stato del programma
      const initialProgress = {
        programId: generatedProgram.id,
        currentPhase: 0,
        currentWeek: 1,
        currentDay: 1
      };
      localStorage.setItem('workoutProgress', JSON.stringify(initialProgress));
      
      // Naviga alla pagina workout
      navigate('/workout');
    }
  };

  const generateProgram = () => {
    const program = workoutProgramGenerator.generateCustomProgram(customParams);
    setGeneratedProgram(program);
    setProgramGenerated(true);
  };

  const updateParam = (param: keyof CustomProgramParams, value: any) => {
    setCustomParams(prev => ({
      ...prev,
      [param]: value
    }));
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Passo 1: Scegli il tuo obiettivo principale
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                {[
                  { value: 'strength', label: 'Forza', description: 'Sviluppa forza massimale e potenza muscolare' },
                  { value: 'hypertrophy', label: 'Ipertrofia', description: 'Aumenta il volume e la massa muscolare' },
                  { value: 'endurance', label: 'Resistenza', description: 'Migliora la resistenza muscolare e cardiovascolare' },
                  { value: 'weightloss', label: 'Dimagrimento', description: 'Programma ad alta intensità per bruciare grassi' },
                  { value: 'general', label: 'Fitness Generale', description: 'Miglioramento complessivo di forza, resistenza e massa muscolare' }
                ].map((goal) => (
                  <Grid item xs={12} sm={6} md={4} key={goal.value}>
                    <Card 
                      variant="outlined" 
                      sx={{
                        height: '100%',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        border: customParams.goalType === goal.value ? `2px solid ${theme.palette.primary.main}` : '1px solid rgba(0, 0, 0, 0.12)',
                        '&:hover': {
                          boxShadow: 3,
                          borderColor: theme.palette.primary.light
                        }
                      }}
                      onClick={() => updateParam('goalType', goal.value)}
                    >
                      <CardContent sx={{ height: '100%', p: 2 }}>
                        <Typography variant="h6" component="div" gutterBottom>
                          {goal.label}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {goal.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Passo 2: Indica il tuo livello di fitness
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                {[
                  { value: 'beginner', label: 'Principiante', description: 'Poca o nessuna esperienza di allenamento' },
                  { value: 'intermediate', label: 'Intermedio', description: 'Esperienza di allenamento da 6 mesi a 2 anni' },
                  { value: 'advanced', label: 'Avanzato', description: 'Esperienza di allenamento di più di 2 anni' }
                ].map((level) => (
                  <Grid item xs={12} sm={4} key={level.value}>
                    <Card 
                      variant="outlined" 
                      sx={{
                        height: '100%',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        border: customParams.fitnessLevel === level.value ? `2px solid ${theme.palette.primary.main}` : '1px solid rgba(0, 0, 0, 0.12)',
                        '&:hover': {
                          boxShadow: 3,
                          borderColor: theme.palette.primary.light
                        }
                      }}
                      onClick={() => updateParam('fitnessLevel', level.value)}
                    >
                      <CardContent sx={{ height: '100%', p: 2 }}>
                        <Typography variant="h6" component="div" gutterBottom>
                          {level.label}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {level.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Passo 3: Pianifica il tuo programma
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Quanti giorni alla settimana vuoi allenarti?
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    {[2, 3, 4, 5, 6].map((days) => (
                      <Button 
                        key={days}
                        variant={customParams.daysPerWeek === days ? "contained" : "outlined"}
                        color="primary"
                        onClick={() => updateParam('daysPerWeek', days)}
                        sx={{ minWidth: '45px' }}
                      >
                        {days}
                      </Button>
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Durata del programma (settimane)
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    {[4, 8, 12, 16].map((weeks) => (
                      <Button 
                        key={weeks}
                        variant={customParams.programDuration === weeks ? "contained" : "outlined"}
                        color="primary"
                        onClick={() => updateParam('programDuration', weeks)}
                        sx={{ minWidth: '45px' }}
                      >
                        {weeks}
                      </Button>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Passo 4: Personalizza in base alle tue preferenze
            </Typography>
            
            <Box sx={{ mt: 2, mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Aree del corpo su cui concentrarsi
              </Typography>
              <Grid container spacing={1}>
                {[
                  'petto', 'schiena', 'spalle', 'braccia', 'addome', 'gambe', 'glutei'
                ].map((area) => (
                  <Grid item key={area}>
                    <Button 
                      variant={customParams.focusAreas.includes(area) ? "contained" : "outlined"}
                      color="primary"
                      onClick={() => {
                        if (customParams.focusAreas.includes(area)) {
                          updateParam('focusAreas', customParams.focusAreas.filter(a => a !== area));
                        } else {
                          updateParam('focusAreas', [...customParams.focusAreas, area]);
                        }
                      }}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    >
                      {area}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Box>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Attrezzatura disponibile
              </Typography>
              <Grid container spacing={1}>
                {[
                  { value: 'bodyweight', label: 'Solo Corpo Libero' },
                  { value: 'dumbbells', label: 'Manubri' },
                  { value: 'barbells', label: 'Bilanciere' },
                  { value: 'machines', label: 'Macchine Palestra' },
                  { value: 'cables', label: 'Cavi' },
                  { value: 'kettlebells', label: 'Kettlebell' },
                  { value: 'bands', label: 'Elastici' }
                ].map((equip) => (
                  <Grid item key={equip.value}>
                    <Button 
                      variant={customParams.equipment.includes(equip.value) ? "contained" : "outlined"}
                      color="primary"
                      onClick={() => {
                        if (customParams.equipment.includes(equip.value)) {
                          updateParam('equipment', customParams.equipment.filter(e => e !== equip.value));
                        } else {
                          updateParam('equipment', [...customParams.equipment, equip.value]);
                        }
                      }}
                      size="small"
                    >
                      {equip.label}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        );
      case 4:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Il tuo programma personalizzato
            </Typography>
            {programGenerated && generatedProgram ? (
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h5">{generatedProgram.name}</Typography>
                  <Typography variant="body1">{generatedProgram.description}</Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2">
                    Durata: {generatedProgram.duration} settimane
                  </Typography>
                  <Typography variant="body2">
                    Difficoltà: {generatedProgram.difficulty}
                  </Typography>
                  <Typography variant="body2">
                    Focus: {generatedProgram.targetAreas.join(', ')}
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>Struttura del programma:</Typography>
                    {generatedProgram.phases.map((phase, phaseIndex) => (
                      <Box key={phaseIndex} sx={{ mb: 2 }}>
                        <Typography variant="subtitle2">
                          Fase {phaseIndex + 1}: {phase.name} ({phase.weeks.length} settimane)
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {phase.description}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            ) : (
              <Alert severity="warning">
                Nessun programma generato. Torna indietro e completa tutti i passaggi.
              </Alert>
            )}
          </Box>
        );
      default:
        return <Box>Passo non implementato</Box>;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 2,
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          color: 'white'
        }}
      >
        <Box display="flex" alignItems="center" mb={2}>
          <FitnessCenter sx={{ mr: 2, fontSize: 40 }} />
          <Typography variant="h4" component="h1">
            Crea il Tuo Programma di Workout Personalizzato
          </Typography>
        </Box>
        <Typography variant="subtitle1">
          Segui questi semplici passaggi per generare un programma di allenamento su misura per te.
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mb: 4 }}>
          {renderStepContent(activeStep)}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<NavigateBefore />}
          >
            Indietro
          </Button>
          <Box>
            {activeStep === steps.length - 1 && (
              <Button 
                variant="contained" 
                color="success" 
                onClick={handleSaveProgram}
                startIcon={<Save />}
                disabled={!programGenerated}
                sx={{ mr: 1 }}
              >
                Salva e Inizia
              </Button>
            )}
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<NavigateNext />}
              disabled={activeStep === steps.length - 1}
            >
              {activeStep === steps.length - 2 ? 'Genera Programma' : 'Avanti'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CustomWorkoutGenerator;
