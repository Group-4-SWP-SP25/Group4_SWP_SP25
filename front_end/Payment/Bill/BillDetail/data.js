$(document).ready(function () {
  async function getBillDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentID = urlParams.get("paymentID");

    const user = await $.ajax({
      url: "http://localhost:3000/getUserInfo",
      method: "POST",
      contentType: "application/json",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    const payment = await $.ajax({
      url: "http://localhost:3000/paymentInfo",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ userID: user.id, paymentID }),
    });

    const car = await $.ajax({
      url: "http://localhost:3000/carInfo",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ carID: payment.CarID }),
    });

    $(".car-name").text(car.CarName);
    $(".car-info img").attr("src", car.CarImage);

    $(".total-price").text(payment.Amount.toLocaleString("vi-VN") + "₫");

    const bills = await $.ajax({
      url: "http://localhost:3000/billList",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ userID: user.id, paymentID }),
    });

    bills.forEach(async (bill) => {
      const part = await $.ajax({
        url: "http://localhost:3000/partInfo",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ partID: bill.PartID }),
      });

      const service = await $.ajax({
        url: "http://localhost:3000/serviceInfo",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ serviceID: bill.ServiceID }),
      });

      const accessory = await $.ajax({
        url: "http://localhost:3000/accessoryInfo",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ serviceID: bill.ServiceID }),
      });
      console.log(bill.ServiceID);
      console.log(accessory);
      const branch = await $.ajax({
        url: "http://localhost:3000/branchInfo",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ branchID: bill.BranchID }),
      });

      const inventory = await $.ajax({
        url: "http://localhost:3000/componentInStockInfo",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          branchID: bill.BranchID,
          accessoryID: accessory.AccessoryID,
        }),
      });
      let billElement;
      if (bill.QuantityUsed === 0) {
        billElement = `
        <div class="bill">
        <div class="part-info">      
          <img alt="" src="${part.Image}"/>
        </div>
        <div class="bill-info">
          <table width="100%">
            <tr>
              <td>Part</td>
              <td>${part.PartName}</td>
            </tr>
            <tr>
              <td>Service</td>
              <td>${service.ServiceName}</td>
            </tr>
            <tr>
              <td>Order Date</td>
              <td>${formatDate(bill.OrderDate)}</td>
            </tr>
            <tr>
              <td>Service Price</td>
              <td>${service.ServicePrice.toLocaleString("vi-VN") + "₫"}</td>
            </tr>
            <tr>
              <td>Maintained Branch</td>
              <td>${branch.BranchName}</td>
            </tr>
          </table>
        </div>
      </div>`;
      } else {
        billElement = `
      <div class="bill">
        <div class="part-info">       
          <img alt="" src="${part.Image}"/>
        </div>
        <div class="bill-info">
          <table width="100%">
            <tr>
              <td>Part</td>
              <td>${part.PartName}</td>
            </tr>
            <tr>
              <td>Service</td>
              <td>${service.ServiceName}</td>
            </tr>
            <tr>
              <td>Quantity</td>
              <td>${bill.QuantityUsed}</td>
            </tr>
            <tr>
              <td>Order Date</td>
              <td>${formatDate(bill.OrderDate)}</td>
            </tr>
            <tr>
              <td>Service Price</td>
              <td>${service.ServicePrice.toLocaleString("vi-VN") + "₫"}</td>
            </tr>
            <tr>
              <td>Maintained Branch</td>
              <td>${branch.BranchName}</td>
            </tr>
            <tr>
              <td>Component Price</td>
              <td>${inventory.UnitPrice.toLocaleString("vi-VN") + "₫"}</td>
            </tr>
            <tr>
              <td>Total</td>
              <td>${bill.TotalPrice.toLocaleString("vi-VN") + "₫"}</td>
            </tr>
          </table>
        </div>
      </div>`;
      }
      $(".bill-list").append(billElement);
    });
  }
  getBillDetail();
});

function formatDate(dateString) {
  const date = new Date(dateString);
  return `${String(date.getDate()).padStart(2, "0")}/${String(
    date.getMonth() + 1
  ).padStart(2, "0")}/${date.getFullYear()}`;
}
