async function fetchUserOrders() {
  try {
    // Lấy thông tin người dùng
    const accountResponse = await fetch("http://localhost:3000/getUserInfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const user = await accountResponse.json();


    // Lấy danh sách đơn hàng
    const orderResponse = await fetch("http://localhost:3000/listOrder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userID: user.id }),
    });

    const orders = await orderResponse.json();
    const orderBody = document.querySelector(".order-body");
    const orderEmpty = document.querySelector(".order-empty");

    if (orders.length === 0) {
      return;
    } else {
      document.querySelector(".main-order-page").classList.remove("hidden");
      orderEmpty.classList.add("hidden");
    }

    orders.forEach(async (order, index) => {
      // Gọi API lấy thông tin xe
      const carResponse = await fetch("http://localhost:3000/carInfo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carID: order.CarID }),
      });

      const car = await carResponse.json();

      // Gọi API lấy thông tin dịch vụ
      const serviceResponse = await fetch("http://localhost:3000/serviceInfo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceID: order.ServiceID }),
      });

      const service = await serviceResponse.json();

      // Gọi API lấy thông tin phụ tùng
      const carPartResponse = await fetch(
        "http://localhost:3000/carPartInfoInCar",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ carID: order.CarID, partID: order.PartID }),
        }
      );

      const carPart = await carPartResponse.json();

      const partInfo = await fetch("http://localhost:3000/componentInfo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partID: order.PartID }),
      });

      const part = await partInfo.json();

      // Tạo phần tử đơn hàng
      const orderElement = document.createElement("div");
      orderElement.classList.add("order-row");
      orderElement.innerHTML = `
        <div class="order-product">
          <input type="hidden" class="order-id" value="${order.OrderID}"/>
          <div class="order-info">
            <div class="grid order-id">${index + 1}</div> 
            <div class="grid">${car.CarName}</div>
            <div class="grid">${carPart.PartName}</div>
            <div class="grid">${service.ServiceName}</div>
            <div class="grid">${formatDate(
              order.OrderDate
            )}</div> <!-- Định dạng ngày -->
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
              )}</div> <!-- Định dạng ngày -->
            </div>
            <div>
              <div><span>Maintance at: </span>qưiqiw</div>
              <div><span>Component price: </span>${part.UnitPrice}</div>
              <div><span>Service price: </span>${service.Price}</div>
              <div><span>Total price: </span>${order.EstimatedCost}</div>
            </div>
          </div>
        </div>`;

      orderBody.appendChild(orderElement);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

// Hàm định dạng ngày
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Gọi hàm chính
fetchUserOrders();
