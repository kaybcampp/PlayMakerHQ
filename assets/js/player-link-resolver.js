/* =========================================================
   PLAYMAKER PLAYER LINK RESOLVER
   Shared by:
   - Success Rate
   - EPA
   - Pressure Rate
   - Future research leaderboards

   Resolution priority:
   1. Supplied team file
   2. Known team aliases
   3. All player files

   Matching supports:
   - Canonical names
   - Punctuation differences
   - Apostrophes
   - Hyphenated names
   - Suffixes
   - Middle initials
   - First-initial abbreviations
   - Team mismatches / stale roster assignments
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       CONFIG
    ===================================================== */

    const PLAYER_DATA_PATH =
        "/assets/data/players";

    const TEAM_CODES = [
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


    const TEAM_ALIASES = {
        LA: ["LAR"],
        LAR: ["LA"],
        WAS: ["WSH"],
        WSH: ["WAS"]
    };


    const SUFFIXES = new Set([
        "jr",
        "sr",
        "ii",
        "iii",
        "iv",
        "v",
        "vi"
    ]);


    /* =====================================================
       CACHES
    ===================================================== */

    const teamFileCache =
        new Map();

    const playerUrlCache =
        new Map();

    let allPlayersPromise =
        null;


    /* =====================================================
       BASIC NORMALIZATION
    ===================================================== */

    function normalizePlayerName(value) {

        return String(value || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[.'’]/g, "")
            .replace(/[^a-z0-9\s-]/g, " ")
            .replace(/-/g, " ")
            .replace(/\s+/g, " ")
            .trim();

    }


    /* =====================================================
       TOKEN HELPERS
    ===================================================== */

    function getNameTokens(value) {

        return normalizePlayerName(value)
            .split(/\s+/)
            .filter(Boolean);

    }


    function removeSuffixes(tokens) {

        return tokens.filter(
            token =>
                !SUFFIXES.has(token)
        );

    }


    function getFirstNameToken(value) {

        const tokens =
            removeSuffixes(
                getNameTokens(value)
            );

        return tokens[0] || "";

    }


    function getLastNameToken(value) {

        const tokens =
            removeSuffixes(
                getNameTokens(value)
            );

        return tokens[tokens.length - 1] || "";

    }


    /* =====================================================
       EXACT / NORMALIZED MATCH
    ===================================================== */

    function normalizedNamesMatch(
        sourceName,
        candidateName
    ) {

        const source =
            normalizePlayerName(
                sourceName
            );

        const candidate =
            normalizePlayerName(
                candidateName
            );

        if (!source || !candidate) {
            return false;
        }

        if (source === candidate) {
            return true;
        }

        /*
         * Compare names after removing suffixes.
         *
         * Example:
         *
         * "Michael Penix Jr."
         * "Michael Penix"
         */

        const sourceTokens =
            removeSuffixes(
                getNameTokens(sourceName)
            );

        const candidateTokens =
            removeSuffixes(
                getNameTokens(candidateName)
            );

        return (
            sourceTokens.length > 0 &&
            candidateTokens.length > 0 &&
            sourceTokens.join(" ") ===
            candidateTokens.join(" ")
        );

    }


    /* =====================================================
       ABBREVIATION MATCH
       Supports:
       B.Purdy
       M.Penix
       D.Smith
       C.J.Stroud
       etc.
    ===================================================== */

    function abbreviationMatchesPlayer(
        abbreviation,
        fullName
    ) {

        if (
            !abbreviation ||
            !fullName
        ) {
            return false;
        }


        const clean =
            String(abbreviation)
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[.'’]/g, "")
                .replace(/[^a-z0-9]/g, "");


        if (!clean) {
            return false;
        }


        const first =
            getFirstNameToken(
                fullName
            );


        const last =
            getLastNameToken(
                fullName
            );


        if (
            !first ||
            !last
        ) {
            return false;
        }


        /*
         * Standard:
         *
         * B.Purdy
         * M.Penix
         * J.Love
         */

        const standard =
            `${first.charAt(0)}${last}`
                .toLowerCase();


        if (
            clean === standard
        ) {
            return true;
        }


        /*
         * Support names with multiple
         * first/middle initials.
         *
         * Example:
         *
         * C.J.Stroud
         * CJStroud
         */

        const tokens =
            removeSuffixes(
                getNameTokens(fullName)
            );


        if (
            tokens.length >= 2
        ) {

            const initials =
                tokens
                    .slice(0, -1)
                    .map(
                        token =>
                            token.charAt(0)
                    )
                    .join("");


            const multiInitial =
                `${initials}${last}`
                    .toLowerCase();


            if (
                clean === multiInitial
            ) {
                return true;
            }

        }


        return false;

    }


    /* =====================================================
       SHORT INITIAL + LAST NAME MATCH
       Handles:
       D Smith
       M Penix
       J Chase
       ===================================================== */

    function initialLastNameMatches(
        sourceName,
        candidateName
    ) {

        const sourceTokens =
            removeSuffixes(
                getNameTokens(sourceName)
            );

        const candidateTokens =
            removeSuffixes(
                getNameTokens(candidateName)
            );


        if (
            sourceTokens.length !== 2 ||
            candidateTokens.length < 2
        ) {
            return false;
        }


        const sourceFirst =
            sourceTokens[0];

        const sourceLast =
            sourceTokens[
                sourceTokens.length - 1
            ];


        const candidateFirst =
            candidateTokens[0];

        const candidateLast =
            candidateTokens[
                candidateTokens.length - 1
            ];


        return (
            sourceFirst.length === 1 &&
            candidateFirst.charAt(0) ===
                sourceFirst &&
            sourceLast ===
                candidateLast
        );

    }


    /* =====================================================
       PLAYER MATCH
    ===================================================== */

    function playerMatches(
        sourceName,
        candidate
    ) {

        if (
            !sourceName ||
            !candidate
        ) {
            return false;
        }


        const candidateName =
            String(
                candidate.name ||
                candidate.fullName ||
                ""
            ).trim();


        if (!candidateName) {
            return false;
        }


        /*
         * 1. Exact canonical match
         */

        if (
            normalizedNamesMatch(
                sourceName,
                candidateName
            )
        ) {
            return true;
        }


        /*
         * 2. Abbreviated format
         */

        if (
            abbreviationMatchesPlayer(
                sourceName,
                candidateName
            )
        ) {
            return true;
        }


        /*
         * 3. Initial + last name
         */

        if (
            initialLastNameMatches(
                sourceName,
                candidateName
            )
        ) {
            return true;
        }


        return false;

    }


    /* =====================================================
       FETCH TEAM FILE
    ===================================================== */

    async function loadTeamPlayers(
        teamCode
    ) {

        if (!teamCode) {
            return [];
        }


        const code =
            String(teamCode)
                .trim()
                .toUpperCase();


        if (
            teamFileCache.has(code)
        ) {
            return teamFileCache.get(code);
        }


        try {

            const response =
                await fetch(
                    `${PLAYER_DATA_PATH}/players-${code}.json`,
                    {
                        cache: "no-store"
                    }
                );


            if (!response.ok) {

                teamFileCache.set(
                    code,
                    []
                );

                return [];

            }


            const players =
                await response.json();


            const normalized =
                Array.isArray(players)
                    ? players
                    : [];


            teamFileCache.set(
                code,
                normalized
            );


            return normalized;

        } catch (error) {

            console.warn(
                `Player data load failed for ${code}:`,
                error
            );


            teamFileCache.set(
                code,
                []
            );


            return [];

        }

    }


    /* =====================================================
       LOAD ALL PLAYERS
       Only used if team lookup fails.
    ===================================================== */

    async function loadAllPlayers() {

        if (
            allPlayersPromise
        ) {
            return allPlayersPromise;
        }


        allPlayersPromise =
            (async () => {

                const results =
                    await Promise.all(
                        TEAM_CODES.map(
                            code =>
                                loadTeamPlayers(
                                    code
                                )
                        )
                    );


                return results.flat();

            })();


        return allPlayersPromise;

    }


    /* =====================================================
       FIND PLAYER
    ===================================================== */

    async function findPlayer(
        playerName,
        team
    ) {

        if (!playerName) {
            return null;
        }


        const teamCode =
            String(team || "")
                .trim()
                .toUpperCase();


        /*
         * -----------------------------------------------
         * PRIORITY 1
         * Supplied team file
         * -----------------------------------------------
         */

        const primaryTeams = [];


        if (teamCode) {
            primaryTeams.push(
                teamCode
            );
        }


        /*
         * -----------------------------------------------
         * PRIORITY 2
         * Known team aliases
         * -----------------------------------------------
         */

        const aliases =
            TEAM_ALIASES[
                teamCode
            ] || [];


        for (
            const alias of aliases
        ) {

            if (
                !primaryTeams.includes(
                    alias
                )
            ) {

                primaryTeams.push(
                    alias
                );

            }

        }


        for (
            const lookupTeam of primaryTeams
        ) {

            const players =
                await loadTeamPlayers(
                    lookupTeam
                );


            const match =
                players.find(
                    candidate =>
                        playerMatches(
                            playerName,
                            candidate
                        )
                );


            if (match) {
                return match;
            }

        }


        /*
         * -----------------------------------------------
         * PRIORITY 3
         * Search all player files
         * -----------------------------------------------
         *
         * This is the resilience fallback.
         *
         * Example:
         *
         * Dataset says:
         * Tua Tagovailoa + MIA
         *
         * Current roster file:
         * Tua Tagovailoa + ATL
         *
         * We still find the canonical player.
         */

        const allPlayers =
            await loadAllPlayers();


        const fallback =
            allPlayers.find(
                candidate =>
                    playerMatches(
                        playerName,
                        candidate
                    )
            );


        return fallback || null;

    }


    /* =====================================================
       SLUG
    ===================================================== */

    function slugify(
        value
    ) {

        return String(value || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[.'’]/g, "")
            .replace(/[^a-z0-9\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-");

    }


    /* =====================================================
       PUBLIC RESOLVER
    ===================================================== */

    async function resolvePlayerUrl(
        playerName,
        team
    ) {

        if (!playerName) {
            return null;
        }


        const teamCode =
            String(team || "")
                .trim()
                .toUpperCase();


        const cacheKey =
            `${teamCode}:${playerName}`;


        if (
            playerUrlCache.has(
                cacheKey
            )
        ) {

            return playerUrlCache.get(
                cacheKey
            );

        }


        const player =
            await findPlayer(
                playerName,
                teamCode
            );


        if (!player) {

            playerUrlCache.set(
                cacheKey,
                null
            );

            return null;

        }


        const canonicalName =
            String(
                player.name ||
                player.fullName ||
                ""
            ).trim();


        if (!canonicalName) {

            playerUrlCache.set(
                cacheKey,
                null
            );

            return null;

        }


        /*
         * Always build the URL from the
         * canonical player name.
         *
         * Never build it from:
         * B.Purdy
         * M.Penix
         * D.Smith
         * etc.
         */

        const slug =
            slugify(
                canonicalName
            );


        if (!slug) {

            playerUrlCache.set(
                cacheKey,
                null
            );

            return null;

        }


        const url =
            `/players/${slug}`;


        playerUrlCache.set(
            cacheKey,
            url
        );


        return url;

    }


    /* =====================================================
       PUBLIC API
    ===================================================== */

    window.PlayMakerPlayerLinkResolver = {

        resolvePlayerUrl,

        findPlayer,

        normalizePlayerName,

        abbreviationMatchesPlayer,

        slugify

    };

})();