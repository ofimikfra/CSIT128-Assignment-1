function validateForm() {
    // check email format
    var email = document.forms["login"]["email"]
    if (/\w\S+@\S+(\.\S+){1,}/.test(email) == false) {
        alert("Please enter a valid email address.")
        document.getElementsByName(email).style.border = "2px solid red";
    } else {
        document.getElementsByName(email).style.border = 0;
    }

    // check password reqs
    var pass = document.forms["login"]["password"].value;
    let upper = false;
    let num = false;
    let special = false;

    for (let i = 0; i < pass.length; i++) {
        if (pass[i] == pass[i].toUpperCase()) { upper = true; }
        else if (/^\d$/.test(pass[i])) { num = true; }
        else if (/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(pass[i]) == true) { special = true; }
    }

    if ((upper && num && special) == false) { 
        document.getElementsByName(password).style.border = "2px solid red";
        document.getElementById(info).textContent = "ⓘ Password must contain a captial letter, a digit, and a special character.";
        document.getElementById(info).style.color = "red";
        return false;
    } else {
        document.getElementById(info).style.color = "lightgrey";
        document.getElementsByName(password).style.border = 0;
    }

    // check if passwords match
    var confirm = document.forms["login"]["confirm"].value;
    if (confirm.trim() != pass.trim()) {
        document.getElementById(conf).style.border = "2px solid red";
        document.getElementById(match).textContent = "ⓘ Password does not match.";
        document.getElementById(info).style.color = "red";
        return false;
    } else {
        document.getElementById(conf).style.border = 0;
        document.getElementById(match).textContent = "ⓘ Passwords match.";
        document.getElementById(info).style.color = "lime";
    }

    var form = document.getElementsByName("login");
    for (let i = 0; i < form.elements.length; i++) { 
        if (!form.elements[i].value) { 
            return false;
        } 
    } 
    
    return true;
}