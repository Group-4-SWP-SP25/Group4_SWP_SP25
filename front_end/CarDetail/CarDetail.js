document.addEventListener("DOMContentLoaded", function () {
    let carPartContainer = document.querySelector(".CarPart"); // Chọn phần CarPart
    let items = document.querySelectorAll("#system-list li a");

    // Ẩn CarPart khi trang tải
    carPartContainer.style.display = "none";

    items.forEach(item => {
        item.addEventListener("click", function () {
            let partName = this.textContent; // Lấy tên bộ phận xe được click
            let Status = this.textContent;
            let ExpiryDate = this.textContent;
            // Hiển thị CarPart khi click
            carPartContainer.style.display = "block";

            // Cập nhật nội dung của CarPart
            document.getElementById("carPart").textContent = `Car Part: ${partName}`;
            document.getElementById("carStatus").textContent = `Car satus: ${Status}`;
            document.getElementById("expiredDate").textContent =`Expried date: ${ExpiryDate}`;
        });
    });
});

