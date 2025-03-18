


function searchProduct() {
  let input = document.getElementById("searchInput").value.toLowerCase();
  let rows = document.querySelectorAll("#productTableBody tr");
  rows.forEach(row => {
      let name = row.cells[1].textContent.toLowerCase();
      row.style.display = name.includes(input) ? "" : "none";
  });
}
function filterProducts() {
  let category = document.getElementById("categoryFilter").value;
  let status = document.getElementById("statusFilter").value;
  let rows = document.querySelectorAll("#productTableBody tr");
  rows.forEach(row => {
      let catMatch = (category === "all" || row.cells[2].textContent === category);
      let statusMatch = (status === "all" || row.cells[4].textContent.trim() === status);
      row.style.display = catMatch && statusMatch ? "" : "none";
  });
}






async function fetchProductOverview() {
  try {
    const response = await fetch("http://localhost:3000/ProductOverview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    let tableBody = document.querySelector("#productTableBody");
    tableBody.innerHTML = "";

    data.forEach(item => {
      let statusText, statusColor;

      if (item.Quantity >= 4) {
        statusText = "Available";
        statusColor = "color: green;";

      } else if (item.Quantity >1) {
        statusText = "Low Stock";
        statusColor = "color: yellow;";
      } else {
        statusText = "Sold Out";
        statusColor = "color: red;";
      }
        
      let row = `
        <tr>
            <td>#${item.AccessoryID}</td>
            <td>${item.AccessoryName}</td>
            <td>${item.BranchName}</td>
            <td>${item.Quantity} items</td>
            <td style="${statusColor}">${statusText}</td>
            <td class="changeButton">
                <button class="delete-btn" data-id="${item.AccessoryID}" data-branch="${item.BranchID}" style="background-color: #FF4C4C; color: white;">Delete</button>
          <button class="edit-btn" data-id="${item.AccessoryID}" data-branch="${item.BranchID}" style="background-color: #007BBA; color: white;">Edit</button>
            </td>
        </tr>
      `;
      
      tableBody.innerHTML += row;

    });
    console.log('Data:', data.map(item => item.BranchID));``
    attachDeleteEvent();
    attachEditEvent(); 
  } catch (error) {
    console.error("Error fetching product overview:", error);
  }   
}

document.addEventListener("DOMContentLoaded", fetchProductOverview);

//Edit product
async function fetchEditProduct() {
  async function deleteProduct(productID, branchID) {  
    try {
      const response = await fetch(`http://localhost:3000/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ productID, branchID })  
        
      });
      
  
      const result = await response.json();
      console.log(result);
  
      if (!response.ok) {
        if (result.message && result.message.includes("Sản phẩm đã có trong đơn hàng tại chi nhánh này, không thể xóa.")) {
          showAlertWrong();
        } else {
          alert(`Lỗi: ${result.message}`);
        }
        return;
      }
  
      await fetchProductOverview();
      showAlertSuccess();
    } catch (error) {
      showAlertWrong();
      console.error("Error deleting product:", error);
    }
  }
  
}





// Delete product

async function deleteProduct(productID, branchID) {  
  try {
    const response = await fetch(`http://localhost:3000/DeleteProduct`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ productID, branchID })  
      
    });
    

    const result = await response.json();
    console.log(result);

    if (!response.ok) {
      if (result.message && result.message.includes("Sản phẩm đã có trong đơn hàng tại chi nhánh này, không thể xóa.")) {
        showAlertWrong();
      } else {
        alert(`Lỗi: ${result.message}`);
      }
      return;
    }

    await fetchProductOverview();
    showAlertSuccess();
  } catch (error) {
    showAlertWrong();
    console.error("Error deleting product:", error);
  }
}




function attachDeleteEvent() {
  document.querySelectorAll(".delete-btn").forEach(button => {
    button.addEventListener("click", (event) => {
      const productID =event.target.dataset.id; 
      const branchID =event.target.dataset.branch;  // Lấy đúng branchID

      if (!branchID) {
        console.error("Lỗi: branchID không tồn tại!");
        return;
      }

      if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
        deleteProduct(productID, branchID);  // Truyền đúng branchID
      }
    });
  });
}

// Alert
function showAlertWrong(){
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "You can't delete this product because it's still in order!",
    // footer: '<a href="#">Why do I have this issue?</a>'
  });
}
function showAlertSuccess(){
  Swal.fire({
    title: "Delete Succesfully!",
    text: "You have successfully deleted the product.!",
    icon: "success"
  });
}





async function updateProduct(productID, branchID, name, quantity) {
  try {
    const response = await fetch("http://localhost:3000/UpdateProduct", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        productID,
        branchID,
        AccessoryName: name,
        Quantity: quantity
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Update Success:", result);

    Swal.fire("Updated!", "Your product has been updated.", "success");
    
    // Refresh danh sách sản phẩm sau khi cập nhật
    await fetchProductOverview();
  } catch (error) {
    console.error("Error updating product:", error);
    Swal.fire("Error!", "Failed to update product.", "error");
  }
}




document.addEventListener("DOMContentLoaded", () => {
  attachEditEvent();
});

function attachEditEvent() {
  document.querySelectorAll(".edit-btn").forEach(button => {
    button.addEventListener("click", (event) => {
      const productID = event.target.dataset.id;
      const branchID = event.target.dataset.branch;

      // Tìm sản phẩm từ danh sách đã fetch
      const productRow = event.target.closest("tr");
      const productName = productRow.cells[1].textContent.trim();
      const quantity = parseInt(productRow.cells[3].textContent.trim());

      // Hiển thị popup chỉnh sửa sản phẩm
      Swal.fire({
        title: "Edit Product",
        html: `
          <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 10px;">
            <label style="font-weight: bold;">Product Name</label>
            <input type="text" id="productName" class="swal2-input" value="${productName}" style="width: 80%;">
            
            <label style="font-weight: bold;">Quantity</label>
            <input type="number" id="productQuantity" class="swal2-input" value="${quantity}" style="width: 80%;">
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Save",
        cancelButtonText: "Cancel",
        preConfirm: () => {
          const name = document.getElementById("productName").value;
          const quantity = document.getElementById("productQuantity").value;
          return { name, quantity };
        }
      }).then((result) => {
        if (result.isConfirmed) {
          updateProduct(productID, branchID, result.value.name, result.value.quantity);
        }
      });
    });
  });
}

