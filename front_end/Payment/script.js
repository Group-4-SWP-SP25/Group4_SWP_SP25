$(document).ready(function () {
  $(".btn-checkout").click(async function () {
    try {
      const response = await $.ajax({
        url: "http://localhost:3000/payment",
        method: "POST",
        contentType: "application/json",
      });

      // Chuyển hướng trình duyệt đến trang thanh toán của VNPay
      if (response) {
        window.location.href = response;
      }
    } catch (error) {
      console.error("Lỗi khi tạo thanh toán:", error);
      alert("Có lỗi xảy ra khi tạo thanh toán!");
    }
  });
});
