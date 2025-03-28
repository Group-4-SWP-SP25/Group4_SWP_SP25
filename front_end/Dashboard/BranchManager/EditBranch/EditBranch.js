const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("ID");
let map, marker = null;
let edit = false;
let branchlocation = null;

const branchname = document.getElementById('branchname');
const branchaddress = document.getElementById('branchaddress');
const branchphone = document.getElementById('branchphone');
const branchemail = document.getElementById('branchemail');

window.onload = async () => {
    await GetBranch();
    await GetLocation();
    let result = DisplayMap(branchlocation);
    map = result.map;
    marker = result.marker;
}

// Get branch
async function GetBranch() {
    await fetch('http://localhost:3000/branchInfo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ branchID: id })
    })
        .then(response => response.json())
        .then(result => {
            branchname.value = result.BranchName;
            branchaddress.value = result.BranchAddress;
            branchphone.value = result.BranchPhone;
            branchemail.value = result.BranchEmail;
            document.querySelector('.currentpath').innerHTML = result.BranchName
        })
}

// Get location
async function GetLocation() {
    await fetch('http://localhost:3000/getBranchLocation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ branchID: id })
    })
        .then(response => response.json())
        .then(result => {
            branchlocation = result.branchLocation;
        })
}

// Edit branch
async function EditBranch(name, address, phone, email) {
    await fetch('http://localhost:3000/editBranchInfo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ branchID: id, branchName: name, branchAddress: address, branchPhone: phone, branchEmail: email })
    })
        .then(response => response.status)
        .then(status => {
            if (status == 200) {
                alert('Edit branch successfully')
            }
            else {
                alert('Edit branch failed')
            }
        })
}

// CheckInput
const regexEmail = /^\w+@\w+(\.\w+)+$/;
const regexPhone = /^0\d{9}$/;
const regexName = /^[a-zA-Z0-9 ]{2,}$/;
async function CheckInput() {
    let check = true
    // check name
    branchname.classList = 'accept'
    const name = branchname.value;
    if (name == '' || !regexName.test(name)) {
        branchname.classList = 'not-accept'
        check = false
    }

    // check address
    branchaddress.classList = 'accept'
    const address = branchaddress.value;
    if (address == '') {
        branchaddress.classList = 'not-accept'
        check = false
    }

    // check phone
    branchphone.classList = 'accept'
    const phone = branchphone.value;
    if (phone == '' || !regexPhone.test(phone)) {
        branchphone.classList = 'not-accept'
        check = false
    }

    // check email
    branchemail.classList = 'accept'
    const email = branchemail.value;
    if (email == '' || !regexEmail.test(email)) {
        branchemail.classList = 'not-accept'
        check = false
    }

    if (!check) {
        throw new Error('Please enter the correct information!')
    }

    await EditBranch(name, address, phone, email)
}

// Submit 
const saveBtn = document.querySelector('.save')
const cancelBtn = document.querySelector('.cancel')

cancelBtn.addEventListener('click', () => {
    GetBranch()
    branchname.classList = 'normal'
    branchaddress.classList = 'normal'
    branchphone.classList = 'normal'
    branchemail.classList = 'normal'
})

saveBtn.addEventListener('click', async () => {
    try {
        await CheckInput();
        cancelBtn.click();
    }
    catch (error) {
        alert(error)
    }
})


//  ---------------------------map config--------------------------- //
// map config
const apiKey = "qn4R3GW87CxbHZJ6qJBdSj6QwyqmYNjaUcH2vnz7J6Q";
const platform = new H.service.Platform({
    'apikey': apiKey
});
function DisplayMap(branchlocation) {
    try {
        let branchLat = 0;
        let branchLng = 0;
        if (branchlocation != null) {
            branchLat = branchlocation.split('-')[0];
            branchLng = branchlocation.split('-')[1];
        }
        else {
            branchLat = 21.024633;
            branchLng = 105.53952;
        }

        const defaultLayers = platform.createDefaultLayers();
        const map = new H.Map(document.getElementById('map'),
            defaultLayers.vector.normal.map, {
            zoom: 15,
            center: { lat: branchLat, lng: branchLng },
            pixelRatio: window.devicePixelRatio || 1
        });
        // Thêm khả năng tương tác như zoom, pan
        const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
        const ui = H.ui.UI.createDefault(map, defaultLayers);

        // Thêm marker có thể kéo thả
        let marker = new H.map.Marker({ lat: branchLat, lng: branchLng }, { volatility: true });
        marker.draggable = true;
        map.addObject(marker);

        // Sự kiện kéo thả marker
        // map.addEventListener("dragend", function (evt) {
        //     if (evt.target instanceof H.map.Marker) {
        //         let position = evt.target.getGeometry();
        //         console.log("Vị trí được chọn:", position.lat, position.lng);
        //     }
        // });

        // Sự kiện click trên bản đồ để chọn vị trí
        map.addEventListener("tap", function (evt) {
            if (!edit) return
            let coord = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
            marker.setGeometry(coord);
        });

        return { map: map, marker: marker };
    } catch (error) {
        console.log(error)
        return null
    }
}

// getCoordinates
async function getCoordinates(location) {
    const url = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(location)}&apiKey=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.items.length > 0) {
            return data.items[0].position; // Lấy lat, lng
        } else {
            console.log("Không tìm thấy địa điểm");
            return null;
        }
    } catch (error) {
        console.error("Lỗi khi tìm kiếm:", error);
        return null;
    }
}

// edit location 

const searchInput = document.getElementById('searchString');
const searchBtn = document.getElementById('search-btn');
const gpsBtn = document.getElementById('gps-btn');
const editLocation = document.querySelector('.edit-location')
const editDoneBtn = document.querySelector('.edit-done')

searchInput.style.display = 'none';
searchBtn.style.display = 'none';
gpsBtn.style.display = 'none';
editDoneBtn.style.display = 'none';

editLocation.addEventListener('click', () => {
    searchInput.style.display = 'flex';
    searchBtn.style.display = 'flex';
    gpsBtn.style.display = 'flex';
    editDoneBtn.style.display = 'flex';
    editLocation.style.display = 'none';
    edit = true
    searchInput.value = branchaddress.value
})

editDoneBtn.addEventListener('click', async () => {
    searchInput.style.display = 'none';
    searchBtn.style.display = 'none';
    gpsBtn.style.display = 'none';
    editDoneBtn.style.display = 'none';
    editLocation.style.display = 'flex';
    edit = false
    await SaveBranchLocation(marker.getGeometry().lat + '-' + marker.getGeometry().lng)
})

searchBtn.addEventListener('click', async () => {
    const location = searchInput.value;
    const coordinates = await getCoordinates(location);
    if (coordinates) {
        console.log("Tọa độ:", coordinates.lat, coordinates.lng);
        map.setCenter({ lat: coordinates.lat, lng: coordinates.lng });
        marker.setGeometry({ lat: coordinates.lat, lng: coordinates.lng });
    }
    else {
        alert('Không tìm thấy điểm')
    }
})

document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById("search-btn").click();
    }
});

gpsBtn.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(function (position) {
        console.log("Tọa độ:", position.coords.latitude, position.coords.longitude);
        map.setCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
        marker.setGeometry({ lat: position.coords.latitude, lng: position.coords.longitude });
    });
})

async function SaveBranchLocation(location) {
    try {
        const response = await fetch("http://localhost:3000/saveBranchLocation", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ branchID: id, branchLocation: location })
        });
        const result = response.status;
        if (result === 200) {
            alert('Câp nhật vị trí thành công')
        } else {
            alert('Lỗi')
        }
    } catch (error) {
        console.log(error);
    }
}