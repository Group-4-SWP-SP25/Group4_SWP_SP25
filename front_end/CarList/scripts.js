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
        const carList = await $.ajax({
            url: 'http://localhost:3000/getCarList',
            method: 'POST',
            contentType: 'application/json'
        });

        // console.log(carList);

        carList.forEach((car) => {
            // car class
            const carDiv = document.createElement('div');
            carDiv.classList.add('car');

            // background image
            const carImg = document.createElement('img');
            if (!car.CarImage) {
                carImg.src = 'car_not_found.jpg';
            } else {
                carImg.src = car.CarImage;
            }

            // overlay
            const carOverlay = document.createElement('div');
            carOverlay.classList.add('car-overlay');

            const carName = document.createElement('h2'); // car name
            carName.textContent = `Name: ${car.CarName}`;

            const carBrand = document.createElement('h3'); // car brand
            carBrand.textContent = `Brand: ${car.Brand}`;

            const carRegNum = document.createElement('h3'); // car registration number
            carRegNum.textContent = `Registration Number: ${car.RegistrationNumber}`;

            const carYear = document.createElement('h3'); // car year
            carYear.textContent = `Purchase date: ${car.Year}`;

            const carMaintRegDate = document.createElement('h3'); // car maintenance registration date
            carMaintRegDate.textContent = `Maintainance Reg. Date: ${customFormatDate(car.MaintenanceResgistrationDate)}`;

            const buttonChoose = document.createElement('a'); // choose button
            buttonChoose.href = `../CarDetail/CarDetail.html?carID=${car.CarID}`;
            buttonChoose.classList.add('button-detail');
            const buttonChooseLabel = document.createElement('h5');
            buttonChooseLabel.textContent = 'Choose this car';
            buttonChoose.appendChild(buttonChooseLabel);

            carOverlay.appendChild(carName);
            carOverlay.appendChild(carBrand);
            carOverlay.appendChild(carRegNum);
            carOverlay.appendChild(carYear);
            carOverlay.appendChild(carMaintRegDate);
            carOverlay.appendChild(document.createElement('br'));
            carOverlay.appendChild(buttonChoose);

            carDiv.appendChild(carImg);
            carDiv.appendChild(carOverlay);

            carListDiv.appendChild(carDiv);
        });
    } catch (err) {
        console.log(err);
    }
}

getCarList();
