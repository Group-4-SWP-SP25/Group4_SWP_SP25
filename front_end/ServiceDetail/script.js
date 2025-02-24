const urlParams = new URLSearchParams(window.location.search);
const service = urlParams.get('serviceTypeName');

const infoDiv = document.querySelector('.info');
const detailDiv = document.querySelector('.detail');
const detailTable = document.querySelector('.detail-table');

async function getServiceTypeDetail() {
    const response = await fetch('http://localhost:3000/getServiceTypeDetail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            serviceTypeName: service
        })
    });
    const result = await response.json();
    // console.log(typeof result);
    // console.log(result);

    document.querySelector('.info-name').innerHTML = result[0].ServiceTypeName + ' Service';
    document.querySelector('.info-desc').innerHTML = result[0].ServiceTypeDescription;

    for (const key in result) {
        const item = result[key];

        const detailItemRow = document.createElement('tr');

        const detailServiceName = document.createElement('td');
        detailServiceName.textContent = item.ServiceName;

        const detailServiceDescription = document.createElement('td');
        detailServiceDescription.textContent = item.ServiceDescription;

        const detailServicePrice = document.createElement('td');
        detailServicePrice.textContent = item.ServicePrice + ' ₫';
        detailServicePrice.style.textAlign = 'center';

        // const detailServiceCheck = document.createElement('td');
        // const detailServiceCheckInput = document.createElement('input');
        // detailServiceCheckInput.type = 'checkbox';
        // detailServiceCheckInput.style.border = '1px solid green';
        // detailServiceCheckInput.checked = false;
        // detailServiceCheckInput.id = (item.ServiceName.toLowerCase().replace(/\s/g, '_'));
        // detailServiceCheck.appendChild(detailServiceCheckInput);
        // detailServiceCheck.style.textAlign = 'center';

        detailItemRow.appendChild(detailServiceName);
        detailItemRow.appendChild(detailServiceDescription);
        detailItemRow.appendChild(detailServicePrice);
        // detailItemRow.appendChild(detailServiceCheck);

        detailTable.appendChild(detailItemRow);
    }
}
getServiceTypeDetail();
