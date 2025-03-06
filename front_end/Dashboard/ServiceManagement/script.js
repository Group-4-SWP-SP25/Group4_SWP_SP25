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
function searchService(result) {
    const filterFunction = () => {
        const searchTerm = searchBar.value.toLowerCase();
        const checkedColumns = Array.from(filterCheckboxes)
            .filter((checkbox) => checkbox.checked)
            .map((checkbox) => checkbox.dataset.column);

        const isSearchMatch = (row) => {
            return !searchTerm || Object.values(row)
                .filter((value) => typeof value === 'string')
                .some((value) => value.toLowerCase().includes(searchTerm));
        };

        const isColumnMatch = (row) => {
            if (checkedColumns.length === 0) return true;
            return checkedColumns.some((column) => {
                const value = String(row[column]).toLowerCase();
                return value.includes(searchTerm);
            });
        };

        const filteredData = result.filter((row) => isSearchMatch(row) && isColumnMatch(row));
        renderTable(filteredData);
    };

    // Debounce function
    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    };

    // Throttle function
    const throttle = (func, limit) => {
        let lastFunc;
        let lastRan;
        return function (...args) {
            if (!lastRan) {
                func.apply(this, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function () {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(this, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    };

    const debouncedFilter = debounce(filterFunction, 300); // Debounce delay 300ms
    const throttledFilter = throttle(filterFunction, 200); // Throttle delay 200ms

    searchBar.addEventListener('input', debouncedFilter);
    filterCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', throttledFilter);
    });
}

// Delete service
let chosenServiceID = null; // store chosen ID
let oldServiceData = []; // store old render table

function showPopup(element) {
    chosenServiceID = +element.dataset.serviceid; // get dataset from self
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
    } catch (err) {
        console.error('Error deleting service:', err);
    }
}

// Main functions
async function getServiceListAll() {
    try {
        const response = await fetch('http://localhost:3000/getServiceListAll', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        const result = await response.json();
        console.log(result);

        if (oldServiceData === null || JSON.stringify(result) !== JSON.stringify(oldServiceData)) {
            renderTable(result);
            searchService(result);
            oldServiceData = result;
            scheduleNextUpdate(500); // short delay if changed
        } else {
            scheduleNextUpdate(10000); // long delay if unchanged
        }
    } catch (error) {
        console.error('Error fetching service list:', error);
        scheduleNextUpdate(5000); // retry if error
    }
}

// set refresh interval
function scheduleNextUpdate(delay) {
    setTimeout(getServiceListAll, delay);
}

getServiceListAll();
