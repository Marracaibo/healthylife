import React from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Divider,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  IconButton
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon, 
  TrendingDown as TrendingDownIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { MeasurementStatistics } from '../types/measurements';

interface ProgressStatsProps {
  statistics: MeasurementStatistics;
}

const ProgressStats: React.FC<ProgressStatsProps> = ({ statistics }) => {
  const renderTrend = (value: number | undefined) => {
    if (value === undefined) return null;
    
    if (value < 0) {
      return (
        <TrendingDownIcon 
          sx={{ color: 'success.main', ml: 1, verticalAlign: 'middle' }} 
        />
      );
    } else if (value > 0) {
      return (
        <TrendingUpIcon 
          sx={{ color: 'error.main', ml: 1, verticalAlign: 'middle' }} 
        />
      );
    }
    return null;
  };

  const renderMeasurementItem = (
    label: string, 
    initial: number | undefined, 
    current: number | undefined, 
    diff: number | undefined,
    unit: string = '',
    tooltip: string = ''
  ) => {
    if (initial === undefined || current === undefined) return null;
    
    return (
      <ListItem>
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1">
                {label}
                {tooltip && (
                  <Tooltip title={tooltip}>
                    <IconButton size="small" sx={{ ml: 0.5, p: 0 }}>
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Typography>
            </Box>
          }
          secondary={
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
              Iniziale: {initial}{unit} → Attuale: {current}{unit}
              {diff !== undefined && (
                <Box component="span" sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>
                  ({diff > 0 ? '+' : ''}{diff}{unit}
                  {renderTrend(diff)})
                </Box>
              )}
            </Typography>
          }
        />
      </ListItem>
    );
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Riepilogo Progressi
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Periodo di monitoraggio: {statistics.daysTracked} giorni
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle1" gutterBottom>
              Peso
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
              <Typography variant="h4" component="span">
                {statistics.currentWeight}
              </Typography>
              <Typography variant="body1" component="span" sx={{ ml: 1 }}>
                kg
              </Typography>
              {renderTrend(statistics.weightDiff)}
            </Box>
            <Typography variant="body2" color="text.secondary">
              Variazione: {statistics.weightDiff > 0 ? '+' : ''}{statistics.weightDiff} kg
            </Typography>
            {statistics.targetWeight && (
              <Typography variant="body2" color="text.secondary">
                Obiettivo: {statistics.targetWeight} kg 
                ({statistics.currentWeight > statistics.targetWeight 
                  ? `${(statistics.currentWeight - statistics.targetWeight).toFixed(1)} kg rimanenti` 
                  : 'Raggiunto!'})
              </Typography>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle1" gutterBottom>
              Massa Grassa
            </Typography>
            {statistics.currentBodyFat ? (
              <>
                <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                  <Typography variant="h4" component="span">
                    {statistics.currentBodyFat}
                  </Typography>
                  <Typography variant="body1" component="span" sx={{ ml: 1 }}>
                    %
                  </Typography>
                  {statistics.bodyFatDiff && renderTrend(statistics.bodyFatDiff)}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Variazione: {statistics.bodyFatDiff && statistics.bodyFatDiff > 0 ? '+' : ''}
                  {statistics.bodyFatDiff} %
                </Typography>
              </>
            ) : (
              <Typography variant="body1" sx={{ mt: 2 }}>
                Dati non disponibili
              </Typography>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle1" gutterBottom>
              BMI
            </Typography>
            {statistics.currentBMI ? (
              <>
                <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                  <Typography variant="h4" component="span">
                    {statistics.currentBMI}
                  </Typography>
                  {statistics.bmiDiff && renderTrend(statistics.bmiDiff)}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Variazione: {statistics.bmiDiff && statistics.bmiDiff > 0 ? '+' : ''}
                  {statistics.bmiDiff}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {statistics.currentBMI < 18.5 
                    ? 'Sottopeso' 
                    : statistics.currentBMI < 25 
                      ? 'Normopeso' 
                      : statistics.currentBMI < 30 
                        ? 'Sovrappeso' 
                        : 'Obesità'}
                </Typography>
              </>
            ) : (
              <Typography variant="body1" sx={{ mt: 2 }}>
                Dati non disponibili
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 3 }} />
      
      <Typography variant="subtitle1" gutterBottom>
        Misurazioni Corporee
      </Typography>
      
      <List>
        {renderMeasurementItem(
          'Vita', 
          statistics.measurementChanges.waist?.initial,
          statistics.measurementChanges.waist?.current,
          statistics.measurementChanges.waist?.diff,
          ' cm'
        )}
        
        {renderMeasurementItem(
          'Fianchi', 
          statistics.measurementChanges.hips?.initial,
          statistics.measurementChanges.hips?.current,
          statistics.measurementChanges.hips?.diff,
          ' cm'
        )}
        
        {renderMeasurementItem(
          'Petto', 
          statistics.measurementChanges.chest?.initial,
          statistics.measurementChanges.chest?.current,
          statistics.measurementChanges.chest?.diff,
          ' cm'
        )}
        
        {renderMeasurementItem(
          'Cosce', 
          statistics.measurementChanges.thighs?.initial,
          statistics.measurementChanges.thighs?.current,
          statistics.measurementChanges.thighs?.diff,
          ' cm'
        )}
        
        {renderMeasurementItem(
          'Braccia', 
          statistics.measurementChanges.arms?.initial,
          statistics.measurementChanges.arms?.current,
          statistics.measurementChanges.arms?.diff,
          ' cm'
        )}
      </List>
    </Paper>
  );
};

export default ProgressStats;
