// Elements
const serviceTable = document.querySelector('table');
const serviceTableBody = document.querySelector('tbody');
// const serviceTableBodyRows = Array.from(serviceTable.querySelectorAll('tbody tr'));
// const sortButtons = document.querySelectorAll('.sort');
const searchBar = document.querySelector('.search-input');
const filterCheckboxes = document.querySelectorAll('.search-filter input[type="checkbox"]');

// Support functions
function renderTable(result) {
    serviceTableBody.innerHTML = '';

    let dataRows = '';
    result.forEach((service) => {
        const affInv = service.AffectInventory === 0 ? 'No' : 'Yes';

        const dataRow = `
                        <tr>
                            <td style="width: 4%">${service.ServiceTypeID}</td>
                            <td style="width: 4%">${service.PartID}</td>
                            <td style="width: 4%">${affInv}</td>
                            <td style="width: 10%; text-align: left">${service.ServiceName}</td>
                            <td style="width: 18%; text-align: left"">${service.ServiceDescription}</td>
                            <td style="width: 6%">${service.ServicePrice} ₫</td>
                            <td style="width: 10%" class="buttons">
                                <button class="delete">Delete</button>
                                <button class="update">Update</button>
                            </td>
                        </tr>
                        `;

        dataRows += dataRow;
    });

    serviceTableBody.innerHTML = dataRows;
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

    let dataRows = '';
    result.forEach((service) => {
        const affInv = service.AffectInventory === 0 ? 'No' : 'Yes';

        const dataRow = `
                        <tr>
                            <td style="width: 4%">${String(service.ServiceTypeID)}</td>
                            <td style="width: 4%">${String(service.PartID)}</td>
                            <td style="width: 4%">${affInv}</td>
                            <td style="width: 10%; text-align: left">${service.ServiceName}</td>
                            <td style="width: 18%; text-align: left"">${service.ServiceDescription}</td>
                            <td style="width: 6%">${String(service.ServicePrice)} ₫</td>
                            <td style="width: 10%" class="buttons">
                                <button class="delete">Delete</button>
                                <button class="update">Update</button>
                            </td>
                        </tr>
                        `;

        dataRows += dataRow;
    });

    serviceTableBody.innerHTML = dataRows;

    // Search
    // searchBar.addEventListener('input', () => {
    //     const searchTerm = searchBar.value.toLowerCase();
    //     const filteredData = result.filter((row) => {
    //         return Object.values(row).some((value) => {
    //             if (typeof value === 'string') {
    //                 return value.toLowerCase().includes(searchTerm);
    //             }
    //             return String(value).toLowerCase().includes(searchTerm);
    //         });
    //     });
    //     renderTable(filteredData);
    // });

    function applyFilters() {
        const searchTerm = searchBar.value.toLowerCase();
        const checkedColumns = Array.from(filterCheckboxes)
            .filter((checkbox) => checkbox.checked)
            .map((checkbox) => checkbox.dataset.column);

        let filteredData = result.filter((row) => {
            let searchMatch = true;
            if (searchTerm) {
                searchMatch = Object.values(row).some((value, index) => {
                    let searchValue = value;

                    // handle AffectInventory
                    if (Object.keys(row)[index] === 'AffectInventory') {
                        searchValue = value === 0 ? 'No' : 'Yes';
                    }

                    if (typeof searchValue === 'string') {
                        return searchValue.toLowerCase().includes(searchTerm);
                    }
                    return String(searchValue).toLowerCase().includes(searchTerm);
                });
            }

            let columnMatch = true;
            if (checkedColumns.length > 0) {
                columnMatch = checkedColumns.some((column) => {
                    let searchValue = row[column];

                    // handle AffectInventory
                    if (column === 'AffectInventory') {
                        searchValue = row[column] === 0 ? 'No' : 'Yes';
                    }

                    if (typeof searchValue === 'string') {
                        return searchValue.toLowerCase().includes(searchTerm);
                    }
                    return String(searchValue).toLowerCase().includes(searchTerm);
                });
            }

            return searchMatch && columnMatch;
        });

        renderTable(filteredData);
    }

    searchBar.addEventListener('input', applyFilters);
    filterCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', applyFilters);
    });
}

getServiceListAll();
