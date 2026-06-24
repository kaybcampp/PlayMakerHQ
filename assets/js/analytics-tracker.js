(function () {
  if (localStorage.getItem("pm_ignore_analytics") === "true") {
    return;
  }

  const API_URL = "/api/analytics/track";
  const SESSION_KEY = "pm_session_id";
  const VISITOR_KEY = "pm_visitor_id";
  const ENTRY_PAGE_KEY = "pm_entry_page";
  const SESSION_STARTED_KEY = "pm_session_started_at";

  const pageLoadedAt = Date.now();
  let exitTracked = false;

  function createId(prefix) {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  }

  function getOrCreateVisitorId() {
    let visitorId = localStorage.getItem(VISITOR_KEY);

    if (!visitorId) {
      visitorId = createId("visitor");
      localStorage.setItem(VISITOR_KEY, visitorId);
    }

    return visitorId;
  }

  function getOrCreateSessionId() {
    let sessionId = sessionStorage.getItem(SESSION_KEY);

    if (!sessionId) {
      sessionId = createId("session");
      sessionStorage.setItem(SESSION_KEY, sessionId);
      sessionStorage.setItem(ENTRY_PAGE_KEY, window.location.pathname + window.location.search);
      sessionStorage.setItem(SESSION_STARTED_KEY, new Date().toISOString());
    }

    return sessionId;
  }

  function getDeviceType() {
    const ua = navigator.userAgent.toLowerCase();

    if (/ipad|tablet/.test(ua)) return "Tablet";
    if (/mobile|iphone|android/.test(ua)) return "Mobile";

    return "Desktop";
  }

  function getBrowser() {
    const ua = navigator.userAgent;

    if (ua.includes("Edg/")) return "Edge";
    if (ua.includes("Chrome/")) return "Chrome";
    if (ua.includes("Safari/") && !ua.includes("Chrome/")) return "Safari";
    if (ua.includes("Firefox/")) return "Firefox";

    return "Other";
  }

  function getPageType() {
    const path = window.location.pathname;
    const search = window.location.search;

    if (path.includes("/matchups/")) {
      return "dynamic_matchup";
    }

    if (path.includes("matchup.html") && search.includes("game=")) {
      return "dynamic_matchup";
    }

    if (path.includes("matchups.html")) {
      return "matchup_hub";
    }

    if (path.includes("all-matchups.html")) {
      return "all_matchups";
    }

    if (path.includes("/tool/")) {
      return "tool";
    }

    if (path === "/" || path.includes("index.html")) {
      return "home";
    }

    return "site_page";
  }

  function buildPayload(type, extra = {}) {
    return {
      type,
      visitorId: getOrCreateVisitorId(),
      sessionId: getOrCreateSessionId(),

      page: window.location.pathname + window.location.search,
      pathname: window.location.pathname,
      query: window.location.search,
      title: document.title,
      pageType: getPageType(),

      referrer: document.referrer || "",
      entryPage: sessionStorage.getItem(ENTRY_PAGE_KEY) || "",
      sessionStartedAt: sessionStorage.getItem(SESSION_STARTED_KEY) || "",

      device: getDeviceType(),
      browser: getBrowser(),
      language: navigator.language || "",
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,

      timestamp: new Date().toISOString(),

      ...extra
    };
  }

  function sendAnalytics(payload, useBeacon = false) {
    try {
      const body = JSON.stringify(payload);

      if (useBeacon && navigator.sendBeacon) {
        const blob = new Blob([body], {
          type: "application/json"
        });

        navigator.sendBeacon(API_URL, blob);
        return;
      }

      fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body,
        keepalive: true
      }).catch(() => { });
    } catch (err) {
      // Fail silently. Analytics should never break the site.
    }
  }

  function trackPageView() {
    sendAnalytics(
      buildPayload("pageview", {
        timeOnPageSeconds: 0
      })
    );
  }

  function trackPageExit() {
    if (exitTracked) return;

    exitTracked = true;

    const rawSeconds = Math.round((Date.now() - pageLoadedAt) / 1000);
    const timeOnPageSeconds = Math.min(rawSeconds, 1800);

    sendAnalytics(
      buildPayload("page_exit", {
        timeOnPageSeconds,
        exitPage: window.location.pathname + window.location.search
      }),
      true
    );
  }

  function trackClick(event) {
    const target = event.target.closest("a, button");

    if (!target) return;

    const label =
      target.innerText ||
      target.getAttribute("aria-label") ||
      target.getAttribute("title") ||
      "Unknown Click";

    sendAnalytics(
      buildPayload("click", {
        clickText: label.trim().slice(0, 120),
        clickHref: target.href || "",
        clickClass: target.className || ""
      })
    );
  }

  function initAnalytics() {
    trackPageView();

    document.addEventListener("click", trackClick);

    window.addEventListener("beforeunload", trackPageExit);

    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") {
        trackPageExit();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAnalytics);
  } else {
    initAnalytics();
  }
})();