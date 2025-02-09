$(document).on("keydown", function (e) {
  if (e.key === "Enter") {
    if ($(".del-window").hasClass("show")) {
      $(".del-window").removeClass("show").fadeOut(200);
      $(".overlay").toggleClass("hidden");
      $("body").removeClass("no-scroll");
    }
  }
});
