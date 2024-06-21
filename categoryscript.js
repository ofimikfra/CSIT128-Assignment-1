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

    document.getElementById("edit-category-button").addEventListener("click", (event) => {
        event.preventDefault();
        const categoryId = document.getElementById("category-dropdown").value;
        const newCategoryName = prompt("Enter new category name:");
        editCategory(categoryId, newCategoryName);
    });

    document.getElementById("delete-category-button").addEventListener("click", (event) => {
        event.preventDefault();
        const categoryId = document.getElementById("category-dropdown").value;
        deleteCategory(categoryId);
    });

    // Display categories
    const catDisplayDiv = document.querySelector('.catDisplay');
    catDisplayDiv.innerHTML = `<h1>Your Categories</h1>${catHTML}`;
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
                    catDisplayDiv.innerHTML = `<h1>Your Categories</h1>${catHTML}`;
                }
            } else {
                console.error("Error:", xhr.status);
            }
        };

        let formData = { categoryName: newCategoryName };
        xhr.send(JSON.stringify(formData));
    }
}

