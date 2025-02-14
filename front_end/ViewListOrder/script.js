const orderBody = document.querySelector(".order-body");
const account = await fetch("http://localhost:3000/getUserInfo", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const user = await account.json();

fetch("http://localhost:3000/listOrder", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  body: JSON.stringify({ account: user.account }),
})
  .then((response) => response.json())
  .then((result) => {
    result.forEach((order) => {
      const carInfo = fetch("http://localhost:3000/carInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ carID: order.CarID }),
      });

      const car = carInfo.json();

      const serviceInfo = fetch("http://localhost:3000/serviceInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ serviceID: order.ServiceID }),
      });

      const carPartInfo = fetch("http://localhost:3000/carPartInfoInCar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ carID: order.CarID, partID: order.PartID }),
      });

      const carPart = carPartInfo.json();

      const service = serviceInfo.json();
      const orderElement = orderBody.createElement("div");
      orderElement.classList.add("order-row");
      orderElement.innerHTML = `
         <div class="order-product">
            <div class="order-info">
              <div class="grid">
                ${order.OrderID}
              </div>
              <div class="grid">
                ${car.CarName}
              </div>
              <div class="grid">
                ${carPart.PartName}
              </div>
              <div class="grid">
                ${service.ServiceName}
              </div>
              <div class="grid">
                ${order.OrderDate}
              </div>
              <div class="grid">
                ${order.EstimatedCost}
              </div>
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
                <div>
                  <span>Car: </span><a href="#">${car.CarName}</a>
                </div>
                <div>
                  <span>Component: </span>
                  ${carPart.PartName}
                </div>
                <div>
                  <span>Service name: </span>
                  ${service.ServiceName}
                </div>
                <div>
                  <span>Quantity: </span>
                  ${order.QuantityUsed}
                </div>
                <div>
                  <span>Order date: </span>
                  ${order.OrderDate}
                </div>
              </div>

              <div>
                <div>
                  <span>Maintance at: </span>
                  qưiqiw
                </div>
                <div>
                  <span>Component price: </span>
                  ${carPart.UnitPrice}
                </div>
                <div>
                  <span>Service price: </span>
                  ${service.Price}
                </div>
                <div>
                  <span>Total price: </span>
                  ${order.EstimatedCost}
                </div>
              </div>
            </div>
          </div>`;
      orderBody.appendChild(orderElement);
    });
  })
  .catch((error) => {
    console.error("Error:", error);
  });
