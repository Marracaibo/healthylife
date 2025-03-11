import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Chip,
  Divider,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface VoceListaSpesa {
  id: number;
  alimento_id: number;
  nome_alimento: string;
  quantita: number;
  unita: string;
  acquistato: boolean;
  note: string;
  categoria: string;
}

interface Props {
  pianoId?: number;
  startDate?: Date;
  endDate?: Date;
  onListUpdate?: () => void;
}

const ShoppingList: React.FC<Props> = ({
  pianoId,
  startDate,
  endDate,
  onListUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const [generatingList, setGeneratingList] = useState(false);
  const [items, setItems] = useState<VoceListaSpesa[]>([]);
  const [editingItem, setEditingItem] = useState<VoceListaSpesa | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listaId, setListaId] = useState<number | null>(null);

  useEffect(() => {
    if (listaId) {
      fetchShoppingList();
    }
  }, [listaId]);

  const fetchShoppingList = async () => {
    if (!listaId) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/shopping-list/${listaId}`);
      if (response.ok) {
        const data = await response.json();
        setItems(data.voci);
      } else {
        throw new Error('Errore nel caricamento della lista della spesa');
      }
    } catch (error) {
      console.error('Errore:', error);
      setError('Errore nel caricamento della lista della spesa');
    } finally {
      setLoading(false);
    }
  };

  const generateShoppingList = async () => {
    if (!pianoId || !startDate || !endDate) {
      setError('Seleziona un piano e un intervallo di date');
      return;
    }

    setGeneratingList(true);
    setError(null);
    try {
      const response = await fetch('/api/shopping-list/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          piano_id: pianoId,
          start_date: format(startDate, 'yyyy-MM-dd'),
          end_date: format(endDate, 'yyyy-MM-dd'),
        }),
      });

      if (!response.ok) {
        throw new Error('Errore nella generazione della lista della spesa');
      }

      const data = await response.json();
      setListaId(data.id);
      if (onListUpdate) {
        onListUpdate();
      }
    } catch (error) {
      console.error('Errore:', error);
      setError('Errore nella generazione della lista della spesa');
    } finally {
      setGeneratingList(false);
    }
  };

  const handleItemComplete = async (item: VoceListaSpesa) => {
    try {
      const response = await fetch(`/api/shopping-list/item/${item.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          acquistato: !item.acquistato,
        }),
      });

      if (response.ok) {
        const updatedItems = items.map((i) =>
          i.id === item.id ? { ...i, acquistato: !i.acquistato } : i
        );
        setItems(updatedItems);
        if (onListUpdate) {
          onListUpdate();
        }
      }
    } catch (error) {
      console.error('Errore nell\'aggiornamento dell\'articolo:', error);
    }
  };

  const handleItemEdit = (item: VoceListaSpesa) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };

  const handleItemDelete = async (item: VoceListaSpesa) => {
    if (!confirm('Sei sicuro di voler eliminare questo articolo?')) {
      return;
    }

    try {
      const response = await fetch(`/api/shopping-list/item/${item.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedItems = items.filter((i) => i.id !== item.id);
        setItems(updatedItems);
        if (onListUpdate) {
          onListUpdate();
        }
      }
    } catch (error) {
      console.error('Errore nell\'eliminazione dell\'articolo:', error);
    }
  };

  const handleEditSubmit = async () => {
    if (!editingItem) return;

    try {
      const response = await fetch(
        `/api/shopping-list/item/${editingItem.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingItem),
        }
      );

      if (response.ok) {
        const updatedItems = items.map((i) =>
          i.id === editingItem.id ? editingItem : i
        );
        setItems(updatedItems);
        setIsEditDialogOpen(false);
        setEditingItem(null);
        if (onListUpdate) {
          onListUpdate();
        }
      }
    } catch (error) {
      console.error('Errore nell\'aggiornamento dell\'articolo:', error);
    }
  };

  // Raggruppa gli articoli per categoria
  const groupedItems = items.reduce((acc, item) => {
    const category = item.categoria || 'Altro';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, VoceListaSpesa[]>);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h6">Lista della Spesa</Typography>
        <Button
          variant="contained"
          startIcon={<ShoppingCartIcon />}
          onClick={generateShoppingList}
          disabled={generatingList || !pianoId}
        >
          {generatingList ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Generazione...
            </>
          ) : (
            'Genera Lista'
          )}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <CircularProgress />
      ) : (
        <Paper sx={{ p: 2 }}>
          {Object.entries(groupedItems).map(([category, categoryItems]) => (
            <Box key={category} sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 1, color: 'primary.main' }}
              >
                {category}
              </Typography>
              <List dense>
                {categoryItems.map((item) => (
                  <ListItem
                    key={item.id}
                    sx={{
                      bgcolor: item.acquistato
                        ? 'action.hover'
                        : 'background.paper',
                    }}
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={item.acquistato}
                        onChange={() => handleItemComplete(item)}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            textDecoration: item.acquistato
                              ? 'line-through'
                              : 'none',
                          }}
                        >
                          {item.nome_alimento}
                        </Typography>
                      }
                      secondary={`${item.quantita} ${item.unita}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => handleItemEdit(item)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        onClick={() => handleItemDelete(item)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
              <Divider />
            </Box>
          ))}

          {items.length === 0 && (
            <Typography variant="body1" sx={{ textAlign: 'center', py: 3 }}>
              Nessun articolo nella lista della spesa
            </Typography>
          )}
        </Paper>
      )}

      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Modifica Articolo</DialogTitle>
        <DialogContent>
          {editingItem && (
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="Quantità"
                type="number"
                value={editingItem.quantita}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    quantita: Number(e.target.value),
                  })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Note"
                multiline
                rows={2}
                value={editingItem.note}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    note: e.target.value,
                  })
                }
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>Annulla</Button>
          <Button onClick={handleEditSubmit} variant="contained">
            Salva
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShoppingList;
