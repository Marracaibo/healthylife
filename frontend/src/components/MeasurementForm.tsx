import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  Tooltip
} from '@mui/material';
import { 
  Close as CloseIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { BodyMeasurement } from '../types/measurements';

interface MeasurementFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (measurement: Partial<BodyMeasurement>) => void;
  initialData?: Partial<BodyMeasurement>;
}

const MeasurementForm: React.FC<MeasurementFormProps> = ({ 
  open, 
  onClose, 
  onSave,
  initialData = {}
}) => {
  const [formData, setFormData] = useState<Partial<BodyMeasurement>>({
    date: new Date().toISOString().split('T')[0],
    weight: 0,
    bodyFatPercentage: undefined,
    bmi: undefined,
    note: '',
    measurements: {
      waist: undefined,
      hips: undefined,
      chest: undefined,
      thighs: undefined,
      arms: undefined
    },
    ...initialData
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMeasurementChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      measurements: {
        ...prev.measurements,
        [field]: value === '' ? undefined : Number(value)
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          {initialData.id ? 'Modifica Misurazione' : 'Nuova Misurazione'}
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Data"
                type="date"
                fullWidth
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Peso (kg)"
                type="number"
                fullWidth
                value={formData.weight === undefined ? '' : formData.weight}
                onChange={(e) => handleChange('weight', e.target.value === '' ? undefined : Number(e.target.value))}
                InputProps={{ inputProps: { min: 0, step: 0.1 } }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  label="Percentuale Massa Grassa"
                  type="number"
                  fullWidth
                  value={formData.bodyFatPercentage === undefined ? '' : formData.bodyFatPercentage}
                  onChange={(e) => handleChange('bodyFatPercentage', e.target.value === '' ? undefined : Number(e.target.value))}
                  InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
                />
                <Tooltip title="Misurabile con plicometro o bilancia smart">
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  label="BMI"
                  type="number"
                  fullWidth
                  value={formData.bmi === undefined ? '' : formData.bmi}
                  onChange={(e) => handleChange('bmi', e.target.value === '' ? undefined : Number(e.target.value))}
                  InputProps={{ inputProps: { min: 0, step: 0.1 } }}
                />
                <Tooltip title="Indice di Massa Corporea (peso in kg / altezza in m²)">
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                  Misurazioni Corporee (cm)
                </Typography>
              </Divider>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Vita"
                type="number"
                fullWidth
                value={formData.measurements?.waist === undefined ? '' : formData.measurements.waist}
                onChange={(e) => handleMeasurementChange('waist', e.target.value)}
                InputProps={{ inputProps: { min: 0, step: 0.1 } }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Fianchi"
                type="number"
                fullWidth
                value={formData.measurements?.hips === undefined ? '' : formData.measurements.hips}
                onChange={(e) => handleMeasurementChange('hips', e.target.value)}
                InputProps={{ inputProps: { min: 0, step: 0.1 } }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Petto"
                type="number"
                fullWidth
                value={formData.measurements?.chest === undefined ? '' : formData.measurements.chest}
                onChange={(e) => handleMeasurementChange('chest', e.target.value)}
                InputProps={{ inputProps: { min: 0, step: 0.1 } }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Cosce"
                type="number"
                fullWidth
                value={formData.measurements?.thighs === undefined ? '' : formData.measurements.thighs}
                onChange={(e) => handleMeasurementChange('thighs', e.target.value)}
                InputProps={{ inputProps: { min: 0, step: 0.1 } }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Braccia"
                type="number"
                fullWidth
                value={formData.measurements?.arms === undefined ? '' : formData.measurements.arms}
                onChange={(e) => handleMeasurementChange('arms', e.target.value)}
                InputProps={{ inputProps: { min: 0, step: 0.1 } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Note"
                multiline
                rows={3}
                fullWidth
                value={formData.note || ''}
                onChange={(e) => handleChange('note', e.target.value)}
                placeholder="Aggiungi note sulla misurazione (es. cambiamenti nella dieta, routine di allenamento, ecc.)"
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annulla</Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Salva
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MeasurementForm;
