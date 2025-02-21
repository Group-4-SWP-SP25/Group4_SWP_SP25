let totalPrice = 0;
async function fetchUserOrders() {
  try {
    const promises = [];
    // Lấy thông tin người dùng
    const user = await $.ajax({
      url: "http://localhost:3000/getUserInfo",
      method: "POST",
      contentType: "application/json",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    // Lấy danh sách đơn hàng
    const orders = await $.ajax({
      url: "http://localhost:3000/listOrder",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ userID: user.id }),
    });

    const orderBody = $(".order-body");
    const orderEmpty = $(".order-empty");

    if (orders.length === 0) {
      return;
    } else {
      $(".main-order-page").removeClass("hidden");
      orderEmpty.addClass("hidden");
    }

    orders.forEach(async (order, index) => {
      const promise = (async () => {
        const car = await $.ajax({
          url: "http://localhost:3000/carInfo",
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify({ carID: order.CarID }),
        });

        const service = await $.ajax({
          url: "http://localhost:3000/serviceInfo",
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify({ serviceID: order.ServiceID }),
        });

        const carPart = await $.ajax({
          url: "http://localhost:3000/carPartInfoInCar",
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify({ carID: order.CarID, partID: order.PartID }),
        });

        const part = await $.ajax({
          url: "http://localhost:3000/componentInfo",
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify({ partID: order.PartID }),
        });
        const orderElement = $(
          `<div class="order-row">
            <div class="order-product">
              <input type="hidden" class="order-id" value="${order.OrderID}"/>
              <div class="order-info">
                <div class="grid order-id">${index + 1}</div> 
                <div class="grid">${car.CarName}</div>
                <div class="grid">${carPart.PartName}</div>
                <div class="grid">${service.ServiceName}</div>
                <div class="grid">${formatDate(order.OrderDate)}</div>
                <div class="grid">${order.EstimatedCost}</div>
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
                  <div><span>Car: </span><a href="#">${car.CarName}</a></div>
                  <div><span>Component: </span>${carPart.PartName}</div>
                  <div><span>Service name: </span>${service.ServiceName}</div>
                  <div><span>Quantity: </span>${order.QuantityUsed}</div>
                  <div><span>Order date: </span>${formatDate(
                    order.OrderDate
                  )}</div>
                </div>
                <div>
                  <div><span>Maintance at: </span>qưiqiw</div>
                  <div><span>Component price: </span>${part.UnitPrice}</div>
                  <div><span>Service price: </span>${service.Price}</div>
                  <div><span>Total price: </span>${order.EstimatedCost}</div>
                </div>
              </div>
            </div>
          </div>`
        );
        totalPrice += order.EstimatedCost;
        orderBody.append(orderElement);
      })();
      promises.push(promise);
    });

    await Promise.all(promises);
    $(".total-price").text(totalPrice);
  } catch (error) {
    console.error("Error:", error);
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
