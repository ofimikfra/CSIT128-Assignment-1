doucumet.getElementById('search-button').addEventListener('click', function(){
  const query = document.getElementById('search-input').value;
  fetch('/search?q=${query}')
  .then(response => response.json())
  .then(data => {
    const results = document.getElementbyId('results');
    results.innerHTML = '';
    data.recipes.forEach(recipe => {
      const li = document.createElement('li');
      li.textContent = recipe.name;
      li.dataset.id = recipe.id;
      li.addEventListener('click', function(){
        fetch(`/recipe/${this.dataset.id}`)
        .then(response => response.json())
        .then(data => {
          alert (`Ingredients: ${data.recipe.ingredients}\nInstructions: ${data.recipe.instructions}`);

        )};
      )};
    results.appendChild(li);
  )};
)};
)};


