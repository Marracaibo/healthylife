import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  Chip,
  Button
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Note as NoteIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { BodyMeasurement } from '../types/measurements';

interface MeasurementTableProps {
  measurements: BodyMeasurement[];
  onEdit: (measurement: BodyMeasurement) => void;
  onDelete: (id: number) => void;
}

const MeasurementTable: React.FC<MeasurementTableProps> = ({ 
  measurements, 
  onEdit, 
  onDelete 
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [expandedNotes, setExpandedNotes] = useState<number[]>([]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const toggleNote = (id: number) => {
    setExpandedNotes(prev => 
      prev.includes(id) 
        ? prev.filter(noteId => noteId !== id) 
        : [...prev, id]
    );
  };

  // Ordina le misurazioni per data (più recenti prima)
  const sortedMeasurements = [...measurements].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Paginazione
  const paginatedMeasurements = sortedMeasurements.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell>Data</TableCell>
                <TableCell align="right">Peso (kg)</TableCell>
                <TableCell align="right">Massa Grassa (%)</TableCell>
                <TableCell align="right">BMI</TableCell>
                <TableCell align="right">Vita (cm)</TableCell>
                <TableCell align="right">Fianchi (cm)</TableCell>
                <TableCell align="right">Note</TableCell>
                <TableCell align="center">Azioni</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedMeasurements.map((measurement) => {
                const hasNote = measurement.note && measurement.note.trim() !== '';
                const isNoteExpanded = expandedNotes.includes(measurement.id);
                
                return (
                  <React.Fragment key={measurement.id}>
                    <TableRow hover>
                      <TableCell>
                        {format(new Date(measurement.date), 'd MMM yyyy', { locale: it })}
                      </TableCell>
                      <TableCell align="right">{measurement.weight}</TableCell>
                      <TableCell align="right">
                        {measurement.bodyFatPercentage !== undefined 
                          ? measurement.bodyFatPercentage 
                          : '-'}
                      </TableCell>
                      <TableCell align="right">
                        {measurement.bmi !== undefined 
                          ? measurement.bmi 
                          : '-'}
                      </TableCell>
                      <TableCell align="right">
                        {measurement.measurements.waist !== undefined 
                          ? measurement.measurements.waist 
                          : '-'}
                      </TableCell>
                      <TableCell align="right">
                        {measurement.measurements.hips !== undefined 
                          ? measurement.measurements.hips 
                          : '-'}
                      </TableCell>
                      <TableCell align="right">
                        {hasNote ? (
                          <Tooltip title={isNoteExpanded ? "Nascondi nota" : "Mostra nota"}>
                            <IconButton size="small" onClick={() => toggleNote(measurement.id)}>
                              <NoteIcon color="info" />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Tooltip title="Modifica">
                            <IconButton size="small" onClick={() => onEdit(measurement)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Elimina">
                            <IconButton size="small" onClick={() => onDelete(measurement.id)}>
                              <DeleteIcon fontSize="small" color="error" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                    
                    {/* Riga per la nota espansa */}
                    {isNoteExpanded && (
                      <TableRow>
                        <TableCell colSpan={8} sx={{ py: 1, backgroundColor: '#f5f5f5' }}>
                          <Typography variant="body2" sx={{ px: 2, py: 1 }}>
                            <strong>Nota:</strong> {measurement.note}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
              
              {paginatedMeasurements.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">
                      Nessuna misurazione disponibile.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={measurements.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Righe per pagina:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} di ${count !== -1 ? count : `più di ${to}`}`
          }
        />
      </Paper>
    </Box>
  );
};

export default MeasurementTable;
