const serviceTable = document.querySelector('tbody');

async function getServiceListAll() {
    const response = await fetch('http://localhost:3000/getServiceListAll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });
    const result = await response.json();
    // console.log(result);

    let servicesRows = '';
    result.forEach((service) => {
        const serviceRow = `
                            <tr>
                                <td style="width: 4%">${service.ServiceTypeID}</td>
                                <td style="width: 4%">${service.PartID}</td>
                                <td style="width: 4%">${service.AffectInventory}</td>
                                <td style="width: 10%">${service.ServiceName}</td>
                                <td style="width: 18%">${service.ServiceDescription}</td>
                                <td style="width: 6%">${service.ServicePrice}</td>
                                <td style="width: 10%" class="buttons">
                                    <button class="delete">Delete</button>
                                    <button class="update">Update</button>
                                </td>
                            </tr>
                            `;

        servicesRows += serviceRow;
    });

    serviceTable.innerHTML = servicesRows
}

getServiceListAll();
