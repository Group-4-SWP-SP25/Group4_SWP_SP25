$(function () {
  $(".btn-detail").click(function (e) {
    e.preventDefault();
    $(".order-detail").slideToggle(500);

    $(this).find(".fa-see").toggleClass("active");

    const currentText = $(this).text().trim();
    if (currentText.includes("See detail")) {
      $(this).contents().first().replaceWith("Collapse ");
    } else {
      $(this).contents().first().replaceWith("See detail ");
    }

    e.stopPropagation();
  });
});

$(document).ready(function () {
  $(".btn-del").click(function () {
    $(".del-window").toggleClass("hidden");
    $(".overlay").toggleClass("hidden");
    $(".del-window").fadeIn(200).addClass("show");
    $("body").addClass("no-scroll");
  });

  $(".btn-submit button").on("click", function () {
    if ($(this).text() === "Yes") {
      //  Fetch
    }
    $(".del-window").removeClass("show").fadeOut(200);
    $(".overlay").toggleClass("hidden");
    $("body").removeClass("no-scroll");
  });

  $(".overlay").click(function () {
    $(".del-window").removeClass("show").fadeOut(200);
    $(".overlay").toggleClass("hidden");
    $("body").removeClass("no-scroll");
  });
});
