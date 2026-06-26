(function () {

  // ======================
  // CONFIG: PAGE RULES
  // ======================
  const ENTITY_LINK_RULES = {

    stats: {
      global: [
        "/players.html",
        "/matchups.html",
        "/teams.html",
        "/tool/"
      ],
      players: 2,
      matchups: 1
    },

    strategy: {
      global: [
        "/players.html",
        "/matchups.html",
        "/teams.html",
        "/tool/"
      ],
      players: 1,
      matchups: 1
    },

    positions: {
      global: [
        "/players.html",
        "/matchups.html",
        "/teams.html",
        "/tool/"
      ],
      players: 3,
      matchups: 1
    },

    matchups: {
      global: [
        "/players.html",
        "/teams.html",
        "/tool/"
      ],
      players: 2,
      teams: 1
    },

    academy: {
      global: [
        "/players.html",
        "/matchups.html",
        "/teams.html",
        "/tool/",
        "/research.html"
      ],
      players: 1,
      matchups: 1
    }
  };

  // ======================
  // DETECT PAGE TYPE
  // ======================
  function getPageType() {
    const path = window.location.pathname;

    if (path.includes("/positions/")) return "positions";
    if (path.includes("/academy")) return "academy";
    if (path.includes("/matchups")) return "matchups";
    if (path.includes("/strategy")) return "strategy";
    if (path.includes("/research") || path.includes(".html")) return "stats";

    return "stats";
  }

  // ======================
  // RENDER LINKS
  // ======================
  function renderLinks() {

    const pageType = getPageType();
    const rules = ENTITY_LINK_RULES[pageType];

    if (!rules) return;

    const container = document.getElementById("entity-links");
    if (!container) return;

    // ======================
    // SMART LABEL MAP
    // ======================
    const LABELS = {
      "/players.html": {
        title: "Players Hub",
        desc: "Explore NFL player projections, usage, and trends.",
        cta: "View Players →"
      },
      "/matchups.html": {
        title: "Matchups Hub",
        desc: "Break down defensive matchups and game environments.",
        cta: "View Matchups →"
      },
      "/teams.html": {
        title: "Teams Hub",
        desc: "Analyze team-level efficiency and performance trends.",
        cta: "View Teams →"
      },
      "/tool/": {
        title: "Open PlayMaker",
        desc: "Run full prop analysis using PlayMaker models.",
        cta: "Launch Tool →"
      },
      "/research.html": {
        title: "Research Hub",
        desc: "Explore all NFL stat, strategy, and intelligence guides.",
        cta: "View Research →"
      }
    };

    // ======================
    // BUILD HTML
    // ======================
    let html = `
    <section class="hq-section hq-section-alt">
      <div class="section-header">
        <h3>Where This Connects in PlayMaker</h3>
        <p>Related systems and tools for deeper analysis</p>
      </div>

      <div class="stack-grid">
  `;

    rules.global.forEach(link => {

      const data = LABELS[link] || {
        title: link.replace("/", "").replace(".html", "").toUpperCase(),
        desc: "Navigate to related PlayMaker section.",
        cta: "Open →"
      };

      html += `
      <div class="stack-card">
        <h4>${data.title}</h4>
        <p>${data.desc}</p>
        <a href="${link}">${data.cta}</a>
      </div>
    `;
    });

    html += `
      </div>
    </section>
  `;

    container.innerHTML = html;
  }

  document.addEventListener("DOMContentLoaded", renderLinks);

})();