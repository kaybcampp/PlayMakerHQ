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

        "@id":
          "https://playmakerprime.com/#founder",

        name:
          "Kayb Campbell",

        jobTitle:
          "Founder & Developer",

        url:
          "https://playmakerprime.com/#founder",

        worksFor: {
          "@id":
            "https://playmakerprime.com/#organization"
        },

        knowsAbout: [
          "NFL analytics",
          "Sports data analysis",
          "Web application development",
          "Player prop research",
          "Football statistics"
        ]
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

  function injectFounderSchema() {

    /*
      Prevent duplicate founder schema
    */
    if (
      document.querySelector(
        'script[data-playmaker-founder-schema]'
      )
    ) {
      return;
    }


    const schema = {

      "@context":
        "https://schema.org",

      "@type":
        "Person",

      "@id":
        "https://playmakerprime.com/#founder",


      name:
        "Kayb Campbell",


      jobTitle:
        "Founder & Developer",


      description:
        "Kayb Campbell is the founder and developer of PlayMaker Prime, an NFL research and sports analytics platform focused on player trends, matchup intelligence, and data-driven football analysis.",


      worksFor: {

        "@id":
          "https://playmakerprime.com/#organization"

      },


      founder: {

        "@id":
          "https://playmakerprime.com/#organization"

      },


      knowsAbout: [

        "NFL analytics",

        "Sports forecasting",

        "Football research",

        "Full-stack web development",

        "Data-driven applications"

      ],


      sameAs: [

        "https://x.com/playmakerprime",

        "https://www.tiktok.com/@playmakerprimehq"

      ]

    };


    const script =
      document.createElement(
        "script"
      );


    script.type =
      "application/ld+json";


    script.dataset.playmakerFounderSchema =
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
      currentPath.startsWith("/matchups/")
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
      POSITION INTELLIGENCE HUB
      Home → Research → Position Intelligence
    */
    if (
      currentPath ===
      "/research/positions" ||
      currentPath ===
      "/research/positions/index.html"
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
        }

      );

      return trail;

    }



    /*
      POSITION INTELLIGENCE ARTICLES
      Home → Research → Position Intelligence → Page
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
      TARGET SHARE LEADERS
      Home → Research → Target Share Leaders
    */
    if (
      currentPath ===
      "/research/target-share-leaders.html"
    ) {

      trail.push(

        {
          name: "Research",
          url:
            "https://playmakerprime.com/research.html"
        },

        {
          name: "Target Share Leaders",
          url:
            "https://playmakerprime.com/research/target-share-leaders.html"
        }

      );

      return trail;

    }

    /*
      PLAYMAKER ACADEMY HUB
      Home → Research → PlayMaker Academy
    */
    if (
      currentPath ===
      "/research/academy.html"
    ) {

      trail.push(

        {
          name: "Research",
          url:
            "https://playmakerprime.com/research.html"
        },

        {
          name: "PlayMaker Academy",
          url:
            "https://playmakerprime.com/research/academy.html"
        }

      );

      return trail;
    }


    /*
      ACADEMY LESSONS
      Home → Research → PlayMaker Academy → Page
    
      Example:
      /academy/ride-vs-fade.html
    */
    if (
      currentPath.startsWith(
        "/academy/"
      )
    ) {

      trail.push(

        {
          name: "Research",
          url:
            "https://playmakerprime.com/research.html"
        },

        {
          name: "PlayMaker Academy",
          url:
            "https://playmakerprime.com/research/academy.html"
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
      UNKNOWN PUBLIC PAGE
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
      Homepage returns no breadcrumb.
    */
    if (
      trail.length < 2
    ) {
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

  function injectFAQSchema() {
    /*
      Prevent duplicate FAQ schema if the
      global engine is accidentally loaded twice.
    */
    if (
      document.querySelector(
        'script[data-playmaker-faq-schema]'
      )
    ) {
      return;
    }

    /*
      Look for visible FAQ-style details blocks.
  
      We specifically require a <summary> because
      that represents the FAQ question.
    */
    const detailsElements = [
      ...document.querySelectorAll(
        "details.faq-card, .faq-grid details"
      )
    ];

    const faqItems = [];

    detailsElements.forEach(details => {
      const summary =
        details.querySelector(
          ":scope > summary"
        );

      if (!summary) {
        return;
      }

      const question =
        summary.textContent
          .replace(/\s+/g, " ")
          .trim();

      /*
        Clone the details element so we can remove
        the summary and extract only the answer.
      */
      const answerClone =
        details.cloneNode(true);

      const clonedSummary =
        answerClone.querySelector(
          ":scope > summary"
        );

      if (clonedSummary) {
        clonedSummary.remove();
      }

      const answer =
        answerClone.textContent
          .replace(/\s+/g, " ")
          .trim();

      /*
        Ignore malformed / empty FAQ entries.
      */
      if (
        !question ||
        !answer
      ) {
        return;
      }

      faqItems.push({
        "@type":
          "Question",

        name:
          question,

        acceptedAnswer: {
          "@type":
            "Answer",

          text:
            answer
        }
      });
    });

    /*
      Don't inject FAQPage schema on pages
      without real FAQ content.
    */
    if (!faqItems.length) {
      return;
    }

    const schema = {
      "@context":
        "https://schema.org",

      "@type":
        "FAQPage",

      "@id":
        `${window.location.origin}${currentPath}#faq`,

      mainEntity:
        faqItems
    };

    const script =
      document.createElement(
        "script"
      );

    script.type =
      "application/ld+json";

    script.dataset.playmakerFaqSchema =
      "true";

    script.textContent =
      JSON.stringify(schema);

    document.head.appendChild(
      script
    );
  }

  function injectArticleSchema() {
    /*
      Article schema is only for PlayMaker's
      educational research and academy content.
    */
    const isResearchArticle =
      currentPath.startsWith("/research/") &&
      currentPath !== "/research/";

    const isAcademyArticle =
      currentPath.startsWith("/academy/") &&
      currentPath !== "/academy/";

    if (
      !isResearchArticle &&
      !isAcademyArticle
    ) {
      return;
    }

    /*
      Prevent duplicate Article schema.
    */
    if (
      document.querySelector(
        'script[data-playmaker-article-schema]'
      )
    ) {
      return;
    }

    /*
      ARTICLE HEADLINE
  
      Priority:
      1. H1
      2. Page title
      3. URL-derived name
    */
    const h1Title =
      document.querySelector("h1")
        ?.textContent
        ?.replace(/\s+/g, " ")
        .trim();

    const documentTitle =
      document.title
        ?.split("|")[0]
        ?.split("—")[0]
        ?.replace(/\s+/g, " ")
        ?.trim();

    const fallbackTitle =
      currentPath
        .split("/")
        .filter(Boolean)
        .pop()
        ?.replace(/\.html$/i, "")
        ?.replace(/-/g, " ")
        ?.replace(
          /\b\w/g,
          char => char.toUpperCase()
        );

    const headline =
      h1Title ||
      documentTitle ||
      fallbackTitle;

    /*
      ARTICLE DESCRIPTION
    */
    const description =
      document.querySelector(
        'meta[name="description"]'
      )
        ?.content
        ?.trim();

    if (
      !headline ||
      !description
    ) {
      return;
    }

    /*
      Prefer the canonical URL when one exists.
  
      Otherwise use the clean current pathname.
    */
    const canonicalUrl =
      document.querySelector(
        'link[rel="canonical"]'
      )
        ?.href ||
      `https://playmakerprime.com${currentPath}`;

    /*
      Browser/server last-modified date.
    */
    let dateModified;

    const modifiedDate =
      new Date(
        document.lastModified
      );

    if (
      !Number.isNaN(
        modifiedDate.getTime()
      )
    ) {
      dateModified =
        modifiedDate.toISOString();
    }

    const schema = {
      "@context":
        "https://schema.org",

      "@type":
        "Article",

      "@id":
        `${canonicalUrl}#article`,

      headline,

      description,

      url:
        canonicalUrl,

      mainEntityOfPage: {
        "@type":
          "WebPage",

        "@id":
          canonicalUrl
      },

      author: {
        "@type":
          "Person",

        "@id":
          "https://playmakerprime.com/#founder",

        name:
          "Kayb Campbell"
      },

      publisher: {
        "@id":
          "https://playmakerprime.com/#organization"
      },

      image:
        "https://playmakerprime.com/assets/images/playmaker-share.png",

      inLanguage:
        "en-US"
    };

    if (dateModified) {
      schema.dateModified =
        dateModified;
    }

    const script =
      document.createElement(
        "script"
      );

    script.type =
      "application/ld+json";

    script.dataset.playmakerArticleSchema =
      "true";

    script.textContent =
      JSON.stringify(schema);

    document.head.appendChild(
      script
    );
  }

  function injectSportsEventSchema() {
    /*
      SportsEvent schema only belongs on
      individual dynamic matchup pages.
  
      /matchups.html is the hub and should
      not receive SportsEvent markup.
    */
    if (
      !currentPath.startsWith("/matchups/") ||
      currentPath === "/matchups/"
    ) {
      return;
    }

    /*
      Prevent duplicate SportsEvent schema.
    */
    if (
      document.querySelector(
        'script[data-playmaker-sports-event-schema]'
      )
    ) {
      return;
    }

    /*
      Matchup pages populate dynamically,
      so try to find the completed matchup data.
    */
    const pageText =
      document.body.innerText
        .replace(/\s+/g, " ")
        .trim();

    let matchupName = null;

    /*
      Prefer H1 if available.
    */
    const h1 =
      document.querySelector("h1");

    if (h1?.textContent?.trim()) {
      matchupName =
        h1.textContent
          .replace(/\s+/g, " ")
          .trim();
    }

    /*
      Fallback:
      Find the matchup title from visible text.
    */
    if (!matchupName) {

      const matchupMatch =
        pageText.match(
          /([A-Za-z .'-]+)\s+vs\s+([A-Za-z .'-]+)/i
        );

      if (matchupMatch) {
        matchupName =
          `${matchupMatch[1].trim()} vs ${matchupMatch[2].trim()}`;
      }
    }

    /*
      We expect a completed matchup H1 like:
      New England Patriots vs Seattle Seahawks
    */
    if (
      !matchupName ||
      !matchupName
        .toLowerCase()
        .includes(" vs ")
    ) {
      return;
    }

    const teams =
      matchupName
        .split(/\s+vs\.?\s+/i)
        .map(team =>
          team.trim()
        )
        .filter(Boolean);

    if (teams.length !== 2) {
      return;
    }

    /*
      Find a visible full date like:
      Thursday, September 10, 2026
    */
    const dateMatch =
      pageText.match(
        /\b(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),\s+(20\d{2})/i
      );

    if (!dateMatch) {
      return;
    }

    const monthMap = {
      january: "01",
      february: "02",
      march: "03",
      april: "04",
      may: "05",
      june: "06",
      july: "07",
      august: "08",
      september: "09",
      october: "10",
      november: "11",
      december: "12"
    };

    const month =
      monthMap[
      dateMatch[1]
        .toLowerCase()
      ];

    const day =
      String(
        dateMatch[2]
      ).padStart(
        2,
        "0"
      );

    const year =
      dateMatch[3];

    const startDate =
      `${year}-${month}-${day}`;

    /*
      Find the visible NFL week.
    */
    const weekMatch =
      pageText.match(
        /\bWeek\s+(\d{1,2})\b/i
      );

    const week =
      weekMatch
        ? Number(weekMatch[1])
        : null;

    /*
      Prefer canonical URL when available.
    */
    const canonicalUrl =
      document.querySelector(
        'link[rel="canonical"]'
      )
        ?.href ||
      `https://playmakerprime.com${currentPath}`;

    const description =
      document.querySelector(
        'meta[name="description"]'
      )
        ?.content
        ?.trim() ||
      `${matchupName} NFL matchup report and player prop research from PlayMaker Prime.`;

    const schema = {
      "@context":
        "https://schema.org",

      "@type":
        "SportsEvent",

      "@id":
        `${canonicalUrl}#sports-event`,

      name:
        matchupName,

      url:
        canonicalUrl,

      startDate,

      sport:
        "American Football",

      description,

      competitor: [
        {
          "@type":
            "SportsTeam",

          name:
            teams[0]
        },
        {
          "@type":
            "SportsTeam",

          name:
            teams[1]
        }
      ]
    };

    /*
      Schema.org does not have a dedicated
      NFL-week property, so keep the week
      as additional structured context.
    */
    if (week) {
      schema.additionalProperty = [
        {
          "@type":
            "PropertyValue",

          name:
            "NFL Week",

          value:
            week
        },
        {
          "@type":
            "PropertyValue",

          name:
            "NFL Season",

          value:
            year
        }
      ];
    }

    const script =
      document.createElement(
        "script"
      );

    script.type =
      "application/ld+json";

    script.dataset.playmakerSportsEventSchema =
      "true";

    script.textContent =
      JSON.stringify(schema);

    document.head.appendChild(
      script
    );
  }

  function injectSportsTeamSchema() {

    /*
      SportsTeam schema only belongs on
      individual team pages.
  
      Not /teams.html hub.
    */
    if (
      !currentPath.startsWith("/teams/") ||
      currentPath === "/teams/"
    ) {
      return;
    }


    /*
      Prevent duplicates.
    */
    if (
      document.querySelector(
        'script[data-playmaker-sports-team-schema]'
      )
    ) {
      return;
    }


    const pageText =
      document.body.innerText
        .replace(/\s+/g, " ")
        .trim();


    /*
      Try visible heading first.
    */
    let teamName =
      document.querySelector("h1")
        ?.textContent
        ?.replace(/\s+/g, " ")
        ?.trim();


    /*
      Fallback:
      use title if h1 missing.
    */
    if (!teamName) {

      teamName =
        document.title
          .split("|")[0]
          .split("—")[0]
          .replace(
            /NFL|Team|Intelligence|Hub/gi,
            ""
          )
          .trim();
    }


    /*
      Final URL fallback.
    */
    if (!teamName) {

      teamName =
        currentPath
          .split("/")
          .filter(Boolean)
          .pop()
          .replace(
            /-/g,
            " "
          )
          .replace(
            /\b\w/g,
            char =>
              char.toUpperCase()
          );
    }


    if (!teamName) {
      return;
    }


    const canonicalUrl =
      document.querySelector(
        'link[rel="canonical"]'
      )
        ?.href ||
      `https://playmakerprime.com${currentPath}`;


    /*
      Find logo if team page exposes one.
    */
    const image =
      document.querySelector(
        "img"
      )?.src ||
      "https://playmakerprime.com/assets/images/logo.png";


    const schema = {

      "@context":
        "https://schema.org",

      "@type":
        "SportsTeam",

      "@id":
        `${canonicalUrl}#team`,

      name:
        teamName,

      url:
        canonicalUrl,

      sport:
        "American Football",

      logo:
        image,

      memberOf: {

        "@type":
          "SportsOrganization",

        name:
          "National Football League"

      },

      publisher: {

        "@id":
          "https://playmakerprime.com/#organization"

      }

    };


    const script =
      document.createElement(
        "script"
      );


    script.type =
      "application/ld+json";


    script.dataset.playmakerSportsTeamSchema =
      "true";


    script.textContent =
      JSON.stringify(schema);


    document.head.appendChild(script);

  }

  async function injectPlayerProfileSchema() {
    /*
      Player schema only belongs on
      individual player pages.
    */
    if (
      !currentPath.startsWith("/players/") ||
      currentPath === "/players/"
    ) {
      return;
    }

    /*
      Prevent duplicate schema.
    */
    if (
      document.querySelector(
        'script[data-playmaker-player-profile-schema]'
      )
    ) {
      return;
    }

    const urlSlug =
      currentPath
        .split("/")
        .filter(Boolean)
        .pop();

    if (!urlSlug) {
      return;
    }

    /*
      All NFL team data files used by PlayMaker.
    */
    const teamCodes = [
      "ARI",
      "ATL",
      "BAL",
      "BUF",
      "CAR",
      "CHI",
      "CIN",
      "CLE",
      "DAL",
      "DEN",
      "DET",
      "GB",
      "HOU",
      "IND",
      "JAX",
      "KC",
      "LV",
      "LAC",
      "LAR",
      "MIA",
      "MIN",
      "NE",
      "NO",
      "NYG",
      "NYJ",
      "PHI",
      "PIT",
      "SF",
      "SEA",
      "TB",
      "TEN",
      "WSH"
    ];

    const teamNames = {
      ARI: "Arizona Cardinals",
      ATL: "Atlanta Falcons",
      BAL: "Baltimore Ravens",
      BUF: "Buffalo Bills",
      CAR: "Carolina Panthers",
      CHI: "Chicago Bears",
      CIN: "Cincinnati Bengals",
      CLE: "Cleveland Browns",
      DAL: "Dallas Cowboys",
      DEN: "Denver Broncos",
      DET: "Detroit Lions",
      GB: "Green Bay Packers",
      HOU: "Houston Texans",
      IND: "Indianapolis Colts",
      JAX: "Jacksonville Jaguars",
      KC: "Kansas City Chiefs",
      LV: "Las Vegas Raiders",
      LAC: "Los Angeles Chargers",
      LAR: "Los Angeles Rams",
      MIA: "Miami Dolphins",
      MIN: "Minnesota Vikings",
      NE: "New England Patriots",
      NO: "New Orleans Saints",
      NYG: "New York Giants",
      NYJ: "New York Jets",
      PHI: "Philadelphia Eagles",
      PIT: "Pittsburgh Steelers",
      SF: "San Francisco 49ers",
      SEA: "Seattle Seahawks",
      TB: "Tampa Bay Buccaneers",
      TEN: "Tennessee Titans",
      WSH: "Washington Commanders"
    };

    const positionNames = {
      QB: "Quarterback",
      RB: "Running Back",
      WR: "Wide Receiver",
      TE: "Tight End"
    };

    let matchedPlayer = null;
    let matchedTeamCode = null;

    /*
      Search the actual PlayMaker player datasets.
  
      These files are already loaded by the player
      experience, so browser caching should make
      these requests inexpensive.
    */
    for (const teamCode of teamCodes) {
      try {
        const response =
          await fetch(
            `/assets/data/players/players-${teamCode}.json`
          );

        if (!response.ok) {
          continue;
        }

        const players =
          await response.json();

        if (!Array.isArray(players)) {
          continue;
        }

        const match =
          players.find(player => {
            /*
              Use PlayMaker's existing slug function
              when available.
            */
            if (
              typeof window.playerSlug ===
              "function"
            ) {
              return (
                window.playerSlug(
                  player.name
                ) === urlSlug
              );
            }

            /*
              Fallback slug builder.
            */
            const generatedSlug =
              String(player.name || "")
                .toLowerCase()
                .replace(/[.'’]/g, "")
                .replace(
                  /[^a-z0-9\s-]/g,
                  ""
                )
                .trim()
                .replace(/\s+/g, "-");

            return (
              generatedSlug === urlSlug
            );
          });

        if (match) {
          matchedPlayer = match;
          matchedTeamCode = teamCode;
          break;
        }
      } catch (error) {
        console.warn(
          `Player schema lookup failed for ${teamCode}:`,
          error
        );
      }
    }

    if (!matchedPlayer) {
      return;
    }

    const canonicalUrl =
      document.querySelector(
        'link[rel="canonical"]'
      )
        ?.href ||
      `https://playmakerprime.com${currentPath}`;

    const fullPosition =
      positionNames[
      String(
        matchedPlayer.position || ""
      ).toUpperCase()
      ] ||
      matchedPlayer.position ||
      "NFL Player";

    const teamName =
      teamNames[matchedTeamCode];

    /*
      ProfilePage describes the page itself.
      Person describes the NFL player.
    */
    const schema = {
      "@context":
        "https://schema.org",

      "@type":
        "ProfilePage",

      "@id":
        `${canonicalUrl}#profile`,

      url:
        canonicalUrl,

      name:
        `${matchedPlayer.name} NFL Player Intelligence Report`,

      mainEntity: {
        "@type":
          "Person",

        "@id":
          `${canonicalUrl}#person`,

        name:
          matchedPlayer.name,

        jobTitle:
          fullPosition,

        url:
          canonicalUrl
      }
    };

    if (matchedPlayer.image) {
      schema.mainEntity.image =
        matchedPlayer.image;
    }

    if (teamName) {
      schema.mainEntity.memberOf = {
        "@type":
          "SportsTeam",

        name:
          teamName
      };
    }

    const script =
      document.createElement(
        "script"
      );

    script.type =
      "application/ld+json";

    script.dataset.playmakerPlayerProfileSchema =
      "true";

    script.textContent =
      JSON.stringify(schema);

    document.head.appendChild(
      script
    );
  }

  function initializeSportsEventSchema() {
    /*
      Only watch dynamic matchup pages.
    */
    if (
      !currentPath.startsWith("/matchups/")
    ) {
      return;
    }

    /*
      Try immediately in case matchup
      data has already rendered.
    */
    injectSportsEventSchema();

    if (
      document.querySelector(
        'script[data-playmaker-sports-event-schema]'
      )
    ) {
      return;
    }

    /*
      Matchup data may load after DOMContentLoaded.
      Watch until the page has populated.
    */
    const observer =
      new MutationObserver(() => {
        injectSportsEventSchema();

        if (
          document.querySelector(
            'script[data-playmaker-sports-event-schema]'
          )
        ) {
          observer.disconnect();
        }
      });

    observer.observe(
      document.body,
      {
        childList: true,
        subtree: true,
        characterData: true
      }
    );

    /*
      Safety stop so the observer does not
      remain active forever on a failed page.
    */
    setTimeout(
      () => {
        observer.disconnect();
      },
      15000
    );
  }

  function initializeGlobalUI() {
    renderLinks();
    renderFeedbackButton();

    injectOrganizationSchema();
    injectFounderSchema();

    injectWebsiteSchema();
    injectSoftwareApplicationSchema();

    injectBreadcrumbSchema();
    injectFAQSchema();
    injectArticleSchema();

    initializeSportsEventSchema();
    injectSportsTeamSchema();
    injectPlayerProfileSchema();
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