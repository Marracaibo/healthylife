import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  Tabs, 
  Tab, 
  Box, 
  TextField, 
  Button, 
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';

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
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function Auth() {
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState<string>('');

  // Stati per la registrazione
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    activityLevel: '',
    goal: '',
  });

  // Stati per il login
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError('');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        throw new Error('Errore durante la registrazione');
      }

      const data = await response.json();
      // Salva il token o l'ID utente e reindirizza alla dashboard
      window.location.href = '/';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore durante la registrazione');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        throw new Error('Credenziali non valide');
      }

      const data = await response.json();
      // Salva il token o l'ID utente e reindirizza alla dashboard
      window.location.href = '/';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore durante il login');
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Login" />
          <Tab label="Registrati" />
        </Tabs>

        {error && (
          <Box sx={{ p: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        <TabPanel value={tabValue} index={0}>
          <form onSubmit={handleLogin}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              type="email"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Accedi
            </Button>
          </form>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <form onSubmit={handleRegister}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              type="email"
              value={registerData.email}
              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Nome"
              value={registerData.name}
              onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Età"
              type="number"
              value={registerData.age}
              onChange={(e) => setRegisterData({ ...registerData, age: e.target.value })}
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Genere</InputLabel>
              <Select
                value={registerData.gender}
                label="Genere"
                onChange={(e) => setRegisterData({ ...registerData, gender: e.target.value })}
              >
                <MenuItem value="M">Maschio</MenuItem>
                <MenuItem value="F">Femmina</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Altezza (cm)"
              type="number"
              value={registerData.height}
              onChange={(e) => setRegisterData({ ...registerData, height: e.target.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Peso (kg)"
              type="number"
              value={registerData.weight}
              onChange={(e) => setRegisterData({ ...registerData, weight: e.target.value })}
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Livello di Attività</InputLabel>
              <Select
                value={registerData.activityLevel}
                label="Livello di Attività"
                onChange={(e) => setRegisterData({ ...registerData, activityLevel: e.target.value })}
              >
                <MenuItem value="sedentary">Sedentario</MenuItem>
                <MenuItem value="light">Leggero</MenuItem>
                <MenuItem value="moderate">Moderato</MenuItem>
                <MenuItem value="very_active">Molto Attivo</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Obiettivo</InputLabel>
              <Select
                value={registerData.goal}
                label="Obiettivo"
                onChange={(e) => setRegisterData({ ...registerData, goal: e.target.value })}
              >
                <MenuItem value="weight_loss">Perdita di Peso</MenuItem>
                <MenuItem value="maintenance">Mantenimento</MenuItem>
                <MenuItem value="muscle_gain">Aumento Massa Muscolare</MenuItem>
              </Select>
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Registrati
            </Button>
          </form>
        </TabPanel>
      </Paper>
    </Container>
  );
}
