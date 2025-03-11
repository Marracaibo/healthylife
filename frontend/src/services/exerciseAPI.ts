// API service per ottenere dati dettagliati sugli esercizi
// Utilizza l'API ExerciseDB disponibile su RapidAPI
// Fallback a dati locali in caso di errore API

interface ExerciseDetails {
  bodyPart: string;
  equipment: string;
  gifUrl: string;
  id: string;
  name: string;
  target: string;
  secondaryMuscles: string[];
  instructions: string[];
}

// Dati locali di fallback per quando l'API non è disponibile
const localExerciseData: ExerciseDetails[] = [
  {
    bodyPart: "upper legs",
    equipment: "body weight",
    gifUrl: "/gif/squat-variations.gif.jfif",
    id: "0001",
    name: "squat",
    target: "quads",
    secondaryMuscles: ["glutes", "hamstrings"],
    instructions: ["Stand with feet shoulder-width apart", "Bend knees and lower body", "Keep chest up and back straight", "Return to starting position"]
  },
  {
    bodyPart: "chest",
    equipment: "body weight",
    gifUrl: "/gif/horizontal-push.gif.gif",
    id: "0002",
    name: "push-up",
    target: "pectorals",
    secondaryMuscles: ["triceps", "shoulders"],
    instructions: ["Start in plank position with hands shoulder-width apart", "Lower body until chest nearly touches floor", "Push back up to starting position"]
  },
  {
    bodyPart: "back",
    equipment: "body weight",
    gifUrl: "/gif/horizontal-pull.gif.gif",
    id: "0003",
    name: "pull-up",
    target: "lats",
    secondaryMuscles: ["biceps", "middle back"],
    instructions: ["Hang from bar with palms facing away", "Pull body up until chin is over bar", "Lower body back to starting position"]
  },
  {
    bodyPart: "waist",
    equipment: "body weight",
    gifUrl: "/gif/plank-variations.gif.gif",
    id: "0004",
    name: "plank",
    target: "abs",
    secondaryMuscles: ["lower back", "shoulders"],
    instructions: ["Start in forearm plank position", "Keep body in straight line from head to heels", "Hold position"]
  },
  {
    bodyPart: "upper legs",
    equipment: "body weight",
    gifUrl: "/gif/lunge-variations.gif.gif",
    id: "0005",
    name: "lunge",
    target: "quads",
    secondaryMuscles: ["glutes", "hamstrings"],
    instructions: ["Step forward with one leg", "Lower body until both knees are bent at 90 degrees", "Push back to starting position"]
  }
];

class ExerciseAPI {
  private apiKey: string;
  private baseUrl: string;
  private useLocalData: boolean = false;

  constructor() {
    // Idealmente, questa chiave dovrebbe essere in una variabile d'ambiente
    // Per lo sviluppo, possiamo inserirla qui
    this.apiKey = import.meta.env.VITE_RAPIDAPI_KEY || 'YOUR_RAPIDAPI_KEY';
    this.baseUrl = 'https://exercisedb.p.rapidapi.com/v1';
    
    // Se non c'è una chiave API valida, usa i dati locali
    if (this.apiKey === 'YOUR_RAPIDAPI_KEY') {
      this.useLocalData = true;
      console.log('Using local exercise data (no API key provided)');
    }
  }

