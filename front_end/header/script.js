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
      $("#payment-invoice").addClass("hidden");
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

const searchInput = document.querySelector(".search-bar input");

searchInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    const searchTerm = searchInput.value.trim();
    searchServices(searchTerm);
  }
});

async function searchServices(searchTerm) {
  try {
    const response = await fetch("http://localhost:3000/searchService", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: searchTerm }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const results = await response.json();

    window.location.href = `/front_end/serviceSearch/serviceSearch.html?results=${encodeURIComponent(
      JSON.stringify(results)
    )}&searchTerm=${searchTerm}`;
  } catch (error) {
    console.error("Error searching services:", error);
    alert("An error occurred while searching.");
  }
}
