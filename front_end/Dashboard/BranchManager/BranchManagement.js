// map config
const apiKey = "qn4R3GW87CxbHZJ6qJBdSj6QwyqmYNjaUcH2vnz7J6Q";
const platform = new H.service.Platform({
    'apikey': apiKey
});
function DisplayMap() {
    try {
        const defaultLayers = platform.createDefaultLayers();
        const map = new H.Map(document.getElementById('map'),
            defaultLayers.vector.normal.map, {
            zoom: 15,
            center: { lat: 10.7769, lng: 106.7009 },
            pixelRatio: window.devicePixelRatio || 1
        });
        // Thêm khả năng tương tác như zoom, pan
        const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
        const ui = H.ui.UI.createDefault(map, defaultLayers);

        // Thêm marker có thể kéo thả
        let marker = new H.map.Marker({ lat: 10.7769, lng: 106.7009 }, { volatility: true });
        marker.draggable = true;
        map.addObject(marker);

        // Sự kiện kéo thả marker
        map.addEventListener("dragend", function (evt) {
            if (evt.target instanceof H.map.Marker) {
                let position = evt.target.getGeometry();
                console.log("Vị trí được chọn:", position.lat, position.lng);
            }
        });

        // Sự kiện click trên bản đồ để chọn vị trí
        map.addEventListener("tap", function (evt) {
            let coord = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
            marker.setGeometry(coord);
            console.log("Vị trí được chọn:", coord.lat, coord.lng);
        });

        return map
    } catch (error) {
        console.log(error)
    }
}

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


// const map = DisplayMap()
// getCoordinates("Đại học FPT Hà Nội")
//     .then(position => {
//         if (position) {
//             console.log("Tọa độ:", position.lat, position.lng);
//             map.setCenter({ lat: position.lat, lng: position.lng });
//         }
//     });


// first load
window.onload = async () => {
    await GetListBranch();
}


// get list branch
async function GetListBranch() {
    try {
        const response = await fetch("http://localhost:3000/branchList", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const result = await response.json();
        for (let branch of result) {
            AddBranch(branch);
        }
    } catch (error) {
        console.log('Error: ', error)
    }
}

const container = document.querySelector(".content");
// add branch
async function AddBranch(branch) {
    const item = document.createElement("div");
    item.classList.add("branch-container");
    item.setAttribute("branch-id", branch.BranchID);
    item.innerHTML = `
        <div class="branch-card">
            <div class="branch-info">
                <img src="../../../resource/pic2.jpg" alt="">
                <ul>
                    <li class="branch-name">
                        <span>Branch name:</span>
                        <div class="branch-name-content">${branch.BranchName}</div>
                    </li>
                    <li class="brand-address">
                        <span>Brand address:</span>
                        <div class="brand-address-content">${branch.BranchAddress}</div>
                    </li>
                    <li class="branch-phone">
                        <span>Phone:</span>
                        <div class="branch-phone-content ${branch.BranchPhone ? "" : "empty"}">${(branch.BranchPhone ? branch.BranchPhone : "Chưa cập nhật")}</div>
                    </li>
                    <li class="branch-email">
                        <span>Email:</span>
                        <div class="branch-email-content ${branch.BranchEmail ? "" : "empty"}" >${(branch.BranchEmail ? branch.BranchEmail : "Chưa cập nhật")}</div>
                    </li>
                </ul>
            </div>

            <div class="branch-map">
                <div class="map" map-id='${branch.BranchID}'></div>
            </div>
        </div>
        <div class="action">
            <div class="edit">
                <span class="material-icons">edit</span>
            </div>
        </div>
    `
    item.querySelector(".edit").addEventListener("click", () => EditBranch(branch.BranchID));
    container.appendChild(item);
}

// edit branch

EditBranch = (branchID) => {
    window.location.href = `./EditBranch/EditBranch.html?ID=${branchID}`;
}