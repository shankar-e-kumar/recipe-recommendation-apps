import { generateRecipesWithOpenAI, analyzeImageForIngredients, parseIngredientsWithAI } from './openai';

// Mock fetch for API calls
global.fetch = jest.fn();

describe('OpenAI Utils', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('generateRecipesWithOpenAI', () => {
    test('should generate recipes from ingredients', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify([{
              name: 'Test Recipe',
              cuisine: 'Italian',
              calories: 300,
              protein: '15g',
              carbs: '40g',
              fat: '10g',
              benefits: ['Healthy', 'Delicious'],
              instructions: 'Cook well'
            }])
          }
        }]
      };

      fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      const result = await generateRecipesWithOpenAI('tomato, basil');
      
      expect(fetch).toHaveBeenCalledWith('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer your-openai-api-key-here'
        },
        body: expect.stringContaining('tomato, basil')
      });

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Test Recipe');
    });

    test('should handle API errors gracefully', async () => {
      fetch.mockRejectedValueOnce(new Error('API Error'));
      
      await expect(generateRecipesWithOpenAI('tomato')).rejects.toThrow('API Error');
    });
  });

  describe('parseIngredientsWithAI', () => {
    test('should parse natural language ingredients', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify(['tomato', 'onion', 'garlic'])
          }
        }]
      };

      fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      const result = await parseIngredientsWithAI('I have some tomatoes, an onion, and fresh garlic');
      
      expect(result).toEqual(['tomato', 'onion', 'garlic']);
    });

    test('should fallback to simple parsing on API error', async () => {
      fetch.mockRejectedValueOnce(new Error('API Error'));
      
      const result = await parseIngredientsWithAI('tomato, onion, garlic');
      
      expect(result).toEqual(['tomato', 'onion', 'garlic']);
    });
  });

  describe('analyzeImageForIngredients', () => {
    test('should analyze image and return ingredients', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify(['carrot', 'broccoli', 'chicken'])
          }
        }]
      };

      fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      // Mock file
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      
      const result = await analyzeImageForIngredients(mockFile);
      
      expect(result).toEqual(['carrot', 'broccoli', 'chicken']);
    });

    test('should fallback to mock ingredients on API error', async () => {
      fetch.mockRejectedValueOnce(new Error('Vision API Error'));
      
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const result = await analyzeImageForIngredients(mockFile);
      
      expect(result).toEqual(['tomatoes', 'onions', 'garlic', 'bell peppers']);
    });
  });
});