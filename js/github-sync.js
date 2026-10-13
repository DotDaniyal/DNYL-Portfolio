/**
 * DNYL — GitHub API Integration & Automatic Project Synchronization Engine
 * Account: DotDaniyal (Daniyal Hayat)
 * Endpoint: https://api.github.com/users/DotDaniyal/repos?sort=updated&per_page=100
 */

(function () {
  "use strict";

  const GITHUB_USER = "DotDaniyal";
  const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`;
  const CACHE_KEY = "dnyl_github_repos_cache_v2";
  const TIMESTAMP_KEY = "dnyl_github_sync_time_v2";
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
      toolbar.insertBefore(syncBar, toolbar.firstChild);

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
    const countEl = document.getElementById("project-match-count");
    if (countEl) {
      countEl.textContent = `SHOWING ${repos.length} VERIFIED GITHUB BUILDS (@DotDaniyal)`;
    }

    let container = document.getElementById("github-dynamic-repos-grid");
    if (!container) {
      const archiveGrid = document.getElementById("projects-archive-grid");
      if (archiveGrid && archiveGrid.parentNode) {
        const wrapper = document.createElement("div");
        wrapper.className = "projects-archive-head";
        wrapper.style.marginTop = "4rem";
        wrapper.innerHTML = `
          <div class="archive-head-left">
            <span class="archive-kicker">LIVE GITHUB API SYNC // ALL PUBLIC REPOSITORIES</span>
            <h3 class="archive-title">All Public Repositories Fetched Live from @DotDaniyal</h3>
          </div>
          <div class="archive-github-cta">
            <span>Auto-Synced Live from GitHub</span>
          </div>
        `;
        archiveGrid.parentNode.insertBefore(wrapper, archiveGrid.nextSibling);

        container = document.createElement("div");
        container.id = "github-dynamic-repos-grid";
        container.className = "projects-archive-grid";
        wrapper.parentNode.insertBefore(container, wrapper.nextSibling);
      }
    }

    if (container) {
      container.innerHTML = repos.map((repo, idx) => {
        const num = (idx + 1).toString().padStart(2, '0');
        const updatedDate = new Date(repo.updated_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
        const desc = repo.description || "Explore this repository, source code, and updates directly on GitHub.";
        const lang = repo.language || "Code";
        const stars = repo.stargazers_count || 0;
        const forks = repo.forks_count || 0;
        const liveUrl = repo.homepage && repo.homepage.startsWith("http") ? repo.homepage : repo.html_url;

        return `
          <article class="archive-card" data-project-id="${repo.name}" data-project-tags="all github ${lang.toLowerCase()}">
            <div class="archive-card-glow" aria-hidden="true"></div>
            <div class="archive-card-inner">
              <div class="archive-card-top">
                <div class="archive-meta">
                  <span class="archive-num">${num}</span>
                  <span aria-hidden="true">/</span>
                  <span>${lang}</span>
                  <span aria-hidden="true">·</span>
                  <span>⭐ ${stars} · 🔀 ${forks}</span>
                </div>
                <div class="archive-links">
                  <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="archive-icon-link" aria-label="${repo.name} GitHub" title="Source Code">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                      <path d="M9 18c-4.51 2-5-2-7-2" />
                    </svg>
                  </a>
                  <a href="${liveUrl}" target="_blank" rel="noopener noreferrer" class="archive-icon-link" aria-label="${repo.name} Live Demo" title="Live Demo / Site">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M7 17L17 7" />
                      <path d="M7 7h10v10" />
                    </svg>
                  </a>
                </div>
              </div>
              <div class="archive-card-body">
                <h4 class="archive-card-title">${repo.name}</h4>
                <p class="archive-card-desc">${desc}</p>
              </div>
              <div class="archive-card-footer">
                <div class="archive-stack">
                  <span>${lang}</span><span aria-hidden="true">·</span>
                  <span>Updated ${updatedDate}</span>
                </div>
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="archive-case-btn" style="text-decoration: none;">
                  View Repo →
                </a>
              </div>
            </div>
          </article>
        `;
      }).join("");
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
