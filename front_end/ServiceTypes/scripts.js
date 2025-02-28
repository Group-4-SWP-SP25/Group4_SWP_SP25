const serviceType = document.querySelector('.svc-types');

async function getServiceTypeList() {
    const response = await fetch('http://localhost:3000/getServiceTypeList', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });
    const result = await response.json();

    let types = '';
    for (const key in result) {
        const item = result[key];

        const type = `
                    <div class="type">
                        <img src="${item.ServiceImage}"/>
                        <div class="type-overlay">
                            <h2>${item.ServiceTypeName} Service</h2>
                            <br/>
                            <a
                                class="button-detail"
                                href="../ServiceDetail/serviceDetail.html?serviceTypeName=${item.ServiceTypeName}">
                                <h5>View detail</h5>
                            </a>
                        </div>
                    </div>                    
                    `;
        
        types += type;
    }

    serviceType.innerHTML = types;
}

getServiceTypeList();
