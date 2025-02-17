const urlParams = new URLSearchParams(window.location.search);
const service = urlParams.get('serviceTypeName');

const infoDiv = document.querySelector('.info');
const detailDiv = document.querySelector('.detail');

async function getServiceTypeDetail() {
    const response = await fetch('http://localhost:3000/getServiceTypeDetail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            serviceTypeName: service
        })
    });
    const result = await response.json();
    console.log(typeof result);
    console.log(result);

    document.querySelector('.info-name').innerHTML = result[0].ServiceTypeName;
    document.querySelector('.info-desc').innerHTML = result[0].ServiceTypeDescription;

    for (const key in result) {
        const item = result[key];

        const detailItem = document.createElement('p');
        detailItem.classList.add('detail-item');
        detailItem.textContent = item.ServiceName + ': ' + item.ServiceDescription + ' - ' + item.ServicePrice + ' VND';

        detailDiv.appendChild(detailItem);
    }
}
getServiceTypeDetail();
