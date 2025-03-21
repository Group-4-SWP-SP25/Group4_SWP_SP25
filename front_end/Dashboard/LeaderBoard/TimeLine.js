// - -------------------------------------------------time line controller

let currentDay = today;
let controllers2 = [];
const prevDayBtn = document.getElementById("prevDay");
const nextDayBtn = document.getElementById("nextDay");
const timeline_currentday = document.getElementById("currentDay");
const timeline_loader = document.getElementById("timeline-loader");
const timeline_item_container = document.querySelector(".timelineitemcontainer");
// const employee_container = document.querySelector(".employee-container");

prevDayBtn.addEventListener("click", async function () {
    currentDay.setDate(currentDay.getDate() - 1);

    await GetTimeLine(currentDay, new AbortController());
});

nextDayBtn.addEventListener("click", async function () {
    currentDay.setDate(currentDay.getDate() + 1);

    await GetTimeLine(currentDay, new AbortController());
});


// --------------------------------------------get time line
async function GetTimeLine(date, controller) {
    try {
        timeline_loader.style.display = 'flex';

        currentDay = date;
        controllers2.forEach(controller => controller.abort());
        controllers2 = [];
        controllers2.push(controller);

        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()

        timeline_currentday.innerHTML = year + '-' + format(month) + '-' + format(day);

        let elements = document.querySelectorAll('.timeline-item')
        elements.forEach(element => {
            while (element.children[1]) element.removeChild(element.children[1]);
        })

        const signal = controller.signal;
        if (signal.aborted) {
            return
        }

        const startOfDay = year + '-' + format(month) + '-' + format(day) + "T00:00:00.0Z";
        const endOfDay = year + '-' + format(month) + '-' + format(day) + "T23:59:59.0Z";

        signal.addEventListener("abort", () => {
            return
        });


        const response = await fetch('http://localhost:3000/Calendar/GetEvents', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                startDate: startOfDay,
                endDate: endOfDay,
            }),
            signal: signal
        })
        const result = await response.json()

        const events = result.events
        for (let event of events) {
            if (signal.aborted) {
                return
            }
            // console.log('day event: ', event)
            AddTimeLine(event)
        }

        timeline_loader.style.display = 'none';
    }
    catch (error) {
        // console.log(error)
    }
}


// get time line
async function AddTimeLine(event) {
    let startHour = event.start.split('T')[1].split(':')[0]
    let endHour = event.end.split('T')[1].split(':')[0]
    let employeeid = event.summary.split('-')[1]
    let employee = document.querySelector(`[timeline-item-id="${employeeid}"]`);
    let item = document.createElement("div");
    item.classList.add(`timeline-item-info`);
    item.innerHTML = `
        <span class="material-icons timeline-item-icon">
            handshake
        </span>
    `

    item.classList.add(`col-start-${startHour - 5}`);
    item.setAttribute('start', startHour);
    item.classList.add(`col-end-${endHour - 5}`);
    item.setAttribute('end', endHour);


    employee.appendChild(item);
}

// -------------------------------------- Get employees --------------------------------------------------

async function GetEmployees() {
    timeline_item_container.style.display = 'none';
    employee_container.style.display = 'none';
    timeline_item_container.innerHTML = '';
    try {
        const response = await fetch('http://localhost:3000/Employee/getEmployees', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        })
        const result = await response.json()
        const employees = result.employees
        for (let employee of employees) {
            await AddEmployee(employee)
            // console.log(employee)
        }
        timeline_item_container.style.display = 'block';
        employee_container.style.display = 'grid';
        document.getElementById('timeline-item-loader').style.display = 'none';
        document.getElementById('employee-loader').style.display = 'none';
        document.getElementById('add-timeline').addEventListener('click', () => {
            togglePopup();
        });

    }
    catch (error) {
        console.log(error)
    }
}

async function AddEmployee(employee) {
    let item = document.createElement("div");
    item.classList.add(`timeline-item`);
    item.classList.add(`grid`);
    item.classList.add(`grid-cols-12`);
    item.setAttribute('timeline-item-id', employee.UserID)

    // avatar
    let linkAvatar = null;
    try {
        const response = await fetch('http://localhost:3000/getFileInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ name: employee.UserID })
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

    AddEmployeeCard(employee, linkAvatar);
    AddEmployeePopup(employee.UserID, employee.FirstName + ' ' + employee.LastName, linkAvatar);

    item.addEventListener('click', () => {
        Choose_employee = employee.UserID
        document.querySelector('.employee-select-btn').innerHTML = employee.FirstName + ' ' + employee.LastName
        document.querySelector('.employee-select-btn').style.color = 'white';
        PopupDate.value = currentDay.getFullYear() + '-' + format(currentDay.getMonth() + 1) + '-' + format(currentDay.getDate());
        togglePopup()
    })
    item.innerHTML = `
        <div class="employee ...">
            <img src="${linkAvatar}" alt="employee">
            <span class="subtitle">${employee.FirstName + " " + employee.LastName}</span>
        </div>
    `

    timeline_item_container.appendChild(item);
}

window.onload = async () => {
    await GetEmployees();
    GetTimeLine(currentDay, new AbortController());
}