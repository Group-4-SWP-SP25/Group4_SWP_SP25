$(document).on("keydown", async function (e) {
  if (e.key === "Enter") {
    let selectedRow = $(".del-window").data("selectedRow"); // Lấy hàng đã lưu trước đó
    if (!selectedRow) return;

    try {
      // Lấy thông tin tài khoản
      const accountResponse = await fetch("http://localhost:3000/getUserInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const user = await accountResponse.json();
      const orderID = selectedRow.find(".order-id").text().trim();

      // Gửi request xóa đơn hàng
      await fetch("http://localhost:3000/removeAnOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userID: user.id, orderID: orderID }),
      });

      // Sau khi request thành công, mới fadeOut rồi remove()
      selectedRow.fadeOut(300, function () {
        $(this).remove();
      });

      showNotification();

      const orderResponse = await fetch("http://localhost:3000/listOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userID: user.id }),
      });

      const orders = await orderResponse.json();

      const orderEmpty = document.querySelector(".order-empty");

      if (orders.length !== 0) {
        document.querySelector(".main-order-page").classList.remove("hidden");
        orderEmpty.classList.add("hidden");
      } else {
        document.querySelector(".main-order-page").classList.add("hidden");
        orderEmpty.classList.remove("hidden");
      }
    } catch (error) {
      console.error("Lỗi khi xóa đơn hàng:", error);
    }
  }
  if ($(".del-window").hasClass("show")) {
    $(".del-window").removeClass("show").fadeOut(200);
    $(".overlay").toggleClass("hidden");
    $("body").removeClass("no-scroll");
  }
});
