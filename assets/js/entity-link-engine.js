(function () {

  const ENTITY_LINK_RULES = {

    home: {
      global: [
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

  // ======================
  // PAGE TYPE DETECTION
  // ======================
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
  // NAV LABELS
  // ======================
  const LABELS = {

    "/players.html": "Players",
    "/matchups.html": "Matchups",
    "/teams.html": "Teams",
    "/research.html": "Research",
    "/pricing.html": "Pro",
    "/tool/": "Tool"

  };

  // ======================
  // NORMALIZE PATHS SAFELY
  // ======================
  function normalize(path) {
    return path
      .toLowerCase()
      .split("?")[0]
      .replace(/\/$/, ""); // remove trailing slash
  }

  const currentPath = normalize(window.location.pathname);

  function isActive(link) {
    return currentPath === normalize(link);
  }

  // ======================
  // RENDER
  // ======================
  function renderLinks() {

    const rules = ENTITY_LINK_RULES[getPageType()];
    const container = document.getElementById("entity-links");

    if (!container || !rules) return;

    let html = `
      <section class="entity-nav-bar">

        <div class="entity-brand">

  <a href="/" class="entity-brand-link">

    <img
      src="/assets/images/logo.png"
      alt="PlayMaker Prime Logo"
      class="entity-logo"
    >

    <span>PlayMaker Prime</span>

  </a>

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