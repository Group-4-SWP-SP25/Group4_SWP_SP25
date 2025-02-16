document.addEventListener("DOMContentLoaded", function () {
    // Giả sử CarID được lấy từ URL hoặc một nguồn khác
    const carID = 1; 

    fetch(`CarPartServlet?CarID=${carID}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const part = data[0]; // Lấy phần đầu tiên (hoặc lặp qua danh sách nếu cần)
                document.getElementById("carPart").textContent = `Part name: ${part.PartName}`;
                document.getElementById("carStatus").textContent = `Part Status: ${part.Status}`;
                document.getElementById("expiredDate").textContent = `Expired date: ${part.ExpiryDate || "N/A"}`;
            } else {
                console.log("No parts found for this car.");
            }
        })
        .catch(error => console.error("Error fetching car parts:", error));
});


