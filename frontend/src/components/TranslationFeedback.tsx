import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  IconButton,
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import { adaptiveTranslationService } from '../services/adaptiveTranslationService';
import { createLogger } from '../utils/logger';

const logger = createLogger('TranslationFeedback');

interface TranslationFeedbackProps {
  originalQuery: string;
  translatedQuery: string;
  onFeedbackSubmit?: (original: string, corrected: string) => void;
}

/**
 * Componente che permette agli utenti di fornire feedback sulle traduzioni
 * e migliorare il sistema di traduzione nel tempo
 */
const TranslationFeedback: React.FC<TranslationFeedbackProps> = ({
  originalQuery,
  translatedQuery,
  onFeedbackSubmit
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [correctedTranslation, setCorrectedTranslation] = useState(translatedQuery);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  
  // Non mostra nulla se la query originale è uguale a quella tradotta
  if (originalQuery === translatedQuery || !originalQuery || !translatedQuery) {
    return null;
  }
  
  const handleOpenDialog = () => {
    setDialogOpen(true);
    setCorrectedTranslation(translatedQuery);
  };
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  
  const handleAcceptTranslation = () => {
    logger.info(`Traduzione confermata dall'utente: "${originalQuery}" -> "${translatedQuery}"`);
    setFeedbackMessage('Grazie per aver confermato la traduzione!');
    setSnackbarOpen(true);
    
    // Registra la conferma per migliorare le statistiche
    const terms = originalQuery.toLowerCase().split(/\s+/);
    const translations = translatedQuery.toLowerCase().split(/\s+/);
    
    // Se hanno lo stesso numero di termini, registra le mappature
    if (terms.length === translations.length) {
      terms.forEach((term, index) => {
        if (term !== translations[index]) {
          adaptiveTranslationService.registerCustomTranslation(term, translations[index]);
        }
      });
    }
    
    if (onFeedbackSubmit) {
      onFeedbackSubmit(originalQuery, translatedQuery);
    }
  };
  
  const handleSubmitCorrection = () => {
    if (correctedTranslation && correctedTranslation !== translatedQuery) {
      logger.info(`Traduzione corretta dall'utente: "${originalQuery}" -> "${correctedTranslation}" (era: "${translatedQuery}")`);
      
      // Aggiungi la traduzione corretta al servizio adattivo
      adaptiveTranslationService.registerCustomTranslation(originalQuery, correctedTranslation);
      
      setFeedbackMessage('Grazie per il tuo contributo! La traduzione è stata migliorata.');
      setSnackbarOpen(true);
      
      if (onFeedbackSubmit) {
        onFeedbackSubmit(originalQuery, correctedTranslation);
      }
    }
    
    handleCloseDialog();
  };
  
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
        <Typography variant="body2" color="text.secondary" fontSize="0.8rem">
          Traduzione corretta?
        </Typography>
        
        <Tooltip title="Conferma che la traduzione è corretta">
          <IconButton 
            size="small" 
            color="success" 
            onClick={handleAcceptTranslation}
            sx={{ padding: '2px' }}
          >
            <CheckCircleIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Suggerisci una traduzione migliore">
          <IconButton 
            size="small" 
            color="primary" 
            onClick={handleOpenDialog}
            sx={{ padding: '2px' }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Migliora la Traduzione
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Aiutaci a migliorare il sistema di traduzione suggerendo una traduzione più accurata.
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Query originale (italiano):
            </Typography>
            <Typography variant="body1" sx={{ ml: 1 }}>
              "{originalQuery}"
            </Typography>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Traduzione attuale (inglese):
            </Typography>
            <Typography variant="body1" sx={{ ml: 1 }}>
              "{translatedQuery}"
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              La tua correzione (inglese):
            </Typography>
            <TextField
              fullWidth
              value={correctedTranslation}
              onChange={(e) => setCorrectedTranslation(e.target.value)}
              variant="outlined"
              size="small"
              placeholder="Inserisci la traduzione corretta in inglese"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Annulla
          </Button>
          <Button 
            onClick={handleSubmitCorrection} 
            color="primary" 
            variant="contained"
            disabled={!correctedTranslation || correctedTranslation === translatedQuery}
          >
            Invia Correzione
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {feedbackMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default TranslationFeedback;
