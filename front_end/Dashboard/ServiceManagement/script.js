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
let chosenServiceID = null; // chosen row data
let chosenServiceTypeID = null; // chosen row data
let chosenServicePartID = null; // chosen row data
let chosenServiceName = null; // chosen row data
let chosenServiceDescription = null; // chosen row data
let chosenServicePrice = null; // chosen row data
let chosenEstimatedTime = null; // chosen row data
let chosenServiceImage = null; // chosen row data
let oldServiceData = []; // store old render table
let maxServiceID; // max current serviceID
let maxServiceTypeID; // max current serviceTypeID
let maxServicePartID; // max current partID
let partName = {}; // name of partID
let typeName = {}; // name of typeID
let currentSortOrder = 'asc'; // store current sort order
let currentSortColumn = null; // store current sort column

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
        getServiceListAll();
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

// Sort service
document.querySelectorAll('.sort').forEach((button) => {
    button.addEventListener('click', () => {
        const column = button.dataset.col;

        // Toggle sort order if clicking the same column
        if (column === currentSortColumn) {
            currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            currentSortColumn = column;
            currentSortOrder = 'asc'; // Reset to ascending for new column
        }
        sortService(column, currentSortOrder);
    });
});

async function sortService(col, ord) {
    try {
        const response = await fetch('http://localhost:3000/sortService', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                column: col,
                order: ord
            })
        });
        const result = await response.json();
        renderTable(result);
    } catch (err) {
        console.error('Error sorting service:', err);
    }
}

// Delete service
function showDeletePopup(element) {
    chosenServiceID = +element.dataset.serviceid; // get dataset from self
    popupDelete.classList.remove('hidden');
    overlay.classList.remove('hidden');
}

function hideDeletePopup() {
    chosenServiceID = null; // reset variable data

    popupDelete.classList.add('hidden');
    overlay.classList.add('hidden');
}

function confirmDeletePopup() {
    if (chosenServiceID) {
        deleteService(chosenServiceID);
    }

    chosenServiceID = null; // reset variable data

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

// Check name exist
async function isServiceNameExists(serviceName) {
    try {
        const response = await fetch('http://localhost:3000/getServiceListAll', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        const result = await response.json();
        const exists = result.some((service) => {
            return service.ServiceName.toLowerCase() === serviceName.toLowerCase();
        });
        return exists;
    } catch (error) {
        console.error('Error checking service name:', error);
        return false;
    }
}

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
    chosenEstimatedTime = data[6].children[0].value = element.dataset.estimatedtime;
    chosenServiceImage = data[7].children[0].value = element.dataset.serviceimage;

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
    typeSelect.innerHTML = '';
    for (let i = 1; i <= maxServiceTypeID; i++) {
        const option = document.createElement('option');
        if (i === chosenServiceTypeID) option.selected = true;
        option.value = i;
        option.textContent = `${i} - ${typeName[i]}`;
        typeSelect.appendChild(option);
    }
    data[1].children[0].addEventListener('change', () => {
        chosenServiceTypeID = setNumValue(data[1].children[0], chosenServiceTypeID, 1);
    });

    const partSelect = data[2].children[0];
    partSelect.innerHTML = '';
    for (let i = 1; i <= maxServicePartID; i++) {
        const option = document.createElement('option');
        if (i === chosenServicePartID) option.selected = true;
        option.value = i;
        option.textContent = `${i} - ${partName[i]}`;
        partSelect.appendChild(option);
    }
    data[2].children[0].addEventListener('change', () => {
        chosenServicePartID = setNumValue(data[2].children[0], chosenServicePartID, 1);
    });

    data[3].children[0].addEventListener('change', () => {
        chosenServiceName = setStrValue(data[3].children[0], chosenServiceName, chosenServiceName);
    });

    data[4].children[0].addEventListener('change', () => {
        chosenServiceDescription = setStrValue(data[4].children[0], chosenServiceDescription, chosenServiceDescription);
    });

    data[5].children[0].addEventListener('change', () => {
        chosenServicePrice = setNumValue(data[5].children[0], chosenServicePrice, chosenServicePrice);
    });

    data[6].children[0].addEventListener('change', () => {
        chosenEstimatedTime = setNumValue(data[6].children[0], chosenEstimatedTime, chosenEstimatedTime);
    });

    data[7].children[0].addEventListener('change', () => {
        chosenServiceImage = setStrValue(data[7].children[0], chosenServiceImage, chosenServiceImage);
    });

    popupModify.classList.remove('hidden');
    overlay.classList.remove('hidden');
}

function hideUpdatePopup() {
    // reset display data
    data.forEach((datum) => {
        datum.children[0].value = '';
    });
    chosenServiceID = chosenServiceTypeID = chosenServicePartID = chosenServiceName = chosenServiceDescription = chosenServicePrice = chosenEstimatedTime = chosenServiceImage = null; // reset variable data
    popupModify.querySelector('.btn-yes').removeEventListener('click', confirmUpdatePopup); // reset yes button
    popupModify.querySelector('.btn-no').removeEventListener('click', hideUpdatePopup); // reset no button

    popupModify.classList.add('hidden');
    overlay.classList.add('hidden');
}

async function confirmUpdatePopup() {
    updateService(chosenServiceID, chosenServiceTypeID, chosenServicePartID, chosenServiceName, chosenServiceDescription, chosenServicePrice, chosenEstimatedTime, chosenServiceImage);

    // reset display data
    data.forEach((datum) => {
        datum.children[0].value = '';
    });
    chosenServiceID = chosenServiceTypeID = chosenServicePartID = chosenServiceName = chosenServiceDescription = chosenServicePrice = chosenEstimatedTime = chosenServiceImage = null; // reset variable data
    popupModify.querySelector('.btn-yes').removeEventListener('click', confirmUpdatePopup); // reset yes button
    popupModify.querySelector('.btn-no').removeEventListener('click', hideUpdatePopup); // reset no button

    popupModify.classList.add('hidden');
    overlay.classList.add('hidden');
}

async function updateService(ServiceID, ServiceTypeID, ServicePartID, ServiceName, ServiceDescription, ServicePrice, EstimatedTime, ServiceImage) {
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
                price: ServicePrice,
                estTime: EstimatedTime,
                image: ServiceImage
            })
        });
    } catch (err) {
        console.error('Error updating service:', err);
    }
}

