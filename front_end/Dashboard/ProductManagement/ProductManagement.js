function searchProduct() {
  let input = document.getElementById("searchInput").value.toLowerCase();
  let rows = document.querySelectorAll("#productTableBody tr");
  rows.forEach((row) => {
    let name = row.cells[1].textContent.toLowerCase();
    row.style.display = name.includes(input) ? "" : "none";
  });
}
function filterProducts() {
  let category = document.getElementById("categoryFilter").value;
  let status = document.getElementById("statusFilter").value;
  let rows = document.querySelectorAll("#productTableBody tr");
  rows.forEach((row) => {
    let catMatch = category === "all" || row.cells[2].textContent === category;
    let statusMatch =
      status === "all" || row.cells[4].textContent.trim() === status;
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

    data.forEach((item) => {
      let statusText, statusColor;

      if (item.Quantity >= 4) {
        statusText = "Available";
        statusColor = "color: green;";
      } else if (item.Quantity > 1) {
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
             <td>${item.UnitPrice}$</td>
            <td style="${statusColor}">${statusText}</td>
            <td class="changeButton">
            
          
          <button class="edit-btn" data-id="${item.AccessoryID}" data-branch="${item.BranchID}" style="background-color: #007BBA; color: white;">Edit</button>
            </td>
        </tr>
      `;
      // <button class="delete-btn" data-id="${item.AccessoryID}" data-branch="${item.BranchID}" style="background-color: #FF4C4C; color: white;">Delete</button>
      tableBody.innerHTML += row;
    });

    // attachDeleteEvent();
    setTimeout(() => {
      attachEditEvent();
    }, 100);
  } catch (error) {
    console.error("Error fetching product overview:", error);
  }
}
document.addEventListener("DOMContentLoaded", fetchProductOverview);

// Alert
function showAlertWrong() {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "Invalid quanity, please try again.!",
    // footer: '<a href="#">Why do I have this issue?</a>'
  });
}
function showAlertSuccess() {
  Swal.fire({
    title: "Delete Succesfully!",
    text: "You have successfully deleted the product.!",
    icon: "success",
  });
}

async function updateProduct(productID, branchID, name, quantity, price) {
  try {
    console.log("Updating:", productID, branchID, name, quantity, price);

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
        Quantity: quantity,
        UnitPrice: price,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log("Update Success:", result);

    Swal.fire("Updated!", "Your product has been updated.", "success");

    // Refresh danh sách sản phẩm sau khi cập nhật
    await fetchProductOverview();
    attachEditEvent(); // Gán lại sự kiện click cho nút "Edit"
  } catch (error) {
    console.error("Error updating product:", error);
    Swal.fire("Error!", `Failed to update product: ${error.message}`, "error");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  attachEditEvent();
});

function attachEditEvent() {
  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const productID = event.target.dataset.id;
      const branchID = event.target.dataset.branch;

      const productRow = event.target.closest("tr");
      const productName = productRow.cells[1].textContent.trim();
      const quantity = productRow.cells[3].textContent.replace(/\D/g, ""); // Chỉ giữ số
      const price = productRow.cells[4].textContent.replace(/[^0-9.]/g, ""); // Chỉ giữ số và dấu chấm

      Swal.fire({
        title: "Edit Product",
        html: `
          <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 10px;">
            <label style="font-weight: bold;">Product Name</label>
            <input type="text" id="productName" class="swal2-input" value="${productName}" style="width: 80%;">

            <label style="font-weight: bold;">Quantity</label>
            <input type="number" id="productQuantity" class="swal2-input" value="${quantity}" style="width: 80%;" min="0">

            <label style="font-weight: bold;">Price</label>
            <input type="number" id="productPrice" class="swal2-input" value="${price}" style="width: 80%;" min="0" step="0.01">
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Save",
        cancelButtonText: "Cancel",
        preConfirm: () => {
          const name = document.getElementById("productName").value.trim();
          const quantityInput = document
            .getElementById("productQuantity")
            .value.trim();
          const priceInput = document
            .getElementById("productPrice")
            .value.trim();

          if (
            quantityInput === "" ||
            isNaN(quantityInput) ||
            parseInt(quantityInput) < 0
          ) {
            Swal.fire("Error", "Invalid quantity, please try again !", "error");
            return false;
          }

          if (
            priceInput === "" ||
            isNaN(priceInput) ||
            parseFloat(priceInput) < 0
          ) {
            Swal.fire("Error", "Invalid price, please try again !", "error");
            return false;
          }

          return {
            name,
            quantity: parseInt(quantityInput),
            price: parseFloat(priceInput).toFixed(2), // Giữ lại 2 số thập phân
          };
        },
      }).then((result) => {
        if (result.isConfirmed) {
          updateProduct(
            productID,
            branchID,
            result.value.name,
            result.value.quantity,
            result.value.price
          );
        }
      });
    });
  });
}

// Add more product

