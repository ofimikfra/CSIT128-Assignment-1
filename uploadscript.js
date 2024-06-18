document.addEventListener("DOMContentLoaded", function() {
    loadRecipes();

    // Function to load recipes dynamically
    function loadRecipes() {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "/getRecipes", true); // Assuming endpoint to fetch recipes
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    // Recipes received successfully
                    let recipes = JSON.parse(xhr.responseText).recipes;
                    displayRecipes(recipes);
                } else {
                    console.error("Error fetching recipes:", xhr.status);
                }
            }
        };
        xhr.send();
    }

    // Function to display recipes in the DOM
    function displayRecipes(recipes) {
        let recipesList = document.getElementById("recipes-list");
        recipesList.innerHTML = ""; // Clear previous content

        recipes.forEach(recipe => {
            let recipeCard = document.createElement("div");
            recipeCard.classList.add("recipe-card");

            let recipeName = document.createElement("h3");
            recipeName.textContent = recipe.name;

            let recipeIngredients = document.createElement("p");
            recipeIngredients.textContent = "Ingredients: " + recipe.ingredients;

            let recipeInstructions = document.createElement("p");
            recipeInstructions.textContent = "Instructions: " + recipe.instructions;

            // You can add more elements as per your schema, e.g., recipe image

            recipeCard.appendChild(recipeName);
            recipeCard.appendChild(recipeIngredients);
            recipeCard.appendChild(recipeInstructions);

            recipesList.appendChild(recipeCard);
        });
    }
});
