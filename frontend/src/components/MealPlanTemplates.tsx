import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Button,
  Paper,
  Box,
  Divider,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface MealPlan {
  id?: number;
  name: string;
  description?: string;
  goal: string;
  calories_target: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  dietary_restrictions: string[];
  days: any[];
}

interface Props {
  onTemplateSelect: (template: MealPlan) => void;
}

const API_BASE_URL = 'http://localhost:8000/api';

const MealPlanTemplates: React.FC<Props> = ({ onTemplateSelect }) => {
  const [templates, setTemplates] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/meal-plan-templates`);
        if (!response.ok) {
          throw new Error('Failed to fetch templates');
        }
        const data = await response.json();
        setTemplates(data);
      } catch (error) {
        console.error('Error fetching templates:', error);
        setError('Errore nel caricamento dei template');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Template Piani Alimentari
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Seleziona un template per iniziare. Potrai personalizzarlo successivamente.
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <Grid container spacing={3}>
        {templates.map((template, index) => (
          <Grid item xs={12} sm={6} md={4} key={template.id || index}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                height: '100%',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: 1,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom>
                  {template.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {template.description}
                </Typography>
                
                <Divider sx={{ my: 1 }} />
                
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2">
                    Obiettivo: {template.goal}
                  </Typography>
                  <Typography variant="body2">
                    Calorie: {template.calories_target} kcal
                  </Typography>
                  <Typography variant="body2">
                    Macros: P{template.macros.protein}% C{template.macros.carbs}% F{template.macros.fat}%
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Pasti pianificati: {template.days.reduce((acc, day) => acc + day.meals.length, 0)}
                  </Typography>
                </Box>
                
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => onTemplateSelect(template)}
                    size="small"
                  >
                    Usa Template
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MealPlanTemplates;
