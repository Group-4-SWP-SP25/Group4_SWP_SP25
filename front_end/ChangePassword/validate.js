// Get input tag
const oldPassInput = document.querySelector("#oldPassword");
const newPassInput = document.querySelector("#newPassword");
const confirmPassInput = document.querySelector("#confirmPassword");

// Get error tag
const e_oldPass = document.querySelector(".e_oldPassword");
const e_newPass = document.querySelector(".e_newPassword");
const e_confirmPass = document.querySelector(".e_confirmPassword");

// The password must be at least 6 characters and must contain both numbers and letters
const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

// Style errors in tags
const errorStyle = function (tag) {
  tag.style.borderColor = "red";
  tag.style.boxShadow = "0 0 5px red";
};

// Style success in tags
const successStyle = function (tag) {
  tag.style.borderColor = "green";
  tag.style.boxShadow = "0 0 5px green";
};

// Content errors in tags
const contentError = function (tag, err) {
  tag.textContent = err;
};

// Show success window
const successWindow = document.querySelector(".success");
const overlay = document.querySelector(".overlay");
const showSuccessWindow = function () {
  successWindow.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

// Close success window
const closeSuccessWindow = function () {
  successWindow.classList.add("hidden");
  overlay.classList.add("hidden");
};

// Check password in tags
let checkValidate = true;
function checkPassword(pass, err) {
  if (pass.value.length === 0) {
    errorStyle(pass);
    if (pass === oldPassInput || pass === newPassInput) {
      contentError(err, "Please enter password!");
    } else {
      contentError(err, "You have not confirmed your password!");
    }
    checkValidate = false;
    return;
  }
  if (!regexPassword.test(pass.value)) {
    contentError(
      err,
      "The password must be at least 6 characters and must contain both numbers and letters!"
    );
    errorStyle(pass);
    checkValidate = false;
  } else {
    contentError(err, "");
    successStyle(pass);
    checkValidate = true;
  }

  if (
    (pass === newPassInput && regexPassword.test(newPassInput.value)) ||
    (pass === oldPassInput && regexPassword.test(newPassInput.value))
  ) {
    if (oldPassInput.value === newPassInput.value) {
      errorStyle(newPassInput);
      contentError(
        e_newPass,
        "The new password must be different from old password!"
      );
      checkValidate = false;
    } else {
      successStyle(newPassInput);
      contentError(e_newPass, "");
      checkValidate = true;
    }
  }
  if (
    (pass === confirmPassInput && regexPassword.test(confirmPassInput)) ||
    (pass === newPassInput && confirmPassInput.value.length > 0)
  ) {
    if (confirmPassInput.value !== newPassInput.value) {
      errorStyle(confirmPassInput);
      contentError(e_confirmPass, "The password do not match!");
      checkValidate = false;
    } else {
      successStyle(confirmPassInput);
      contentError(e_confirmPass, "");
      checkValidate = true;
    }
  }
}

var form = document.querySelector(".form");
function checkSubmit() {
  checkPassword(oldPassInput, e_oldPass);
  checkPassword(newPassInput, e_newPass);
  checkPassword(confirmPassInput, e_confirmPass);
  if (!checkValidate) {
    return;
  } else {
    showSuccessWindow();
  }
}

document.addEventListener("keydown", function (e) {
  console.log(e.key);
  if (e.key === "Enter" && successWindow.classList.contains("hidden")) {
    checkSubmit();
  }
});
