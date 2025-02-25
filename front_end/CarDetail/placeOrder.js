$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const carID = parseInt(urlParams.get("carID"));
  $(document).on("click", ".show-service", function (event) {
    event.preventDefault();
    showHidePlaceOrder();

    const partID = $(this).data("id");

    async function getCarPartInfo() {
      try {
        const car = await $.ajax({
          url: "http://localhost:3000/carInfo",
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify({ carID: carID }),
        });

        const carPart = await $.ajax({
          url: "http://localhost:3000/carPartInfoInCar",
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify({ carID: carID, partID: partID }),
        });

        const carSystem = await $.ajax({
          url: "http://localhost:3000/carSystemInfo",
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify({ carSystemID: carPart.CarSystemID }),
        });

        const carContent = $(".car-content .content");
        carContent.html(`
          <p><span>${car.CarName}</span></p>
          <p><span>${car.Brand}</span></p>
          <p><span>${carSystem.CarSystemName}</span></p>
          <p><span>${carPart.PartName}</span></p>
          `);
        const componentName = $(".component-name");
        componentName.html(`${carPart.PartName}`);

        const serviceList = await $.ajax({
          url: "http://localhost:3000/serviceListPerPart",
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify({ partID: partID }),
        });
        const listServiceBody = $(".select-service");

        let serviceOption = `<option disabled selected value="0">-- Choose a service --</option>
        `;

        serviceList.forEach((service) => {
          serviceOption += `<option value="${service.ServiceID}">${service.ServiceName}</option>
          `;
        });

        listServiceBody.html(serviceOption);

        const quantityContainer = $(".quantity");
        listServiceBody.change(async function () {
          const serviceID = parseInt(listServiceBody.val());
          $(".error-service").addClass("hidden");
          $("error-quantity").addClass("hidden");
          const selectedService = await $.ajax({
            url: "http://localhost:3000/serviceInfo",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
              serviceID: serviceID,
            }),
          });

          $(".price-title .service").removeClass("hidden");
          $(".price-value .service").removeClass("hidden");

          $(".price-value .service").html(
            selectedService.ServicePrice.toLocaleString("vi-VN") + "₫"
          );
          if (selectedService.AffectInventory === 1) {
            const accessory = await $.ajax({
              url: "http://localhost:3000/componentInStockInfo",
              method: "POST",
              contentType: "application/json",
              data: JSON.stringify({
                serviceID: serviceID,
              }),
            });
            quantityContainer.slideDown(500);
            $(".qty-val").val(1);
            $(".price-title .component-unit").removeClass("hidden");
            $(".price-value .component-unit")
              .removeClass("hidden")
              .html(accessory.UnitPrice.toLocaleString("vi-VN") + "₫");
            calTotalPrice();
          } else {
            $(".qty-val").val(0);
            quantityContainer.slideUp(500);
            $(".price-title .component-unit").addClass("hidden");
            $(".price-title .total").addClass("hidden");
            $(".price-value .component-unit").addClass("hidden");
            $(".price-value .total").addClass("hidden");
          }
        });
      } catch (err) {
        console.error("Cannot get car part info!");
      }
    }

    getCarPartInfo();

    $(".order-btn")
      .off("click")
      .on("click", async function (e) {
        e.preventDefault();
        await placeOrder();
      });
  });
});

async function placeOrder() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const carID = parseInt(urlParams.get("carID"));
    const user = await $.ajax({
      url: "http://localhost:3000/getUserInfo",
      method: "POST",
      contentType: "application/json",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const partID = $(".show-service").data("id");

    const serviceID = parseInt($(".select-service").val());

    if (isNaN(serviceID)) {
      $(".error-service").removeClass("hidden");
      return;
    }
    const selectedService = await $.ajax({
      url: "http://localhost:3000/serviceInfo",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        serviceID: serviceID,
      }),
    });
    const quantityUsed = parseInt($(".qty-val").val());
    if (
      selectedService.AffectInventory === 1 &&
      (isNaN(quantityUsed) || quantityUsed <= 0)
    ) {
      $(".error-quantity").removeClass("hidden");
      $(".price").addClass("hidden");
      return;
    }

    $.ajax({
      url: "http://localhost:3000/placeOrder",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        userID: user.id,
        carID: carID,
        partID: partID,
        serviceID: serviceID,
        quantityUsed: quantityUsed,
      }),
    });

    showHidePlaceOrder();

    showNotification();
  } catch (err) {
    console.error("Cannot place order!");
  }
}

