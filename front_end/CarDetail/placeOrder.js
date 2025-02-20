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

        serviceList.forEach((service) => {
          const serviceOption = `<option value="${service.ServiceID}">${service.ServiceName}</option>`;
          listServiceBody.append(serviceOption);
        });

        listServiceBody.change(async function () {
          const selectedService = await $.ajax({
            url: "http://localhost:3000/serviceInfo",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
              serviceID: parseInt(listServiceBody.val()),
            }),
          });

          const quantityContainer = $(".quantity");
          if (selectedService.AffectInventory === 1) {
            quantityContainer.slideDown(500);
            $(".qty-val").val(1);
          } else {
            $(".qty-val").val(0);
            quantityContainer.slideUp(500);
          }
        });
      } catch (err) {
        console.error("Cannot get car part info!");
      }
    }

    getCarPartInfo();
  });
});

function showHidePlaceOrder() {
  $("#place-order").slideToggle(1000);
  $(".overlay").toggleClass("hidden");
  $("body").toggleClass("no-scroll");
}