// Add service
function showAddPopup() {
    chosenServiceID = maxServiceID + 1;
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
    chosenEstimatedTime = data[6].children[0].value = 15;
    chosenServiceImage = data[7].children[0].value = 'https://via.placeholder.com/1';

    // listen change
    const typeSelect = data[1].children[0];
    typeSelect.innerHTML = '';
    for (let i = 1; i <= maxServiceTypeID; i++) {
        const option = document.createElement('option');
        if (i === 1) option.selected = true;
        option.value = i;
        option.textContent = `${i} - ${typeName[i]}`;
        typeSelect.appendChild(option);
    }
    data[1].children[0].addEventListener('change', () => {
        chosenServiceTypeID = setNumValue(data[1].children[0], chosenServiceTypeID, 1);
    });

    const partSelect = data[2].children[0];
    partSelect.innerHTML = '';
    for (let i = 1; i <= maxServicePartID; i++) {
        const option = document.createElement('option');
        if (i === 1) option.selected = true;
        option.value = i;
        option.textContent = `${i} - ${partName[i]}`;
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
    });
    data[5].children[0].addEventListener('blur', () => {
        chosenServicePrice = setNumValue(data[5].children[0], chosenServicePrice, 1000);
    });

    data[6].children[0].addEventListener('change', () => {
        chosenEstimatedTime = setNumValue(data[6].children[0], chosenEstimatedTime, 15);
    });
    data[6].children[0].addEventListener('focus', () => {
        data[6].children[0].value = '';
    });
    data[6].children[0].addEventListener('blur', () => {
        chosenEstimatedTime = setNumValue(data[6].children[0], chosenEstimatedTime, 15);
    });

    data[7].children[0].addEventListener('change', () => {
        chosenServiceImage = setStrValue(data[7].children[0], chosenServiceImage, 'https://via.placeholder.com/1');
    });
    data[7].children[0].addEventListener('focus', () => {
        data[7].children[0].value = '';
    });
    data[7].children[0].addEventListener('blur', () => {
        chosenServiceImage = setStrValue(data[7].children[0], chosenServiceImage, 'https://via.placeholder.com/1');
    });

    popupModify.classList.remove('hidden');
    overlay.classList.remove('hidden');
}

function hideAddPopup() {
    // reset display data
    data.forEach((datum) => {
        datum.children[0].value = '';
    });
    data[0].children[0].remove(0); // reset variable data
    chosenServiceID = chosenServiceTypeID = chosenServicePartID = chosenServiceName = chosenServiceDescription = chosenServicePrice = chosenEstimatedTime = chosenServiceImage = null; // reset variable data
    popupModify.querySelector('.btn-yes').removeEventListener('click', confirmAddPopup); // reset yes button
    popupModify.querySelector('.btn-no').removeEventListener('click', hideAddPopup); // reset no button

    popupModify.classList.add('hidden');
    overlay.classList.add('hidden');
}

