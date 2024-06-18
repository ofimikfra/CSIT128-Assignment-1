document.addEventListener("DOMContentLoaded", function() {
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

    if (password && confirm) {
        password.addEventListener("input", checkPasswordMatch);
        confirm.addEventListener("input", checkPasswordMatch);
    }
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
        document.getElementById("err").textContent = ""
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
        info.textContent = "ⓘ Password must contain a capital letter, a digit, and a special character.";
        info.style.color = "red";
        return false;
    } else {
        info.style.color = "lightgrey";
        form["password"].style.border = "none";
    }

    // check if passwords match
    if (conf.trim() !== psw.trim()) {
        return false;
    } 

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/authregister", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // Response received
                let response = JSON.parse(xhr.responseText);
                if (!response.success) {
                    info.textContent = response.message;
                } else {
                    info.textContent = "";
                    window.location.href = "/index.html";
                }
            } else {
                console.error("Error:", xhr.status);
            }
        }
    };
    
    // Send form data to server
    let formData = new FormData(form);
    xhr.send(JSON.stringify(Object.fromEntries(formData)));
    return false; // Prevent default form submission
}


function validateLogin() {
    // form elements
    let form = document.forms["login"];
    let loginFields = ["loguser", "logpassword"];
    let info = document.getElementById("loginInfo");

    // check if empty
    if (checkEmpty(form, loginFields)) {
        info.textContent = "ⓘ Please fill out the empty fields.";
        return false;
    }

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/authlogin", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function(err) {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // Response received
                let response = JSON.parse(xhr.responseText);
                if (!response.success) {
                    info.textContent = response.message;
                } else {
                    info.textContent = "";
                    window.location.href = "/index.html";
                }
            } else {
                throw err;
            }
        }
    };
    
    // Send form data to server
    let formData = new FormData(form);
    xhr.send(JSON.stringify(Object.fromEntries(formData)));
    return false; // Prevent default form submission
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