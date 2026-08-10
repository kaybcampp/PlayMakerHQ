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

  function getBreadcrumbPageName() {
    /*
      Prefer the visible H1 because it usually contains
      the cleanest human-readable page name.
    */
    const h1 =
      document.querySelector("h1");

    if (h1?.textContent?.trim()) {
      return h1.textContent
        .replace(/\s+/g, " ")
        .trim();
    }

    /*
      Fall back to the document title.
      Remove the PlayMaker branding portion.
    */
    const title =
      document.title
        .split("|")[0]
        .split("—")[0]
        .trim();

    if (title) {
      return title;
    }

    /*
      Final fallback: derive a readable name
      from the final URL segment.
    */
    const segment =
      currentPath
        .split("/")
        .filter(Boolean)
        .pop() || "Page";

    return segment
      .replace(/\.html$/i, "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, char =>
        char.toUpperCase()
      );
  }

  function getBreadcrumbTrail() {
    /*
      Homepage doesn't need breadcrumb markup.
    */
    if (currentPath === "/") {
      return [];
    }

    const currentPageName =
      getBreadcrumbPageName();

    const currentUrl =
      `https://playmakerprime.com${currentPath}`;

    const trail = [
      {
        name: "Home",
        url:
          "https://playmakerprime.com/"
      }
    ];

    /*
      PLAYER PAGES
      Home → Players → Player
    */
    if (
      currentPath.startsWith("/players/")
    ) {
      trail.push(
        {
          name: "Players",
          url:
            "https://playmakerprime.com/players.html"
        },
        {
          name: currentPageName,
          url: currentUrl
        }
      );

      return trail;
    }

    /*
      PLAYER HUB
      Home → Players
    */
    if (
      currentPath === "/players.html"
    ) {
      trail.push({
        name: "Players",
        url:
          "https://playmakerprime.com/players.html"
      });

      return trail;
    }

    /*
      TEAM PAGES
      Home → Teams → Team
    */
    if (
      currentPath.startsWith("/teams/")
    ) {
      trail.push(
        {
          name: "Teams",
          url:
            "https://playmakerprime.com/teams.html"
        },
        {
          name: currentPageName,
          url: currentUrl
        }
      );

      return trail;
    }

    /*
      TEAM HUB
      Home → Teams
    */
    if (
      currentPath === "/teams.html"
    ) {
      trail.push({
        name: "Teams",
        url:
          "https://playmakerprime.com/teams.html"
      });

      return trail;
    }

    /*
      MATCHUP PAGES
      Home → Matchups → Matchup
    */
    if (
      currentPath.startsWith(
        "/matchups/"
      )
    ) {
      trail.push(
        {
          name: "Matchups",
          url:
            "https://playmakerprime.com/matchups.html"
        },
        {
          name: currentPageName,
          url: currentUrl
        }
      );

      return trail;
    }

    /*
      MATCHUP HUB
      Home → Matchups
    */
    if (
      currentPath === "/matchups.html"
    ) {
      trail.push({
        name: "Matchups",
        url:
          "https://playmakerprime.com/matchups.html"
      });

      return trail;
    }

    /*
      RESEARCH POSITION PAGES
      Home → Research → Positions → Page
    */
    if (
      currentPath.startsWith(
        "/research/positions/"
      )
    ) {
      trail.push(
        {
          name: "Research",
          url:
            "https://playmakerprime.com/research.html"
        },
        {
          name: "Position Intelligence",
          url:
            "https://playmakerprime.com/research/positions/"
        },
        {
          name: currentPageName,
          url: currentUrl
        }
      );

      return trail;
    }

    /*
      GENERAL RESEARCH PAGES
      Home → Research → Page
    */
    if (
      currentPath.startsWith(
        "/research/"
      )
    ) {
      trail.push(
        {
          name: "Research",
          url:
            "https://playmakerprime.com/research.html"
        },
        {
          name: currentPageName,
          url: currentUrl
        }
      );

      return trail;
    }

    /*
      RESEARCH HUB
      Home → Research
    */
    if (
      currentPath === "/research.html"
    ) {
      trail.push({
        name: "Research",
        url:
          "https://playmakerprime.com/research.html"
      });

      return trail;
    }

    /*
      ACADEMY PAGES
      Home → Academy → Page
    */
    if (
      currentPath.startsWith(
        "/academy/"
      )
    ) {
      trail.push(
        {
          name: "Academy",
          url:
            "https://playmakerprime.com/academy/"
        },
        {
          name: currentPageName,
          url: currentUrl
        }
      );

      return trail;
    }

    /*
      RESULTS
    */
    if (
      currentPath === "/results.html"
    ) {
      trail.push({
        name: "Results",
        url:
          "https://playmakerprime.com/results.html"
      });

      return trail;
    }

    /*
      PRICING
    */
    if (
      currentPath === "/pricing.html"
    ) {
      trail.push({
        name: "PlayMaker Pro",
        url:
          "https://playmakerprime.com/pricing.html"
      });

      return trail;
    }

    /*
      Unknown public page.
      Keep a simple:
      Home → Current Page
    */
    trail.push({
      name: currentPageName,
      url: currentUrl
    });

    return trail;
  }

  function injectBreadcrumbSchema() {
    /*
      Prevent duplicate BreadcrumbList schema.
    */
    if (
      document.querySelector(
        'script[data-playmaker-breadcrumb-schema]'
      )
    ) {
      return;
    }

    const trail =
      getBreadcrumbTrail();

    /*
      Homepage returns no trail.
    */
    if (trail.length < 2) {
      return;
    }

    const schema = {
      "@context":
        "https://schema.org",

      "@type":
        "BreadcrumbList",

      "@id":
        `${window.location.origin}${currentPath}#breadcrumb`,

      itemListElement:
        trail.map(
          (item, index) => ({
            "@type":
              "ListItem",

            position:
              index + 1,

            name:
              item.name,

            item:
              item.url
          })
        )
    };

    const script =
      document.createElement(
        "script"
      );

    script.type =
      "application/ld+json";

    script.dataset.playmakerBreadcrumbSchema =
      "true";

    script.textContent =
      JSON.stringify(schema);

    document.head.appendChild(
      script
    );
  }

  function initializeGlobalUI() {
    renderLinks();
    renderFeedbackButton();

    injectOrganizationSchema();
    injectWebsiteSchema();
    injectSoftwareApplicationSchema();
    injectBreadcrumbSchema();
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