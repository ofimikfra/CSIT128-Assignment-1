const recipeDisplay = document.querySelector('.recipeDisplay');

// Get recipes from JSON file using Ajax
const xhr = new XMLHttpRequest();
xhr.open('GET', 'recipeSearch.json', true);
xhr.onload = function() {
  if (xhr.status === 200) {
    const recipes = JSON.parse(xhr.responseText);

    recipes.forEach((recipe) => {
      const recipeCard = document.createElement('div');
      recipeCard.className = 'recipe-card';

      const recipeName = document.createElement('h3');
      recipeName.id = 'recipeName';
      recipeName.textContent = recipe.name;
      recipeCard.appendChild(recipeName);

      const recipeIngredients = document.createElement('p');
      recipeIngredients.id = 'recipeIngredients';
      recipeIngredients.textContent = recipe.ingredients;
      recipeCard.appendChild(recipeIngredients);

      const recipeInstructions = document.createElement('p');
      recipeInstructions.id = 'recipeInstructions';
      recipeInstructions.textContent = recipe.instructions;
      recipeCard.appendChild(recipeInstructions);

      const recipeImg = document.createElement('img');
      recipeImg.id = 'recipeImg';
      recipeImg.src = `/uploads/${recipe.image}`;
      recipeCard.appendChild(recipeImg);

      recipeDisplay.appendChild(recipeCard);
    });
  } else {
    console.error(xhr.statusText);
  }
};
xhr.send();