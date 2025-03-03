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

async function getSystem() {
    try {
      const carSystems = await $.ajax({
        url: "http://localhost:3000/listCarSystem",
        method: "POST",
        contentType: "application/json",
      });

      const systemList = $(".system-list");
      systemList.empty(); // Xóa dữ liệu cũ nếu có

      carSystems.forEach((carSystem) => {
        const system = $(`
          <li>
            <a href="#" class="system-item" data-id="${carSystem.CarSystemID}">${carSystem.CarSystemName}</a>
          </li>
        `);
        systemList.append(system);
      });

     
    } catch (error) {
      console.error("Error fetching car systems:", error);
    }
  }



  

  let myChart = document.getElementById('myChart1').getContext('2d');

  Chart.defaults.font.family = 'Lato';
  Chart.defaults.font.size = 18;
  Chart.defaults.color = '#777';
  console.log(typeof Chart); // Nếu là "undefined", thư viện chưa được tải


  let chart1 = new Chart(myChart, {
  type: 'doughnut', 
  data: {
labels: ['Engine System', 'Braking System', 'Electrical System', 'Airconditioning System', 'Fuel System', 'Battery System', 'Shock Absorber System', 'Wheel System'], 
datasets: [{
  label: 'Revenue',
  data: [
      81045, 
      83060,
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
  top:-10
  
}
}
}

});


document.addEventListener("DOMContentLoaded", function () {
  // Tạo phần tử div
  const salesBox = document.createElement("div");
  salesBox.classList.add("sales-box");

  // Chèn HTML vào div
  salesBox.innerHTML = `
      <img src="TotalSale.png" alt="Total Sales">
      <p class="amount">$0</p> 
      <p class="label">Total Sales</p>
      <p class="change positive">+10% from yesterday</p>
  `;

  // Thêm vào body hoặc vị trí mong muốn
  document.body.appendChild(salesBox);

  // Gọi API để cập nhật dữ liệu
  fetch("http://localhost:3000/TotalRevenueToday") 
      .then(response => response.json())
      .then(data => {
          const amountElement = salesBox.querySelector(".amount");
          amountElement.textContent = `$${data.totalSales.toLocaleString()}`; 
      })
      .catch(error => console.error("❌ Cannot find data:", error));
});
