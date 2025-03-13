// Get data from localStorage
const searchTerm = localStorage.getItem('searchTerm');
const searchResults = JSON.parse(localStorage.getItem('searchResults'));

// Elements
const resultsCount = document.querySelector('.results-count');
const resultsTableBody = document.querySelector('.results-table tbody');

// Display results
resultsCount.textContent = `There are ${searchResults.length} results matching keyword '${searchTerm}'`;

resultsTableBody.innerHTML = '';
let results = '';
searchResults.forEach((service) => {
    const result = `<tr>
                        <td style="width: 25%;">${service.ServiceName}</td>
                        <td style="width: 40%;">${service.ServiceDescription}</td>
                        <td style="width: 20%; text-align: center">${service.EstimatedTime}</td>
                        <td style="width: 15%; text-align: center">${service.ServicePrice}</td>
                    </tr>`;

    results += result;
});
resultsTableBody.innerHTML += results;
