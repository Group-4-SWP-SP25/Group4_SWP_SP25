async function getUserProfile() { 
    try {
      // Lấy id ng dùng từ session
      const user = await $.ajax({
        url: "http://localhost:3000/getUserInfo",
        method: "POST",
        contentType: "application/json",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      // lấy thông tin người dùng
      const userInfo = await $.ajax({
        url: "http://localhost:3000/userInfo",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ userID: user.id }),
      });
      console.log(userInfo);
        $("#userName").text(`${userInfo.FirstName} ${userInfo.LastName}`);
        $("input[placeholder='First name']").val(userInfo.FirstName);
        $("input[placeholder='Last name']").val(userInfo.LastName);
        $("input[placeholder='Enter phone']").val(userInfo.Phone);
        $("input[placeholder='Birthday']").val(formatDate(userInfo.DOB));
        $("input[placeholder='email']").val(userInfo.Email);
        $("input[placeholder='Somewhere']").val(userInfo.Address);
      


        const profileImg = $(".profile_img");

      if (userInfo.Role === "Admin") {
          profileImg.attr("src", "admin_img.png");
      } else if (userInfo.Role === "Seller") {
        profileImg.attr("src", "seller_img.png");
      } else {
        profileImg.attr("src", "user_img.png"); 
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


    $(".btn-modify").click( function() {
        
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

    $(".btn-danger").click( function() {
        
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

    document.querySelector(".btn-save").addEventListener("click", async function () {
      try {
          const user = await $.ajax({
              url: "http://localhost:3000/getUserInfo",
              method: "POST",
              contentType: "application/json",
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
  
          let firstNameInput = document.querySelector("input[placeholder='First name']");
          let lastNameInput = document.querySelector("input[placeholder='Last name']");
          let phoneInput = document.querySelector("input[placeholder='Enter phone']");
          let emailInput = document.querySelector("input[placeholder='email']");
          let addressInput = document.querySelector("input[placeholder='Somewhere']");
          
        
        let first_name = firstNameInput.value.trim();
          let last_name = lastNameInput.value.trim();
          let phone = phoneInput.value.trim();
          let email = emailInput.value.trim();
          let address = addressInput.value.trim();
  
          const regexEmail = /^\w+@\w+(\.\w+)+$/;
          const regexPhone = /^0\d{9}$/;
          
       
          let userData = {
              id: user.id,
              first_name: first_name,
              last_name: last_name,
              phone: phone,
              email: email,
              address: address
          };
  
          let response = await fetch("http://localhost:3000/updateUserProfile", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify(userData)
          });
  
          if (!response.ok) throw new Error("Error when saving data!");
  
          document.querySelector(".btn-modify").classList.remove("hidden");
      } catch (error) {
          alert(error.message);
      }
  });


  function checkName(nameTag, errorTag) {
    if (nameTag.value.trim().length === 0) {
        errorStyle(nameTag);
        contentError(errorTag, 'This box cannot be empty!');
        return false;
    } else {
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
