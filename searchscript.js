document.addEventListener("DOMContentLoaded", function() {
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("submit");
  const resultsList = document.getElementById("results");

  searchButton.addEventListener("click", function() {
      const searchTerm = searchInput.value.trim();

      // Clear previous search results
      resultsList.innerHTML = "";

      // Make sure search term is not empty
      if (searchTerm !== "") {
          searchRecipes(searchTerm);
      } else {
          // Display message if search term is empty
          resultsList.innerHTML = "<li>No search term entered.</li>";
      }
  });

  function searchRecipes(searchTerm) {
      // Construct URL for API endpoint (adjust based on your server implementation)
      const url = `/api/search?q=${encodeURIComponent(searchTerm)}`;

      // Fetch data from server
      fetch(url)
          .then(response => {
              if (!response.ok) {
                  throw new Error(`Network response was not ok: ${response.status}`);
              }
              return response.json();
          })
          .then(data => {
              displayResults(data.recipes);
          })
          .catch(error => {
              console.error('Error fetching data:', error);
              resultsList.innerHTML = "<li>Failed to fetch search results.</li>";
          });
  }

  function displayResults(recipes) {
      if (!recipes || recipes.length === 0) {
          resultsList.innerHTML = "<li>No recipes found.</li>";
      } else {
          recipes.forEach(recipe => {
              const li = document.createElement("li");
              li.textContent = recipe.name; // Adjust based on your recipe object structure
              resultsList.appendChild(li);
          });
      }
  }
});
