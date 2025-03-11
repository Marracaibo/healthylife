import React from 'react';
import { Box, Typography, Chip, Tooltip, Paper, useTheme, useMediaQuery } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import TranslateIcon from '@mui/icons-material/Translate';
import { createLogger } from '../utils/logger';

const logger = createLogger('QueryTranslationInfo');

interface QueryTranslationInfoProps {
  originalQuery: string;
  translatedQuery: string;
  show: boolean;
}

/**
 * Componente che mostra informazioni sulla traduzione della query
 */
const QueryTranslationInfo: React.FC<QueryTranslationInfoProps> = ({
  originalQuery,
  translatedQuery,
  show
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Non mostrare nulla se non dobbiamo mostrare info o se le query sono identiche
  if (!show || originalQuery === translatedQuery) {
    return null;
  }
  
  // Log della traduzione per debug
  logger.info(`Mostrando info traduzione: "${originalQuery}" -> "${translatedQuery}"`);
  
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: isMobile ? 0.75 : 1, 
        mb: 2, 
        bgcolor: 'info.light', 
        color: 'info.contrastText',
        borderRadius: 1,
        display: 'flex',
        alignItems: isMobile ? 'flex-start' : 'center',
        flexDirection: isMobile ? 'column' : 'row',
      }}
    >
      {!isMobile && <TranslateIcon sx={{ mr: 1 }} />}
      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isMobile && <TranslateIcon fontSize="small" sx={{ mr: 0.5 }} />}
          <Typography variant={isMobile ? "caption" : "body2"} fontWeight="medium">
            La ricerca è stata tradotta per risultati migliori
          </Typography>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mt: 0.5,
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center'
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            mb: isMobile ? 0.5 : 0,
            width: isMobile ? '100%' : 'auto'
          }}>
            <Chip 
              label={originalQuery}
              size="small"
              variant="outlined"
              sx={{ 
                mr: 1, 
                borderColor: 'info.contrastText',
                fontSize: isMobile ? '0.7rem' : '0.75rem',
                height: isMobile ? '24px' : '32px'
              }}
            />
            <Typography variant="body2">→</Typography>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            width: isMobile ? '100%' : 'auto'
          }}>
            <Chip 
              label={translatedQuery}
              size="small"
              variant="filled"
              sx={{ 
                ml: isMobile ? 0 : 1, 
                bgcolor: 'info.dark',
                fontSize: isMobile ? '0.7rem' : '0.75rem',
                height: isMobile ? '24px' : '32px'
              }}
            />
            <Tooltip title="Utilizziamo la traduzione per trovare più alimenti nei database internazionali">
              <InfoIcon fontSize="small" sx={{ ml: 1 }} />
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default QueryTranslationInfo;
