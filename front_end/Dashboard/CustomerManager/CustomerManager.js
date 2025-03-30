const table = document.getElementById("UserList");

let pageCount;
let firstIndex;
let currentPage = 1;
const numRowPerTable = 10;

let select = [];
let list = [];

const searchInput = document.getElementById("searchString");
let searchString = searchInput.value;

const Previous = document.getElementById("Previous");
const Next = document.getElementById("Next");

const firstPage = document.getElementById("firstPage");
const lastPage = document.getElementById("lastPage");

const firstButton = document.getElementById("firstButton");
const secondButton = document.getElementById("secondButton");
const thirdButton = document.getElementById("thirdButton");

const buttons = document.getElementsByClassName("button");

const firstDot = document.getElementById("firstDot");
const secondDot = document.getElementById("secondDot");

let sortColumn = "";
let sortOrder = "ASC";

const userlist = document.getElementById("UserList").querySelector("tbody");

function addRow(user) {
  let newRow = document.createElement("tr");
  newRow.innerHTML = `
        <td> <input type="checkbox" user-id='${user.UserID}'> </td>
        <td class="ID">${user.UserID}</td>
        <td class="Name">${user.FirstName + " " + user.LastName}</td>
        <td class="Email">${user.Email}</td>
        <td class="Phone">${user.Phone}</td>
        <td class="Date">${user.DateCreated.split("T")[0]}</td>
        <td><button class="details-btn">View Details</button></td>
    `;
  let checkbox = newRow.querySelector("input");
  if (select.includes(user.UserID)) checkbox.checked = true;
  else checkbox.checked = false;
  checkbox.addEventListener("click", () => Select(user.UserID));
  userlist.appendChild(newRow);
  // Add event listener for the "View Details" button
  const detailsButton = newRow.querySelector(".details-btn");
  detailsButton.addEventListener("click", () => {
    window.location.href = `/front_end/Dashboard/CustomerProfile/CustomerProfile.html?ID=${user.UserID}`;
  });
}

// chỉ số trang
async function setPagination(index) {
  currentPage = index;
  firstIndex = (currentPage - 1) * 10 + 1;

  // 2 button
  if (currentPage == 1) {
    Previous.style.display = "none";
  } else {
    Previous.style.display = "block";
  }
  if (currentPage == pageCount) {
    Next.style.display = "none";
  } else {
    Next.style.display = "block";
  }

  // page index
  if (pageCount <= 7) {
    document.querySelectorAll(".page").forEach(function (element) {
      element.remove();
    });

    firstPage.style.display = "none";
    lastPage.style.display = "none";

    firstDot.style.display = "none";
    secondDot.style.display = "none";

    firstButton.style.display = "none";
    secondButton.style.display = "none";
    thirdButton.style.display = "none";

    Previous.style.display = "none";
    Next.style.display = "none";

    for (let i = 1; i <= pageCount; i++) {
      let button = document.getElementById(`page${i}`);
      if (!button) {
        button = document.createElement("button");
        button.classList.add("button");
        button.id = `page${i}`;
        button.classList.add("page");
        button.innerHTML = i;
        button.addEventListener("click", () => setPagination(i));
        Next.parentNode.insertBefore(button, Next);
      }
      button.style.display = "inline-block";
      button.classList.remove("active");
      if (i == currentPage) {
        button.classList.add("active");
      }
    }
  } else {
    document.querySelectorAll(".page").forEach(function (element) {
      element.remove();
    });

    firstPage.style.display = "inline-block";
    lastPage.style.display = "inline-block";

    if (currentPage <= 3) {
      firstDot.style.display = "none";
      secondDot.style.display = "block";

      firstButton.innerHTML = "2";
      secondButton.innerHTML = "3";
      thirdButton.innerHTML = "4";
    } else if (currentPage >= pageCount - 2) {
      firstDot.style.display = "block";
      secondDot.style.display = "none";

      firstButton.innerHTML = pageCount - 3;
      secondButton.innerHTML = pageCount - 2;
      thirdButton.innerHTML = pageCount - 1;
    } else {
      firstDot.style.display = "block";
      secondDot.style.display = "block";

      firstButton.innerHTML = currentPage - 1;
      secondButton.innerHTML = currentPage;
      thirdButton.innerHTML = currentPage + 1;
    }

    firstButton.style.display = "inline-block";
    secondButton.style.display = "inline-block";
    thirdButton.style.display = "inline-block";

    // set active class
    for (let button of buttons) {
      button.classList.remove("active");
    }
    switch (currentPage) {
      case 1:
        firstPage.classList.add("active");
        break;
      case 2:
        firstButton.classList.add("active");
        break;
      case pageCount:
        lastPage.classList.add("active");
        break;
      case pageCount - 1:
        thirdButton.classList.add("active");
        break;
      default:
        secondButton.classList.add("active");
        break;
    }
  }

  // remove all rows
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

  // add row to table
  await fetch("http://localhost:3000/CustomerManager/getUserList", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      firstIndex: firstIndex - 1,
      count: numRowPerTable,
      searchString: searchString,
      sortColumn: sortColumn,
      sortOrder: sortOrder,
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      for (let user of result.list) {
        addRow(user);
      }
    });
}

