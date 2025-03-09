// Elements
const serviceTable = document.querySelector('table');
const serviceTableBody = document.querySelector('tbody');
// const serviceTableBodyRows = Array.from(serviceTable.querySelectorAll('tbody tr'));
// const sortButtons = document.querySelectorAll('.sort');
const searchBar = document.querySelector('.search-input');
const filterCheckboxes = document.querySelectorAll('.search-filter input[type="checkbox"]');
const overlay = document.querySelector('.overlay');
const popupDelete = document.querySelector('.popup-delete');
const popupModify = document.querySelector('.popup-modify');
const data = popupModify.querySelectorAll('tbody td');

// Global variables
let chosenServiceID = null; // store chosen ID
let chosenServiceTypeID = null;
let chosenServicePartID = null;
let chosenServiceName = null;
let chosenServiceDescription = null;
let chosenServicePrice = null;
let oldServiceData = []; // store old render table
let maxServiceID; // max current serviceID

// Support functions
// Search service
function searchService(result) {
    const filterFunction = () => {
        const searchTerm = searchBar.value.toLowerCase();
        const checkedColumns = Array.from(filterCheckboxes)
            .filter((checkbox) => checkbox.checked)
            .map((checkbox) => checkbox.dataset.column);

        const isSearchMatch = (row) => {
            return (
                !searchTerm ||
                Object.values(row)
                    .filter((value) => typeof value === 'string')
                    .some((value) => value.toLowerCase().includes(searchTerm))
            );
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
                    if (Date.now() - lastRan >= limit) {
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
function showDeletePopup(element) {
    chosenServiceID = +element.dataset.serviceid; // get dataset from self
    // console.log(chosenServiceID);
    popupDelete.classList.remove('hidden');
    overlay.classList.remove('hidden');
}

function hideDeletePopup() {
    popupDelete.classList.add('hidden');
    overlay.classList.add('hidden');
}

function confirmDeletePopup() {
    if (chosenServiceID) {
        deleteService(chosenServiceID);
    }
    chosenServiceID = null; // reset storage variable
    popupDelete.classList.add('hidden');
    overlay.classList.add('hidden');
}

async function deleteService(ServiceID) {
    try {
        const response = await fetch('http://localhost:3000/deleteServiceById', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ serviceID: ServiceID })
        });
    } catch (err) {
        console.error('Error deleting service:', err);
    }
}

// Update function
function defaultNumValue(element, globalVar, defaultValue) {
    let value = parseInt(element.value);

    if (isNaN(value) || value <= 0) {
        globalVar = defaultValue;
        element.value = defaultValue;
    } else {
        globalVar = value;
    }

    return globalVar;
}

function showModifyPopup(element) {
    chosenServiceID = +element.dataset.serviceid; // get dataset from self
    // console.log(chosenServiceID);
    popupModify.querySelector('h2').textContent = 'Update Service'; // set title

    // preset data
    chosenServiceID = data[0].children[0].value = element.dataset.serviceid;
    chosenServiceTypeID = data[1].children[0].value = element.dataset.typeid;
    chosenServicePartID = data[2].children[0].value = element.dataset.partid;
    chosenServiceName = data[3].children[0].value = element.dataset.servicename;
    chosenServiceDescription = data[4].children[0].value = element.dataset.servicedescription;
    chosenServicePrice = data[5].children[0].value = element.dataset.serviceprice;

    // listen change
    data[0].children[0].addEventListener('change', () => {
        chosenServiceID = defaultNumValue(data[0].children[0], chosenServiceID, 1);
      });
    data[1].children[0].addEventListener('change', () => {
        chosenServiceTypeID = defaultNumValue(data[1].children[0], chosenServiceTypeID, 1);
    });
    data[2].children[0].addEventListener('change', () => {
        chosenServicePartID = defaultNumValue(data[2].children[0], chosenServicePartID, 1);
    });
    data[3].children[0].addEventListener('change', () => (chosenServiceName = data[3].children[0].value));
    data[4].children[0].addEventListener('change', () => (chosenServiceDescription = data[4].children[0].value));
    data[5].children[0].addEventListener('change', () => {
        chosenServicePrice = defaultNumValue(data[5].children[0], chosenServicePrice, 1000);
    });

    popupModify.classList.remove('hidden');
    overlay.classList.remove('hidden');
}

function hideModifyPopup() {
    popupModify.classList.add('hidden');
    overlay.classList.add('hidden');
}

function confirmModifyPopup() {
    if (chosenServiceID) {
        updateService(chosenServiceID, chosenServiceTypeID, chosenServicePartID, chosenServiceName, chosenServiceDescription, chosenServicePrice);
    }
    chosenServiceID = null; // reset storage variable
    popupModify.classList.add('hidden');
    overlay.classList.add('hidden');
}

async function updateService(ServiceID, ServiceTypeID, ServicePartID, ServiceName, ServiceDescription, ServicePrice) {
    try {
        const response = await fetch('http://localhost:3000/updateServiceById', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                serviceID: ServiceID,
                typeID: ServiceTypeID,
                partID: ServicePartID,
                name: ServiceName,
                description: ServiceDescription,
                price: ServicePrice
            })
        });
    } catch (err) {
        console.error('Error updating service:', err);
    }
}

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
                                <button class="btn-delete" onclick="showDeletePopup(this);" 
                                        data-serviceid="${service.ServiceID}">
                                    Delete
                                </button>
                                <button class="btn-update" onclick="showModifyPopup(this);"
                                        data-serviceid="${service.ServiceID}"
                                        data-typeid="${service.ServiceTypeID}"
                                        data-partid="${service.PartID}"
                                        data-servicename="${service.ServiceName}"
                                        data-servicedescription="${service.ServiceDescription}"
                                        data-serviceprice="${service.ServicePrice}">
                                    Update
                                </button>
                            </td>
                        </tr>
                        `;

        dataRows += dataRow;
    });

    serviceTableBody.innerHTML += dataRows;
}

// Set refresh interval
function scheduleNextUpdate(delay) {
    setTimeout(getServiceListAll, delay);
}

// Main functions
async function getServiceListAll() {
    try {
        const response = await fetch('http://localhost:3000/getServiceListAll', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        const result = await response.json();
        // console.log(result);

        maxServiceID = result.reduce((max, service) => Math.max(max, service.ServiceID), 0);
        
        if (oldServiceData === null || JSON.stringify(result) !== JSON.stringify(oldServiceData)) {
            renderTable(result);
            searchService(result);
            oldServiceData = result;
            scheduleNextUpdate(1000);
        } else {
            scheduleNextUpdate(2000);
        }
    } catch (error) {
        console.error('Error fetching service list:', error);
        scheduleNextUpdate(5000); // retry if error
    }
}

getServiceListAll();
