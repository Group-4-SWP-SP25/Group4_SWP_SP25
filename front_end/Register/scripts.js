const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get('email');
if (email != null) {
    document.getElementById('email').value = email;
    document.getElementById('email').setAttribute('readonly', true);
}

// Regex
const regexEmail = /^\w+@\w+(\.\w+)+$/; // Start with >1 word chars, then @, then >1 word chars, then (. and >1 word chars) >1 times
const regexPhone = /^0\d{9}$/; // Start with 0, follow by exact 9 digits
const regexPassword = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/; // Have at least 6 chars, include a-z, A-Z and 0-9
const regexUsername = /^[a-zA-Z0-9]{4,}$/; // Start with a-z, A-Z, 0-9, have at least 6 chars

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
    document.body.classList.toggle('no-scroll');
    setTimeout(() => {
        successWindow.classList.add('show');
    }, 10);
};
// Close success window
const closeSuccessWindow = function () {
    successWindow.classList.add('hidden');
    overlay.classList.add('hidden');
};

// Function
function checkName(nameTag, errorTag) {
    if (nameTag.value.trim().length === 0) {
        errorStyle(nameTag);
        contentError(errorTag, 'Name cannot be empty!');
        return false;
    } else {
        successStyle(nameTag);
        contentError(errorTag, '');
    }
    return true;
}

async function checkEmail(emailTag, errorTag) {
    if (emailTag.value.trim().length === 0) {
        errorStyle(emailTag);
        contentError(errorTag, 'Email cannot be empty!');
        return false;
    } else {
        if (!regexEmail.test(emailTag.value.trim())) {
            errorStyle(emailTag);
            contentError(errorTag, 'Invalid email!');
            return false;
        } else {
            const checkEmail = await fetch('http://localhost:3000/checkAccount', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accountType: 'Email', account: emailTag.value })
            });
            if (checkEmail.status === 404) {
                errorStyle(emailTag);
                contentError(errorTag, 'Email is already taken!');
                return false;
            } else {
                successStyle(emailTag);
                contentError(errorTag, '');
            }
        }
        return true;
    }
}

async function checkPhone(phoneTag, errorTag) {
    if (phoneTag.value.trim().length > 0) {
        if (!regexPhone.test(phoneTag.value.trim())) {
            errorStyle(phoneTag);
            contentError(errorTag, 'Invalid phone number!');
            return false;
        } else {
            const checkPhone = await fetch('http://localhost:3000/checkAccount', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accountType: 'Phone', account: phoneTag.value })
            });
            if (checkPhone.status === 404) {
                errorStyle(phoneTag);
                contentError(errorTag, 'Phone number is already taken!');
                return false;
            } else {
                successStyle(phoneTag);
                contentError(errorTag, '');
            }
        }
    }
    return true;
}

async function checkUsername(usernameTag, errorTag) {
    if (usernameTag.value.trim().length === 0) {
        errorStyle(usernameTag);
        contentError(errorTag, 'Username cannot be empty!');
        return false;
    }
    if (!regexUsername.test(usernameTag.value.trim())) {
        errorStyle(usernameTag);
        contentError(errorTag, 'Invalid username!');
        return false;
    } else {
        successStyle(usernameTag);
        contentError(errorTag, '');
    }

    if (usernameTag.value.includes(' ')) {
        contentError(errorTag, 'The username must not contain spaces!');
        errorStyle(usernameTag);
        return false;
    }

    const checkUsername = await fetch('http://localhost:3000/checkAccount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            accountType: 'UserName',
            account: usernameTag.value
        })
    });

    if (checkUsername.status === 404) {
        errorStyle(usernameTag);
        contentError(errorTag, 'Username is already taken!');
        return false;
    }
    return true;
}

function checkPassword(passwordTag, errorTag) {
    if (passwordTag.value.trim().length === 0) {
        errorStyle(passwordTag);
        if (passwordTag === passwordInput) {
            contentError(errorTag, 'Password cannot be empty!');
        } else {
            contentError(errorTag, 'You have not confirmed to change password!');
        }
        return false;
    }

    if (!regexPassword.test(passwordTag.value)) {
        errorStyle(passwordTag);
        contentError(errorTag, 'Invalid password');
        return false;
    }

    if (passwordTag.value.includes(' ')) {
        contentError(errorTag, 'The password must not contain spaces!');
        errorStyle(passwordTag);
        return false;
    } else {
        successStyle(passwordTag);
        contentError(errorTag, '');
    }

    if ((passwordTag === repasswordInput && regexPassword.test(repasswordInput.value)) || (passwordTag === passwordInput && repasswordInput.value.length > 0)) {
        if (repasswordInput.value !== passwordInput.value) {
            errorStyle(repasswordInput);
            contentError(repasswordError, 'The password do not match!');
            return false;
        } else {
            successStyle(repasswordInput);
            contentError(repasswordError, '');
        }
    }
    return true;
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

async function checkSubmit() {
    const firstName = checkName(firstNameInput, firstNameError);
    const lastName = checkName(lastNameInput, lastNameError);
    const email = await checkEmail(emailInput, emailError);
    const phone = await checkPhone(phoneInput, phoneError);
    const username = await checkUsername(usernameInput, usernameError);
    const password = checkPassword(passwordInput, passwordError);
    const repassword = checkPassword(repasswordInput, repasswordError);
    if (!(firstName && lastName && email && phone && username && password && repassword)) {
        return;
    } else {
        response = await fetch('http://localhost:3000/register', {
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
        });
        showSuccessWindow();
    }
}

document.getElementById('register-button').addEventListener('click', checkSubmit);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && successWindow.classList.contains('hidden')) {
        checkSubmit();
    }
    if (e.key === 'Enter' && !successWindow.classList.contains('hidden')) {
        window.location.href = '../HomePage/HomePage.html';
    }
});
