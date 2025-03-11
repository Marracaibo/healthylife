export interface MealTemplate {
  id: string;
  name: string;
  description: string;
  dailyCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  meals: {
    name: string;
    foods: Array<{
      name: string;
      amount: string;
      calories: number;
    }>;
  }[];
}

export const mealTemplates: MealTemplate[] = [
  {
    id: 'mediterranean',
    name: 'Dieta Mediterranea',
    description: 'Piano alimentare basato sulla dieta mediterranea tradizionale',
    dailyCalories: 1950,
    macros: {
      protein: 20,
      carbs: 55,
      fat: 25
    },
    meals: [
      {
        name: 'Colazione',
        foods: [
          { name: 'Yogurt greco', amount: '150g', calories: 150 },
          { name: 'Miele', amount: '1 cucchiaino', calories: 30 },
          { name: 'Frutta fresca', amount: '1 porzione', calories: 60 },
          { name: 'Pane integrale', amount: '2 fette', calories: 160 }
        ]
      },
      {
        name: 'Pranzo',
        foods: [
          { name: 'Pasta integrale', amount: '80g', calories: 280 },
          { name: 'Pomodorini', amount: '100g', calories: 20 },
          { name: 'Olio extravergine', amount: '1 cucchiaio', calories: 120 },
          { name: 'Insalata mista', amount: '100g', calories: 20 }
        ]
      },
      {
        name: 'Cena',
        foods: [
          { name: 'Pesce azzurro', amount: '150g', calories: 200 },
          { name: 'Verdure grigliate', amount: '200g', calories: 70 },
          { name: 'Olio extravergine', amount: '1 cucchiaio', calories: 120 }
        ]
      },
      {
        name: 'Snacks/Altro',
        foods: [
          { name: 'Frutta secca', amount: '30g', calories: 180 },
          { name: 'Frutta fresca', amount: '1 porzione', calories: 60 }
        ]
      }
    ]
  },
  {
    id: 'protein',
    name: 'Dieta Iperproteica',
    description: 'Piano alimentare ad alto contenuto proteico per sportivi',
    dailyCalories: 2200,
    macros: {
      protein: 40,
      carbs: 40,
      fat: 20
    },
    meals: [
      {
        name: 'Colazione',
        foods: [
          { name: 'Albumi', amount: '200g', calories: 100 },
          { name: 'Avena', amount: '50g', calories: 180 },
          { name: 'Proteine in polvere', amount: '30g', calories: 120 }
        ]
      },
      {
        name: 'Pranzo',
        foods: [
          { name: 'Petto di pollo', amount: '200g', calories: 330 },
          { name: 'Riso basmati', amount: '70g', calories: 250 },
          { name: 'Broccoli', amount: '200g', calories: 70 }
        ]
      },
      {
        name: 'Cena',
        foods: [
          { name: 'Salmone', amount: '150g', calories: 300 },
          { name: 'Quinoa', amount: '60g', calories: 220 },
          { name: 'Spinaci', amount: '150g', calories: 35 }
        ]
      },
      {
        name: 'Snacks/Altro',
        foods: [
          { name: 'Yogurt greco', amount: '170g', calories: 130 },
          { name: 'Banana', amount: '1 media', calories: 105 },
          { name: 'Mandorle', amount: '30g', calories: 180 }
        ]
      }
    ]
  }
];

export default mealTemplates;
