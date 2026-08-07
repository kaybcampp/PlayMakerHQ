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

  const FEEDBACK_FORM_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSdQvjfVwfVHN_r2SJcmVIa7rwRW4WP2Hlm1UvjQ0in5jeucgw/viewform?usp=dialog";

  function getPageType() {
    const path = window.location.pathname
      .toLowerCase()
      .split("?")[0];

    if (path === "/" || path.includes("index")) return "home";
    if (path.includes("/positions/")) return "positions";
    if (path.includes("/academy")) return "academy";
    if (path.includes("/matchups")) return "matchups";
    if (path.includes("/strategy")) return "strategy";

    return "stats";
  }

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
      return (
        currentPath === "/tool" ||
        currentPath.startsWith("/tool/")
      );
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
        <a
          href="${link}"
          class="entity-link ${activeClass}"
        >
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

  function renderFeedbackButton() {
    /*
      Prevent duplicate buttons if this script is accidentally
      loaded more than once on a page.
    */
    if (document.querySelector(".feedback-float")) {
      return;
    }

    const feedbackButton = document.createElement("a");

    feedbackButton.href = FEEDBACK_FORM_URL;
    feedbackButton.className = "feedback-float";
    feedbackButton.target = "_blank";
    feedbackButton.rel = "noopener noreferrer";

    feedbackButton.setAttribute(
      "aria-label",
      "Send feedback about PlayMaker Prime"
    );

    feedbackButton.innerHTML = `
      <span
        class="feedback-float-icon"
        aria-hidden="true"
      >
        💬
      </span>

      <span class="feedback-float-text">
        Feedback
      </span>
    `;

    document.body.appendChild(feedbackButton);
  }

  function injectOrganizationSchema() {
    /*
      Prevent duplicate Organization schema
      if this script is loaded more than once.
    */
    if (
      document.querySelector(
        'script[data-playmaker-organization-schema]'
      )
    ) {
      return;
    }

    const schema = {
      "@context": "https://schema.org",
      "@type": "Organization",

      "@id":
        "https://playmakerprime.com/#organization",

      name:
        "PlayMaker Prime",

      alternateName:
        "PlayMaker",

      url:
        "https://playmakerprime.com/",

      logo: {
        "@type": "ImageObject",
        url:
          "https://playmakerprime.com/assets/images/logo.png"
      },

      description:
        "PlayMaker Prime is an NFL research and sports forecasting platform for player props, matchup intelligence, defensive context, injuries, weather, trends, and data-driven analysis.",

      founder: {
        "@type": "Person",
        "@id": "https://playmakerprime.com/#founder",
        name: "Kayb Campbell"
      },

      sameAs: [
        "https://x.com/playmakerprime",
        "https://www.tiktok.com/@playmakerprimehq"
      ]
    };

    const script =
      document.createElement("script");

    script.type =
      "application/ld+json";

    script.dataset.playmakerOrganizationSchema =
      "true";

    script.textContent =
      JSON.stringify(schema);

    document.head.appendChild(script);
  }

  function injectSoftwareApplicationSchema() {
    /*
      SoftwareApplication schema belongs on pages
      that represent or describe the PlayMaker product.
    */
    const eligiblePaths = [
      "/",
      "/pricing.html"
    ];

    if (!eligiblePaths.includes(currentPath)) {
      return;
    }

    /*
      Prevent duplicate schema if this script
      is accidentally loaded more than once.
    */
    if (
      document.querySelector(
        'script[data-playmaker-software-schema]'
      )
    ) {
      return;
    }

    const schema = {
      "@context": "https://schema.org",

      "@type":
        "SoftwareApplication",

      "@id":
        "https://playmakerprime.com/#software",

      name:
        "PlayMaker Prime",

      alternateName:
        "PlayMaker",

      url:
        "https://playmakerprime.com/",

      applicationCategory:
        "SportsApplication",

      operatingSystem:
        "Web",

      description:
        "PlayMaker Prime is an NFL research and sports forecasting web application that combines player trends, matchup intelligence, defensive context, injuries, weather, historical performance, and prop research in one platform.",

      image:
        "https://playmakerprime.com/assets/images/playmaker-share.png",

      publisher: {
        "@id":
          "https://playmakerprime.com/#organization"
      },

      creator: {
        "@id":
          "https://playmakerprime.com/#founder"
      },

      featureList: [
        "NFL player prop research",
        "Player performance trends",
        "NFL matchup intelligence",
        "Defensive matchup analysis",
        "Weather context",
        "Injury context",
        "Historical performance tracking",
        "Player intelligence reports",
        "NFL team research",
        "Data-driven prop projections"
      ]
    };

    const script =
      document.createElement(
        "script"
      );

    script.type =
      "application/ld+json";

    script.dataset.playmakerSoftwareSchema =
      "true";

    script.textContent =
      JSON.stringify(schema);

    document.head.appendChild(
      script
    );
  }

  function injectWebsiteSchema() {
    /*
      Prevent duplicate WebSite schema
      if this script is loaded more than once.
    */
    if (
      document.querySelector(
        'script[data-playmaker-website-schema]'
      )
    ) {
      return;
    }

    const schema = {
      "@context": "https://schema.org",

      "@type":
        "WebSite",

      "@id":
        "https://playmakerprime.com/#website",

      url:
        "https://playmakerprime.com/",

      name:
        "PlayMaker Prime",

      alternateName:
        "PlayMaker",

      description:
        "NFL player prop research, matchup intelligence, player trends, weather, injuries, defensive analysis, and the PlayMaker prediction platform.",

      publisher: {
        "@id":
          "https://playmakerprime.com/#organization"
      },

      inLanguage:
        "en-US"
    };

    const script =
      document.createElement("script");

    script.type =
      "application/ld+json";

    script.dataset.playmakerWebsiteSchema =
      "true";

    script.textContent =
      JSON.stringify(schema);

    document.head.appendChild(script);
  }

  function initializeGlobalUI() {
    renderLinks();
    renderFeedbackButton();

    injectOrganizationSchema();
    injectWebsiteSchema();
    injectSoftwareApplicationSchema();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeGlobalUI
    );
  } else {
    initializeGlobalUI();
  }

})();