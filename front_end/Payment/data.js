$(document).ready(function () {
  let totalPrice = 0;
  async function getOrderList() {
    try {
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

      const promises = orders.map(async (order) => {
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

        const accessory = await $.ajax({
          url: "http://localhost:3000/componentInStockInfo",
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify({ serviceID: order.ServiceID }),
        });

        return { order, car, service, carPart, accessory, index };
      });

      Promise.all(promises).then((results) => {
        results.forEach(({ order, car, service, carPart, accessory }) => {
          const orderElement = $(`
            
          `);

          orderBody.append(orderElement);
        });

        // Tính tổng lại đúng cách
        totalPrice = results.reduce(
          (sum, { order }) => sum + order.EstimatedCost,
          0
        );
        $(".total-price").text(totalPrice.toLocaleString("vi-VN") + "₫");
      });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      alert("Có lỗi xảy ra khi lấy danh sách đơn hàng!");
    }
  }
});
