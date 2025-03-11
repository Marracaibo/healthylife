import { BodyMeasurement, ProgressPhoto, MeasurementStatistics } from '../types/measurements';
import { format, subDays } from 'date-fns';

// Genera dati di esempio per le misurazioni
export const generateSampleMeasurements = (): BodyMeasurement[] => {
  const measurements: BodyMeasurement[] = [];
  const today = new Date();

  for (let i = 90; i >= 0; i -= 7) { // Ogni 7 giorni per 3 mesi
    const date = format(subDays(today, i), 'yyyy-MM-dd');
    
    // Peso che diminuisce gradualmente da 80kg a 75kg con piccole variazioni
    const baseWeight = 80 - (i * (5/90)); // Diminuzione graduale da 80 a 75
    const randomVariation = (Math.random() - 0.5) * 0.4; // Variazione di ±0.2kg
    const weight = +(baseWeight + randomVariation).toFixed(1);

    // Body fat che diminuisce gradualmente dal 25% al 20%
    const baseBodyFat = 25 - (i * (5/90));
    const bodyFatVariation = (Math.random() - 0.5) * 0.6;
    const bodyFatPercentage = +(baseBodyFat + bodyFatVariation).toFixed(1);

    // BMI che diminuisce gradualmente da 27 a 25
    const baseBMI = 27 - (i * (2/90));
    const bmiVariation = (Math.random() - 0.5) * 0.2;
    const bmi = +(baseBMI + bmiVariation).toFixed(1);

    // Altre misurazioni
    const waistBase = 90 - (i * (5/90));
    const hipsBase = 100 - (i * (3/90));
    const chestBase = 95 - (i * (2/90));
    const thighsBase = 60 - (i * (2/90));
    const armsBase = 35 - (i * (1/90));

    measurements.push({
      id: 90 - i,
      date,
      weight,
      bodyFatPercentage,
      bmi,
      note: i % 28 === 0 ? 'Misurazione mensile dettagliata' : undefined,
      measurements: {
        waist: +(waistBase + (Math.random() - 0.5) * 0.6).toFixed(1),
        hips: +(hipsBase + (Math.random() - 0.5) * 0.6).toFixed(1),
        chest: +(chestBase + (Math.random() - 0.5) * 0.6).toFixed(1),
        thighs: +(thighsBase + (Math.random() - 0.5) * 0.6).toFixed(1),
        arms: +(armsBase + (Math.random() - 0.5) * 0.4).toFixed(1),
      }
    });
  }

  return measurements;
};

// Genera dati di esempio per le foto di progresso
export const generateSamplePhotos = (): ProgressPhoto[] => {
  const photos: ProgressPhoto[] = [];
  const today = new Date();
  const categories: Array<'front' | 'side' | 'back' | 'other'> = ['front', 'side', 'back', 'other'];
  
  for (let i = 90; i >= 0; i -= 30) { // Ogni 30 giorni per 3 mesi
    const date = format(subDays(today, i), 'yyyy-MM-dd');
    
    // Per ogni data, aggiungi una foto per ogni categoria
    categories.forEach((category, index) => {
      photos.push({
        id: (90 - i) * 10 + index,
        date,
        imageUrl: `https://via.placeholder.com/300x400?text=Progress+${category}+${date}`,
        category,
        note: i === 0 ? 'Foto più recente' : i === 90 ? 'Foto iniziale' : undefined
      });
    });
  }
  
  return photos;
};

// Genera statistiche di esempio
export const generateSampleStatistics = (measurements: BodyMeasurement[]): MeasurementStatistics => {
  if (measurements.length === 0) {
    return {
      initialWeight: 0,
      currentWeight: 0,
      weightDiff: 0,
      daysTracked: 0,
      measurementChanges: {}
    };
  }

  const first = measurements[0];
  const last = measurements[measurements.length - 1];
  
  return {
    initialWeight: first.weight,
    currentWeight: last.weight,
    weightDiff: +(last.weight - first.weight).toFixed(1),
    initialBodyFat: first.bodyFatPercentage,
    currentBodyFat: last.bodyFatPercentage,
    bodyFatDiff: first.bodyFatPercentage && last.bodyFatPercentage 
      ? +(last.bodyFatPercentage - first.bodyFatPercentage).toFixed(1) 
      : undefined,
    initialBMI: first.bmi,
    currentBMI: last.bmi,
    bmiDiff: first.bmi && last.bmi 
      ? +(last.bmi - first.bmi).toFixed(1) 
      : undefined,
    daysTracked: 90,
    targetWeight: 73,
    measurementChanges: {
      waist: {
        initial: first.measurements.waist,
        current: last.measurements.waist,
        diff: first.measurements.waist && last.measurements.waist 
          ? +(last.measurements.waist - first.measurements.waist).toFixed(1) 
          : undefined
      },
      hips: {
        initial: first.measurements.hips,
        current: last.measurements.hips,
        diff: first.measurements.hips && last.measurements.hips 
          ? +(last.measurements.hips - first.measurements.hips).toFixed(1) 
          : undefined
      },
      chest: {
        initial: first.measurements.chest,
        current: last.measurements.chest,
        diff: first.measurements.chest && last.measurements.chest 
          ? +(last.measurements.chest - first.measurements.chest).toFixed(1) 
          : undefined
      },
      thighs: {
        initial: first.measurements.thighs,
        current: last.measurements.thighs,
        diff: first.measurements.thighs && last.measurements.thighs 
          ? +(last.measurements.thighs - first.measurements.thighs).toFixed(1) 
          : undefined
      },
      arms: {
        initial: first.measurements.arms,
        current: last.measurements.arms,
        diff: first.measurements.arms && last.measurements.arms 
          ? +(last.measurements.arms - first.measurements.arms).toFixed(1) 
          : undefined
      }
    }
  };
};
