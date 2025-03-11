import React from 'react';
import { Container, Typography, Box, Button, Link } from '@mui/material';
import SimpleFoodSearchTest from '../test/SimpleFoodSearchTest';

const SimpleTestPage: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Test Semplificato Servizio Alimenti
        </Typography>
        
        <Box sx={{ bgcolor: '#e8f5e9', p: 2, borderRadius: 1, mb: 3 }}>
          <Typography variant="body1" gutterBottom>
            Questa pagina testa direttamente le API di ricerca alimenti con un'interfaccia semplificata.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Utilizza le funzioni di ricerca importate direttamente dal servizio, per testare il corretto funzionamento.
          </Typography>
        </Box>
        
        <SimpleFoodSearchTest />
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" component={Link} href="/">
            Torna alla home
          </Button>
          
          <Button variant="outlined" color="secondary" component={Link} href="/test-hybrid-food">
            Vai al test completo
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SimpleTestPage;
