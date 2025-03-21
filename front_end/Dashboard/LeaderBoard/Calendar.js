const calendarDays = document.getElementById("calendarDays");
const currentMonth = document.getElementById("currentMonth");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");
const calendarLoader = document.getElementById("calendar-loader");

let today = new Date();
let currentYear = today.getFullYear();
let currentMonthIndex = today.getMonth();
let controllers = [];

function format(number) {
    return number < 10 ? `0${number}` : number;
}

document.getElementById('calendar-today').addEventListener('click', () => {
    today = new Date();
    currentYear = today.getFullYear();
    currentMonthIndex = today.getMonth();
    renderCalendar(currentYear, currentMonthIndex);
});


document.addEventListener("DOMContentLoaded", function () {

    renderCalendar(currentYear, currentMonthIndex);
});

async function renderCalendar(year, month) {
    calendarLoader.style.display = 'flex';
    calendarDays.innerHTML = "";

    let firstDay = new Date(year, month, 1).getDay(); // Ngày đầu tiên của tháng (0-6)
    let lastDate = new Date(year, month + 1, 0).getDate(); // Số ngày trong tháng
    let prevLastDate = new Date(year, month, 0).getDate(); // Số ngày của tháng trước

    currentMonth.innerText = `${year} - ${month + 1}`;

    // Thêm ngày của tháng trước (nếu cần)
    for (let i = firstDay - 1; i >= 0; i--) {
        let dayElement = document.createElement("div");
        dayElement.classList.add("day", "other-month");
        dayElement.innerText = prevLastDate - i;
        calendarDays.appendChild(dayElement);
    }

    // Hiển thị ngày trong tháng
    for (let day = 1; day <= lastDate; day++) {
        let dayElement = document.createElement("div");
        dayElement.classList.add("day");
        dayElement.setAttribute('day', format(day));
        dayElement.setAttribute('month', format(currentMonthIndex + 1));
        dayElement.setAttribute('year', currentYear);
        dayElement.setAttribute('duration', 0);
        dayElement.innerText = day;
        dayElement.addEventListener("click", function () {
            let currentDay = new Date(year, month, day);
            GetTimeLine(currentDay, new AbortController());
        })

        // Đánh dấu ngày hôm nay
        if (day === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
            dayElement.classList.add("today");
        }

        calendarDays.appendChild(dayElement);
    }

    // Thêm ngày của tháng sau (để đủ hàng)
    let totalCells = firstDay + lastDate;
    let nextDays = 7 - (totalCells % 7);
    if (nextDays < 7) {
        for (let i = 1; i <= nextDays; i++) {
            let dayElement = document.createElement("div");
            dayElement.classList.add("day", "other-month");
            dayElement.innerText = i;
            calendarDays.appendChild(dayElement);
        }
    }


    // Hủy bỏ tất cả các `AbortController` cũ
    controllers.forEach(controller => controller.abort());
    controllers = []; // Reset danh sách

    // Tạo một `AbortController` mới và thêm vào danh sách
    const controller = new AbortController();
    controllers.push(controller);

    await GetEvents(currentYear, currentMonthIndex + 1, controller);
    calendarLoader.style.display = 'none';
}

prevMonthBtn.addEventListener("click", function () {
    currentMonthIndex--;
    if (currentMonthIndex < 0) {
        currentMonthIndex = 11;
        currentYear--;
    }
    renderCalendar(currentYear, currentMonthIndex);
});

nextMonthBtn.addEventListener("click", function () {
    currentMonthIndex++;
    if (currentMonthIndex > 11) {
        currentMonthIndex = 0;
        currentYear++;
    }
    renderCalendar(currentYear, currentMonthIndex);
});

async function GetEvents(year, month, controller) {
    try {
        const signal = controller.signal;
        if (signal.aborted) {
            return
        }

        const lastDate = new Date(year, month, 0).getDate();
        const startDate = year + '-' + format(month) + '-' + '01' + "T00:00:00.0Z";
        const endDate = year + '-' + format(month) + '-' + lastDate + "T23:59:59.0Z";

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
                startDate: startDate,
                endDate: endDate,
            }),
            signal: signal
        })

        const result = await response.json()
        const events = result.events
        for (let event of events) {
            if (signal.aborted) {
                return
            }
            let startHour = event.start.split('T')[1].split(':')[0]
            let endHour = event.end.split('T')[1].split(':')[0]
            let date = event.start.split('T')[0]
            let day = date.split('-')[2]
            let item = calendarDays.querySelector(`[day="${day}"]`)
            let duration = endHour - startHour + parseInt(item.getAttribute('duration'))
            item.setAttribute('duration', duration)
            if (duration == 0) {
                return
            } else if (duration < 4) {
                item.className = 'day haveevent-low'
            } else if (duration < 6) {
                item.className = 'day haveevent-medium'
            } else if (duration < 8) {
                item.className = 'day haveevent-high'
            } else {
                item.className = 'day haveevent-full'
            }
            if (day == today.getDate()) {
                item.classList.add("today");
            }
        }
    } catch (error) {
        console.log(error)
        return
    }
}
