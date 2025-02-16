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
        system.innerHTML = `<a>${carSystem.carSystemName}</a>`;
        sytemList.appendChild(system);
    });
}

getSystem();

