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
  // DETECT PAGE TYPE
  // ======================
  function getPageType() {

    const path = window.location.pathname.toLowerCase();

    if (path.includes("/positions/")) return "positions";
    if (path.includes("/academy")) return "academy";
    if (path.includes("/matchups")) return "matchups";
    if (path.includes("/strategy")) return "strategy";

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
    // SMART LABELS
    // ======================
    const LABELS = {

      "/players.html": {
        title: "Players Hub",
        desc: "Browse every NFL player with matchup context, trends, historical results, and prop research.",
        cta: "View Players →"
      },

      "/matchups.html": {
        title: "Matchups Hub",
        desc: "Explore every NFL matchup with defensive analysis, trends, featured players, and prop intelligence.",
        cta: "View Matchups →"
      },

      "/teams.html": {
        title: "Teams Hub",
        desc: "Compare every NFL team with offensive tendencies, defensive rankings, and season insights.",
        cta: "View Teams →"
      },

      "/research.html": {
        title: "Research Hub",
        desc: "Learn the metrics behind PlayMaker including EPA, Air Yards, Success Rate, Target Share, and more.",
        cta: "Explore Research →"
      },

      "/pricing.html": {
        title: "PlayMaker Pro",
        desc: "Unlock the complete prediction engine, matchup intelligence, and premium research tools.",
        cta: "View Pricing →"
      },

      "/tool/": {
        title: "Launch PlayMaker",
        desc: "Run player props through the full PlayMaker Prime prediction engine.",
        cta: "Open Tool →"
      }

    };

    let html = `
      <section class="hq-section hq-section-alt">

        <div class="section-header">
          <h3>Continue Exploring PlayMaker</h3>
          <p>Related tools, research, and intelligence across the PlayMaker Prime platform.</p>
        </div>

        <div class="stack-grid">
    `;

    rules.global.forEach(link => {

      const data = LABELS[link];

      if (!data) return;

      html += `
        <div class="stack-card">

          <h4>${data.title}</h4>

          <p>${data.desc}</p>

          <a href="${link}">
            ${data.cta}
          </a>

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