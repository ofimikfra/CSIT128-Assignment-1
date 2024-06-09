document.addEventListener("DOMContentLoaded", (event) => {
    const password = document.getElementById("password");
    const confirm = document.getElementById("confirm");
    const match = document.getElementById("match");

    function checkPasswordMatch() {
        if (password.value == "" || confirm.value == "") {
            match.textContent = "";
            confirm.style.border = "none";
        }
        else if (password.value == confirm.value) {
            confirm.style.border = "none";
            match.textContent = "ⓘ Passwords match.";
            match.style.color = "lime";
        } else {
            confirm.style.border = "2px solid red";
            match.textContent = "ⓘ Passwords do not match.";
            match.style.color = "red";
        }
    }

    password.addEventListener("input", checkPasswordMatch);
    confirm.addEventListener("input", checkPasswordMatch);
});

function validateRegister() {
    // form elements
    let form = document.forms["register"];
    let signupFields = ["fname", "lname", "username", "email", "password", "confirm"];
    let psw = form["password"].value;
    let conf = form["confirm"].value;
    let info = document.getElementById("regInfo");
    let matchInfo = document.getElementById("match");

    //check if empty
    if (checkEmpty(form, signupFields)) {
        document.getElementById("err").textContent = "ⓘ Please fill out the empty fields."
        return false;
    } else {
        document.getElementById("err").textContent = ";"
    }

    // check password reqs
    let upper = false;
    let num = false;
    let special = false;

    for (let i = 0; i < psw.length; i++) {
        if (psw[i] === psw[i].toUpperCase() && /[A-Z]/.test(psw[i])) { upper = true; }
        else if (/^\d$/.test(psw[i])) { num = true; }
        else if (/[!@#$]/.test(psw[i]) == true) { special = true; }
    }

    if ((upper && num && special) == false) { 
        form["password"].style.border = "2px solid red";
        info.textContent = "ⓘ Password must contain a captial letter, a digit, and a special character.";
        info.style.color = "red";
        return false;
    } else {
        info.style.color = "lightgrey";
        form["password"].style.border = "none";
    }

    // check if passwords match
    if (conf.trim() !== psw.trim()) {return false;} 

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/register", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = function () {
        if (xhr.status === 200) {
            document.getElementById("err").textContent = "";
            window.location.href = "/recipes.html"; // redirect to recipes page
        } else if (xhr.status === 401) {
            document.getElementById("err").textContent = "ⓘ User already exists, use another email or login."; // login details wrong
        } else {
            console.error("Error:", xhr.status);
        }
    };

    // send formdata to server.js
    let formData = JSON.stringify({
        fname: form.elements["fname"].value,
        lname: form.elements["lname"].value,
        username: form.elements["username"].value,
        email: form.elements["email"].value,
        password: form.elements["password"].value,
    });

    xhr.send(formData);

    return false; 
}

function validateLogin() {
    // form elements
    let form = document.forms["login"];
    let loginFields = ["useremail", "logpassword"];
    let info = document.getElementById("loginInfo");

    // check if empty
    if (checkEmpty(form, loginFields)) {
        document.getElementById("loginInfo").textContent = "ⓘ Please fill out the empty fields.";
        return false;
    }

    // Make an AJAX request to server for login
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/login", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = function () {
        if (xhr.status === 200) {
            document.getElementById("loginInfo").textContent = ""
            window.location.href = "/recipes.html"; // redirect to recipes page
        } else if (xhr.status === 401) {
            document.getElementById("loginInfo").textContent = "ⓘ Username, email, or password is wrong."; // login details wrong
        } else {
            console.error("Error:", xhr.status);
        }
    };

    // send formdata to server.js
    let formData = JSON.stringify({
        useremail: form.elements["useremail"].value,
        password: form.elements["logpassword"].value
    });

    xhr.send(formData);

    return false; 
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
    if (isEmpty) {return true;}
}