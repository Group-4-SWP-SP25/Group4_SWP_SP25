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

// Tags
// Input field
const firstNameInput = document.querySelector('#firstName');
const lastNameInput = document.querySelector('#lastName');
const emailInput = document.querySelector('#email');
const phoneInput = document.querySelector('#phone');
const addressInput = document.querySelector('#address');
const dobInput = document.querySelector('#dob');
const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');
const repasswordInput = document.querySelector('#repassword');
// Error field
const firstNameError = document.querySelector('.e_firstName');
const lastNameError = document.querySelector('.e_lastName');
const emailError = document.querySelector('.e_email');
const phoneError = document.querySelector('.e_phone');
const addressError = document.querySelector('.e_address');
const dobError = document.querySelector('.e_dob');
const usernameError = document.querySelector('.e_username');
const passwordError = document.querySelector('.e_password');
const repasswordError = document.querySelector('.e_repassword');

// Support functions
const errorStyle = function (tag) {
    // Style errors in tags
    tag.style.borderColor = 'red';
    tag.style.boxShadow = '0 0 5px red';
};

const successStyle = function (tag) {
    // Style success in tags
    tag.style.borderColor = 'green';
    tag.style.boxShadow = '0 0 5px green';
};

const contentError = function (tag, err) {
    // Content errors in tags
    tag.textContent = err;
};

const successWindow = document.querySelector('.success');
const overlay = document.querySelector('.overlay');
const showSuccessWindow = function () {
    // Show success window
    successWindow.classList.remove('hidden');
    overlay.classList.remove('hidden');
    document.body.classList.toggle('no-scroll');
    setTimeout(() => {
        successWindow.classList.add('show');
    }, 10);
};

const closeSuccessWindow = function () {
    // Close success window
    successWindow.classList.add('hidden');
    overlay.classList.add('hidden');
};

function showHidePass(icon, passField) {
    // Toggle password visibility
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

// const calculateAge = (dob, today) => {
//     // Calculate age
//     const getFullYears = (dob, today) => {
//         let age = today.getFullYear() - dob.getFullYear();
//         const monthDiff = today.getMonth() - dob.getMonth();

//         if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
//             age--;
//         }
//         return age;
//     };
//     return getFullYears(dob, today);
// };

// Check functions
function checkName(nameTag, errorTag) {
    // Check name
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
    // Check email
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
    // Check phone
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

function checkDOB(dobTag, errorTag) {
    // Check date of birth
    if (!dobTag.value) {
        errorStyle(dobTag);
        contentError(errorTag, 'Date of Birth cannot be empty!');
        return false;
    }

    const dob = new Date(dobTag.value);
    const today = new Date();

    // Calculate age directly within checkDOB
    const calculateAge = (dob, today) => {
        const getFullYears = (dob, today) => {
            let age = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                age--;
            }
            return age;
        };
        return getFullYears(dob, today);
    };

    const age = calculateAge(dob, today);

    if (age < 18 || age > 75) {
        errorStyle(dobTag);
        contentError(errorTag, 'Age must be between 18 and 75.'); //Sửa lại message cho hợp lý
        return false;
    } else {
        successStyle(dobTag); //Sửa phoneTag thành dobTag
        contentError(errorTag, '');
        return true;
    }
}

async function checkUsername(usernameTag, errorTag) {
    // Check username
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
    // Check password
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

async function checkSubmit() {
    const firstName = checkName(firstNameInput, firstNameError);
    const lastName = checkName(lastNameInput, lastNameError);
    const email = await checkEmail(emailInput, emailError);
    const phone = await checkPhone(phoneInput, phoneError);
    const dob = checkDOB(dobInput, dobError);
    const username = await checkUsername(usernameInput, usernameError);
    const password = checkPassword(passwordInput, passwordError);
    const repassword = checkPassword(repasswordInput, repasswordError);
    if (!(firstName && lastName && email && phone && dob && username && password && repassword)) {
        return;
    } else {
        await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: usernameInput.value,
                password: passwordInput.value,
                firstName: firstNameInput.value,
                lastName: lastNameInput.value,
                email: emailInput.value,
                address: addressInput.value,
                phone: phoneInput.value,
                dob: dobInput.value
            })
        });
        showSuccessWindow();
    }
}

// Submit button
document.getElementById('register-button').addEventListener('click', checkSubmit);
document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && successWindow.classList.contains('hidden')) {
        checkSubmit();
    }
    if (e.key === 'Enter' && !successWindow.classList.contains('hidden')) {
        window.location.href = '../HomePage/HomePage.html';
    }
});
