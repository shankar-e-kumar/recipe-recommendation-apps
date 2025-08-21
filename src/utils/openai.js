// OpenAI API integration for real AI-powered recipe generation
// Replace with your actual OpenAI API key

const OPENAI_API_KEY = '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';

export const generateRecipesWithOpenAI = async (ingredients) => {
  const prompt = `Given these ingredients: ${ingredients}

Generate 2-3 healthy recipe recommendations. For each recipe, provide:
- Recipe name
- Cuisine type
- Accurate nutritional values (calories, protein, carbs, fat)
- 3 specific health benefits
- Brief cooking instructions

Format as JSON array:
[{
  "name": "Recipe Name",
  "cuisine": "Cuisine Type", 
  "calories": 350,
  "protein": "20g",
  "carbs": "45g", 
  "fat": "12g",
  "benefits": ["benefit1", "benefit2", "benefit3"],
  "instructions": "Step by step cooking method"
}]`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    const data = await response.json();
    const recipes = JSON.parse(data.choices[0].message.content);
    return recipes;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
};

// AI Image Recognition for ingredients
export const analyzeImageForIngredients = async (imageFile) => {
  const base64Image = await convertToBase64(imageFile);
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [{
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Identify all the ingredients/food items in this image. Return only a JSON array of ingredient names: ["ingredient1", "ingredient2", "ingredient3"]'
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }],
        max_tokens: 300
      })
    });

    const data = await response.json();
    const ingredients = JSON.parse(data.choices[0].message.content);
    return ingredients;
  } catch (error) {
    console.error('Image Analysis Error:', error);
    // Fallback to mock detection
    return ['tomatoes', 'onions', 'garlic', 'bell peppers'];
  }
};

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
  });
};

// Smart ingredient parsing using AI
export const parseIngredientsWithAI = async (naturalLanguageText) => {
  const prompt = `Extract ingredients from this text: "${naturalLanguageText}"
  
Return only a JSON array of ingredient names:
["ingredient1", "ingredient2", "ingredient3"]`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
        temperature: 0.3
      })
    });

    const data = await response.json();
    const ingredients = JSON.parse(data.choices[0].message.content);
    return ingredients;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return naturalLanguageText.split(',').map(i => i.trim());
  }
};