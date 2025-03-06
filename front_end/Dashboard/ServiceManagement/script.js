// Elements
const serviceTable = document.querySelector('table');
const serviceTableBody = document.querySelector('tbody');
// const serviceTableBodyRows = Array.from(serviceTable.querySelectorAll('tbody tr'));
// const sortButtons = document.querySelectorAll('.sort');
const searchBar = document.querySelector('.search-input');
const filterCheckboxes = document.querySelectorAll('.search-filter input[type="checkbox"]');
const popup = document.querySelector('.popup');
const overlay = document.querySelector('.overlay');

// Support functions
// Render table out
function renderTable(result) {
    serviceTableBody.innerHTML = ''; // clear old content

    let dataRows = '';
    result.forEach((service) => {
        const dataRow = `
                        <tr>
                            <td style="width: 4%">${service.ServiceTypeID}</td>
                            <td style="width: 4%">${service.PartID}</td>
                            <td style="width: 10%; text-align: left">${service.ServiceName}</td>
                            <td style="width: 18%; text-align: left"">${service.ServiceDescription}</td>
                            <td style="width: 6%">${service.ServicePrice} ₫</td>
                            <td style="width: 10%" class="buttons">
                                <button class="btn-delete" data-serviceid="${service.ServiceID}" 
                                        onclick="showPopup(this);">
                                    Delete
                                </button>
                                <button class="btn-update">Update</button>
                            </td>
                        </tr>
                        `;

        dataRows += dataRow;
    });

    serviceTableBody.innerHTML += dataRows;
}

// Search service
function applyFilters(result) {
    const searchTerm = searchBar.value.toLowerCase();

    const checkedColumns = Array.from(filterCheckboxes)
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.dataset.column);

    let filteredData = result.filter((row) => {
        let searchMatch = true;
        if (searchTerm) {
            searchMatch = Object.keys(row)
                .filter((key) => key !== 'ServiceID') // exclude 'ServiceID' column
                .some((key) => {
                    const value = row[key];
                    if (typeof value === 'string') {
                        return value.toLowerCase().includes(searchTerm);
                    }
                    return String(value).toLowerCase().includes(searchTerm);
                });
        }

        let columnMatch = true;
        if (checkedColumns.length > 0) {
            columnMatch = checkedColumns.some((column) => {
                if (column === 'ServiceID') return false; // exclude 'ServiceID' column

                const value = row[column];
                if (typeof value === 'string') {
                    return value.toLowerCase().includes(searchTerm);
                }
                return String(value).toLowerCase().includes(searchTerm);
            });
        }

        return searchMatch && columnMatch;
    });

    renderTable(filteredData);
}

function searchService(result) {
    const filterFunction = () => applyFilters(result);
    searchBar.addEventListener('input', filterFunction);
    filterCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', filterFunction);
    });
}

// Delete service
let chosenServiceID = null; // storage variable

function showPopup(element) {
    chosenServiceID = +element.dataset.serviceid; // store data get from self
    console.log(chosenServiceID);
    popup.classList.remove('hidden');
    overlay.classList.remove('hidden');
}

function hidePopup() {
    popup.classList.add('hidden');
    overlay.classList.add('hidden');
}

function confirmedPopup() {
    if (chosenServiceID) {
        deleteService(chosenServiceID);
    }
    popup.classList.add('hidden');
    overlay.classList.add('hidden');
    chosenServiceID = null; // reset storage variable
}

async function deleteService(serviceID) {
    try {
        const response = await fetch('http://localhost:3000/deleteServiceById', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ serviceID })
        });
        // const result = await response.json();
        // console.log("Delete response:", result);
        // if (result.success) {
        //     console.log(`Deleted service with ID = ${serviceID}`);
        //     // await getServiceListAll(); // Refresh the table after deletion
        // } else {
        //     console.error('Failed to delete service:', result.error);
        // }      
    } catch (err) {
        console.error('Error deleting service:', err);
    }
}

// Main functions
async function getServiceListAll() {
    // Retrieve data
    const response = await fetch('http://localhost:3000/getServiceListAll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });
    const result = await response.json();
    // console.log(result);
    // console.log(typeof result[0].ServiceTypeID);

    // Pre-render
    renderTable(result);

    // Search
    searchService(result);
}

getServiceListAll();
