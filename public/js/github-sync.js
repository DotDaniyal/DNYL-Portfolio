/**
 * DNYL — GitHub API Integration & Automatic Project Synchronization Engine
 * Account: DotDaniyal (Daniyal Hayat)
 * Endpoint: https://api.github.com/users/DotDaniyal/repos?sort=updated&per_page=100
 */

(function () {
  "use strict";

  const GITHUB_USER = "DotDaniyal";
  const GITHUB_API_URL = "https://api.github.com/users/" + GITHUB_USER + "/repos?sort=updated&per_page=100";
  const CACHE_KEY = "dnyl_github_repos_cache_v3";
  const TIMESTAMP_KEY = "dnyl_github_sync_time_v3";
  const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

  // Master Comprehensive Inventory of all 26 Public Repositories
  const MASTER_REPOS = [
  {
    "name": "TALEEM-UD-DEEN-ACDEMEY",
    "description": "Online Islamic educational academy platform delivering accessible curriculum modules, student resources, and responsive learning interfaces.",
    "html_url": "https://github.com/DotDaniyal/TALEEM-UD-DEEN-ACDEMEY",
    "homepage": "https://taleemuddeenvercelapp.vercel.app",
    "language": "TypeScript",
    "stargazers_count": 0,
    "forks_count": 0,
    "updated_at": "2026-10-27T04:30:52Z",
    "topics": [],
    "title": "Taleem-ud-Deen Academy",
    "tags": "all web featured"
  },
  {
    "name": "Daniyal-Hayat-Portfolio",
    "description": "Official portfolio showcase platform featuring live GitHub repository synchronization, resilient fallback caching, and smooth motion choreography.",
    "html_url": "https://github.com/DotDaniyal/Daniyal-Hayat-Portfolio",
    "homepage": "https://daniyal-hayat-portfolio.vercel.app",
    "language": "TypeScript",
    "stargazers_count": 1,
    "forks_count": 0,
    "updated_at": "2026-10-24T03:57:49Z",
    "topics": [],
    "title": "Daniyal Hayat Portfolio Platform",
    "tags": "all web featured"
  },
  {
    "name": "Dnyl-Edu-Tech",
    "description": "Modern educational technology platform designed to teach coding, web development principles, and software engineering practices.",
    "html_url": "https://github.com/DotDaniyal/Dnyl-Edu-Tech",
    "homepage": "https://dnyledutech.vercel.app",
    "language": "TypeScript",
    "stargazers_count": 0,
    "forks_count": 0,
    "updated_at": "2026-10-24T03:56:27Z",
    "topics": [],
    "title": "DNYL EduTech Platform",
    "tags": "all web"
  },
  {
    "name": "DNYL-Portfolio",
    "description": "Flagship personal brand platform highlighting software architecture, technical projects, and creative engineering milestones.",
    "html_url": "https://github.com/DotDaniyal/DNYL-Portfolio",
    "homepage": "https://dnyl.vercel.app",
    "language": "CSS",
    "stargazers_count": 0,
    "forks_count": 0,
    "updated_at": "2026-10-23T18:06:19Z",
    "topics": [],
    "title": "DNYL Official Brand Experience",
    "tags": "all web featured"
  },
  {
    "name": "DNYL-jarvis",
    "description": "Intelligent voice and command processing prototype exploring reactive workflows, system orchestration, and AI task execution.",
    "html_url": "https://github.com/DotDaniyal/DNYL-jarvis",
    "homepage": "https://dnyl-jarvis.vercel.app",
    "language": "TypeScript",
    "stargazers_count": 0,
    "forks_count": 0,
    "updated_at": "2026-10-23T17:55:32Z",
    "topics": [],
    "title": "DNYL Jarvis AI Assistant",
    "tags": "all ai featured"
  },
  {
    "name": "Madrasa-Taleem-ul-Quran",
    "description": "Dedicated institutional web portal for Madrasa Taleem-ul-Quran at Faryal Masjid with schedule tracking and community resources.",
    "html_url": "https://github.com/DotDaniyal/Madrasa-Taleem-ul-Quran",
    "homepage": "https://madrasa-taleem-ul-quran.vercel.app",
    "language": "TypeScript",
    "stargazers_count": 0,
    "forks_count": 0,
    "updated_at": "2026-10-18T16:48:11Z",
    "topics": [],
    "title": "Madrasa Taleem-ul-Quran Portal",
    "tags": "all web"
  },
  {
    "name": "darul-ifta-irshad-us-saileen",
    "description": "Premium bilingual Urdu/English Islamic institutional website for Darul Ifta Irshad-us-Saileen Karachi, including fatwa browsing, ask-a-fatwa form, and services.",
    "html_url": "https://github.com/DotDaniyal/darul-ifta-irshad-us-saileen",
    "homepage": "https://daruliftairshadussaileen.vercel.app",
    "language": "TypeScript",
    "stargazers_count": 0,
    "forks_count": 0,
    "updated_at": "2026-10-15T03:06:53Z",
    "topics": [],
    "title": "Darul Ifta Irshad us Saileen",
    "tags": "all web featured"
  },
  {
    "name": "FIK-AI",
    "description": "Production AI intelligence and workflow utility exploring specialized domain processing, streaming responses, and model pipelines.",
    "html_url": "https://github.com/DotDaniyal/FIK-AI",
    "homepage": "https://fik-ai.vercel.app",
    "language": "TypeScript",
    "stargazers_count": 0,
    "forks_count": 0,
    "updated_at": "2026-10-13T03:09:45Z",
    "topics": [],
    "title": "FIK-AI Intelligence Suite",
    "tags": "all ai"
  },
  {
    "name": "Dnyl-Ai",
    "description": "AI computational assistant exploring prompt engineering, generative language model integration, and reactive client interfaces.",
    "html_url": "https://github.com/DotDaniyal/Dnyl-Ai",
    "homepage": "https://dnyl1ai.vercel.app",
    "language": "TypeScript",
    "stargazers_count": 0,
    "forks_count": 0,
    "updated_at": "2026-10-12T17:24:57Z",
    "topics": [],
    "title": "DNYL-AI Smart Assistant",
    "tags": "all ai"
  },
  {
    "name": "dnylai",
    "description": "Lightweight AI exploration interface and client utilities built for rapid prompt experimentation and model testing.",
    "html_url": "https://github.com/DotDaniyal/dnylai",
    "homepage": "https://dnylai.vercel.app",
    "language": "HTML",
    "stargazers_count": 0,
    "forks_count": 0,
    "updated_at": "2026-10-12T17:19:08Z",
    "topics": [],
    "title": "DNYL AI Client Suite",
    "tags": "all ai"
  },
  {
    "name": "Teachers-Day",
    "description": "Interactive celebratory web tribute created in honor of Teachers Day featuring expressive typography, cards, and smooth animations.",
    "html_url": "https://github.com/DotDaniyal/Teachers-Day",
    "homepage": "https://teachersdaybydnyl.vercel.app",
    "language": "TypeScript",
    "stargazers_count": 0,
    "forks_count": 0,
    "updated_at": "2026-10-06T04:25:22Z",
    "topics": [],
    "title": "Teachers Day Interactive Tribute",
    "tags": "all web"
  },
  {
    "name": "DotDaniyal",
    "description": "GitHub profile README repository showcasing open-source contributions, repositories, and technical software skills.",
    "html_url": "https://github.com/DotDaniyal/DotDaniyal",
    "homepage": "https://github.com/DotDaniyal",
    "language": null,
    "stargazers_count": 0,
    "forks_count": 0,
    "updated_at": "2026-10-02T07:22:29Z",
    "topics": [],
    "title": "DotDaniyal Profile Master",
    "tags": "all github"
  },
  {
    "name": "FARYAL-FC",
    "description": "Official sports club web platform featuring dynamic match fixtures, team roster showcase, scoreboards, and mobile navigation.",
    "html_url": "https://github.com/DotDaniyal/FARYAL-FC",
    "homepage": "https://faryal-fc.vercel.app",
    "language": "TypeScript",
    "stargazers_count": 0,
    "forks_count": 0,
    "updated_at": "2026-09-27T10:19:27Z",
    "topics": [],
    "title": "Faryal FC Official Platform",
    "tags": "all web featured"
  },
  {
    "name": "SOUTNAQI-AI",
    "description": "Intelligent audio and voice processing suite featuring HTML5 canvas spectrum analysis, speech clarity enhancement, and transcript utilities.",
    "html_url": "https://github.com/DotDaniyal/SOUTNAQI-AI",
    "homepage": "https://daniyal-hayat-portfolio.vercel.app",
    "language": "TypeScript",
    "stargazers_count": 0,
    "forks_count": 0,
    "updated_at": "2026-09-17T04:19:31Z",
    "topics": [],
    "title": "SOUTNAQI AI Audio Processing",
    "tags": "all ai featured"
  },
  {
    "name": "Mystic-Match",
    "description": "Mobile-first fantasy puzzle game featuring algorithmic matrix manipulation, match-3 cascades, and responsive touch controls.",
    "html_url": "https://github.com/DotDaniyal/Mystic-Match",
    "homepage": "https://mystic-match-rho.vercel.app",
    "language": "TypeScript",
    "stargazers_count": 0,
    "forks_count": 0,
    "updated_at": "2026-09-16T17:40:11Z",
    "topics": [],
    "title": "Mystic Match Puzzle Game",
    "tags": "all mobile featured"
  },
  {
    "name": "MOTO-APEX",
    "description": "High-speed 2D motorcycle racing simulation with custom arcade physics loops, trajectory sweeps, and responsive touch controls.",
    "html_url": "https://github.com/DotDaniyal/MOTO-APEX",
    "homepage": "https://daniyal-hayat-portfolio.vercel.app",
    "language": "TypeScript",
    "stargazers_count": 0,
    "forks_count": 0,
    "updated_at": "2026-09-16T05:12:28Z",
    "topics": [],
    "title": "MOTO APEX 2D Racing",
    "tags": "all mobile"
  },
  {
    "name": "APEX-MOTO",
    "description": "Motorcycle mechanics and vehicle simulation engine exploring velocity curves, collision sweeps, and canvas rendering.",
    "html_url": "https://github.com/DotDaniyal/APEX-MOTO",
    "homepage": "https://daniyal-hayat-portfolio.vercel.app",
    "language": "TypeScript",
    "stargazers_count": 0,
    "forks_count": 0,
    "updated_at": "2026-09-16T04:56:37Z",
    "topics": [],
    "title": "Apex Moto Physics Engine",
    "tags": "all mobile"
  },
  {
    "name": "DNYL-EYEWEAR",
    "description": "Luxury designer eyewear e-commerce boutique experience featuring curated catalog filtering and fluid responsive layouts.",
    "html_url": "https://github.com/DotDaniyal/DNYL-EYEWEAR",
    "homepage": "https://dnyl-eyewear.vercel.app",
    "language": "TypeScript",
    "stargazers_count": 0,
    "forks_count": 0,
    "updated_at": "2026-09-14T05:02:19Z",
    "topics": [],
    "title": "DNYL Eyewear Boutique",
    "tags": "all web featured"
  },
  {
    "name": "Mytic-Matach-2",
    "description": "Second-generation algorithmic match-3 game prototype with cascading multipliers and refined tile physics.",
    "html_url": "https://github.com/DotDaniyal/Mytic-Matach-2",
    "homepage": "https://mystic-match-rho.vercel.app",
    "language": "TypeScript",
    "stargazers_count": 0,
    "forks_count": 0,
    "updated_at": "2026-09-13T04:12:37Z",
    "topics": [],
    "title": "Mystic Match 2 Engine",
    "tags": "all mobile"
  },
  {
    "name": "mystic-quset-by-dnyl",
    "description": "Native Android and Kotlin game engineering showcase with deterministic state machines and touch gestures.",
    "html_url": "https://github.com/DotDaniyal/mystic-quset-by-dnyl",
    "homepage": "https://mystic-match-by-dnyl.vercel.app",
    "language": "Kotlin",
    "stargazers_count": 0,
    "forks_count": 0,
    "updated_at": "2026-09-13T02:41:14Z",
    "topics": [],
    "title": "Mystic Quest Android Game",
    "tags": "all mobile"
  },
  {
    "name": "Hamara-Weather",
    "description": "Real-time meteorological tracking application delivering live atmospheric condition metrics, forecasts, and zero-latency search.",
    "html_url": "https://github.com/DotDaniyal/Hamara-Weather",
    "homepage": "https://hamara-weather.vercel.app",
    "language": "TypeScript",
    "stargazers_count": 0,
    "forks_count": 0,
    "updated_at": "2026-09-12T19:13:58Z",
    "topics": [],
    "title": "Hamara Weather Live",
    "tags": "all web featured"
  },
  {
    "name": "Hamara-Weather-app",
    "description": "Native Android meteorological tracking client written in Kotlin with clean Material UI cards and local forecast caching.",
    "html_url": "https://github.com/DotDaniyal/Hamara-Weather-app",
    "homepage": "https://hamara-weather.vercel.app",
    "language": "Kotlin",
    "stargazers_count": 0,
    "forks_count": 0,
    "updated_at": "2026-09-12T08:38:29Z",
    "topics": [],
    "title": "Hamara Weather Android Client",
    "tags": "all mobile featured"
  },
  {
    "name": "Darul-Ifta-Irshad-us-Saileen-app2",
    "description": "Second-generation native Android application with SQLite/Room offline caching and rapid fatwa consultation queries.",
    "html_url": "https://github.com/DotDaniyal/Darul-Ifta-Irshad-us-Saileen-app2",
    "homepage": "https://darulifta-bkfbzf6u.manus.space/",
    "language": "HTML",
    "stargazers_count": 0,
    "forks_count": 0,
    "updated_at": "2026-09-11T05:56:27Z",
    "topics": [],
    "title": "Darul Ifta Android App v2",
    "tags": "all mobile featured"
  },
  {
    "name": "cortexiq-by-dnyl",
    "description": "Production-ready AI computational intelligence suite with LLM pipeline, reactive telemetry, and strict TypeScript safety.",
    "html_url": "https://github.com/DotDaniyal/cortexiq-by-dnyl",
    "homepage": "https://dnyl.vercel.app",
    "language": "TypeScript",
    "stargazers_count": 0,
    "forks_count": 0,
    "updated_at": "2026-09-11T01:29:22Z",
    "topics": [],
    "title": "CortexIQ AI Suite",
    "tags": "all ai featured"
  },
  {
    "name": "darul-ifta-irshad-us-saileen-app",
    "description": "Mobile application client for Darul Ifta consultation, theological research, and bilingual inquiry management.",
    "html_url": "https://github.com/DotDaniyal/darul-ifta-irshad-us-saileen-app",
    "homepage": "https://daruliftairshadussaileen.vercel.app",
    "language": "TypeScript",
    "stargazers_count": 0,
    "forks_count": 0,
    "updated_at": "2026-09-11T01:25:08Z",
    "topics": [],
    "title": "Darul Ifta Mobile Application",
    "tags": "all mobile"
  },
  {
    "name": "Offical-Darul-ifta-Irshad-us-saileen-",
    "description": "Official repository and production source codebase for the Darul Ifta Irshad-us-Saileen community web portal.",
    "html_url": "https://github.com/DotDaniyal/Offical-Darul-ifta-Irshad-us-saileen-",
    "homepage": "https://darulifta-bkfbzf6u.manus.space/",
    "language": null,
    "stargazers_count": 0,
    "forks_count": 0,
    "updated_at": "2026-09-04T06:42:08Z",
    "topics": [],
    "title": "Official Darul Ifta Irshad us Saileen",
    "tags": "all web featured"
  }
];

  // Map for rapid lookup by lowercase name
  const REPO_METADATA_MAP = {};
  MASTER_REPOS.forEach((r) => {
    REPO_METADATA_MAP[r.name.toLowerCase()] = r;
  });

  async function fetchGitHubRepos(forceRefresh) {
    const now = Date.now();
    try {
      if (!forceRefresh) {
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cachedTime = localStorage.getItem(TIMESTAMP_KEY);
        if (cachedData && cachedTime && now - parseInt(cachedTime, 10) < CACHE_TTL_MS) {
          return { repos: JSON.parse(cachedData), timestamp: parseInt(cachedTime, 10), fromCache: true };
        }
      }

      const response = await fetch(GITHUB_API_URL, {
        headers: {
          Accept: "application/vnd.github.v3+json"
        }
      });

      if (!response.ok) {
        throw new Error("GitHub API status " + response.status);
      }

      const liveRepos = await response.json();
      if (!Array.isArray(liveRepos) || liveRepos.length === 0) {
        throw new Error("Invalid or empty response format from GitHub API");
      }

      // Merge live GitHub API metrics (stars, forks, last updated, newly published repos)
      // with rich verified portfolio metadata (clean titles, live demo URLs, tags, full overviews)
      const mergedRepos = [];
      const seenNames = new Set();

      liveRepos.forEach((live) => {
        const key = live.name.toLowerCase();
        seenNames.add(key);
        const meta = REPO_METADATA_MAP[key] || {};

        mergedRepos.push({
          name: live.name,
          title: meta.title || live.name.replace(/[-_]/g, " "),
          description: meta.description || live.description || "Explore this repository, source code, and updates directly on GitHub.",
          html_url: live.html_url,
          homepage: (live.homepage && live.homepage.startsWith("http")) ? live.homepage : (meta.homepage || live.html_url),
          language: live.language || meta.language || "Code",
          stargazers_count: live.stargazers_count !== undefined ? live.stargazers_count : (meta.stargazers_count || 0),
          forks_count: live.forks_count !== undefined ? live.forks_count : (meta.forks_count || 0),
          updated_at: live.updated_at || meta.updated_at || new Date().toISOString(),
          tags: meta.tags || ("all github " + (live.language ? live.language.toLowerCase() : "web"))
        });
      });

      // Ensure all 26 master repos are represented even if GitHub paginates or omits any
      MASTER_REPOS.forEach((meta) => {
        if (!seenNames.has(meta.name.toLowerCase())) {
          mergedRepos.push(meta);
        }
      });

      // Sort by updated_at descending
      mergedRepos.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

      localStorage.setItem(CACHE_KEY, JSON.stringify(mergedRepos));
      localStorage.setItem(TIMESTAMP_KEY, now.toString());

      return { repos: mergedRepos, timestamp: now, fromCache: false };
    } catch (err) {
      console.warn("GitHub API note (using verified master archive):", err);
      const cachedData = localStorage.getItem(CACHE_KEY);
      const cachedTime = localStorage.getItem(TIMESTAMP_KEY);
      if (cachedData) {
        return {
          repos: JSON.parse(cachedData),
          timestamp: cachedTime ? parseInt(cachedTime, 10) : now,
          fromCache: true,
          error: err.message
        };
      }
      return { repos: MASTER_REPOS, timestamp: now, fromCache: true, error: err.message };
    }
  }

  function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  }

  function renderSyncWidget(timestamp, fromCache, error) {
    const toolbar = document.querySelector(".projects-top-bar") || document.getElementById("projects");
    if (!toolbar) return;

    let syncBar = document.getElementById("github-sync-bar");
    if (!syncBar) {
      syncBar = document.createElement("div");
      syncBar.id = "github-sync-bar";
      syncBar.className = "github-sync-bar";
      syncBar.innerHTML =
        '<div class="sync-info">' +
          '<span class="sync-status-dot" id="sync-dot"></span>' +
          '<span class="sync-label">GITHUB LIVE SYNC: <strong id="sync-account">@DotDaniyal</strong></span>' +
          '<span class="sync-time" id="sync-time">Last synced: ' + formatTime(timestamp) + '</span>' +
          (error ? '<span class="sync-warn" title="' + error + '">⚡ (Verified Master Mode)</span>' : '<span class="sync-live-badge">● 26 Public Repos Live</span>') +
        '</div>' +
        '<div class="sync-actions">' +
          '<button type="button" id="btn-refresh-github" class="sync-refresh-btn" data-cursor-text="SYNC" aria-label="Refresh GitHub Repositories">' +
            '<svg class="sync-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
              '<path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.73-5.73" />' +
            '</svg>' +
            '<span>REFRESH REPOSITORIES</span>' +
          '</button>' +
        '</div>';
      toolbar.insertBefore(syncBar, toolbar.firstChild);

      const refreshBtn = document.getElementById("btn-refresh-github");
      if (refreshBtn) {
        refreshBtn.addEventListener("click", async () => {
          refreshBtn.classList.add("is-spinning");
          const result = await fetchGitHubRepos(true);
          renderRepos(result.repos);
          renderSyncWidget(result.timestamp, result.fromCache, result.error);
          refreshBtn.classList.remove("is-spinning");
          showToast("Synchronized " + result.repos.length + " public repositories from @DotDaniyal");
        });
      }
    } else {
      const timeEl = document.getElementById("sync-time");
      if (timeEl) {
        timeEl.textContent = "Last synced: " + formatTime(timestamp);
      }
    }
  }

  function showToast(message) {
    const toast = document.getElementById("interaction-toast");
    const toastMsg = document.getElementById("toast-message");
    if (toast && toastMsg) {
      toastMsg.textContent = message;
      toast.classList.add("is-visible");
      toast.setAttribute("aria-hidden", "false");
      window.setTimeout(() => {
        toast.classList.remove("is-visible");
        toast.setAttribute("aria-hidden", "true");
      }, 4000);
    }
  }

  function renderRepos(repos) {
    // 1. Clean up any redundant secondary dynamic containers from previous legacy runs
    const staleDynamicGrid = document.getElementById("github-dynamic-repos-grid");
    if (staleDynamicGrid) {
      const prevHead = staleDynamicGrid.previousElementSibling;
      if (prevHead && prevHead.classList.contains("projects-archive-head")) {
        prevHead.remove();
      }
      staleDynamicGrid.remove();
    }

    // 2. Target the primary archive container #projects-archive-grid
    const archiveGrid = document.getElementById("projects-archive-grid");
    if (!archiveGrid) return;

    // Map existing cards by data-project-id
    const existingCardsMap = new Map();
    archiveGrid.querySelectorAll(".archive-card").forEach((card) => {
      const id = (card.getAttribute("data-project-id") || "").toLowerCase();
      if (id) existingCardsMap.set(id, card);
    });

    repos.forEach((repo, idx) => {
      const key = repo.name.toLowerCase();
      const existingCard = existingCardsMap.get(key);

      if (existingCard) {
        // Update live stats (stars, forks, updated date) on existing card
        const statsBadge = existingCard.querySelector(".archive-stats-badge");
        if (statsBadge) {
          statsBadge.textContent = "⭐ " + (repo.stargazers_count || 0) + " · 🔀 " + (repo.forks_count || 0);
        }
        const dateBadge = existingCard.querySelector(".archive-updated-date");
        if (dateBadge && repo.updated_at) {
          dateBadge.textContent = new Date(repo.updated_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
        }
        existingCard.classList.add("is-inview");
      } else {
        // Brand new repository published on GitHub! Dynamically create and prepend
        const num = (idx + 7).toString().padStart(2, "0");
        const lang = repo.language || "Code";
        const stars = repo.stargazers_count || 0;
        const forks = repo.forks_count || 0;
        const liveUrl = repo.homepage || repo.html_url;
        const updatedDate = new Date(repo.updated_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

        const article = document.createElement("article");
        article.className = "archive-card is-inview";
        article.setAttribute("data-project-id", key);
        article.setAttribute("data-project-tags", repo.tags || "all github web");
        article.setAttribute("data-projects-reveal", "archive-card");
        article.innerHTML =
          '<div class="archive-card-glow" aria-hidden="true"></div>' +
          '<div class="archive-card-inner">' +
            '<div class="archive-card-top">' +
              '<div class="archive-meta">' +
                '<span class="archive-num">' + num + '</span>' +
                '<span aria-hidden="true">/</span>' +
                '<span>' + lang + '</span>' +
                '<span aria-hidden="true">·</span>' +
                '<span class="archive-stats-badge" data-repo-stats="' + repo.name + '">⭐ ' + stars + ' · 🔀 ' + forks + '</span>' +
              '</div>' +
              '<div class="archive-links">' +
                '<a href="' + repo.html_url + '" target="_blank" rel="noopener noreferrer" class="archive-icon-link" aria-label="' + repo.title + ' GitHub Repository" title="Source Code">' +
                  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
                    '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />' +
                    '<path d="M9 18c-4.51 2-5-2-7-2" />' +
                  '</svg>' +
                '</a>' +
                '<a href="' + liveUrl + '" target="_blank" rel="noopener noreferrer" class="archive-icon-link" aria-label="' + repo.title + ' Live Deployment" title="Live Demo">' +
                  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                    '<path d="M7 17L17 7" />' +
                    '<path d="M7 7h10v10" />' +
                  '</svg>' +
                '</a>' +
              '</div>' +
            '</div>' +
            '<div class="archive-card-body">' +
              '<h4 class="archive-card-title">' + repo.title + '</h4>' +
              '<p class="archive-card-desc">' + repo.description + '</p>' +
            '</div>' +
            '<div class="archive-card-footer">' +
              '<div class="archive-stack">' +
                '<span>' + lang + '</span>' +
                '<span aria-hidden="true">·</span>' +
                '<span class="archive-updated-date" data-repo-date="' + repo.name + '">' + updatedDate + '</span>' +
              '</div>' +
              '<div class="archive-action-group">' +
                '<a href="' + liveUrl + '" target="_blank" rel="noopener noreferrer" class="archive-case-btn" style="text-decoration: none;">' +
                  'Live Demo ↗' +
                '</a>' +
                '<a href="' + repo.html_url + '" target="_blank" rel="noopener noreferrer" class="archive-case-btn archive-repo-btn" style="text-decoration: none;">' +
                  'Repo →' +
                '</a>' +
              '</div>' +
            '</div>' +
          '</div>';
        archiveGrid.prepend(article);
      }
    });

    // 3. Trigger filter update and telemetry recalculation
    if (typeof window.refreshProjectsFilter === "function") {
      window.refreshProjectsFilter(false);
    }
    if (typeof window.updateFilterButtonCounts === "function") {
      window.updateFilterButtonCounts();
    }
    if (window.ScrollTrigger && typeof window.ScrollTrigger.refresh === "function") {
      window.ScrollTrigger.refresh();
    }
  }

  async function initGitHubSync() {
    const result = await fetchGitHubRepos(false);
    renderSyncWidget(result.timestamp, result.fromCache, result.error);
    renderRepos(result.repos);

    document.addEventListener("visibilitychange", async () => {
      if (document.visibilityState === "visible") {
        const fresh = await fetchGitHubRepos(false);
        renderSyncWidget(fresh.timestamp, fresh.fromCache, fresh.error);
        renderRepos(fresh.repos);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGitHubSync);
  } else {
    initGitHubSync();
  }
})();
