import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  InputAdornment, 
  Tabs, 
  Tab
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';

// Importa SkillsNavigation
import SkillsNavigation from '../components/skills/SkillsNavigation';

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

const NewSkillsProgression: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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
          <Tab label="Nuovo Sistema" {...a11yProps(2)} />
        </Tabs>
      </Box>

      {/* Pannello delle Skill Progressions originale */}
      <TabPanel value={tabValue} index={0}>
        <Typography paragraph>
          La sezione originale delle Skills Progressions che mostra le progressioni delle skill calisthenics.
        </Typography>
      </TabPanel>

      {/* Pannello degli Esercizi */}
      <TabPanel value={tabValue} index={1}>
        <Typography paragraph>
          Qui troverai una raccolta di esercizi per allenare ogni parte del corpo e migliorare le tue capacità fisiche.
        </Typography>
      </TabPanel>

      {/* Nuovo Sistema di Skills */}
      <TabPanel value={tabValue} index={2}>
        <SkillsNavigation />
      </TabPanel>
    </Container>
  );
};

export default NewSkillsProgression;
