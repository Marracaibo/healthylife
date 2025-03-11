import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Checkbox,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Chip,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Collapse,
  Divider,
  Stack,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import HybridFoodSearchDialog from './HybridFoodSearchDialog';
import BarcodeScanner from './BarcodeScanner';
import { Food as HybridFood } from '../services/hybridFoodService';

interface Nutrienti {
  calorie: number;
  proteine: number;
  carboidrati: number;
  grassi: number;
}

interface VoceDiario {
  id: number;
  pasto_id: number;
  alimento_id: number;
  nome_alimento: string;
  quantita: number;
  unita: string;
  completato: boolean;
  note: string;
  orario: string;
  nutrienti: Nutrienti;
}

interface Props {
  date: Date;
  pianoId?: number;
  onDiaryUpdate?: () => void;
}

const DailyFoodTracker: React.FC<Props> = ({ date, pianoId, onDiaryUpdate }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(false);
  const [voci, setVoci] = useState<VoceDiario[]>([]);
  const [totali, setTotali] = useState<Nutrienti>({
    calorie: 0,
    proteine: 0,
    carboidrati: 0,
    grassi: 0,
  });
  const [obiettivi, setObiettivi] = useState<Nutrienti>({
    calorie: 0,
    proteine: 0,
    carboidrati: 0,
    grassi: 0,
  });
  const [editingVoce, setEditingVoce] = useState<VoceDiario | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isFoodSearchOpen, setIsFoodSearchOpen] = useState(false);
  const [selectedPasto, setSelectedPasto] = useState<string>('');
  const [expandedPasti, setExpandedPasti] = useState<{[key: string]: boolean}>({
    '1': true, // Colazione espansa di default
    '2': true, // Pranzo espanso di default
    '3': false,
    '4': false,
    '5': false,
  });

  useEffect(() => {
    if (date) {
      fetchDiaryEntries();
      if (pianoId) {
        fetchPlanTargets();
      }
    }
  }, [date, pianoId]);

  const fetchDiaryEntries = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/food-diary/date/${format(date, 'yyyy-MM-dd')}`
      );
      if (response.ok) {
        const data = await response.json();
        setVoci(data.voci);
        calculateTotals(data.voci);
      }
    } catch (error) {
      console.error('Errore nel caricamento del diario:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlanTargets = async () => {
    try {
      const response = await fetch(`/api/meal-plans/${pianoId}`);
      if (response.ok) {
        const data = await response.json();
        setObiettivi({
          calorie: data.calorie_giornaliere,
          proteine: data.proteine,
          carboidrati: data.carboidrati,
          grassi: data.grassi,
        });
      }
    } catch (error) {
      console.error('Errore nel caricamento degli obiettivi:', error);
    }
  };

  const calculateTotals = (entries: VoceDiario[]) => {
    const newTotals = entries.reduce(
      (acc, voce) => ({
        calorie: acc.calorie + (voce.completato ? voce.nutrienti.calorie : 0),
        proteine: acc.proteine + (voce.completato ? voce.nutrienti.proteine : 0),
        carboidrati:
          acc.carboidrati + (voce.completato ? voce.nutrienti.carboidrati : 0),
        grassi: acc.grassi + (voce.completato ? voce.nutrienti.grassi : 0),
      }),
      { calorie: 0, proteine: 0, carboidrati: 0, grassi: 0 }
    );
    setTotali(newTotals);
  };

  const handleVoceComplete = async (voce: VoceDiario) => {
    try {
      const response = await fetch(`/api/food-diary/entry/${voce.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...voce,
          completato: !voce.completato,
        }),
      });

      if (response.ok) {
        const updatedVoci = voci.map((v) =>
          v.id === voce.id ? { ...v, completato: !v.completato } : v
        );
        setVoci(updatedVoci);
        calculateTotals(updatedVoci);
        if (onDiaryUpdate) {
          onDiaryUpdate();
        }
      }
    } catch (error) {
      console.error('Errore nell\'aggiornamento della voce:', error);
    }
  };

  const handleVoceEdit = (voce: VoceDiario) => {
    setEditingVoce(voce);
    setIsEditDialogOpen(true);
  };

  const handleVoceDelete = async (voce: VoceDiario) => {
    if (!confirm('Sei sicuro di voler eliminare questa voce?')) {
      return;
    }

    try {
      const response = await fetch(`/api/food-diary/entry/${voce.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedVoci = voci.filter((v) => v.id !== voce.id);
        setVoci(updatedVoci);
        calculateTotals(updatedVoci);
        if (onDiaryUpdate) {
          onDiaryUpdate();
        }
      }
    } catch (error) {
      console.error('Errore nell\'eliminazione della voce:', error);
    }
  };

  const handleEditSubmit = async () => {
    if (!editingVoce) return;

    try {
      const response = await fetch(`/api/food-diary/entry/${editingVoce.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingVoce),
      });

      if (response.ok) {
        const updatedVoci = voci.map((v) =>
          v.id === editingVoce.id ? editingVoce : v
        );
        setVoci(updatedVoci);
        calculateTotals(updatedVoci);
        setIsEditDialogOpen(false);
        setEditingVoce(null);
        if (onDiaryUpdate) {
          onDiaryUpdate();
        }
      }
    } catch (error) {
      console.error('Errore nell\'aggiornamento della voce:', error);
    }
  };

  const handleAddFood = () => {
    setIsFoodSearchOpen(true);
  };

  const handleFoodSelect = async (food: HybridFood) => {
    if (!selectedPasto) return;
    
    // Conversione del formato cibo da HybridFood al formato atteso dal backend
    try {
      const response = await fetch('/api/food-diary/entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: format(date, 'yyyy-MM-dd'),
          pasto_id: parseInt(selectedPasto),
          alimento_id: food.food_id,
          nome_alimento: food.food_name,
          quantita: 100,
          unita: 'g',
          nutrienti: {
            calorie: food.nutrients.calories || 0,
            proteine: food.nutrients.protein || 0, 
            carboidrati: food.nutrients.carbs || 0,
            grassi: food.nutrients.fat || 0,
          },
          note: food.brand_name ? `Marca: ${food.brand_name}` : '',
          orario: format(new Date(), 'HH:mm')
        }),
      });

      if (response.ok) {
        await fetchDiaryEntries();
        if (onDiaryUpdate) {
          onDiaryUpdate();
        }
      } 
    } catch (error) {
      console.error('Errore nell\'aggiunta dell\'alimento:', error);
    }
  };

  const renderProgress = (
    current: number,
    target: number,
    label: string,
    color:
      | 'primary'
      | 'secondary'
      | 'error'
      | 'info'
      | 'success'
      | 'warning'
      | undefined
  ) => {
    const percentage = Math.min((current / target) * 100, 100);
    return (
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">{label}</Typography>
          <Typography variant="body2">
            {current.toFixed(1)} / {target.toFixed(1)}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={percentage}
          color={color}
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>
    );
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant={isMobile ? "h5" : "h4"} sx={{ mb: isMobile ? 1.5 : 2, fontWeight: 'medium' }}>
        Registro Alimentare 
        <Typography 
          component="span" 
          variant={isMobile ? "h6" : "h5"} 
          color="text.secondary"
          sx={{ ml: 1, fontWeight: 'normal' }}
        >
          {format(date, 'PPP', { locale: it })}
        </Typography>
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Sommario Nutrizionale
            </Typography>
            <Paper elevation={isMobile ? 1 : 2}>
              <Box sx={{ p: isMobile ? 1.5 : 2 }}>
                <Grid container spacing={isMobile ? 1 : 2}>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Calorie
                    </Typography>
                    <Typography variant={isMobile ? "h6" : "h5"}>
                      {totali.calorie.toFixed(0)}{' '}
                      {obiettivi.calorie > 0 && `/ ${obiettivi.calorie}`} kcal
                    </Typography>
                    {obiettivi.calorie > 0 && (
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(
                          (totali.calorie / obiettivi.calorie) * 100,
                          100
                        )}
                        sx={{ mt: 1, height: isMobile ? 6 : 8, borderRadius: 3 }}
                      />
                    )}
                  </Grid>
                  <Grid item xs={4} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Proteine
                    </Typography>
                    <Typography variant={isMobile ? "body1" : "h6"}>
                      {totali.proteine.toFixed(0)}g
                      {obiettivi.proteine > 0 &&
                        ` (${((totali.proteine / obiettivi.proteine) * 100).toFixed(
                          0
                        )}%)`}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Carboidrati
                    </Typography>
                    <Typography variant={isMobile ? "body1" : "h6"}>
                      {totali.carboidrati.toFixed(0)}g
                      {obiettivi.carboidrati > 0 &&
                        ` (${(
                          (totali.carboidrati / obiettivi.carboidrati) *
                          100
                        ).toFixed(0)}%)`}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Grassi
                    </Typography>
                    <Typography variant={isMobile ? "body1" : "h6"}>
                      {totali.grassi.toFixed(0)}g
                      {obiettivi.grassi > 0 &&
                        ` (${((totali.grassi / obiettivi.grassi) * 100).toFixed(
                          0
                        )}%)`}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Box>

          {['1', '2', '3', '4', '5'].map((pastoId) => {
            const pastoNome = getPastoNome(pastoId);
            const pastoVoci = voci.filter((v) => v.pasto_id === parseInt(pastoId));

            return (
              <Box key={pastoId} sx={{ mb: 3 }}>
                <Card>
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1,
                      }}
                    >
                      <Typography variant="h6">{pastoNome}</Typography>
                      <IconButton
                        onClick={() =>
                          setExpandedPasti((prev) => ({
                            ...prev,
                            [pastoId]: !prev[pastoId],
                          }))
                        }
                      >
                        {expandedPasti[pastoId] ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                      </IconButton>
                    </Box>
                    <Collapse in={expandedPasti[pastoId]}>
                      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <Button
                          size="small"
                          startIcon={<AddIcon />}
                          onClick={() => {
                            setSelectedPasto(pastoId);
                            handleAddFood();
                          }}
                        >
                          Aggiungi
                        </Button>
                        <BarcodeScanner onFoodSelect={(food) => {
                          setSelectedPasto(pastoId);
                          handleFoodSelect(food);
                        }} />
                      </Box>
                      <Paper elevation={2}>
                        <Box sx={{ p: 2 }}>
                          {pastoVoci.map((voce) => (
                            <Box
                              key={voce.id}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                py: 1,
                                borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                              }}
                            >
                              <Checkbox
                                checked={voce.completato}
                                onChange={() => handleVoceComplete(voce)}
                              />
                              <Box sx={{ flex: 1, ml: 1 }}>
                                <Typography
                                  variant="body1"
                                  sx={{
                                    textDecoration: voce.completato
                                      ? 'line-through'
                                      : 'none',
                                  }}
                                >
                                  {voce.nome_alimento}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {voce.quantita} {voce.unita} - {voce.nutrienti.calorie} kcal
                                </Typography>
                              </Box>
                              <Box>
                                <IconButton
                                  size="small"
                                  onClick={() => handleVoceEdit(voce)}
                                  sx={{ mr: 1 }}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleVoceDelete(voce)}
                                  color="error"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      </Paper>
                    </Collapse>
                  </CardContent>
                </Card>
              </Box>
            );
          })}
        </>
      )}

      {/* Food Search Dialog */}
      <HybridFoodSearchDialog
        open={isFoodSearchOpen}
        onClose={() => setIsFoodSearchOpen(false)}
        onFoodSelect={handleFoodSelect}
        title={`Aggiungi alimento a ${getPastoNome(selectedPasto)}`}
      />

      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setIsEditDialogOpen(false)}
              aria-label="close"
              sx={{ mr: 2 }}
            >
              <DeleteIcon />
            </IconButton>
          )}
          Modifica Alimento
        </DialogTitle>
        <DialogContent>
          {editingVoce && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Quantità"
                  type="number"
                  value={editingVoce.quantita}
                  onChange={(e) =>
                    setEditingVoce({
                      ...editingVoce,
                      quantita: Number(e.target.value),
                    })
                  }
                  size={isMobile ? "small" : "medium"}
                  InputProps={{
                    inputProps: { 
                      style: { fontSize: isMobile ? '14px' : '16px' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Note"
                  multiline
                  rows={isMobile ? 3 : 2}
                  value={editingVoce.note}
                  onChange={(e) =>
                    setEditingVoce({
                      ...editingVoce,
                      note: e.target.value,
                    })
                  }
                  size={isMobile ? "small" : "medium"}
                  InputProps={{
                    inputProps: { 
                      style: { fontSize: isMobile ? '14px' : '16px' }
                    }
                  }}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: isMobile ? 2 : 1 }}>
          <Button 
            onClick={() => setIsEditDialogOpen(false)}
            sx={{ minHeight: isMobile ? '48px' : '36px' }}
          >
            Annulla
          </Button>
          <Button 
            onClick={handleEditSubmit} 
            variant="contained"
            sx={{ minHeight: isMobile ? '48px' : '36px' }}
          >
            Salva
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DailyFoodTracker;
