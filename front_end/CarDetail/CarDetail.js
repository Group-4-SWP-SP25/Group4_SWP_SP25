async function getSystem() {
  const carSystemJson = await fetch("http://localhost:3000/listCarSystem", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
  });

  const carSystems = await carSystemJson.json();
  const systemList = document.querySelector(".system-list");

  systemList.innerHTML = ""; // Xóa dữ liệu cũ nếu có

  carSystems.forEach((carSystem) => {
      const system = document.createElement("li");
      system.innerHTML = `
          <a href="#" class="system-item" data-id="${carSystem.CarSystemID}">${carSystem.CarSystemName}</a>
      `;

      systemList.appendChild(system);
  });

  // Gắn sự kiện click cho từng system-item
  document.querySelectorAll(".system-item").forEach((item) => {
      item.addEventListener("click", async function (event) {
          event.preventDefault();

          // Xóa màu nền của tất cả các mục trước khi tô màu mục được chọn
          document.querySelectorAll(".system-item").forEach(el => el.style.backgroundColor = "");

          // Đổi màu nền cho mục được click
          this.style.backgroundColor = "#808080";

          const carSystemID = this.getAttribute("data-id");
          await getPart(carSystemID);
      });
  });
}


async function getPart(carSystemID) {
  const carPartJson = await fetch("http://localhost:3000/listCarPartBySystem", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    
  });

  const carParts = await carPartJson.json();
  const carPartList = document.querySelector(".CarPart1");

  carPartList.innerHTML = ""; 

  carParts.forEach((carPart) => {
    const part = document.createElement("div");
    part.classList.add("CarPart");
 
    part.innerHTML = `
      <img src="${carPart.Image}" id="CarPart_img" alt="${carPart.PartName}">
    
      <p>Part name: ${carPart.PartName}</p>
      <p>Part Status: ${carPart.Status ? carPart.Status : "N/A"}</p>
      <p>Installation date: ${carPart.InstallationDate ? carPart.InstallationDate : "N/A"}</p>
      <p>Expired date: ${carPart.ExpiryDate ? carPart.ExpiryDate : "N/A"}</p>
      <a href="#" class="ServiceButton">Service</a>
    `;
    carPartList.appendChild(part);
  });
}


// Gọi hàm để tải danh sách hệ thống khi trang load
getSystem();
