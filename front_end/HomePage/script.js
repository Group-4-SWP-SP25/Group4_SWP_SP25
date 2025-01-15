document.addEventListener('DOMContentLoaded', function() {
    var aboutUsDiv = document.getElementById('about-us');

    function checkVisible(element) {
        var rect = element.getBoundingClientRect();
        var viewHeight = window.innerHeight || document.documentElement.clientHeight;
        return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
    }

    function onScroll() {
        if (checkVisible(aboutUsDiv)) {
            aboutUsDiv.classList.add('visible');
        } else {
            aboutUsDiv.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', onScroll);
    onScroll();
});
