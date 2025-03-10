$(document).ready(function () {
  $("#input_65").on("input", function () {
    console.log($(this).val());
    if ($(this).val().length > 0) {
      $(".error-hcaptcha").addClass("hidden");
    }
  });

  $(".btn-checkout").click(async function () {
    try {
      const captchaInput = $("#input_65").val();
      const user = await $.ajax({
        url: "http://localhost:3000/getUserInfo",
        method: "POST",
        contentType: "application/json",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!captchaInput) {
        $(".error-hcaptcha").removeClass("hidden");
        return;
      }

      const response = await $.ajax({
        url: "http://localhost:3000/payment",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          money: totalPrice,
          carID: carID,
          userID: user.id,
        }),
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
