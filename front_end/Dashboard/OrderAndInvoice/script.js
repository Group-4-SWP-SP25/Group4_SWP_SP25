$(document).ready(function () {
  let totalPrice = 0;

  $(".btn-manage-order").click(async function () {
    const user = await $.ajax({
      url: "http://localhost:3000/getUserInfo",
      method: "POST",
      contentType: "application/json",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (user.role === "Employee") {
      $(".add-order").removeClass("hidden");
    }

    $(".order-table-container").removeClass("hidden");
    $(".order-empty").addClass("hidden");
    $(".total-price-order").addClass("hidden");
    $(".order-table").addClass("hidden");
    if (!$(".order-table-container").hasClass("has-content")) {
      $(".order-loading").remove();
      $(".order-table-container").append(
        `<div class="order-loading" style="text-align: center">
      <div>
        <svg width="161px" height="161px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-rolling" style="background: none;">
          <circle cx="50" cy="50" fill="none" stroke="#fff" stroke-width="3" r="30" stroke-dasharray="90" transform="rotate(51.109 50 50)">
            <animateTransform attributeName="transform" type="rotate" values="0 50 50;360 50 50" keyTimes="0;1" dur="0.5s" begin="0s" repeatCount="indefinite"></animateTransform>
          </circle>
        </svg>
      </div>
      <p>Loading...</p>
    </div>`
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));

      $(".order-loading").remove();
      $(".order-table-container").addClass("has-content");
    }
    const userID = $(".user-name").data("user-id");
    await getListOrder(userID);
  });

  $(".btn-delete").click(function () {
    $(".del-window").removeClass("hidden");
  });

  // Khi bấm nút add order, mở addOrder
  $(".btn-add-order").click(async function (event) {
    try {
      event.preventDefault();
      event.stopPropagation();
      const userID = $(".user-name").data("user-id");
      const cars = await $.ajax({
        url: "http://localhost:3000/carList",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ userID: parseInt(userID) }),
      });

      if (cars.length === 0) {
        toggleErrorNoCar();
        return;
      }

      toggleAddOrder();
      getDataForOrder();
    } catch (error) {
      console.log(error);
    }
  });

  // Khi bấm overlay, chỉ đóng popup đang mở
  $(".overlay").click(function (event) {
    event.preventDefault();
    event.stopPropagation(); // Ngăn sự kiện click lan truyền

    if ($(".popup-container").hasClass("active")) {
      togglePopup(); // Nếu popupUser đang mở thì đóng nó
    } else if ($("#add-order").hasClass("active")) {
      toggleAddOrder(); // Nếu addOrder đang mở thì đóng nó
    } else if ($(".error-no-has-car").hasClass("active")) {
      toggleErrorNoCar();
    }
  });

  // Khi bấm nút close, đóng popup đang mở
  $(".close").click(function () {
    if ($(".error-no-has-car").hasClass("active")) {
      toggleErrorNoCar();
    }
  });
});

function formatDate(dateString) {
  let date = new Date(dateString);

  let hours = String(date.getUTCHours()).padStart(2, "0"); // Lấy giờ UTC
  let minutes = String(date.getUTCMinutes()).padStart(2, "0"); // Lấy phút UTC
  let day = String(date.getUTCDate()).padStart(2, "0"); // Lấy ngày UTC
  let month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Lấy tháng UTC (0-based)
  let year = date.getUTCFullYear(); // Lấy năm UTC

  return `${hours}:${minutes} ${day}/${month}/${year}`;
}

async function getListOrder(userID) {
  try {
    const orders = await $.ajax({
      url: "http://localhost:3000/listOrder",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ userID: userID }),
    });

    if (orders.length === 0) {
      $(".order-table").addClass("hidden");
      $(".order-empty").removeClass("hidden");
      $(".total-price-order").addClass("hidden");
      return;
    }

    $(".order-table").removeClass("hidden");
    $(".order-empty").addClass("hidden");
    $(".total-price-order").removeClass("hidden");

    const promises = orders.map(async (order, index) => {
      const car = await $.ajax({
        url: "http://localhost:3000/carInfo",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ carID: order.CarID }),
      });

      const branch = await $.ajax({
        url: "http://localhost:3000/branchInfo",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ branchID: order.BranchID }),
      });

      const service = await $.ajax({
        url: "http://localhost:3000/serviceInfo",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ serviceID: order.ServiceID }),
      });

      const partInfo = await $.ajax({
        url: "http://localhost:3000/partInfo",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ partID: order.PartID }),
      });

      const accessoryInfo = await $.ajax({
        url: "http://localhost:3000/accessoryInfo",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ serviceID: order.ServiceID }),
      });
      return { order, car, branch, service, partInfo, index };
    });

    const result = await Promise.all(promises);
    $(".order-data").empty();
    result.forEach(({ order, branch, car, service, partInfo, index }) => {
      const orderElement = `
        <tr>
          <td>${index + 1}</td>
          <td>${car.CarName}</td>
          <td>${partInfo.PartName}</td>
          <td>${service.ServiceName}</td>
          <td>${branch.BranchName}</td>
          <td>${order.QuantityUsed}</td>
          <td>${formatDate(order.OrderDate)}</td>
          <td>${order.EstimatedCost.toLocaleString("vi-VN") + "₫"}</td>
          <td>
            <button class="btn-edit">Edit</button>
            <button class="btn-delete">Delete</button>
          </td>
        </tr>`;

      $(".order-data").append(orderElement);
    });

    totalPrice = result.reduce(
      (sum, { order }) => sum + order.EstimatedCost,
      0
    );

    $(".total-price").text(totalPrice.toLocaleString("vi-VN") + "₫");
  } catch (err) {
    console.log(err);
  }
}

function toggleErrorNoCar() {
  if (!$(".overlay").hasClass("active")) {
    $(".error-no-has-car").css("display", "block");
    $(".overlay").css("display", "flex");

    setTimeout(() => {
      $(".error-no-has-car").addClass("active");
      $(".overlay").addClass("active");
    }, 10);
  } else {
    $(".error-no-has-car").removeClass("active");
    $(".overlay").removeClass("active");

    setTimeout(() => {
      $(".error-no-has-car").css("display", "none");
      $(".overlay").css("display", "none");
    }, 300);
  }
}

function toggleAddOrder() {
  $(".popup-add-order").toggleClass("hidden");
  $(".choose-part, .choose-service, .quantity").addClass("hidden"); // Gộp selector
  if (!$(".overlay").hasClass("active")) {
    $("#add-order").css("display", "flex");
    $(".overlay").css("display", "flex");

    setTimeout(() => {
      $("#add-order").addClass("active");
      $(".overlay").addClass("active");
    }, 10);
  } else {
    $("#add-order").removeClass("active");
    $(".overlay").removeClass("active");

    setTimeout(() => {
      $("#add-order").css("display", "none");
      $(".overlay").css("display", "none");
    }, 300);
  }

  $("body").toggleClass("no-scroll");
}

async function chooseServiceToCreateOrder() {
  try {
    const cars = await $.ajax({
      url: "http://localhost:3000/carList",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ userID: userID }),
    });
  } catch (err) {
    console.log(err);
  }
}
