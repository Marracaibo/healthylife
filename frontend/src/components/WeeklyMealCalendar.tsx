import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput, EventClickArg } from '@fullcalendar/core';
import { Box, useTheme, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

interface Food {
  name: string;
  amount: string;
  calories: number;
}

interface Meal {
  type: string;
  time: string;
  foods: Food[];
}

interface DayPlan {
  date: string;
  meals: Meal[];
}

interface MealPlan {
  name: string;
  days: DayPlan[];
}

interface Props {
  mealPlan?: MealPlan;
  onMealSelect?: (meal: Meal) => void;
  readOnly?: boolean;
}

const WeeklyMealCalendar: React.FC<Props> = ({
  mealPlan,
  onMealSelect,
  readOnly = false
}) => {
  const theme = useTheme();
  const [events, setEvents] = useState<EventInput[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (mealPlan) {
      const newEvents: EventInput[] = [];
      
      mealPlan.days.forEach(day => {
        day.meals.forEach(meal => {
          const [hours, minutes] = meal.time.split(':');
          const start = new Date(day.date);
          start.setHours(parseInt(hours), parseInt(minutes));
          
          const totalCalories = meal.foods.reduce((sum, food) => sum + food.calories, 0);
          
          newEvents.push({
            title: `${meal.type} (${totalCalories} cal)`,
            start,
            end: new Date(start.getTime() + 30 * 60000), // 30 minutes duration
            extendedProps: { meal },
            backgroundColor: getColorForMealType(meal.type),
          });
        });
      });
      
      setEvents(newEvents);
    }
  }, [mealPlan]);

  const getColorForMealType = (type: string): string => {
    const colors: { [key: string]: string } = {
      breakfast: theme.palette.primary.light,
      lunch: theme.palette.secondary.light,
      dinner: theme.palette.success.light,
      morning_snack: theme.palette.info.light,
      afternoon_snack: theme.palette.warning.light,
    };
    return colors[type] || theme.palette.grey[400];
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const meal = clickInfo.event.extendedProps.meal as Meal;
    setSelectedMeal(meal);
    setIsDialogOpen(true);
    if (onMealSelect) {
      onMealSelect(meal);
    }
  };

  return (
    <Box sx={{ height: 'calc(100vh - 200px)', p: 2 }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridWeek,timeGridDay'
        }}
        events={events}
        eventClick={handleEventClick}
        editable={!readOnly}
        selectable={!readOnly}
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
      />
      
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedMeal?.type.charAt(0).toUpperCase() + selectedMeal?.type.slice(1).replace('_', ' ')} - {selectedMeal?.time}
        </DialogTitle>
        <DialogContent>
          {selectedMeal && (
            <>
              <Typography variant="h6" gutterBottom>
                Calorie totali: {selectedMeal.foods.reduce((sum, food) => sum + food.calories, 0)} kcal
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Alimenti:
              </Typography>
              {selectedMeal.foods.map((food, index) => (
                <Typography key={index} variant="body1">
                  • {food.name} - {food.calories} kcal
                </Typography>
              ))}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Chiudi</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WeeklyMealCalendar;
