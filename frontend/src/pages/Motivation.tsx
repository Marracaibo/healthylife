import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Button, 
  Tabs, 
  Tab, 
  Paper, 
  Divider,
  useTheme,
  IconButton,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  Add as AddIcon,
  KeyboardArrowDown as DownIcon
} from '@mui/icons-material';

// Componenti
import QuoteCard from '../components/motivation/QuoteCard';
import VideoCard from '../components/motivation/VideoCard';
import PreWorkoutBoosterComponent from '../components/motivation/PreWorkoutBooster';
import TransformationCard from '../components/motivation/TransformationCard';
import DiaryEntryComponent from '../components/motivation/DiaryEntry';

// Dati di esempio
import { 
  sampleQuotes, 
  sampleVideos, 
  sampleDiaryEntries,
  sampleGoals,
  sampleTransformations,
  sampleBoosters 
} from '../data/motivationSampleData';

// Tipi
import { DiaryEntry, MotivationalVideo, Quote, Transformation } from '../types/motivation';

const MotivationPage: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(sampleDiaryEntries);
  const [isNewDiaryOpen, setIsNewDiaryOpen] = useState(false);
  const [featureTab, setFeatureTab] = useState(0);

  // Gestione delle tabs principali
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Gestione delle tabs delle funzionalità
  const handleFeatureTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setFeatureTab(newValue);
  };

  // Gestione del diario
  const handleSaveDiaryEntry = (entry: Partial<DiaryEntry>) => {
    if (entry.id) {
      // Aggiornamento di una voce esistente
      setDiaryEntries(diaryEntries.map(item => 
        item.id === entry.id ? { ...item, ...entry } as DiaryEntry : item
      ));
    } else {
      // Creazione di una nuova voce
      const newEntry: DiaryEntry = {
        id: `diary-${Date.now()}`,
        userId: 'user-1',
        title: entry.title || '',
        content: entry.content || '',
        mood: entry.mood || 'neutral',
        date: new Date().toISOString(),
        isPrivate: entry.isPrivate || false,
        tags: entry.tags || []
      };
      setDiaryEntries([newEntry, ...diaryEntries]);
    }
    
    setIsNewDiaryOpen(false);
  };

  const handleDeleteDiaryEntry = (id: string) => {
    setDiaryEntries(diaryEntries.filter(entry => entry.id !== id));
  };

  // Gestione dei like
  const handleLikeQuote = (id: string) => {
    console.log('Like quote:', id);
  };

  const handleLikeVideo = (id: string) => {
    console.log('Like video:', id);
  };

  const handleLikeTransformation = (id: string) => {
    console.log('Like transformation:', id);
  };

  // Gestione della condivisione
  const handleShareQuote = (id: string) => {
    console.log('Share quote:', id);
  };

  const handleShareVideo = (id: string) => {
    console.log('Share video:', id);
  };

  const handleShareTransformation = (id: string) => {
    console.log('Share transformation:', id);
  };

  // Gestione della riproduzione video
  const handlePlayVideo = (id: string) => {
    console.log('Play video:', id);
  };

  // Gestione dei commenti
  const handleAddComment = (id: string, comment: string) => {
    console.log('Add comment to transformation:', id, comment);
  };

  // Rendering del diario della trasformazione
  const renderDiarySection = () => (
    <Box sx={{ mb: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 0 }}>
          Diario della Trasformazione
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => setIsNewDiaryOpen(true)}
        >
          Nuova voce
        </Button>
      </Box>
      
      <Typography variant="body1" paragraph color="text.secondary">
        Racconta la tua storia, registra i tuoi progressi e imposta nuovi obiettivi. Il diario è uno strumento potente per tenere traccia del tuo percorso e mantenere alta la motivazione.
      </Typography>
      
      {diaryEntries.map(entry => (
        <DiaryEntryComponent 
          key={entry.id} 
          entry={entry} 
          onSave={handleSaveDiaryEntry}
          onDelete={handleDeleteDiaryEntry}
        />
      ))}
      
      {diaryEntries.length === 0 && (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="subtitle1" color="text.secondary">
            Non hai ancora nessuna voce nel diario. Inizia a raccontare il tuo percorso!
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => setIsNewDiaryOpen(true)}
            sx={{ mt: 2 }}
          >
            Crea la prima voce
          </Button>
        </Paper>
      )}
      
      {/* Dialog per creare una nuova voce */}
      <Dialog 
        open={isNewDiaryOpen} 
        onClose={() => setIsNewDiaryOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Nuova voce del diario</DialogTitle>
        <DialogContent dividers>
          <DiaryEntryComponent 
            isNew={true} 
            onSave={handleSaveDiaryEntry}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsNewDiaryOpen(false)}>Annulla</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  // Rendering dei video motivazionali
  const renderVideosSection = () => (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Mini Video Motivazionali
      </Typography>
      <Typography variant="body1" paragraph color="text.secondary">
        Lasciati ispirare da brevi clip di esperti, atleti e membri della community che condividono messaggi motivazionali, consigli pratici e testimonianze di successo.
      </Typography>
      
      <Grid container spacing={3}>
        {sampleVideos.map(video => (
          <Grid item key={video.id} xs={12} sm={6} md={4}>
            <VideoCard 
              video={video}
              onPlay={handlePlayVideo}
              onLike={handleLikeVideo}
              onShare={handleShareVideo}
            />
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Button 
          variant="outlined" 
          endIcon={<DownIcon />}
        >
          Carica altri video
        </Button>
      </Box>
    </Box>
  );

  // Rendering delle citazioni motivazionali
  const renderQuotesSection = () => (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Frasi e Citazioni Motivazionali
      </Typography>
      <Typography variant="body1" paragraph color="text.secondary">
        Un flusso continuo di positività e motivazione attraverso citazioni e frasi ispiranti, sia curate dal nostro team che generate dalla community.
      </Typography>
      
      <Grid container spacing={3}>
        {sampleQuotes.map(quote => (
          <Grid item key={quote.id} xs={12} sm={6} md={4}>
            <QuoteCard 
              quote={quote}
              onLike={handleLikeQuote}
              onShare={handleShareQuote}
            />
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Button 
          variant="outlined" 
          endIcon={<DownIcon />}
        >
          Carica altre citazioni
        </Button>
      </Box>
    </Box>
  );

  // Rendering delle trasformazioni della community
  const renderTransformationsSection = () => (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Trasformazioni della Community
      </Typography>
      <Typography variant="body1" paragraph color="text.secondary">
        Storie reali di persone che, proprio come te, hanno intrapreso un percorso di cambiamento. Lasciati ispirare e motivare dai loro successi.
      </Typography>
      
      <Grid container spacing={4}>
        {sampleTransformations.map(transformation => (
          <Grid item key={transformation.id} xs={12}>
            <TransformationCard 
              transformation={transformation}
              onLike={handleLikeTransformation}
              onShare={handleShareTransformation}
              onAddComment={handleAddComment}
            />
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Button 
          variant="outlined" 
          endIcon={<DownIcon />}
        >
          Carica altre storie
        </Button>
      </Box>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Header */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          mb: 4, 
          backgroundImage: `linear-gradient(to right, ${theme.palette.background.paper} 0%, ${theme.palette.background.paper} 60%, transparent 100%), url('/images/motivation-header-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
          borderRadius: 2
        }}
      >
        <Box sx={{ maxWidth: '60%' }}>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            Motivazione
          </Typography>
          <Typography variant="h5" color="primary" gutterBottom>
            Il Tuo Percorso di Cambiamento
          </Typography>
          <Typography variant="body1" paragraph>
            Trova l'ispirazione, condividi i tuoi successi e mantieni alta la motivazione. Questa sezione è dedicata a tutti coloro che desiderano trasformare non solo il proprio corpo, ma anche la propria mentalità.
          </Typography>
          <Button variant="contained" size="large">
            Esplora la Community
          </Button>
        </Box>
      </Paper>

      {/* Pre-Workout Booster */}
      <PreWorkoutBoosterComponent />
      
      {/* Tabs per navigare tra le diverse funzionalità */}
      <Box sx={{ mb: 4 }}>
        <Tabs 
          value={featureTab} 
          onChange={handleFeatureTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            mb: 2,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 'medium',
              fontSize: '1rem'
            }
          }}
        >
          <Tab label="Diario della Trasformazione" />
          <Tab label="Video Motivazionali" />
          <Tab label="Citazioni Ispiranti" />
          <Tab label="Trasformazioni della Community" />
        </Tabs>
        
        <Box sx={{ p: 1 }}>
          {featureTab === 0 && renderDiarySection()}
          {featureTab === 1 && renderVideosSection()}
          {featureTab === 2 && renderQuotesSection()}
          {featureTab === 3 && renderTransformationsSection()}
        </Box>
      </Box>
      
      {/* FAB per aggiungere nuovi contenuti */}
      <Fab 
        color="primary" 
        sx={{ 
          position: 'fixed', 
          bottom: 20, 
          right: 20 
        }}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default MotivationPage;
