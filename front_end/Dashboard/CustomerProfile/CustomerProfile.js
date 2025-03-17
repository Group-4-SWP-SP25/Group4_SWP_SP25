const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("ID");

window.onload = async () => {
  await GetUserInfo();
  await GetCarList();
}

// Get user info
async function GetUserInfo() {
  await fetch("http://localhost:3000/CustomerManager/getUserInfo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ id: id }),
  })
    .then((response) => response.json())
    .then(async (result) => {
      document.getElementById("currentpath").innerHTML =
        result.FirstName + " " + result.LastName;
      document.getElementById("user-name").innerHTML =
        result.FirstName + " " + result.LastName;
      document.getElementById("user-email").innerHTML = result.Email;
      document.getElementById("user-phone").innerHTML = result.Phone;
      document.getElementById("user-dob").innerHTML = result.DOB.split("T")[0];
      document.getElementById("user-address").innerHTML = result.Address;
      document.getElementById("user-datecreated").innerHTML = result.DateCreated.split("T")[0];

      // avatar
      let linkAvatar = null;
      try {
        const response = await fetch('http://localhost:3000/getFileInfo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ name: id })
        })
        const status = response.status;
        if (status == 200) {
          const result = await response.json();
          linkAvatar = result.avatar;
        }
      } catch (error) {
        console.log(error);
      }
      if (linkAvatar != null) {
        linkAvatar = `https://drive.google.com/thumbnail?id=${linkAvatar}`;
      } else {
        linkAvatar = "/resource/admin.jpg";
      }

      document.getElementById("user-avatar").src = linkAvatar;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

// Message button
document.querySelector('.btn-message').addEventListener('click', () => {
  window.location.href = `/front_end/Dashboard/Message/Message.html?ID=${id}&Name=${document.getElementById("user-name").innerHTML}`;
});


// Change avatar
const avatar = document.querySelector('#user-avatar');

avatar.addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.addEventListener('change', async () => {
    const file = input.files[0];
    if (file) {

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'avatar');
      formData.append('id', id);
      try {
        const response = await fetch('http://localhost:3000/uploadFile', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();

        avatar.setAttribute('src', `https://drive.google.com/thumbnail?id=${data}`);
      } catch (error) {
        console.error(error);
      }
    };
  });

  input.click();
});


// ---------------------------------------------Car control
let currentCar = null;
let totalCar = 0;
let carList = [];
const carImage = document.querySelector('.car-info-image img');
const carName = document.querySelector('#car-name');
const carBrand = document.querySelector('#car-brand');
const registrationNumber = document.querySelector('#registration-number');
const year = document.querySelector('#year');
// user car list
async function GetCarList() {
  try {
    document.querySelector('.zero-car').style.display = 'none';
    document.querySelector('.car-info-image').style.display = 'none';
    document.querySelector('.car-info-detail').style.display = 'none';
    document.querySelector('.car-info-footer').style.display = 'none';
    document.querySelector('.car-loader').style.display = 'block';
    const response = await fetch('http://localhost:3000/carList', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ userID: id }),
    });
    const list = await response.json();
    if (list.length == 0) {
      document.querySelector('.car-info-image').style.display = 'none';
      document.querySelector('.car-info-detail').style.display = 'none';
      document.querySelector('.zero-car').style.display = 'block';
      document.querySelector('.car-info-footer').style.display = 'none';
      document.querySelector('.car-loader').style.display = 'none';
    } else {
      totalCar = list.length;
      carList = [];
      for (let car of list) {
        carList.push(car);
      }
      await (async (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
      })(1000);
      SwitchCar(0);
      document.querySelector('.car-info-image').style.display = 'flex';
      document.querySelector('.car-info-detail').style.display = 'block';
      document.querySelector('.zero-car').style.display = 'none';
      document.querySelector('.car-info-footer').style.display = 'flex';
      document.querySelector('.car-loader').style.display = 'none';
    }
  } catch (error) {
    console.log(error);
  }
}

// switch car
async function SwitchCar(carIndex) {
  currentCar = carIndex;
  const car = carList[currentCar];
  carImage.src = "../../../resource/pic1.jpg";
  carName.innerHTML = car.CarName;
  carBrand.innerHTML = car.Brand;
  registrationNumber.innerHTML = car.RegistrationNumber;
  year.innerHTML = car.Year;
  SetPagination();
}

// set pagination
const previousCar = document.querySelector('.previous-car');
const nextCar = document.querySelector('.next-car');
function SetPagination() {
  previousCar.style.display = 'block';
  nextCar.style.display = 'block';
  if (currentCar == 0) {
    previousCar.style.display = 'none';
  }
  if (currentCar == totalCar - 1) {
    nextCar.style.display = 'none';
  }
}

previousCar.addEventListener('click', () => {
  currentCar--;
  SwitchCar(currentCar);
});
nextCar.addEventListener('click', () => {
  currentCar++;
  SwitchCar(currentCar);
});

// edit car
document.querySelector('.edit-car-btn').addEventListener('click', () => {
  window.location.href = `/front_end/Dashboard/CarDetail/CarDetail.html?ID=${id}&name=${document.getElementById("user-name").innerHTML}&carID=${carList[currentCar].CarID}`;
})

// add car
document.querySelector('.btn-add').addEventListener('click', async () => {
  try {
    await fetch('http://localhost:3000/createNewCar', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ userID: id }),
    })
      .then((response) => response.status)
      .then((data) => {
        if (data == 200) {
          GetCarList();
        }
      })
  }
  catch (error) {
    console.log(error);
  }
})