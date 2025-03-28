// map config
const apiKey = "qn4R3GW87CxbHZJ6qJBdSj6QwyqmYNjaUcH2vnz7J6Q";
const platform = new H.service.Platform({
    'apikey': apiKey
});
async function DisplayMap(element, branchlocation) {
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
        const map = new H.Map(element,
            defaultLayers.vector.normal.map, {
            zoom: 15,
            center: { lat: branchLat, lng: branchLng },
            pixelRatio: window.devicePixelRatio || 1
        });
        if (!map) {
            console.error("Không thể tạo bản đồ!");
            return;
        }
        let marker = new H.map.Marker({ lat: branchLat, lng: branchLng }, { volatility: true });
        marker.draggable = true;
        map.addObject(marker);

    } catch (error) {
        console.log(error)
    }
}



// first load
window.onload = async () => {
    await GetListBranch();
    DisplayMap(document.getElementById("maptest"));
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
    setTimeout(() => {
        DisplayMap(item.querySelector(".map"), branch.BranchLocation);
    }, 100);
    container.appendChild(item);
}

// edit branch

const EditBranch = (branchID) => {
    window.location.href = `./EditBranch/EditBranch.html?ID=${branchID}`;
}