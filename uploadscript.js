const uploadForm = document.getElementById('uploadForm');
const recipesList = document.getElementById('recipes-list');
const messageDiv = document.getElementById('message');

uploadForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(uploadForm);
  fetch('/upload', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then((data) => {
    if (data.success) {
      messageDiv.textContent = 'Recipe uploaded successfully!';
      // Display the uploaded recipe in the recipes list
      const recipeHTML = `
        <div>
          <h2>${data.recipe.name}</h2>
          <p>Ingredients: ${data.recipe.ingredients}</p>
          <p>Instructions: ${data.recipe.instructions}</p>
          <img src="${data.recipe.imageUrl}" alt="Recipe Image">
        </div>
      `;
      recipesList.innerHTML += recipeHTML;
    } else {
      messageDiv.textContent = 'Failed to upload recipe';
    }
  })
  .catch((error) => {
    console.error('Error uploading recipe:', error);
    messageDiv.textContent = 'Failed to upload recipe';
  });
});