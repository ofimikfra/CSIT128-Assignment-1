/* i tried doing the thing where you dynamically update the html like in yesterday's lab but it didnt work for me  
  this is the client side js for recipes.html */

function displayRecipes(recipesHtml) {
  const recipeDisplay = document.getElementById("recipeDisplay");
  recipeDisplay.innerHTML = ""; 
  recipeDisplay.innerHTML = recipesHtml; 
}

// Create a new XMLHttpRequest object
const xhr = new XMLHttpRequest();

// Set the responseType to "json"
xhr.responseType = "json";

// Open a connection to the server
xhr.open("GET", "/recipes");

// Send the request
xhr.send();

// Define a callback function to handle the response
xhr.onload = function() {
  if (xhr.status === 200) {
      // Call the displayRecipes function with the recipesHtml property of the response object
      displayRecipes(xhr.response.recipesHtml);
  } else {
      console.error("Error:", xhr.statusText);
  }
};

// Define a callback function to handle errors
xhr.onerror = function() {
  console.error("Error:", xhr.statusText);
};