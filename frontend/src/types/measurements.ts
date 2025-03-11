export interface BodyMeasurement {
  id: number;
  date: string;
  weight: number;
  bodyFatPercentage?: number;
  bmi?: number;
  note?: string;
  measurements: {
    waist?: number;
    hips?: number;
    chest?: number;
    thighs?: number;
    arms?: number;
    [key: string]: number | undefined;
  };
}

export interface ProgressPhoto {
  id: number;
  date: string;
  imageUrl: string;
  category: 'front' | 'side' | 'back' | 'other';
  note?: string;
}

export interface MeasurementChartData {
  date: string;
  [key: string]: string | number;
}

export interface MeasurementStatistics {
  initialWeight: number;
  currentWeight: number;
  weightDiff: number;
  initialBodyFat?: number;
  currentBodyFat?: number;
  bodyFatDiff?: number;
  initialBMI?: number;
  currentBMI?: number;
  bmiDiff?: number;
  daysTracked: number;
  targetWeight?: number;
  measurementChanges: {
    [key: string]: {
      initial?: number;
      current?: number;
      diff?: number;
    };
  };
}
