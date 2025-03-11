import React from 'react';
import { Container, Typography, Box, Paper, Divider } from '@mui/material';
import TranslationTester from '../components/TranslationTester';

const TestPage: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Pagina di Test per HealthyLife App
        </Typography>
        <Typography variant="body1">
          Questa pagina contiene vari test per verificare il corretto funzionamento dell'applicazione.
        </Typography>
      </Paper>
      
      <TranslationTester />
      
      <Box mt={4} p={2} border={1} borderColor="divider" borderRadius={1}>
        <Typography variant="caption" color="text.secondary">
          Versione test: 1.0.0 - {new Date().toLocaleString()}
        </Typography>
      </Box>
    </Container>
  );
};

export default TestPage;