async function addAccessory(accessoryName, serviceTypeID, description, branchID, quantity, unitPrice) {
  try {
    console.log("Adding Accessory:", accessoryName, serviceTypeID, description, branchID, quantity, unitPrice);

    const response = await fetch("http://localhost:3000/AddAccessory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        AccessoryName: accessoryName,
        ServiceTypeID: serviceTypeID,
        Description: description,
        BranchID: branchID,
        Quantity: quantity,
        UnitPrice: unitPrice
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log("Accessory Added Successfully:", result);

    Swal.fire("Added!", "New accessory has been added.", "success");

    // Refresh danh sách accessories sau khi thêm mới
    await fetchProductOverview();
    attachAddEvent(); // Gán lại sự kiện click cho nút "Add"

  } catch (error) {
    console.error("Error adding accessory:", error);
    Swal.fire("Error!", `Failed to add accessory: ${error.message}`, "error");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  attachAddEvent();
});
function attachAddEvent() {
  document.getElementById("addProductBtn").addEventListener("click", async () => {
    try {
      // Fetch danh sách Service Types & Branches từ DB
      const serviceTypes = await fetchServiceTypes();
      const branches = await fetchBranches();
      console.log("Fetching service types and branches...");

      // Hiển thị popup nhập thông tin
      Swal.fire({
        title: "Add New Accessory",
        html: `
          <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 5px;">
            <label><b>Accessory Name</b></label>
            <input type="text" id="accessoryName" class="swal2-input" style="width: 80%;" placeholder="Enter accessory name">

            <label><b>Service Type</b></label>
            <select id="serviceType" class="swal2-select" style="width: 80%;">
              ${(serviceTypes || []).map(st => `<option value="${st.ServiceID}">${st.ServiceName}</option>`).join("")}
            </select>

            <label><b>Description</b></label>
            <textarea id="description" class="swal2-textarea" style="width: 80%; height: 80px;" placeholder="Enter description"></textarea>

            <label><b>Branch</b></label>
            <select id="branch" class="swal2-select" style="width: 80%;">
              ${(branches || []).map(b => `<option value="${b.BranchID}">${b.BranchName}</option>`).join("")}
            </select>

            <label><b>Quantity</b></label>
            <input type="number" id="quantity" class="swal2-input" style="width: 80%;" min="1" placeholder="Enter quantity">

            <label><b>Unit Price</b></label>
            <input type="number" id="unitPrice" class="swal2-input" style="width: 80%;" min="0.01" step="0.01" placeholder="Enter unit price">
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Save",
        cancelButtonText: "Cancel",
        preConfirm: () => {
          const accessoryName = document.getElementById("accessoryName").value.trim();
          const serviceTypeID = document.getElementById("serviceType").value;
          const description = document.getElementById("description").value.trim();
          const branchID = document.getElementById("branch").value;
          const quantity = parseInt(document.getElementById("quantity").value) || 0;

          const unitPrice = document.getElementById("unitPrice").value;

          if (!accessoryName || !description || quantity <= 0 || unitPrice <= 0) {
            Swal.showValidationMessage("Please fill  in all fields correctly.");
            return false;
          }

          return { accessoryName, serviceTypeID, description, branchID, quantity, unitPrice };
        },
      }).then((result) => {
        if (result.isConfirmed) {
          addAccessory(
            result.value.accessoryName,
            result.value.serviceTypeID,
            result.value.description,
            result.value.branchID,
            result.value.quantity,
            result.value.unitPrice
          );
        }
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire("Error!", "Failed to load data from server.", "error");
    }
  });
}



async function fetchServiceTypes() {
  try {
    const response = await fetch("http://localhost:3000/GetServiceTypes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    // console.log("Response:", response);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    // console.log("Fetched service types:", result);

    // Đảm bảo lấy đúng dữ liệu
    return Array.isArray(result.services) ? result.services : [];
  } catch (error) {
    console.error("Error fetching service types:", error);
    Swal.fire(
      "Error!",
      `Failed to fetch service types: ${error.message}`,
      "error"
    );
    return [];
  }
}

async function fetchBranches() {
  try {
    const response = await fetch("http://localhost:3000/GetBranches", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    console.log("Response:", response);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log("Fetched branches:", result);

    // Đảm bảo lấy đúng dữ liệu
    return Array.isArray(result.branches) ? result.branches : [];
  } catch (error) {
    console.error("Error fetching branches:", error);
    Swal.fire("Error!", `Failed to fetch branches: ${error.message}`, "error");
    return [];
  }
}


































async function deleteProduct(productID, branchID) {
  try {
    const response = await fetch(`http://localhost:3000/DeleteProduct`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ productID, branchID }),
    });

    const result = await response.json();
    console.log(result);

    if (!response.ok) {
      if (
        result.message &&
        result.message.includes(
          "Sản phẩm đã có trong đơn hàng tại chi nhánh này, không thể xóa."
        )
      ) {
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
  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const productID = event.target.dataset.id;
      const branchID = event.target.dataset.branch; // Lấy đúng branchID

      if (!branchID) {
        console.error("Lỗi: branchID không tồn tại!");
        return;
      }

      if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
        deleteProduct(productID, branchID); // Truyền đúng branchID
      }
    });
  });
}

//Edit product
async function fetchEditProduct() {
  async function deleteProduct(productID, branchID) {
    try {
      const response = await fetch(`http://localhost:3000/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ productID, branchID }),
      });

      const result = await response.json();
      console.log(result);

      if (!response.ok) {
        if (
          result.message &&
          result.message.includes(
            "Sản phẩm đã có trong đơn hàng tại chi nhánh này, không thể xóa."
          )
        ) {
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
