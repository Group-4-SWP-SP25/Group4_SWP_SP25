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
      $(".system-item").on("click", async function (e) {
        e.preventDefault();
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
          const parts = await $.ajax({
            url: "http://localhost:3000/listPartBySystem",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ carSystemID: carSystemID }),
          });

          carPartList.empty().show().data("visible", true);

          parts.forEach(async (part) => {
            const carPart = await $.ajax({
              url: "http://localhost:3000/carPartInfoInCar",
              method: "POST",
              contentType: "application/json",
              data: JSON.stringify({ carID: carID, partID: part.PartID }),
            });

            const partInfo = await $.ajax({
              url: "http://localhost:3000/partInfo",
              method: "POST",
              contentType: "application/json",
              data: JSON.stringify({ partID: part.PartID }),
            });

            const partHtml = $(`
              <div class="CarPart" style="position: relative; left: -100%; opacity: 0;">
              
                <img src="${partInfo.Image}" id="CarPart_img" alt="${
              carPart.PartName
            }"/>
                <p>Part name: ${partInfo.PartName}</p>
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
            carPartList.append(partHtml);

            partHtml.animate({ left: "0%", opacity: 1 }, 500);
          });
        } catch (error) {
          console.error("Error fetching car parts:", error);
        }
        currentSystemID = carSystemID;
        return;
      }
    }

    try {
      const parts = await $.ajax({
        url: "http://localhost:3000/listPartBySystem",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ carSystemID: carSystemID }),
      });

      carPartList.empty().show().data("visible", true);

      parts.forEach(async (part) => {
        const carPart = await $.ajax({
          url: "http://localhost:3000/carPartInfoInCar",
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify({ carID: carID, partID: part.PartID }),
        });
        const partInfo = await $.ajax({
          url: "http://localhost:3000/partInfo",
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify({ partID: part.PartID }),
        });

        const partHtml = $(`
          <div class="CarPart" style="position: relative; left: -100%; opacity: 0;">
          
            <img src="${partInfo.Image}" id="CarPart_img" alt="${
          carPart.PartName
        }"/>
            <p>Part name: ${partInfo.PartName}</p>
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
        carPartList.append(partHtml);

        partHtml.animate({ left: "0%", opacity: 1 }, 500);
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
