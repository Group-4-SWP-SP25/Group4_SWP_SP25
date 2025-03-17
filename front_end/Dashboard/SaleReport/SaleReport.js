document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".tab-content > div").forEach((div) => {
    div.style.display = "none";
  });
  document.getElementById("Car-system-chart").style.display = "block";
  const buttons = document.querySelectorAll(".chart-btn");

  buttons.forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      showChart(targetId);
    });
  });
});
function showChart(id) {
  document.querySelectorAll(".tab-content > div").forEach((div) => {
    div.style.display = "none";
  });

  // Hiển thị chart theo id
  const activeChart = document.getElementById(id);
  if (activeChart) {
    activeChart.style.display = "block";
  }
}

// chart custom

document.addEventListener("DOMContentLoaded", async function () {
  const yearSelect = document.getElementById("yearSelect");

  // Thiết lập năm mặc định là 2025
  async function fetchRevenueData(year) {
    const response = await fetch("http://localhost:3000/TopRevenueByMonth", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ year: year }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }
  try {
    const data = await fetchRevenueData(2025);
    console.log("Default Revenue Data (2025):", data);

    if (data && data.monthlyRevenue) {
      updateChart(data.monthlyRevenue);
    }
  } catch (error) {
    console.error("Error fetching default revenue data:", error);
  }

  yearSelect.addEventListener("change", async function () {
    const selectedYear = this.value;
    console.log("Selected Year:", selectedYear);

    try {
      const data = await fetchRevenueData(selectedYear);
      console.log("Revenue Data:", data);

      if (data && data.monthlyRevenue) {
        updateChart(data.monthlyRevenue);
      }
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    }
  });
});

// Hàm cập nhật dữ liệu của biểu đồ
function updateChart(revenueData) {
  chart1.data.datasets[0].data = revenueData;
  chart1.update();
}

let myChart = document.getElementById("myChart1").getContext("2d");
Chart.defaults.font.family = "Lato";
Chart.defaults.font.size = 18;
Chart.defaults.color = "#fff";

let chart1 = new Chart(myChart, {
  type: "line",
  data: {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        borderColor: "rgba(255, 99, 132, 0.6)",
        label: "Revenue",
        data: [],

        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderWidth: 1,
        borderColor: "pink",
        hoverBorderWidth: 3,
        hoverBorderColor: "pink",
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Chart of sales per month",
        color: "white",
        font: { size: 25 },
      },
      legend: {
        display: true,
        position: "right",
        labels: { color: "white", font: { size: 20 }, padding: 20 },
      },
      tooltip: { enabled: true },
    },
  },
});

// chart top product per month

