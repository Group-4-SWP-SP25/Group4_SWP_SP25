async function getSystem() {
  const carSystemJson = await fetch("http://localhost:3000/listCarSystem", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const carSystems = await carSystemJson.json();

  const sytemList = document.querySelector(".system-list");
  carSystems.forEach((carSystem) => {
    const system = document.createElement("li");
    system.innerHTML = `
    <a>${carSystem.CarSystemName}</a>
    <input type="hidden" class="carSystemID" value="${carSystem.CarSystemID}">  
    `;
    sytemList.appendChild(system);
  });
}

getSystem();

async function getPart() {
  const carPartJson = await fetch("http://localhost:3000/listCarPartBySystem", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ carID: 1, carSystemID: 1 }),
  });

  const carParts = await carPartJson.json();

  const carPartList = document.querySelector(".CarPart1");
  carParts.forEach((carPart) => {
    console.log(carPart);
    const part = document.createElement("div");
    part.classList.add("CarPart");
    part.innerHTML = `
    <img src="../CarList/vin.png" id="CarPart_img">
                            <p>Part name: ${carPart.PartName}</p>
                           <p>Part Status: ${
                             carPart.Status ? carPart.Status : "N/A"
                           }</p>
<p>Installation date: ${
      carPart.InstallationDate ? carPart.InstallationDate : "N/A"
    }</p>
<p>Expired date: ${carPart.ExpiryDate ? carPart.ExpiryDate : "N/A"}</p>

                            <a href="" class="ServiceButton">Service</a>
        `;
    carPartList.appendChild(part);
  });
}

getPart();
