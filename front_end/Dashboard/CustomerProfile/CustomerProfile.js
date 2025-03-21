const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("ID");
let userFirstName = null
let userLastName = null

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
      userFirstName = result.FirstName
      userLastName = result.LastName

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
  window.location.href = `/front_end/Dashboard/Message/Message.html?ID=${id}`;
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


// -----------user action
const editUser = document.querySelector('.btn-edit')
const messageUser = document.querySelector('.btn-message')
const deleteUser = document.querySelector('.btn-delete')
const accept = document.querySelector('.btn-accept')
const cancel = document.querySelector('.btn-cancel')

accept.style.display = 'none'
cancel.style.display = 'none';

editUser.addEventListener('click', () => {
  accept.style.display = 'flex'
  cancel.style.display = 'flex'
  editUser.style.display = 'none'
  messageUser.style.display = 'none'
  deleteUser.style.display = 'none'
  EditUser()
})

cancel.addEventListener('click', () => {
  accept.style.display = 'none'
  cancel.style.display = 'none'
  editUser.style.display = 'flex'
  messageUser.style.display = 'flex'
  deleteUser.style.display = 'flex'
  GetUserInfo()
})

accept.addEventListener('click', async () => {
  try {
    await CheckInput();
    cancel.click();
  }
  catch (error) {
    alert(error)
  }
})

const userName = document.getElementById('user-name');
const userEmail = document.getElementById('user-email');
const userPhone = document.getElementById('user-phone');
const userDOB = document.getElementById('user-dob');
const userAddress = document.getElementById('user-address');
function EditUser() {
  InputText(userName)
  InputText(userEmail)
  InputText(userPhone)
  InputDate(userDOB)
  InputText(userAddress)
}

function InputText(cell) {
  if (!cell.querySelector('input')) {
    const input = document.createElement('INPUT');
    input.setAttribute("type", "text");

    if (cell.id != 'user-name') {
      input.setAttribute("value", cell.innerHTML);
      cell.innerHTML = "";
      cell.appendChild(input);
    } else {
      const newInput = document.createElement('INPUT');
      newInput.setAttribute("type", "text");


      cell.innerHTML = "";
      input.classList.add('Firstname')
      input.setAttribute("value", userFirstName);
      cell.appendChild(input);

      newInput.classList.add('Lastname')
      newInput.setAttribute("value", userLastName);
      cell.appendChild(newInput);
    }

  }
}

function InputDate(cell) {
  if (!cell.querySelector('input')) {
    const dateInput = document.createElement('INPUT');
    dateInput.setAttribute("type", "date");
    dateInput.setAttribute("value", cell.innerHTML);
    cell.innerHTML = "";
    cell.appendChild(dateInput);
  }
}

const regexEmail = /^\w+@\w+(\.\w+)+$/;
const regexPhone = /^0\d{9}$/;
const regexName = /^[a-zA-Z0-9]{2,}$/;
async function CheckInput() {

  // check name
  const Firstname = userName.querySelector('.Firstname').value;
  if (Firstname == '') {
    throw new Error('Tên không được để trống!')
  } else if (!regexName.test(Firstname)) {
    throw new Error('Tên không đươjc chứa kí tự đặc biệt')
  }

  const Lastname = userName.querySelector('.Lastname').value;
  if (Lastname == '') {
    throw new Error('Tên không được để trống!')
  } else if (!regexName.test(Lastname)) {
    throw new Error('Tên không đươjc chứa kí tự đặc biệt')
  }

  // check email
  const email = userEmail.querySelector('input').value
  if (email == '') {
    throw new Error('Email không được để trống!')
  } else if (!regexEmail.test(email)) {
    throw new Error('Email không đúng định dạng')
  }

  // check phone
  const phone = userPhone.querySelector('input').value
  if (phone == '') {
    throw new Error('Số điện thoại không được để trống!')
  } else if (!regexPhone.test(phone)) {
    throw new Error('Số điện thoại không đúng định dạng')
  }

  // check dob
  const dob = userDOB.querySelector('input').value
  if (dob == '') {
    throw new Error('Ngày sinh không được để trống!')
  } else {
    let year = dob.split('-')[0]
    let currentyear = new Date().getFullYear()
    if ((year > currentyear - 18) || (year < currentyear - 80)) {
      throw new Error('Năm sinh không hợp lệ!')
    }
  }

  await UpdateUserProfile(Firstname, Lastname, email, phone, dob)
}

async function UpdateUserProfile(Firstname, Lastname, email, phone, dob) {
  let userData = {
    id: id,
    first_name: Firstname,
    last_name: Lastname,
    phone: phone,
    email: email,
    address: userAddress.querySelector('input').value,
    dob: dob
  };

  let response = await fetch("http://localhost:3000/updateUserProfile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  });

  if (!response.ok) throw new Error("Error when saving data!");
  alert("Profile updated successfully!");
}