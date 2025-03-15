export interface MonthlyMealTemplate {
  id: string;
  name: string;
  description: string;
  dailyCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  goal?: string; // Obiettivo del piano alimentare
  dietaryRestrictions?: string[]; // Restrizioni alimentari
  guidelines: {
    title: string;
    content: string;
  }[];
  days: {
    meals: {
      name: string;
      time: string;
      foods: Array<{
        name: string;
        quantity: number | string;
        unit: string;
        calories: number;
      }>;
    }[];
  }[];
  variations: {
    category: string;
    options: Array<{
      name: string;
      quantity: string;
      calories: number;
    }>;
  }[];
}

export const monthlyMealTemplates: MonthlyMealTemplate[] = [
  {
    id: 'mediterranean-monthly',
    name: 'Dieta Mediterranea Mensile',
    description: 'Piano alimentare completo basato sulla dieta mediterranea tradizionale con variazioni per un mese',
    dailyCalories: 1950,
    macros: {
      protein: 18,
      carbs: 53,
      fat: 29
    },
    guidelines: [
      {
        title: 'Dati di Base',
        content: 'Metabolismo basale stimato: 1815 kcal\nFabbisogno calorico totale: 2530 kcal\nDieta ipocalorica per dimagrimento: 1950 kcal\nFabbisogno idrico: 2,5 litri al giorno'
      },
      {
        title: 'Linee Guida Generali',
        content: '- Mantenere un\'alimentazione varia ed equilibrata\n- Preferire cibi freschi e di stagione\n- Limitare il consumo di cibi processati e ricchi di zuccheri semplici\n- Bere almeno 2 litri di acqua al giorno\n- Consumare 5 porzioni di frutta e verdura al giorno'
      }
    ],
    days: [
      {
        meals: [
          {
            name: 'Colazione',
            time: '07:30',
            foods: [
              {
                name: 'Yogurt greco',
                quantity: 150,
                unit: 'g',
                calories: 135
              },
              {
                name: 'Fiocchi d\'avena',
                quantity: 30,
                unit: 'g',
                calories: 110
              },
              {
                name: 'Miele',
                quantity: 10,
                unit: 'g',
                calories: 30
              },
              {
                name: 'Frutta fresca',
                quantity: 100,
                unit: 'g',
                calories: 50
              }
            ]
          },
          {
            name: 'Spuntino',
            time: '10:30',
            foods: [
              {
                name: 'Frutta secca mista',
                quantity: 20,
                unit: 'g',
                calories: 120
              }
            ]
          },
          {
            name: 'Pranzo',
            time: '13:00',
            foods: [
              {
                name: 'Pasta integrale',
                quantity: 70,
                unit: 'g',
                calories: 245
              },
              {
                name: 'Pomodorini',
                quantity: 100,
                unit: 'g',
                calories: 18
              },
              {
                name: 'Olio extravergine d\'oliva',
                quantity: 10,
                unit: 'g',
                calories: 90
              },
              {
                name: 'Insalata mista',
                quantity: 100,
                unit: 'g',
                calories: 25
              }
            ]
          },
          {
            name: 'Spuntino',
            time: '16:30',
            foods: [
              {
                name: 'Yogurt',
                quantity: 125,
                unit: 'g',
                calories: 70
              },
              {
                name: 'Frutta fresca',
                quantity: 100,
                unit: 'g',
                calories: 50
              }
            ]
          },
          {
            name: 'Cena',
            time: '20:00',
            foods: [
              {
                name: 'Petto di pollo',
                quantity: 120,
                unit: 'g',
                calories: 198
              },
              {
                name: 'Verdure grigliate',
                quantity: 200,
                unit: 'g',
                calories: 66
              },
              {
                name: 'Olio extravergine d\'oliva',
                quantity: 10,
                unit: 'g',
                calories: 90
              },
              {
                name: 'Pane integrale',
                quantity: 30,
                unit: 'g',
                calories: 80
              }
            ]
          }
        ]
      },
      {
        meals: [
          {
            name: 'Colazione',
            time: '07:30',
            foods: [
              {
                name: 'Pane integrale',
                quantity: 50,
                unit: 'g',
                calories: 130
              },
              {
                name: 'Ricotta',
                quantity: 50,
                unit: 'g',
                calories: 95
              },
              {
                name: 'Miele',
                quantity: 10,
                unit: 'g',
                calories: 30
              },
              {
                name: 'Frutta fresca',
                quantity: 100,
                unit: 'g',
                calories: 50
              }
            ]
          },
          {
            name: 'Spuntino',
            time: '10:30',
            foods: [
              {
                name: 'Frutta fresca',
                quantity: 150,
                unit: 'g',
                calories: 75
              }
            ]
          },
          {
            name: 'Pranzo',
            time: '13:00',
            foods: [
              {
                name: 'Riso integrale',
                quantity: 70,
                unit: 'g',
                calories: 252
              },
              {
                name: 'Legumi misti',
                quantity: 100,
                unit: 'g',
                calories: 120
              },
              {
                name: 'Olio extravergine d\'oliva',
                quantity: 10,
                unit: 'g',
                calories: 90
              },
              {
                name: 'Verdure cotte',
                quantity: 150,
                unit: 'g',
                calories: 45
              }
            ]
          }
        ]
      }
    ],
    variations: [
      {
        category: 'Colazioni Alternative',
        options: [
          {
            name: 'Porridge con frutti di bosco',
            quantity: '40g di fiocchi + 150g di frutti',
            calories: 220
          },
          {
            name: 'Toast integrale con avocado',
            quantity: '60g di pane + 50g di avocado',
            calories: 240
          },
          {
            name: 'Frullato proteico con banana',
            quantity: '250ml',
            calories: 200
          }
        ]
      },
      {
        category: 'Spuntini Salutari',
        options: [
          {
            name: 'Hummus con carote',
            quantity: '30g di hummus + 100g di carote',
            calories: 130
          },
          {
            name: 'Yogurt con miele e noci',
            quantity: '150g di yogurt + 10g di miele + 10g di noci',
            calories: 190
          },
          {
            name: 'Frutta secca mista',
            quantity: '25g',
            calories: 140
          }
        ]
      }
    ]
  },
  {
    id: 'protein-rich-monthly',
    name: 'Piano Mensile Ricco di Proteine',
    description: 'Piano alimentare mensile ad alto contenuto proteico ideale per chi pratica attività fisica intensa',
    dailyCalories: 2200,
    macros: {
      protein: 30,
      carbs: 40,
      fat: 30
    },
    guidelines: [
      {
        title: 'Dati di Base',
        content: 'Metabolismo basale stimato: 1900 kcal\nFabbisogno calorico totale: 2600 kcal\nDieta per supporto muscolare: 2200 kcal\nFabbisogno idrico: 3 litri al giorno'
      },
      {
        title: 'Linee Guida Generali',
        content: '- Consumare proteine ad ogni pasto\n- Preferire carboidrati complessi\n- Assumere grassi buoni da fonti come pesce, frutta secca e olio d\'oliva\n- Bere almeno 3 litri di acqua al giorno\n- Consumare verdure ad ogni pasto principale'
      }
    ],
    days: [
      {
        meals: [
          {
            name: 'Colazione',
            time: '07:00',
            foods: [
              {
                name: 'Uova',
                quantity: 2,
                unit: 'unità',
                calories: 156
              },
              {
                name: 'Pane integrale',
                quantity: 60,
                unit: 'g',
                calories: 150
              },
              {
                name: 'Avocado',
                quantity: 50,
                unit: 'g',
                calories: 80
              }
            ]
          },
          {
            name: 'Spuntino',
            time: '10:00',
            foods: [
              {
                name: 'Yogurt greco',
                quantity: 150,
                unit: 'g',
                calories: 135
              },
              {
                name: 'Frutti di bosco',
                quantity: 100,
                unit: 'g',
                calories: 45
              },
              {
                name: 'Proteine in polvere',
                quantity: 15,
                unit: 'g',
                calories: 60
              }
            ]
          },
          {
            name: 'Pranzo',
            time: '13:00',
            foods: [
              {
                name: 'Petto di pollo',
                quantity: 150,
                unit: 'g',
                calories: 248
              },
              {
                name: 'Riso basmati',
                quantity: 80,
                unit: 'g',
                calories: 280
              },
              {
                name: 'Verdure miste',
                quantity: 200,
                unit: 'g',
                calories: 70
              },
              {
                name: 'Olio extravergine d\'oliva',
                quantity: 10,
                unit: 'g',
                calories: 90
              }
            ]
          }
        ]
      }
    ],
    variations: [
      {
        category: 'Fonti Proteiche Alternative',
        options: [
          {
            name: 'Salmone',
            quantity: '150g',
            calories: 270
          },
          {
            name: 'Tofu',
            quantity: '150g',
            calories: 180
          },
          {
            name: 'Legumi misti',
            quantity: '150g',
            calories: 180
          }
        ]
      }
    ]
  }
];
