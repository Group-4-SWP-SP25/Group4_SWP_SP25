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
              async function validatePhone() {
              let isPhoneValid = await checkPhone(phoneInput);
              if (isPhoneValid) {
                  let phone = phoneInput.value.trim();
                  console.log("Valid phone:", phone);
                  return phone; // Trả về số điện thoại nếu hợp lệ
              }
              return null; // Trả về null nếu không hợp lệ
          }
          
             let emailInput = document.querySelector("input[placeholder='email']");

            async function validateEmail() {
               let isEmailValid = await checkEmail(emailInput);
                 if (isEmailValid) {
                  let email = emailInput.value.trim();
                  console.log("Valid email:", email);
                   return email; 
    return null; 
}

          let addressInput = document.querySelector("input[placeholder='Somewhere']");
          
        
          let first_name = checkName(firstNameInput, "First name");
          let last_name = checkName(lastNameInput, "Last name");
        
        // save name
        document.querySelector(".btn-save").addEventListener("click", function () {
          let isFirstNameValid = checkName(firstNameInput, "First Name");
          let isLastNameValid = checkName(lastNameInput, "Last Name");
      
          if (!isFirstNameValid || !isLastNameValid) {
              return; 
          }
      
          alert("Data is valid! Proceeding to save...");
      });
      // save email
          document.querySelector(".btn-save").addEventListener("click", async function () {
            let isEmailValid = await checkEmail(emailInput);
        
            if (!isEmailValid) {
                return; 
            }
        
            alert("Email is valid! Proceeding to save...");
        });
        // save phone
        document.querySelector(".btn-save").addEventListener("click", async function () {
          let phone = await validatePhone();
          if (!phone) return; // Dừng nếu phone không hợp lệ
      
          alert("Phone number is valid! Proceeding to save...");
      });
      
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




  const regexEmail = /^\w+@\w+(\.\w+)+$/;
  const regexPhone = /^0\d{9}$/;
  

 function checkName(nameTag, fieldName) {
  let nameValue = nameTag.value.trim();
  
  if (nameValue.length === 0) {
      alert(fieldName + " cannot be empty!");
      nameTag.focus(); 
      return false;
  }
  return true;
}



async function checkEmail(emailTag) {
  let email = emailTag.value.trim();
  if (email.length === 0) {
      alert("Email cannot be empty!");
      emailTag.focus();
      return false;
  }
 if (!regexEmail.test(email)) {
      alert("Invalid email format!");
      emailTag.focus();
      return false;
  }

  try {
      let response = await fetch("http://localhost:3000/checkAccount", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accountType: "Email", account: email })
      });

      if (response.status === 404) {
          alert("Email is already taken!");
          emailTag.focus();
          return false;
      }
  } catch (error) {
      alert("Error check email. Please try again !");
      return false;
  }

  return true;
}



async function checkPhone(phoneTag) {
  let phone = phoneTag.value.trim();
  if (phone.length === 0) {
      alert("Phone number cannot be empty!");
      phoneTag.focus();
      return false;
  }

    if (!regexPhone.test(phone)) {
      alert("Invalid phone number!");
      phoneTag.focus();
      return false;
  }

  try {

      let response = await fetch("http://localhost:3000/checkAccount", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accountType: "Phone", account: phone })
      });

      if (response.status === 404) {
          alert("Phone number is already taken!");
          phoneTag.focus();
          return false;
      }
  } catch (error) {
      alert("Error check phone number. Please try again !");
      return false;
  }

  return true;
}