  // Configura le opzioni per le richieste API
  private getRequestOptions() {
    return {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': this.apiKey,
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
      }
    };
  }

  // Ottieni tutti gli esercizi disponibili
  async getAllExercises(): Promise<ExerciseDetails[]> {
    // Se useLocalData è true, restituisci direttamente i dati locali
    if (this.useLocalData) {
      console.log('Returning local exercise data');
      return localExerciseData;
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/exercises`, this.getRequestOptions());
      if (!response.ok) {
        console.warn('API request failed, using local data instead');
        return localExerciseData;
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching exercises:', error);
      console.log('Falling back to local exercise data');
      return localExerciseData;
    }
  }

  // Ottieni esercizi per parte del corpo
  async getExercisesByBodyPart(bodyPart: string): Promise<ExerciseDetails[]> {
    // Se useLocalData è true, filtra i dati locali
    if (this.useLocalData) {
      return localExerciseData.filter(exercise => exercise.bodyPart.toLowerCase() === bodyPart.toLowerCase());
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/exercises/bodyPart/${bodyPart}`, this.getRequestOptions());
      if (!response.ok) {
        console.warn('API request failed, using filtered local data instead');
        return localExerciseData.filter(exercise => exercise.bodyPart.toLowerCase() === bodyPart.toLowerCase());
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching exercises for body part ${bodyPart}:`, error);
      return localExerciseData.filter(exercise => exercise.bodyPart.toLowerCase() === bodyPart.toLowerCase());
    }
  }

  // Ottieni esercizi per target muscolare
  async getExercisesByTarget(target: string): Promise<ExerciseDetails[]> {
    // Se useLocalData è true, filtra i dati locali
    if (this.useLocalData) {
      return localExerciseData.filter(exercise => exercise.target.toLowerCase() === target.toLowerCase());
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/exercises/target/${target}`, this.getRequestOptions());
      if (!response.ok) {
        console.warn('API request failed, using filtered local data instead');
        return localExerciseData.filter(exercise => exercise.target.toLowerCase() === target.toLowerCase());
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching exercises for target ${target}:`, error);
      return localExerciseData.filter(exercise => exercise.target.toLowerCase() === target.toLowerCase());
    }
  }

  // Ottieni esercizi per attrezzatura
  async getExercisesByEquipment(equipment: string): Promise<ExerciseDetails[]> {
    // Se useLocalData è true, filtra i dati locali
    if (this.useLocalData) {
      return localExerciseData.filter(exercise => exercise.equipment.toLowerCase() === equipment.toLowerCase());
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/exercises/equipment/${equipment}`, this.getRequestOptions());
      if (!response.ok) {
        console.warn('API request failed, using filtered local data instead');
        return localExerciseData.filter(exercise => exercise.equipment.toLowerCase() === equipment.toLowerCase());
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching exercises for equipment ${equipment}:`, error);
      return localExerciseData.filter(exercise => exercise.equipment.toLowerCase() === equipment.toLowerCase());
    }
  }

  // Ottieni un esercizio specifico per ID
  async getExerciseById(id: string): Promise<ExerciseDetails | null> {
    // Se useLocalData è true, cerca nei dati locali
    if (this.useLocalData) {
      const exercise = localExerciseData.find(ex => ex.id === id);
      return exercise || null;
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/exercises/exercise/${id}`, this.getRequestOptions());
      if (!response.ok) {
        console.warn('API request failed, searching in local data instead');
        const exercise = localExerciseData.find(ex => ex.id === id);
        return exercise || null;
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching exercise with ID ${id}:`, error);
      const exercise = localExerciseData.find(ex => ex.id === id);
      return exercise || null;
    }
  }

  // Ottieni un esercizio per nome
  async getExerciseByName(name: string): Promise<ExerciseDetails | null> {
    // Se useLocalData è true, cerca nei dati locali
    if (this.useLocalData) {
      const exercise = localExerciseData.find(ex => ex.name.toLowerCase().includes(name.toLowerCase()));
      return exercise || null;
    }
    
    try {
      // Ottieni tutti gli esercizi e filtra per nome
      const allExercises = await this.getAllExercises();
      const exercise = allExercises.find(ex => ex.name.toLowerCase().includes(name.toLowerCase()));
      return exercise || null;
    } catch (error) {
      console.error(`Error fetching exercise with name ${name}:`, error);
      const exercise = localExerciseData.find(ex => ex.name.toLowerCase().includes(name.toLowerCase()));
      return exercise || null;
    }
  }
}

// Esporta una singola istanza dell'API
export const exercisesAPI = new ExerciseAPI();

// Mantieni l'export default per retrocompatibilità
export default exercisesAPI;
