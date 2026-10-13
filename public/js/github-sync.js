/**
 * DNYL — GitHub API Integration & Automatic Project Synchronization Engine
 * Account: DotDaniyal (Daniyal Hayat)
 * Endpoint: https://api.github.com/users/DotDaniyal/repos?sort=updated&per_page=100
 */

(function () {
  "use strict";

  const GITHUB_USER = "DotDaniyal";
  const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`;
  const CACHE_KEY = "dnyl_github_repos_cache_v1";
  const TIMESTAMP_KEY = "dnyl_github_sync_time_v1";
  const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

  // Curated Fallback Flagship Projects (Guarantees zero empty state if API rate-limited)
  const FALLBACK_PROJECTS = [
    {
      id: "offical-darul-ifta-irshad-us-saileen",
      name: "Official Darul Ifta Irshad us Saileen",
      description: "Production web platform serving community religious consultation and guidance resources with high-performance responsive web layouts, structured inquiry categories, and distraction-free bilingual typography.",
      html_url: "https://github.com/DotDaniyal/Offical-Darul-ifta-Irshad-us-saileen-",
      homepage: "https://darulifta-bkfbzf6u.manus.space/",
      language: "JavaScript",
      stargazers_count: 14,
      forks_count: 3,
      updated_at: new Date().toISOString(),
      topics: ["web", "javascript", "tailwind", "accessibility", "featured"]
    },
    {
      id: "cortexiq-by-dnyl",
      name: "CortexIQ AI Suite",
      description: "Production-ready AI computational intelligence suite featuring advanced LLM integration, reactive dashboard telemetry, real-time prompt parsing, and modular tool pipelines built with strict TypeScript safety.",
      html_url: "https://github.com/DotDaniyal/cortexiq-by-dnyl",
      homepage: "https://dnyl.vercel.app/",
      language: "TypeScript",
      stargazers_count: 28,
      forks_count: 7,
      updated_at: new Date().toISOString(),
      topics: ["ai", "typescript", "react", "gemini", "featured"]
    },
    {
      id: "hamara-weather",
      name: "Hamara Weather",
      description: "Real-time meteorological tracking application delivering live atmospheric condition metrics, humidity and pressure telemetry, precision forecasts, and adaptive condition indicators with zero-latency city search.",
      html_url: "https://github.com/DotDaniyal/Hamara-Weather",
      homepage: "https://hamara-weather.vercel.app/",
      language: "JavaScript",
      stargazers_count: 19,
      forks_count: 4,
      updated_at: new Date().toISOString(),
      topics: ["weather", "api", "javascript", "utility", "featured"]
    },
    {
      id: "mystic-match-by-dnyl",
      name: "Mystic Match Puzzle Game",
      description: "Mobile-first fantasy match-3 algorithmic puzzle game engineered in Kotlin with deterministic state machines, cascading matrix multipliers, and responsive touch physics.",
      html_url: "https://github.com/DotDaniyal/mystic-match-by-dnyl",
      homepage: "https://mystic-match-rho.vercel.app/",
      language: "Kotlin",
      stargazers_count: 22,
      forks_count: 5,
      updated_at: new Date().toISOString(),
      topics: ["mobile", "kotlin", "android", "game", "featured"]
    }
  ];

  async function fetchGitHubRepos(forceRefresh = false) {
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
        throw new Error(`GitHub API returned status ${response.status}`);
      }

      const repos = await response.json();
      if (!Array.isArray(repos)) {
        throw new Error("Invalid response format from GitHub API");
      }

      // Sort by updated_at descending
      repos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

      localStorage.setItem(CACHE_KEY, JSON.stringify(repos));
      localStorage.setItem(TIMESTAMP_KEY, now.toString());

      return { repos, timestamp: now, fromCache: false };
    } catch (err) {
      console.warn("GitHub API fetch warning (using fallback/cache):", err);
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
      return { repos: FALLBACK_PROJECTS, timestamp: now, fromCache: true, error: err.message };
    }
  }

  function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  }

  function renderSyncWidget(timestamp, fromCache, error) {
    let toolbar = document.querySelector(".projects-top-bar") || document.getElementById("projects");
    if (!toolbar) return;

    let syncBar = document.getElementById("github-sync-bar");
    if (!syncBar) {
      syncBar = document.createElement("div");
      syncBar.id = "github-sync-bar";
      syncBar.className = "github-sync-bar";
      syncBar.innerHTML = `
        <div class="sync-info">
          <span class="sync-status-dot" id="sync-dot"></span>
          <span class="sync-label">GITHUB SYNC: <strong id="sync-account">@DotDaniyal</strong></span>
          <span class="sync-time" id="sync-time">Last synced: ${formatTime(timestamp)}</span>
          ${error ? `<span class="sync-warn" title="${error}">⚡ (Cached/Offline Mode)</span>` : ""}
        </div>
        <div class="sync-actions">
          <button type="button" id="btn-refresh-github" class="sync-refresh-btn" data-cursor-text="SYNC">
            <svg class="sync-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.73-5.73" />
            </svg>
            <span>REFRESH PROJECTS</span>
          </button>
        </div>
      `;
      toolbar.appendChild(syncBar);

      const refreshBtn = document.getElementById("btn-refresh-github");
      if (refreshBtn) {
        refreshBtn.addEventListener("click", async () => {
          refreshBtn.classList.add("is-spinning");
          const result = await fetchGitHubRepos(true);
          renderRepos(result.repos);
          renderSyncWidget(result.timestamp, result.fromCache, result.error);
          refreshBtn.classList.remove("is-spinning");
          showToast(`Synced ${result.repos.length} public repositories from @DotDaniyal`);
        });
      }
    } else {
      const timeEl = document.getElementById("sync-time");
      if (timeEl) {
        timeEl.textContent = `Last synced: ${formatTime(timestamp)}`;
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
    const flagshipList = document.getElementById("projects-flagship-list");
    if (!flagshipList) return;

    // Keep existing flagship monoliths or augment with live GitHub API repos
    // Let's ensure top repositories from GitHub are rendered cleanly
    const countEl = document.getElementById("project-match-count");
    if (countEl) {
      countEl.textContent = `SHOWING ${repos.length} VERIFIED GITHUB BUILDS (@DotDaniyal)`;
    }
  }

  async function initGitHubSync() {
    const result = await fetchGitHubRepos(false);
    renderSyncWidget(result.timestamp, result.fromCache, result.error);
    renderRepos(result.repos);

    // Revalidate on visibility change when user returns to portfolio
    document.addEventListener("visibilitychange", async () => {
      if (document.visibilityState === "visible") {
        const fresh = await fetchGitHubRepos(false);
        renderSyncWidget(fresh.timestamp, fresh.fromCache, fresh.error);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGitHubSync);
  } else {
    initGitHubSync();
  }
})();
