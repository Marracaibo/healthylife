import { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemText,
  Chip,
  CircularProgress,
  Paper
} from '@mui/material';
import { Restaurant as RestaurantIcon } from '@mui/icons-material';

interface Recipe {
  nome: string;
  ingredienti: {
    nome: string;
    quantita: string;
    unita: string;
  }[];
  istruzioni: string[];
}

export default function RecipeGenerator() {
  const [ingredients, setIngredients] = useState<string>('');
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateRecipe = async () => {
    if (!ingredients.trim()) {
      setError('Inserisci almeno un ingrediente');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ingredientsList = ingredients
        .split(',')
        .map(i => i.trim())
        .filter(i => i.length > 0);

      const response = await fetch(
        `http://localhost:8000/api/recipe?ingredients=${encodeURIComponent(ingredientsList.join(','))}`,
        {
          method: 'POST',
        }
      );

      if (!response.ok) {
        throw new Error('Errore nella generazione della ricetta');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setRecipe(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <RestaurantIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6">Genera una Ricetta</Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Ingredienti (separati da virgola)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="es: pasta, pomodoro, basilico"
          error={!!error}
          helperText={error}
          disabled={loading}
        />
        <Button
          variant="contained"
          onClick={handleGenerateRecipe}
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Genera Ricetta'}
        </Button>
      </Box>

      {recipe && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
            {recipe.nome}
          </Typography>

          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
            Ingredienti:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {recipe.ingredienti.map((ing, idx) => (
              <Chip
                key={idx}
                label={`${ing.nome} (${ing.quantita}${ing.unita})`}
                variant="outlined"
              />
            ))}
          </Box>

          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
            Istruzioni:
          </Typography>
          <List>
            {recipe.istruzioni.map((step, idx) => (
              <ListItem key={idx}>
                <ListItemText primary={step} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Paper>
  );
}
