(function () {
    const currentPath = window.location.pathname.toLowerCase();

    const navItems = [
        {
            label: "Home",
            href: "/index.html",
            match: ["/", "/index.html"]
        },
        {
            label: "Players",
            href: "/players.html",
            match: ["/players.html", "/players/"]
        },
        {
            label: "Teams",
            href: "/teams.html",
            match: ["/teams.html", "/teams/"]
        },
        {
            label: "Matchups",
            href: "/matchups.html",
            match: ["/matchups.html", "/all-matchups.html", "/matchups/"]
        },
        {
            label: "Research",
            href: "/research.html",
            match: ["/research.html", "/research/"]
        },
        {
            label: "Results",
            href: "/results.html",
            match: ["/results.html", "/results/"]
        },
        {
            label: "Pricing",
            href: "/pricing.html",
            match: ["/pricing.html"]
        },
        {
            label: "Open Tool",
            href: "/tool/",
            match: ["/tool/"],
            cta: true
        }
    ];

    function isActive(item) {
        return item.match.some(path => {
            if (path === "/") {
                return currentPath === "/";
            }

            return currentPath === path || currentPath.startsWith(path);
        });
    }

    function renderHeader() {
        const target = document.getElementById("site-header");

        if (!target) return;

        const links = navItems.map(item => {
            const classes = [
                "pm-link",
                item.cta ? "pm-link-cta" : "",
                isActive(item) ? "active" : ""
            ]
                .filter(Boolean)
                .join(" ");

            return `
                <a href="${item.href}" class="${classes}">
                    ${item.label}
                </a>
            `;
        }).join("");

        target.innerHTML = `
            <header class="pm-header">
                <a href="/index.html" class="pm-logo">
    <h1>PlayMaker Prime</h1>
</a>

                <nav class="pm-nav">
                    ${links}
                </nav>
            </header>
        `;
    }

    renderHeader();
})();