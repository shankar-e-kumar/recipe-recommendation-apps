import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock file reader for image upload tests
global.FileReader = class {
  readAsDataURL() {
    this.onload({ target: { result: 'data:image/jpeg;base64,mockbase64' } });
  }
};

describe('App Component', () => {
  test('renders recipe finder title', () => {
    render(<App />);
    expect(screen.getByText('🍳 Recipe Finder')).toBeInTheDocument();
  });

  test('renders text input section', () => {
    render(<App />);
    expect(screen.getByText('📝 Type Ingredients')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter ingredients (comma separated)')).toBeInTheDocument();
  });

  test('renders image upload section', () => {
    render(<App />);
    expect(screen.getByText('📸 Upload Ingredient Photo')).toBeInTheDocument();
    expect(screen.getByText('📷 Upload Image of Ingredients')).toBeInTheDocument();
  });

  test('allows typing ingredients', () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Enter ingredients (comma separated)');
    fireEvent.change(input, { target: { value: 'tomato, onion' } });
    expect(input.value).toBe('tomato, onion');
  });

  test('generates recipes when find recipes button is clicked', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Enter ingredients (comma separated)');
    const button = screen.getByText('Find Recipes with AI');
    
    fireEvent.change(input, { target: { value: 'tomato' } });
    fireEvent.click(button);
    
    expect(screen.getByText('AI Generating...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('AI-Generated Tomato Basil Pasta')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('shows reset button when recipes are generated', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Enter ingredients (comma separated)');
    const button = screen.getByText('Find Recipes with AI');
    
    fireEvent.change(input, { target: { value: 'chicken' } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('🔄 Start Over')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('reset button clears all content', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Enter ingredients (comma separated)');
    const findButton = screen.getByText('Find Recipes with AI');
    
    fireEvent.change(input, { target: { value: 'tomato' } });
    fireEvent.click(findButton);
    
    await waitFor(() => {
      expect(screen.getByText('🔄 Start Over')).toBeInTheDocument();
    });
    
    const resetButton = screen.getByText('🔄 Start Over');
    fireEvent.click(resetButton);
    
    expect(input.value).toBe('');
    expect(screen.queryByText('AI-Generated Tomato Basil Pasta')).not.toBeInTheDocument();
  });

  test('handles image upload', async () => {
    render(<App />);
    const fileInput = document.getElementById('image-upload');
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(screen.getByText('🤖 AI is analyzing your image...')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText('🎯 Detected Ingredients:')).toBeInTheDocument();
    }, { timeout: 4000 });
  });

  test('expands recipe details when view recipe button is clicked', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Enter ingredients (comma separated)');
    const button = screen.getByText('Find Recipes with AI');
    
    fireEvent.change(input, { target: { value: 'tomato' } });
    fireEvent.click(button);
    
    await waitFor(() => {
      const viewRecipeButton = screen.getByText('View Full Recipe 📖');
      fireEvent.click(viewRecipeButton);
      expect(screen.getByText('🛒 Ingredients:')).toBeInTheDocument();
      expect(screen.getByText('👨‍🍳 Cooking Instructions:')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('displays nutritional information', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Enter ingredients (comma separated)');
    const button = screen.getByText('Find Recipes with AI');
    
    fireEvent.change(input, { target: { value: 'chicken' } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText(/Calories:/)).toBeInTheDocument();
      expect(screen.getByText(/Protein:/)).toBeInTheDocument();
      expect(screen.getByText(/Carbs:/)).toBeInTheDocument();
      expect(screen.getByText(/Fat:/)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('displays health benefits', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Enter ingredients (comma separated)');
    const button = screen.getByText('Find Recipes with AI');
    
    fireEvent.change(input, { target: { value: 'tomato' } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Health Benefits:')).toBeInTheDocument();
      expect(screen.getByText(/Rich in lycopene/)).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});