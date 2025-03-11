import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography, useTheme, useMediaQuery, IconButton } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CloseIcon from '@mui/icons-material/Close';
import { Food } from '../services/hybridFoodService';
import hybridFoodService from '../services/hybridFoodService';

interface BarcodeScannerProps {
  onFoodSelect: (food: Food) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onFoodSelect }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Check online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Simulazione di scansione barcode per demo
  useEffect(() => {
    if (scanning && !scannedCode) {
      const timer = setTimeout(() => {
        // Simula la scansione di un codice random
        const demoOptions = ['8001505005707', '8076809513418', '8001060387743']; 
        const randomBarcode = demoOptions[Math.floor(Math.random() * demoOptions.length)];
        setScannedCode(randomBarcode);
        setScanning(false);
        processBarcode(randomBarcode);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [scanning, scannedCode]);
  
  const handleOpen = () => {
    setOpen(true);
    setScannedCode(null);
    setError(null);
  };
  
  const handleClose = () => {
    setOpen(false);
    setScanning(false);
    setScannedCode(null);
    setError(null);
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };
  
  const startScan = async () => {
    setScanning(true);
    setError(null);
    
    // Check se siamo in modalità standalone
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone === true;
    
    try {
      // In un'implementazione reale, qui useremo getMedia per accedere alla fotocamera
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              facingMode: 'environment',
              width: { ideal: 1280 },
              height: { ideal: 720 }
            } 
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            
            // In una implementazione reale, qui configureremmo una libreria
            // di scansione come quagga.js o zxing
          }
        } catch (cameraError) {
          console.error('Errore accesso fotocamera:', cameraError);
          
          // Se siamo in PWA standalone e c'è errore con la fotocamera,
          // probabilmente è un problema di permessi - messaggio più specifico
          if (isStandalone) {
            setError('Permesso fotocamera negato. Se usi la PWA, verifica i permessi nelle impostazioni del dispositivo');
          } else {
            setError('Fotocamera non accessibile. Prova ad usare il pulsante "Test con codice demo"');
          }
          setScanning(false);
        }
      } else {
        setError('Fotocamera non disponibile su questo dispositivo');
        setScanning(false);
      }
    } catch (err) {
      console.error('Errore accesso fotocamera:', err);
      setError('Errore nell\'accesso alla fotocamera');
      setScanning(false);
    }
  };
  
  const processBarcode = async (barcode: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Mostra feedback all'utente per dispositivo offline
      if (isOffline) {
        setError('Ricerca offline in corso...');
      }
      
      // Utilizziamo il service per cercare il prodotto
      const results = await hybridFoodService.searchByBarcode(barcode);
      if (results && results.length > 0) {
        onFoodSelect(results[0]);
        handleClose();
      } else {
        if (isOffline) {
          setError(`Prodotto con codice ${barcode} non trovato nel database offline. Riprova quando sarai online.`);
        } else {
          setError(`Prodotto con codice ${barcode} non trovato`);
        }
      }
    } catch (err) {
      console.error('Errore nella ricerca del prodotto:', err);
      if (isOffline) {
        setError('Impossibile cercare il prodotto in modalità offline. Riprova quando sarai online.');
      } else {
        setError('Errore nella ricerca del prodotto');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Funzione demo per simulare la scansione manuale
  const handleManualSearch = () => {
    // Codici a barre demo
    const demoOptions = ['8001505005707', '8076809513418', '8001060387743'];
    const demoBarcode = demoOptions[0]; // Usa il primo come default
    setScannedCode(demoBarcode);
    processBarcode(demoBarcode);
  };
  
  return (
    <>
      <Button 
        variant="outlined" 
        startIcon={<CameraAltIcon />} 
        onClick={handleOpen}
        size={isMobile ? "medium" : "small"}
        sx={{ 
          minHeight: isMobile ? '48px' : '36px',
          minWidth: isMobile ? '48px' : '36px',
          borderRadius: 2,
          py: isMobile ? 1 : 0.5
        }}
      >
        {isMobile ? "" : "Scan"}
      </Button>
      
      <Dialog 
        open={open} 
        onClose={handleClose} 
        fullWidth 
        maxWidth="sm"
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ pr: 6 }}>
          Scanner Barcode
          <IconButton 
            sx={{ position: 'absolute', right: 8, top: 8 }}
            onClick={handleClose}
            edge="end"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: 2,
            mb: 2 
          }}>
            {scanning ? (
              <Box sx={{ 
                position: 'relative', 
                width: '100%', 
                height: isMobile ? 320 : 280,
                bgcolor: 'black',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 1
              }}>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    borderRadius: '4px'
                  }} 
                />
                <Box sx={{
                  position: 'absolute',
                  width: '70%',
                  height: '25%',
                  border: '2px solid #4caf50',
                  borderRadius: 1,
                  boxShadow: '0 0 0 4000px rgba(0, 0, 0, 0.3)'
                }} />
              </Box>
            ) : (
              <Box sx={{ 
                width: '100%', 
                height: isMobile ? 320 : 280, 
                bgcolor: 'rgba(0, 0, 0, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 1
              }}>
                <CameraAltIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" color="text.secondary" align="center" sx={{ px: 2 }}>
                  {scannedCode 
                    ? `Codice scansionato: ${scannedCode}` 
                    : isOffline 
                      ? 'Modalità offline: utilizza il codice demo' 
                      : 'Premi Scansiona per iniziare'}
                </Typography>
                {isOffline && (
                  <Typography variant="caption" color="warning.main" sx={{ mt: 1 }}>
                    Sei offline. Potrai cercare solo prodotti già scansionati in precedenza.
                  </Typography>
                )}
              </Box>
            )}
            
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <CircularProgress size={24} />
              </Box>
            )}
            
            {error && (
              <Typography color="error" variant="body2" align="center">
                {error}
              </Typography>
            )}
            
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between' }}>
          <Button 
            variant="outlined" 
            onClick={handleManualSearch}
            disabled={scanning || loading}
            sx={{
              minHeight: isMobile ? '48px' : '36px',
              borderRadius: 2
            }}
          >
            Test con codice demo
          </Button>
          <Button 
            variant="contained" 
            onClick={startScan}
            disabled={scanning || loading || (isOffline && !navigator.mediaDevices)}
            sx={{
              minWidth: '120px',
              minHeight: isMobile ? '48px' : '36px',
              borderRadius: 2
            }}
          >
            {scanning 
              ? <CircularProgress size={24} color="inherit" /> 
              : 'Scansiona'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BarcodeScanner;