function showHidePlaceOrder() {
  $("#place-order").slideToggle(500);
  if (!$(".overlay").hasClass("hidden")) {
    $(".error-service").addClass("hidden");
    $(".error-quantity").addClass("hidden");
  }
  $(".overlay").toggleClass("hidden");
  $("body").toggleClass("no-scroll");

  $(".quantity").slideUp();
  $(".price-title .component-unit").addClass("hidden");
  $(".price-title .service").addClass("hidden");
  $(".price-title .total").addClass("hidden");
  $(".price-value .component-unit").addClass("hidden");
  $(".price-value .service").addClass("hidden");
  $(".price-value .total").addClass("hidden");
  $(".price").removeClass("hidden");
}

async function calTotalPrice() {
  const serviceID = parseInt($(".select-service").val());
  const selectedService = await $.ajax({
    url: "http://localhost:3000/serviceInfo",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      serviceID: serviceID,
    }),
  });

  const accessory = await $.ajax({
    url: "http://localhost:3000/componentInStockInfo",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      serviceID: serviceID,
    }),
  });
  const componentPrice = accessory.UnitPrice;
  const servicePrice = selectedService.ServicePrice;
  const quantity = $(".qty-val").val();

  const totalPrice = servicePrice + quantity * componentPrice;
  $(".price-title .total").removeClass("hidden");
  $(".price-value .total")
    .removeClass("hidden")
    .html(totalPrice.toLocaleString("vi-VN") + "₫");
}

function showNotification() {
  const container = $("#notificationContainer");
  const notification = $(`
            <div class="notification">
  <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 117.72 117.72" style="enable-background:new 0 0 117.72 117.72" xml:space="preserve">
  <g><path class="st0" d="M58.86,0c9.13,0,17.77,2.08,25.49,5.79c-3.16,2.5-6.09,4.9-8.82,7.21c-5.2-1.89-10.81-2.92-16.66-2.92 c-13.47,0-25.67,5.46-34.49,14.29c-8.83,8.83-14.29,21.02-14.29,34.49c0,13.47,5.46,25.66,14.29,34.49 c8.83,8.83,21.02,14.29,34.49,14.29s25.67-5.46,34.49-14.29c8.83-8.83,14.29-21.02,14.29-34.49c0-3.2-0.31-6.34-0.9-9.37 c2.53-3.3,5.12-6.59,7.77-9.85c2.08,6.02,3.21,12.49,3.21,19.22c0,16.25-6.59,30.97-17.24,41.62 c-10.65,10.65-25.37,17.24-41.62,17.24c-16.25,0-30.97-6.59-41.62-17.24C6.59,89.83,0,75.11,0,58.86 c0-16.25,6.59-30.97,17.24-41.62S42.61,0,58.86,0L58.86,0z M31.44,49.19L45.8,49l1.07,0.28c2.9,1.67,5.63,3.58,8.18,5.74 c1.84,1.56,3.6,3.26,5.27,5.1c5.15-8.29,10.64-15.9,16.44-22.9c6.35-7.67,13.09-14.63,20.17-20.98l1.4-0.54H114l-3.16,3.51 C101.13,30,92.32,41.15,84.36,52.65C76.4,64.16,69.28,76.04,62.95,88.27l-1.97,3.8l-1.81-3.87c-3.34-7.17-7.34-13.75-12.11-19.63 c-4.77-5.88-10.32-11.1-16.79-15.54L31.44,49.19L31.44,49.19z"/></g></svg>

  <span>You have already placed an order! 
  </span> 
  <button class="order-detail" onclick="window.location.href='/front_end/Order/OrderList/orderList.html'">See detail</button>
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
  }, 5000);
}
