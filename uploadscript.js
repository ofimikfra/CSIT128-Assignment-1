const recipeDisplay = document.querySelector('.recipeDisplay');

fetch('./categoryList.json')
.then(response => response.json())
.then(data => {
    categoryData = data;
    const categoryDropdown = document.getElementById('recipe-category');
    data.forEach(category => {
        const option = document.createElement('option');
        option.value = category.name; 
        option.text = category.name;
        categoryDropdown.add(option);
    });
})
.catch(error => console.error('Error:', error));


// Get recipes from JSON file using Ajax
const xhr = new XMLHttpRequest();
xhr.open('GET', 'recipeList.json', true);
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

      const recipeCategory = document.createElement('p');
      recipeCategory.id = 'recipeCategory';
      recipeCategory.textContent = recipe.category;
      recipeCard.appendChild(recipeCategory);

      const recipeIngredients = document.createElement('p');
      recipeIngredients.id = 'recipeIngredients';
      recipeIngredients.textContent = "Ingredients: " + recipe.ingredients;
      recipeCard.appendChild(recipeIngredients);

      const recipeInstructions = document.createElement('p');
      recipeInstructions.id = 'recipeInstructions';
      recipeInstructions.textContent = "Instructions: " + recipe.instructions;
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