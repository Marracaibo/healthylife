import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import ManualMealPlanner from '../ManualMealPlanner';
import * as mockHybridFoodService from '../../services/mockHybridFoodService';

// Mock delle dipendenze
jest.mock('../../services/mockHybridFoodService');

describe('ManualMealPlanner Component', () => {
  beforeEach(() => {
    // Reset di tutti i mock
    jest.clearAllMocks();
    
    // Mock delle funzioni del servizio
    (mockHybridFoodService.searchFoods as jest.Mock).mockResolvedValue([
      {
        food_id: '1234',
        food_name: 'Chicken Breast',
        description: 'Grilled chicken breast',
        nutrients: {
          calories: 165,
          protein: 31,
          carbohydrates: 0,
          fat: 3.6
        },
        health_labels: ['High-protein', 'Low-carb']
      },
      {
        food_id: '5678',
        food_name: 'Salmon Fillet',
        description: 'Baked salmon fillet',
        nutrients: {
          calories: 206,
          protein: 22,
          carbohydrates: 0,
          fat: 13
        },
        health_labels: ['Omega-3', 'Low-carb']
      }
    ]);
    (mockHybridFoodService.getFoodDetails as jest.Mock).mockResolvedValue({
      food_id: '1234',
      food_name: 'Chicken Breast',
      description: 'Grilled chicken breast',
      nutrients: {
        calories: 165,
        protein: 31,
        carbohydrates: 0,
        fat: 3.6
      },
      health_labels: ['High-protein', 'Low-carb']
    });
    (mockHybridFoodService.convertHybridFoodToAppFood as jest.Mock).mockReturnValue({
      name: 'Chicken Breast',
      amount: '100g',
      calories: 165
    });
  });

  it('should render the component correctly', () => {
    render(<ManualMealPlanner />);
    
    // Verifica che gli elementi base siano presenti
    expect(screen.getByText('Piano Manuale')).toBeInTheDocument();
    expect(screen.getByText('Aggiungi Alimento')).toBeInTheDocument();
    expect(screen.getByText('Calorie Totali:')).toBeInTheDocument();
  });

  it('should open the search dialog when clicking Add Food', async () => {
    render(<ManualMealPlanner />);
    
    // Click sul pulsante Aggiungi Alimento
    const addButton = screen.getByText('Aggiungi Alimento');
    fireEvent.click(addButton);
    
    // Verifica che il dialog sia aperto
    await waitFor(() => {
      expect(screen.getByText('Cerca Alimento')).toBeInTheDocument();
    });
  });

  it('should search for foods and display results', async () => {
    render(<ManualMealPlanner />);
    
    // Apri il dialog
    const addButton = screen.getByText('Aggiungi Alimento');
    fireEvent.click(addButton);
    
    // Inserisci un termine di ricerca
    const searchInput = screen.getByPlaceholderText('Cerca alimento...');
    fireEvent.change(searchInput, { target: { value: 'chicken' } });
    
    // Click sul pulsante di ricerca
    const searchButton = screen.getByTestId('search-button');
    fireEvent.click(searchButton);
    
    // Controlla che il servizio di ricerca sia stato chiamato con il termine corretto
    await waitFor(() => {
      expect(mockHybridFoodService.searchFoods).toHaveBeenCalledWith('chicken');
    });
    
    // Verifica che i risultati siano visualizzati
    await waitFor(() => {
      expect(screen.getByText('Chicken Breast')).toBeInTheDocument();
      expect(screen.getByText('Salmon Fillet')).toBeInTheDocument();
    });
  });

  it('should add a food to the meal when selected', async () => {
    render(<ManualMealPlanner />);
    
    // Apri il dialog
    const addButton = screen.getByText('Aggiungi Alimento');
    fireEvent.click(addButton);
    
    // Cerca alimenti
    const searchInput = screen.getByPlaceholderText('Cerca alimento...');
    fireEvent.change(searchInput, { target: { value: 'chicken' } });
    
    const searchButton = screen.getByTestId('search-button');
    fireEvent.click(searchButton);
    
    // Attendi i risultati e seleziona un alimento
    await waitFor(() => {
      expect(screen.getByText('Chicken Breast')).toBeInTheDocument();
    });
    
    // Click sul risultato per selezionarlo
    const foodResult = screen.getByText('Chicken Breast');
    fireEvent.click(foodResult);
    
    // Verifica che il servizio getFoodDetails sia stato chiamato
    await waitFor(() => {
      expect(mockHybridFoodService.getFoodDetails).toHaveBeenCalledWith('1234');
    });
    
    // Seleziona un pasto dal menu a tendina (es. Colazione)
    await waitFor(() => {
      const mealSelect = screen.getByLabelText('Seleziona Pasto');
      fireEvent.mouseDown(mealSelect);
    });
    
    // Seleziona la colazione
    const breakfastOption = await screen.findByText('Colazione');
    fireEvent.click(breakfastOption);
    
    // Click su Aggiungi
    const confirmButton = screen.getByText('Aggiungi');
    fireEvent.click(confirmButton);
    
    // Verifica che il cibo sia stato aggiunto alla colazione
    await waitFor(() => {
      expect(screen.getAllByText('Chicken Breast').length).toBeGreaterThan(0);
    });
  });

  it('should calculate total calories correctly', async () => {
    render(<ManualMealPlanner />);
    
    // Simula l'aggiunta di un alimento con 165 calorie
    await act(async () => {
      // Apri il dialog
      const addButton = screen.getByText('Aggiungi Alimento');
      fireEvent.click(addButton);
      
      // Cerca alimenti
      const searchInput = screen.getByPlaceholderText('Cerca alimento...');
      fireEvent.change(searchInput, { target: { value: 'chicken' } });
      
      const searchButton = screen.getByTestId('search-button');
      fireEvent.click(searchButton);
      
      // Attendi i risultati e seleziona un alimento
      await waitFor(() => {
        expect(screen.getByText('Chicken Breast')).toBeInTheDocument();
      });
      
      // Click sul risultato per selezionarlo
      const foodResult = screen.getByText('Chicken Breast');
      fireEvent.click(foodResult);
      
      // Seleziona un pasto dal menu a tendina (es. Colazione)
      await waitFor(() => {
        const mealSelect = screen.getByLabelText('Seleziona Pasto');
        fireEvent.mouseDown(mealSelect);
      });
      
      // Seleziona la colazione
      const breakfastOption = await screen.findByText('Colazione');
      fireEvent.click(breakfastOption);
      
      // Click su Aggiungi
      const confirmButton = screen.getByText('Aggiungi');
      fireEvent.click(confirmButton);
    });
    
    // Verifica che il conteggio delle calorie totali sia aggiornato
    expect(screen.getByText('Calorie Totali: 165')).toBeInTheDocument();
  });

  test('should search for foods when typing in the search field', async () => {
    render(<ManualMealPlanner />);
    
    // Trova e apre il dialog di aggiunta alimenti
    const addButton = screen.getAllByText('Aggiungi')[0];
    fireEvent.click(addButton);

    // Attendiamo che il dialog si apra
    await waitFor(() => {
      expect(screen.getByText('Aggiungi alimento')).toBeInTheDocument();
    });
    
    // Trova il campo di ricerca e inserisce un termine di ricerca
    const searchInput = screen.getByPlaceholderText(/Cerca alimento/i);
    fireEvent.change(searchInput, { target: { value: 'chicken' } });
    
    // Attendiamo che la ricerca venga completata e i risultati vengano mostrati
    await waitFor(() => {
      expect(mockHybridFoodService.searchFoods).toHaveBeenCalledWith('chicken');
    }, { timeout: 1000 });
    
    // Verifica che i risultati vengano visualizzati
    await waitFor(() => {
      expect(screen.getByText('Chicken Breast')).toBeInTheDocument();
    });
  });
});
