document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".tab-content > div").forEach(div => {
    div.style.display = "none";
  });
  document.getElementById("Car-system-chart").style.display = "block";
  const buttons = document.querySelectorAll(".chart-btn");

  buttons.forEach(button => {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      showChart(targetId);
    });
  });
});
function showChart(id) {
  document.querySelectorAll(".tab-content > div").forEach(div => {
    div.style.display = "none";
  });

  // Hiển thị chart theo id
  const activeChart = document.getElementById(id);
  if (activeChart) {
    activeChart.style.display = "block";
  }
}

// async function getSystem() {
//     try {
//       const carSystems = await $.ajax({
//         url: "http://localhost:3000/listCarSystem",
//         method: "POST",
//         contentType: "application/json",
//       });

//       const systemList = $(".system-list");
//       systemList.empty(); // Xóa dữ liệu cũ nếu có

//       carSystems.forEach((carSystem) => {
//         const system = $(`
//           <li>
//             <a href="#" class="system-item" data-id="${carSystem.CarSystemID}">${carSystem.CarSystemName}</a>
//           </li>
//         `);
//         systemList.append(system);
//       });


//     } catch (error) {
//       console.error("Error fetching car systems:", error);
//     }
//   }





let myChart = document.getElementById('myChart1').getContext('2d');

Chart.defaults.font.family = 'Lato';
Chart.defaults.font.size = 18;
Chart.defaults.color = '#777';
console.log(typeof Chart); // Nếu là "undefined", thư viện chưa được tải


let chart1 = new Chart(myChart, {
  type: 'line', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
  data: {
    labels: ['Engine System', 'Braking System', 'Electrical System', 'Airconditioning System', 'Fuel System', 'Battery System', 'Shock Absorber System', 'Wheel System'],
    datasets: [{
      label: 'Revenue',
      data: [
        81045,
        0,
        106519,
        105162,
        95072,
        67343,
        12623,
        13734

      ],
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',

        'rgba(55, 62, 235, 0.6)',
        'rgba(25, 206, 86, 0.6)',
      ],
      borderWidth: 1,
      borderColor: '#777',
      hoverBorderWidth: 3,
      hoverBorderColor: '#000'

    }]
  },
  options: {
    indexAxis: 'x', // Hiển thị theo chiều ngang
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'The chart for revenue of each carsystem',
        color: 'white',

        font: {
          size: 25
        },

      },
      legend: {
        display: true,
        position: 'right',
        labels: {
          color: 'white',
          font: {
            size: 20
          },
          padding: 20
        },

        fullSize: true
      },
      tooltip: {
        enabled: true
      }
    },
    layout: {
      padding: {
        right: 70,
        top: -10

      }
    }
  }

});


// Lay tong doanh thu hom nay va so sanh voi hom qua 
async function fetchTotalRevenueToday() {
  try {
    const response = await fetch("http://localhost:3000/TotalRevenueToday", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
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
      changeElement.textContent = `${data.percentChange}% from yesterday`;
      changeElement.classList.toggle("positive", data.percentChange >= 0);
      changeElement.classList.toggle("negative", data.percentChange < 0);
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
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
    });
    const data = await response.json();
    const totalOrderElement = document.querySelector("#TotalOrder .amount");
    const changeElement = document.querySelector("#TotalOrder .change");

    if (totalOrderElement) {
      totalOrderElement.textContent = `${data.totalOrders} orders`;
    }

    if (changeElement) {
      changeElement.textContent = `${data.percentChange}% from yesterday`;
      changeElement.classList.toggle("positive", data.percentChange >= 0);
      changeElement.classList.toggle("negative", data.percentChange < 0);
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
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
    });
    const data = await response.json();
    const totalProductElement = document.querySelector("#ProductSold .amount");
    const changeElement = document.querySelector("#ProductSold .change");

    if (totalProductElement) {
      totalProductElement.textContent = `${data.totalProducts} products`;
    }

    if (changeElement) {
      changeElement.textContent = `${data.percentChange}% from yesterday`;
      changeElement.classList.toggle("positive", data.percentChange >= 0);
      changeElement.classList.toggle("negative", data.percentChange < 0);
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
        "Authorization": `Bearer ${localStorage.getItem("token")}`
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
      changeElement.textContent = `${data.percentChange}% from yesterday`;
      changeElement.classList.toggle("positive", data.percentChange >= 0);
      changeElement.classList.toggle("negative", data.percentChange < 0);
    }

  } catch (error) {
    console.error("Error fetching new customer data:", error);
  }
}

// Gọi hàm sau khi trang tải xong
document.addEventListener("DOMContentLoaded", fetchTotalNewCustomerToday);






async function fetchServiceOrders() {
  try {
    const response = await fetch("http://localhost:3000/TopProduct", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const tbody = document.querySelector(".top-products tbody");

    if (!tbody) return;

    tbody.innerHTML = ""; // Xóa nội dung cũ

    const totalOrders = data.reduce((sum, service) => sum + service.TotalOrders, 0);

    data.sort((a, b) => b.TotalOrders - a.TotalOrders);

    data.forEach((service, index) => {
      const percentage = ((service.TotalOrders / totalOrders) * 100).toFixed(2);
      const barWidth = Math.min(percentage * 2, 100); // Giới hạn max 100%

      const row = `
              <tr>
                  <td>${index + 1}</td>
                  <td>${service.ServiceName}</td> 
                  <td>
                      <div class="popularity">
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

// Gọi hàm khi trang tải xong
document.addEventListener('DOMContentLoaded', fetchServiceOrders);

