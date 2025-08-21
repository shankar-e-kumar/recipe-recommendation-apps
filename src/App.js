import React, { useState } from 'react';
import './App.css';

function App() {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedRecipe, setExpandedRecipe] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [detectedIngredients, setDetectedIngredients] = useState([]);
  const [imageAnalyzing, setImageAnalyzing] = useState(false);

  const generateAIRecipes = async (ingredientText) => {
    const prompt = `Given these ingredients: ${ingredientText}

Generate 2-3 recipe recommendations in this exact JSON format:
[{
  "name": "Recipe Name",
  "cuisine": "Cuisine Type",
  "calories": 350,
  "protein": "20g",
  "carbs": "45g",
  "fat": "12g",
  "benefits": ["Health benefit 1", "Health benefit 2"],
  "instructions": "Brief cooking steps"
}]`;

    try {
      // Simulated AI response - replace with actual OpenAI API call
      const aiResponse = await simulateAIResponse(ingredientText);
      return aiResponse;
    } catch (error) {
      console.error('AI API Error:', error);
      return getFallbackRecipes(ingredientText);
    }
  };

  const simulateAIResponse = async (ingredientText) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const ingredients = ingredientText.toLowerCase();
    if (ingredients.includes('tomato')) {
      return [{
        name: 'AI-Generated Tomato Basil Pasta',
        cuisine: 'Italian',
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop',
        calories: 380,
        protein: '14g',
        carbs: '52g',
        fat: '8g',
        benefits: ['Rich in lycopene', 'Antioxidant properties', 'Heart healthy'],
        prepTime: '25 minutes',
        servings: 4,
        difficulty: 'Easy',
        ingredients: [
          '12 oz pasta (spaghetti or penne)',
          '4 large fresh tomatoes, diced',
          '3 cloves garlic, minced',
          '1/4 cup fresh basil leaves',
          '3 tbsp extra virgin olive oil',
          '1/2 cup grated Parmesan cheese',
          'Salt and pepper to taste',
          'Red pepper flakes (optional)'
        ],
        detailedInstructions: [
          'Bring a large pot of salted water to boil for pasta',
          'Heat 2 tbsp olive oil in a large pan over medium heat',
          'Add 3 minced garlic cloves, cook for 1 minute until fragrant',
          'Add 4 diced fresh tomatoes, cook for 8-10 minutes until softened',
          'Season with salt, pepper, and red pepper flakes to taste',
          'Cook 12oz pasta according to package directions until al dente',
          'Reserve 1 cup pasta water before draining',
          'Add drained pasta to tomato sauce with ¼ cup pasta water',
          'Toss with fresh basil leaves and grated Parmesan cheese',
          'Serve immediately with extra cheese and basil garnish'
        ]
      }];
    }
    if (ingredients.includes('chicken')) {
      return [{
        name: 'AI-Optimized Chicken Stir Fry',
        cuisine: 'Asian Fusion',
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
        calories: 420,
        protein: '28g',
        carbs: '35g',
        fat: '15g',
        benefits: ['High protein', 'Balanced macros', 'Quick energy'],
        prepTime: '20 minutes',
        servings: 3,
        difficulty: 'Medium',
        ingredients: [
          '1 lb chicken breast, cut into pieces',
          '1 bell pepper, sliced',
          '1 medium onion, sliced',
          '1 cup snap peas',
          '3 tbsp soy sauce',
          '1 tbsp oyster sauce',
          '1 tsp sesame oil',
          '2 tbsp vegetable oil',
          '1 tsp cornstarch',
          'Cooked rice for serving'
        ],
        detailedInstructions: [
          'Cut 1 lb chicken breast into bite-sized pieces',
          'Marinate chicken with 2 tbsp soy sauce, 1 tsp cornstarch for 15 minutes',
          'Prepare vegetables: slice 1 bell pepper, 1 onion, snap peas',
          'Heat 2 tbsp oil in wok or large skillet over high heat',
          'Add marinated chicken, stir-fry for 5-6 minutes until golden',
          'Remove chicken, set aside on plate',
          'Add vegetables to same pan, stir-fry for 3-4 minutes until crisp-tender',
          'Return chicken to pan with vegetables',
          'Add sauce: 3 tbsp soy sauce, 1 tbsp oyster sauce, 1 tsp sesame oil',
          'Stir-fry for 2 minutes until heated through, serve over rice'
        ]
      }];
    }
    return [{
      name: 'AI-Crafted Mediterranean Veggie Bowl',
      cuisine: 'Mediterranean',
      image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop',
      calories: 250,
      protein: '8g',
      carbs: '30g',
      fat: '10g',
      benefits: ['Nutrient dense', 'High fiber', 'Low calorie'],
      prepTime: '30 minutes',
      servings: 2,
      difficulty: 'Easy',
      ingredients: [
        '1 zucchini, chopped',
        '1 bell pepper, chopped',
        '1 red onion, sliced',
        '1 cup cherry tomatoes',
        '3 tbsp olive oil',
        '1 tsp dried oregano',
        '1 tsp dried thyme',
        '1/2 cup feta cheese, crumbled',
        '1 cup quinoa or couscous',
        'Fresh parsley and lemon juice'
      ],
      detailedInstructions: [
        'Preheat oven to 425°F (220°C)',
        'Chop mixed vegetables: zucchini, bell peppers, red onion, cherry tomatoes',
        'Toss vegetables with 3 tbsp olive oil, salt, and pepper',
        'Add dried herbs: oregano, thyme, and rosemary',
        'Spread vegetables on large baking sheet in single layer',
        'Roast for 20-25 minutes until edges are golden and tender',
        'Meanwhile, prepare quinoa or couscous according to package directions',
        'Crumble feta cheese and chop fresh parsley',
        'Serve roasted vegetables over grains',
        'Top with feta cheese, parsley, and a drizzle of lemon juice'
      ]
    }];
  };

  const getFallbackRecipes = (ingredientText) => {
    return [{
      name: 'Custom Ingredient Medley',
      cuisine: 'Fusion',
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
      calories: 300,
      protein: '12g',
      carbs: '40g',
      fat: '10g',
      benefits: ['Nutritious', 'Balanced', 'Customizable'],
      prepTime: '20 minutes',
      servings: 2,
      difficulty: 'Easy',
      ingredients: [
        'Your available ingredients',
        'Cooking oil',
        'Salt and pepper',
        'Favorite seasonings',
        'Optional: rice or bread'
      ],
      detailedInstructions: [
        'Wash and prepare all your available ingredients',
        'Heat oil in a large pan over medium heat',
        'Start with harder vegetables that take longer to cook',
        'Add softer ingredients gradually',
        'Season with salt, pepper, and your favorite spices',
        'Cook until all ingredients are tender and well combined',
        'Taste and adjust seasoning as needed',
        'Serve hot with rice, bread, or enjoy on its own'
      ]
    }];
  };

  const analyzeImage = async (imageFile) => {
    setImageAnalyzing(true);
    // Simulate AI image analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simulated ingredient detection based on common ingredients
    const mockDetectedIngredients = [
      'tomatoes', 'onions', 'garlic', 'bell peppers', 
      'carrots', 'potatoes', 'chicken', 'eggs'
    ];
    
    // Randomly select 3-5 ingredients for demo
    const randomIngredients = mockDetectedIngredients
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3) + 3);
    
    setDetectedIngredients(randomIngredients);
    setIngredients(randomIngredients.join(', '));
    setImageAnalyzing(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        analyzeImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetAll = () => {
    setIngredients('');
    setRecipes([]);
    setUploadedImage(null);
    setDetectedIngredients([]);
    setExpandedRecipe(null);
    setImageAnalyzing(false);
    setLoading(false);
    // Reset file input
    const fileInput = document.getElementById('image-upload');
    if (fileInput) fileInput.value = '';
  };

  const findRecipes = async () => {
    if (!ingredients.trim()) return;
    setLoading(true);
    const aiRecipes = await generateAIRecipes(ingredients);
    setRecipes(aiRecipes);
    setLoading(false);
  };

  return (
    <div className="app">
      <div className="header-section">
        <h1>🍳 Recipe Finder</h1>
        {(recipes.length > 0 || ingredients || uploadedImage) && (
          <button onClick={resetAll} className="reset-btn">
            🔄 Start Over
          </button>
        )}
      </div>
      <div className="input-methods">
        <div className="text-input-section">
          <h3>📝 Type Ingredients</h3>
          <div className="input-section">
            <input 
              value={ingredients} 
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="Enter ingredients (comma separated)"
            />
            <button onClick={findRecipes} disabled={loading}>
              {loading ? 'AI Generating...' : 'Find Recipes with AI'}
            </button>
          </div>
        </div>
        
        <div className="divider">OR</div>
        
        <div className="image-input-section">
          <h3>📸 Upload Ingredient Photo</h3>
          <div className="image-upload">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload}
              id="image-upload"
              style={{display: 'none'}}
            />
            <label htmlFor="image-upload" className="upload-btn">
              📷 Upload Image of Ingredients
            </label>
          </div>
          
          {uploadedImage && (
            <div className="uploaded-image">
              <img src={uploadedImage} alt="Uploaded ingredients" />
              {imageAnalyzing && (
                <div className="analyzing">
                  <div className="spinner"></div>
                  <p>🤖 AI is analyzing your image...</p>
                </div>
              )}
              {detectedIngredients.length > 0 && !imageAnalyzing && (
                <div className="detected-ingredients">
                  <h4>🎯 Detected Ingredients:</h4>
                  <div className="ingredient-chips">
                    {detectedIngredients.map((ingredient, idx) => (
                      <span key={idx} className="ingredient-chip">{ingredient}</span>
                    ))}
                  </div>
                  <button onClick={findRecipes} className="find-from-image-btn">
                    Find Recipes from Image 🔍
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="recipes">
        {recipes.map((recipe, i) => (
          <div key={i} className="recipe-card">
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
                onClick={() => setExpandedRecipe(expandedRecipe === i ? null : i)}
              >
                {expandedRecipe === i ? 'Hide Recipe' : 'View Full Recipe'} 📖
              </button>
              
              {expandedRecipe === i && (
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
                    <h4>👨‍🍳 Cooking Instructions:</h4>
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
        ))}
      </div>
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>AI is analyzing your ingredients and generating personalized recipes...</p>
        </div>
      )}
    </div>
  );
}

export default App;
