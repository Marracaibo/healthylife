import React from 'react';
import { Typography, Box, Paper, Grid, Card, CardContent, CardMedia, Divider, List, ListItem, ListItemText, CircularProgress } from '@mui/material';

const FoodTracker: React.FC = () => {
  return (
    <Box sx={{ maxWidth: '100%', mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Food Tracker
      </Typography>
      
      <Typography variant="subtitle1" gutterBottom sx={{ mb: 3 }}>
        Track your daily nutrition and calories
      </Typography>
      
      <Paper elevation={2} sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Today's Summary
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6} sm={3}>
            <Card variant="outlined" sx={{ textAlign: 'center' }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Calories
                </Typography>
                <Typography variant="h5" component="div">
                  1,450
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  of 2,200 kcal
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <Card variant="outlined" sx={{ textAlign: 'center' }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Protein
                </Typography>
                <Typography variant="h5" component="div">
                  78g
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  of 140g
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <Card variant="outlined" sx={{ textAlign: 'center' }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Carbs
                </Typography>
                <Typography variant="h5" component="div">
                  140g
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  of 220g
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <Card variant="outlined" sx={{ textAlign: 'center' }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Fat
                </Typography>
                <Typography variant="h5" component="div">
                  45g
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  of 70g
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CircularProgress variant="determinate" value={65} size={120} thickness={5} />
        </Box>
      </Paper>
      
      <Paper elevation={2} sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Today's Meals
        </Typography>
        
        <List sx={{ width: '100%' }}>
          <ListItem alignItems="flex-start">
            <CardMedia
              component="img"
              sx={{ width: 60, height: 60, mr: 2, borderRadius: 1 }}
              image="/breakfast.jpg"
              alt="Breakfast"
            />
            <ListItemText
              primary="Breakfast"
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    Oatmeal with banana and honey
                  </Typography>
                  {" — 320 kcal"}
                </React.Fragment>
              }
            />
          </ListItem>
          
          <Divider variant="inset" component="li" />
          
          <ListItem alignItems="flex-start">
            <CardMedia
              component="img"
              sx={{ width: 60, height: 60, mr: 2, borderRadius: 1 }}
              image="/lunch.jpg"
              alt="Lunch"
            />
            <ListItemText
              primary="Lunch"
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    Chicken salad with avocado
                  </Typography>
                  {" — 450 kcal"}
                </React.Fragment>
              }
            />
          </ListItem>
          
          <Divider variant="inset" component="li" />
          
          <ListItem alignItems="flex-start">
            <CardMedia
              component="img"
              sx={{ width: 60, height: 60, mr: 2, borderRadius: 1 }}
              image="/dinner.jpg"
              alt="Dinner"
            />
            <ListItemText
              primary="Dinner"
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    Grilled salmon with vegetables
                  </Typography>
                  {" — 380 kcal"}
                </React.Fragment>
              }
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default FoodTracker;
