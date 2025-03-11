import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  TextField, 
  InputAdornment, 
  IconButton, 
  Tabs, 
  Tab, 
  CircularProgress,
  Paper,
  Chip,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import SportsGymnasticsIcon from '@mui/icons-material/SportsGymnastics';
import FitnessCenterOutlinedIcon from '@mui/icons-material/FitnessCenterOutlined';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { alpha, useTheme } from '@mui/material/styles';
import exerciseAPI from '../services/exerciseAPI';
import Exercise3DViewer from '../components/Exercise3DViewer';
import ExerciseBenefits from '../components/ExerciseBenefits';
import MusclesWorked from '../components/MusclesWorked';
import { skillProgressions, getSkillProgressionById } from '../data/skillProgressions';
import { SkillProgression, ProgressionStep } from '../types/skillProgression';

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

// Categorie di skill
const skillCategories = [
  { id: 'all', label: 'Tutte le Skill', icon: <EmojiEventsIcon /> },
  { id: 'calisthenics', label: 'Calisthenics', icon: <SportsGymnasticsIcon /> },
  { id: 'powerlifting', label: 'Powerlifting', icon: <FitnessCenterIcon /> },
  { id: 'cardio', label: 'Cardio', icon: <DirectionsRunIcon /> },
  { id: 'mobility', label: 'Mobilità', icon: <FitnessCenterOutlinedIcon /> }
];

