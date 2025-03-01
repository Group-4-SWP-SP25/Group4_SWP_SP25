$(document).ready(function () {
  $(document).on("click", ".btn-detail", function (e) {
    e.preventDefault();
    $(this).closest(".order-row").find(".order-detail").slideToggle(500);
    $(this).find(".fa-see").toggleClass("active");

    const currentText = $(this).contents().first().text().trim();
    $(this)
      .contents()
      .first()
      .replaceWith(
        currentText.includes("See detail") ? "Collapse " : "See detail "
      );
  });

  $(document).on("click", ".btn-del", function () {
    let selectedRow = $(this).closest(".order-row");
    $(".del-window").data("selectedRow", selectedRow); // Lưu hàng cần xóa

    showHideConfimationDialog();
  });

  $(document).on("click", ".btn-submit button", async function () {
    if ($(this).text().trim() === "Yes") {
      deleteAnOrder();
    }

    // Ẩn hộp thoại xác nhận
    showHideConfimationDialog();
  });

  $(".overlay").click(function () {
    showHideConfimationDialog();
  });
});

function showNotification() {
  const container = $("#notificationContainer");
  const notification = $(`
            <div class="notification">
  <svg viewBox="0 0 408.483 408.483">
    <g>
      <g>
        <path d="M87.748,388.784c0.461,11.01,9.521,19.699,20.539,19.699h191.911c11.018,0,20.078-8.689,20.539-19.699
                 l13.705-289.316H74.043L87.748,388.784z M247.655,171.329c0-4.61,3.738-8.349,8.35-8.349h13.355
                 c4.609,0,8.35,3.738,8.35,8.349v165.293c0,4.611-3.738,8.349-8.35,8.349h-13.355c-4.61,0-8.35-3.736-8.35-8.349V171.329z
                 M189.216,171.329c0-4.61,3.738-8.349,8.349-8.349h13.355c4.609,0,8.349,3.738,8.349,8.349v165.293
                 c0,4.611-3.737,8.349-8.349,8.349h-13.355c-4.61,0-8.349-3.736-8.349-8.349V171.329L189.216,171.329z
                 M130.775,171.329c0-4.61,3.738-8.349,8.349-8.349h13.356c4.61,0,8.349,3.738,8.349,8.349v165.293
                 c0,4.611-3.738,8.349-8.349,8.349h-13.356c-4.61,0-8.349-3.736-8.349-8.349V171.329z"/>
        <path d="M343.567,21.043h-88.535V4.305c0-2.377-1.927-4.305-4.305-4.305h-92.971
                 c-2.377,0-4.304,1.928-4.304,4.305v16.737H64.916c-7.125,0-12.9,5.776-12.9,12.901V74.47h304.451V33.944
                 C356.467,26.819,350.692,21.043,343.567,21.043z"/>
      </g>
    </g>
  </svg>
  <span>An order has already been deleted!</span>
  <div class="progress-bar"></div>
</div>
        `);

  container.prepend(notification);

  setTimeout(() => {
    $(".progress-bar", notification).css("width", "0%");
  }, 50);

  setTimeout(function () {
    notification.css("animation", "slideOut 0.5s ease-in-out forwards");
    setTimeout(() => {
      notification.remove();
    }, 500);
  }, 3000);
}

function showHideConfimationDialog() {
  $(".del-window").fadeToggle(200).toggleClass("hidden show");
  $(".overlay").toggleClass("hidden");
  $("body").toggleClass("no-scroll");
}

async function deleteAnOrder() {
  let selectedRow = $(".del-window").data("selectedRow"); // Lấy hàng đã lưu trước đó
  if (!selectedRow) return;

  try {
    // Get account info
    const accountResponse = await $.ajax({
      url: "http://localhost:3000/getUserInfo",
      method: "POST",
      contentType: "application/json",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const user = accountResponse;
    const orderID = selectedRow.find(".order-id").val().trim();

    const orderDeleted = await $.ajax({
      url: "http://localhost:3000/orderInfo",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ userID: user.id, orderID: orderID }),
    });
    totalPrice -= orderDeleted.EstimatedCost;

    // Request to delete an order
    await $.ajax({
      url: "http://localhost:3000/removeAnOrder",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ userID: user.id, orderID: orderID }),
    });

    // Sau khi request thành công, mới fadeOut rồi remove()
    selectedRow.fadeOut(300, function () {
      $(this).remove();
      $(".order-row").each((index, row) => {
        $(row)
          .find(".order-index")
          .text(index + 1);
      });
    });

    $(".total-price").text(totalPrice.toLocaleString("vi-VN") + "₫");

    showNotification();

    const orderResponse = await $.ajax({
      url: "http://localhost:3000/listOrder",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ userID: user.id }),
    });

    const orders = orderResponse;
    const orderEmpty = $(".order-empty");
    const mainOrderPage = $(".main-order-page");

    if (orders.length !== 0) {
      mainOrderPage.removeClass("hidden");
      orderEmpty.addClass("hidden");
    } else {
      mainOrderPage.addClass("hidden");
      orderEmpty.removeClass("hidden");
    }
  } catch (error) {
    console.error("Lỗi khi xóa đơn hàng:", error);
  }
}
