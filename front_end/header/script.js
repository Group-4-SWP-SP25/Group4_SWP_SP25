$(document).ready(async function () {
  if (localStorage.getItem("token") == null) {
    $(".guest").removeClass("hidden");
    $(".user-login").addClass("hidden");
    return;
  } else {
    $(".guest").addClass("hidden");
    $(".user-login").removeClass("hidden");
  }
  //get user info
  const response = await fetch("http://localhost:3000/getUserInfo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const result = await response.json();
  // set name
  document.getElementById("name").innerHTML = result.name;

  switch (result.role) {
    case "Admin":
      $("#my-cars").addClass("hidden");
      $("#my-orders").addClass("hidden");
      break;
    case "User":
      $("#dashboard").addClass("hidden");
      break;
  }
  $("#profile").on("click", function () {
    window.location.href = "/front_end/UserProfile/UserProfile.html";
  });
  $("#sign-out").on("click", function () {
    localStorage.removeItem("token");
    window.location.href = "/front_end/HomePage/HomePage.html";
  });

  $("#dashboard").on("click", function () {
    window.location.href = "/front_end/Dashboard/DashBoard/dashboard.html";
  });

  $("#my-cars").on("click", function () {
    window.location.href = "/front_end/CarList/CarList.html";
  });

  $("#payment-invoice").on("click", function () {
    window.location.href = "/front_end/Payment/Bill/BillList/billList.html";
  });

  $("#my-orders").on("click", function () {
    window.location.href = "/front_end/Order/OrderList/orderList.html";
  });
});

$(document).on("click", ".user-login", function (e) {
  e.preventDefault();
  $(".user-info").slideToggle(500);
  $(".fa-user").toggleClass("active");
  e.stopPropagation();
});

$(document).click(function () {
  $(".user-info").slideUp(500);
  $(".fa-user").removeClass("active");
});
