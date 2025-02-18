$(document).on("keydown", async function (e) {
  if (e.key === "Enter") {
    deleteAnOrder();
  }
  if ($(".del-window").hasClass("show")) {
    showHideConfimationDialog();
  }
});
