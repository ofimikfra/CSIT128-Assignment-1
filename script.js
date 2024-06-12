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

    return true;
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

    return true;
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