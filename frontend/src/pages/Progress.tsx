import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  CircularProgress, 
  Alert, 
  Tabs, 
  Tab, 
  Button, 
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Add as AddIcon,
  PhotoCamera as PhotoCameraIcon
} from '@mui/icons-material';
import { format, subDays } from 'date-fns';
import { it } from 'date-fns/locale';

// Componenti personalizzati
import BodyMeasurementsChart from '../components/BodyMeasurementsChart';
import ProgressGallery from '../components/ProgressGallery';
import MeasurementForm from '../components/MeasurementForm';
import MeasurementTable from '../components/MeasurementTable';
import ProgressStats from '../components/ProgressStats';

// Dati di esempio
import { 
  generateSampleMeasurements, 
  generateSamplePhotos, 
  generateSampleStatistics 
} from '../data/sampleMeasurements';

// Tipi
import { 
  BodyMeasurement, 
  ProgressPhoto, 
  MeasurementChartData 
} from '../types/measurements';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(3),
  color: theme.palette.text.primary,
  height: '100%',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  borderRadius: '12px',
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`progress-tabpanel-${index}`}
      aria-labelledby={`progress-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function Progress() {
  const [tabValue, setTabValue] = useState(0);
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [chartData, setChartData] = useState<MeasurementChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedMeasurement, setSelectedMeasurement] = useState<BodyMeasurement | undefined>(undefined);
  const [availableMeasurements, setAvailableMeasurements] = useState<string[]>([]);

  useEffect(() => {
    // Simula il caricamento dei dati
    const loadData = async () => {
      setLoading(true);
      try {
        // Genera dati di esempio
        const sampleMeasurements = generateSampleMeasurements();
        const samplePhotos = generateSamplePhotos();
        
        // Attende un breve momento per simulare il caricamento
        await new Promise(resolve => setTimeout(resolve, 1000));

        setMeasurements(sampleMeasurements);
        setPhotos(samplePhotos);
        setStatistics(generateSampleStatistics(sampleMeasurements));
        
        // Prepara i dati per il grafico
        prepareChartData(sampleMeasurements);
      } catch (error) {
        console.error('Errore nel caricamento dei dati:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Prepara i dati per il grafico combinando tutte le misurazioni
  const prepareChartData = (measurements: BodyMeasurement[]) => {
    const chartData: MeasurementChartData[] = [];
    const availableMeasurements: Set<string> = new Set(['weight', 'bodyFatPercentage', 'bmi']);
    
    measurements.forEach(measurement => {
      const dataPoint: MeasurementChartData = {
        date: measurement.date,
        weight: measurement.weight,
      };
      
      if (measurement.bodyFatPercentage !== undefined) {
        dataPoint.bodyFatPercentage = measurement.bodyFatPercentage;
      }
      
      if (measurement.bmi !== undefined) {
        dataPoint.bmi = measurement.bmi;
      }
      
      // Aggiungi le misurazioni corporee
      Object.entries(measurement.measurements).forEach(([key, value]) => {
        if (value !== undefined) {
          dataPoint[key] = value;
          availableMeasurements.add(key);
        }
      });
      
      chartData.push(dataPoint);
    });
    
    setChartData(chartData);
    setAvailableMeasurements(Array.from(availableMeasurements));
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenForm = (measurement?: BodyMeasurement) => {
    setSelectedMeasurement(measurement);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setSelectedMeasurement(undefined);
  };

  const handleSaveMeasurement = (data: Partial<BodyMeasurement>) => {
    if (selectedMeasurement) {
      // Aggiorna una misurazione esistente
      const updatedMeasurements = measurements.map(m => 
        m.id === selectedMeasurement.id ? { ...m, ...data } : m
      );
      setMeasurements(updatedMeasurements);
      setStatistics(generateSampleStatistics(updatedMeasurements));
      prepareChartData(updatedMeasurements);
    } else {
      // Aggiungi una nuova misurazione
      const newMeasurement: BodyMeasurement = {
        id: Date.now(),
        date: data.date || new Date().toISOString().split('T')[0],
        weight: data.weight || 0,
        bodyFatPercentage: data.bodyFatPercentage,
        bmi: data.bmi,
        note: data.note,
        measurements: data.measurements || {}
      };
      
      const updatedMeasurements = [...measurements, newMeasurement].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      setMeasurements(updatedMeasurements);
      setStatistics(generateSampleStatistics(updatedMeasurements));
      prepareChartData(updatedMeasurements);
    }
  };

  const handleDeleteMeasurement = (id: number) => {
    const updatedMeasurements = measurements.filter(m => m.id !== id);
    setMeasurements(updatedMeasurements);
    setStatistics(generateSampleStatistics(updatedMeasurements));
    prepareChartData(updatedMeasurements);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>
          I Tuoi Progressi
        </Typography>
        <Box>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenForm()}
            sx={{ mr: 2 }}
          >
            Nuova Misurazione
          </Button>
        </Box>
      </Box>

      <ProgressStats statistics={statistics} />

      <Box sx={{ width: '100%', mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>          
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="progress tabs"
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            sx={{
              '& .MuiTab-root': {
                fontSize: { xs: '0.875rem', sm: '1rem' },
                minHeight: '48px',
                padding: '6px 16px',
                fontWeight: 'medium'
              },
              '& .Mui-selected': {
                fontWeight: 'bold',
                color: '#2E7D32'
              }
            }}
          >
            <Tab label="Grafici" id="progress-tab-0" />
            <Tab label="Misurazioni" id="progress-tab-1" />
            <Tab label="Galleria Foto" id="progress-tab-2" />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <Item>
            <Typography variant="h6" gutterBottom>Andamento delle Misurazioni</Typography>
            <BodyMeasurementsChart 
              data={chartData} 
              availableMeasurements={availableMeasurements} 
            />
          </Item>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <MeasurementTable 
            measurements={measurements} 
            onEdit={handleOpenForm} 
            onDelete={handleDeleteMeasurement} 
          />
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <ProgressGallery photos={photos} />
        </TabPanel>
      </Box>

      {/* Form per aggiungere/modificare misurazioni */}
      <MeasurementForm 
        open={formOpen} 
        onClose={handleCloseForm} 
        onSave={handleSaveMeasurement}
        initialData={selectedMeasurement}
      />
    </Box>
  );
}
