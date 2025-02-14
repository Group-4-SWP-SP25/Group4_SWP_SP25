const urlParams = new URLSearchParams(window.location.search);
const service = urlParams.get('serviceTypeName');

async function getServiceTypeDetail() {
    const response = await fetch('http://localhost:3000/getServiceTypeDetail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            serviceTypeName: service
        })
    })
    const result = await response.json();
    console.log(result);
}

getServiceTypeDetail();