async function showTable() {
  // get number of pages
  await fetch("http://localhost:3000/CustomerManager/getTotelUserCount", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ searchString: searchString }),
  })
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      list = result.list;
      pageCount = Math.ceil(result.list.length / numRowPerTable);
    });

  firstPage.innerHTML = "1";
  lastPage.innerHTML = pageCount;

  setPagination(1);
}

window.onload = () => {
  showTable();
  ToggleButton();
  // add button's event
  Previous.addEventListener("click", () => {
    setPagination(currentPage - 1);
  });
  Next.addEventListener("click", () => {
    setPagination(currentPage + 1);
  });
  for (let button of buttons) {
    button.addEventListener("click", function () {
      setPagination(parseInt(button.innerHTML));
    });
  }

  // Add event listener for search input
  searchInput.addEventListener("input", () => {
    searchString = searchInput.value;
    SetSearchIcon();
    showTable();
  });

  // Add event listener for sort buttons
  const sortButtons = document.querySelectorAll(".sort");
  sortButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const column = button.getAttribute("data-column");
      if (sortColumn === column) {
        sortOrder = sortOrder === "ASC" ? "DESC" : "ASC";
      } else {
        sortColumn = column;
        sortOrder = "ASC";
      }
      showTable();
    });
  });
};

searchInput.parentElement
  .querySelector("span")
  .addEventListener("click", () => {
    searchInput.value = "";
    searchString = searchInput.value;
    SetSearchIcon();
    showTable();
  });

function SetSearchIcon() {
  if (searchString == "") {
    searchInput.parentElement.querySelector("span").innerHTML = "search";
  } else {
    searchInput.parentElement.querySelector("span").innerHTML = "search_off";
  }
}

//  select control
function Select(userID) {
  let index = select.indexOf(userID);
  if (index != -1) {
    select.splice(index, 1);
  } else {
    select.push(userID);
  }
  SetNumSelected();
  ToggleButton();
}

// button
const numSelect = document.querySelector(".num-select");
const selectAll = document.querySelector(".select-all");
const unselectAll = document.querySelector(".unselect-all");
// const filter = document.querySelector(".filter");
const add = document.querySelector(".add");
// const remove = document.querySelector(".remove");
const message = document.querySelector(".message");

// select all
selectAll.addEventListener("click", async () => {
  for (let id of list) {
    let ID = parseInt(id);
    if (!select.includes(ID)) {
      select.push(parseInt(ID));
    }
  }
  for (let input of document.querySelectorAll('input[type="checkbox"]')) {
    input.checked = true;
  }
  SetNumSelected();
});

// unselect all
unselectAll.addEventListener("click", async () => {
  for (let id of list) {
    let ID = parseInt(id);
    let index = select.indexOf(ID);
    if (index != -1) {
      select.splice(index, 1);
    }
  }
  for (let input of document.querySelectorAll('input[type="checkbox"]')) {
    input.checked = false;
  }
  SetNumSelected();
  ToggleButton();
});

// button display control
function ToggleButton() {
  if (select.length == 0) {
    numSelect.style.display = "none";
    selectAll.style.display = "none";
    unselectAll.style.display = "none";
    // remove.style.display = "none";
    message.style.display = "none";
    // filter.style.display = "flex";
    add.style.display = "flex";
  } else {
    numSelect.style.display = "flex";
    selectAll.style.display = "flex";
    unselectAll.style.display = "flex";
    // remove.style.display = "flex"; 
    message.style.display = "flex";
    // filter.style.display = "none";
    add.style.display = "none";
  }
}

function SetNumSelected() {
  numSelect.innerHTML = `
        <span class="material-icons">
            download_done
        </span>
        ${select.length} people selected
    `;
}

// message button
message.addEventListener("click", () => {
  if (select.length == 1) {
    window.location.href = `/front_end/Dashboard/Message/Message.html?ID=${select[0]}`;
  } else {
    localStorage.setItem("group", JSON.stringify(select));
    window.location.href = `/front_end/Dashboard/Message/Message.html?ID=0`;
  }
});

// add button
add.addEventListener("click", () => {
  window.location.href = "../../Register/Register.html?role=customer";
});
