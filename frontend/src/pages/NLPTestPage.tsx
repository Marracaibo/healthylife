import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import nlpService, { NLPResult } from '../services/nlpService';

const NLPTestPage: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<NLPResult | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleProcess = async () => {
    if (userInput.length < 3) {
      setError('Inserisci una frase di almeno 3 caratteri');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const nlpResult = await nlpService.processText(userInput);
      setResult(nlpResult);
    } catch (err: any) {
      console.error('Errore nell\'elaborazione del testo:', err);
      setError(`Si è verificato un errore: ${err.message || 'Errore sconosciuto'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box mt={4} mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Test API NLP FatSecret
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Riconoscimento di alimenti da linguaggio naturale
        </Typography>
      </Box>

      <Box mb={4}>
        <Card variant="outlined">
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={10}>
                <TextField
                  fullWidth
                  label="Cosa hai mangiato?"
                  value={userInput}
                  onChange={handleInputChange}
                  placeholder="Es. Ho mangiato una pizza margherita e una coca cola"
                  InputProps={{
                    endAdornment: isProcessing ? <CircularProgress size={24} /> : null,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleProcess}
                  startIcon={<SearchIcon />}
                  disabled={isProcessing || userInput.length < 3}
                >
                  Analizza
                </Button>
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

            {result.foods.length === 0 ? (
              <Alert severity="info">
                Nessun alimento riconosciuto nella frase.
              </Alert>
            ) : (
              <Grid container spacing={3}>
                {result.foods.map((food, index) => (
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
                          {food.name}
                        </Typography>
                      </Box>

                      {food.brand && food.brand !== 'Generic' && food.brand !== 'Brand' && (
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1, fontStyle: 'italic' }}>
                          {food.brand}
                        </Typography>
                      )}

                      {food.description && (
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {food.description}
                        </Typography>
                      )}

                      {food.serving_description && (
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Porzione: {food.serving_description}
                        </Typography>
                      )}

                      {food.nutrition && (
                        <Box mt={2}>
                          <Typography variant="body2" fontWeight="bold" mb={1}>
                            Valori nutrizionali:
                          </Typography>
                          <Box display="flex" flexWrap="wrap" gap={1}>
                            {food.nutrition.calories !== undefined && (
                              <Chip
                                size="small"
                                label={`${food.nutrition.calories} kcal`}
                                color="error"
                              />
                            )}
                            {food.nutrition.protein !== undefined && (
                              <Chip
                                size="small"
                                label={`${food.nutrition.protein}g proteine`}
                                color="primary"
                              />
                            )}
                            {food.nutrition.carbohydrate !== undefined && (
                              <Chip
                                size="small"
                                label={`${food.nutrition.carbohydrate}g carboidrati`}
                                color="warning"
                              />
                            )}
                            {food.nutrition.fat !== undefined && (
                              <Chip
                                size="small"
                                label={`${food.nutrition.fat}g grassi`}
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

export default NLPTestPage;
