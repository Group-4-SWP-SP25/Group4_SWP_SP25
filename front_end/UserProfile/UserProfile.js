let id = null;

async function getUserProfile() {
  try {
    // Lấy id ng dùng từ session
    const user = await $.ajax({
      url: "http://localhost:3000/getUserInfo",
      method: "POST",
      contentType: "application/json",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    id = user.id;
    // lấy thông tin người dùng
    const userInfo = await $.ajax({
      url: "http://localhost:3000/userInfo",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ userID: user.id }),
    });

    $("#userName").text(`${userInfo.FirstName} ${userInfo.LastName}`);
    $("input[placeholder='First name']").val(userInfo.FirstName);
    $("input[placeholder='Last name']").val(userInfo.LastName);
    $("input[placeholder='Enter phone']").val(userInfo.Phone);
    $("input[placeholder='Birthday']").val(formatDate(userInfo.DOB));
    $("input[placeholder='email']").val(userInfo.Email);
    $("input[placeholder='Somewhere']").val(userInfo.Address);

    // get avatar
    let linkAvatar = null;
    try {
      const response = await fetch('http://localhost:3000/getFileInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name: id })
      })
      const status = response.status;
      if (status == 200) {
        const result = await response.json();
        linkAvatar = result.avatar;
      }
    } catch (error) {
      console.log(error);
    }


    const profileImg = $(".profile_img");
    if (linkAvatar != null) {
      profileImg.attr("src", `https://drive.google.com/thumbnail?id=${linkAvatar}`);
    } else {
      profileImg.attr("src", "/resource/admin.jpg");
    }


  } catch (error) {
    console.error("Loading Error", error);
    alert("Cannot load user information, please try again!");
  }
}
function formatDate(dateString) {
  const date = new Date(dateString);
  return `${String(date.getDate()).padStart(2, "0")}/${String(
    date.getMonth() + 1
  ).padStart(2, "0")}/${date.getFullYear()}`;
}
getUserProfile();


$(".btn-modify").click(function () {

  $("input[placeholder='First name']").removeAttr("readonly");
  $("input[placeholder='Last name']").removeAttr("readonly");
  $("input[placeholder='Enter phone']").removeAttr("readonly");
  $("input[placeholder='Birthday']").removeAttr("readonly");
  $("input[placeholder='email']").removeAttr("readonly");
  $("input[placeholder='Somewhere']").removeAttr("readonly");
  $(".btn-save").removeClass("hidden");
  $(".btn-danger").removeClass("hidden");
  $(this).addClass("hidden");

});

$(".btn-danger").click(function () {

  $("input[placeholder='First name']").attr("readonly", true);
  $("input[placeholder='Last name']").attr("readonly", true);
  $("input[placeholder='Enter phone']").attr("readonly", true);
  $("input[placeholder='Birthday']").attr("readonly", true);
  $("input[placeholder='email']").attr("readonly", true);
  $("input[placeholder='Somewhere']").attr("readonly", true);
  $(".btn-save").addClass("hidden");
  $(".btn-modify").removeClass("hidden");
  $(this).addClass("hidden");
});

$(document).ready(function () {
  $(".btn-modify").click(function () {
    $("input").removeAttr("readonly");
    $(".btn-save, .btn-danger").removeClass("hidden");
    $(this).addClass("hidden");
  });

  $(".btn-danger").click(function () {
    $("input").attr("readonly", true);
    $(".btn-save").addClass("hidden");
    $(".btn-modify").removeClass("hidden");
    $(this).addClass("hidden");
  });


  // modify
  $(document).ready(function () {
    let originalData = {};

    $(".btn-modify").click(function () {

      $("input").each(function () {
        originalData[$(this).attr("placeholder")] = $(this).val();
      });

      $("input").removeAttr("readonly");
      $(".btn-save, .btn-danger").removeClass("hidden");
      $(this).addClass("hidden");
    });

    $(".btn-danger").click(function () {
      // take back old data
      $("input").each(function () {
        let placeholder = $(this).attr("placeholder");
        if (originalData[placeholder] !== undefined) {
          $(this).val(originalData[placeholder]);
        }
      });

      $("input").attr("readonly", true);
      $(".btn-save, .btn-danger").addClass("hidden");
      $(".btn-modify").removeClass("hidden");
    });

    $(".btn-save").click(async function () {
      try {
        const user = await $.ajax({
          url: "http://localhost:3000/getUserInfo",
          method: "POST",
          contentType: "application/json",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        // get input tags
        let firstNameInput = document.querySelector("input[placeholder='First name']");
        let lastNameInput = document.querySelector("input[placeholder='Last name']");
        let phoneInput = document.querySelector("input[placeholder='Enter phone']");
        let emailInput = document.querySelector("input[placeholder='email']");
        let addressInput = document.querySelector("input[placeholder='Somewhere']");

        let first_name = checkName(firstNameInput, "First Name");
        let last_name = checkName(lastNameInput, "Last Name");

        if (!first_name || !last_name) return;

        let phone = phoneInput.value.trim();
        let email = emailInput.value.trim();
        let address = addressInput.value.trim();

        if (!validateFormat(phone, regexPhone, "Phone number")) return;
        if (!validateFormat(email, regexEmail, "Email")) return;

        let userData = {
          id: user.id,
          first_name,
          last_name,
          phone,
          email,
          address
        };

        let response = await fetch("http://localhost:3000/updateUserProfile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData)
        });

        if (!response.ok) throw new Error("Error when saving data!");

        alert("Profile updated successfully!");
        $(".btn-modify").removeClass("hidden");
        $(".btn-save, .btn-danger").addClass("hidden");
        $("input").attr("readonly", true);
      } catch (error) {
        alert("Failed to update profile: " + error.message);
      }
    });
  });

  const regexEmail = /^\w+@\w+(\.\w+)+$/;
  const regexPhone = /^0\d{9}$/;
  const regexName = /^[a-zA-Z0-9]{2,}$/;

  function checkName(nameTag, fieldName) {
    let nameValue = nameTag.value.trim();
    if (nameValue.length === 0) {
      alert(fieldName + " cannot be empty!");
      nameTag.focus();
      return false;
    }
    if (!regexName.test(nameValue)) {
      alert(fieldName + " cannot contain special characters and 2 character limit!");
      nameTag.focus();
      return false;
    }
    return nameValue;
  }

  function validateFormat(value, regex, fieldName) {
    if (value.length === 0) {
      alert(`${fieldName} cannot be empty!`);
      return false;
    }
    if (!regex.test(value)) {
      alert(`Invalid ${fieldName.toLowerCase()} format!`);
      return false;
    }
    return true;
  }
});

const avatar = document.querySelector('.profile_img');

avatar.addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.addEventListener('change', async () => {
    const file = input.files[0];
    if (file) {

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'avatar');
      formData.append('id', id);
      try {
        const response = await fetch('http://localhost:3000/uploadFile', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();

        avatar.setAttribute('src', `https://drive.google.com/thumbnail?id=${data}`);
      } catch (error) {
        console.error(error);
      }
    };
  });

  input.click();
});
