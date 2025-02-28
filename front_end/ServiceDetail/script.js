const urlParams = new URLSearchParams(window.location.search);
const serviceTypes = urlParams.get('serviceTypeName');

const detailTable = document.querySelector('.detail-table');

async function getServiceTypeDetailByName() {
    const response = await fetch('http://localhost:3000/getServiceTypeDetailByName', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            serviceTypeName: serviceTypes
        })
    });
    const result = await response.json();

    document.querySelector('.info-name').innerHTML = result[0].ServiceTypeName + ' Service';
    document.querySelector('.info-desc').innerHTML = result[0].ServiceTypeDescription;

    let typeDetails = '';
    for (const key in result) {
        const item = result[key];

        const typeDetail = `
                        <tr>
                            <td>${item.ServiceName}</td>
                            <td>${item.ServiceDescription}</td>
                            <td style="text-align: center">${item.ServicePrice} ₫</td>
                        </tr>
                        `;

        typeDetails += typeDetail;
    }

    detailTable.innerHTML = typeDetails;
}

getServiceTypeDetailByName();
