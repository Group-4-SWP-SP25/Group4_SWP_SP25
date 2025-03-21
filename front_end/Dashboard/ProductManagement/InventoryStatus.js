async function fetchTotalInventory() {
  try {
    const response = await fetch("http://localhost:3000/TotalQuantity", {
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
    const totalInventoryElement = document.querySelector(
      ".total-availability .items-count"
    );

    if (totalInventoryElement) {
      totalInventoryElement.textContent = `${data.totalQuantity} Items`;
    }
  } catch (error) {
    console.error("Error fetching total inventory:", error);
  }
}

document.addEventListener("DOMContentLoaded", fetchTotalInventory);

//Compare total order product this month with last month
async function compareTotalProduct() {
  try {
    const response = await fetch("http://localhost:3000/CompareTotalProduct", {
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
    const totalOrderElement = document.querySelector(".sold-out .items-count");
    const changeElement = document.querySelector(".sold-out .items-count span");
    console.log(data);
    if (totalOrderElement) {
      totalOrderElement.firstChild.textContent = `${data.totalProductThisMonth} Items `;
    }

    if (changeElement) {
      const percentChange = data.percentChange1;
      changeElement.textContent = `${percentChange >= 0 ? "⬆" : "⬇"} ${Math.abs(
        percentChange
      )}%`;
      changeElement.classList.toggle("increase", percentChange >= 0);
      changeElement.classList.toggle("decrease", percentChange < 0);
    }
  } catch (error) {
    console.error("Error fetching total orders data:", error);
  }
}
document.addEventListener("DOMContentLoaded", compareTotalProduct);
