// Import diretto delle GIF per includerle nel bundle
import squatVariationsGif from './squat-variations.gif';
import horizontalPullGif from './horizontal-pull.gif';
import horizontalPushGif from './horizontal-push.gif';
import lungeVariationsGif from './lunge-variations.gif';
import plankVariationsGif from './plank-variations.gif';
import hollowBodyCrunchGif from './hollow-body-crunch.gif';

// Esporta le GIF per poterle utilizzare altrove nell'applicazione
export const exerciseGifs = {
  'squat-variations': squatVariationsGif,
  'horizontal-pull': horizontalPullGif,
  'horizontal-push': horizontalPushGif,
  'lunge-variations': lungeVariationsGif,
  'plank-variations': plankVariationsGif,
  'hollow-body-crunch': hollowBodyCrunchGif,
};

// Funzione helper per ottenere l'URL di una GIF dato l'ID dell'esercizio
export function getExerciseGifUrl(exerciseId: string): string {
  return exerciseGifs[exerciseId as keyof typeof exerciseGifs] || '';
}
