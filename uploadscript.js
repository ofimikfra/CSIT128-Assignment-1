const display = document.querySelector('.recipes');

fetch('./categoryList.json')
.then(response => response.json())
.then(data => {
    categoryData = data;
    const categoryDropdown = document.getElementById('recipe-category');
    data.forEach(category => {
        const option = document.createElement('option');
        option.value = category.name; 
        option.text = category.name;
        categoryDropdown.appendChild(option);
    });

    // Get recipes from JSON file using Ajax
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'recipeList.json', true);
    xhr.onload = function() {
      if (xhr.status === 200) {
        const recipes = JSON.parse(xhr.responseText);
        recipes.forEach((recipe) => {
          const recipeDisplay = document.createElement('div');
          recipeDisplay.className = 'recipe-display';

          const recipeCard = document.createElement('div');
          recipeCard.className = 'recipe-card';
          recipeDisplay.appendChild(recipeCard);

          const recipeName = document.createElement('h3');
          recipeName.id = 'recipe-name';
          recipeName.textContent = recipe.name;
          recipeCard.appendChild(recipeName);

          const recipeCategory = document.createElement('p');
          recipeCategory.id = 'recipe-category';
          recipeCategory.textContent = "Category: " +recipe.category;
          recipeCard.appendChild(recipeCategory);

          const recipeIngredients = document.createElement('p');
          recipeIngredients.id = 'recipe-ingredients';
          recipeIngredients.innerHTML = "Ingredients: <br>" + recipe.ingredients;
          recipeCard.appendChild(recipeIngredients);

          const recipeInstructions = document.createElement('p');
          recipeInstructions.id = 'recipe-instructions';
          recipeInstructions.innerHTML = "Instructions: <br>" + recipe.instructions;
          recipeCard.appendChild(recipeInstructions);

          const recipeCardImg = document.createElement('div');
          recipeCardImg.className = 'recipe-card-img';
          recipeDisplay.appendChild(recipeCardImg);

          const recipeImg = document.createElement('img');
          recipeImg.id = 'recipe-img';
          recipeImg.src = `/uploads/${recipe.image}`;
          recipeCardImg.appendChild(recipeImg);

          display.appendChild(recipeDisplay);
        });
      } else {
        console.error(xhr.statusText);
      }
    };
    xhr.send();
})
.catch(error => console.error('Error:', error));