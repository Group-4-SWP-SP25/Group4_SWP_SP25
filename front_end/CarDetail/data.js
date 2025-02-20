$(document).ready(function () {
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
      carPartList
        .children(".CarPart")
        .animate({ left: "100%", opacity: 0 }, 500, function () {
          carPartList.empty().hide().data("visible", false);
        });
      return;
    }

    try {
      const carParts = await $.ajax({
        url: "http://localhost:3000/listCarPartBySystem",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ carID: 1, carSystemID: carSystemID }),
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
  }

  // Gọi hàm để tải danh sách hệ thống khi trang load
  getSystem();
});
