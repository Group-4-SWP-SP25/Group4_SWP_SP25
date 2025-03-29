document.addEventListener("DOMContentLoaded", function () {

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
});
    
document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:3000/branchDetail") 
        .then(response => response.json()) 
        .then(data => {
            const container = document.querySelector(".branches-container");

            
            const images = Array.from(container.querySelectorAll("img"));

            
            container.innerHTML = ""; 
            
            data.forEach((branch, index) => {
                const branchDiv = document.createElement("div");
                branchDiv.className = "branch-info";
                branchDiv.style = "background-color:#C6C1C1; padding: 20px; border-radius: 10px; width: 30%; text-align: center;";

                
                const imageElement = images[index] || document.createElement("img");
                imageElement.src = imageElement.src || "default.jpg";
                imageElement.style = "width: 100%; height: 200px; object-fit: cover; border-radius: 10px;";

                branchDiv.appendChild(imageElement);
                branchDiv.innerHTML += `
                    <h3>Branch Information</h3>
                    <p><strong>Branch Name:</strong> ${branch.branchName}</p>
                    <p><strong>Address:</strong> ${branch.branchAddress}</p>
                    <p><strong>Phone:</strong> ${branch.branchPhone}</p>
                    <p><strong>Email:</strong> ${branch.branchEmail}</p>
                `;

                container.appendChild(branchDiv);
            });
        })
        .catch(error => console.error("Error fetching branch data:", error));
});


