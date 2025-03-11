import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';

// Icons
import BookIcon from '@mui/icons-material/Book';
import TimelineIcon from '@mui/icons-material/Timeline';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ChatIcon from '@mui/icons-material/Chat';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ScienceIcon from '@mui/icons-material/Science';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

interface NavigationItem {
  text: string;
  icon: React.ReactNode;
  path: string;
}

export const NavigationDrawer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [featuresOpen, setFeaturesOpen] = useState(false);
  
  const mainNavItems: NavigationItem[] = [
    { 
      text: 'Dashboard', 
      icon: <Box component="img" src="/icons/home.png" alt="Home" sx={{ width: '24px', height: '24px' }} />, 
      path: '/' 
    },
    { 
      text: 'Meal Planner', 
      icon: <Box component="img" src="/icons/nutrition.png" alt="Nutrition" sx={{ width: '24px', height: '24px' }} />, 
      path: 'meal-planner' 
    },
    { 
      text: 'Workout Programs', 
      icon: <Box component="img" src="/icons/workout.png" alt="Workout" sx={{ width: '24px', height: '24px' }} />, 
      path: 'workout-programs' 
    },
    { 
      text: 'Progress', 
      icon: <TimelineIcon />, 
      path: 'progress' 
    },
    { 
      text: 'Diary', 
      icon: <BookIcon />, 
      path: 'diary' 
    },
  ];

  const secondaryNavItems: NavigationItem[] = [
    { text: 'Transformation', icon: <AutoGraphIcon />, path: 'transformation' },
    { text: 'Shop', icon: <ShoppingCartIcon />, path: 'shop' },
    { text: 'Motivation', icon: <EmojiEventsIcon />, path: 'motivation' },
    { 
      text: 'Settings', 
      icon: <Box component="img" src="/icons/profile.png" alt="Profile" sx={{ width: '24px', height: '24px' }} />, 
      path: 'settings' 
    },
  ];

  const featuresItems: NavigationItem[] = [
    { text: 'Food Service Test', icon: <RestaurantIcon />, path: 'food-service-test' },
    { text: 'Food Search Test V2', icon: <RestaurantIcon />, path: 'food-search-test' },
    { text: 'NLP Test', icon: <ChatIcon />, path: 'nlp-test' },
    { text: 'Image Recognition Test', icon: <ImageSearchIcon />, path: 'test-image-recognition' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleFeaturesToggle = () => {
    setFeaturesOpen(!featuresOpen);
  };

  return (
    <div>
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        gap: 1
      }}>
        <Avatar 
          sx={{ 
            width: 64, 
            height: 64,
            mb: 1 
          }}
          alt="User Profile"
          src="/user-avatar.jpg"
        />
        <Typography variant="subtitle1" fontWeight="bold">
          John Doe
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Premium Member
        </Typography>
      </Box>
      
      <Divider />
      
      <List>
        {mainNavItems.map((item) => {
          // Determine if this route is active
          const isActive = 
            item.path === '/' 
              ? location.pathname === '/' 
              : location.pathname.includes(item.path);
              
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton 
                onClick={() => handleNavigation(item.path)}
                selected={isActive}
                sx={{ 
                  minHeight: '48px', // Touch-friendly size
                  py: 1
                }}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      
      <Divider />
      
      <List>
        {secondaryNavItems.map((item) => {
          const isActive = location.pathname.includes(item.path);
          
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton 
                onClick={() => handleNavigation(item.path)}
                selected={isActive}
                sx={{ 
                  minHeight: '48px', // Touch-friendly size
                  py: 1
                }}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      
      <ListItem key="features" disablePadding>
        <ListItemButton 
          onClick={handleFeaturesToggle}
          sx={{ 
            minHeight: '48px', // Touch-friendly size
            py: 1
          }}
        >
          <ListItemIcon>
            <ScienceIcon />
          </ListItemIcon>
          <ListItemText primary="Features" />
          {featuresOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      
      <Collapse in={featuresOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {featuresItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            
            return (
              <ListItem key={item.text} disablePadding sx={{ pl: 4 }}>
                <ListItemButton 
                  onClick={() => handleNavigation(item.path)}
                  selected={isActive}
                  sx={{ 
                    minHeight: '48px', // Touch-friendly size
                    py: 1
                  }}
                >
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Collapse>
    </div>
  );
};

export default NavigationDrawer;
