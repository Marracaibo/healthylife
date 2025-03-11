import { MealPlan } from '../pages/MealPlanner';

export const sampleMealPlans: MealPlan[] = [
  {
    id: 1001,
    name: "Piano Mediterraneo (Demo)",
    goal: "mantenimento",
    calories_target: 2000,
    macros: {
      protein: 25,
      carbs: 55,
      fat: 20
    },
    dietary_restrictions: [],
    days: [
      {
        date: new Date().toISOString().split('T')[0] + "T00:00:00.000Z",
        meals: [
          {
            name: "Colazione",
            time: "08:00",
            calories: 400,
            macros: {
              protein: 15,
              carbs: 60,
              fat: 25
            },
            ingredients: [
              {
                name: "Yogurt greco",
                amount: "150",
                unit: "g"
              },
              {
                name: "Muesli con frutta secca",
                amount: "40",
                unit: "g"
              },
              {
                name: "Miele",
                amount: "10",
                unit: "g"
              },
              {
                name: "Frutta fresca",
                amount: "100",
                unit: "g"
              }
            ],
            instructions: [
              "Versare lo yogurt in una ciotola",
              "Aggiungere il muesli e il miele",
              "Decorare con frutta fresca di stagione"
            ]
          },
          {
            name: "Spuntino",
            time: "10:30",
            calories: 150,
            macros: {
              protein: 5,
              carbs: 70,
              fat: 25
            },
            ingredients: [
              {
                name: "Mandorle",
                amount: "20",
                unit: "g"
              },
              {
                name: "Mela",
                amount: "1",
                unit: "intero"
              }
            ],
            instructions: [
              "Consumare la frutta fresca con una manciata di mandorle"
            ]
          },
          {
            name: "Pranzo",
            time: "13:00",
            calories: 650,
            macros: {
              protein: 30,
              carbs: 45,
              fat: 25
            },
            ingredients: [
              {
                name: "Pasta integrale",
                amount: "80",
                unit: "g"
              },
              {
                name: "Pomodorini",
                amount: "100",
                unit: "g"
              },
              {
                name: "Tonno al naturale",
                amount: "80",
                unit: "g"
              },
              {
                name: "Olive",
                amount: "10",
                unit: "g"
              },
              {
                name: "Olio extravergine d'oliva",
                amount: "10",
                unit: "ml"
              },
              {
                name: "Insalata mista",
                amount: "50",
                unit: "g"
              }
            ],
            instructions: [
              "Cuocere la pasta in acqua bollente salata",
              "In una padella, scaldare l'olio e aggiungere i pomodorini tagliati a metà",
              "Aggiungere il tonno sgocciolato e le olive",
              "Scolare la pasta e condirla con il sugo preparato",
              "Servire con insalata mista condita con un filo d'olio"
            ]
          },
          {
            name: "Spuntino",
            time: "16:30",
            calories: 200,
            macros: {
              protein: 15,
              carbs: 65,
              fat: 20
            },
            ingredients: [
              {
                name: "Yogurt greco",
                amount: "150",
                unit: "g"
              },
              {
                name: "Banana",
                amount: "1",
                unit: "media"
              }
            ],
            instructions: [
              "Consumare lo yogurt con la banana tagliata a pezzi"
            ]
          },
          {
            name: "Cena",
            time: "20:00",
            calories: 600,
            macros: {
              protein: 35,
              carbs: 40,
              fat: 25
            },
            ingredients: [
              {
                name: "Petto di pollo",
                amount: "150",
                unit: "g"
              },
              {
                name: "Patate",
                amount: "150",
                unit: "g"
              },
              {
                name: "Zucchine",
                amount: "100",
                unit: "g"
              },
              {
                name: "Olio extravergine d'oliva",
                amount: "15",
                unit: "ml"
              },
              {
                name: "Rosmarino",
                amount: "q.b.",
                unit: ""
              },
              {
                name: "Sale",
                amount: "q.b.",
                unit: ""
              }
            ],
            instructions: [
              "Tagliare il petto di pollo a fettine e condirlo con sale e rosmarino",
              "Cuocere il pollo su una piastra o in padella con poco olio",
              "Tagliare le patate a cubetti e le zucchine a rondelle",
              "Arrostire le verdure in forno con un filo d'olio, sale e rosmarino",
              "Servire il pollo con il contorno di verdure arrostite"
            ]
          }
        ]
      }
    ]
  },
  {
    id: 1002,
    name: "Piano Low Carb (Demo)",
    goal: "dimagrimento",
    calories_target: 1800,
    macros: {
      protein: 35,
      carbs: 25,
      fat: 40
    },
    dietary_restrictions: ["zuccheri aggiunti"],
    days: [
      {
        date: new Date().toISOString().split('T')[0] + "T00:00:00.000Z",
        meals: [
          {
            name: "Colazione",
            time: "07:30",
            calories: 350,
            macros: {
              protein: 30,
              carbs: 10,
              fat: 60
            },
            ingredients: [
              {
                name: "Uova",
                amount: "2",
                unit: "intere"
              },
              {
                name: "Avocado",
                amount: "1/2",
                unit: "intero"
              },
              {
                name: "Pomodoro",
                amount: "1",
                unit: "piccolo"
              },
              {
                name: "Olio extravergine d'oliva",
                amount: "5",
                unit: "ml"
              },
              {
                name: "Sale",
                amount: "q.b.",
                unit: ""
              },
              {
                name: "Pepe",
                amount: "q.b.",
                unit: ""
              }
            ],
            instructions: [
              "Cuocere le uova in padella (all'occhio di bue o strapazzate)",
              "Tagliare l'avocado e il pomodoro a fette",
              "Servire le uova con avocado e pomodoro conditi con olio, sale e pepe"
            ]
          },
          {
            name: "Spuntino",
            time: "10:30",
            calories: 150,
            macros: {
              protein: 15,
              carbs: 5,
              fat: 80
            },
            ingredients: [
              {
                name: "Noci",
                amount: "30",
                unit: "g"
              },
              {
                name: "Formaggio spalmabile senza lattosio",
                amount: "30",
                unit: "g"
              }
            ],
            instructions: [
              "Consumare le noci con il formaggio spalmabile"
            ]
          },
          {
            name: "Pranzo",
            time: "13:00",
            calories: 550,
            macros: {
              protein: 40,
              carbs: 15,
              fat: 45
            },
            ingredients: [
              {
                name: "Salmone",
                amount: "150",
                unit: "g"
              },
              {
                name: "Insalata mista",
                amount: "100",
                unit: "g"
              },
              {
                name: "Cetriolo",
                amount: "1",
                unit: "medio"
              },
              {
                name: "Olio extravergine d'oliva",
                amount: "15",
                unit: "ml"
              },
              {
                name: "Limone",
                amount: "1/2",
                unit: "intero"
              },
              {
                name: "Semi di sesamo",
                amount: "5",
                unit: "g"
              }
            ],
            instructions: [
              "Cuocere il salmone al forno o in padella con succo di limone",
              "Preparare un'insalata con lattuga, cetriolo e semi di sesamo",
              "Condire l'insalata con olio e limone",
              "Servire il salmone con l'insalata come contorno"
            ]
          },
          {
            name: "Spuntino",
            time: "16:30",
            calories: 200,
            macros: {
              protein: 20,
              carbs: 10,
              fat: 70
            },
            ingredients: [
              {
                name: "Yogurt greco intero",
                amount: "150",
                unit: "g"
              },
              {
                name: "Frutti di bosco",
                amount: "50",
                unit: "g"
              },
              {
                name: "Semi di chia",
                amount: "10",
                unit: "g"
              }
            ],
            instructions: [
              "Mescolare lo yogurt con i frutti di bosco freschi",
              "Aggiungere i semi di chia"
            ]
          },
          {
            name: "Cena",
            time: "20:00",
            calories: 550,
            macros: {
              protein: 45,
              carbs: 15,
              fat: 40
            },
            ingredients: [
              {
                name: "Bistecca di manzo",
                amount: "150",
                unit: "g"
              },
              {
                name: "Funghi champignon",
                amount: "100",
                unit: "g"
              },
              {
                name: "Spinaci",
                amount: "150",
                unit: "g"
              },
              {
                name: "Aglio",
                amount: "1",
                unit: "spicchio"
              },
              {
                name: "Olio extravergine d'oliva",
                amount: "15",
                unit: "ml"
              },
              {
                name: "Sale",
                amount: "q.b.",
                unit: ""
              },
              {
                name: "Pepe",
                amount: "q.b.",
                unit: ""
              }
            ],
            instructions: [
              "Cuocere la bistecca in padella al grado di cottura desiderato",
              "In un'altra padella, soffriggere l'aglio in olio, aggiungere i funghi e cuocere",
              "Aggiungere gli spinaci ai funghi e cuocere fino a quando sono appassiti",
              "Servire la bistecca con il contorno di funghi e spinaci"
            ]
          }
        ]
      }
    ]
  }
];
