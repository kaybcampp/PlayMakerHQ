(function () {

  const ENTITY_LINK_RULES = {

    home: {
      global: [
        "/",   // 👈 HOME ADDED
        "/players.html",
        "/matchups.html",
        "/teams.html",
        "/research.html",
        "/pricing.html",
        "/tool/"
      ]
    },

    stats: {
      global: [
        "/players.html",
        "/matchups.html",
        "/teams.html",
        "/research.html",
        "/pricing.html",
        "/tool/"
      ]
    },

    strategy: {
      global: [
        "/players.html",
        "/matchups.html",
        "/teams.html",
        "/research.html",
        "/pricing.html",
        "/tool/"
      ]
    },

    positions: {
      global: [
        "/players.html",
        "/matchups.html",
        "/teams.html",
        "/research.html",
        "/pricing.html",
        "/tool/"
      ]
    },

    matchups: {
      global: [
        "/players.html",
        "/teams.html",
        "/research.html",
        "/pricing.html",
        "/tool/"
      ]
    },

    academy: {
      global: [
        "/players.html",
        "/matchups.html",
        "/teams.html",
        "/research.html",
        "/pricing.html",
        "/tool/"
      ]
    }

  };

  function getPageType() {
    const path = window.location.pathname.toLowerCase().split("?")[0];

    if (path === "/" || path.includes("index")) return "home";
    if (path.includes("/positions/")) return "positions";
    if (path.includes("/academy")) return "academy";
    if (path.includes("/matchups")) return "matchups";
    if (path.includes("/strategy")) return "strategy";

    return "stats";
  }

  // ======================
  // LABELS (NOW INCLUDES HOME)
  // ======================
  const LABELS = {

    "/": "Home",   // 👈 ADDED

    "/players.html": "Players",
    "/matchups.html": "Matchups",
    "/teams.html": "Teams",
    "/research.html": "Research",
    "/pricing.html": "Pro",
    "/tool/": "Tool"

  };

  function normalize(path) {
    return path.toLowerCase().split("?")[0];
  }

  const currentPath = normalize(window.location.pathname);

  function isActive(link) {
    return currentPath === normalize(link);
  }

  function renderLinks() {

    const rules = ENTITY_LINK_RULES[getPageType()];
    const container = document.getElementById("entity-links");

    if (!container || !rules) return;

    let html = `
      <section class="entity-nav-bar">

        <div class="entity-brand">
          PlayMaker Prime
        </div>

        <div class="entity-links">
    `;

    rules.global.forEach(link => {

      const label = LABELS[link];

      if (!label) return;

      const activeClass = isActive(link) ? "active" : "";

      html += `
        <a href="${link}" class="entity-link ${activeClass}">
          ${label}
        </a>
      `;
    });

    html += `
        </div>

      </section>
    `;

    container.innerHTML = html;
  }

  function init() {
    renderLinks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();