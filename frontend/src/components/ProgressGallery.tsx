import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Tabs, 
  Tab, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  IconButton,
  Slider,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { 
  Close as CloseIcon, 
  ArrowBack as ArrowBackIcon, 
  ArrowForward as ArrowForwardIcon,
  CompareArrows as CompareArrowsIcon,
  AddPhotoAlternate as AddPhotoIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { ProgressPhoto } from '../types/measurements';

interface ProgressGalleryProps {
  photos: ProgressPhoto[];
}

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
      id={`progress-tabpanel-${index}`}
      aria-labelledby={`progress-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ProgressGallery: React.FC<ProgressGalleryProps> = ({ photos }) => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<ProgressPhoto | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [beforePhoto, setBeforePhoto] = useState<ProgressPhoto | null>(null);
  const [afterPhoto, setAfterPhoto] = useState<ProgressPhoto | null>(null);
  const [sliderValue, setSliderValue] = useState(50);
  const [filterDate, setFilterDate] = useState<string>('all');

  const categories: Array<'front' | 'side' | 'back' | 'other'> = ['front', 'side', 'back', 'other'];
  const categoryLabels = {
    front: 'Frontale',
    side: 'Laterale',
    back: 'Posteriore',
    other: 'Altro'
  };

  // Ottieni date uniche per il filtro
  const uniqueDates = ['all', ...Array.from(new Set(photos.map(photo => photo.date)))];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handlePhotoClick = (photo: ProgressPhoto) => {
    setSelectedPhoto(photo);
  };

  const handleCloseDialog = () => {
    setSelectedPhoto(null);
  };

  const handleCompareClick = () => {
    setCompareMode(true);
    
    // Trova la prima e l'ultima foto della categoria corrente
    const categoryPhotos = photos.filter(photo => photo.category === categories[tabValue]);
    if (categoryPhotos.length >= 2) {
      // Ordina per data
      const sortedPhotos = [...categoryPhotos].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      setBeforePhoto(sortedPhotos[0]);
      setAfterPhoto(sortedPhotos[sortedPhotos.length - 1]);
    }
  };

  const handleCloseCompare = () => {
    setCompareMode(false);
    setBeforePhoto(null);
    setAfterPhoto(null);
    setSliderValue(50);
  };

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setSliderValue(newValue as number);
  };

  const handleDateFilterChange = (event: SelectChangeEvent) => {
    setFilterDate(event.target.value);
  };

  // Filtra le foto per data e categoria
  const filteredPhotos = photos.filter(photo => {
    const matchesCategory = photo.category === categories[tabValue];
    const matchesDate = filterDate === 'all' || photo.date === filterDate;
    return matchesCategory && matchesDate;
  });

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="progress photo tabs">
          {categories.map((category, index) => (
            <Tab key={category} label={categoryLabels[category]} id={`progress-tab-${index}`} />
          ))}
        </Tabs>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="date-filter-label">Data</InputLabel>
            <Select
              labelId="date-filter-label"
              id="date-filter"
              value={filterDate}
              label="Data"
              onChange={handleDateFilterChange}
              size="small"
            >
              <MenuItem value="all">Tutte le date</MenuItem>
              {uniqueDates.filter(date => date !== 'all').map(date => (
                <MenuItem key={date} value={date}>
                  {format(new Date(date), 'd MMMM yyyy', { locale: it })}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button 
            variant="outlined" 
            startIcon={<CompareArrowsIcon />} 
            onClick={handleCompareClick}
            disabled={photos.filter(p => p.category === categories[tabValue]).length < 2}
          >
            Confronta
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddPhotoIcon />}
          >
            Aggiungi Foto
          </Button>
        </Box>
      </Box>

      {categories.map((category, index) => (
        <TabPanel key={category} value={tabValue} index={index}>
          {filteredPhotos.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
              Nessuna foto disponibile per questa categoria e data.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {filteredPhotos.map((photo) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={photo.id}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'scale(1.02)' }
                    }}
                    onClick={() => handlePhotoClick(photo)}
                  >
                    <CardMedia
                      component="img"
                      height="250"
                      image={photo.imageUrl}
                      alt={`Foto progresso ${format(new Date(photo.date), 'd MMMM yyyy', { locale: it })}`}
                    />
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        {format(new Date(photo.date), 'd MMMM yyyy', { locale: it })}
                      </Typography>
                      {photo.note && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {photo.note}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>
      ))}

      {/* Dialog per visualizzare la foto selezionata */}
      <Dialog
        open={selectedPhoto !== null}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedPhoto && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                {format(new Date(selectedPhoto.date), 'd MMMM yyyy', { locale: it })} - {categoryLabels[selectedPhoto.category]}
              </Typography>
              <IconButton onClick={handleCloseDialog}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <img 
                  src={selectedPhoto.imageUrl} 
                  alt={`Foto progresso ${selectedPhoto.date}`} 
                  style={{ maxWidth: '100%', maxHeight: '70vh' }}
                />
                {selectedPhoto.note && (
                  <Paper sx={{ p: 2, width: '100%' }}>
                    <Typography variant="body1">
                      {selectedPhoto.note}
                    </Typography>
                  </Paper>
                )}
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* Dialog per confrontare le foto */}
      <Dialog
        open={compareMode}
        onClose={handleCloseCompare}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Confronto Progressi - {categoryLabels[categories[tabValue]]}
          </Typography>
          <IconButton onClick={handleCloseCompare}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {beforePhoto && afterPhoto ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Typography>
                  Prima: {format(new Date(beforePhoto.date), 'd MMMM yyyy', { locale: it })}
                </Typography>
                <Typography>
                  Dopo: {format(new Date(afterPhoto.date), 'd MMMM yyyy', { locale: it })}
                </Typography>
              </Box>
              
              <Box sx={{ position: 'relative', width: '100%', height: '70vh', overflow: 'hidden' }}>
                <Box
                  component="img"
                  src={beforePhoto.imageUrl}
                  alt="Prima"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
                <Box
                  component="img"
                  src={afterPhoto.imageUrl}
                  alt="Dopo"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    clipPath: `polygon(${sliderValue}% 0, 100% 0, 100% 100%, ${sliderValue}% 100%)`,
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: `${sliderValue}%`,
                    height: '100%',
                    width: '2px',
                    backgroundColor: 'primary.main',
                    transform: 'translateX(-1px)',
                    zIndex: 2,
                  }}
                />
              </Box>
              
              <Slider
                value={sliderValue}
                onChange={handleSliderChange}
                aria-labelledby="compare-slider"
                sx={{ width: '80%' }}
              />
            </Box>
          ) : (
            <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
              Non ci sono abbastanza foto per effettuare un confronto.
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ProgressGallery;
