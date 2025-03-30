$(document).ready(async function () {
  try {
    const user = await $.ajax({
      url: "http://localhost:3000/getUserInfo",
      method: "POST",
      contentType: "application/json",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (user.role === "Admin") {
      $(".user-info .welcome").html(`Welcome, Admin`);
      $(".role").html("Admin");
      $("#overview").removeClass("hidden");
      $("#leaderboard").removeClass("hidden");
      $("#service-management").removeClass("hidden");
      $("#product-management").removeClass("hidden");
      $("#order-and-invoice").removeClass("hidden");
      $("#sales-report").removeClass("hidden");
    }

    if (user.role === "Employee") {
      $(".user-info .welcome").html(`Welcome, Employee`);
      $(".role").html("Employee");
      $("#overview").addClass("hidden");
      $("#leaderboard").addClass("hidden");
      $("#service-management").addClass("hidden");
      $("#product-management").addClass("hidden");
      $("#order-and-invoice").removeClass("hidden");
      $("#sales-report").addClass("hidden");
    }
  } catch (error) {
    throw error;
  }

  $("#sign-out").click(function () {
    localStorage.removeItem("token");
    window.location.href = "/front_end/HomePage/HomePage.html";
  });
});
