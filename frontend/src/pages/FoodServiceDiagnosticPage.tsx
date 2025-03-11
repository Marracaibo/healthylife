import React from 'react';
import { Container, Typography, Box, Button, Link } from '@mui/material';
import FoodServiceDiagnostic from '../components/diagnostics/FoodServiceDiagnostic';

const FoodServiceDiagnosticPage: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Diagnostica Servizio Alimenti
        </Typography>
        
        <Box sx={{ bgcolor: '#e8f5e9', p: 2, borderRadius: 1, mb: 3 }}>
          <Typography variant="body1" gutterBottom>
            Questa pagina esegue test diagnostici sul servizio di ricerca alimenti per identificare eventuali problemi.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Verranno eseguiti test su importazione del modulo, connettivitu00e0 con il backend e funzionalitu00e0 di ricerca.
          </Typography>
        </Box>
        
        <FoodServiceDiagnostic />
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" component={Link} href="/">
            Torna alla home
          </Button>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" color="secondary" component={Link} href="/simple-test-page">
              Test semplificato
            </Button>
            
            <Button variant="outlined" color="primary" component={Link} href="/test-food-service">
              Test completo
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default FoodServiceDiagnosticPage;
