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
function checkEmail(emailTag, errorTag) {
    if (emailTag.value.trim().length === 0) {
        errorStyle(emailTag);
        contentError(errorTag, 'Please fill your email!');
    } else {
        if (!regexEmail.test(emailTag.value.trim())) {
            errorStyle(emailTag);
            contentError(errorTag, 'Invalid email!');
        } else {
            successStyle(emailTag);
            contentError(errorTag, '');
        }
    }
}

function checkUsername(usernameTag, errorTag) {
    if (usernameTag.value.trim().length === 0) {
        errorStyle(usernameTag);
        contentError(errorTag, 'Please fill your username!');
    } else {
        contentError(errorTag, '');
    }
}

function checkPassword() {}
