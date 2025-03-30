let userChoosenID = 0;
let userHeaderID = 0;
let PopupFirstIndex = 0;
let PopupCount = 30;
const $PopupSearch = $("#PopupsearchString");
let PopupSearchString = $PopupSearch.val();
const $PopupHeader = $(".popup-header-user");
const $Popuplist = $(".popup-list");
const $overlay = $(".overlay");
const $popup = $(".popup-container");
$(document).ready(function () {
  // Sự kiện click để mở/đóng popup
  $(".btn-user").click(function (event) {
    event.preventDefault();
    event.stopPropagation();
    togglePopup();
  });

  $PopupSearch.on("input", async function () {
    PopupSearchString = $(this).val();
    $(".popup-list").html(""); // Xóa danh sách cũ
    PopupFirstIndex = 0;
    getListUser();
  });

  $(".popup-btn-cancel").on("click", function () {
    togglePopup();
  });

  $(".popup-btn-done").on("click", function () {
    if (userHeaderID === 0) {
      togglePopup();
      return;
    }
    userChoosenID = userHeaderID;
    $(".choose-user").addClass("hidden");
    $(".manage-header").removeClass("hidden");
    $(".order-table-container").addClass("hidden");
    $(".order-table-container").removeClass("has-content");
    $(".add-order").addClass("hidden");
    togglePopup();

    loadUserData(userChoosenID);
  });

  $(".switch-user").on("click", function () {
    togglePopup();
  });
});

async function loadUserData(userID) {
  try {
    const user = await $.ajax({
      url: "http://localhost:3000/userInfo",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ userID: userID }),
    });

    $(".user-name-text").html(`${user.FirstName} ${user.LastName}`);

    $(".user-name").data("user-id", user.UserID);
  } catch (err) {
    console.log(err);
  }
}

function togglePopup() {
  if (!$overlay.hasClass("active")) {
    // Mở popup
    $popup.css("display", "flex");
    $overlay.css("display", "flex");
    $Popuplist.html("");
    $PopupHeader.html("");
    $PopupSearch.val("");
    PopupSearchString = "";
    getListUser();

    setTimeout(() => {
      $popup.addClass("active");
      $overlay.addClass("active");
    }, 10); // Delay nhỏ để kích hoạt hiệu ứng
  } else {
    // Đóng popup
    $popup.removeClass("active");
    $overlay.removeClass("active");
    PopupFirstIndex = 0;
    PopupCount = 30;

    setTimeout(() => {
      $popup.css("display", "none");
      $overlay.css("display", "none");
    }, 300); // Thời gian khớp với hiệu ứng transition
  }
}

async function getListUser() {
  try {
    const token = localStorage.getItem("token");

    const users = await $.ajax({
      url: "http://localhost:3000/CustomerManager/getUserList",
      method: "POST",
      contentType: "application/json",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify({
        firstIndex: PopupFirstIndex,
        count: PopupCount,
        searchString: PopupSearchString,
      }),
    });

    users.list.forEach((user) => {
      addUser(user.UserID, `${user.FirstName} ${user.LastName}`);
    });
  } catch (err) {
    console.log(err);
  }
}

function addUser(id, name) {
  let $item = $("<div>", {
    class: "popup-list-item",
    "item-id": id,
    html: `
          <img src="/resource/admin.jpg" alt="user avatar">
          <span>${name}</span>
      `,
  });

  // Thêm sự kiện click để gọi ToggleItem
  $item.on("click", () => {
    chooseUser(id, name);
  });

  // Thêm vào danh sách popup
  $(".popup-list").append($item);
}

function chooseUser(id, name) {
  if (userHeaderID === id) {
    removeUser(id);
    return;
  }
  switchUser(id, name);
}

async function removeUser(id) {
  let $item = $(".popup-list").find(`[item-id="${id}"]`);
  $item.removeClass("choose");
  $PopupHeader.html("");
  userHeaderID = 0;
}

async function switchUser(id, name) {
  const $item_choosen = $(".popup-list").find(".choose");
  if (userHeaderID !== 0) {
    $item_choosen.removeClass("choose");
    $PopupHeader.html("");
  }
  const $item = $(".popup-list").find(`[item-id="${id}"]`);
  $item.addClass("choose");
  userHeaderID = id;
  addUserHeader(id, name);
}

async function addUserHeader(id, name) {
  let $item = $("<div>", {
    class: "popup-header-item",
    "header-item-id": id,
    html: `
        <span class="popup-header-item-name">${name}</span>
        <button>
            <span class="material-icons">close</span>
        </button>     
    `,
  });
  $item.find("button").on("click", () => removeUser(id));
  $PopupHeader.append($item);
}
