(function () {
  var toggles = document.querySelectorAll(".toggle");
  if (toggles.length) {
    toggles.forEach(function (toggle) {
      toggle.addEventListener("click", function () {
        document.body.classList.toggle("is-nav-open");
        document.body.classList.toggle("is-nav-collapsed");
      });
    });
  }

  var links = document.querySelectorAll(".nav-list a");
  var path = window.location.pathname;
  if (path.endsWith("/")) {
    path = path + "index.html";
  }

  links.forEach(function (link) {
    var href = link.getAttribute("href");
    if (!href || href.startsWith("http")) {
      return;
    }
    if (path.endsWith(href)) {
      link.classList.add("is-active");
    }
  });
})();
