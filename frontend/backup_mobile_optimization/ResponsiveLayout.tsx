import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';

// Icons for bottom navigation
import DashboardIcon from '@mui/icons-material/Dashboard';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import InsightsIcon from '@mui/icons-material/Insights';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  drawerContent: React.ReactNode;
  title: string;
}

const drawerWidth = 240;

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ 
  children, 
  drawerContent, 
  title 
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bottomNavValue, setBottomNavValue] = useState(0);

  // Update bottom nav value based on current location
  useEffect(() => {
    const path = location.pathname;
    if (path === '/' || path === '') {
      setBottomNavValue(0);
    } else if (path.includes('meal-planner')) {
      setBottomNavValue(1);
    } else if (path.includes('workout-programs') || path.includes('workout')) {
      setBottomNavValue(2);
    } else if (path.includes('progress')) {
      setBottomNavValue(3);
    }
  }, [location]);

  const handleBottomNavChange = (event: React.SyntheticEvent, newValue: number) => {
    setBottomNavValue(newValue);
    switch(newValue) {
      case 0: // Dashboard
        navigate('/');
        break;
      case 1: // Meal Planner
        navigate('meal-planner');
        break;
      case 2: // Workout Programs
        navigate('workout-programs');
        break;
      case 3: // Progress
        navigate('progress');
        break;
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: isMobile ? '100%' : `calc(100% - ${drawerWidth}px)`,
          ml: isMobile ? 0 : `${drawerWidth}px`,
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ 
          minHeight: { xs: '56px', sm: '64px' }, // Smaller toolbar on mobile
          px: { xs: 1, sm: 2 }  // Reduced padding on mobile
        }}>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
              size="large" // Touch-friendly size
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>

      {isMobile ? (
        <SwipeableDrawer
          disableBackdropTransition={!iOS}
          disableDiscovery={iOS}
          variant="temporary"
          open={mobileOpen}
          onOpen={() => setMobileOpen(true)}
          onClose={() => setMobileOpen(false)}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              top: '56px', // Smaller top on mobile
              height: 'calc(100% - 56px)',
            },
          }}
        >
          {drawerContent}
        </SwipeableDrawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
          }}
          open
        >
          <Toolbar />
          <Divider />
          {drawerContent}
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1, sm: 3 }, // Reduced padding on mobile
          width: isMobile ? '100%' : `calc(100% - ${drawerWidth}px)`,
          ml: isMobile ? 0 : `${drawerWidth}px`,
          mt: { xs: '56px', sm: '64px' }, // Adjusted for different toolbar heights
          mb: isMobile ? '64px' : 0, // Make room for bottom navigation on mobile
          overflow: 'auto',
        }}
      >
        {children}
      </Box>

      {isMobile && (
        <Paper 
          sx={{ 
            position: 'fixed', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            zIndex: 1000,
            boxShadow: '0 -2px 8px rgba(0,0,0,0.12)',
            borderRadius: '0',
            overflow: 'hidden',
            // Garantisce visibilità su sfondo bianco e sicurezza dal notch
            paddingBottom: 'env(safe-area-inset-bottom, 0px)'
          }} 
          elevation={3}
        >
          <BottomNavigation
            showLabels
            value={bottomNavValue}
            onChange={handleBottomNavChange}
            sx={{
              height: '64px', // Dimensione touch-friendly
              '& .MuiBottomNavigationAction-root': {
                minWidth: '48px', // Dimensione touch-friendly per azione
                padding: '6px 0',
                paddingBottom: 'env(safe-area-inset-bottom, 0px)', // Supporto per notch
                '& .MuiSvgIcon-root': {
                  fontSize: '1.5rem', // Icone più grandi e touch-friendly
                },
                '& .MuiBottomNavigationAction-label': {
                  fontSize: '0.7rem',
                  '&.Mui-selected': {
                    fontSize: '0.75rem'
                  }
                }
              },
              '& .Mui-selected': {
                color: theme.palette.primary.main,
                fontWeight: 'bold'
              }
            }}
          >
            <BottomNavigationAction label="Home" icon={<DashboardIcon />} />
            <BottomNavigationAction label="Pasti" icon={<RestaurantMenuIcon />} />
            <BottomNavigationAction label="Workout" icon={<FitnessCenterIcon />} />
            <BottomNavigationAction label="Progressi" icon={<InsightsIcon />} />
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
};

export default ResponsiveLayout;
