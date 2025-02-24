document.addEventListener("DOMContentLoaded", function () {
    const uploadInput = document.getElementById("uploadInput");
    const previewImage = document.getElementById("previewImage");
    const resetButton = document.getElementById("resetButton");
    if (uploadInput && previewImage && resetButton) {
        
        // Sự kiện khi người dùng chọn ảnh
        uploadInput.addEventListener("change", function () {
            if (this.files.length > 0) { // Kiểm tra xem có file nào được chọn không
                const file = this.files[0];
                const reader = new FileReader();

                reader.onload = function (e) {
                    previewImage.src = e.target.result; // Hiển thị ảnh đã chọn
                };

                reader.readAsDataURL(file);
            }
        });

        // Sự kiện khi nhấn nút Reset
        resetButton.addEventListener("click", function () {
            uploadInput.value = ""; // Xóa file đã chọn
            previewImage.src = "";  // Xóa ảnh hiển thị
        });
    } else {
        console.error("Một hoặc nhiều phần tử HTML không tồn tại.");
    }
});

