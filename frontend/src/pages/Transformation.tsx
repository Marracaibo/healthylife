import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Tabs,
  Tab,
  Divider,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemIcon,
  Rating,
  useTheme,
  alpha,
} from '@mui/material';
import {
  FitnessCenter,
  Restaurant,
  Healing,
  Event,
  Person,
  AccessTime,
  AttachMoney,
  CheckCircle,
  ArrowForward,
  Star,
} from '@mui/icons-material';
import { coaches, services, transformationPlans, liveEvents } from '../data/transformationData';
import { TransformationService, TransformationPlan, Coach, LiveEvent } from '../types/transformation';

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
      id={`transformation-tabpanel-${index}`}
      aria-labelledby={`transformation-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `transformation-tab-${index}`,
    'aria-controls': `transformation-tabpanel-${index}`,
  };
}

const categoryIcons = {
  training: <FitnessCenter />,
  nutrition: <Restaurant />,
  recovery: <Healing />,
  events: <Event />,
};

const Transformation: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleImageError = (id: string, fallbackSrc: string, e: React.SyntheticEvent<HTMLImageElement>) => {
    // Impediamo un loop infinito se anche l'immagine di fallback è rotta
    if (!imageError[id]) {
      const target = e.target as HTMLImageElement;
      target.onerror = null; // Rimuove il gestore di errori per evitare loop
      target.src = fallbackSrc;
      setImageError(prev => ({ ...prev, [id]: true }));
    }
  };

  const getImageFallback = (category: string) => {
    return `/images/workout-header-bg.jpg`; // Percorso corretto senza 'public'
  };

  const renderServiceCard = (service: TransformationService) => (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        }
      }}
    >
      <CardMedia
        component="img"
        height="160"
        image={service.imageUrl || getImageFallback(service.category)}
        alt={service.name}
        onError={(e) => handleImageError(service.id, getImageFallback(service.category), e)}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box sx={{ mr: 1, color: theme.palette.primary.main }}>
            {categoryIcons[service.category]}
          </Box>
          <Typography gutterBottom variant="h6" component="div">
            {service.name}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" paragraph>
          {service.description}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <AttachMoney fontSize="small" color="primary" />
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {service.price} €
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTime fontSize="small" color="primary" />
            <Typography variant="body2" sx={{ ml: 0.5 }}>
              {service.duration}
            </Typography>
          </Box>
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" endIcon={<ArrowForward />}>
          Scopri di più
        </Button>
      </CardActions>
    </Card>
  );

  const renderCoachCard = (coach: Coach) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={coach.imageUrl}
        alt={coach.name}
        sx={{ objectFit: 'cover' }}
        onError={(e) => handleImageError(coach.id, getImageFallback('coach'), e)}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {coach.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {coach.role}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={coach.rating} precision={0.1} readOnly size="small" />
          <Typography variant="body2" sx={{ ml: 1 }}>
            {coach.rating}
          </Typography>
        </Box>
        <Box sx={{ mb: 1 }}>
          {coach.specialty.map((spec, index) => (
            <Chip 
              key={index} 
              label={spec} 
              size="small" 
              sx={{ mr: 0.5, mb: 0.5 }} 
              variant="outlined" 
            />
          ))}
        </Box>
        <Typography variant="body2" color="text.secondary">
          {coach.bio}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary">
          Prenota
        </Button>
      </CardActions>
    </Card>
  );

  const renderPlanCard = (plan: TransformationPlan) => (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative', 
        border: plan.isMostPopular ? `2px solid ${theme.palette.primary.main}` : 'none'
      }}
    >
      {plan.isMostPopular && (
        <Box sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          bgcolor: theme.palette.primary.main,
          color: 'white',
          py: 0.5,
          px: 1.5,
          borderRadius: 1,
          fontSize: '0.8rem',
          fontWeight: 'bold'
        }}>
          Più Popolare
        </Box>
      )}
      <CardMedia
        component="img"
        height="140"
        image={plan.imageUrl || getImageFallback('plan')}
        alt={plan.name}
        onError={(e) => handleImageError(plan.id, getImageFallback('plan'), e)}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
          {plan.name}
        </Typography>
        <Typography variant="h4" color="text.primary" sx={{ mb: 2, fontWeight: 'bold' }}>
          {plan.price} €
          <Typography component="span" variant="body2" color="text.secondary">
            /{plan.duration === 'monthly' ? 'mese' : plan.duration === 'quarterly' ? 'trimestre' : 'anno'}
          </Typography>
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {plan.description}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <List dense>
          {plan.features.map((feature, index) => (
            <ListItem key={index} sx={{ px: 0 }}>
              <ListItemIcon sx={{ minWidth: 30 }}>
                <CheckCircle color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={feature} />
            </ListItem>
          ))}
        </List>
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        <Button variant={plan.isMostPopular ? "contained" : "outlined"} fullWidth color="primary" size="large">
          Scegli Piano
        </Button>
      </Box>
    </Card>
  );

  const renderEventCard = (event: LiveEvent) => (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)'
        }
      }}
    >
      <CardMedia
        component="img"
        height="140"
        image={event.imageUrl || getImageFallback('event')}
        alt={event.title}
        onError={(e) => handleImageError(event.id, getImageFallback('event'), e)}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {event.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: theme.palette.text.secondary }}>
          <Event fontSize="small" />
          <Typography variant="body2" sx={{ ml: 0.5 }}>
            {event.date}, {event.time}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" paragraph>
          {event.description}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Chip
            label={`${event.currentParticipants}/${event.maxParticipants} partecipanti`}
            size="small"
            color={event.currentParticipants >= event.maxParticipants ? "error" : "primary"}
            variant="outlined"
          />
        </Box>
      </CardContent>
      <CardActions>
        <Button 
          size="small" 
          variant="contained" 
          color="primary"
          disabled={event.currentParticipants >= event.maxParticipants}
        >
          {event.currentParticipants >= event.maxParticipants ? "Completo" : "Iscriviti"}
        </Button>
        <Box sx={{ ml: 'auto' }}>
          <Typography variant="subtitle2" color="primary">
            {event.price} €
          </Typography>
        </Box>
      </CardActions>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Trasformazione a 360°: Il Percorso di Consulenza Integrata
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Un percorso di crescita completa, proprio come viene seguito un atleta d'élite, curando ogni aspetto della performance e del benessere.
        </Typography>
      </Box>

      <Paper sx={{ mb: 4, p: 3, background: alpha(theme.palette.primary.main, 0.05) }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h5" gutterBottom>
              Non solo allenamento, ma un percorso di trasformazione totale
            </Typography>
            <Typography variant="body1" paragraph>
              Offriamo un approccio completo che cura ogni aspetto della tua crescita: fisico, nutrizionale, mentale e di recupero, come per i campioni. Siamo al tuo fianco in ogni fase per raggiungere il massimo livello di performance e benessere.
            </Typography>
            <Button variant="contained" color="primary" size="large" endIcon={<ArrowForward />}>
              Inizia la tua trasformazione
            </Button>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box 
              component="img" 
              src="/images/workout-header-bg.jpg" 
              alt="Trasformazione"
              sx={{ 
                width: '100%', 
                borderRadius: 2,
                boxShadow: 3
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.style.display = 'none';
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mb: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="transformation tabs"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            '& .MuiTab-root': { 
              minWidth: 120,
              fontSize: '1rem'
            } 
          }}
        >
          <Tab label="Servizi" icon={<FitnessCenter />} iconPosition="start" {...a11yProps(0)} />
          <Tab label="Piani" icon={<AttachMoney />} iconPosition="start" {...a11yProps(1)} />
          <Tab label="Coach" icon={<Person />} iconPosition="start" {...a11yProps(2)} />
          <Tab label="Eventi Live" icon={<Event />} iconPosition="start" {...a11yProps(3)} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Typography variant="h5" gutterBottom>
          I nostri servizi
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Scegli tra un'ampia gamma di servizi professionali per la tua trasformazione totale.
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Button 
                fullWidth 
                variant="outlined" 
                startIcon={<FitnessCenter />}
                sx={{ justifyContent: 'flex-start', py: 1.5 }}
              >
                Allenamento
              </Button>
            </Grid>
            <Grid item xs={6} md={3}>
              <Button 
                fullWidth 
                variant="outlined" 
                startIcon={<Restaurant />}
                sx={{ justifyContent: 'flex-start', py: 1.5 }}
              >
                Nutrizione
              </Button>
            </Grid>
            <Grid item xs={6} md={3}>
              <Button 
                fullWidth 
                variant="outlined" 
                startIcon={<Healing />}
                sx={{ justifyContent: 'flex-start', py: 1.5 }}
              >
                Recupero
              </Button>
            </Grid>
            <Grid item xs={6} md={3}>
              <Button 
                fullWidth 
                variant="outlined" 
                startIcon={<Event />}
                sx={{ justifyContent: 'flex-start', py: 1.5 }}
              >
                Eventi
              </Button>
            </Grid>
          </Grid>
        </Box>
        
        <Grid container spacing={3}>
          {services.map((service) => (
            <Grid item xs={12} sm={6} md={4} key={service.id}>
              {renderServiceCard(service)}
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h5" gutterBottom>
          Piani di abbonamento
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Scegli il piano più adatto alle tue esigenze per un'esperienza completa di trasformazione.
        </Typography>
        
        <Grid container spacing={3}>
          {transformationPlans.map((plan) => (
            <Grid item xs={12} sm={6} md={4} key={plan.id}>
              {renderPlanCard(plan)}
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Typography variant="h5" gutterBottom>
          I nostri coach e specialisti
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Un team di professionisti pronti a guidarti nel tuo percorso di trasformazione.
        </Typography>
        
        <Grid container spacing={3}>
          {coaches.map((coach) => (
            <Grid item xs={12} sm={6} md={4} key={coach.id}>
              {renderCoachCard(coach)}
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Typography variant="h5" gutterBottom>
          Eventi e masterclass live
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Partecipa ai nostri eventi esclusivi con atleti e specialisti di fama internazionale.
        </Typography>
        
        <Grid container spacing={3}>
          {liveEvents.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              {renderEventCard(event)}
            </Grid>
          ))}
        </Grid>
      </TabPanel>
    </Container>
  );
};

export default Transformation;
