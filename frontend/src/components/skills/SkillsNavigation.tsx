import React, { useState } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  Typography, 
  Container,
  useTheme,
  Paper,
  Fade,
  Avatar
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { 
  FitnessCenter, 
  DirectionsRun, 
  Accessibility,
  SportsGymnastics,
  FlipCameraAndroid
} from '@mui/icons-material';

// Componenti
import WeightliftingSkillsList from '../weightlifting/WeightliftingSkillsList';
import CardioSkillsList from '../cardio/CardioSkillsList';
import MobilitySkillsList from '../mobility/MobilitySkillsList';
import AgilitySkillsList from '../agility/AgilitySkillsList';
import WeightliftingSkillDetail from '../weightlifting/WeightliftingSkillDetail';
import CardioSkillDetail from '../cardio/CardioSkillDetail';
import MobilitySkillDetail from '../mobility/MobilitySkillDetail';
import AgilitySkillDetail from '../agility/AgilitySkillDetail';

// Dati
import { weightliftingSkills, cardioSkills, mobilitySkills, agilitySkills } from '../../data';
import { WeightliftingSkill } from '../../types/weightliftingSkill';
import { CardioSkill } from '../../types/cardioSkill';
import { MobilitySkill } from '../../types/mobilitySkill';
import { AgilitySkill } from '../../types/agilitySkill';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`skills-tabpanel-${index}`}
      aria-labelledby={`skills-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Fade in={value === index}>
          <Box sx={{ pt: 3 }}>
            {children}
          </Box>
        </Fade>
      )}
    </div>
  );
};

const SkillsNavigation: React.FC = () => {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [selectedWeightliftingSkill, setSelectedWeightliftingSkill] = useState<WeightliftingSkill | null>(null);
  const [selectedCardioSkill, setSelectedCardioSkill] = useState<CardioSkill | null>(null);
  const [selectedMobilitySkill, setSelectedMobilitySkill] = useState<MobilitySkill | null>(null);
  const [selectedAgilitySkill, setSelectedAgilitySkill] = useState<AgilitySkill | null>(null);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleSelectWeightliftingSkill = (skill: WeightliftingSkill) => {
    setSelectedWeightliftingSkill(skill);
  };

  const handleSelectCardioSkill = (skill: CardioSkill) => {
    setSelectedCardioSkill(skill);
  };

  const handleSelectMobilitySkill = (skill: MobilitySkill) => {
    setSelectedMobilitySkill(skill);
  };

  const handleSelectAgilitySkill = (skill: AgilitySkill) => {
    setSelectedAgilitySkill(skill);
  };

  const handleBackFromWeightlifting = () => {
    setSelectedWeightliftingSkill(null);
  };

  const handleBackFromCardio = () => {
    setSelectedCardioSkill(null);
  };

  const handleBackFromMobility = () => {
    setSelectedMobilitySkill(null);
  };

  const handleBackFromAgility = () => {
    setSelectedAgilitySkill(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          Skills Progression
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Traccia il tuo percorso verso obiettivi fisici specifici attraverso progressioni 
          strutturate e allenamenti mirati
        </Typography>
      </Box>

      <Paper 
        elevation={0} 
        variant="outlined" 
        sx={{ 
          borderRadius: 3,
          overflow: 'hidden'
        }}
      >
        <Tabs 
          value={value} 
          onChange={handleChange} 
          variant="fullWidth"
          sx={{
            bgcolor: alpha(theme.palette.background.paper, 0.6),
            borderBottom: 1, 
            borderColor: 'divider',
            '& .MuiTabs-indicator': {
              height: 4,
              borderRadius: '4px 4px 0 0'
            }
          }}
        >
          <Tab 
            icon={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{
                  width: 35, 
                  height: 35, 
                  bgcolor: value === 0 ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.1),
                  color: value === 0 ? '#ffffff' : theme.palette.primary.main,
                  mr: 1
                }}>
                  <FitnessCenter />
                </Avatar>
                <Typography sx={{ fontWeight: value === 0 ? 'bold' : 'medium' }}>
                  Weightlifting
                </Typography>
              </Box>
            }
            sx={{ 
              textTransform: 'none', 
              minHeight: 72, 
              fontSize: '1rem'
            }} 
          />
          <Tab 
            icon={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{
                  width: 35, 
                  height: 35, 
                  bgcolor: value === 1 ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.1),
                  color: value === 1 ? '#ffffff' : theme.palette.primary.main,
                  mr: 1
                }}>
                  <DirectionsRun />
                </Avatar>
                <Typography sx={{ fontWeight: value === 1 ? 'bold' : 'medium' }}>
                  Cardio
                </Typography>
              </Box>
            } 
            sx={{ 
              textTransform: 'none', 
              minHeight: 72,
              fontSize: '1rem'
            }} 
          />
          <Tab 
            icon={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{
                  width: 35, 
                  height: 35, 
                  bgcolor: value === 2 ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.1),
                  color: value === 2 ? '#ffffff' : theme.palette.primary.main,
                  mr: 1
                }}>
                  <SportsGymnastics />
                </Avatar>
                <Typography sx={{ fontWeight: value === 2 ? 'bold' : 'medium' }}>
                  Mobilità
                </Typography>
              </Box>
            } 
            sx={{ 
              textTransform: 'none', 
              minHeight: 72,
              fontSize: '1rem'
            }} 
          />
          <Tab 
            icon={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{
                  width: 35, 
                  height: 35, 
                  bgcolor: value === 3 ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.1),
                  color: value === 3 ? '#ffffff' : theme.palette.primary.main,
                  mr: 1
                }}>
                  <FlipCameraAndroid />
                </Avatar>
                <Typography sx={{ fontWeight: value === 3 ? 'bold' : 'medium' }}>
                  Agilità
                </Typography>
              </Box>
            } 
            sx={{ 
              textTransform: 'none', 
              minHeight: 72,
              fontSize: '1rem'
            }} 
          />
          <Tab 
            icon={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{
                  width: 35, 
                  height: 35, 
                  bgcolor: value === 4 ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.1),
                  color: value === 4 ? '#ffffff' : theme.palette.primary.main,
                  mr: 1
                }}>
                  <Accessibility />
                </Avatar>
                <Typography sx={{ fontWeight: value === 4 ? 'bold' : 'medium' }}>
                  Calistenici
                </Typography>
              </Box>
            } 
            sx={{ 
              textTransform: 'none', 
              minHeight: 72,
              fontSize: '1rem'
            }} 
          />
        </Tabs>

        <Box sx={{ p: 3 }}>
          <TabPanel value={value} index={0}>
            {selectedWeightliftingSkill ? (
              <WeightliftingSkillDetail
                skill={selectedWeightliftingSkill}
                onBack={handleBackFromWeightlifting}
              />
            ) : (
              <WeightliftingSkillsList 
                skills={weightliftingSkills} 
                onSelectSkill={handleSelectWeightliftingSkill} 
              />
            )}
          </TabPanel>
          <TabPanel value={value} index={1}>
            {selectedCardioSkill ? (
              <CardioSkillDetail
                skill={selectedCardioSkill}
                onBack={handleBackFromCardio}
              />
            ) : (
              <CardioSkillsList 
                skills={cardioSkills} 
                onSelectSkill={handleSelectCardioSkill} 
              />
            )}
          </TabPanel>
          <TabPanel value={value} index={2}>
            {selectedMobilitySkill ? (
              <MobilitySkillDetail
                skill={selectedMobilitySkill}
                onBack={handleBackFromMobility}
              />
            ) : (
              <MobilitySkillsList 
                skills={mobilitySkills} 
                onSelectSkill={handleSelectMobilitySkill} 
              />
            )}
          </TabPanel>
          <TabPanel value={value} index={3}>
            {selectedAgilitySkill ? (
              <AgilitySkillDetail
                skill={selectedAgilitySkill}
                onBack={handleBackFromAgility}
              />
            ) : (
              <AgilitySkillsList 
                skills={agilitySkills} 
                onSelectSkill={handleSelectAgilitySkill} 
              />
            )}
          </TabPanel>
          <TabPanel value={value} index={4}>
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="h6" color="text.secondary">
                Le skill di Calisthenics saranno disponibili a breve
              </Typography>
            </Box>
          </TabPanel>
        </Box>
      </Paper>
    </Container>
  );
};

export default SkillsNavigation;
