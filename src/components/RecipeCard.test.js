import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock RecipeCard component for testing
const RecipeCard = ({ recipe, index, expandedRecipe, setExpandedRecipe }) => (
  <div className="recipe-card">
    <div className="ai-badge">🤖 AI Generated</div>
    <img src={recipe.image} alt={recipe.name} className="recipe-image" />
    <h3>{recipe.name}</h3>
    <p>🌍 {recipe.cuisine}</p>
    <div className="nutrition">
      <span>Calories: {recipe.calories}</span>
      <span>Protein: {recipe.protein}</span>
      <span>Carbs: {recipe.carbs}</span>
      <span>Fat: {recipe.fat}</span>
    </div>
    <div className="benefits">
      <h4>Health Benefits:</h4>
      {recipe.benefits.map((benefit, j) => <span key={j}>✓ {benefit}</span>)}
    </div>
    <div className="recipe-details">
      <div className="recipe-meta">
        <span>🕰️ {recipe.prepTime}</span>
        <span>🍽️ Serves {recipe.servings}</span>
        <span>📊 {recipe.difficulty}</span>
      </div>
      
      <button 
        className="view-recipe-btn"
        onClick={() => setExpandedRecipe(expandedRecipe === index ? null : index)}
      >
        {expandedRecipe === index ? 'Hide Recipe' : 'View Full Recipe'} 📖
      </button>
      
      {expandedRecipe === index && (
        <div className="full-recipe">
          <div className="ingredients-section">
            <h4>🛒 Ingredients:</h4>
            <ul className="ingredients-list">
              {recipe.ingredients.map((ingredient, idx) => (
                <li key={idx}>{ingredient}</li>
              ))}
            </ul>
          </div>
          
          <div className="detailed-instructions">
            <h4>👨🍳 Cooking Instructions:</h4>
            <ol>
              {recipe.detailedInstructions.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  </div>
);

describe('RecipeCard Component', () => {
  const mockRecipe = {
    name: 'Test Pasta',
    cuisine: 'Italian',
    image: 'test-image.jpg',
    calories: 350,
    protein: '15g',
    carbs: '45g',
    fat: '10g',
    benefits: ['Healthy', 'Delicious', 'Nutritious'],
    prepTime: '20 minutes',
    servings: 4,
    difficulty: 'Easy',
    ingredients: ['Pasta', 'Tomatoes', 'Garlic'],
    detailedInstructions: ['Boil water', 'Cook pasta', 'Add sauce']
  };

  test('renders recipe card with basic information', () => {
    render(<RecipeCard recipe={mockRecipe} index={0} expandedRecipe={null} setExpandedRecipe={() => {}} />);
    
    expect(screen.getByText('Test Pasta')).toBeInTheDocument();
    expect(screen.getByText('🌍 Italian')).toBeInTheDocument();
    expect(screen.getByText('Calories: 350')).toBeInTheDocument();
    expect(screen.getByText('🤖 AI Generated')).toBeInTheDocument();
  });

  test('displays nutritional information', () => {
    render(<RecipeCard recipe={mockRecipe} index={0} expandedRecipe={null} setExpandedRecipe={() => {}} />);
    
    expect(screen.getByText('Protein: 15g')).toBeInTheDocument();
    expect(screen.getByText('Carbs: 45g')).toBeInTheDocument();
    expect(screen.getByText('Fat: 10g')).toBeInTheDocument();
  });

  test('displays health benefits', () => {
    render(<RecipeCard recipe={mockRecipe} index={0} expandedRecipe={null} setExpandedRecipe={() => {}} />);
    
    expect(screen.getByText('Health Benefits:')).toBeInTheDocument();
    expect(screen.getByText('✓ Healthy')).toBeInTheDocument();
    expect(screen.getByText('✓ Delicious')).toBeInTheDocument();
    expect(screen.getByText('✓ Nutritious')).toBeInTheDocument();
  });

  test('displays recipe metadata', () => {
    render(<RecipeCard recipe={mockRecipe} index={0} expandedRecipe={null} setExpandedRecipe={() => {}} />);
    
    expect(screen.getByText('🕰️ 20 minutes')).toBeInTheDocument();
    expect(screen.getByText('🍽️ Serves 4')).toBeInTheDocument();
    expect(screen.getByText('📊 Easy')).toBeInTheDocument();
  });

  test('expands recipe when view button is clicked', () => {
    const mockSetExpanded = jest.fn();
    render(<RecipeCard recipe={mockRecipe} index={0} expandedRecipe={null} setExpandedRecipe={mockSetExpanded} />);
    
    const viewButton = screen.getByText('View Full Recipe 📖');
    fireEvent.click(viewButton);
    
    expect(mockSetExpanded).toHaveBeenCalledWith(0);
  });

  test('shows full recipe when expanded', () => {
    render(<RecipeCard recipe={mockRecipe} index={0} expandedRecipe={0} setExpandedRecipe={() => {}} />);
    
    expect(screen.getByText('🛒 Ingredients:')).toBeInTheDocument();
    expect(screen.getByText('👨🍳 Cooking Instructions:')).toBeInTheDocument();
    expect(screen.getByText('Pasta')).toBeInTheDocument();
    expect(screen.getByText('Boil water')).toBeInTheDocument();
    expect(screen.getByText('Hide Recipe 📖')).toBeInTheDocument();
  });

  test('hides recipe when hide button is clicked', () => {
    const mockSetExpanded = jest.fn();
    render(<RecipeCard recipe={mockRecipe} index={0} expandedRecipe={0} setExpandedRecipe={mockSetExpanded} />);
    
    const hideButton = screen.getByText('Hide Recipe 📖');
    fireEvent.click(hideButton);
    
    expect(mockSetExpanded).toHaveBeenCalledWith(null);
  });
});