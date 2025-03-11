import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Button,
  TextField,
  Grid,
  SelectChangeEvent
} from '@mui/material';

// Icons
import NotificationsIcon from '@mui/icons-material/Notifications';
import LanguageIcon from '@mui/icons-material/Language';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import StorageIcon from '@mui/icons-material/Storage';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TimerIcon from '@mui/icons-material/Timer';
import SecurityIcon from '@mui/icons-material/Security';

const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [offlineMode, setOfflineMode] = useState(true);
  const [language, setLanguage] = useState('english');
  const [measurementSystem, setMeasurementSystem] = useState('metric');
  const [cacheSize, setCacheSize] = useState<number>(200);

  const handleLanguageChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value as string);
  };

  const handleMeasurementSystemChange = (event: SelectChangeEvent) => {
    setMeasurementSystem(event.target.value as string);
  };

  const handleCacheSizeChange = (event: Event, newValue: number | number[]) => {
    setCacheSize(newValue as number);
  };

  return (
    <Box sx={{ maxWidth: '800px', margin: '0 auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>
      
      <Typography variant="subtitle1" gutterBottom sx={{ mb: 3 }}>
        Configure your app preferences
      </Typography>
      
      <Paper elevation={2} sx={{ mb: 4 }}>
        <List sx={{ width: '100%' }}>
          <ListItem>
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Notifications" 
              secondary="Enable push notifications for reminders and updates" 
            />
            <Switch
              edge="end"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              inputProps={{
                'aria-labelledby': 'switch-notifications',
              }}
            />
          </ListItem>
          
          <Divider variant="inset" component="li" />
          
          <ListItem>
            <ListItemIcon>
              <DarkModeIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Dark Mode" 
              secondary="Use dark theme throughout the app" 
            />
            <Switch
              edge="end"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
              inputProps={{
                'aria-labelledby': 'switch-dark-mode',
              }}
            />
          </ListItem>
          
          <Divider variant="inset" component="li" />
          
          <ListItem>
            <ListItemIcon>
              <StorageIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Offline Mode" 
              secondary="Allow app to work without internet connection" 
            />
            <Switch
              edge="end"
              checked={offlineMode}
              onChange={(e) => setOfflineMode(e.target.checked)}
              inputProps={{
                'aria-labelledby': 'switch-offline-mode',
              }}
            />
          </ListItem>
          
          <Divider variant="inset" component="li" />
          
          <ListItem sx={{ display: 'block' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <ListItemIcon>
                <LanguageIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Language" 
                secondary="Select your preferred language" 
              />
            </Box>
            <Box sx={{ pl: 7, pr: 2 }}>
              <FormControl fullWidth size="small">
                <Select
                  value={language}
                  onChange={handleLanguageChange}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  <MenuItem value="english">English</MenuItem>
                  <MenuItem value="italian">Italian</MenuItem>
                  <MenuItem value="spanish">Spanish</MenuItem>
                  <MenuItem value="french">French</MenuItem>
                  <MenuItem value="german">German</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </ListItem>
          
          <Divider variant="inset" component="li" />
          
          <ListItem sx={{ display: 'block' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <ListItemIcon>
                <LocalDiningIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Measurement System" 
                secondary="Choose metric or imperial units" 
              />
            </Box>
            <Box sx={{ pl: 7, pr: 2 }}>
              <FormControl fullWidth size="small">
                <Select
                  value={measurementSystem}
                  onChange={handleMeasurementSystemChange}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  <MenuItem value="metric">Metric (kg, cm)</MenuItem>
                  <MenuItem value="imperial">Imperial (lb, in)</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </ListItem>
          
          <Divider variant="inset" component="li" />
          
          <ListItem sx={{ display: 'block' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <ListItemIcon>
                <StorageIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Offline Cache Size" 
                secondary={`Current: ${cacheSize} MB`} 
              />
            </Box>
            <Box sx={{ pl: 7, pr: 2 }}>
              <Slider
                value={cacheSize}
                onChange={handleCacheSizeChange}
                aria-labelledby="cache-size-slider"
                valueLabelDisplay="auto"
                step={50}
                marks
                min={50}
                max={500}
              />
            </Box>
          </ListItem>
        </List>
      </Paper>
      
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Account Settings
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email Address"
              defaultValue="user@example.com"
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Full Name"
              defaultValue="John Doe"
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="New Password"
              type="password"
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" sx={{ mt: 2 }}>
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Settings;
