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

    // modify
    document.querySelector(".btn-save").addEventListener("click", async function () {
      try {
          
          const user = await $.ajax({
            url: "http://localhost:3000/getUserInfo",
            method: "POST",
            contentType: "application/json",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
  
          let userData = {
              id: user.id,
              first_name: document.querySelector("input[placeholder='First name']").value,
              last_name: document.querySelector("input[placeholder='Last name']").value,
              phone: document.querySelector("input[placeholder='Enter phone']").value,
              email: document.querySelector("input[placeholder='email']").value,
              address: document.querySelector("input[placeholder='Somewhere']").value
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
  