// Lay tong doanh thu hom nay va so sanh voi hom qua
async function fetchTotalRevenueToday() {
  try {
    const response = await fetch("http://localhost:3000/TotalRevenueToday", {
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
    const totalSaleElement = document.querySelector("#TotalSale .amount");
    const changeElement = document.querySelector("#TotalSale .change");

    console.log(data);
    if (totalSaleElement) {
      totalSaleElement.textContent = `$${data.totalSales}`;
    }

    if (changeElement) {
      const percentChange = data.percentChange;
      changeElement.textContent = `${percentChange >= 0 ? "+" : "-"}${Math.abs(
        percentChange
      )}% from yesterday`;
      changeElement.style.color = percentChange >= 0 ? "green" : "red";
    }
  } catch (error) {
    console.error("Error fetching sales data:", error);
  }
}

document.addEventListener("DOMContentLoaded", fetchTotalRevenueToday);

// lay tong order hom nay so voi hom truoc

async function fetchTotalOrderToday() {
  try {
    const response = await fetch("http://localhost:3000/TotalOrderToday", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();
    const totalOrderElement = document.querySelector("#TotalOrder .amount");
    const changeElement = document.querySelector("#TotalOrder .change");

    if (totalOrderElement) {
      totalOrderElement.textContent = `${data.totalOrders} orders`;
    }

    if (changeElement) {
      const percentChange = data.percentChange;
      changeElement.textContent = `${percentChange >= 0 ? "+" : "-"}${Math.abs(
        percentChange
      )}% from yesterday`;
      changeElement.style.color = percentChange >= 0 ? "green" : "red";
    }
  } catch (error) {
    console.error("Error fetching total orders data:", error);
  }
}
document.addEventListener("DOMContentLoaded", fetchTotalOrderToday);

// Lay tong san pham da ban duoc hom nay so voi hom qua

async function fetchTotalProductSoldToday() {
  try {
    const response = await fetch("http://localhost:3000/TotalProductSold", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();
    const totalProductElement = document.querySelector("#ProductSold .amount");
    const changeElement = document.querySelector("#ProductSold .change");
    
    if (totalProductElement) {
      totalProductElement.textContent = `${data.totalProducts} products`;
    }

    if (changeElement) {
      const percentChange = data.percentChange;
      changeElement.textContent = `${percentChange >= 0 ? "+" : "-"}${Math.abs(
        percentChange
      )}% from yesterday`;
      changeElement.style.color = percentChange >= 0 ? "green" : "red";
    }
  } catch (error) {
    console.error("Error fetching product sold data:", error);
  }
}
document.addEventListener("DOMContentLoaded", fetchTotalProductSoldToday);

// Total new customer

async function fetchTotalNewCustomerToday() {
  try {
    const response = await fetch("http://localhost:3000/TotalNewCustomer", {
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
    const totalCustomerElement = document.querySelector("#NewCustomer .amount");
    const changeElement = document.querySelector("#NewCustomer .change");

    if (totalCustomerElement) {
      totalCustomerElement.textContent = `${data.totalCustomers} customers`;
    }

    if (changeElement) {
      const percentChange = data.percentChange;
      changeElement.textContent = `${percentChange >= 0 ? "+" : "-"}${Math.abs(
        percentChange
      )}% from yesterday`;
      changeElement.style.color = percentChange >= 0 ? "green" : "red";
    }
  } catch (error) {
    console.error("Error fetching new customer data:", error);
  }
}

// Gọi hàm sau khi trang tải xong
document.addEventListener("DOMContentLoaded", fetchTotalNewCustomerToday);

async function fetchServiceOrders() {
  try {
    const response = await fetch("http://localhost:3000/TopService", {
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
    const tbody = document.querySelector(".top-services tbody");

    if (!tbody) return;

    tbody.innerHTML = ""; // Xóa nội dung cũ

    const totalOrders = data.reduce(
      (sum, service) => sum + service.TotalOrders,
      0
    );

    data.sort((a, b) => b.TotalOrders - a.TotalOrders);

    data.forEach((service, index) => {
      const percentage = ((service.TotalOrders / totalOrders) * 100).toFixed(2);
      const barWidth = Math.min(percentage * 2, 100); // Giới hạn max 100%

      const row = `
              <tr>
                  <td>${index + 1}</td>
                  <td>${service.ServiceName}</td> 
                  <td>
                      <div class="popularity1">
                          <div class="bar" style="width: ${barWidth}%; background-color: orange;"></div>
                      </div>
                  </td>
                  <td><span class="sales" style="background-color: orange;">${percentage}%</span></td>
              </tr>
          `;
      tbody.innerHTML += row;
    });
  } catch (error) {
    console.error("Error fetching service orders:", error);
  }
}
document.addEventListener("DOMContentLoaded", fetchServiceOrders);

//Top Product

document.addEventListener("DOMContentLoaded", async function () {
  const branchSelect = document.getElementById("branchSelect");
  const yearSelect = document.getElementById("yearSelect1");
  const tableBody = document.getElementById("tbody1");
  console.log("step1", branchSelect, yearSelect, tableBody);

  // Giá trị mặc định
  const defaultBranch = "1";
  const defaultYear = "2025";

  if (branchSelect) branchSelect.value = defaultBranch;
  if (yearSelect) yearSelect.value = defaultYear;

  async function fetchTopProducts(branch, year) {
    console.log("Đang gửi request với dữ liệu:", { branch, year });

    try {
      const response = await fetch("http://localhost:3000/TopProducts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ branch, year }),
      });

      if (!response.ok) {
        throw new Error(`Lỗi API: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Dữ liệu API:", data);

      if (!tableBody) return;
      tableBody.innerHTML = "";

      const totalOrders1 = data.reduce(
        (sum, product) => sum + product.Sales,
        0
      );

      data.sort((a, b) => b.Sales - a.Sales);

      data.forEach((product, index) => {
        const percentage1 = ((product.Sales / totalOrders1) * 100).toFixed(2);
        const barWidth1 = Math.min(percentage1 * 2, 100);

        const row = `
          <tr>
              <td>${index + 1}</td>
              <td>${product.ProductName}</td>
              <td>
                  <div class="popularity2">
                      <div class="bar" style="width: ${barWidth1}%; background-color: orange;"></div>
                  </div>
              </td>
              <td><span class="sales" style="background-color: orange;">${percentage1}%</span></td>
          </tr>
        `;
        tableBody.innerHTML += row;
      });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  }

  // Change year or brand event
  if (branchSelect && yearSelect) {
    branchSelect.addEventListener("change", (event) => {
      event.preventDefault();
      fetchTopProducts(branchSelect.value, yearSelect.value);
    });

    yearSelect.addEventListener("change", (event) => {
      event.preventDefault();
      fetchTopProducts(branchSelect.value, yearSelect.value);
    });

    await fetchTopProducts(defaultBranch, defaultYear);
  } else {
    console.error("Lỗi: Không tìm thấy branchSelect hoặc yearSelect trong DOM");
  }
});
