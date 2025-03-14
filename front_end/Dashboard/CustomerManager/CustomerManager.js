const table = document.getElementById('UserList');

let pageCount;
let firstIndex;
let currentPage = 1;
const numRowPerTable = 10;

let select = [];

const searchInput = document.getElementById('searchString');
let searchString = searchInput.value;

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

let sortColumn = '';
let sortOrder = 'ASC';

const userlist = document.getElementById('UserList').querySelector('tbody');

function addRow(user) {
    let newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td> <input type="checkbox"/> </td>
        <td class="ID">${user.UserID}</td>
        <td class="Name">${user.FirstName + ' ' + user.LastName}</td>
        <td class="Email">${user.Email}</td>
        <td class="Phone">${user.Phone}</td>
        <td class="Date">${user.DateCreated}</td>
        <td><button class="details-btn">View Details</button></td>
    `;
    userlist.appendChild(newRow);
    // Add event listener for the "View Details" button
    const detailsButton = newRow.querySelector('.details-btn');
    detailsButton.addEventListener('click', () => {
        window.location.href = `http://127.0.0.1:5500/front_end/Dashboard/CustomerProfile/CustomerProfile.html?ID=${user.UserID}`;
    });
}

// chỉ số trang 
async function setPagination(index) {
    currentPage = index;
    firstIndex = (currentPage - 1) * 10 + 1;

    // 2 button
    if (currentPage == 1) {
        Previous.style.display = 'none';
    } else {
        Previous.style.display = 'block';
    }
    if (currentPage == pageCount) {
        Next.style.display = 'none';
    } else {
        Next.style.display = 'block';
    }

    // page index
    if (pageCount <= 7) {
        document.querySelectorAll('.page').forEach(function (element) {
            element.remove();
        });

        firstPage.style.display = 'none';
        lastPage.style.display = 'none';

        firstDot.style.display = 'none';
        secondDot.style.display = 'none';

        firstButton.style.display = 'none';
        secondButton.style.display = 'none';
        thirdButton.style.display = 'none';

        Previous.style.display = 'none';
        Next.style.display = 'none';

        for (let i = 1; i <= pageCount; i++) {
            let button = document.getElementById(`page${i}`);
            if (!button) {
                button = document.createElement('button');
                button.classList.add('button');
                button.id = `page${i}`;
                button.classList.add('page');
                button.innerHTML = i;
                button.addEventListener('click', () => setPagination(i));
                Next.parentNode.insertBefore(button, Next);
            }
            button.style.display = 'inline-block';
            button.classList.remove('active');
            if (i === currentPage) {
                button.classList.add('active');

            }
        }

    } else {
        document.querySelectorAll('.page').forEach(function (element) {
            element.remove();
        });

        firstPage.style.display = 'inline-block';
        lastPage.style.display = 'inline-block';

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

        firstButton.style.display = 'inline-block';
        secondButton.style.display = 'inline-block';
        thirdButton.style.display = 'inline-block';
    }

    // set active class
    for (let button of buttons) {
        button.classList.remove("active");
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

    // remove all rows
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    // add row to table
    await fetch('http://localhost:3000/CustomerManager/getUserList', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ firstIndex: firstIndex - 1, count: numRowPerTable, searchString: searchString, sortColumn: sortColumn, sortOrder: sortOrder })
    })
        .then(response => {
            if (response.status === 403) {
                localStorage.removeItem('token');
                window.location.href = 'http://localhost:5500/front_end/Login/Login.html';
            }
            return response.json()
        })
        .then(result => {
            for (i = 0; i < result.list.length; i++) {
                let user = result.list[i];
                addRow(user);
            }
        });
}

async function showTable() {
    // get number of pages
    await fetch('http://localhost:3000/CustomerManager/getTotelUserCount', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ searchString: searchString })
    })
        .then(response => {
            if (response.status === 403) {
                localStorage.removeItem('token');
                window.location.href = 'http://localhost:5500/front_end/Login/Login.html';
            }
            return response.json()
        })
        .then(result => pageCount = Math.ceil(result.count / numRowPerTable));

    firstPage.innerHTML = '1';
    lastPage.innerHTML = pageCount;

    setPagination(1);

}

window.onload = () => {
    showTable();
    // add button's event
    Previous.addEventListener('click', () => {
        setPagination(currentPage - 1);
    });
    Next.addEventListener('click', () => {
        setPagination(currentPage + 1)
    });
    for (let button of buttons) {
        button.addEventListener('click', function () {
            setPagination(parseInt(button.innerHTML))
        });
    }

    // Add event listener for search input
    searchInput.addEventListener('input', () => {
        searchString = searchInput.value;
        showTable();
    });

    // Add event listener for sort buttons
    const sortButtons = document.querySelectorAll('.sort');
    sortButtons.forEach(button => {
        button.addEventListener('click', () => {
            const column = button.getAttribute('data-column');
            if (sortColumn === column) {
                sortOrder = sortOrder === 'ASC' ? 'DESC' : 'ASC';
            } else {
                sortColumn = column;
                sortOrder = 'ASC';
            }
            showTable();
        });
    });
}