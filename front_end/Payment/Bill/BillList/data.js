let totalPrice = 0;
$(document).ready(function () {
  async function getPaymentList() {
    totalPrice = 0;
    try {
      const user = await $.ajax({
        url: "http://localhost:3000/getUserInfo",
        method: "POST",
        contentType: "application/json",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const payments = await $.ajax({
        url: "http://localhost:3000/paymentList",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ userID: user.id }),
      });

      if (payments.length === 0) {
        $(".invoice-empty").removeClass("hidden");
        $(".invoice-page").addClass("hidden");
        return;
      } else {
        $(".invoice-empty").addClass("hidden");
        $(".invoice-page").removeClass("hidden");
      }

      const promises = payments.map(async (payment, index) => {
        const car = await $.ajax({
          url: "http://localhost:3000/carInfo",
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify({ carID: payment.CarID }),
        });

        return { car, index, payment };
      });

      const bills = await Promise.all(promises);

      bills.forEach((bill) => {
        const { car, index, payment } = bill;
        totalPrice += payment.Amount;
        const billElement = `
          <div class="invoice-row">
            <div class="invoice-product">
              <input type="hidden" class="payment-id" value="${
                payment.PaymentID
              }" />
              <div class="invoice-info">
                <div class="grid invoice-index">${index + 1}</div>
                <div class="grid">${car.CarName}</div>
                <div class="grid">${formatDate(payment.PaymentDate)}</div>
                <div class="grid">${
                  payment.Amount.toLocaleString("vi-VN") + "₫"
                }</div>
                <div class="invoice-action">
                  <span class="btn-detail">See detail</span>
                </div>
              </div>
            </div>
          </div>
          `;
        $(".invoice-body").append(billElement);
      });

      $(".total-price").html(totalPrice.toLocaleString("vi-VN") + "₫");
      $(".btn-detail").on("click", function () {
        const paymentID = $(this)
          .parents(".invoice-product")
          .find(".payment-id")
          .val();
        window.location.href = `/front_end/Payment/Bill/BillDetail/billDetail.html?paymentID=${paymentID}`;
      });
    } catch (error) {
      console.error(error);
    }
  }

  getPaymentList();
});

function formatDate(dateString) {
  const date = new Date(dateString);
  return `${String(date.getDate()).padStart(2, "0")}/${String(
    date.getMonth() + 1
  ).padStart(2, "0")}/${date.getFullYear()}`;
}
