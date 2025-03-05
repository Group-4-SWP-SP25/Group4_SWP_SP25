// Elements
const serviceTable = document.querySelector('table');
const serviceTableBody = document.querySelector('tbody');
// const serviceTableBodyRows = Array.from(serviceTable.querySelectorAll('tbody tr'));
// const sortButtons = document.querySelectorAll('.sort');
const searchBar = document.querySelector('.search-input');
const filterCheckboxes = document.querySelectorAll('.search-filter input[type="checkbox"]');

// Support functions
// Render table out
function renderTable(result) {
    serviceTableBody.innerHTML = '';

    let dataRows = '';
    result.forEach((service) => {
        const dataRow = `
                        <tr>

                            <td style="width: 4%">${service.ServiceTypeID}</td>
                            <td style="width: 4%">${service.PartID}</td>
                            <td style="width: 10%; text-align: left">${service.ServiceName}</td>
                            <td style="width: 18%; text-align: left"">${service.ServiceDescription}</td>
                            <td style="width: 6%">${service.ServicePrice} ₫</td>
                            <td
                                style="width: 10%"
                                class="buttons">
                                <button class="btn-delete">Delete</button>
                                <button class="btn-update">Update</button>
                            </td>
                        </tr>
                        `;

        dataRows += dataRow;
    });

    serviceTableBody.innerHTML += dataRows;
}

// Delete service
// Confirm popup
// function showHideConfimationDialog() {
//     $('.delete-service').fadeToggle(200).toggleClass('hidden show');
//     $('.overlay').toggleClass('hidden');
//     $('body').toggleClass('no-scroll');
// }

// $(document).on('click', '.btn-delete', function () {
//     if ($(this).text().trim() === 'Yes') {
//         deleteService();
//     }

//     showHideConfimationDialog();
// });

// $(document).on('click', '.btn-submit button', async function () {
//     showHideConfimationDialog();
// });

// async function deleteService() {}

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

    renderTable(result);

    // Search
    function applyFilters() {
        const searchTerm = searchBar.value.toLowerCase();

        const checkedColumns = Array.from(filterCheckboxes)

            .filter((checkbox) => checkbox.checked)

            .map((checkbox) => checkbox.dataset.column);

        let filteredData = result.filter((row) => {
            let searchMatch = true;

            if (searchTerm) {
                searchMatch = Object.values(row).some((value) => {
                    if (typeof value === 'string') {
                        return value.toLowerCase().includes(searchTerm);
                    }

                    return String(value).toLowerCase().includes(searchTerm);
                });
            }

            let columnMatch = true;

            if (checkedColumns.length > 0) {
                columnMatch = checkedColumns.some((column) => {
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

    searchBar.addEventListener('input', applyFilters);
    filterCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', applyFilters);
    });
}

getServiceListAll();
