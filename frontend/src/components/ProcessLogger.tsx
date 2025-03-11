import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';

export interface LogEntry {
  message: string;
  timestamp: Date;
  status: 'pending' | 'success' | 'error' | 'info';
}

interface ProcessLoggerProps {
  logs: LogEntry[];
  visible?: boolean;
}

const ProcessLogger: React.FC<ProcessLoggerProps> = ({ logs, visible = false }) => {
  if (!visible) return null;

  return (
    <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        Stato Processo
      </Typography>
      <Box sx={{ maxHeight: '200px', overflowY: 'auto' }}>
        {logs.map((log, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 1,
              color: log.status === 'error' ? 'error.main' : 'text.primary'
            }}
          >
            {log.status === 'pending' && <CircularProgress size={20} />}
            {log.status === 'success' && <CheckCircleIcon color="success" />}
            {log.status === 'error' && <ErrorIcon color="error" />}
            {log.status === 'info' && <InfoIcon color="info" />}
            <Typography variant="body2">
              {log.message}
            </Typography>
            <Typography variant="caption" sx={{ ml: 'auto', color: 'text.secondary' }}>
              {log.timestamp.toLocaleTimeString()}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ProcessLogger;
