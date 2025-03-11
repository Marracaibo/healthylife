import { ReactNode, useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Box,
  CssBaseline,
  Drawer,
  SwipeableDrawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Tooltip,
  Badge,
  Menu,
  MenuItem,
  Container,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Fab,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  RestaurantMenu as RestaurantMenuIcon,
  Timeline as TimelineIcon,
  Book as BookIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  ChevronLeft as ChevronLeftIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  FitnessCenter as FitnessCenterIcon,
  AutoGraph as AutoGraphIcon,
  ShoppingCart as ShoppingCartIcon,
  EmojiEvents as EmojiEventsIcon,
  Restaurant as RestaurantIcon,
  Add as AddIcon,
} from '@mui/icons-material';

const drawerWidth = 260;
const mobileDrawerWidth = '80%'; // Drawer più stretto su mobile

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
  isMobile?: boolean;
}>(({ theme, open, isMobile }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  paddingBottom: isMobile ? theme.spacing(9) : theme.spacing(3), // Spazio per BottomNavigation
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  ...(open && !isMobile && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,
  }),
}));

interface AppBarProps {
  open?: boolean;
  isMobile?: boolean;
}

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open' && prop !== 'isMobile',
})<AppBarProps>(({ theme, open, isMobile }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(!isMobile && open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
}));