async function confirmAddPopup() {
    if (chosenServiceTypeID) {
        const exists = await isServiceNameExists(chosenServiceName);
        if (exists) {
            alert('Service Name already exists. Please enter a different name.');
            return;
        }

        addService(chosenServiceTypeID, chosenServicePartID, chosenServiceName, chosenServiceDescription, chosenServicePrice, chosenEstimatedTime, chosenServiceImage);
    }

    // reset display data
    data.forEach((datum) => {
        datum.children[0].value = '';
    });
    data[0].children[0].remove(0);
    chosenServiceID = chosenServiceTypeID = chosenServicePartID = chosenServiceName = chosenServiceDescription = chosenServicePrice = chosenEstimatedTime = chosenServiceImage = null; // reset variable data
    popupModify.querySelector('.btn-yes').removeEventListener('click', confirmAddPopup); // reset yes button
    popupModify.querySelector('.btn-no').removeEventListener('click', hideAddPopup); // reset no button

    popupModify.classList.add('hidden');
    overlay.classList.add('hidden');
}

async function addService(ServiceTypeID, ServicePartID, ServiceName, ServiceDescription, ServicePrice, EstimatedTime, ServiceImage) {
    try {
        const response = await fetch('http://localhost:3000/addService', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                typeID: ServiceTypeID,
                partID: ServicePartID,
                name: ServiceName,
                description: ServiceDescription,
                price: ServicePrice,
                estTime: EstimatedTime,
                image: ServiceImage
            })
        });
    } catch (err) {
        console.error('Error adding service:', err);
    }
}

// Handle hide popup
function hidePopup() {
    popupDelete.classList.add('hidden');
    popupModify.classList.add('hidden');
    overlay.classList.add('hidden');

    // Reset các biến liên quan đến popup
    chosenServiceID = chosenServiceTypeID = chosenServicePartID = chosenServiceName = chosenServiceDescription = chosenServicePrice = chosenEstimatedTime = chosenServiceImage = null;

    // Gỡ bỏ các trình xử lý sự kiện (nếu cần)
    popupModify.querySelector('.btn-yes').removeEventListener('click', confirmUpdatePopup);
    popupModify.querySelector('.btn-no').removeEventListener('click', hideUpdatePopup);
    popupModify.querySelector('.btn-yes').removeEventListener('click', confirmAddPopup);
    popupModify.querySelector('.btn-no').removeEventListener('click', hideAddPopup);
}

// Sự kiện nhấn phím Esc
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        hidePopup();
    }
});

// Sự kiện click ra bên ngoài popup
overlay.addEventListener('click', function () {
    hidePopup();
});

// Render table out
function renderTable(result) {
    serviceTableBody.innerHTML = ''; // clear old content

    let dataRows = '';
    result.forEach((service) => {
        const dataRow = `
                        <tr>
                            <td><img src="${service.ServiceImage}" width="100" height="75"></td>
                            <td>${service.ServiceTypeName}</td>
                            <td>${service.PartName}</td>
                            <td style="text-align: left">${service.ServiceName}</td>
                            <td style="text-align: left">${service.ServiceDescription}</td>
                            <td>${service.ServicePrice} ₫</td>
                            <td>${service.EstimatedTime}</td>
                            <td class="buttons">
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
                                        data-serviceprice="${service.ServicePrice}" 
                                        data-estimatedtime="${service.EstimatedTime}"
                                        data-serviceimage="${service.ServiceImage}">
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
        console.log(result);

        maxServiceID = result.reduce((max, service) => Math.max(max, service.ServiceID), 0);
        maxServiceTypeID = result.reduce((max, service) => Math.max(max, service.ServiceTypeID), 0);
        maxServicePartID = result.reduce((max, service) => Math.max(max, service.PartID), 0);

        result.forEach((service) => {
            if (!partName[service.PartID]) {
                partName[service.PartID] = service.PartName;
            }
            if (!typeName[service.ServiceTypeID]) {
                typeName[service.ServiceTypeID] = service.ServiceTypeName;
            }
        });

        if (oldServiceData === null || JSON.stringify(result) !== JSON.stringify(oldServiceData)) {
            renderTable(result);
            searchService(result);
            oldServiceData = result;
            scheduleNextUpdate(1000);
        } else {
            scheduleNextUpdate(1000);
        }
    } catch (error) {
        console.error('Error fetching service list:', error);
        scheduleNextUpdate(5000); // retry if error
    }
}

getServiceListAll();
