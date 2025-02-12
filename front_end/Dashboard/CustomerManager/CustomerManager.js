const table = document.getElementById('UserList');
var pageCount;
var firstIndex;
var lastIndex;
var currentPage = 1;

const Previous = document.getElementById('Previous');
const Next = document.getElementById('Next');

const firstPage = document.getElementById('firstPage');
const lastPage = document.getElementById('lastPage');

const firstButton = document.getElementById('firstButton');
const secondButton = document.getElementById('secondButton');
const thirdButton = document.getElementById('thirdButton');

const buttons = document.getElementsByClassName("button");

const firstDot = document.getElementById('firstDot');
const secondDot = document.getElementById('secondDot');

function addRow(user) {
    var newRow = table.insertRow();
    newRow.innerHTML = `
        <td class="ID">${user.UserID}</td>
        <td class="Name">${user.FirstName + ' ' + user.LastName}</td>
        <td class="Email">${user.Email}</td>
        <td class="Phone">${user.Phone}</td>
        <td class="Date">${user.DateCreated}</td>
        <td><button class="details-btn">View Details</button></td>
    `;
}

async function setPagination(index) {
    currentPage = index
    firstIndex = (currentPage - 1) * 10 + 1;
    lastIndex = (currentPage - 1) * 10 + 10;

    // 2 button
    if (currentPage == 1) {
        Previous.style.display = 'none';
        Next.style.display = 'block';
    } else if (currentPage == pageCount) {
        Previous.style.display = 'block';
        Next.style.display = 'none';
    } else {
        Previous.style.display = 'block';
        Next.style.display = 'block';
    }

    // page index
    if (currentPage <= 3) {
        firstDot.style.display = 'none';
        secondDot.style.display = 'block';

        firstButton.innerHTML = '2';
        secondButton.innerHTML = '3';
        thirdButton.innerHTML = '4';
    } else if (currentPage >= pageCount - 2) {
        firstDot.style.display = 'block';
        secondDot.style.display = 'none';

        firstButton.innerHTML = pageCount - 3;
        secondButton.innerHTML = pageCount - 2;
        thirdButton.innerHTML = pageCount - 1;
    } else {
        firstDot.style.display = 'block';
        secondDot.style.display = 'block';

        firstButton.innerHTML = currentPage - 1;
        secondButton.innerHTML = currentPage;
        thirdButton.innerHTML = currentPage + 1;
    }

    // set active class
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("active");
    }
    switch (currentPage) {
        case 1:
            firstPage.classList.add('active');
            break;
        case 2:
            firstButton.classList.add('active');
            break;
        case pageCount:
            lastPage.classList.add('active');
            break;
        case pageCount - 1:
            thirdButton.classList.add('active');
            break;
        default:
            secondButton.classList.add('active');
            break;
    }

    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    await fetch('http://localhost:3000/CustomerManager/getUserList', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ firstIndex, lastIndex })
    })
        .then(response => { return response.json() })
        .then(result => {
            for (i = 0; i < result.list.length; i++) {
                let user = result.list[i];
                addRow(user);
            }
        })
}

async function showTable() {
    // get number of pages
    await fetch('http://localhost:3000/CustomerManager/getTotelUserCount', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    })
        .then(response => { return response.json() })
        .then(result => pageCount = Math.ceil(result.count / 10));

    firstPage.innerHTML = '1';
    lastPage.innerHTML = pageCount;

    setPagination(1);

}

window.onload = () => {
    showTable();
    // add buton's event
    Previous.addEventListener('click', () => {
        setPagination(currentPage - 1);
    });
    Next.addEventListener('click', () => {
        setPagination(currentPage + 1)
    });
    for (var i = 0; i < buttons.length; i++) {
        (function (button) {
            button.addEventListener('click', function () {
                setPagination(parseInt(button.innerHTML))
            });
        })(buttons[i]);
    }
}