const urlParams = new URLSearchParams(window.location.search);
const service = urlParams.get('serviceTypeName');

const descDiv = document.querySelector(".desc");

async function getServiceTypeDetail() {
    const response = await fetch('http://localhost:3000/getServiceTypeDetail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            serviceTypeName: service
        })
    })
    const result = await response.json();
    document.querySelector('.desc-name').innerHTML = result[0].ServiceName;
    console.log(result);
}
getServiceTypeDetail();

