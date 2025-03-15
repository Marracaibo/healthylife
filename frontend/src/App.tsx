import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import OfflineNotification from './components/ui/OfflineNotification';
import InstallPWAPrompt from './components/ui/InstallPWAPrompt';
import ResponsiveLayout from './components/layout/ResponsiveLayout';
import NavigationDrawer from './components/layout/NavigationDrawer';
import HybridFoodServiceExample from './components/examples/HybridFoodServiceExample';
import ApiDiagnosticTool from './components/ApiDiagnosticTool';

// Importa tutte le pagine dal file index
import {
  Dashboard,
  MealPlanner,
  Progress,
  DailyDiary,
  FoodTracker,
  Settings,
  Workout,
  WorkoutPrograms,
  SkillsProgression,
  TestHybridFood,
  SimpleTestPage,
  FoodServiceDiagnosticPage,
  FoodSearchTestPage,
  NLPTestPage,
  ImageRecognitionTestPage,
  WorkoutBuilder,
  NutritionHub,
  TransformationHub
} from './pages';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/*" element={
            <ResponsiveLayout 
              title="HealthyLife"
              drawerContent={<NavigationDrawer />}
            >
              <Routes>
                <Route index element={<Dashboard />} />
                <Route path="food-tracker" element={<FoodTracker />} />
                <Route path="nutrition" element={<NutritionHub />} />
                <Route path="meal-planner" element={<MealPlanner />} />
                <Route path="workout-programs" element={<WorkoutPrograms />} />
                <Route path="workout" element={<Workout />} />
                <Route path="progress" element={<Progress />} />
                <Route path="diary" element={<DailyDiary />} />
                <Route path="exercise-library" element={<SkillsProgression />} />
                <Route path="settings" element={<Settings />} />
                <Route path="transformation-hub" element={<TransformationHub />} />
                <Route path="transformation" element={<TransformationHub />} />
                <Route path="shop" element={<TransformationHub />} />
                <Route path="food-service-test" element={<HybridFoodServiceExample />} />
                <Route path="api-diagnostic" element={<ApiDiagnosticTool />} />
                <Route path="/test-food-service" element={<TestHybridFood />} />
                <Route path="/simple-test-page" element={<SimpleTestPage />} />
                <Route path="/food-service-diagnostic" element={<FoodServiceDiagnosticPage />} />
                <Route path="/food-search-test" element={<FoodSearchTestPage />} />
                <Route path="/nlp-test" element={<NLPTestPage />} />
                <Route path="/test-image-recognition" element={<ImageRecognitionTestPage />} />
                <Route path="/workout-builder" element={<WorkoutBuilder />} />
              </Routes>
            </ResponsiveLayout>
          } />
        </Routes>
        
        {/* Componenti PWA */}
        <OfflineNotification />
        <InstallPWAPrompt />
      </Router>
    </ThemeProvider>
  );
}

export default App;
