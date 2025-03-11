import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Chip, 
  Card, 
  CardContent, 
  IconButton,
  Divider,
  useTheme,
  alpha,
  useMediaQuery
} from '@mui/material';
import { 
  ChevronLeft, 
  ChevronRight, 
  FitnessCenter, 
  CalendarToday, 
  Check 
} from '@mui/icons-material';
import { 
  format, 
  startOfMonth,
  endOfMonth,
  isSameMonth,
  isSameDay,
  isToday,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths
} from 'date-fns';
import { it } from 'date-fns/locale';
import { WorkoutProgram, WorkoutPhase, WorkoutWeek, WorkoutDay } from '../types/workout';

interface WorkoutCalendarProps {
  program: WorkoutProgram;
  selectedPhase: WorkoutPhase;
  selectedWeek: WorkoutWeek | null;
  onPhaseSelect: (phase: WorkoutPhase) => void;
  onWeekSelect: (week: WorkoutWeek) => void;
  onDaySelect: (day: WorkoutDay) => void;
  completedWorkouts: Set<string>;
}

const WorkoutCalendar: React.FC<WorkoutCalendarProps> = ({
  program,
  selectedPhase,
  selectedWeek,
  onPhaseSelect,
  onWeekSelect,
  onDaySelect,
  completedWorkouts
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentDate, setCurrentDate] = useState(new Date()); // Usa la data corrente di sistema
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);
  
  // Imposta i giorni del calendario quando cambia il mese corrente
  useEffect(() => {
    const days = [];
    let start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });
    
    let day = start;
    while (day <= end) {
      days.push(day);
      day = addDays(day, 1);
    }
    
    setCalendarDays(days);
  }, [currentDate]);
  
  // Quando cambia la fase, aggiorna il mese visualizzato
  useEffect(() => {
    if (selectedPhase && program?.startDate) {
      // Calcola la data di inizio della fase
      const programStart = new Date(program.startDate);
      const weeks = selectedPhase.weeks || [];
      const firstWeek = weeks.length > 0 ? 
        [...weeks].sort((a, b) => a.weekNumber - b.weekNumber)[0] : null;
      
      if (firstWeek) {
        // Calcola quanti giorni dopo l'inizio del programma inizia questa fase
        const daysToAdd = (firstWeek.weekNumber - 1) * 7;
        const phaseStartDate = new Date(programStart);
        phaseStartDate.setDate(programStart.getDate() + daysToAdd);
        
        // Imposta il mese corrente a quello della fase
        setCurrentDate(startOfMonth(phaseStartDate));
      }
    }
  }, [selectedPhase, program]);
  
  // Passa al mese precedente
  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };
  
  // Passa al mese successivo
  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  
  // Calcola il numero di giorni dall'inizio del programma
  const getDaysSinceStart = (date: Date): number => {
    if (!program?.startDate) return 0;
    
    const startDate = new Date(program.startDate);
    const diffTime = Math.abs(date.getTime() - startDate.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  // Verifica se una data è all'interno del periodo del programma
  const isWithinProgram = (date: Date): boolean => {
    if (!program?.startDate) return false;
    
    const startDate = new Date(program.startDate);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + (program.duration || 0) * 7); // Durata in settimane * 7 giorni
    
    return date >= startDate && date < endDate;
  };

  // Verifica se una data appartiene alla fase selezionata
  const isInSelectedPhase = (date: Date): boolean => {
    if (!program?.startDate || !selectedPhase || !selectedPhase.weeks?.length) return false;
    
    // Verifica prima che la data sia all'interno del programma
    if (!isWithinProgram(date)) return false;
    
    const startDate = new Date(program.startDate);
    const daysSinceStart = getDaysSinceStart(date);
    const weekNumber = Math.floor(daysSinceStart / 7) + 1;
    
    // Verifica se il numero di settimana è incluso nella fase selezionata
    const weekInPhase = selectedPhase.weeks.find(week => week.weekNumber === weekNumber);
    return !!weekInPhase;
  };

  // Restituisce l'allenamento previsto per un giorno specifico in base al programma
  const getWorkoutForDay = (date: Date): WorkoutDay | null => {
    if (!program?.startDate) return null;
    
    const startDate = new Date(program.startDate);
    
    // Se la data è precedente alla data di inizio, non ci sono allenamenti
    if (date < startDate) return null;
    
    // Calcola il numero di giorni dall'inizio del programma
    const daysSinceStart = getDaysSinceStart(date);
    
    // Calcola il numero di settimana del programma (1-based)
    const weekNumber = Math.floor(daysSinceStart / 7) + 1;
    
    // Se il numero di settimana supera la durata del programma, non ci sono allenamenti
    if (weekNumber > (program.duration || 0)) return null;
    
    // Calcola il giorno della settimana (0-6, dove 0 è domenica)
    const dayOfWeek = date.getDay();
    
    // Trova la fase e la settimana corrente
    let currentPhase: WorkoutPhase | null = null;
    let currentWeek: WorkoutWeek | null = null;
    
    if (program?.phases) {
      for (const phase of program.phases) {
        for (const week of phase.weeks) {
          if (week.weekNumber === weekNumber) {
            currentPhase = phase;
            currentWeek = week;
            break;
          }
        }
        if (currentPhase) break;
      }
    }
    
    if (!currentWeek) return null;
    
    // Troviamo il workout in base al giorno della settimana
    // Se abbiamo abbastanza giorni di workout nella settimana, li associamo ai giorni della settimana
    // altrimenti li distribuiamo equamente
    const workoutDays = currentWeek.days.filter(d => d.type === 'workout');
    const testDays = currentWeek.days.filter(d => d.type === 'test');
    
    // Non mostriamo allenamenti per i giorni di altri mesi (solo per la visualizzazione nel calendario)
    if (!isSameMonth(date, currentDate)) {
      return null;
    }
    
    // Se è domenica, è sempre giorno di riposo
    if (dayOfWeek === 0) {
      return {
        id: `rest-${date.toISOString()}`,
        name: 'Giorno di Riposo',
        code: 'RIPOSO',
        type: 'rest',
        dayNumber: date.getDate(),
        exercises: []
      };
    }
    
    // Se è sabato e abbiamo giorni di test, assegna un test
    if (dayOfWeek === 6 && testDays.length > 0) {
      // Usa il primo giorno di test disponibile
      const testDay = testDays[0];
      return {
        ...testDay,
        dayNumber: date.getDate()
      };
    }
    
    // Distribuisce i giorni di workout nelle giornate di lunedì, mercoledì e venerdì
    if ((dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) && workoutDays.length > 0) {
      // Ottieni l'indice del workout da applicare in base alla posizione nella settimana
      const workoutIndex = Math.floor((dayOfWeek - 1) / 2) % workoutDays.length;
      const workoutDay = workoutDays[workoutIndex];
      
      return {
        ...workoutDay,
        dayNumber: date.getDate()
      };
    }
    
    // Altrimenti è un giorno di riposo
    return {
      id: `rest-${date.toISOString()}`,
      name: 'Giorno di Riposo',
      code: 'RIPOSO',
      type: 'rest',
      dayNumber: date.getDate(),
      exercises: []
    };
  };
  
  // Funzione per verificare se un giorno ha un allenamento programmato
  const hasWorkoutOnDate = (day: Date): boolean => {
    if (!program?.startDate || !selectedPhase) return false;
    
    // Calcola la data di inizio del programma
    const programStart = new Date(program.startDate);
    
    // Calcola la settimana corrente del programma
    const daysDiff = getDaysSinceStart(day);
    if (daysDiff < 0) return false; // La data è prima dell'inizio del programma
    
    const weekNumber = Math.floor(daysDiff / 7) + 1;
    const dayOfWeek = day.getDay() || 7; // 0-6 (Domenica-Sabato) trasformato in 1-7 (Lunedì-Domenica)
    
    // Trova la settimana corrispondente nella fase selezionata
    const weekInPhase = selectedPhase.weeks?.find(week => week.weekNumber === weekNumber);
    if (!weekInPhase || !weekInPhase.workouts) return false;
    
    // Verifica se il giorno della settimana ha un allenamento
    const workoutDay = weekInPhase.workouts.find(workout => workout.dayNumber === dayOfWeek);
    return !!workoutDay;
  };

  return (
    <Box sx={{ p: isMobile ? 1 : 2 }}>
      {/* Intestazione con mese corrente e bottoni di navigazione */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        mb: 2 
      }}>
        <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: 'bold' }}>
          {format(currentDate, 'MMMM yyyy', { locale: it })}
        </Typography>
        <Box>
          <IconButton onClick={handlePrevMonth} size={isMobile ? "medium" : "large"}>
            <ChevronLeft />
          </IconButton>
          <IconButton onClick={handleNextMonth} size={isMobile ? "medium" : "large"}>
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>
      
      {/* Griglia dei giorni della settimana */}
      <Grid container sx={{ mb: 1 }}>
        {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map((day, index) => (
          <Grid item key={day} xs>
            <Typography 
              align="center" 
              variant={isMobile ? "caption" : "body2"}
              sx={{ 
                fontWeight: 'bold',
                color: day === 'Dom' ? theme.palette.error.main : 'inherit'
              }}
            >
              {day}
            </Typography>
          </Grid>
        ))}
      </Grid>
      
      {/* Griglia del calendario */}
      <Grid container spacing={isMobile ? 0.5 : 1}>
        {calendarDays.map((date) => {
          const isCurrentMonth = isSameMonth(date, currentDate);
          const isSelected = isToday(date);
          const workout = getWorkoutForDay(date);
          const isCompleted = workout && completedWorkouts.has(workout.id);
          const belongsToSelectedPhase = isInSelectedPhase(date);
          const hasWorkout = hasWorkoutOnDate(date);
          
          // Determina il colore di sfondo in base al tipo di allenamento
          let bgColor = 'transparent';
          if (workout) {
            if (workout.type === 'workout') {
              bgColor = alpha(theme.palette.error.main, 0.1);
            } else if (workout.type === 'test') {
              bgColor = alpha(theme.palette.warning.main, 0.1);
            } else if (workout.type === 'rest') {
              bgColor = alpha(theme.palette.success.main, 0.1);
            }
          }
          
          return (
            <Grid item key={date.toISOString()} xs>
              <Paper 
                elevation={0}
                sx={{
                  p: isMobile ? 0.5 : 1,
                  height: '100%',
                  minHeight: isMobile ? 70 : 100,
                  backgroundColor: !isCurrentMonth 
                    ? alpha(theme.palette.background.paper, 0.5) 
                    : isSelected 
                      ? alpha(theme.palette.primary.main, 0.1)
                      : isWithinProgram(date) 
                        ? bgColor 
                        : 'transparent',
                  borderRadius: '8px',
                  border: isToday(date) 
                    ? `2px solid ${theme.palette.primary.main}` 
                    : isInSelectedPhase(date)
                      ? `3px solid ${theme.palette.secondary.main}`
                      : '1px solid #e0e0e0',
                  opacity: !isCurrentMonth ? 0.5 : 1,
                  position: 'relative',
                  '&:hover': {
                    backgroundColor: isCurrentMonth ? alpha(theme.palette.primary.main, 0.05) : null,
                    transition: 'all 0.2s ease',
                    cursor: isCurrentMonth ? 'pointer' : 'default'
                  },
                  cursor: isCurrentMonth ? 'pointer' : 'default',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => {
                  if (isCurrentMonth) {
                    // Se il workout non esiste, ne creiamo uno fittizio
                    if (!workout) {
                      const weekDay = date.getDay();
                      const dayOfMonth = date.getDate();
                      // Tutti i giorni vuoti sono considerati giorni di riposo
                      const type: 'workout' | 'rest' | 'test' = 'rest';
                      
                      const fakeWorkout: WorkoutDay = {
                        id: `rest-${dayOfMonth}`,
                        code: 'RIPOSO',
                        name: 'Giorno di Riposo',
                        dayNumber: dayOfMonth,
                        type: type,
                        exercises: []
                      };
                      
                      onDaySelect(fakeWorkout);
                    } else {
                      onDaySelect(workout);
                    }
                  }
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start'
                }}>
                  <Typography
                    component="span"
                    variant={isMobile ? "caption" : "body2"}
                    sx={{
                      fontWeight: isToday(date) ? 'bold' : 'normal',
                      color: isToday(date) ? theme.palette.primary.main : 'inherit',
                      width: isMobile ? 18 : 24,
                      height: isMobile ? 18 : 24,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      backgroundColor: isToday(date) ? alpha(theme.palette.primary.main, 0.1) : 'transparent'
                    }}
                  >
                    {format(date, 'd')}
                  </Typography>
                  
                  {isCurrentMonth && (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 0.5 
                    }}>
                      {isCompleted && (
                        <Check 
                          fontSize="small" 
                          sx={{ 
                            color: theme.palette.success.main,
                            backgroundColor: alpha(theme.palette.success.main, 0.1),
                            borderRadius: '50%',
                            p: 0.2,
                            fontSize: isMobile ? '0.8rem' : '1rem'
                          }}
                        />
                      )}
                      
                      {workout?.type === 'workout' && (
                        <FitnessCenter 
                          fontSize="small"
                          sx={{ 
                            color: theme.palette.error.main,
                            fontSize: isMobile ? '0.8rem' : '1rem'
                          }}
                        />
                      )}
                      
                      {workout?.type === 'rest' && (
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: theme.palette.success.main,
                            fontWeight: 'bold',
                            fontSize: isMobile ? '0.5rem' : '0.6rem'
                          }}
                        >
                          RIPOSO
                        </Typography>
                      )}
                      
                      {workout?.type === 'test' && (
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: theme.palette.warning.main,
                            fontWeight: 'bold',
                            fontSize: isMobile ? '0.5rem' : '0.6rem'
                          }}
                        >
                          TEST
                        </Typography>
                      )}
                      
                      {!workout && isCurrentMonth && isWithinProgram(date) && (
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: theme.palette.success.main,
                            fontWeight: 'bold',
                            fontSize: isMobile ? '0.5rem' : '0.6rem'
                          }}
                        >
                          RIPOSO
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
                
                {workout && !isMobile && (
                  <Box 
                    sx={{ 
                      mt: 0.5, 
                      fontSize: '0.675rem', 
                      borderRadius: 1,
                      px: 0.5,
                      py: 0.25,
                      backgroundColor: workout.type === 'workout' 
                        ? alpha(theme.palette.error.main, 0.1)
                        : workout.type === 'test'
                          ? alpha(theme.palette.warning.main, 0.1)
                          : alpha(theme.palette.success.main, 0.1)
                    }}
                  >
                    {workout.code}
                  </Box>
                )}
              </Paper>
            </Grid>
          );
        })}
      </Grid>
      
      {/* Sezione per le fasi */}
      {program && selectedPhase && (
        <Box sx={{ mt: 4 }}>
          <Typography 
            variant={isMobile ? "subtitle2" : "subtitle1"} 
            sx={{ fontWeight: 'bold', mb: 1 }}
          >
            Fasi del Programma
          </Typography>
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 1, 
              flexWrap: 'wrap',
              justifyContent: isMobile ? 'center' : 'flex-start',
            }}
          >
            {program.phases?.map((phase) => (
              <Button 
                key={phase.id}
                variant={selectedPhase && selectedPhase.id === phase.id ? "contained" : "outlined"}
                color="primary"
                size={isMobile ? "small" : "medium"}
                onClick={() => onPhaseSelect(phase)}
                sx={{ 
                  borderRadius: 4,
                  textTransform: 'none',
                  px: isMobile ? 1.5 : 2,
                  py: isMobile ? 0.5 : 1,
                  fontSize: isMobile ? '0.75rem' : 'inherit',
                  minWidth: isMobile ? '70px' : 'auto',
                  fontWeight: selectedPhase && selectedPhase.id === phase.id ? 'bold' : 'normal',
                  boxShadow: selectedPhase && selectedPhase.id === phase.id ? 3 : 0,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 2
                  },
                  minHeight: isMobile ? '36px' : 'auto', // Garantisce un touch target adeguato
                  marginBottom: isMobile ? 1 : 0
                }}
              >
                {phase.name}
              </Button>
            ))}
          </Box>
          
          {/* Descrizione della fase selezionata */}
          <Paper 
            elevation={0} 
            sx={{ 
              mt: 2, 
              p: isMobile ? 1.5 : 2, 
              backgroundColor: alpha(theme.palette.secondary.main, 0.05),
              border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
              borderRadius: 2
            }}
          >
            <Typography 
              variant={isMobile ? "subtitle2" : "subtitle1"} 
              fontWeight="bold" 
              gutterBottom
            >
              {selectedPhase?.name}
            </Typography>
            
            {selectedPhase?.name === "Prep Phase" ? (
              <>
                <Typography variant="body2" paragraph>
                  <strong>Preparazione Fondamentale al Programma</strong> - La Prep Phase è la fase preparatoria cruciale {isMobile ? 'per costruire solide basi prima delle fasi più intense.' : 'specificamente per costruire una base solida prima di affrontare gli allenamenti più intensi che seguiranno. Questa fase non solo abitua il corpo al carico di lavoro ma stabilisce anche i modelli di movimento corretti che saranno fondamentali nelle fasi successive.'}
                </Typography>
                {!isMobile && (
                  <Typography variant="body2" paragraph>
                    Durante la Prep Phase, l'intensità è deliberatamente moderata e l'accento è posto sulla tecnica e sulla forma corretta, piuttosto che sulla prestazione massimale. È un periodo in cui si stabiliscono le fondamenta per i progressi futuri attraverso un'attenta progressione degli esercizi.
                  </Typography>
                )}
                {!isMobile && (
                  <Typography variant="body2" paragraph>
                    Secondo l'approccio del programma Cali Move, sia nella versione "Basics" che "PRO", la corretta esecuzione della Prep Phase è considerata essenziale per prevenire infortuni e costruire una base di forza equilibrata. Senza questa fase, molti praticanti tendono a progredire troppo rapidamente, sviluppando squilibri muscolari e limitando i loro risultati a lungo termine.
                  </Typography>
                )}
                <Typography variant="body2">
                  <strong>La Prep Phase include elementi chiave:</strong>
                </Typography>
                <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                  <Typography component="li" variant="body2" paragraph>
                    <strong>Esercizi fondamentali:</strong> {isMobile ? 'Pike Walk, Lunge, Bridge Raise e altri esercizi basilari.' : 'Pike Walk (per la mobilità delle spalle e hamstring), Lunge Variations (per la forza e la stabilità degli arti inferiori), Easy Bridge Raise (per la mobilità della colonna vertebrale), Prone Arm Circles & Swimmers (per il controllo delle scapole), Horizontal Pull (per la forza della schiena), Horizontal Push (per lo sviluppo del petto e delle spalle), Glute Ham Raise (per rafforzare i muscoli posteriori della coscia), Hollow Body Crunch (per la forza del core), Squat Variations (per lo sviluppo degli arti inferiori), Candle Raise (per l\'equilibrio e la forza addominale), e Plank (per la stabilità del core).'}
                  </Typography>
                  <Typography component="li" variant="body2" paragraph>
                    <strong>Test Week:</strong> {isMobile ? 'Settimana iniziale di valutazione per personalizzare il programma.' : 'All\'inizio della Prep Phase è prevista una settimana di test specificamente progettata per valutare il livello di partenza e personalizzare il programma in base alle capacità individuali. Durante questa settimana vengono stabiliti i punti di riferimento per misurare i progressi futuri e identificare i punti di forza e debolezza su cui lavorare. I test includono valutazioni di forza, mobilità e resistenza che saranno ripetuti periodicamente.'}
                  </Typography>
                  {!isMobile && (
                    <>
                      <Typography component="li" variant="body2" paragraph>
                        <strong>Settimane di allenamento strutturate:</strong> Le settimane successive alla Test Week sono organizzate con diversi allenamenti complementari (Capi A/B/C/D, Circ A/B/C/D, Lact A/B). La programmazione alterna strategicamente giorni di allenamento e giorni di recupero per massimizzare i risultati e prevenire il sovrallenamento, un aspetto fondamentale spesso trascurato dai principianti.
                      </Typography>
                      <Typography component="li" variant="body2">
                        <strong>Progressione graduale dell'intensità:</strong> Durante la Prep Phase, il volume e l'intensità degli allenamenti aumentano progressivamente, permettendo al corpo di adattarsi e sviluppare non solo forza muscolare ma anche resistenza dei tendini e dei legamenti, riducendo significativamente il rischio di infortuni nelle fasi successive del programma.
                      </Typography>
                    </>
                  )}
                </Box>
              </>
            ) : selectedPhase?.name === "Phase 1" ? (
              <>
                <Typography variant="body2" paragraph>
                  <strong>Costruzione delle Basi di Forza</strong> - La Phase 1 rappresenta il primo blocco fondamentale del programma completo, {isMobile ? 'focalizzato sull\'aumento sistematico di forza e resistenza.' : 'dove si inizia ad aumentare sistematicamente la forza e la resistenza muscolare. Questa fase è strategicamente progettata per sviluppare una solida base di forza, migliorare la mobilità articolare e aumentare la resistenza muscolare in modo metodico e progressivo.'}
                </Typography>
                {!isMobile && (
                  <Typography variant="body2" paragraph>
                    Durante la Phase 1, gli allenamenti diventano progressivamente più impegnativi, introducendo variazioni di esercizi base come push-up, pull-up e squat con livelli crescenti di difficoltà. Un elemento distintivo di questa fase è l'enfasi sull'apprendimento corretto dei pattern di movimento, che serve sia per massimizzare i risultati che per prevenire infortuni nelle fasi più avanzate del programma.
                  </Typography>
                )}
                {!isMobile && (
                  <Typography variant="body2" paragraph>
                    A differenza della Prep Phase che ha un carattere generale, la Phase 1 inizia a indirizzare l'allenamento verso gli obiettivi specifici del programma. In questa fase si iniziano a vedere cambiamenti fisici tangibili, con un notevole aumento della forza funzionale e un miglioramento della composizione corporea. L'importanza di completare adeguatamente questa fase non può essere sottovalutata, in quanto pone le basi per tutte le fasi successive.
                  </Typography>
                )}
                <Typography variant="body2">
                  <strong>Elementi distintivi della Phase 1:</strong>
                </Typography>
                <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                  <Typography component="li" variant="body2" paragraph>
                    <strong>Progressione graduale e sistematica:</strong> {isMobile ? 'Aumento pianificato di intensità e volume di allenamento.' : "La Phase 1 implementa un aumento pianificato dell'intensità e del volume di allenamento, seguendo il principio del sovraccarico progressivo. Questo approccio scientifico assicura che il corpo continui ad adattarsi e migliorare senza raggiungere il plateau o il sovrallenamento."}
                  </Typography>
                  <Typography component="li" variant="body2" paragraph>
                    <strong>Focus sulla tecnica e sull'esecuzione:</strong> {isMobile ? 'Priorità al perfezionamento dei movimenti fondamentali.' : "In questa fase viene data priorità al perfezionamento dei movimenti fondamentali, con particolare attenzione alla postura, all'allineamento e all'attivazione muscolare corretta. L'esecuzione precisa degli esercizi è considerata più importante del carico o delle ripetizioni in questa fase."}
                  </Typography>
                  {!isMobile && (
                    <>
                      <Typography component="li" variant="body2" paragraph>
                        <strong>Allenamenti diversificati e bilanciati:</strong> {"La Phase 1 introduce una combinazione strategica di esercizi per lo sviluppo equilibrato della forza, la mobilità e la resistenza. Gli allenamenti sono strutturati per lavorare su tutti i gruppi muscolari principali, evitando squilibri che potrebbero portare a problemi posturali o infortuni."}
                      </Typography>
                      <Typography component="li" variant="body2">
                        <strong>Preparazione neuromuscolare avanzata:</strong> {"Oltre allo sviluppo muscolare, questa fase pone le basi per una migliore connessione mente-muscolo, essenziale per gli esercizi più complessi delle fasi successive. Questo allenamento neuromuscolare migliora la coordinazione, la stabilità e l'efficienza del movimento."}
                      </Typography>
                    </>
                  )}
                </Box>
              </>
            ) : selectedPhase?.name === "Phase 2" ? (
              <>
                <Typography variant="body2" paragraph>
                  <strong>Sviluppo di Forza Avanzata e Controllo del Movimento</strong> - La Phase 2 segna un significativo salto di qualità nell'intensità e nella complessità degli allenamenti, costruendo sulle fondamenta stabilite nelle fasi precedenti. In questa fase, gli esercizi diventano notevolmente più impegnativi, richiedendo maggiore forza, controllo del corpo e resistenza muscolare.
                </Typography>
                <Typography variant="body2" paragraph>
                  La Phase 2 rappresenta un punto di svolta nel programma, dove gli esercizi elementari evolvono in varianti più complesse e l'integrazione di nuovi pattern di movimento richiede un livello superiore di controllo neuromuscolare. L'obiettivo principale è sviluppare una forza funzionale avanzata e migliorare il controllo del corpo in posizioni e movimenti più impegnativi.
                </Typography>
                <Typography variant="body2" paragraph>
                  Una caratteristica distintiva di questa fase è l'introduzione di esercizi che richiedono un'elevata stabilizzazione del core e delle articolazioni. Questo non solo costruisce forza visibile ma sviluppa anche una robusta stabilità interna che servirà come base per gli elementi più avanzati delle fasi successive. In questa fase molti praticanti notano miglioramenti sostanziali nella loro composizione corporea e nelle loro capacità atletiche.
                </Typography>
                <Typography variant="body2">
                  <strong>Caratteristiche principali della Phase 2:</strong>
                </Typography>
                <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                  <Typography component="li" variant="body2" paragraph>
                    <strong>Progressioni avanzate degli esercizi fondamentali:</strong> In questa fase, gli esercizi base come push-up, pull-up, dip e squat evolvono in varianti più complesse come archer push-up, muscle-up transition, advanced dip variation e pistol squat progression. Queste progressioni più impegnative stimolano una maggiore ipertrofia muscolare e forza funzionale.
                  </Typography>
                  <Typography component="li" variant="body2" paragraph>
                    <strong>Introduzione di elementi isometrici avanzati:</strong> La Phase 2 integra posizioni statiche impegnative come advanced tuck planche, advanced front lever, e handstand progression. Questi elementi isometrici sviluppano una straordinaria forza di tenuta e controllo posturale, elementi fondamentali per qualsiasi atleta di calisthenics avanzato.
                  </Typography>
                  <Typography component="li" variant="body2" paragraph>
                    <strong>Allenamento esplosivo e pliometrico:</strong> Vengono introdotti elementi di allenamento esplosivo come explosive pull-up, plyometric push-up e jump variations. Questi movimenti migliorano la potenza muscolare, la reattività del sistema nervoso e preparano il corpo per elementi più dinamici nelle fasi successive.
                  </Typography>
                  <Typography component="li" variant="body2">
                    <strong>Periodizzazione strategica dell'allenamento:</strong> La Phase 2 implementa cicli di carico e recupero più sofisticati, con variazioni pianificate dell'intensità e del volume per ottimizzare gli adattamenti muscolari e prevenire il sovrallenamento. Questo approccio scientifico assicura progressi costanti anche quando la difficoltà degli esercizi aumenta significativamente.
                  </Typography>
                </Box>
              </>
            ) : selectedPhase?.name === "Phase 3" ? (
              <>
                <Typography variant="body2" paragraph>
                  <strong>Consolidamento Avanzato e Specializzazione</strong> - La Phase 3 rappresenta un livello di allenamento estremamente avanzato riservato a chi ha completato con successo le fasi precedenti. In questa fase, l'intensità degli allenamenti raggiunge livelli molto elevati, richiedendo non solo forza e resistenza eccezionali, ma anche una profonda comprensione della biomeccanica del movimento.
                </Typography>
                <Typography variant="body2" paragraph>
                  Ciò che distingue la Phase 3 dalle precedenti è l'introduzione di esercizi e combinazioni di movimenti che richiedono un controllo completo del corpo e un elevato livello di competenza tecnica. Gli allenamenti in questa fase sono progettati per portare il praticante vicino al suo potenziale massimo, stimolando adattamenti muscolari e neurologici avanzati.
                </Typography>
                <Typography variant="body2" paragraph>
                  Un aspetto fondamentale della Phase 3 è la personalizzazione dell'allenamento in base ai punti di forza e di debolezza individuali identificati nelle fasi precedenti. Questo approccio mirato consente di affrontare specificamente le aree che necessitano di miglioramento, garantendo uno sviluppo equilibrato e completo. Gli atleti che raggiungono questa fase spesso notano non solo miglioramenti nelle loro capacità fisiche, ma anche una maggiore consapevolezza corporea e controllo del movimento.
                </Typography>
                <Typography variant="body2">
                  <strong>Aspetti distintivi della Phase 3:</strong>
                </Typography>
                <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                  <Typography component="li" variant="body2" paragraph>
                    <strong>Tecniche di allenamento altamente specializzate:</strong> La Phase 3 introduce metodologie di allenamento sofisticate come cluster sets, onde di carico, e super-sets strategici che ottimizzano lo stimolo muscolare e neurale. Queste tecniche avanzate sono progettate per superare i plateau e continuare a stimolare adattamenti anche in atleti molto allenati.
                  </Typography>
                  <Typography component="li" variant="body2" paragraph>
                    <strong>Elementi di forza estrema e controllo:</strong> In questa fase si affrontano esercizi che richiedono forza e controllo eccezionali, come full planche progressions, straddle front lever, one arm chin-up preparation, e handstand push-up variations. Questi elementi rappresentano il vertice della forza relativa al peso corporeo nel calisthenics.
                  </Typography>
                  <Typography component="li" variant="body2" paragraph>
                    <strong>Integrazione di elementi dinamici complessi:</strong> La Phase 3 incorpora movimenti dinamici sofisticati come muscle-up variations, advanced tumbling elements, e human flag progressions. Questi elementi combinano forza, coordinazione e controllo in movimenti fluidi ed esteticamente impressionanti.
                  </Typography>
                  <Typography component="li" variant="body2">
                    <strong>Programmazione personalizzata e monitoraggio avanzato:</strong> A questo livello, il programma implementa un sistema sofisticato di monitoraggio del volume, intensità e fatica, con aggiustamenti continui in base alle risposte individuali. Questo approccio scientifico all'allenamento consente di massimizzare i risultati minimizzando il rischio di sovrallenamento, particolarmente importante data l'elevata intensità degli esercizi in questa fase.
                  </Typography>
                </Box>
              </>
            ) : selectedPhase?.name === "Phase 4" ? (
              <>
                <Typography variant="body2" paragraph>
                  <strong>Padronanza Completa e Performance di Elite</strong> - La Phase 4 rappresenta il culmine del programma di allenamento, riservata esclusivamente a chi ha completato con successo tutte le fasi precedenti e ha raggiunto un livello di preparazione fisica eccezionale. Questa fase finale è progettata per portare a una padronanza completa del corpo e delle tecniche di allenamento, spingendo le capacità fisiche ai massimi livelli possibili.
                </Typography>
                <Typography variant="body2" paragraph>
                  In questa fase, gli allenamenti raggiungono i livelli più alti di intensità, complessità e specializzazione dell'intero programma. La Phase 4 non è semplicemente un'estensione delle fasi precedenti, ma un vero e proprio culmine che integra tutti gli aspetti dell'allenamento in un sistema coeso e altamente sofisticato. Gli esercizi e i protocolli di allenamento a questo livello richiedono non solo una forza straordinaria, ma anche una profonda comprensione della biomeccanica, della gestione dell'energia e delle tecniche avanzate di recupero.
                </Typography>
                <Typography variant="body2" paragraph>
                  Solo una piccola percentuale di chi inizia il programma completo raggiunge la Phase 4, che rappresenta un livello di allenamento paragonabile a quello degli atleti professionisti. I praticanti che arrivano a questa fase hanno sviluppato non solo un fisico eccezionalmente forte e funzionale, ma anche una profonda conoscenza teorica e pratica dell'allenamento. Molti di coloro che completano la Phase 4 sono in grado di eseguire elementi di forza avanzati che solo una frazione molto piccola della popolazione può realizzare.
                </Typography>
                <Typography variant="body2">
                  <strong>Elementi esclusivi della Phase 4:</strong>
                </Typography>
                <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                  <Typography component="li" variant="body2" paragraph>
                    <strong>Padronanza di elementi di forza superiore:</strong> La Phase 4 comprende la padronanza di elementi di forza di livello elite come full planche, full front lever, one arm pull-up, one arm push-up, e handstand push-up avanzati. Questi elementi rappresentano l'apice della forza relativa al peso corporeo e richiedono anni di allenamento progressivo per essere padroneggiati.
                  </Typography>
                  <Typography component="li" variant="body2" paragraph>
                    <strong>Integrazione di sequenze dinamiche complesse:</strong> A questo livello si introducono combinazioni fluide di elementi statici e dinamici, creando sequenze che richiedono non solo forza ma anche un controllo motorio preciso e una perfetta coordinazione. Queste sequenze combinano elementi come muscle-up to handstand, planche to front lever transitions, e altre combinazioni avanzate che dimostrano una padronanza completa del corpo.
                  </Typography>
                  <Typography component="li" variant="body2" paragraph>
                    <strong>Periodizzazione ultra-specializzata:</strong> La Phase 4 implementa sistemi di periodizzazione altamente sofisticati, con cicli di intensità variabile accuratamente calibrati per massimizzare i guadagni mentre si previene il sovrallenamento. Questi protocolli sono personalizzati in base alle risposte individuali dell'atleta e adattati continuamente in base alle prestazioni e ai feedback.
                  </Typography>
                  <Typography component="li" variant="body2">
                    <strong>Tecniche di recupero e ottimizzazione avanzate:</strong> Data l'estrema intensità degli allenamenti, la Phase 4 pone un'enfasi particolare su tecniche avanzate di recupero come protocolli di respirazione specifici, tecniche di rilascio miofasciale, immersione in acqua fredda, e strategie nutrizionali periodizzate. Queste tecniche complementari sono fondamentali per supportare il volume e l'intensità dell'allenamento a questo livello elite.
                  </Typography>
                </Box>
              </>
            ) : (
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                Seleziona una fase per visualizzare informazioni dettagliate sul suo contenuto e obiettivi.
              </Typography>
            )}
          </Paper>
        </Box>
      )}
      
      {/* Sezione per le settimane */}
      <Box sx={{ mt: 3 }}>
        {selectedPhase && (
          <Typography 
            variant={isMobile ? "subtitle2" : "subtitle1"} 
            sx={{ fontWeight: 'bold', mb: 1 }}
          >
            Settimane della {selectedPhase?.name}
          </Typography>
        )}
        
        {/* Vista Mobile: Settimane come selettore compatto */}
        {isMobile && selectedPhase && selectedPhase.weeks && selectedPhase.weeks.length > 0 && (
          <Box sx={{ overflowX: 'auto', pb: 1 }}>
            <Box sx={{ 
              display: 'flex',
              gap: 1,
              flexWrap: 'nowrap',
              padding: '4px 0'
            }}>
              {selectedPhase.weeks
                .sort((a, b) => a.weekNumber - b.weekNumber)
                .map((week) => (
                  <Button
                    key={week.id}
                    variant={selectedWeek?.id === week.id ? "contained" : "outlined"}
                    color="primary"
                    size="small"
                    onClick={() => onWeekSelect(week)}
                    sx={{
                      minWidth: '60px',
                      height: '36px', // Garantisce un touch target adeguato
                      borderRadius: '18px',
                      textTransform: 'none',
                      fontSize: '0.7rem',
                      whiteSpace: 'nowrap',
                      boxShadow: selectedWeek?.id === week.id ? 2 : 0,
                      backgroundColor: selectedWeek?.id === week.id 
                        ? theme.palette.primary.main 
                        : alpha(theme.palette.primary.main, 0.05),
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 1
                      }
                    }}
                  >
                    W{week.weekNumber}
                  </Button>
                ))
              }
            </Box>
          </Box>
        )}
        
        {/* Vista Desktop: Settimane come cards */}
        {!isMobile && selectedPhase && selectedPhase.weeks && selectedPhase.weeks.length > 0 && (
          <Grid container spacing={2}>
            {selectedPhase.weeks
              .sort((a, b) => a.weekNumber - b.weekNumber)
              .map((week) => (
                <Grid item xs={6} sm={4} md={3} key={week.id}>
                  <Card 
                    onClick={() => onWeekSelect(week)}
                    raised={selectedWeek?.id === week.id}
                    sx={{
                      cursor: 'pointer',
                      borderRadius: 2,
                      border: selectedWeek?.id === week.id 
                        ? `2px solid ${theme.palette.primary.main}` 
                        : '1px solid #e0e0e0',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 3,
                        borderColor: theme.palette.primary.main
                      }
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Settimana {week.weekNumber}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {week.name || `Week ${week.weekNumber}`}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                          {week.days.filter(d => d.type === 'workout').length} allenamenti
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            }
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default WorkoutCalendar;
