(function () {
  var toggle = document.querySelector(".toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      document.body.classList.toggle("is-nav-open");
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
