let categoryData = [];
var catHTML = "";

fetch('./categoryList.json')
.then(response => response.json())
.then(data => {
    categoryData = data;
    const dropdown = document.getElementById('category-dropdown');
    data.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.text = category.name;
        dropdown.add(option);

        catHTML += `<p>${category.name}</p>`;
    });

    // Add event listeners to buttons
    document.getElementById("add-button").addEventListener("click", (event) => {
        event.preventDefault();
        const newCategoryName = document.getElementById("new-category").value;
        addCategory(newCategoryName);
    });

    document.getElementById("delete-category-button").addEventListener("click", (event) => {
        const categoryId = document.getElementById("category-dropdown").value;
        fetch("/deletecategory", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ categoryId: categoryId }),
        })
     .then((response) => response.json())
     .then((data) => {
        if (data.success) {
            console.log("Categore deleted.")
          // Remove the category from the dropdown menu
          const dropdown = document.getElementById('category-dropdown');
          const option = dropdown.querySelector(`option[value="${categoryId}"]`);
          dropdown.removeChild(option);
          // Remove the category from the categoryData array
          categoryData = categoryData.filter(category => category.id!== categoryId);
          // Update the category display
          const catDisplayDiv = document.querySelector('.catDisplay');
          catHTML = "";
          categoryData.forEach(category => {
            catHTML += `<p>${category.name}</p>`;
          });
          catDisplayDiv.innerHTML = catHTML;
        } else {
          alert(data.message);
        }
      })
     .catch((error) => console.error(error));
    });

    // Display categories
    const catDisplayDiv = document.querySelector('.catDisplay');
    catDisplayDiv.innerHTML = catHTML;
})
.catch(error => console.error('Error:', error));

function addCategory(newCategoryName) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/addcategory", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    if (categoryData.some(category => category.name.toLowerCase() === newCategoryName.toLowerCase())) {
        alert("Category already exists.");
    } else {

        xhr.onload = function() {
            if (xhr.status === 200) {
                let response = JSON.parse(xhr.responseText);
                if (!response.success) {
                    alert(response.message);
                    location.replace("/categories.html");
                } else {
                    alert("New category added.");
                    const newCategoryId = response.newCategoryId;
                    categoryData.push({ id: newCategoryId, name: newCategoryName });
                    const dropdown = document.getElementById('category-dropdown');
                    const option = document.createElement('option');
                    option.value = newCategoryId;
                    option.text = newCategoryName;
                    dropdown.add(option);
                    catHTML += `<p>${newCategoryName}</p>`;
                    const catDisplayDiv = document.querySelector('.catDisplay');
                    catDisplayDiv.innerHTML = catHTML;
                }
            } else {
                console.error("Error:", xhr.status);
            }
        };

        let formData = { categoryName: newCategoryName };
        xhr.send(JSON.stringify(formData));
    }
}