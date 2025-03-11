import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Divider, 
  Chip, 
  Rating, 
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme
} from '@mui/material';
import { 
  ShoppingCart as ShoppingCartIcon, 
  Favorite as FavoriteIcon, 
  LocalShipping as LocalShippingIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  ArrowForward as ArrowForwardIcon,
  Settings as SettingsIcon,
  VerifiedUser as VerifiedUserIcon,
  Psychology as PsychologyIcon,
  LocalOffer as LocalOfferIcon,
  LowPriority as LowPriorityIcon
} from '@mui/icons-material';

import { Product, ProductCategory } from '../types/shop';
import { productCategories, products, getFeaturedProducts } from '../data/shopData';

const ShopPage: React.FC = () => {
  const theme = useTheme();
  const [categoryTab, setCategoryTab] = useState(0);
  const featuredProducts = getFeaturedProducts();

  const handleCategoryChange = (event: React.SyntheticEvent, newValue: number) => {
    setCategoryTab(newValue);
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Header e Introduzione */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          mb: 6, 
          backgroundImage: `linear-gradient(to right, ${theme.palette.background.paper} 0%, ${theme.palette.background.paper} 60%, transparent 100%), url('/images/workout-header-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
          borderRadius: 2
        }}
      >
        <Box sx={{ maxWidth: '60%' }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Fitness Shop
          </Typography>
          <Typography variant="h5" color="primary.main" gutterBottom sx={{ fontWeight: 'medium' }}>
            Attrezzatura Innovativa a Prezzi Competitivi
          </Typography>
          <Typography variant="body1" paragraph>
            Benvenuto nel nostro Fitness Shop, un'estensione naturale dell'ecosistema Healthy Life Habits dove qualità e innovazione si uniscono a prezzi imbattibili.
          </Typography>
          <Typography variant="body1" paragraph>
            La nostra produzione in-house ci permette di offrire prodotti di alta qualità a costi contenuti, proprio come avviene per i nostri esclusivi pesi in cemento, studiati per garantire performance professionali con materiali innovativi.
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button 
              variant="contained" 
              size="large" 
              endIcon={<ArrowForwardIcon />}
              sx={{ mr: 2 }}
            >
              Esplora il catalogo
            </Button>
            <Button variant="outlined" size="large">
              Offerte speciali
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Prodotti in Evidenza */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
          Prodotti in Evidenza
        </Typography>
        <Grid container spacing={3}>
          {featuredProducts.map(product => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              {renderProductCard(product)}
            </Grid>
          ))}
        </Grid>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button 
            variant="outlined" 
            color="primary" 
            endIcon={<ArrowForwardIcon />}
            size="large"
          >
            Vedi tutti i prodotti
          </Button>
        </Box>
      </Box>

      {/* Categorie Principali */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Categorie Principali
        </Typography>
        <Tabs 
          value={categoryTab} 
          onChange={handleCategoryChange} 
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
        >
          {productCategories.map((category, index) => (
            <Tab 
              key={category.id} 
              label={category.name} 
              id={`category-tab-${index}`}
              aria-controls={`category-tabpanel-${index}`}
            />
          ))}
        </Tabs>
        <Box sx={{ p: 1 }}>
          {productCategories.map((category, index) => (
            <div
              key={category.id}
              role="tabpanel"
              hidden={categoryTab !== index}
              id={`category-tabpanel-${index}`}
              aria-labelledby={`category-tab-${index}`}
            >
              {categoryTab === index && (
                <Box>
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                          {category.name}
                        </Typography>
                        <Typography variant="body1" paragraph>
                          {category.description}
                        </Typography>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          endIcon={<ArrowForwardIcon />}
                          sx={{ alignSelf: 'flex-start' }}
                        >
                          Esplora {category.name}
                        </Button>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 0,
                          height: '250px',
                          backgroundImage: `url(${category.imageUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          borderRadius: 2
                        }}
                      />
                    </Grid>
                  </Grid>
                  
                  <Grid container spacing={3}>
                    {products
                      .filter(product => product.category === category.id)
                      .slice(0, 3)
                      .map(product => (
                        <Grid item key={product.id} xs={12} sm={6} md={4}>
                          {renderProductCard(product)}
                        </Grid>
                      ))}
                  </Grid>
                </Box>
              )}
            </div>
          ))}
        </Box>
      </Box>

      {/* Modello di Vendita e Distribuzione */}
      <Paper sx={{ p: 4, mb: 6, borderRadius: 2 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
          Il Nostro Impegno Verso di Te
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <LocalShippingIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />
              </Box>
              <Typography variant="h6" gutterBottom>
                Vendita Diretta
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                Integrazione diretta con l'app per un checkout semplice e sicuro. Consegna rapida e tracciabile in tutta Italia.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <SettingsIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />
              </Box>
              <Typography variant="h6" gutterBottom>
                Opzioni di Personalizzazione
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                Possibilità di scegliere dimensioni, peso e colori per alcuni prodotti per rispondere alle tue esigenze individuali.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <VerifiedUserIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />
              </Box>
              <Typography variant="h6" gutterBottom>
                Servizio Clienti Dedicato
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                Garanzia di assistenza post-vendita, con supporto per eventuali domande o necessità di manutenzione.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Comunicazione e Branding */}
      <Box sx={{ mb: 6, p: 4, bgcolor: theme.palette.grey[50], borderRadius: 2 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              La nostra filosofia
            </Typography>
            <Typography variant="h4" gutterBottom color="primary.main" sx={{ fontWeight: 'medium' }}>
              "Attrezzatura premium, prezzo accessibile: la qualità dell'innovazione al servizio del tuo allenamento."
            </Typography>
            <Typography variant="body1" paragraph>
              Crediamo che l'attrezzatura di qualità dovrebbe essere accessibile a tutti. Ogni nostro prodotto nasce da una attenta fase di progettazione, test rigorosi e feedback dei nostri atleti. 
            </Typography>
            <Typography variant="body1">
              Dalla scelta dei materiali al design ergonomico, ogni dettaglio è pensato per offrirti il massimo della performance con un investimento ragionevole. I nostri pesi in cemento sono l'esempio perfetto di come l'innovazione possa rendere accessibile l'eccellenza.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Produzione in-house" 
                  secondary="Controllo diretto sulla qualità e riduzione dei costi di intermediazione"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LowPriorityIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Materiali innovativi" 
                  secondary="Utilizzo di cemento rinforzato e altre soluzioni economiche ma durevoli"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PsychologyIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Design intelligente" 
                  secondary="Progettazione ottimizzata per massimizzare le prestazioni e minimizzare i costi"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LocalOfferIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Politica no-frills" 
                  secondary="Ci concentriamo sulla sostanza eliminando costi superflui di packaging e marketing"
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Box>

      {/* Call-to-Action */}
      <Box 
        sx={{ 
          textAlign: 'center', 
          py: 6, 
          px: 3,
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
          borderRadius: 2,
          color: 'white'
        }}
      >
        <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
          Trasforma il tuo allenamento con la nostra attrezzatura
        </Typography>
        <Typography variant="h6" paragraph sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}>
          Qualità professionale a prezzi accessibili, direttamente a casa tua
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          color="secondary"
          sx={{ 
            px: 4, 
            py: 1.5, 
            fontSize: '1.1rem',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: theme.palette.secondary.light,
              transform: 'translateY(-2px)',
              boxShadow: 8
            },
            transition: 'all 0.3s'
          }}
        >
          Acquista ora e trasforma il tuo allenamento
        </Button>
      </Box>
    </Container>
  );
};

export default ShopPage;
