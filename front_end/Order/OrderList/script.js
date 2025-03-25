let totalPrice = 0;
async function fetchUserOrders() {
  try {
    // Lấy thông tin người dùng
    const user = await $.ajax({
      url: "http://localhost:3000/getUserInfo",
      method: "POST",
      contentType: "application/json",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    const cars = await $.ajax({
      url: "http://localhost:3000/carList",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ userID: user.id }),
    });
    fetchOrdersByCarID(user.id, cars[0].CarID, undefined);
    $(".car-name").html(cars[0].CarName);
    $(".select-car").data("selectedCar", cars[0].CarID);
    if (cars.length === 1) {
      return;
    }

    if (cars.length > 1) {
      $(".fa-chevron-right").removeClass("hidden");
    }
    cars.forEach((car) => {
      $(".car-list").append(`<li data-id="${car.CarID}">${car.CarName}</li>`);
    });

    $(".car-list li").on("click", async function (e) {
      e.preventDefault();
      $(".car-list").removeClass("show");
      $(".fa-chevron-right").removeClass("active");
      const carID = $(this).data("id");
      $(".select-car").data("selectedCar", carID);

      const carInfo = await $.ajax({
        url: "http://localhost:3000/carInfo",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ carID: carID }),
      });
      $(".car-name").html(carInfo.CarName);
      await fetchOrdersByCarID(user.id, carID, $(this));
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchOrdersByCarID(userID, carID, element) {
  totalPrice = 0;
  const orderBody = $(".order-body");
  const orderEmpty = $(".order-empty");
  const orderPage = $(".order-page");
  if (element !== undefined && !element.hasClass("has-content")) {
    $(".order-page").removeClass("hidden");
    orderEmpty.addClass("hidden");
    $(".order-table").addClass("hidden");

    // Hiển thị loading
    orderPage.append(`
    <div class="order-loading" style="text-align: center">
      <div>
        <svg width="161px" height="161px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-rolling" style="background: none;">
          <circle cx="50" cy="50" fill="none" stroke="#fff" stroke-width="3" r="30" stroke-dasharray="90" transform="rotate(51.109 50 50)">
            <animateTransform attributeName="transform" type="rotate" values="0 50 50;360 50 50" keyTimes="0;1" dur="0.5s" begin="0s" repeatCount="indefinite"></animateTransform>
          </circle>
        </svg>
      </div>
      <p>Loading...</p>
    </div>
  `);

    // Chờ 2 giây để hiển thị hiệu ứng loading
    await new Promise((resolve) => setTimeout(resolve, 1000));

    element.addClass("has-content");
  }
  try {
    // Lấy danh sách đơn hàng
    const orders = await $.ajax({
      url: "http://localhost:3000/listOrder",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ userID: userID, carID: carID }),
    });
    // Ẩn loading sau khi dữ liệu đã lấy xong
    $(".order-loading").remove();

    $(".order-table").removeClass("hidden");

    if (orders.length === 0) {
      orderPage.addClass("hidden");
      orderEmpty.removeClass("hidden");
      return;
    } else {
      orderPage.removeClass("hidden");
      orderEmpty.addClass("hidden");
    }

    orderBody.empty();

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

      const inventory = await $.ajax({
        url: "http://localhost:3000/componentInStockInfo",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          branchID: order.BranchID,
          accessoryID: accessoryInfo.AccessoryID,
        }),
      });

      return { order, car, branch, service, partInfo, inventory, index };
    });

    const results = await Promise.all(promises);

    results.forEach(
      ({ order, branch, car, service, partInfo, inventory, index }) => {
        const orderElement = $(`
        <div class="order-row">
          <div class="order-product">
            <input type="hidden" class="order-id" value="${order.OrderID}"/>
            <div class="order-info">
              <div class="grid order-index">${index + 1}</div> 
              <div class="grid">${partInfo.PartName}</div>
              <div class="grid">${service.ServiceName}</div>
              <div class="grid">${formatDate(order.OrderDate)}</div>
              <div class="grid">${
                order.EstimatedCost.toLocaleString("vi-VN") + "₫"
              }</div>
              <div class="order-action">
                <span class="btn-del">Delete <i class="fa-solid fa-trash-can"></i></span>
                <span class="btn-detail">See detail <i class="fas fa-chevron-down fa-sm fa-see"></i></span>
              </div>
            </div>
          </div>
          <div class="order-detail hidden">
            <div class="separate"></div>
            <div class="detail-content">
              <div>
                <div><span>Car: </span><a href="/front_end/CarDetail/CarDetail.html?carID=${
                  car.CarID
                }">${car.CarName}</a></div>
                <div><span>Component: </span>${partInfo.PartName}</div>
                <div><span>Service name: </span>${service.ServiceName}</div>
                ${
                  service.AffectInventory === 1
                    ? `<div><span>Quantity: </span>${order.QuantityUsed}</div>`
                    : ""
                }
                <div><span>Order date: </span>${formatDate(
                  order.OrderDate
                )}</div>
              </div>
              <div>
                <div><span>Maintance at: </span>${branch.BranchName}</div>
                ${
                  service.AffectInventory === 1
                    ? `<div><span>Component price: </span>${
                        inventory.UnitPrice.toLocaleString("vi-VN") + "₫"
                      }</div>`
                    : ""
                }
                <div><span>Service price: </span>${
                  service.ServicePrice.toLocaleString("vi-VN") + "₫"
                }</div>
                ${
                  service.AffectInventory === 1
                    ? `<div><span>Total price: </span>${
                        order.EstimatedCost.toLocaleString("vi-VN") + "₫"
                      }</div>`
                    : ""
                }
              </div>
            </div>
          </div>
        </div>
      `);

        orderBody.append(orderElement);
      }
    );

    totalPrice = results.reduce(
      (sum, { order }) => sum + order.EstimatedCost,
      0
    );
    $(".total-price").text(totalPrice.toLocaleString("vi-VN") + "₫");
  } catch (error) {
    console.error("Lỗi khi tải đơn hàng:", error);
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return `${String(date.getDate()).padStart(2, "0")}/${String(
    date.getMonth() + 1
  ).padStart(2, "0")}/${date.getFullYear()}`;
}

$(document).ready(function () {
  fetchUserOrders();
});
