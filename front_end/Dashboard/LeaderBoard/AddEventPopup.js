const overlay = document.querySelector(".overlay");
const popup = document.querySelector(".popup-container");
const acceptButton = document.querySelector(".popup-btn-done");
const cancelButton = document.querySelector(".popup-btn-cancel");
const EmployeeList = document.querySelector('.employee-list');
const CustomerList = document.querySelector('.customer-list');
const PopupSearch = document.getElementById('PopupsearchString');
const CustomerLoader = document.getElementById('customer-loader');
const StartTime = document.getElementById('starttime');
const EndTime = document.getElementById('endtime');
const Description = document.getElementById('description');
const PopupDate = document.getElementById('popup-date');

let PopupFirstIndex = 0;
let PopupCount = 10;
let Choose_employee = 0
let Choose_customer = 0

document.querySelector('.employee-select').addEventListener('mouseenter', () => {
    EmployeeList.style.display = 'block';
});

document.querySelector('.employee-select').addEventListener('mouseleave', () => {
    EmployeeList.style.display = 'none';
});

PopupSearch.addEventListener('focus', () => {
    CustomerList.style.display = 'block';
})

document.addEventListener('click', (event) => {
    if (!PopupSearch.contains(event.target) && !CustomerList.contains(event.target)) {
        CustomerList.style.display = 'none';
    }
})

document.querySelector('.popup-btn-cancel').addEventListener('click', () => {
    togglePopup();
})


overlay.addEventListener("click", () => {
    togglePopup();
});


function togglePopup() {
    if (!popup.classList.contains('active')) {
        // active
        GetListCustomer();
        popup.style.display = 'flex';
        overlay.style.display = 'flex';
        setTimeout(() => {
            popup.classList.add('active');
            overlay.classList.add('active');
        }, 10); // Delay nhỏ để kích hoạt hiệu ứng
    } else {
        // hide
        popup.classList.remove('active');
        overlay.classList.remove('active');
        PopupSearch.value = '';
        PopupFirstIndex = 0;
        Choose_employee = 0;
        document.querySelector('.customer-select').innerHTML = 'Customer'
        document.querySelector('.customer-select').style.color = 'gray';
        Choose_customer = 0;
        document.querySelector('.employee-select-btn').innerHTML = 'Employee'
        document.querySelector('.employee-select-btn').style.color = 'gray';
        CustomerList.innerHTML = '';
        CustomerList.scrollTop = 0;
        PopupDate.value = '';
        Description.value = '';
        StartTime.value = '07:00';
        SetEndTime();
        setTimeout(() => {
            popup.style.display = 'none';
            overlay.style.display = 'none';
        }, 300); // Thời gian khóp với hiệu ứng transition
    }
}


async function AddEmployeePopup(id, name, linkAvatar) {
    let item = document.createElement("div");
    item.innerHTML = `
        <img src="${linkAvatar}">
        <span>${name}</span>
    `
    item.addEventListener('click', () => {
        Choose_employee = id
        document.querySelector('.employee-select-btn').innerHTML = name
        document.querySelector('.employee-select-btn').style.color = 'white';
        EmployeeList.style.display = 'none';
    });
    EmployeeList.appendChild(item);
}


async function GetListCustomer() {
    try {
        CustomerLoader.style.display = 'block';
        const response = await fetch('http://localhost:3000/CustomerManager/getUserList', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                firstIndex: PopupFirstIndex,
                count: PopupCount,
                searchString: PopupSearch.value
            })
        })

        const result = await response.json();
        let list = result.list;
        for (let item of list) {
            if (item.Role != 'User') continue;
            AddCustomerPopup(item.UserID, item.FirstName + ' ' + item.LastName);
        }
        CustomerLoader.style.display = 'none';
    } catch (error) {
        console.log(error)
    }
}


async function AddCustomerPopup(id, name) {
    let item = document.createElement("div");
    item.innerHTML = `
        <img src="/resource/admin.jpg">
        ${name}
    `
    item.addEventListener('click', () => {
        Choose_customer = id
        document.querySelector('.customer-select').innerHTML = name
        document.querySelector('.customer-select').style.color = 'white';
        CustomerList.style.display = 'none';
    });

    CustomerList.appendChild(item);
}


PopupSearch.addEventListener('input', () => {
    PopupFirstIndex = 0;
    CustomerList.innerHTML = '';
    GetListCustomer();
})

CustomerList.addEventListener('scroll', async () => {
    if (- CustomerList.scrollTop - CustomerList.clientHeight + CustomerList.scrollHeight <= 1) {
        PopupFirstIndex += PopupCount;
        let temp = CustomerList.scrollTop;
        await GetListCustomer();
        CustomerList.scrollTop = temp;
    }
})

StartTime.addEventListener('change', SetEndTime);


async function SetEndTime() {
    let starttime = parseInt(StartTime.value.split(':')[0])
    EndTime.innerHTML = '';
    for (let time = starttime + 1; time <= 17; time++) {
        let item = document.createElement('option');
        item.value = format(time) + ':00';
        item.innerHTML = (time < 13) ? format(time) + ':00 AM' : format(time - 12) + ':00 PM';
        EndTime.appendChild(item);
    }
    // EndTime.value = '08:00';
}


acceptButton.addEventListener("click", () => {
    console.log(Choose_employee, Choose_customer)
    if (Choose_employee == 0 || Choose_customer == 0) {
        alert('Please choose employee and customer');
        return;
    }
    if (PopupDate.value == '') {
        alert('Please choose date');
        return;
    }
    let timelineid = timeline_item_container.querySelector(`[timeline-item-id="${Choose_employee}"]`);
    let list = timelineid.querySelectorAll('.timeline-item-info');
    let start = parseInt(StartTime.value.split(':')[0]);
    let end = parseInt(EndTime.value.split(':')[0]);
    console.log(start, end)
    for (let item of list) {
        let itemstart = parseInt(item.getAttribute('start'));
        let itemend = parseInt(item.getAttribute('end'));
        console.log(itemstart, itemend)
        if ((start >= itemstart && start < itemend) || (end > itemstart && end <= itemend) || (start <= itemstart && end >= itemend)) {
            alert('This employee is busy at this time');
            return;
        }
    }
    AddEvent();
});


async function AddEvent() {
    console.log(Choose_employee, Choose_customer, PopupDate.value, StartTime.value, EndTime.value, Description.value)
    try {
        const response = await fetch('http://localhost:3000/Calendar/AddEvent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                employeeID: Choose_employee,
                customerID: Choose_customer,
                startTime: PopupDate.value + 'T' + StartTime.value + ':00+07:00',
                endTime: PopupDate.value + 'T' + EndTime.value + ':00+07:00',
                description: Description.value
            })
        })

        const result = await response.json();
        if (response.status == 200) {
            alert('Add event successfully');
            togglePopup();
            console.log(currentDay)
            GetTimeLine(currentDay, new AbortController())
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.log(error);
    }
}