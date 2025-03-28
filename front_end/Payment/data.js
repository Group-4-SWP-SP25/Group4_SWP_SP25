let totalPrice = 0;
const urlParams = new URLSearchParams(window.location.search);
const carID = parseInt(urlParams.get("carID"));

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
      data: JSON.stringify({ userID: user.id, carID: carID }),
    });
    const carInfo = await $.ajax({
      url: "http://localhost:3000/carInfo",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ carID: carID }),
    });

    $(".car-name").html(carInfo.CarName);
    $(".car-image").attr("src", carInfo.CarImage);

    const promises = orders.map(async (order) => {
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

      return { order, branch, service, partInfo };
    });

    Promise.all(promises).then((results) => {
      results.forEach(({ order, branch, service, partInfo }) => {
        const orderElement = $(`
            <span class="form-product-item show_image show_desc new_ui">
              <div data-wrapper-react="true" class="form-product-item-detail new_ui">
                <div class="p_image">
                  <div class="image_area">
                    <div style="position:absolute;width:100%;height:100%"><img
                        style="width:100%;height:100%;object-fit:contain"
                        src="${partInfo.Image}" /></div>
                  </div>
                </div>
                <div class="form-product-container">
                  <span data-wrapper-react="true">
                    <div class="title_description">
                      <span class="form-product-name">${
                        partInfo.PartName
                      }</span>
                      <div class="order-info">      
                          
                          <p class="title">Service </p>
                          <p class="content">${service.ServiceName}</p>
                          <p class="title">Branch</p>
                          <p class="content">${
                            branch.BranchName
                          }</p>               
                      </div>
                    </div>
                    <span class="form-product-details">
                      <b>
                        <span ata-wrapper-react="true">
                          ${order.EstimatedCost.toLocaleString("vi-VN")}₫
                        </span>
                      </b>
                    </span>
                  </span>
                  ${
                    service.AffectInventory === 1
                      ? `<div class="quantity-detail ">
                    <span class="form-sub-label">Quantity</span>
                    <input value="${order.QuantityUsed}" readonly />
                  </div>`
                      : ""
                  }
                </div>
              </div>
            </span>
          `);

        $(".list-order").append(orderElement);
      });

      // Tính tổng lại đúng cách
      totalPrice = results.reduce(
        (sum, { order }) => sum + order.EstimatedCost,
        0
      );
      $(".total-price").text(totalPrice.toLocaleString("vi-VN") + "₫");
    });
  } catch (error) {
    console.error("Error get order list", error);
  }
}
$(document).ready(function () {
  getOrderList();
});