export default function Layout() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Rileva dispositivi mobili
  const [open, setOpen] = useState(!isMobile); // Drawer chiuso di default su mobile
  const [mobileOpen, setMobileOpen] = useState(false); // Stato separato per drawer mobile
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileNavValue, setMobileNavValue] = useState(0);

  // Aggiorna lo stato drawer in base al cambio di dispositivo
  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);
  
  const handleDrawerOpen = () => {
    if (isMobile) {
      setMobileOpen(true);
    } else {
      setOpen(true);
    }
  };

  const handleDrawerClose = () => {
    if (isMobile) {
      setMobileOpen(false);
    } else {
      setOpen(false);
    }
  };
  
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Mappatura tra navigation value e percorsi
  const handleBottomNavChange = (event: React.SyntheticEvent, newValue: number) => {
    setMobileNavValue(newValue);
    switch(newValue) {
      case 0:
        navigate('/');
        break;
      case 1:
        navigate('/meal-planner');
        break;
      case 2:
        navigate('/workout-programs');
        break;
      case 3:
        navigate('/diary');
        break;
    }
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Piano Pasti', icon: <RestaurantMenuIcon />, path: '/meal-planner' },
    { text: 'Programmi Workout', icon: <FitnessCenterIcon />, path: '/workout-programs' },
    { text: 'Trasformazione 360°', icon: <AutoGraphIcon />, path: '/transformation' },
    { text: 'Fitness Shop', icon: <ShoppingCartIcon />, path: '/shop' },
    { text: 'Motivazione', icon: <EmojiEventsIcon />, path: '/motivation' },
    { text: 'Progressi', icon: <TimelineIcon />, path: '/progress' },
    { text: 'Diario', icon: <BookIcon />, path: '/diary' },
  ];

  const testMenuItems = [
    { text: 'Test Servizio Ibrido', icon: <RestaurantIcon />, path: '/food-service-test' },
  ];

  // Ottieni il valore corrente per la barra di navigazione inferiore in base al percorso
  useEffect(() => {
    if (location.pathname === '/') setMobileNavValue(0);
    else if (location.pathname === '/meal-planner') setMobileNavValue(1);
    else if (location.pathname === '/workout-programs') setMobileNavValue(2);
    else if (location.pathname === '/diary') setMobileNavValue(3);
  }, [location.pathname]);

  // Rendering del drawer in base al tipo di dispositivo
  const renderDrawer = () => {
    const drawerContent = (
      <>
        <DrawerHeader>
          <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
            <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 1 }}>H</Avatar>
            <Typography variant="h6" color="textPrimary">HealthyLife</Typography>
          </Box>
          {isMobile && (
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          )}
        </DrawerHeader>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton 
                selected={location.pathname === item.path}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) handleDrawerClose();
                }}
                sx={{
                  borderRadius: '0 24px 24px 0',
                  marginRight: '16px',
                  marginLeft: 0,
                  minHeight: isMobile ? '54px' : '48px', // Aumenta l'area di tocco per mobile
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    color: 'primary.main',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle2" color="text.secondary" sx={{ px: 3, mb: 1 }}>
          Strumenti di Test
        </Typography>
        
        <List>
          {testMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton 
                selected={location.pathname === item.path}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) handleDrawerClose();
                }}
                sx={{
                  borderRadius: '0 24px 24px 0',
                  marginRight: '16px',
                  marginLeft: 0,
                  minHeight: isMobile ? '54px' : '48px', // Aumenta l'area di tocco per mobile
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    color: 'primary.main',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </>
    );

    if (isMobile) {
      return (
        <SwipeableDrawer
          sx={{
            width: mobileDrawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: mobileDrawerWidth,
              boxSizing: 'border-box',
            },
          }}
          anchor="left"
          open={mobileOpen}
          onOpen={() => setMobileOpen(true)}
          onClose={() => setMobileOpen(false)}
          disableBackdropTransition
          disableDiscovery={false}
        >
          {drawerContent}
        </SwipeableDrawer>
      );
    }

    return (
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        {drawerContent}
      </Drawer>
    );
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBarStyled position="fixed" open={open} isMobile={isMobile} elevation={0}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label={open ? "close drawer" : "open drawer"}
            onClick={isMobile ? handleDrawerOpen : (open ? handleDrawerClose : handleDrawerOpen)}
            edge="start"
            sx={{ mr: 2, padding: isMobile ? '12px' : '8px' }} // Area di tocco più grande per mobile
          >
            {!isMobile && open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            HealthyLife
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Mostra meno elementi nella toolbar su mobile */}
            {!isMobile && (
              <Tooltip title="Notifiche">
                <IconButton color="inherit" sx={{ padding: '12px' }}>
                  <Badge badgeContent={3} color="secondary">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            )}
            
            <Tooltip title="Profilo">
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
                sx={{ ml: 1, padding: isMobile ? '12px' : '8px' }} // Area di tocco più grande per mobile
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.secondary.main }}>
                  <PersonIcon />
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose} sx={{ minHeight: isMobile ? '54px' : '48px' }}>Profilo</MenuItem>
              <MenuItem onClick={handleClose} sx={{ minHeight: isMobile ? '54px' : '48px' }}>Impostazioni</MenuItem>
              <Divider />
              <MenuItem onClick={handleClose} sx={{ minHeight: isMobile ? '54px' : '48px' }}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBarStyled>

      {renderDrawer()}
      
      <Main open={open} isMobile={isMobile}>
        <DrawerHeader />
        <Container maxWidth="xl">
          <Outlet />
        </Container>
        
        <Box
          component={Paper}
          sx={{
            mt: 8,
            py: 3,
            px: 2,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
          elevation={0}
        >
          <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright ' + new Date().getFullYear()}
          </Typography>
          <Box sx={{ mt: { xs: 2, sm: 0 } }}>
            <Typography variant="body2" color="text.secondary" align="center">
              Mantieni uno stile di vita sano
            </Typography>
          </Box>
        </Box>
      </Main>

      {/* Bottom Navigation solo per mobile */}
      {isMobile && (
        <>
          <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100 }} elevation={3}>
            <BottomNavigation
              value={mobileNavValue}
              onChange={handleBottomNavChange}
              showLabels
            >
              <BottomNavigationAction 
                label="Home" 
                icon={<DashboardIcon />} 
                sx={{ minHeight: '60px', py: 1 }} // Area di tocco più grande
              />
              <BottomNavigationAction 
                label="Pasti" 
                icon={<RestaurantMenuIcon />} 
                sx={{ minHeight: '60px', py: 1 }}
              />
              <BottomNavigationAction 
                label="Workout" 
                icon={<FitnessCenterIcon />} 
                sx={{ minHeight: '60px', py: 1 }}
              />
              <BottomNavigationAction 
                label="Diario" 
                icon={<BookIcon />} 
                sx={{ minHeight: '60px', py: 1 }}
              />
            </BottomNavigation>
          </Paper>
          
          {/* Pulsante azione rapida */}
          <Fab 
            color="secondary" 
            aria-label="add"
            sx={{ 
              position: 'fixed', 
              bottom: 76, // Sopra la bottom navigation
              right: 16,
              zIndex: 1000 
            }}
            onClick={() => {
              // Azione contestuale basata sulla pagina corrente
              switch(mobileNavValue) {
                case 0: // Dashboard
                  navigate('/progress/add');
                  break;
                case 1: // Meal planner
                  navigate('/meal-planner/add');
                  break;
                case 2: // Workout
                  navigate('/workout-programs/new');
                  break;
                case 3: // Diary
                  navigate('/diary/add');
                  break;
              }
            }}
          >
            <AddIcon />
          </Fab>
        </>
      )}
    </Box>
  );
}
