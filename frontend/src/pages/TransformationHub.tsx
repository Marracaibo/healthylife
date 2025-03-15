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
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Rating,
  useTheme,
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
  ShoppingCart as ShoppingCartIcon,
  Favorite as FavoriteIcon,
  LocalShipping as LocalShippingIcon,
  VerifiedUser as VerifiedUserIcon,
  Psychology as PsychologyIcon,
  LocalOffer as LocalOfferIcon,
} from '@mui/icons-material';

// Import data
import { coaches, services, transformationPlans, liveEvents } from '../data/transformationData';
import { productCategories, products, getFeaturedProducts } from '../data/shopData';

// Import types
import { TransformationService, TransformationPlan, Coach, LiveEvent } from '../types/transformation';
import { Product } from '../types/shop';

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

const categoryIcons: Record<string, React.ReactNode> = {
  training: <FitnessCenter />,
  nutrition: <Restaurant />,
  recovery: <Healing />,
  events: <Event />,
};

const TransformationHub: React.FC = () => {
  const theme = useTheme();
  const [mainTabValue, setMainTabValue] = useState(0);
  const [transformationTabValue, setTransformationTabValue] = useState(0);
  const [shopCategoryTab, setShopCategoryTab] = useState(0);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  
  const featuredProducts = getFeaturedProducts();

  const handleMainTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setMainTabValue(newValue);
  };

  const handleTransformationTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTransformationTabValue(newValue);
  };

  const handleShopCategoryChange = (_event: React.SyntheticEvent, newValue: number) => {
    setShopCategoryTab(newValue);
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

  const getImageFallback = (_category: string) => {
    return `/images/workout-header-bg.jpg`; // Percorso corretto senza 'public'
  };

  // Funzione per il rendering delle card dei prodotti
  const renderProductCard = (product: Product) => (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 6
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={product.imageUrl}
          alt={product.name}
          sx={{ objectFit: 'cover' }}
        />
        {product.discountPercentage && (
          <Chip
            label={`-${product.discountPercentage}%`}
            color="error"
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              fontWeight: 'bold'
            }}
          />
        )}
        {product.isNewArrival && (
          <Chip
            label="Novità"
            color="primary"
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              fontWeight: 'bold'
            }}
          />
        )}
        {product.isBestseller && !product.isNewArrival && (
          <Chip
            label="Bestseller"
            color="secondary"
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              fontWeight: 'bold'
            }}
          />
        )}
      </Box>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          {product.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={product.rating} precision={0.1} size="small" readOnly />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            {product.rating}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
          {product.description.length > 120 
            ? `${product.description.substring(0, 120)}...` 
            : product.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="primary" fontWeight="bold">
            {product.discountPercentage 
              ? (
                <>
                  <Typography 
                    component="span" 
                    sx={{ 
                      textDecoration: 'line-through', 
                      color: 'text.secondary',
                      fontSize: '0.9rem',
                      mr: 1
                    }}
                  >
                    €{product.price.toFixed(2)}
                  </Typography>
                  €{(product.price * (1 - product.discountPercentage / 100)).toFixed(2)}
                </>
              )
              : `€${product.price.toFixed(2)}`
            }
          </Typography>
          <Box>
            <Button 
              variant="outlined" 
              size="small" 
              sx={{ minWidth: '40px', p: '4px', mr: 1 }}
            >
              <FavoriteIcon fontSize="small" />
            </Button>
            <Button 
              variant="contained" 
              size="small" 
              startIcon={<ShoppingCartIcon />}
            >
              Aggiungi
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

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

  interface EnhancedTransformationPlan extends TransformationPlan {
    rating?: number;
    tags?: string[];
  }

  const renderPlanCard = (plan: EnhancedTransformationPlan) => (
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
        image={plan.imageUrl || getImageFallback('training')}
        alt={plan.name}
        onError={(e) => handleImageError(plan.id, getImageFallback('training'), e)}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {plan.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={plan.rating || 4.5} precision={0.1} readOnly size="small" />
          <Typography variant="body2" sx={{ ml: 1 }}>
            {plan.rating || 4.5}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" paragraph>
          {plan.description}
        </Typography>
        <Box sx={{ mb: 2 }}>
          {(plan.tags || []).map((tag: string, index: number) => (
            <Chip 
              key={index} 
              label={tag} 
              size="small" 
              sx={{ mr: 0.5, mb: 0.5 }} 
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
        <List dense sx={{ p: 0 }}>
          {plan.features.slice(0, 3).map((feature, index) => (
            <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 30 }}>
                <CheckCircle fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText primary={feature} />
            </ListItem>
          ))}
        </List>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Typography variant="h6" color="primary" fontWeight="bold">
          {plan.price} €
        </Typography>
        <Button variant="contained" color="primary" endIcon={<ArrowForward />}>
          Acquista
        </Button>
      </CardActions>
    </Card>
  );

  interface EnhancedLiveEvent extends LiveEvent {
    name?: string;
    presenter?: string;
  }

  const renderEventCard = (event: EnhancedLiveEvent) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="160"
        image={event.imageUrl || getImageFallback('events')}
        alt={event.name || event.title}
        onError={(e) => handleImageError(event.id, getImageFallback('events'), e)}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {event.name || event.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Event fontSize="small" color="primary" />
          <Typography variant="body2" sx={{ ml: 0.5 }}>
            {event.date}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" paragraph>
          {event.description}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Person fontSize="small" color="primary" />
          <Typography variant="body2" sx={{ ml: 0.5 }}>
            {event.presenter || event.host}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AttachMoney fontSize="small" color="primary" />
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {event.price} €
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary">
          Prenota
        </Button>
      </CardActions>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Header principale */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          mb: 4, 
          backgroundImage: `linear-gradient(to right, ${theme.palette.background.paper} 0%, ${theme.palette.background.paper} 60%, transparent 100%), url('/images/workout-header-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
          borderRadius: 2
        }}
      >
        <Box sx={{ maxWidth: '60%' }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Trasformazione & Shop
          </Typography>
          <Typography variant="h5" color="primary.main" gutterBottom sx={{ fontWeight: 'medium' }}>
            Servizi, Prodotti e Programmi per la Tua Trasformazione
          </Typography>
          <Typography variant="body1" paragraph>
            Benvenuto nella sezione dedicata alla tua trasformazione fisica e mentale. Qui troverai tutto ciò di cui hai bisogno per raggiungere i tuoi obiettivi: dai programmi personalizzati ai prodotti di qualità, dai servizi di coaching agli eventi formativi.
          </Typography>
        </Box>
      </Paper>

      {/* Tab principale per scegliere tra Transformation e Shop */}
      <Box sx={{ width: '100%', mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={mainTabValue} 
            onChange={handleMainTabChange} 
            aria-label="transformation and shop tabs"
            centered
            sx={{ '& .MuiTab-root': { fontWeight: 'bold' } }}
          >
            <Tab label="Trasformazione" {...a11yProps(0)} />
            <Tab label="Shop" {...a11yProps(1)} />
          </Tabs>
        </Box>

        {/* Tab Panel per Transformation */}
        <TabPanel value={mainTabValue} index={0}>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={transformationTabValue} 
                onChange={handleTransformationTabChange} 
                aria-label="transformation tabs"
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Programmi" {...a11yProps(0)} />
                <Tab label="Servizi" {...a11yProps(1)} />
                <Tab label="Coach" {...a11yProps(2)} />
                <Tab label="Eventi Live" {...a11yProps(3)} />
              </Tabs>
            </Box>

            {/* Programmi di Trasformazione */}
            <TabPanel value={transformationTabValue} index={0}>
              <Grid container spacing={3}>
                {transformationPlans.map((plan) => (
                  <Grid item key={plan.id} xs={12} sm={6} md={4}>
                    {renderPlanCard(plan as EnhancedTransformationPlan)}
                  </Grid>
                ))}
              </Grid>
            </TabPanel>

            {/* Servizi */}
            <TabPanel value={transformationTabValue} index={1}>
              <Grid container spacing={3}>
                {services.map((service) => (
                  <Grid item key={service.id} xs={12} sm={6} md={4}>
                    {renderServiceCard(service)}
                  </Grid>
                ))}
              </Grid>
            </TabPanel>

            {/* Coach */}
            <TabPanel value={transformationTabValue} index={2}>
              <Grid container spacing={3}>
                {coaches.map((coach) => (
                  <Grid item key={coach.id} xs={12} sm={6} md={4}>
                    {renderCoachCard(coach)}
                  </Grid>
                ))}
              </Grid>
            </TabPanel>

            {/* Eventi Live */}
            <TabPanel value={transformationTabValue} index={3}>
              <Grid container spacing={3}>
                {liveEvents.map((event) => (
                  <Grid item key={event.id} xs={12} sm={6} md={4}>
                    {renderEventCard(event as EnhancedLiveEvent)}
                  </Grid>
                ))}
              </Grid>
            </TabPanel>
          </Box>
        </TabPanel>

        {/* Tab Panel per Shop */}
        <TabPanel value={mainTabValue} index={1}>
          <Box sx={{ width: '100%' }}>
            {/* Prodotti in evidenza */}
            <Box sx={{ mb: 6 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Prodotti in Evidenza
              </Typography>
              <Grid container spacing={3}>
                {featuredProducts.map((product) => (
                  <Grid item key={product.id} xs={12} sm={6} md={4}>
                    {renderProductCard(product)}
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Categorie di prodotti */}
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                  value={shopCategoryTab} 
                  onChange={handleShopCategoryChange} 
                  aria-label="shop category tabs"
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  {productCategories.map((category, index) => (
                    <Tab key={category.id} label={category.name} {...a11yProps(index)} />
                  ))}
                </Tabs>
              </Box>

              {productCategories.map((category, index) => (
                <TabPanel key={category.id} value={shopCategoryTab} index={index}>
                  <Grid container spacing={3}>
                    {products
                      .filter(product => product.category === category.id)
                      .map((product) => (
                        <Grid item key={product.id} xs={12} sm={6} md={4}>
                          {renderProductCard(product)}
                        </Grid>
                      ))}
                  </Grid>
                </TabPanel>
              ))}
            </Box>
          </Box>
        </TabPanel>
      </Box>

      {/* Vantaggi e Caratteristiche */}
      <Paper sx={{ p: 4, mb: 6, borderRadius: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          Perché Scegliere i Nostri Prodotti e Servizi
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <VerifiedUserIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" gutterBottom>Qualità Garantita</Typography>
              <Typography variant="body2" color="text.secondary">
                Tutti i nostri prodotti e servizi sono testati e garantiti per offrire la massima qualità.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <LocalShippingIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" gutterBottom>Consegna Rapida</Typography>
              <Typography variant="body2" color="text.secondary">
                Spedizione veloce in tutta Italia con tracciamento e assistenza dedicata.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <PsychologyIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" gutterBottom>Supporto Esperto</Typography>
              <Typography variant="body2" color="text.secondary">
                Coach e professionisti qualificati pronti ad assisterti nel tuo percorso.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <LocalOfferIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" gutterBottom>Prezzi Competitivi</Typography>
              <Typography variant="body2" color="text.secondary">
                Offriamo il miglior rapporto qualità-prezzo sul mercato per tutti i nostri prodotti.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default TransformationHub;
