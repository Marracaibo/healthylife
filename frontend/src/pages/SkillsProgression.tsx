import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField,
  Tabs,
  Tab,
  useTheme,
  Fade,
  Slide,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// Componenti e tipi per le skill di calisthenics
import CalisthenicSkillsList from '../components/calisthenics/CalisthenicSkillsList';
import CalisthenicSkillDetail from '../components/calisthenics/CalisthenicSkillDetail';
import { CalisthenicsSkill } from '../types/calisthenicsSkill';
import { calisthenicsSkills } from '../data/calisthenicsSkills';

// Import dei componenti e dati per le skill
import WeightliftingSkillsList from '../components/weightlifting/WeightliftingSkillsList';
import WeightliftingSkillDetail from '../components/weightlifting/WeightliftingSkillDetail';
import CardioSkillsList from '../components/cardio/CardioSkillsList';
import CardioSkillDetail from '../components/cardio/CardioSkillDetail';
import MobilitySkillsList from '../components/mobility/MobilitySkillsList';
import MobilitySkillDetail from '../components/mobility/MobilitySkillDetail';
import AgilitySkillsList from '../components/agility/AgilitySkillsList';
import AgilitySkillDetail from '../components/agility/AgilitySkillDetail';
import { weightliftingSkills, cardioSkills, mobilitySkills, agilitySkills } from '../data';
import { WeightliftingSkill } from '../types/weightliftingSkill';
import { CardioSkill } from '../types/cardioSkill';
import { MobilitySkill } from '../types/mobilitySkill';
import { AgilitySkill } from '../types/agilitySkill';
import { SkillProgression } from '../types/skillProgression';
import WorkoutBuilder from './WorkoutBuilder';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`exercise-tabpanel-${index}`}
      aria-labelledby={`exercise-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `exercise-tab-${index}`,
    'aria-controls': `exercise-tabpanel-${index}`,
  };
}

const SkillsProgression: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [loaded, setLoaded] = useState(false);
  // Stati per le skill di calisthenics
  const [selectedCalisthenicsSkill, setSelectedCalisthenicsSkill] = useState<CalisthenicsSkill | null>(null);
  // Stati per le nuove skill
  const [selectedWeightliftingSkill, setSelectedWeightliftingSkill] = useState<WeightliftingSkill | null>(null);
  const [selectedCardioSkill, setSelectedCardioSkill] = useState<CardioSkill | null>(null);
  const [selectedMobilitySkill, setSelectedMobilitySkill] = useState<MobilitySkill | null>(null);
  const [selectedAgilitySkill, setSelectedAgilitySkill] = useState<AgilitySkill | null>(null);
  const [showWorkoutBuilder, setShowWorkoutBuilder] = useState(false);

  // Imposta loaded a true dopo il caricamento iniziale
  useEffect(() => {
    setLoaded(true);
  }, []);

  // Handler per il cambio di tab
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handler per la selezione di una skill di calisthenics
  const handleCalisthenicsSkillSelect = (skill: CalisthenicsSkill | SkillProgression) => {
    // Verifica che sia una CalisthenicsSkill prima di impostarla
    if ('difficulty' in skill && 'progressions' in skill) {
      setSelectedCalisthenicsSkill(skill as CalisthenicsSkill);
    }
  };

  // Handler per le nuove skill
  const handleWeightliftingSkillSelect = (skill: WeightliftingSkill) => {
    setSelectedWeightliftingSkill(skill);
  };

  const handleCardioSkillSelect = (skill: CardioSkill) => {
    setSelectedCardioSkill(skill);
  };

  const handleMobilitySkillSelect = (skill: MobilitySkill) => {
    setSelectedMobilitySkill(skill);
  };

  const handleAgilitySkillSelect = (skill: AgilitySkill) => {
    setSelectedAgilitySkill(skill);
  };

  const handleHideWorkoutBuilder = () => {
    setShowWorkoutBuilder(false);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 5, px: { xs: 2, sm: 3, md: 4 } }}>
      <Fade in={loaded} timeout={800}>
        <Box>
          {/* Sezione di ricerca */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Cerca skill, progressioni o esercizi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ backgroundColor: theme.palette.background.paper }}
            />
          </Box>

          <Slide direction="up" in={loaded} timeout={1000} mountOnEnter unmountOnExit>
            <Box>
              <Box sx={{ position: 'relative', mb: 5 }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700, 
                    mb: 1.5,
                    textAlign: 'center',
                    position: 'relative',
                    display: 'inline-block',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -8,
                      left: '25%',
                      width: '50%',
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: theme.palette.primary.main,
                    }
                  }}
                >
                  Progressione delle Skill
                </Typography>
              </Box>

              {/* Tabs di navigazione principale */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs 
                  value={tabValue} 
                  onChange={handleTabChange} 
                  aria-label="exercise library tabs"
                  indicatorColor="primary"
                  textColor="primary"
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab label="Panoramica" {...a11yProps(0)} />
                  <Tab label="Calisthenics" {...a11yProps(1)} />
                  <Tab label="Powerlifting" {...a11yProps(2)} />
                  <Tab label="Cardio" {...a11yProps(3)} />
                  <Tab label="Flessibilità e Mobilità" {...a11yProps(4)} />
                  <Tab label="Agilità" {...a11yProps(5)} />
                </Tabs>
              </Box>

              {/* Pannello degli Esercizi */}
              <TabPanel value={tabValue} index={0}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Benvenuto nella Skills Progression
                </Typography>
                <Typography variant="body1" paragraph>
                  Questa sezione ti permette di esplorare e seguire progressioni dettagliate per raggiungere specifiche abilità fisiche. Ogni skill è suddivisa in livelli progressivi che ti guideranno passo dopo passo verso il tuo obiettivo.
                </Typography>
                <Typography variant="body1" paragraph>
                  Puoi navigare tra diverse categorie di skill utilizzando le schede qui sopra:
                </Typography>
                <Box sx={{ pl: 2, mb: 2 }}>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    • <strong>Calisthenics</strong>: Skill a corpo libero come muscle up, front lever, verticale e altre.
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    • <strong>Powerlifting</strong>: Progressioni per migliorare i tuoi sollevamenti con i pesi come panca, squat e stacco.
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    • <strong>Cardio</strong>: Programmi progressivi per migliorare la tua resistenza in corsa, ciclismo e altre attività cardio.
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    • <strong>Flessibilità e Mobilità</strong>: Percorsi per migliorare la tua mobilità articolare e flessibilità.
                  </Typography>
                  <Typography variant="body1">
                    • <strong>Agilità</strong>: Progressioni per sviluppare abilità acrobatiche come backflip, frontflip, ruota e rondata.
                  </Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  Seleziona una skill specifica per visualizzare la sua progressione dettagliata, con esercizi propedeutici, video tutorial e consigli personalizzati.
                </Typography>
              </TabPanel>

              {/* Pannello delle Skill di Calisthenics */}
              <TabPanel value={tabValue} index={1}>
                {!selectedCalisthenicsSkill ? (
                  <CalisthenicSkillsList skills={calisthenicsSkills} onSelectSkill={handleCalisthenicsSkillSelect} />
                ) : (
                  <CalisthenicSkillDetail skill={selectedCalisthenicsSkill} onBack={() => setSelectedCalisthenicsSkill(null)} />
                )}
              </TabPanel>

              {/* Pannello delle Skill di Weightlifting */}
              <TabPanel value={tabValue} index={2}>
                {!selectedWeightliftingSkill ? (
                  <WeightliftingSkillsList skills={weightliftingSkills} onSelectSkill={handleWeightliftingSkillSelect} />
                ) : (
                  <WeightliftingSkillDetail skill={selectedWeightliftingSkill} onBack={() => setSelectedWeightliftingSkill(null)} />
                )}
              </TabPanel>

              {/* Pannello delle Skill di Cardio */}
              <TabPanel value={tabValue} index={3}>
                {!selectedCardioSkill ? (
                  <CardioSkillsList skills={cardioSkills} onSelectSkill={handleCardioSkillSelect} />
                ) : (
                  <CardioSkillDetail skill={selectedCardioSkill} onBack={() => setSelectedCardioSkill(null)} />
                )}
              </TabPanel>

              {/* Pannello delle Skill di Mobilità */}
              <TabPanel value={tabValue} index={4}>
                {!selectedMobilitySkill ? (
                  <MobilitySkillsList skills={mobilitySkills} onSelectSkill={handleMobilitySkillSelect} />
                ) : (
                  <MobilitySkillDetail skill={selectedMobilitySkill} onBack={() => setSelectedMobilitySkill(null)} />
                )}
              </TabPanel>

              {/* Pannello delle Skill di Agilità */}
              <TabPanel value={tabValue} index={5}>
                {!selectedAgilitySkill ? (
                  <AgilitySkillsList skills={agilitySkills} onSelectSkill={handleAgilitySkillSelect} />
                ) : (
                  <AgilitySkillDetail skill={selectedAgilitySkill} onBack={() => setSelectedAgilitySkill(null)} />
                )}
              </TabPanel>

              {/* Pannello del Workout Builder */}
              {showWorkoutBuilder && (
                <TabPanel value={tabValue} index={6}>
                  <WorkoutBuilder onBack={handleHideWorkoutBuilder} />
                </TabPanel>
              )}
            </Box>
          </Slide>
        </Box>
      </Fade>
    </Container>
  );
};

export default SkillsProgression;
