// Regex: Email
const regexEmail = /^\w+@\w+(\.\w+)+$/; // Start with >1 word chars, then @, then >1 word chars, then (. and >1 word chars) >1 times
const regexPhone = /^0\d{9}$/; // Start with 0, follow by exact 9 digits
const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[^\s]{6,}$/; // Have at least 6 chars, include a-z, A-Z and 0-9

// Tag: Input field
const firstNameInput = document.querySelector('#firstName');
const lastNameInput = document.querySelector('#lastName');
const emailInput = document.querySelector('#email');
const phoneInput = document.querySelector('#phone');
const addressInput = document.querySelector('#address');
const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');
const repasswordInput = document.querySelector('#repassword');

// Tag: Error
const firstNameError = document.querySelector('.e_firstName');
const lastNameError = document.querySelector('.e_lastName');
const emailError = document.querySelector('.e_email');
const phoneError = document.querySelector('.e_phone');
const addressError = document.querySelector('.e_address');
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

// Show success window
const successWindow = document.querySelector('.success');
const overlay = document.querySelector('.overlay');
const showSuccessWindow = function () {
    successWindow.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

// Close success window
const closeSuccessWindow = function () {
    successWindow.classList.add('hidden');
    overlay.classList.add('hidden');
};

// Function
let nameOK = true;
function checkName(nameTag, errorTag) {
    if (nameTag.value.trim().length === 0) {
        errorStyle(nameTag);
        contentError(errorTag, 'Name cannot be empty!');
        nameOK = false;
        // console.log('name');
    } else {
        successStyle(nameTag);
        contentError(errorTag, '');
        nameOK = true;
    }
}

let emailOK = true;
function checkEmail(emailTag, errorTag) {
    if (emailTag.value.trim().length === 0) {
        errorStyle(emailTag);
        contentError(errorTag, 'Email cannot be empty!');
        emailOK = false;
        // console.log('email');
    } else {
        if (!regexEmail.test(emailTag.value.trim())) {
            errorStyle(emailTag);
            contentError(errorTag, 'Invalid email!');
            emailOK = false;
            // console.log('email');
        } else {
            successStyle(emailTag);
            contentError(errorTag, '');
            emailOK = true;
        }
    }
}

let phoneOK = true;
function checkPhone(phoneTag, errorTag) {
    if (phoneTag.value.trim().length > 0) {
        if (!regexPhone.test(phoneTag.value.trim())) {
            errorStyle(phoneTag);
            contentError(errorTag, 'Invalid phone number!');
            phoneOK = false;
            // console.log('phone');
        } else {
            successStyle(phoneTag);
            contentError(errorTag, '');
            phoneOK = true;
        }
    } else {
        contentError(errorTag, '');
        phoneTag.style.borderColor = 'transparent';
        phoneTag.style.boxShadow = 'none';
        phoneOK = true;
    }
}

// function checkAddress(addressTag, errorTag) {
//     if (addressTag.value.trim().length === 0) {
//         errorStyle(addressTag);
//         contentError(errorTag, 'Address cannot be empty!');
//         validate = false;
//     } else {
//         successStyle(addressTag);
//         contentError(errorTag, '');
//         validate = true;
//     }
// }

let usernameOK = true;
function checkUsername(usernameTag, errorTag) {
    if (usernameTag.value.trim().length === 0) {
        errorStyle(usernameTag);
        contentError(errorTag, 'Username cannot be empty!');
        usernameOK = false;
        // console.log('username');
    } else {
        successStyle(usernameTag);
        contentError(errorTag, '');
        usernameOK = true;
    }
}

let pwdOK = true;
function checkPassword(passwordTag, errorTag) {
    if (passwordTag.value.trim().length === 0) {
        errorStyle(passwordTag);
        contentError(errorTag, 'Password cannot be empty!');
        pwdOK = false;
        // console.log('pwd1');
        return;
    }
    if (!regexPassword.test(passwordTag.value.trim())) {
        errorStyle(passwordTag);
        contentError(errorTag, 'Invalid password');
        pwdOK = false;
        // console.log('pwd2');
    } else {
        successStyle(passwordTag);
        contentError(errorTag, '');
        pwdOK = true;
    }

    if ((passwordTag === repasswordInput && regexPassword.test(repasswordInput.value)) || (passwordTag === passwordInput && repasswordInput.value.length > 0)) {
        if (repasswordInput.value !== passwordInput.value) {
            errorStyle(repasswordInput);
            contentError(repasswordError, 'The password do not match!');
            pwdOK = false;
            // console.log('pwd3');
        } else {
            successStyle(repasswordInput);
            contentError(repasswordError, '');
            pwdOK = true;
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

function showHidePass(icon, passField) {
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');

    const type = passField.getAttribute('type') === 'password' ? 'text' : 'password';
    passField.setAttribute('type', type);
}
document.querySelector('.show-pwd').addEventListener('click', function () {
    showHidePass(this, passwordInput);
});
document.querySelector('.show-repwd').addEventListener('click', function () {
    showHidePass(this, repasswordInput);
});

function checkSubmit() {
    checkName(firstNameInput, firstNameError);
    checkName(lastNameInput, lastNameError);
    checkEmail(emailInput, emailError);
    checkPhone(phoneInput, phoneError);
    checkUsername(usernameInput, usernameError);
    checkPassword(passwordInput, passwordError);
    checkPassword(repasswordInput, repasswordError);
    if (!(nameOK && emailOK && phoneOK && usernameOK && pwdOK)) {
        return;
    } else {
        // data = {
        //     firstName: firstNameInput.value,
        //     lastName: lastNameInput.value,
        //     email: emailInput.value,
        //     phone: phoneInput.value,
        //     address: addressInput.value,
        //     username: usernameInput.value,
        //     password: passwordInput.value
        // };
        // console.log(data);

        fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: firstNameInput.value,
                lastName: lastNameInput.value,
                email: emailInput.value,
                phone: phoneInput.value,
                address: addressInput.value,
                username: usernameInput.value,
                password: passwordInput.value
            })
        })
            .then((response) => {
                return response.status();
            })
            .then((data) => {
                console.log(data);
                if (data == 200) {
                    showSuccessWindow();
                }
                if (data == 400) {
                    console.log('Create account error');
                    errorStyle(passwordInput);
                    contentError(passwordInput, data.error);
                }
            })
            .catch((error) => {
                throw error;
            });

        // showSuccessWindow();
    }
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && successWindow.classList.contains('hidden')) {
        checkSubmit();
    }
    if (e.key === 'Enter' && !successWindow.classList.contains('hidden')) {
        window.location.href = '../HomePage/HomePage.html';
    }
});
