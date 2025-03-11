import * as mockFatsecretService from '../mockFatsecretService';

describe('mockFatsecretService', () => {
  describe('checkBackendStatus', () => {
    it('should return true', async () => {
      const result = await mockFatsecretService.checkBackendStatus();
      expect(result).toBe(true);
    });
  });

  describe('testFatSecretConnection', () => {
    it('should return a success status', async () => {
      const result = await mockFatsecretService.testFatSecretConnection();
      expect(result.status).toBe('success');
      expect(result.using_mock).toBe(true);
      expect(result.backend_available).toBe(true);
    });
  });

  describe('searchFoods', () => {
    it('should return an array of food search results', async () => {
      const query = 'chicken';
      const result = await mockFatsecretService.searchFoods(query);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      
      // Verifica la struttura degli elementi
      const firstItem = result[0];
      expect(firstItem).toHaveProperty('id');
      expect(firstItem).toHaveProperty('name');
      expect(firstItem).toHaveProperty('description');
      expect(firstItem).toHaveProperty('calories');
    });

    it('should return an empty array for an invalid query', async () => {
      const query = 'xyznonexistentfood123456789';
      const result = await mockFatsecretService.searchFoods(query);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });

  describe('getFoodDetails', () => {
    it('should return food details for a valid ID', async () => {
      // Cerchiamo prima un cibo per ottenere un ID valido
      const searchResults = await mockFatsecretService.searchFoods('chicken');
      const validId = searchResults[0].id;
      
      const result = await mockFatsecretService.getFoodDetails(validId);
      expect(result).toHaveProperty('food_id');
      expect(result).toHaveProperty('food_name');
      expect(result).toHaveProperty('calories');
      expect(result).toHaveProperty('protein');
      expect(result).toHaveProperty('carbohydrate');
      expect(result).toHaveProperty('fat');
    });

    it('should throw an error for an invalid ID', async () => {
      const invalidId = 'invalid-id-123456789';
      await expect(mockFatsecretService.getFoodDetails(invalidId)).rejects.toThrow();
    });
  });

  describe('convertFatSecretFoodToAppFood', () => {
    it('should convert FatSecret food details to app format', async () => {
      // Creiamo un oggetto food simile a quello che restituirebbe l'API
      const foodDetail = {
        food_id: '123',
        food_name: 'Test Food',
        food_type: 'Regular',
        brand_name: 'Test Brand',
        serving_id: '456',
        serving_description: '100g',
        serving_url: '',
        metric_serving_amount: 100,
        metric_serving_unit: 'g',
        calories: 200,
        carbohydrate: 10,
        protein: 20,
        fat: 15,
        saturated_fat: 5,
        polyunsaturated_fat: 3,
        monounsaturated_fat: 7,
        trans_fat: 0,
        cholesterol: 50,
        sodium: 100,
        potassium: 300,
        fiber: 2,
        sugar: 5,
        vitamin_a: 10,
        vitamin_c: 20,
        calcium: 30,
        iron: 5
      };
      
      const result = mockFatsecretService.convertFatSecretFoodToAppFood(foodDetail);
      expect(result).toEqual({
        name: 'Test Food',
        amount: '100g',
        calories: 200
      });
    });
  });
});
