async function getCarList(carID){
    const carJson = await fetch("http://localhost:3000/CarList", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const car=await carJson.json();
    const carList = document.querySelector(".container");

    // carList.innerHTML = "";
car.forEach((carItem) => {
    const carDiv = document.createElement("div");
    carDiv.classList.add("car");

    carDiv.innerHTML = `
        <h2>${carItem.name}</h2>
        <img src="ford.png" alt="${carItem.name}">
        <p>Status: <span style="color: ${carItem.status ? 'green' : 'red'};">
            ${carItem.status ? '✅ Active' : '❌ Maintaining'}
        </span></p>
        <a href="../CarDetail/CarDetail.html?id=${carItem.id}">Car detail</a>
    `;

    carList.appendChild(carDiv);
});
}
getCarList();
  