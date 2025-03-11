import React from 'react';
import { Container, Typography, Box, Paper, Divider } from '@mui/material';
import HybridFoodTest from '../test/hybridFoodTest';

const TestHybridFood: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 3, my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Test del Servizio di Ricerca Alimenti
        </Typography>
        <Typography variant="body1" paragraph>
          Questa pagina contiene test specifici per verificare il corretto funzionamento 
          del servizio hybridFoodService dopo la rimozione della traduzione.
        </Typography>
      </Paper>
      
      <HybridFoodTest />
      
      <Box mt={4} p={2} border={1} borderColor="divider" borderRadius={1}>
        <Typography variant="caption" color="text.secondary">
          Versione test: 1.0.0 - {new Date().toLocaleString()}
        </Typography>
      </Box>
    </Container>
  );
};

export default TestHybridFood;
