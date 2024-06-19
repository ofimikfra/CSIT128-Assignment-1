// Fetch the recipes JSON object from the server-side
fetch('/recipes')
  .then(response => response.json())
  .then(recipes => {
    // Populate the dropdown menu with recipe options
    const recipeSelect = document.getElementById("recipe-select");
    recipes.forEach((recipe) => {
      const option = document.createElement("option");
      option.value = recipe.id;
      option.text = recipe.name;
      recipeSelect.appendChild(option);
    });

    // Add an event listener to the dropdown menu
    recipeSelect.addEventListener("change", (e) => {
      const selectedRecipeId = e.target.value;
      const selectedRecipe = recipes.find((recipe) => recipe.id === parseInt(selectedRecipeId));
      if (selectedRecipe) {
        const recipeDisplay = document.getElementById("recipe-display");
        recipeDisplay.innerHTML = `
          <h2>${selectedRecipe.name}</h2>
          <p>Ingredients: ${selectedRecipe.ingredients}</p>
          <p>Instructions: ${selectedRecipe.instructions}</p>
          <img src="uploads/${selectedRecipe.imageUrl}" alt="${selectedRecipe.name}">
        `;
      }
    });
  })
  .catch(error => console.error('Error:', error));