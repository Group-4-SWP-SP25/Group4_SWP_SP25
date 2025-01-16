// Regex: Email
const regexEmail = /^\w+@\w+(\.\w+)+$/;
const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

// Tag: Input field
const emailInput = document.querySelector('#email');
const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');
const repasswordInput = document.querySelector('#repassword');

// Tag: Error
const emailError = document.querySelector('.e_email');
const usernameError = document.querySelector('.e_username');
const passwordError = document.querySelector('.e_password');
const repasswordError = document.querySelector('.e_repassword');

// Style errors in tags
const errorStyle = function (tag) {
    tag.style.borderColor = 'red';
    tag.style.boxShadow = '0 0 5px red';
};

// Style success in tags
const successStyle = function (tag) {
    tag.style.borderColor = 'green';
    tag.style.boxShadow = '0 0 5px green';
};

// Content errors in tags
const contentError = function (tag, err) {
    tag.textContent = err;
};

// Function
let validate = true;

function checkEmail(emailTag, errorTag) {
    if (emailTag.value.trim().length === 0) {
        errorStyle(emailTag);
        contentError(errorTag, 'Email cannot be empty!');
        validate = false;
    } else {
        if (!regexEmail.test(emailTag.value.trim())) {
            errorStyle(emailTag);
            contentError(errorTag, 'Invalid email!');
            validate = false;
        } else {
            successStyle(emailTag);
            contentError(errorTag, '');
            validate = true;
        }
    }
}

function checkUsername(usernameTag, errorTag) {
    if (usernameTag.value.trim().length === 0) {
        errorStyle(usernameTag);
        contentError(errorTag, 'Username cannot be empty!');
        validate = false;
    } else {
        contentError(errorTag, '');
        validate = true;
    }
}
function checkPassword(passwordTag, errorTag) {
    if (passwordTag.value.trim().length === 0) {
        errorStyle(passwordTag);
        contentError(errorTag, 'Password cannot be empty!');
        validate = false;
        return;
    }
    if (!regexPassword.test(passwordTag.value.trim())) {
        errorStyle(passwordTag);
        contentError(errorTag, 'Invalid password');
        validate = false;
    } else {
        successStyle(passwordTag);
        contentError(errorTag, '');
        validate = true;
    }

    if (
        (passwordTag === repasswordInput &&
            regexPassword.test(repasswordInput.value)) ||
        (passwordTag === passwordInput && repasswordInput.value.length > 0)
    ) {
        if (repasswordInput.value !== pas.value) {
            errorStyle(repasswordInput);
            contentError(repasswordError, 'The password do not match!');
            checkValidate = false;
        } else {
            successStyle(repasswordInput);
            contentError(repasswordError, '');
            checkValidate = true;
        }
    }
}

function hidePassword(hideTag, toggleTag) {
    if (toggleTag.checked === true) {
        hideTag.type = 'text';
    } else {
        hideTag.type = 'password';
    }
}
