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
let chosenServiceID = null;
let chosenServiceTypeID = null;
let chosenServicePartID = null;
let chosenServiceName = null;
let chosenServiceDescription = null;
let chosenServicePrice = null;
let oldServiceData = []; // store old render table
let maxServiceID; // max current serviceID
let maxServiceTypeID; // max current serviceTypeID
let maxServicePartID; // max current partID

// ---------- Support functions ----------
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
    popupDelete.classList.remove('hidden');
    overlay.classList.remove('hidden');
}

function hideDeletePopup() {
    chosenServiceID = null; // reset data variable

    popupDelete.classList.add('hidden');
    overlay.classList.add('hidden');
}

function confirmDeletePopup() {
    if (chosenServiceID) {
        deleteService(chosenServiceID);
    }

    chosenServiceID = null; // reset data variable

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

// Update service
function showUpdatePopup(element) {
    chosenServiceID = +element.dataset.serviceid; // get dataset from self
    popupModify.querySelector('h2').textContent = 'Update Service'; // set title
    popupModify.querySelector('.btn-yes').addEventListener('click', confirmUpdatePopup); // set yes button
    popupModify.querySelector('.btn-no').addEventListener('click', hideUpdatePopup); // set no button

    // preset data
    chosenServiceID = data[0].children[0].selectedIndex = +element.dataset.serviceid;
    chosenServiceTypeID = data[1].children[0].selectedIndex = +element.dataset.typeid;
    chosenServicePartID = data[2].children[0].selectedIndex = +element.dataset.partid;
    chosenServiceName = data[3].children[0].value = element.dataset.servicename;
    chosenServiceDescription = data[4].children[0].value = element.dataset.servicedescription;
    chosenServicePrice = data[5].children[0].value = element.dataset.serviceprice;
    // console.log(chosenServiceID, chosenServiceTypeID, chosenServicePartID, chosenServiceName, chosenServiceDescription, chosenServicePrice);

    // listen change
    const idSelect = data[0].children[0];
    for (let i = 1; i <= maxServiceID; i++) {
        const option = document.createElement('option');
        if (i === chosenServiceID) option.selected = true;
        option.value = i;
        option.textContent = `${i}`;
        idSelect.appendChild(option);
    }
    data[0].children[0].addEventListener('change', () => {
        chosenServiceID = setNumValue(data[0].children[0], chosenServiceID, 1);
    });

    const typeSelect = data[1].children[0];
    for (let i = 1; i <= maxServiceTypeID; i++) {
        const option = document.createElement('option');
        if (i === chosenServiceTypeID) option.selected = true;
        option.value = i;
        option.textContent = `${i}`;
        typeSelect.appendChild(option);
    }
    data[1].children[0].addEventListener('change', () => {
        chosenServiceTypeID = setNumValue(data[1].children[0], chosenServiceTypeID, 1);
    });

    const partSelect = data[2].children[0];
    for (let i = 1; i <= maxServicePartID; i++) {
        const option = document.createElement('option');
        if (i === chosenServicePartID) option.selected = true;
        option.value = i;
        option.textContent = `${i}`;
        partSelect.appendChild(option);
    }
    data[2].children[0].addEventListener('change', () => {
        chosenServicePartID = setNumValue(data[2].children[0], chosenServicePartID, 1);
    });

    data[3].children[0].addEventListener('change', () => {
        chosenServiceName = setStrValue(data[3].children[0], chosenServiceName, 'Unnamed Service');
    });
    
    data[4].children[0].addEventListener('change', () => {
        chosenServiceDescription = setStrValue(data[4].children[0], chosenServiceDescription, 'No Description');
    });

    data[5].children[0].addEventListener('change', () => {
        chosenServicePrice = setNumValue(data[5].children[0], chosenServicePrice, 1000);
    });

    popupModify.classList.remove('hidden');
    overlay.classList.remove('hidden');
}

function hideUpdatePopup() {
    // reset data display
    data.forEach((datum) => {
        datum.children[0].value = '';
    });
    chosenServiceID = chosenServiceTypeID = chosenServicePartID = chosenServiceName = chosenServiceDescription = chosenServicePrice = null; // reset data variable
    popupModify.querySelector('.btn-yes').removeEventListener('click', confirmUpdatePopup); // reset yes button
    popupModify.querySelector('.btn-no').removeEventListener('click', hideUpdatePopup); // reset no button

    popupModify.classList.add('hidden');
    overlay.classList.add('hidden');
}

function confirmUpdatePopup() {
    if (chosenServiceID) {
        updateService(chosenServiceID, chosenServiceTypeID, chosenServicePartID, chosenServiceName, chosenServiceDescription, chosenServicePrice);
    }

    // reset data display
    data.forEach((datum) => {
        datum.children[0].value = '';
    });
    chosenServiceID = chosenServiceTypeID = chosenServicePartID = chosenServiceName = chosenServiceDescription = chosenServicePrice = null; // reset data variable
    popupModify.querySelector('.btn-yes').removeEventListener('click', confirmUpdatePopup); // reset yes button
    popupModify.querySelector('.btn-no').removeEventListener('click', hideUpdatePopup); // reset no button

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

// Add service
function showAddPopup() {
    chosenServiceID = maxServiceID + 1;
    console.log(chosenServiceID);
    popupModify.querySelector('h2').textContent = 'Add Service'; // set title
    popupModify.querySelector('.btn-yes').addEventListener('click', confirmAddPopup); // set yes button
    popupModify.querySelector('.btn-no').addEventListener('click', hideAddPopup); // set no button

    // preset data
    data[0].children[0].appendChild(document.createElement('option')).textContent = `${chosenServiceID}`;
    chosenServiceTypeID = data[1].children[0].selectedIndex = 1;
    chosenServicePartID = data[2].children[0].selectedIndex = 1;
    chosenServiceName = data[3].children[0].value = 'Unnamed Service';
    chosenServiceDescription = data[4].children[0].value = 'No Description';
    chosenServicePrice = data[5].children[0].value = 1000;
    console.log(chosenServiceTypeID, chosenServicePartID, chosenServiceName, chosenServiceDescription, chosenServicePrice);

    // listen change
    const typeSelect = data[1].children[0];
    for (let i = 1; i <= maxServiceTypeID; i++) {
        const option = document.createElement('option');
        if (i === 1) option.selected = true;
        option.value = i;
        option.textContent = `${i}`;
        typeSelect.appendChild(option);
    }
    data[1].children[0].addEventListener('change', () => {
        chosenServiceTypeID = setNumValue(data[1].children[0], chosenServiceTypeID, 1);
    });

    const partSelect = data[2].children[0];
    for (let i = 1; i <= maxServicePartID; i++) {
        const option = document.createElement('option');
        if (i === 1) option.selected = true;
        option.value = i;
        option.textContent = `${i}`;
        partSelect.appendChild(option);
    }
    data[2].children[0].addEventListener('change', () => {
        chosenServicePartID = setNumValue(data[2].children[0], chosenServicePartID, 1);
    });

    data[3].children[0].addEventListener('change', () => {
        chosenServiceName = setStrValue(data[3].children[0], chosenServiceName, 'Unnamed Service');
    });
    data[3].children[0].addEventListener('focus', () => {
        data[3].children[0].value = '';
    });
    data[3].children[0].addEventListener('blur', () => {
        chosenServiceName = setStrValue(data[3].children[0], chosenServiceName, 'Unnamed Service');
    });

    data[4].children[0].addEventListener('change', () => {
        chosenServiceDescription = setStrValue(data[4].children[0], chosenServiceDescription, 'No Description');
    });
    data[4].children[0].addEventListener('focus', () => {
        data[4].children[0].value = '';
    });
    data[4].children[0].addEventListener('blur', () => {
        chosenServiceDescription = setStrValue(data[4].children[0], chosenServiceDescription, 'No Description');
    });
    
    data[5].children[0].addEventListener('change', () => {
        chosenServicePrice = setNumValue(data[5].children[0], chosenServicePrice, 1000);
    });
    data[5].children[0].addEventListener('focus', () => {
        data[5].children[0].value = '';
    })
    data[5].children[0].addEventListener('blur', () => {
        chosenServicePrice = setNumValue(data[5].children[0], chosenServicePrice, 1000);
    });

    popupModify.classList.remove('hidden');
    overlay.classList.remove('hidden');
}

function hideAddPopup() {
    // reset data display
    data.forEach((datum) => {
        datum.children[0].value = '';
    });
    data[0].children[0].remove(0);
    chosenServiceID = chosenServiceTypeID = chosenServicePartID = chosenServiceName = chosenServiceDescription = chosenServicePrice = null; // reset data variable
    popupModify.querySelector('.btn-yes').removeEventListener('click', confirmAddPopup); // reset yes button
    popupModify.querySelector('.btn-no').removeEventListener('click', hideAddPopup); // reset no button

    popupModify.classList.add('hidden');
    overlay.classList.add('hidden');
}

function confirmAddPopup() {
    if (chosenServiceTypeID) {
        addService(chosenServiceTypeID, chosenServicePartID, chosenServiceName, chosenServiceDescription, chosenServicePrice);
    }

    // reset data display
    data.forEach((datum) => {
        datum.children[0].value = '';
    });
    data[0].children[0].remove(0);
    chosenServiceID = chosenServiceTypeID = chosenServicePartID = chosenServiceName = chosenServiceDescription = chosenServicePrice = null; // reset data variable
    popupModify.querySelector('.btn-yes').removeEventListener('click', confirmAddPopup); // reset yes button
    popupModify.querySelector('.btn-no').removeEventListener('click', hideAddPopup); // reset no button

    popupModify.classList.add('hidden');
    overlay.classList.add('hidden');
}

async function addService(ServiceTypeID, ServicePartID, ServiceName, ServiceDescription, ServicePrice) {
    try {
        const response = await fetch('http://localhost:3000/addService', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                typeID: ServiceTypeID,
                partID: ServicePartID,
                name: ServiceName,
                description: ServiceDescription,
                price: ServicePrice
            })
        });
    } catch (err) {
        console.error('Error adding service:', err);
    }
}

// Set value for number
function setNumValue(element, globalVar, defaultValue) {
    let value = parseInt(element.value);

    if (isNaN(value) || value <= 0) {
        globalVar = defaultValue;
        element.value = defaultValue;
    } else {
        globalVar = value;
    }

    return globalVar;
}

// Set value for string
function setStrValue(element, globalVar, defaultValue) {
    if (element.value === '') {
        globalVar = defaultValue;
        element.value = defaultValue;
    } else {
        globalVar = element.value;
    }

    return globalVar;
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
                                <button class="btn-update" onclick="showUpdatePopup(this);"
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

// ---------- Main functions ----------
async function getServiceListAll() {
    try {
        const response = await fetch('http://localhost:3000/getServiceListAll', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        const result = await response.json();
        // console.log(result);

        maxServiceID = result.reduce((max, service) => Math.max(max, service.ServiceID), 0);
        maxServiceTypeID = result.reduce((max, service) => Math.max(max, service.ServiceTypeID), 0);
        maxServicePartID = result.reduce((max, service) => Math.max(max, service.PartID), 0);
        // console.log(maxServiceID, maxServiceTypeID, maxServicePartID);

        // console.log(data);

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
