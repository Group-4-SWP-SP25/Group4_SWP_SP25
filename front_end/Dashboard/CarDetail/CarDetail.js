const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("ID");
const username = urlParams.get("name");
const carID = urlParams.get("carID");

document.getElementById("path-username").innerHTML = username;
document.getElementById("path-username").setAttribute("href", `http://localhost:5500/front_end/Dashboard/CustomerProfile/CustomerProfile.html?ID=${id}`);

window.onload = async () => {
    await GetCarDetail();
    await getCarParts();
}

document.querySelector('.btn-cancel').addEventListener('click', async () => {
    await GetCarDetail();
    await getCarParts();
});

document.querySelector('.btn-done').addEventListener('click', async () => {
    await SaveCarDetail();
    await SaveCarParts();
    alert('Update Car successfully')
});

//click
document.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('date')) {
        EditDate(target);
        return
    }
    if (target.classList.contains('edit-car')) {
        EditCar(target.parentElement.querySelector('.text'));
        return
    }
    if (target.classList.contains('Status')) {
        target.appendChild(dropdown);
        currentStatus = target;
    } else if (target.classList.contains('dropdown-item')) {
        setStatus(currentStatus, target.innerHTML);
    } else {
        dropdown.remove();
    }
});

// Add event listener to the cell
function EditDate(cell) {
    if (!cell.querySelector('input')) {
        let temp = cell.innerHTML;
        const dateInput = document.createElement('INPUT');
        dateInput.setAttribute("type", "date");
        dateInput.setAttribute("value", cell.innerHTML);
        cell.innerHTML = "";
        cell.appendChild(dateInput);

        dateInput.focus();
            
            const outsideClick = () => {
            setTimeout(() => {
                if (document.activeElement !== dateInput) {
                    cell.innerHTML = temp;
                    dateInput.remove();
                }
            }, 0);
        };

        dateInput.addEventListener('blur', outsideClick);

        dateInput.addEventListener('keydown', function (event) {
            if (event.key === "Enter" || event.keyCode === 13) {
                temp = dateInput.value;
                dateInput.removeEventListener('blur', outsideClick);
                dateInput.remove();
                cell.innerHTML = temp;
            }
        });
    }
};

// edit car info
function EditCar(cell) {
    if (!cell.querySelector('input')) {
        let temp = cell.innerHTML;
        const input = document.createElement('INPUT');
        input.setAttribute("type", "text");
        input.setAttribute("value", cell.innerHTML);
        cell.innerHTML = "";
        cell.appendChild(input);
        input.focus();
        input.selectionStart = input.selectionEnd = input.value.length;
        const outsideClick = () => {
            setTimeout(() => {
                if (document.activeElement !== input) {
                    cell.innerHTML = temp;
                    input.remove();
                }
            }, 0);
        };

        input.addEventListener('blur', outsideClick);

        input.addEventListener('keydown', function (event) {
            if (event.key === "Enter" || event.keyCode === 13) {
                if (cell.classList.contains('-purchased-year')) {
                    if (isNaN(input.value)) {
                        alert("Year must be a number");
                        return;
                    }
                }
                temp = input.value;
                input.remove();
                cell.innerHTML = temp;
            }
        });

    }
}


// get car detail
async function GetCarDetail() {
    try {
        const response = await fetch('http://localhost:3000/carInfo', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ carID: carID }),
        });
        const car = await response.json();
        document.querySelector('.-car-name').innerHTML = car.CarName;
        document.getElementById("path-carname").innerHTML = (car.CarName == null) ? "New Car" : car.CarName;
        document.querySelector('.-car-brand').innerHTML = car.Brand;
        document.querySelector('.-registration-number').innerHTML = car.RegistrationNumber;
        document.querySelector('.-purchased-year').innerHTML = car.Year;
    } catch (err) {
        console.error("Cannot get car info:", err);
    }
}


// dropdown
let dropdown = document.createElement('ul');
dropdown.id = 'dropdown';
dropdown.innerHTML = `
    <li class="dropdown-item ok">OK</li>
    <li class="dropdown-item Expired">Expired</li>
    <li class='dropdown-item Maintenance'>Maintenance required</li>
    <li class="dropdown-item not-available">Not available</li>
`
let currentStatus = null;


// set status 
function setStatus(item, status) {
    item.innerHTML = status;
    if (status == "Maintenance required") {
        item.classList = "Status Maintenance";
    } else if (status == "Expired") {
        item.classList = "Status Expired";
    } else if (status == "OK") {
        item.classList = "Status ok";
    } else if (status == "Not available") {
        item.classList = "Status not-available";
    }
}

// get car parts
async function getCarParts() {
    try {
        const response = await fetch('http://localhost:3000/getCarParts', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ carID: carID }),
        });
        const result = await response.json();
        const parts = result.list;
        for (let part of parts) {
            displayCarParts(part);
        }
    } catch (err) {
        console.error("Cannot get car parts!:", err);
    }
}

const carPartContainer = document.querySelector('.car-part-container');
// display car parts
function displayCarParts(part) {
    let item = carPartContainer.querySelector(`tr[part="${part.PartID}"]`);
    item.querySelector('.InstallationDate').innerHTML = (part.InstallationDate == null) ? "YYYY-MM-DD" : part.InstallationDate.split('T')[0];
    item.querySelector('.ExpirationDate').innerHTML = (part.ExpiryDate == null) ? "YYYY-MM-DD" : part.ExpiryDate.split('T')[0];
    setStatus(item.querySelector('.Status'), (part.Status == null) ? "Not available" : part.Status);
}


// save car detail
async function SaveCarDetail() {
    try {
        let carName = document.querySelector('.-car-name').innerHTML;
        let brand = document.querySelector('.-car-brand').innerHTML;
        let registrationNumber = document.querySelector('.-registration-number').innerHTML;
        let year = document.querySelector('.-purchased-year').innerHTML;
        // console.log(carName, brand, registrationNumber, year);
        const response = await fetch('http://localhost:3000/updateCarInfo', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ carID: carID, carName: carName, brand: brand, regNum: registrationNumber, year: year }),
        })
    } catch (err) {
        console.error("Cannot save car detail!:", err);
    }
}

//delete car
document.querySelector('.btn-delete').addEventListener('click', async () => {
    try {
        console.log(carID);
        const response = await fetch('http://localhost:3000/deleteCar', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ carID: carID }),
        })
        const status = response.status;
        if (status == 200) {
            alert("Car deleted!");
            window.location.href = `http://localhost:5500/front_end/Dashboard/CustomerProfile/CustomerProfile.html?ID=${id}`;
        }
    } catch (err) {
        console.error("Cannot delete car!:", err);
    }
})

// save car parts 
async function SaveCarParts() {
    const parts = carPartContainer.querySelectorAll('tr[part]');
    let list = []
    for (let part of parts) {
        const partID = part.getAttribute('part')
        const InstallationDate = part.querySelector('.InstallationDate').innerHTML;
        const ExpiryDate = part.querySelector('.ExpirationDate').innerHTML;
        const Status = part.querySelector('.Status').innerHTML;
        list.push({
            PartID: partID,
            InstallationDate: (InstallationDate == 'YYYY-MM-DD') ? null : InstallationDate,
            ExpiryDate: (InstallationDate == 'YYYY-MM-DD') ? null : ExpiryDate,
            Status: (Status == 'Not available') ? null : Status
        })
    }

    try {
        const response = await fetch('http://localhost:3000/updateCarPart', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                carID: carID,
                parts: list
            }),
        })
    } catch (error) {
        console.log(error)
    }
}