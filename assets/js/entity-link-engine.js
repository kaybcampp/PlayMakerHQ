(function () {

  const GLOBAL_LINKS = [
    "/",
    "/players.html",
    "/matchups.html",
    "/teams.html",
    "/research.html",
    "/results.html",
    "/pricing.html",
    "/tool/"
  ];

  const ENTITY_LINK_RULES = {
    home: { global: GLOBAL_LINKS },
    stats: { global: GLOBAL_LINKS },
    strategy: { global: GLOBAL_LINKS },
    positions: { global: GLOBAL_LINKS },
    matchups: { global: GLOBAL_LINKS },
    academy: { global: GLOBAL_LINKS }
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

  const LABELS = {
    "/": "Home",
    "/players.html": "Players",
    "/matchups.html": "Matchups",
    "/teams.html": "Teams",
    "/research.html": "Research",
    "/results.html": "Results",
    "/pricing.html": "Pro",
    "/tool/": "Tool"
  };

  function normalize(path) {
    let clean = path
      .toLowerCase()
      .split("?")[0]
      .replace(/\/$/, "");

    if (clean === "" || clean === "/index.html") return "/";
    return clean;
  }

  const currentPath = normalize(window.location.pathname);

  function isActive(link) {
    const normalizedLink = normalize(link);

    if (normalizedLink === "/tool") {
      return currentPath === "/tool" || currentPath.startsWith("/tool/");
    }

    return currentPath === normalizedLink;
  }

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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderLinks);
  } else {
    renderLinks();
  }

})();