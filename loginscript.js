document.addEventListener("DOMContentLoaded", function() {
    const password = document.getElementById("password");
    const confirm = document.getElementById("confirm");
    const match = document.getElementById("match");

    function checkPasswordMatch() {
        if (password.value === "" || confirm.value === "") {
            match.textContent = "";
            confirm.style.border = "none";
        } else if (password.value === confirm.value) {
            confirm.style.border = "none";
            match.textContent = "ⓘ Passwords match.";
            match.style.color = "lime";
        } else {
            confirm.style.border = "2px solid red";
            match.textContent = "ⓘ Passwords do not match.";
            match.style.color = "red";
        }
    }

    if (password && confirm) {
        password.addEventListener("input", checkPasswordMatch);
        confirm.addEventListener("input", checkPasswordMatch);
    }
});

function validateRegister() {
    let form = document.forms["register"];
    let signupFields = ["fname", "lname", "username", "email", "password", "confirm"];
    let psw = form["password"].value;
    let conf = form["confirm"].value;
    let info = document.getElementById("regInfo");

    // Check if empty fields
    if (checkEmpty(form, signupFields)) {
        info.textContent = "ⓘ Please fill out all required fields.";
        return false;
    } else {
        info.textContent = "";
    }

    // Validate password requirements
    if (!validatePassword(psw)) {
        info.textContent = "ⓘ Password must contain at least one uppercase letter, one digit, and one special character (!@#$).";
        return false;
    } else {
        info.textContent = "";
    }

    // Check if passwords match
    if (conf.trim() !== psw.trim()) {
        info.textContent = "ⓘ Passwords do not match.";
        return false;
    } else {
        info.textContent = "";
    }

    // Prepare and send data to server
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/authregister", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Cookie", `sessionID=${getCookie("sessionID")}`); // Send session ID in request headers

    xhr.onload = function() {
        if (xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);
            if (!response.success) {
                info.textContent = response.message;
            } else {
                info.textContent = "";
                alert("Successfully signed up! Return to hompage and click 'Upload Recipes' to upload recipes.")
                location.replace("/recipes.html");
            }
        } else {
            console.error("Error:", xhr.status);
        }
    };

    let formData = new FormData(form);
    xhr.send(JSON.stringify(Object.fromEntries(formData)));
}

function validateLogin() {
    let form = document.forms["login"];
    let loginFields = ["loguser", "logpassword"];
    let info = document.getElementById("loginInfo");

    // Check if empty fields
    if (checkEmpty(form, loginFields)) {
        info.textContent = "Please fill out all required fields.";
        return false;
    } else {
        info.textContent = "";
    }

    // Prepare and send data to server
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/authlogin", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Cookie", `sessionID=${getCookie("sessionID")}`); // Send session ID in request headers

    xhr.onload = function() {
        if (xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);
            if (!response.success) {
                info.textContent = response.message;
            } else {
                info.textContent = "";
                alert("Successfully logged in! Return to hompage and click 'Upload Recipes' to upload recipes.")
                location.replace("/recipes.html");
            }
        } else {
            console.error("Error:", xhr.status);
        }
    };

    let formData = new FormData(form);
    xhr.send(JSON.stringify(Object.fromEntries(formData)));
}

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

function checkEmpty(form, fields) {
    let isEmpty = false;

    for (let i = 0; i < fields.length; i++) {
        if (form[fields[i]].value.trim() === "") {
            form[fields[i]].style.border = "2px solid red";
            isEmpty = true;
        } else {
            form[fields[i]].style.border = "none";
        }
    }
    return isEmpty;
}

function validatePassword(password) {
    // Password must contain at least one uppercase letter, one digit, and one special character (!@#$)
    let upper = false;
    let num = false;
    let special = false;

    for (let i = 0; i < password.length; i++) {
        if (password[i] === password[i].toUpperCase() && /[A-Z]/.test(password[i])) {
            upper = true;
        } else if (/[0-9]/.test(password[i])) {
            num = true;
        } else if (/[!@#$]/.test(password[i])) {
            special = true;
        }
    }

    return upper && num && special;
}
