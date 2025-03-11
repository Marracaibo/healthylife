import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  IconButton, 
  Grid, 
  Badge, 
  useTheme,
  Tooltip
} from '@mui/material';
import { 
  ChevronLeft, 
  ChevronRight,
  LocalDining
} from '@mui/icons-material';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameMonth, 
  isSameDay, 
  isToday, 
  addMonths,
  getDay
} from 'date-fns';
import { it } from 'date-fns/locale';
import { styled } from '@mui/material/styles';

interface MonthlyCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  mealsData?: {
    date: string;
    mealsCount: number;
  }[];
}

const CalendarContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 16,
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  backgroundColor: theme.palette.background.paper,
  overflow: 'hidden',
  marginBottom: theme.spacing(3)
}));

const CalendarHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(2)
}));

const DayCell = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isCurrentMonth' && prop !== 'isSelected' && prop !== 'isCurrentDay'
})<{ isCurrentMonth?: boolean; isSelected?: boolean; isCurrentDay?: boolean }>(
  ({ theme, isCurrentMonth, isSelected, isCurrentDay }) => ({
    height: 40,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    borderRadius: '50%',
    position: 'relative',
    fontWeight: isCurrentDay ? 600 : isCurrentMonth ? 400 : 300,
    color: !isCurrentMonth 
      ? theme.palette.text.disabled 
      : isSelected 
        ? theme.palette.common.white 
        : isCurrentDay 
          ? theme.palette.primary.main 
          : theme.palette.text.primary,
    backgroundColor: isSelected 
      ? theme.palette.primary.main 
      : isCurrentDay 
        ? 'rgba(46, 125, 50, 0.1)' 
        : 'transparent',
    '&:hover': {
      backgroundColor: isSelected 
        ? theme.palette.primary.dark 
        : 'rgba(0, 0, 0, 0.04)'
    }
  })
);

const WeekdayHeader = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  color: theme.palette.text.secondary,
  fontWeight: 500,
  fontSize: '0.875rem',
  padding: theme.spacing(1, 0)
}));

const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({ 
  selectedDate, 
  onDateSelect,
  mealsData = []
}) => {
  const theme = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);

  // Genera i giorni del calendario per il mese corrente
  useEffect(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days: Date[] = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    setCalendarDays(days);
  }, [currentMonth]);

  // Gestisci il cambio del mese
  const handlePrevMonth = () => {
    setCurrentMonth(addMonths(currentMonth, -1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Controlla se un giorno ha pasti pianificati
  const getMealsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayData = mealsData.find(d => d.date === dateStr);
    return dayData ? dayData.mealsCount : 0;
  };

  // Crea le righe del calendario (6 righe di 7 giorni ciascuna)
  const renderCalendarCells = () => {
    const rows = [];
    const days = [...calendarDays];

    while (days.length > 0) {
      rows.push(days.splice(0, 7));
    }

    return rows.map((week, weekIndex) => (
      <Grid container key={`week-${weekIndex}`} spacing={0}>
        {week.map((day, dayIndex) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelectedDay = isSameDay(day, selectedDate);
          const isCurrentDay = isToday(day);
          const mealsCount = getMealsForDay(day);

          return (
            <Grid item xs={12/7} key={`day-${dayIndex}`} sx={{ aspectRatio: '1/1', p: 0.5 }}>
              <Box sx={{ position: 'relative', height: '100%' }}>
                <DayCell
                  isCurrentMonth={isCurrentMonth}
                  isSelected={isSelectedDay}
                  isCurrentDay={isCurrentDay}
                  onClick={() => onDateSelect(day)}
                >
                  {format(day, 'd')}
                </DayCell>
                
                {mealsCount > 0 && (
                  <Tooltip title={`${mealsCount} pasti pianificati`}>
                    <Badge
                      color="primary"
                      badgeContent={mealsCount}
                      sx={{
                        position: 'absolute',
                        bottom: -2,
                        right: '50%',
                        transform: 'translateX(50%)'
                      }}
                    >
                      <LocalDining sx={{ fontSize: 0 }} />
                    </Badge>
                  </Tooltip>
                )}
              </Box>
            </Grid>
          );
        })}
      </Grid>
    ));
  };

  // Intestazioni dei giorni della settimana
  const weekDays = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

  return (
    <CalendarContainer>
      <CalendarHeader>
        <IconButton onClick={handlePrevMonth} size="small">
          <ChevronLeft />
        </IconButton>
        
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          {format(currentMonth, 'MMMM yyyy', { locale: it })}
        </Typography>
        
        <IconButton onClick={handleNextMonth} size="small">
          <ChevronRight />
        </IconButton>
      </CalendarHeader>

      <Grid container spacing={0}>
        {weekDays.map((day, index) => (
          <Grid item xs={12/7} key={`weekday-${index}`}>
            <WeekdayHeader>{day}</WeekdayHeader>
          </Grid>
        ))}
      </Grid>

      {renderCalendarCells()}
    </CalendarContainer>
  );
};

export default MonthlyCalendar;
