const urlParams = new URLSearchParams(window.location.search);
const serviceTypes = urlParams.get('serviceTypeName');

const detailTableBody = document.querySelector('.detail-table tbody');

async function getServiceTypeDetailByName() {
    const response = await fetch('http://localhost:3000/getServiceTypeListByServiceTypeName', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            serviceTypeName: serviceTypes
        })
    });
    const result = await response.json();
    console.log(result);

    document.querySelector('.info-name').innerHTML = result[0].ServiceTypeName + ' Service';
    document.querySelector('.info-desc').innerHTML = result[0].ServiceTypeDescription;

    detailTableBody.innerHTML = ''; // Clear old content

    let typeDetails = '';
    for (const key in result) {
        const item = result[key];

        const typeDetail = `
                        <tr>
                            <td><img src="${item.ServiceImage}" width="200" height="150"></td>
                            <td>${item.ServiceName}</td>
                            <td>${item.ServiceDescription}</td>
                            <td style="text-align: center; width: 15%">${item.EstimatedTime}</td>
                            <td style="text-align: center">${item.ServicePrice} ₫</td>
                        </tr>
                        `;

        typeDetails += typeDetail;
    }

    detailTableBody.innerHTML += typeDetails;
}

getServiceTypeDetailByName();
