$(document).ready(function () {
  if (localStorage.getItem("loggedIn") !== "true") {
    $(".guest").removeClass("hidden");
    $(".user-login").addClass("hidden");
  } else {
    $(".guest").addClass("hidden");
    $(".user-login").removeClass("hidden");

    switch (localStorage.getItem("role")) {
      case "Admin":
        $("#my-cars").addClass("hidden");
        $("#my-orders").addClass("hidden");
        break;
      case "User":
        $("#dashboard").addClass("hidden");
        break;
    }
  }

  $("#sign-out").on("click", function () {
    localStorage.setItem("loggedIn", "false");
    window.location.href = "../HomePage/HomePage.html";
  });

  $("#my-orders").on("click", function () {
    window.location.href = "../ViewListOrder/ListOrder.html";
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
