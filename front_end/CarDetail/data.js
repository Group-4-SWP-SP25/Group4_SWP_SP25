$(document).ready(function () {
  let currentSystemID = 0;
  const urlParams = new URLSearchParams(window.location.search);
  const carID = parseInt(urlParams.get("carID"));
  async function getCarInfo() {
    try {
      const car = await $.ajax({
        url: "http://localhost:3000/carInfo",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ carID: carID }),
      });
      console.log(car);
      $(".car-name").html(car.CarName);
      $(".car-brand").html(car.Brand);
      $(".registration-number").html(car.RegistrationNumber);
      $(".purchased-year").html(car.Year);
      $(".maintenance-reg-date").html(
        customFormatDate(car.MaintenanceResgistrationDate)
      );
    } catch (err) {
      console.error("Cannot get car info!");
    }
  }
  getCarInfo();

  async function getSystem() {
    try {
      const carSystems = await $.ajax({
        url: "http://localhost:3000/listCarSystem",
        method: "POST",
        contentType: "application/json",
      });

      const systemList = $(".system-list");
      systemList.empty(); // Xóa dữ liệu cũ nếu có

      carSystems.forEach((carSystem) => {
        const system = $(`
          <li>
            <a href="#" class="system-item" data-id="${carSystem.CarSystemID}">${carSystem.CarSystemName}</a>
          </li>
        `);
        systemList.append(system);
      });

      // Gắn sự kiện click cho từng system-item
      $(".system-item").on("click", async function (event) {
        event.preventDefault();
        const carSystemID = $(this).data("id");
        await togglePart(carSystemID);
      });
    } catch (error) {
      console.error("Error fetching car systems:", error);
    }
  }

  async function togglePart(carSystemID) {
    const carPartList = $(".CarPart1");

    if (carPartList.data("visible")) {
      // Nếu đang hiển thị, slide từ phải sang trái để ẩn
      if (currentSystemID === carSystemID) {
        carPartList
          .children(".CarPart")
          .animate({ left: "100%", opacity: 0 }, 500, function () {
            carPartList.empty().hide().data("visible", false);
          });
        return;
      } else {
        try {
          const carParts = await $.ajax({
            url: "http://localhost:3000/listCarPartBySystem",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ carID: carID, carSystemID: carSystemID }),
          });

          carPartList.empty().show().data("visible", true);

          carParts.forEach((carPart) => {
            const part = $(`
              <div class="CarPart" style="position: relative; left: -100%; opacity: 0;">
              
                <img src="${carPart.Image}" id="CarPart_img" alt="${
              carPart.PartName
            }"/>
                <p>Part name: ${carPart.PartName}</p>
                <p>Part Status: ${carPart.Status ? carPart.Status : "N/A"}</p>
                <p>Installation date: ${
                  carPart.InstallationDate ? carPart.InstallationDate : "N/A"
                }</p>
                <p>Expired date: ${
                  carPart.ExpiryDate ? carPart.ExpiryDate : "N/A"
                }</p>
                <a href="#" class="show-service" data-id="${
                  carPart.PartID
                }">Service</a>
              </div>
            `);
            carPartList.append(part);

            part.animate({ left: "0%", opacity: 1 }, 500);
          });
        } catch (error) {
          console.error("Error fetching car parts:", error);
        }
        currentSystemID = carSystemID;
        return;
      }
    }

    try {
      const carParts = await $.ajax({
        url: "http://localhost:3000/listCarPartBySystem",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ carID: carID, carSystemID: carSystemID }),
      });

      carPartList.empty().show().data("visible", true);

      carParts.forEach((carPart) => {
        const part = $(`
          <div class="CarPart" style="position: relative; left: -100%; opacity: 0;">
          
            <img src="${carPart.Image}" id="CarPart_img" alt="${
          carPart.PartName
        }"/>
            <p>Part name: ${carPart.PartName}</p>
            <p>Part Status: ${carPart.Status ? carPart.Status : "N/A"}</p>
            <p>Installation date: ${
              carPart.InstallationDate ? carPart.InstallationDate : "N/A"
            }</p>
            <p>Expired date: ${
              carPart.ExpiryDate ? carPart.ExpiryDate : "N/A"
            }</p>
            <a href="#" class="show-service" data-id="${
              carPart.PartID
            }">Service</a>
          </div>
        `);
        carPartList.append(part);

        part.animate({ left: "0%", opacity: 1 }, 500);
        currentSystemID = carSystemID;
      });
    } catch (error) {
      console.error("Error fetching car parts:", error);
    }
  }

  // Gọi hàm để tải danh sách hệ thống khi trang load
  getSystem();
});

function customFormatDate(dateTimeString) {
  const date = new Date(dateTimeString);
  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  return date.toLocaleDateString("en-GB", options).replace(/ /g, "-");
}
