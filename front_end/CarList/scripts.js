const urlParams = new URLSearchParams(window.location.search);

const carListDiv = document.querySelector('.car-list');

function customFormatDate(dateTimeString) {
    const date = new Date(dateTimeString);
    const options = {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    };
    return date.toLocaleDateString('en-GB', options).replace(/ /g, '/');
}

async function getCarList() {
    try {
        const user = await $.ajax({
            url: 'http://localhost:3000/getUserInfo',
            method: 'POST',
            contentType: 'application/json',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        const carList = await $.ajax({
            url: 'http://localhost:3000/carList',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ userID: user.id })
        });

        let carListItems = '';
        carList.forEach((car) => {
            const carListItem = `
                                <div class="car">
                                    <img 
                                        src="${car.CarImage ? car.CarImage : 'car_not_found.jpg'}" 
                                        alt="car${car.CarID}" />
                                    <div class="car-overlay">
                                        <h2>Name: ${car.CarName}</h2>
                                        <h3>Brand: ${car.Brand}</h3>
                                        <h3>Registration Number: ${car.RegistrationNumber}</h3>
                                        <h3>Purchase year: ${car.Year}</h3>
                                        <h3>Maintainance Reg. Date: ${customFormatDate(car.MaintenanceResgistrationDate)}</h3>
                                        <br />
                                        <a
                                            href="/front_end/CarDetail/CarDetail.html?carID=${car.CarID}"
                                            class="button-detail">
                                            <h5>Choose this car</h5>
                                        </a>
                                    </div>
                                </div>
                                `;

            carListItems += carListItem;
        });

        carListDiv.innerHTML = carListItems;
    } catch (err) {
        let carListItems = `
                            <div class="car" style="grid-column: 2;">
                                <img 
                                    src="car_not_found.jpg" 
                                    alt="car_not_found" />
                                <div class="car-overlay">
                                    <h2 style="margin: 0 1%">This user has not added any cars to the system yet.</h2>
                                </div>
                            </div>
                            `;
        carListDiv.innerHTML = carListItems;

        console.log(err);
    }
}

getCarList();
