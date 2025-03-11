import React, { useState, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import imageRecognitionService, { ImageRecognitionResult, FoodItem } from '../services/imageRecognitionService';

const ImageRecognitionTestPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImageRecognitionResult | null>(null);
  const [region, setRegion] = useState('Italy');
  const [language, setLanguage] = useState('it');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      
      // Crea un'anteprima dell'immagine
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Reset dei risultati precedenti
      setResult(null);
      setError(null);
    }
  };

  const handleRegionChange = (event: SelectChangeEvent) => {
    setRegion(event.target.value);
  };

  const handleLanguageChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value);
  };

  const handleProcess = async () => {
    if (!selectedFile) {
      setError('Seleziona un\'immagine da analizzare');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const recognitionResult = await imageRecognitionService.uploadImage(
        selectedFile,
        region,
        language
      );
      setResult(recognitionResult);
    } catch (err: any) {
      console.error('Errore nell\'elaborazione dell\'immagine:', err);
      setError(`Si è verificato un errore: ${err.message || 'Errore sconosciuto'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Container maxWidth="lg">
      <Box mt={4} mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Test API Riconoscimento Immagini FatSecret
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Riconoscimento di alimenti da immagini
        </Typography>
      </Box>

      <Box mb={4}>
        <Card variant="outlined">
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSelectClick}
                    startIcon={<PhotoCameraIcon />}
                    sx={{ mb: 2 }}
                    fullWidth
                  >
                    Seleziona Immagine
                  </Button>
                  
                  {previewUrl && (
                    <Box
                      sx={{
                        width: '100%',
                        height: 250,
                        backgroundImage: `url(${previewUrl})`,
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        border: '1px solid #ddd',
                        borderRadius: 1,
                      }}
                    />
                  )}
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box display="flex" flexDirection="column" height="100%" justifyContent="space-between">
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Impostazioni
                    </Typography>
                    
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel id="region-select-label">Regione</InputLabel>
                      <Select
                        labelId="region-select-label"
                        value={region}
                        label="Regione"
                        onChange={handleRegionChange}
                      >
                        <MenuItem value="Italy">Italia</MenuItem>
                        <MenuItem value="US">Stati Uniti</MenuItem>
                        <MenuItem value="UK">Regno Unito</MenuItem>
                        <MenuItem value="FR">Francia</MenuItem>
                        <MenuItem value="DE">Germania</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel id="language-select-label">Lingua</InputLabel>
                      <Select
                        labelId="language-select-label"
                        value={language}
                        label="Lingua"
                        onChange={handleLanguageChange}
                      >
                        <MenuItem value="it">Italiano</MenuItem>
                        <MenuItem value="en">Inglese</MenuItem>
                        <MenuItem value="fr">Francese</MenuItem>
                        <MenuItem value="de">Tedesco</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleProcess}
                    disabled={isProcessing || !selectedFile}
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    {isProcessing ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Analizza Immagine'
                    )}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Card variant="outlined">
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Risultati</Typography>
              <Chip 
                label={result.status === "mock_response" ? "MOCK" : "API"} 
                color={result.status === "mock_response" ? "warning" : "success"}
                size="small"
              />
            </Box>
            <Divider sx={{ mb: 3 }} />

            {!result.food_response || result.food_response.length === 0 ? (
              <Alert severity="info">
                Nessun alimento riconosciuto nell'immagine.
              </Alert>
            ) : (
              <Grid container spacing={3}>
                {result.food_response.map((food: FoodItem, index: number) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Paper 
                      elevation={3} 
                      sx={{
                        p: 2,
                        height: '100%',
                        borderLeft: '4px solid',
                        borderColor: 'primary.main',
                      }}
                    >
                      <Box display="flex" alignItems="center" mb={1}>
                        <RestaurantIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6" component="h3">
                          {food.food_entry_name}
                        </Typography>
                      </Box>

                      {food.suggested_serving && food.suggested_serving.serving_description && (
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Porzione: {food.suggested_serving.serving_description}
                        </Typography>
                      )}

                      {food.eaten && food.eaten.total_nutritional_content && (
                        <Box mt={2}>
                          <Typography variant="body2" fontWeight="bold" mb={1}>
                            Valori nutrizionali:
                          </Typography>
                          <Box display="flex" flexWrap="wrap" gap={1}>
                            {food.eaten.total_nutritional_content.calories && (
                              <Chip
                                size="small"
                                label={`${food.eaten.total_nutritional_content.calories} kcal`}
                                color="error"
                              />
                            )}
                            {food.eaten.total_nutritional_content.protein && (
                              <Chip
                                size="small"
                                label={`${food.eaten.total_nutritional_content.protein}g proteine`}
                                color="primary"
                              />
                            )}
                            {food.eaten.total_nutritional_content.carbohydrate && (
                              <Chip
                                size="small"
                                label={`${food.eaten.total_nutritional_content.carbohydrate}g carboidrati`}
                                color="warning"
                              />
                            )}
                            {food.eaten.total_nutritional_content.fat && (
                              <Chip
                                size="small"
                                label={`${food.eaten.total_nutritional_content.fat}g grassi`}
                                color="secondary"
                              />
                            )}
                          </Box>
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}

            <Box mt={4}>
              <Typography variant="subtitle2" gutterBottom>Dati completi:</Typography>
              <Paper sx={{ p: 2, backgroundColor: '#f5f5f5', maxHeight: '300px', overflow: 'auto' }}>
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </Paper>
            </Box>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default ImageRecognitionTestPage;
