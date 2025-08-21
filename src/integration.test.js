import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock FileReader for image upload tests
global.FileReader = class {
  readAsDataURL() {
    setTimeout(() => {
      this.onload({ target: { result: 'data:image/jpeg;base64,mockbase64' } });
    }, 100);
  }
};

describe('Integration Tests', () => {
  test('complete user flow: text input to recipe generation', async () => {
    render(<App />);
    
    // Step 1: User enters ingredients
    const input = screen.getByPlaceholderText('Enter ingredients (comma separated)');
    fireEvent.change(input, { target: { value: 'tomato, basil, garlic' } });
    
    // Step 2: User clicks find recipes
    const findButton = screen.getByText('Find Recipes with AI');
    fireEvent.click(findButton);
    
    // Step 3: Loading state appears
    expect(screen.getByText('AI Generating...')).toBeInTheDocument();
    
    // Step 4: Recipe appears
    await waitFor(() => {
      expect(screen.getByText('AI-Generated Tomato Basil Pasta')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Step 5: User expands recipe
    const viewRecipeButton = screen.getByText('View Full Recipe 📖');
    fireEvent.click(viewRecipeButton);
    
    // Step 6: Full recipe details appear
    expect(screen.getByText('🛒 Ingredients:')).toBeInTheDocument();
    expect(screen.getByText('👨🍳 Cooking Instructions:')).toBeInTheDocument();
    
    // Step 7: User resets
    const resetButton = screen.getByText('🔄 Start Over');
    fireEvent.click(resetButton);
    
    // Step 8: App returns to initial state
    expect(input.value).toBe('');
    expect(screen.queryByText('AI-Generated Tomato Basil Pasta')).not.toBeInTheDocument();
  });

  test('complete user flow: image upload to recipe generation', async () => {
    render(<App />);
    
    // Step 1: User uploads image
    const fileInput = document.getElementById('image-upload');
    const file = new File(['test'], 'ingredients.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Step 2: Image analysis starts
    await waitFor(() => {
      expect(screen.getByText('🤖 AI is analyzing your image...')).toBeInTheDocument();
    });
    
    // Step 3: Ingredients detected
    await waitFor(() => {
      expect(screen.getByText('🎯 Detected Ingredients:')).toBeInTheDocument();
    }, { timeout: 4000 });
    
    // Step 4: User generates recipes from detected ingredients
    const findFromImageButton = screen.getByText('Find Recipes from Image 🔍');
    fireEvent.click(findFromImageButton);
    
    // Step 5: Recipe generated
    await waitFor(() => {
      expect(screen.getByText(/AI-/)).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Step 6: Reset clears everything including image
    const resetButton = screen.getByText('🔄 Start Over');
    fireEvent.click(resetButton);
    
    expect(screen.queryByText('🎯 Detected Ingredients:')).not.toBeInTheDocument();
  });

  test('multiple recipe generation and expansion', async () => {
    render(<App />);
    
    // Generate first recipe
    const input = screen.getByPlaceholderText('Enter ingredients (comma separated)');
    fireEvent.change(input, { target: { value: 'chicken' } });
    fireEvent.click(screen.getByText('Find Recipes with AI'));
    
    await waitFor(() => {
      expect(screen.getByText('AI-Optimized Chicken Stir Fry')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Expand recipe
    const viewButton = screen.getByText('View Full Recipe 📖');
    fireEvent.click(viewButton);
    
    expect(screen.getByText('🛒 Ingredients:')).toBeInTheDocument();
    
    // Collapse recipe
    const hideButton = screen.getByText('Hide Recipe 📖');
    fireEvent.click(hideButton);
    
    expect(screen.queryByText('🛒 Ingredients:')).not.toBeInTheDocument();
  });

  test('error handling and fallback recipes', async () => {
    render(<App />);
    
    // Test with ingredients that don't match specific recipes
    const input = screen.getByPlaceholderText('Enter ingredients (comma separated)');
    fireEvent.change(input, { target: { value: 'unknown, ingredients' } });
    fireEvent.click(screen.getByText('Find Recipes with AI'));
    
    // Should still generate fallback recipe
    await waitFor(() => {
      expect(screen.getByText('AI-Crafted Mediterranean Veggie Bowl')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('responsive behavior and mobile compatibility', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    
    render(<App />);
    
    // Check that mobile-friendly elements are present
    expect(screen.getByText('📝 Type Ingredients')).toBeInTheDocument();
    expect(screen.getByText('📸 Upload Ingredient Photo')).toBeInTheDocument();
    expect(screen.getByText('OR')).toBeInTheDocument();
  });
});