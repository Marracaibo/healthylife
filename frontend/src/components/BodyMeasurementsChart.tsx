import React, { useState } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { MeasurementChartData } from '../types/measurements';

interface BodyMeasurementsChartProps {
  data: MeasurementChartData[];
  availableMeasurements: string[];
}

const measurementColors: Record<string, string> = {
  weight: '#2E7D32',
  bodyFatPercentage: '#E65100',
  bmi: '#1565C0',
  waist: '#C2185B',
  hips: '#6A1B9A',
  chest: '#283593',
  thighs: '#00695C',
  arms: '#F9A825',
};

const measurementLabels: Record<string, string> = {
  weight: 'Peso (kg)',
  bodyFatPercentage: 'Massa Grassa (%)',
  bmi: 'BMI',
  waist: 'Vita (cm)',
  hips: 'Fianchi (cm)',
  chest: 'Petto (cm)',
  thighs: 'Cosce (cm)',
  arms: 'Braccia (cm)',
};

const BodyMeasurementsChart: React.FC<BodyMeasurementsChartProps> = ({ data, availableMeasurements }) => {
  const [selectedMeasurements, setSelectedMeasurements] = useState<string[]>(['weight', 'bodyFatPercentage']);

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setSelectedMeasurements(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 4, mt: 1 }}>
        {/* Label separato e sopra il select */}
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
          Misurazioni da visualizzare:
        </Typography>
        <FormControl fullWidth size="small">
          <Select
            id="measurements-select"
            multiple
            displayEmpty
            value={selectedMeasurements}
            onChange={handleChange}
            renderValue={(selected) => selected.map(key => measurementLabels[key] || key).join(', ')}
            sx={{
              '& .MuiSelect-select': {
                padding: '10px 12px',
                minHeight: '42px'
              }
            }}
          >
            {availableMeasurements.map((measurement) => (
              <MenuItem key={measurement} value={measurement}>
                {measurementLabels[measurement] || measurement}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart 
          data={data}
          margin={{ top: 10, right: 10, left: 5, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => format(new Date(date), 'd MMM', { locale: it })}
            tick={{ fontSize: 12 }}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            width={40}
          />
          <Tooltip 
            labelFormatter={(date) => format(new Date(date), 'd MMMM yyyy', { locale: it })}
            formatter={(value: number, name: string) => {
              const label = measurementLabels[name] || name;
              const unit = name === 'weight' ? 'kg' : 
                          name === 'bodyFatPercentage' ? '%' : 
                          name === 'bmi' ? '' : 'cm';
              return [`${value} ${unit}`, label];
            }}
            contentStyle={{
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              padding: '10px'
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: 15, fontSize: 12 }}
            formatter={(value) => measurementLabels[value] || value}
          />
          
          {selectedMeasurements.map((measurement) => (
            <Line 
              key={measurement}
              type="monotone" 
              dataKey={measurement} 
              stroke={measurementColors[measurement] || '#8884d8'} 
              name={measurement}
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default BodyMeasurementsChart;
