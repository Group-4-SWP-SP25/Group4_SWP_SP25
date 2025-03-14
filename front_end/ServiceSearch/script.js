// Get data from localStorage
const urlParams = new URLSearchParams(window.location.search);
const resultsParam = urlParams.get('results');
const searchTerm = urlParams.get('searchTerm');
const searchResults = JSON.parse(decodeURIComponent(resultsParam));

// Elements
const resultsCount = document.querySelector('.results-count');
const results = document.querySelector('.results');
const resultsTableBody = results.querySelector('table tbody');
const reservationButton = document.querySelector('.go-carlist');
const homepageButton = document.querySelector('.back-home');

// Display results
resultsCount.textContent = `There are ${searchResults.length} results matching keyword '${searchTerm}'`;

if (searchResults.length === 0) {
    results.classList.add('hidden');
    reservationButton.classList.add('hidden');
    homepageButton.classList.remove('hidden');
} else {
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
}
