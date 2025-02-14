const orderBody = document.querySelector(".order-body");
const account = await fetch("http://localhost:3000/getUserInfo", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const user = await account.json();

fetch("http://localhost:3000/listOrders", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  body: JSON.stringify({ account: user.account }),
})
  .then((response) => response.json())
  .then((result) => {
    console.log(result);
    result.forEach((order) => {
      const orderElement = orderBody.createElement("div");
      orderElement.classList.add("order");
      orderElement.innerHTML = `
        <div class="order-info">
          <div class="order-id">
            <span>Order ID: </span>
            <span>${order.OrderID}</span>
          </div>
          <div class="order-date time">
            <span>Order Date: </span>
            <span>${order.OrderDate}</span> 
          </div>
          <div class="order-status">
            <span>Status: </span>
            <span>${order.Status}</span>
          </div>
        </div>
        
        <div class="order-detail">
          <div class="order-detail-item">
            <span>Service Name: </span>
            <span>${order.ServiceName}</span>
          </div>
          <div class="order-detail-item">
            <span>Service Type: </span>
            <span>${order.ServiceType}</span>
          </div>
          <div class="order-detail-item">
            <span>Service Price: </span>
            <span>${order.ServicePrice}</span>
          </div>
          <div class="order-detail-item">
            <span>Service Description: </span>
            <span>${order.ServiceDescription}</span>
          </div>
        </div>
      `;
      document.getElementById("order-list").appendChild(orderElement);
    });
  })
  .catch((error) => {
    console.error("Error:", error);
  });
