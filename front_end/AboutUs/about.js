document.addEventListener("DOMContentLoaded", function () {
    // Fetch tổng số thống kê
    fetch("http://localhost:3000/GetStats")
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data?.totalUsers) 
                document.querySelector(".stats div:nth-child(1) .stat h3").textContent = data.totalUsers;
            if (data?.totalBranches) 
                document.querySelector(".stats div:nth-child(2) .stat h3").textContent = data.totalBranches;
            if (data?.totalServices) 
                document.querySelector(".stats div:nth-child(3) .stat h3").textContent = data.totalServices;
            if (data?.totalAccessories) 
                document.querySelector(".stats div:nth-child(4) .stat h3").textContent = data.totalAccessories;
            
            console.log(data);
        })
        .catch(error => console.error("Error fetching stats:", error));



    // Fetch danh sách chi nhánh
    document.addEventListener("DOMContentLoaded", function () {
        const branchDropdown = document.getElementById("branch-dropdown");
    // Fetch danh sách chi nhánh
        fetch("http://localhost:3000/GetBrancheList", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            branchDropdown.innerHTML = "";
    
            data.forEach(branch => {
                const option = document.createElement("option");
                
                option.textContent = branch.BranchName;
                option.value = branch.BranchID;
                branchDropdown.appendChild(option);
            });
    
            console.log("Danh sách chi nhánh:", data);
    
            // Nếu có chi nhánh, chọn chi nhánh đầu tiên và hiển thị thông tin
            if (data.length > 0) {
                branchDropdown.value = data[0].BranchID;
                fetchBranchDetails(data[0].BranchID);
            }
        })
        .catch(error => console.error("Lỗi khi lấy danh sách chi nhánh:", error));
    
        // Lắng nghe sự kiện thay đổi chi nhánh BÊN TRONG DOMContentLoaded
        branchDropdown.addEventListener("change", function () {
            const selectedBranchID = this.value;
            fetchBranchDetails(selectedBranchID);
        });
    
        function fetchBranchDetails(branchID) {
            fetch("http://localhost:3000/GetBranchesDetail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ branchID: branchID })  // Đúng format body
            })
            .then(response => {
                if (!response.ok) throw new Error(`Lỗi HTTP: ${response.status}`);
                return response.json();
            })
            .then(branch => {
                updateBranchInfo(branch);
            })
            .catch(error => console.error("Lỗi khi lấy thông tin chi nhánh:", error));
        }
    
        function updateBranchInfo(branch) {
            console.log("Thông tin chi nhánh:", branch);
            const phoneElement = document.querySelector(".phone strong");
            const emailElement = document.querySelector("p.email strong");
    
            if (phoneElement) phoneElement.textContent = branch.BranchPhone || "Không có thông tin";
            if (emailElement) emailElement.textContent = branch.BranchEmail || "Không có thông tin";
        }
    });
    
});    