const ExerciseLibrary: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState<SkillProgression | null>(null);
  const [selectedStep, setSelectedStep] = useState<ProgressionStep | null>(null);
  const [filteredSkills, setFilteredSkills] = useState<SkillProgression[]>(skillProgressions);

  // Handler per il cambio di tab
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handler per il cambio di categoria
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // Handler per la selezione di una skill
  const handleSkillSelect = (skill: SkillProgression) => {
    setSelectedSkill(skill);
    if (skill.steps.length > 0) {
      setSelectedStep(skill.steps[0]);
    }
  };

  // Handler per la selezione di uno step
  const handleStepSelect = (step: ProgressionStep) => {
    setSelectedStep(step);
  };

  // Filtra le skill in base alla ricerca e alla categoria selezionata
  useEffect(() => {
    let filtered = [...skillProgressions];
    
    // Filtra per categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(skill => skill.category === selectedCategory);
      
      // Log per debug - versione migliorata
      console.log('Categoria selezionata:', selectedCategory);
      console.log('Tutte le skill disponibili:', skillProgressions.map(s => ({ nome: s.name, categoria: s.category })));
      console.log('Skill filtrate per categoria:', filtered.map(s => ({ nome: s.name, categoria: s.category })));
    }
    
    // Filtra per termine di ricerca
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(skill => 
        skill.name.toLowerCase().includes(term) || 
        skill.description.toLowerCase().includes(term)
      );
    }
    
    setFilteredSkills(filtered);
  }, [searchTerm, selectedCategory]);

  // Componente per le skill di corsa
  const RunningSkillsSection = () => {
    const runningSkills = skillProgressions.filter(skill => 
      skill.category === 'cardio' && 
      (skill.id.includes('run') || 
       skill.id.includes('marathon') || 
       skill.name.toLowerCase().includes('maratona') || 
       skill.name.toLowerCase().includes('correre'))
    );

    if (runningSkills.length === 0) {
      return null;
    }

    return (
      <Box mt={4}>
        <Typography variant="h5" gutterBottom fontWeight="medium">
          Progressioni di Corsa
        </Typography>
        <Grid container spacing={3}>
          {runningSkills.map((skill) => (
            <Grid item xs={12} sm={6} md={4} key={skill.id}>
              <Card 
                elevation={2} 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  }
                }}
              >
                <CardActionArea onClick={() => handleSkillSelect(skill)}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={skill.coverImage || `https://source.unsplash.com/random/300x200/?running,${skill.id}`}
                    alt={skill.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      {skill.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                        {[...Array(5)].map((_, i) => (
                          <Box component="span" key={i} sx={{ color: i < skill.difficultyLevel ? theme.palette.warning.main : theme.palette.text.disabled }}>
                            ●
                          </Box>
                        ))}
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {skill.estimatedTimeToAchieve || ''}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {skill.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Skills Progression
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Esplora la nostra collezione di skill con progressioni dettagliate e personalizzate
      </Typography>

      {/* Barra di ricerca */}
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
          <Tab label="Skill Progressions" {...a11yProps(0)} />
          <Tab label="Esercizi" {...a11yProps(1)} />
        </Tabs>
      </Box>

      {/* Pannello delle Skill Progressions */}
      <TabPanel value={tabValue} index={0}>
        {!selectedSkill ? (
          <>
            {/* Categorie di skill */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {skillCategories.map((category) => (
                <Chip
                  key={category.id}
                  icon={category.icon}
                  label={category.label}
                  onClick={() => handleCategoryChange(category.id)}
                  color={selectedCategory === category.id ? "primary" : "default"}
                  variant={selectedCategory === category.id ? "filled" : "outlined"}
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>

            {/* Lista delle skill */}
            <Grid container spacing={3}>
              {filteredSkills.map((skill) => (
                <Grid item xs={12} sm={6} md={4} key={skill.id}>
                  <Card 
                    elevation={2} 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                      }
                    }}
                  >
                    <CardActionArea onClick={() => handleSkillSelect(skill)}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={skill.coverImage || `https://source.unsplash.com/random/300x200/?fitness,${skill.category}`}
                        alt={skill.name}
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                          {skill.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                            {[...Array(5)].map((_, i) => (
                              <Box component="span" key={i} sx={{ color: i < skill.difficultyLevel ? theme.palette.warning.main : theme.palette.text.disabled }}>
                                ●
                              </Box>
                            ))}
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {skill.estimatedTimeToAchieve || ''}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {skill.description}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <RunningSkillsSection />
          </>
        ) : (
          // Vista dettagliata della skill selezionata
          <Box>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={() => setSelectedSkill(null)} sx={{ mr: 1 }}>
                <SearchIcon />
              </IconButton>
              <Typography variant="h5" component="div">
                {selectedSkill.name}
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Informazioni
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {selectedSkill.description}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Difficoltà
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {[...Array(5)].map((_, i) => (
                        <Box 
                          component="span" 
                          key={i} 
                          sx={{ 
                            color: i < selectedSkill.difficultyLevel ? theme.palette.warning.main : theme.palette.text.disabled,
                            fontSize: '1.2rem',
                            mr: 0.5
                          }}
                        >
                          ●
                        </Box>
                      ))}
                    </Box>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Tempo stimato
                    </Typography>
                    <Typography variant="body2">
                      {selectedSkill.estimatedTimeToAchieve || 'Variabile in base all\'allenamento'}
                    </Typography>
                  </Box>
                  
                  {selectedSkill.prerequisites && selectedSkill.prerequisites.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Prerequisiti
                      </Typography>
                      <List dense disablePadding>
                        {selectedSkill.prerequisites.map((prereq, index) => (
                          <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                              <CheckCircleIcon color="success" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={prereq} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={8}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Passaggi della Progressione
                  </Typography>
                  
                  <Box sx={{ mb: 4 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={selectedStep ? (selectedSkill.steps.findIndex(s => s.id === selectedStep.id) + 1) * 100 / selectedSkill.steps.length : 0} 
                      sx={{ height: 10, borderRadius: 5, mb: 2 }}
                    />
                  </Box>
                  
                  <Grid container spacing={2}>
                    {selectedSkill.steps.map((step, index) => (
                      <Grid item xs={12} key={step.id}>
                        <Card 
                          sx={{ 
                            mb: 2, 
                            backgroundColor: selectedStep?.id === step.id ? alpha(theme.palette.primary.main, 0.1) : 'inherit',
                            border: selectedStep?.id === step.id ? `1px solid ${theme.palette.primary.main}` : 'none',
                            cursor: 'pointer'
                          }}
                          onClick={() => handleStepSelect(step)}
                        >
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                              <Box 
                                sx={{ 
                                  width: 30, 
                                  height: 30, 
                                  borderRadius: '50%', 
                                  bgcolor: selectedStep?.id === step.id ? theme.palette.primary.main : theme.palette.grey[300],
                                  color: selectedStep?.id === step.id ? theme.palette.primary.contrastText : theme.palette.text.primary,
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  fontSize: 14,
                                  fontWeight: 'bold'
                                }}
                              >
                                {index + 1}
                              </Box>
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="subtitle1" component="div">
                                  {step.name}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                                    {[...Array(5)].map((_, i) => (
                                      <Box component="span" key={i} sx={{ color: i < step.difficulty ? theme.palette.warning.main : theme.palette.text.disabled }}>
                                        ●
                                      </Box>
                                    ))}
                                  </Box>
                                  <Typography variant="caption" color="text.secondary">
                                    {step.estimatedTimeToMaster || ''}
                                  </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                  {step.description}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
              
              {selectedStep && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {selectedStep.name} - Istruzioni Dettagliate
                    </Typography>
                    
                    <Grid container spacing={3}>
                      {selectedStep.gifUrl && (
                        <Grid item xs={12} sm={4}>
                          <Box 
                            component="img"
                            src={selectedStep.gifUrl || `https://source.unsplash.com/random/300x200/?fitness,exercise`}
                            alt={selectedStep.name}
                            sx={{ 
                              width: '100%', 
                              height: 'auto', 
                              maxHeight: 250,
                              objectFit: 'contain',
                              borderRadius: 1,
                              border: `1px solid ${theme.palette.divider}`
                            }}
                            onError={(e) => {
                              // Fallback per immagini che non si caricano
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = `https://source.unsplash.com/random/300x200/?fitness,exercise`;
                            }}
                          />
                        </Grid>
                      )}
                      
                      <Grid item xs={12} sm={selectedStep.gifUrl ? 8 : 12}>
                        <List>
                          {selectedStep.instructions.map((instruction, index) => (
                            <ListItem key={index} sx={{ py: 1 }}>
                              <ListItemIcon>
                                <Box 
                                  sx={{ 
                                    width: 28, 
                                    height: 28, 
                                    borderRadius: '50%', 
                                    bgcolor: theme.palette.primary.main,
                                    color: theme.palette.primary.contrastText,
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    fontSize: 14,
                                    fontWeight: 'bold'
                                  }}
                                >
                                  {index + 1}
                                </Box>
                              </ListItemIcon>
                              <ListItemText primary={instruction} />
                            </ListItem>
                          ))}
                        </List>
                        
                        {selectedStep.tips && selectedStep.tips.length > 0 && (
                          <Box sx={{ mt: 2, p: 2, bgcolor: alpha(theme.palette.info.main, 0.1), borderRadius: 1 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Suggerimenti
                            </Typography>
                            <List dense>
                              {selectedStep.tips.map((tip, index) => (
                                <ListItem key={index} sx={{ py: 0.5 }}>
                                  <ListItemIcon sx={{ minWidth: 30 }}>
                                    <FitnessCenterIcon color="info" fontSize="small" />
                                  </ListItemIcon>
                                  <ListItemText primary={tip} />
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        )}
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Box>
        )}
      </TabPanel>

      {/* Pannello degli Esercizi (mantenuto dalla versione precedente) */}
      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>
          Esercizi Tradizionali
        </Typography>
        <Typography variant="body2" paragraph>
          Questa sezione contiene gli esercizi classici, consulta la sezione "Skill Progressions" per raggiungere obiettivi specifici.
        </Typography>
      </TabPanel>
    </Container>
  );
};

export default ExerciseLibrary;
