// Get input tag
const oldPassInput = document.querySelector("#oldPassword");
const newPassInput = document.querySelector("#newPassword");
const confirmPassInput = document.querySelector("#confirmPassword");
const userId = document.querySelector("#userId");

// Get error tag
const e_oldPass = document.querySelector(".e_oldPassword");
const e_newPass = document.querySelector(".e_newPassword");
const e_confirmPass = document.querySelector(".e_confirmPassword");

// The password must be at least 6 characters and must contain both numbers and letters
const regexPassword = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
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
  document.body.classList.toggle("no-scroll");
  setTimeout(() => {
    successWindow.classList.add("show");
  }, 10);
};

// Show/Hide password
function showHidePass(icon, passField) {
  icon.classList.toggle("fa-eye");
  icon.classList.toggle("fa-eye-slash");

  const type =
    passField.getAttribute("type") === "password" ? "text" : "password";
  passField.setAttribute("type", type);
}
document.querySelector(".show-oldPass").addEventListener("click", function () {
  showHidePass(this, oldPassInput);
});
document.querySelector(".show-newPass").addEventListener("click", function () {
  showHidePass(this, newPassInput);
});
document
  .querySelector(".show-confirmPass")
  .addEventListener("click", function () {
    showHidePass(this, confirmPassInput);
  });

// Check password in tags
async function checkPassword(pass, err) {
  if (pass.value.length === 0) {
    errorStyle(pass);
    if (pass === oldPassInput || pass === newPassInput) {
      contentError(err, "Please enter password!");
    } else {
      contentError(err, "You have not confirmed to change password!");
    }
    return false;
  }
  if (!regexPassword.test(pass.value)) {
    contentError(
      err,
      "The password must be at least 6 characters and must contain both numbers and letters"
    );
    errorStyle(pass);
    return false;
  }

  if (pass.value.includes(" ")) {
    contentError(err, "The password must not contain spaces!");
    errorStyle(pass);
    return false;
  }

  if (pass === oldPassInput) {
    const response = await fetch("http://localhost:3000/getUserInfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const result = await response.json();

    const password = await fetch("http://localhost:3000/getPassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID: result.id }),
    });
    const pass = await password.json();
    if (pass.Password !== oldPassInput.value) {
      errorStyle(oldPassInput);
      contentError(e_oldPass, "The password is incorrect!");
      return false;
    } else {
      successStyle(oldPassInput);
      contentError(e_oldPass, "");
    }
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
      return false;
    } else {
      successStyle(newPassInput);
      contentError(e_newPass, "");
    }
  }

  if (
    (pass === confirmPassInput && regexPassword.test(confirmPassInput.value)) ||
    (pass === newPassInput && confirmPassInput.value.length > 0)
  ) {
    if (confirmPassInput.value !== newPassInput.value) {
      errorStyle(confirmPassInput);
      contentError(e_confirmPass, "The password do not match!");
      return false;
    } else {
      successStyle(confirmPassInput);
      contentError(e_confirmPass, "");
    }
  }

  return true;
}

async function checkSubmit() {
  const checkOldPass = await checkPassword(oldPassInput, e_oldPass);
  const checkNewPass = await checkPassword(newPassInput, e_newPass);
  const checkConfirmPass = await checkPassword(confirmPassInput, e_confirmPass);

  if (!(checkOldPass && checkNewPass && checkConfirmPass)) {
    return;
  } else {
    const response = await fetch("http://localhost:3000/getUserInfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const result = await response.json();

    fetch("http://localhost:3000/changePassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        account: result.account,
        newPassword: newPassInput.value,
        oldPassword: oldPassInput.value,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json();
        }
        return response.json();
      })
      .then((data) => {
        showSuccessWindow();
      })
      .catch((error) => {
        throw error;
      });
  }
}

document.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && successWindow.classList.contains("hidden")) {
    checkSubmit();
  }
  if (e.key === "Enter" && !successWindow.classList.contains("hidden")) {
    window.location.href = "../HomePage/HomePage.html";
  }
});
