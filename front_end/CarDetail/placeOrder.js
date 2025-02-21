$(document).ready(function () {
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
          data: JSON.stringify({ carID: 1 }),
        });

        const carPart = await $.ajax({
          url: "http://localhost:3000/carPartInfoInCar",
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify({ carID: 1, partID: partID }),
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
        const listServiceBody = $(".select-service");
        const serviceList = await $.ajax({
          url: "http://localhost:3000/serviceListPerPart",
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify({ partID: partID }),
        });

        let serviceOption = `<option disabled selected value="0">-- Choose a service --</option>
        `;

        serviceList.forEach((service) => {
          serviceOption += `<option value="${service.ServiceID}">${service.ServiceName}</option>
          `;
        });

        listServiceBody.html(serviceOption);
        const quantityContainer = $(".quantity");
        listServiceBody.change(async function () {
          const selectedService = await $.ajax({
            url: "http://localhost:3000/serviceInfo",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
              serviceID: parseInt(listServiceBody.val()),
            }),
          });

          const inventory = await $.ajax({
            url: "http://localhost:3000/componentInStockInfo",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
              partID: partID,
            }),
          });

          $(".price-title .service").removeClass("hidden");
          $(".price-value .service").removeClass("hidden");

          $(".price-value .service").html(selectedService.ServicePrice);
          if (selectedService.AffectInventory === 1) {
            quantityContainer.slideDown(500);
            $(".qty-val").val(1);
            $(".price-title .component-unit").removeClass("hidden");
            $(".price-value .component-unit")
              .removeClass("hidden")
              .html(inventory.UnitPrice);
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

    async function placeOrder() {
      $(".order-btn").click(async function () {
        const user = await $.ajax({
          url: "http://localhost:3000/getUserInfo",
          method: "POST",
          contentType: "application/json",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      });
    }
  });
});

function showHidePlaceOrder() {
  $("#place-order").slideToggle(500);
  $(".overlay").toggleClass("hidden");
  $("body").toggleClass("no-scroll");

  $(".quantity").slideUp();
  $(".price-title .component-unit").addClass("hidden");
  $(".price-title .service").addClass("hidden");
  $(".price-title .total").addClass("hidden");
  $(".price-value .component-unit").addClass("hidden");
  $(".price-value .service").addClass("hidden");
  $(".price-value .total").addClass("hidden");
}

function calTotalPrice() {
  function valueTag(tag) {
    return parseInt(tag.text());
  }
  const componentPrice = valueTag($(".price-value .component-unit"));
  const servicePrice = valueTag($(".price-value .service"));
  const quantity = $(".qty-val").val();

  const totalPrice = servicePrice + quantity * componentPrice;
  $(".price-title .total").removeClass("hidden");
  $(".price-value .total").removeClass("hidden").html(totalPrice);
}
