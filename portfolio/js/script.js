/**
 * DANIYAL HAYAT — CREATIVE DEVELOPER PORTFOLIO (HERO SECTION)
 * Pure Vanilla JavaScript (ES6+) | Offline-Ready | 60fps requestAnimationFrame
 */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const isFinePointer = window.matchMedia("(pointer: fine)").matches;

  // DOM Elements
  const body = document.body;
  const header = document.getElementById("site-header");
  const menuToggle = document.getElementById("menu-toggle");
  const mobileDrawer = document.getElementById("mobile-drawer");
  const cursorDot = document.getElementById("cursor-dot");
  const cursorRing = document.getElementById("cursor-ring");
  const cursorLabel = document.getElementById("cursor-label");
  const cursorGlow = document.getElementById("cursor-glow");
  const backdropGrid = document.getElementById("backdrop-grid");
  const glowPrimary = document.getElementById("glow-primary");
  const profileStage = document.getElementById("profile-stage");
  const profileTiltRig = document.getElementById("profile-tilt-rig");
  const profileFrame = document.getElementById("profile-frame");
  const profileImage = document.getElementById("profile-image");
  const aboutImage = document.getElementById("about-image");
  const aboutVisualStage = document.getElementById("about-visual-stage");
  const aboutGlassFrame = document.getElementById("about-glass-frame");
  const heroSectionEl = document.getElementById("hero");
  const heroContentEl = document.querySelector(".hero-content");
  const heroVisualColEl = document.querySelector(".hero-visual-column");
  const specialtyRotator = document.getElementById("specialty-rotator");
  const copyEmailBtn = document.getElementById("btn-copy-email");
  const copyEmailLabel = document.getElementById("copy-email-label");
  const toast = document.getElementById("interaction-toast");
  const toastMessage = document.getElementById("toast-message");
  const toastClose = document.getElementById("toast-close");
  const particlesCanvas = document.getElementById("particles-canvas");
  const floatingNodes = Array.from(
    document.querySelectorAll(".floating-node[data-parallax]")
  );

  // ---------------------------------------------------------------------------
  // 1. CINEMATIC ~2S GSAP INTRO SEQUENCE ("ENTER THE WORLD OF DNYL") & HERO SYNC
  //    7-Step Opening Choreography (~2.1s total, visible by default on every load):
  //    1. 0.00s: Full-screen dark cinematic background (#030408, z-index: 9990)
  //    2. 0.04s: Thin glowing horizon line draws across the screen
  //    3. 0.10s: DNYL. brand mark & SVG chamfered signature frame reveal
  //    4. 0.30s: "DANIYAL HAYAT" animates into view with staggered masked chars
  //    5. 0.68s: Real professional title ("Full-Stack Developer & Creative Builder")
  //    6. 0.85s: Subtle specular light sweep crosses the screen
  //    7. 1.52s–2.12s: Intro stage exits first (preventing duplicate name headings),
  //       then split curtains part seamlessly to reveal the coordinated Hero section
  // ---------------------------------------------------------------------------
  const INTRO_SESSION_KEY = "dnyl_portfolio_intro_seen_v1";

  function initPageLoadSequence() {
    const introEl = document.getElementById("dnyl-cinematic-intro");
    const skipBtn = document.getElementById("intro-skip-btn");
    const progressReadout = document.getElementById("intro-progress-readout");
    const isReducedMotion = Boolean(
      window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
    const introChars = introEl
      ? Array.from(introEl.querySelectorAll(".intro-char"))
      : [];

    introChars.forEach((ch, idx) => {
      ch.style.setProperty("--intro-char-idx", String(idx));
    });

    // Clear any legacy stored flags that could hide or skip the intro
    try {
      sessionStorage.removeItem(INTRO_SESSION_KEY);
      localStorage.removeItem(INTRO_SESSION_KEY);
    } catch {
      // Ignore storage access restrictions
    }

    let introFinished = false;
    let heroRevealed = false;
    let masterIntroTl = null;
    const activeTimers = [];

    function scheduleTimer(fn, delayMs) {
      const id = window.setTimeout(fn, delayMs);
      activeTimers.push(id);
      return id;
    }

    function clearAllIntroTimers() {
      while (activeTimers.length > 0) {
        window.clearTimeout(activeTimers.pop());
      }
    }

    function revealHeroNow() {
      if (heroRevealed) return;
      heroRevealed = true;
      body.classList.remove("is-loading");
      body.classList.add("is-loaded");
      window.dispatchEvent(new CustomEvent("dnyl:hero-reveal"));

      scheduleTimer(() => {
        body.classList.add("tilt-ready", "motion-ready");
      }, 950);
    }

    if (!introEl) {
      revealHeroNow();
      return;
    }

    // Ensure intro element starts clean without stale classes or inline hiding
    introEl.classList.remove(
      "is-complete",
      "is-removed",
      "is-exiting",
      "gsap-intro-active",
      "scene-void",
      "scene-signature",
      "scene-name",
      "scene-identity"
    );
    introEl.style.removeProperty("display");
    introEl.style.removeProperty("opacity");
    introEl.style.removeProperty("visibility");
    introEl.setAttribute("aria-hidden", "false");

    // Optional explicit URL parameter (?skipIntro=1) for automated testing bypass
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("skipIntro") === "1") {
      introEl.classList.add("is-complete", "is-removed");
      introEl.setAttribute("aria-hidden", "true");
      revealHeroNow();
      return;
    }

    // Subtle Desktop Pointer Parallax Inside Intro Stage (Cleaned up on exit)
    function onIntroPointerMove(event) {
      if (introFinished || isReducedMotion) return;
      const normX = event.clientX / Math.max(1, window.innerWidth) - 0.5;
      const normY = event.clientY / Math.max(1, window.innerHeight) - 0.5;
      introEl.style.setProperty(
        "--intro-parallax-x",
        `${(normX * -24).toFixed(1)}px`
      );
      introEl.style.setProperty(
        "--intro-parallax-y",
        `${(normY * -18).toFixed(1)}px`
      );
      introEl.style.setProperty(
        "--intro-stage-x",
        `${(normX * 10).toFixed(1)}px`
      );
      introEl.style.setProperty(
        "--intro-stage-y",
        `${(normY * 8).toFixed(1)}px`
      );
    }

    if (isFinePointer && !isReducedMotion) {
      window.addEventListener("mousemove", onIntroPointerMove, {
        passive: true
      });
    }

    function finalizeIntroOverlay() {
      if (introFinished) return;
      introFinished = true;
      clearAllIntroTimers();

      if (isFinePointer) {
        window.removeEventListener("mousemove", onIntroPointerMove);
      }
      window.removeEventListener("keydown", onIntroKeyDown);

      revealHeroNow();
      introEl.classList.add("is-complete");
      introEl.setAttribute("aria-hidden", "true");

      scheduleTimer(() => {
        introEl.classList.add("is-removed");
      }, 220);
    }

    function runStaticOrCssFallbackIntro(durationMs) {
      introEl.classList.remove("gsap-intro-active");
      introEl.classList.add(
        "scene-void",
        "scene-signature",
        "scene-name",
        "scene-identity"
      );
      scheduleTimer(() => {
        introEl.classList.add("is-exiting");
        revealHeroNow();
      }, Math.max(400, durationMs - 380));
      scheduleTimer(() => {
        finalizeIntroOverlay();
      }, durationMs);
    }

    // Hard Fail-Safe Watchdog registered upfront: guarantees is-loading -> is-loaded always completes
    scheduleTimer(() => {
      if (!introFinished) {
        finalizeIntroOverlay();
      }
    }, 3000);

    function skipIntroImmediately() {
      if (introFinished) return;
      clearAllIntroTimers();

      if (masterIntroTl) {
        masterIntroTl.kill();
        masterIntroTl = null;
      }

      if (progressReadout) {
        progressReadout.textContent = "SEQ // 05 — ENTERING PORTFOLIO";
      }

      introEl.classList.add("is-exiting");
      revealHeroNow();

      const gsapInstance = window.gsap;
      if (gsapInstance && !isReducedMotion) {
        const topCurtain = document.getElementById("intro-curtain-top");
        const bottomCurtain = document.getElementById("intro-curtain-bottom");
        const stageEl = document.getElementById("intro-stage");
        const voidLayer = document.getElementById("intro-void-layer");

        gsapInstance
          .timeline({
            onComplete: finalizeIntroOverlay
          })
          .to(
            [stageEl, voidLayer],
            {
              opacity: 0,
              scale: 1.03,
              duration: 0.2,
              ease: "power2.out"
            },
            0
          )
          .to(
            topCurtain,
            {
              x: 0,
              y: 0,
              yPercent: -102,
              duration: 0.36,
              ease: "expo.inOut"
            },
            0
          )
          .to(
            bottomCurtain,
            {
              x: 0,
              y: 0,
              yPercent: 102,
              duration: 0.36,
              ease: "expo.inOut"
            },
            0
          );
      } else {
        finalizeIntroOverlay();
      }
    }

    function onIntroKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        skipIntroImmediately();
      }
    }

    window.addEventListener("keydown", onIntroKeyDown);

    if (skipBtn && skipBtn.dataset.skipBound !== "true") {
      skipBtn.dataset.skipBound = "true";
      skipBtn.addEventListener("click", (event) => {
        event.preventDefault();
        skipIntroImmediately();
      });
    }

    // Reduced Motion Mode: Render immediate, fully visible static intro for 1.2s, then transition cleanly to Hero
    if (isReducedMotion) {
      introEl.classList.add(
        "scene-void",
        "scene-signature",
        "scene-name",
        "scene-identity"
      );
      if (progressReadout) {
        progressReadout.textContent =
          "SEQ // REDUCED MOTION — DANIYAL HAYAT PORTFOLIO";
      }
      scheduleTimer(() => {
        finalizeIntroOverlay();
      }, 1200);
      return;
    }

    const gsapInstance = window.gsap;

    if (gsapInstance) {
      try {
        introEl.classList.add("gsap-intro-active", "scene-void");

        const topCurtain = document.getElementById("intro-curtain-top");
        const bottomCurtain = document.getElementById("intro-curtain-bottom");
        const voidLayer = document.getElementById("intro-void-layer");
        const voidRadial = introEl.querySelector(".intro-void-radial");
        const voidBeam = introEl.querySelector(".intro-void-beam");
        const geoLineH = introEl.querySelector(".intro-geo-line--h");
        const geoLineV = introEl.querySelector(".intro-geo-line--v");
        const geoCorners = introEl.querySelectorAll(".intro-geo-corner");
        const geoCoords = introEl.querySelectorAll(".intro-geo-coord");
        const bgMonolith = document.getElementById("intro-bg-monolith");
        const stageEl = document.getElementById("intro-stage");

        // Step 2 & 3: Thin glowing line + DNYL brand mark
        const horizonLine = document.getElementById("intro-horizon-line");
        const svgFramePath = introEl.querySelector(".intro-svg-frame-path");
        const svgAccentPath = introEl.querySelector(".intro-svg-accent-path");
        const dnylGlyphs = introEl.querySelectorAll(
          ".intro-dnyl-glyph, .intro-dnyl-dot"
        );
        const signatureSweep = document.getElementById("intro-signature-sweep");

        // Step 4: "DANIYAL HAYAT" staggered masked typography
        const kickerInner = introEl.querySelector(".intro-kicker-inner");
        const nameLightSweep = document.getElementById("intro-name-light-sweep");

        // Step 5: Real professional title masked typography
        const identityLabel = document.getElementById("intro-identity-label");
        const identitySep = document.getElementById("intro-identity-sep");
        const titleWords = introEl.querySelectorAll(".intro-title-word");
        const domainsInner = introEl.querySelector(".intro-domains-inner");
        const identityUnderline = document.getElementById(
          "intro-identity-underline"
        );

        // Reset any residual pixel transforms from CSS translate3d percentages before applying xPercent/yPercent
        gsapInstance.set([topCurtain, bottomCurtain], {
          x: 0,
          y: 0,
          xPercent: 0,
          yPercent: 0,
          scaleY: 1
        });
        gsapInstance.set([stageEl, voidLayer], {
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1
        });
        gsapInstance.set(voidRadial, {
          x: 0,
          y: 0,
          xPercent: -50,
          yPercent: -50,
          scale: 0.86,
          opacity: 0
        });
        gsapInstance.set(voidBeam, {
          x: 0,
          y: 0,
          xPercent: -45,
          yPercent: 0,
          rotation: -22,
          opacity: 0
        });
        gsapInstance.set(geoLineH, { x: 0, y: 0, scaleX: 0, opacity: 0 });
        gsapInstance.set(geoLineV, { x: 0, y: 0, scaleY: 0, opacity: 0 });
        gsapInstance.set(geoCorners, { opacity: 0 });
        gsapInstance.set(geoCoords, { x: 0, y: 6, opacity: 0 });
        gsapInstance.set(bgMonolith, {
          x: 0,
          y: 0,
          xPercent: -50,
          yPercent: -50,
          scale: 0.95,
          opacity: 0
        });

        gsapInstance.set(horizonLine, { x: 0, y: 0, scaleX: 0, opacity: 0 });
        gsapInstance.set(svgFramePath, {
          strokeDasharray: 640,
          strokeDashoffset: 640
        });
        gsapInstance.set(svgAccentPath, {
          strokeDasharray: 60,
          strokeDashoffset: 60
        });
        gsapInstance.set(dnylGlyphs, {
          x: 0,
          y: 0,
          yPercent: 112,
          opacity: 0,
          filter: "blur(4px)"
        });
        gsapInstance.set(signatureSweep, {
          x: 0,
          y: 0,
          xPercent: -150,
          skewX: -20,
          opacity: 0
        });

        gsapInstance.set(kickerInner, {
          x: 0,
          y: 0,
          yPercent: 110,
          opacity: 0
        });
        gsapInstance.set(introChars, {
          x: 0,
          y: 0,
          yPercent: 112,
          rotateZ: 1.6,
          opacity: 0,
          filter: "blur(5px)"
        });
        gsapInstance.set(nameLightSweep, {
          x: 0,
          y: 0,
          xPercent: -160,
          skewX: -22,
          opacity: 0
        });

        gsapInstance.set(identityLabel, {
          x: 0,
          y: 0,
          yPercent: 110,
          opacity: 0
        });
        gsapInstance.set(identitySep, { x: 0, y: 0, scaleX: 0, opacity: 0 });
        gsapInstance.set(titleWords, {
          x: 0,
          y: 0,
          yPercent: 112,
          opacity: 0,
          filter: "blur(3px)"
        });
        gsapInstance.set(domainsInner, {
          x: 0,
          y: 0,
          yPercent: 110,
          opacity: 0
        });
        gsapInstance.set(identityUnderline, { x: 0, y: 0, scaleX: 0 });

        // Build the ~2.1s GSAP Master Timeline
        masterIntroTl = gsapInstance.timeline({
          defaults: { ease: "power4.out" },
          onComplete: finalizeIntroOverlay
        });

        // --- STEP 1, 2 & 3 (0.00s – 0.55s): DARK VOID, GLOWING LINE & DNYL BRAND MARK ---
        masterIntroTl
          .call(
            () => {
              introEl.classList.add("scene-void", "scene-signature");
              if (progressReadout) {
                progressReadout.textContent = "SEQ // 01 — SIGNATURE · DNYL";
              }
            },
            null,
            0
          )
          .to(
            voidRadial,
            {
              x: 0,
              y: 0,
              xPercent: -50,
              yPercent: -50,
              scale: 1.04,
              opacity: 1,
              duration: 0.85,
              ease: "power3.out"
            },
            0
          )
          .to(
            [geoLineH, geoLineV],
            {
              scaleX: 1,
              scaleY: 1,
              opacity: 1,
              duration: 0.55,
              ease: "expo.out"
            },
            0.02
          )
          .to(
            geoCorners,
            {
              opacity: 1,
              duration: 0.35,
              stagger: 0.03,
              ease: "power2.out"
            },
            0.05
          )
          .to(
            geoCoords,
            {
              x: 0,
              y: 0,
              opacity: 1,
              duration: 0.35,
              ease: "power2.out"
            },
            0.06
          )
          .to(
            bgMonolith,
            {
              x: 0,
              y: 0,
              xPercent: -50,
              yPercent: -50,
              scale: 1,
              opacity: 1,
              duration: 0.9,
              ease: "power3.out"
            },
            0.04
          )
          .to(
            horizonLine,
            {
              scaleX: 1,
              opacity: 0.92,
              duration: 0.44,
              ease: "expo.out"
            },
            0.04
          )
          .to(
            svgFramePath,
            {
              strokeDashoffset: 0,
              duration: 0.52,
              ease: "expo.out"
            },
            0.08
          )
          .to(
            svgAccentPath,
            {
              strokeDashoffset: 0,
              duration: 0.38,
              ease: "power3.out"
            },
            0.18
          )
          .to(
            dnylGlyphs,
            {
              x: 0,
              y: 0,
              yPercent: 0,
              opacity: 1,
              filter: "blur(0px)",
              duration: 0.44,
              stagger: 0.035,
              ease: "power4.out"
            },
            0.1
          )
          .to(
            signatureSweep,
            {
              x: 0,
              y: 0,
              xPercent: 280,
              skewX: -20,
              opacity: 1,
              duration: 0.52,
              ease: "power2.inOut"
            },
            0.18
          );

        // --- STEP 4 (0.30s – 0.95s): "DANIYAL HAYAT" STAGGERED TYPOGRAPHY REVEAL ---
        masterIntroTl
          .call(
            () => {
              introEl.classList.add("scene-name");
              if (progressReadout) {
                progressReadout.textContent = "SEQ // 02 — DANIYAL HAYAT";
              }
            },
            null,
            0.3
          )
          .to(
            kickerInner,
            {
              x: 0,
              y: 0,
              yPercent: 0,
              opacity: 1,
              duration: 0.38,
              ease: "power3.out"
            },
            0.3
          )
          .to(
            introChars,
            {
              x: 0,
              y: 0,
              yPercent: 0,
              rotateZ: 0,
              opacity: 1,
              filter: "blur(0px)",
              duration: 0.54,
              stagger: 0.02,
              ease: "power4.out"
            },
            0.34
          );

        // --- STEP 5 & 6 (0.68s – 1.50s): REAL PROFESSIONAL TITLE + LIGHT SWEEP ---
        masterIntroTl
          .call(
            () => {
              introEl.classList.add("scene-identity");
              if (progressReadout) {
                progressReadout.textContent =
                  "SEQ // 03 — FULL-STACK DEVELOPER & CREATIVE BUILDER";
              }
            },
            null,
            0.68
          )
          .to(
            identityLabel,
            {
              x: 0,
              y: 0,
              yPercent: 0,
              opacity: 1,
              duration: 0.38,
              ease: "power3.out"
            },
            0.68
          )
          .to(
            identitySep,
            {
              scaleX: 1,
              opacity: 1,
              duration: 0.36,
              ease: "expo.out"
            },
            0.72
          )
          .to(
            titleWords,
            {
              x: 0,
              y: 0,
              yPercent: 0,
              opacity: 1,
              filter: "blur(0px)",
              duration: 0.44,
              stagger: 0.036,
              ease: "power4.out"
            },
            0.7
          )
          .to(
            domainsInner,
            {
              x: 0,
              y: 0,
              yPercent: 0,
              opacity: 1,
              duration: 0.4,
              ease: "power3.out"
            },
            0.84
          )
          .to(
            identityUnderline,
            {
              scaleX: 1,
              duration: 0.46,
              ease: "expo.out"
            },
            0.88
          )
          .to(
            nameLightSweep,
            {
              x: 0,
              y: 0,
              xPercent: 360,
              skewX: -22,
              opacity: 1,
              duration: 0.68,
              ease: "power2.inOut"
            },
            0.82
          )
          .to(
            voidBeam,
            {
              x: 0,
              y: 0,
              xPercent: 185,
              yPercent: 0,
              rotation: -22,
              opacity: 1,
              duration: 1.35,
              ease: "power2.out"
            },
            0.2
          );

        // --- STEP 7 (1.52s – 2.18s): SEAMLESS NON-OVERLAPPING TRANSITION INTO HERO ---
        // First (1.52s–1.78s): Fade & elevate out the intro stage typography so two "DANIYAL HAYAT" headings never overlap
        masterIntroTl
          .to(
            stageEl,
            {
              y: -18,
              scale: 1.03,
              opacity: 0,
              duration: 0.26,
              ease: "power3.in"
            },
            1.52
          )
          .to(
            voidLayer,
            {
              scale: 1.05,
              opacity: 0,
              duration: 0.32,
              ease: "power2.inOut"
            },
            1.54
          )
          // Next (1.68s–2.18s): Part the split curtains and trigger the coordinated Hero entrance
          .call(
            () => {
              if (progressReadout) {
                progressReadout.textContent = "SEQ // 04 — ENTERING PORTFOLIO";
              }
              introEl.classList.add("is-exiting");
              revealHeroNow();
            },
            null,
            1.68
          )
          .to(
            topCurtain,
            {
              x: 0,
              y: 0,
              yPercent: -102,
              scaleY: 0.96,
              duration: 0.5,
              ease: "expo.inOut"
            },
            1.68
          )
          .to(
            bottomCurtain,
            {
              x: 0,
              y: 0,
              yPercent: 102,
              scaleY: 0.96,
              duration: 0.5,
              ease: "expo.inOut"
            },
            1.68
          );
      } catch {
        runStaticOrCssFallbackIntro(2000);
      }
    } else {
      // Fallback if GSAP script is unavailable
      requestAnimationFrame(() => {
        runStaticOrCssFallbackIntro(2100);
      });
    }

    // Expose on-demand Replay Intro capability for Command Palette (⌘K) & Footer button
    window.replayDnylIntro = function () {
      if (!introEl) return;
      clearAllIntroTimers();
      if (masterIntroTl) {
        masterIntroTl.kill();
        masterIntroTl = null;
      }
      window.scrollTo({ top: 0, behavior: "auto" });
      introFinished = false;
      heroRevealed = false;
      body.classList.remove("is-loaded", "tilt-ready", "motion-ready");
      body.classList.add("is-loading");
      initPageLoadSequence();
    };
  }

  // ---------------------------------------------------------------------------
  // 2. RESILIENT PROFILE IMAGE FALLBACK HANDLER
  // ---------------------------------------------------------------------------
  [profileImage, aboutImage].forEach((imgEl) => {
    if (imgEl) {
      imgEl.addEventListener("error", () => {
        imgEl.style.opacity = "0";
      });
    }
  });

  // ---------------------------------------------------------------------------
  // 3. REAL SPECIALTY ROTATOR (From Daniyal Hayat's Existing Portfolio)
  // ---------------------------------------------------------------------------
  const realSpecialties = [
    "Full-Stack Web Platforms (React & TypeScript)",
    "Native Android Applications (Kotlin & Android SDK)",
    "Generative AI Systems (Google Gemini & AI Studio)",
    "Interactive UI/UX & Motion Engineering"
  ];

  let specialtyIndex = 0;
  if (specialtyRotator && !prefersReducedMotion) {
    window.setInterval(() => {
      if (document.hidden) return;
      specialtyRotator.classList.add("is-switching");
      window.setTimeout(() => {
        specialtyIndex = (specialtyIndex + 1) % realSpecialties.length;
        specialtyRotator.textContent = realSpecialties[specialtyIndex];
        specialtyRotator.classList.remove("is-switching");
      }, 280);
    }, 3400);
  }

  // ---------------------------------------------------------------------------
  // 4. THEME SYSTEM (DARK / LIGHT MODE + LOCALSTORAGE + PREFERS-COLOR-SCHEME)
  //    & NAVIGATION SCROLL PROGRESS + MOBILE HAMBURGER MENU
  // ---------------------------------------------------------------------------
  const THEME_STORAGE_KEY = "daniyal_portfolio_theme";
  const themeToggleBtn = document.getElementById("theme-toggle");
  const metaThemeColor = document.getElementById("meta-theme-color");
  const scrollProgressBar = document.getElementById("scroll-progress-bar");

  function applyTheme(theme, persistManual) {
    const validTheme = theme === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", validTheme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute(
        "aria-pressed",
        String(validTheme === "light")
      );
      themeToggleBtn.setAttribute(
        "title",
        validTheme === "light"
          ? "Switch to Dark Mode"
          : "Switch to Light Mode"
      );
    }
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        validTheme === "light" ? "#f5f4ee" : "#05060a"
      );
    }
    if (persistManual) {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, validTheme);
      } catch {
        // Ignore storage restrictions
      }
    }
  }

  // Initialize theme state on load
  (function initThemeState() {
    let storedTheme = null;
    try {
      storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    } catch {
      storedTheme = null;
    }

    if (storedTheme === "light" || storedTheme === "dark") {
      applyTheme(storedTheme, false);
    } else {
      const prefersLight =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: light)").matches;
      applyTheme(prefersLight ? "light" : "dark", false);
    }

    // Listen for system prefers-color-scheme changes if no manual override exists
    if (window.matchMedia) {
      const colorSchemeQuery = window.matchMedia(
        "(prefers-color-scheme: light)"
      );
      const handleSystemSchemeChange = (e) => {
        try {
          const manual = localStorage.getItem(THEME_STORAGE_KEY);
          if (manual !== "light" && manual !== "dark") {
            applyTheme(e.matches ? "light" : "dark", false);
          }
        } catch {
          applyTheme(e.matches ? "light" : "dark", false);
        }
      };
      if (colorSchemeQuery.addEventListener) {
        colorSchemeQuery.addEventListener("change", handleSystemSchemeChange);
      }
    }
  })();

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const current =
        document.documentElement.getAttribute("data-theme") === "light"
          ? "light"
          : "dark";
      const next = current === "light" ? "dark" : "light";
      applyTheme(next, true);
      showToast(
        next === "light"
          ? "Switched to Warm Ivory Light Mode (saved to localStorage)."
          : "Switched to Obsidian Dark Mode (saved to localStorage)."
      );
    });
  }

  const trackedSections = [
    "hero",
    "about",
    "skills",
    "projects",
    "experience",
    "services",
    "contact"
  ];

  function updateHeaderScroll() {
    const scrollY = window.scrollY;
    if (header) {
      if (scrollY > 20) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    }

    // Update 60fps transform-based scroll progress bar
    if (scrollProgressBar) {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const ratio =
        docHeight > 0 ? Math.max(0, Math.min(1, scrollY / docHeight)) : 0;
      scrollProgressBar.style.transform = `scaleX(${ratio.toFixed(4)})`;
    }

    // Unified ScrollSpy across all 7 navigation sections
    const viewportMid = scrollY + window.innerHeight * 0.34;
    let activeId = "hero";
    for (let i = 0; i < trackedSections.length; i++) {
      const secEl = document.getElementById(trackedSections[i]);
      if (secEl && secEl.offsetTop <= viewportMid) {
        activeId = trackedSections[i];
      }
    }

    document
      .querySelectorAll(".nav-link, .mobile-nav-link")
      .forEach((navItem) => {
        const href = navItem.getAttribute("href");
        navItem.classList.toggle("is-active", href === `#${activeId}`);
      });
  }

  window.addEventListener("scroll", updateHeaderScroll, { passive: true });
  updateHeaderScroll();

  function setMobileMenuState(isOpen) {
    if (!header || !menuToggle || !mobileDrawer) return;
    header.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    mobileDrawer.setAttribute("aria-hidden", String(!isOpen));
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      const expanded = menuToggle.getAttribute("aria-expanded") === "true";
      setMobileMenuState(!expanded);
    });
  }

  // ---------------------------------------------------------------------------
  // 5. SMOOTH SECTION NAVIGATION & EMAIL COPY
  // ---------------------------------------------------------------------------
  let toastTimer = null;

  function showToast(message) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add("is-visible");
    toast.setAttribute("aria-hidden", "false");

    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      hideToast();
    }, 5200);
  }

  function hideToast() {
    if (!toast) return;
    toast.classList.remove("is-visible");
    toast.setAttribute("aria-hidden", "true");
  }

  if (toastClose) {
    toastClose.addEventListener("click", hideToast);
  }

  // Handle section anchor links smoothly & close mobile menu
  const sectionLinks = document.querySelectorAll(
    'a[href^="#"]:not(.skip-link)'
  );
  sectionLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetHref = link.getAttribute("href");
      setMobileMenuState(false);

      if (!targetHref || targetHref === "#") return;
      const targetEl = document.querySelector(targetHref);
      if (targetEl) {
        event.preventDefault();
        targetEl.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start"
        });
      }
    });
  });

  // Copy real email button
  if (copyEmailBtn && copyEmailLabel) {
    copyEmailBtn.addEventListener("click", async () => {
      const email =
        copyEmailBtn.getAttribute("data-email") || "mdaniyalhayyat@gmail.com";
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(email);
        }
        copyEmailLabel.textContent = "Copied: " + email;
        showToast("Copied mdaniyalhayyat@gmail.com to your clipboard.");
        window.setTimeout(() => {
          copyEmailLabel.textContent = email;
        }, 2400);
      } catch (_err) {
        showToast("Direct email: mdaniyalhayyat@gmail.com");
      }
    });
  }

  // Keyboard Escape closes mobile drawer & toast
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMobileMenuState(false);
      hideToast();
    }
  });

  // ---------------------------------------------------------------------------
  // 6. UNIFIED 60FPS MOUSE ENGINE (CURSOR, PARALLAX, 3D TILT <= 5 DEG, MAGNETIC)
  // ---------------------------------------------------------------------------
  if (isFinePointer && !prefersReducedMotion) {
    let mouseX = window.innerWidth * 0.65;
    let mouseY = window.innerHeight * 0.45;
    let ringX = mouseX;
    let ringY = mouseY;
    let glowX = mouseX;
    let glowY = mouseY;

    // Normalized viewport coordinates (-1 to +1)
    let normX = 0;
    let normY = 0;
    let smoothNormX = 0;
    let smoothNormY = 0;

    // Profile tilt state (Strictly clamped to max 5 degrees)
    const MAX_TILT_DEG = 5;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;

    window.addEventListener(
      "mousemove",
      (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;

        normX = (mouseX / window.innerWidth - 0.5) * 2;
        normY = (mouseY / window.innerHeight - 0.5) * 2;

        if (cursorDot) {
          cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        }

        // Compute subtle 3D rotation relative to profile card center (Max 5 deg)
        if (profileStage && body.classList.contains("tilt-ready")) {
          const rect = profileStage.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          const relX = (mouseX - centerX) / (window.innerWidth * 0.5);
          const relY = (mouseY - centerY) / (window.innerHeight * 0.5);

          targetTiltY = Math.max(
            -MAX_TILT_DEG,
            Math.min(MAX_TILT_DEG, relX * MAX_TILT_DEG)
          );
          targetTiltX = Math.max(
            -MAX_TILT_DEG,
            Math.min(MAX_TILT_DEG, -relY * MAX_TILT_DEG)
          );

          // Update specular glare coordinates inside profile frame
          if (profileFrame) {
            const localX = ((mouseX - rect.left) / rect.width) * 100;
            const localY = ((mouseY - rect.top) / rect.height) * 100;
            profileFrame.style.setProperty(
              "--glare-x",
              `${Math.max(0, Math.min(100, localX)).toFixed(1)}%`
            );
            profileFrame.style.setProperty(
              "--glare-y",
              `${Math.max(0, Math.min(100, localY)).toFixed(1)}%`
            );
          }
        }
      },
      { passive: true }
    );

    // Normalize cursor interactive labels strictly to VIEW, OPEN, CLICK, DRAG
    function normalizeCursorLabel(raw) {
      if (!raw) return "";
      const upper = raw.trim().toUpperCase();
      if (upper === "VIEW" || upper === "OPEN" || upper === "CLICK" || upper === "DRAG") {
        return upper;
      }
      if (upper === "SIGNAL") return "DRAG";
      if (
        upper.includes("LIVE") ||
        upper.includes("PLAY") ||
        upper.includes("INSPECT") ||
        upper.includes("EXPLORE") ||
        upper.includes("//")
      ) {
        return "VIEW";
      }
      if (
        upper.includes("GITHUB") ||
        upper.includes("WEB") ||
        upper.includes("EMAIL") ||
        upper.includes("MAIL") ||
        upper.includes("CALL") ||
        upper.includes("DIAL")
      ) {
        return "OPEN";
      }
      return "CLICK";
    }

    // Interactive cursor hover states
    const interactiveElements = document.querySelectorAll(
      "a, button, .floating-node, .profile-frame, .about-info-card, .about-float-card, .about-glass-frame, .skill-card, .skill-filter-btn, .project-monolith, .project-filter-btn, .archive-card, .timeline-card, .currently-card, .service-card, .srv-stage-tab, .service-action-link, .contact-orb-card, .contact-channel-item, .contact-social-btn, .contact-input, .channel-copy-btn, .footer-back-top-btn, .footer-nav-link, .footer-ext-link, .footer-contact-link, .footer-monument-wrap"
    );
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        body.classList.add("cursor-hover");
        const rawLabel = el.getAttribute("data-cursor-text");
        const labelText = normalizeCursorLabel(rawLabel);
        if (labelText && cursorLabel) {
          cursorLabel.textContent = labelText;
          body.classList.add("cursor-labeled");
        }
      });

      el.addEventListener("mouseleave", () => {
        body.classList.remove("cursor-hover", "cursor-labeled");
        if (cursorLabel) {
          cursorLabel.textContent = "";
        }
      });
    });

    // Subtle Magnetic Effect on CTA buttons (Strictly clamped to max 8px so clicking is effortless)
    const MAX_MAGNETIC_PX = 8;
    const magneticElements = document.querySelectorAll("[data-magnetic]");
    magneticElements.forEach((el) => {
      const strength = parseFloat(el.getAttribute("data-magnetic") || "0.22");

      el.addEventListener("mousemove", (event) => {
        const rect = el.getBoundingClientRect();
        const offsetX = event.clientX - (rect.left + rect.width / 2);
        const offsetY = event.clientY - (rect.top + rect.height / 2);
        const moveX = Math.max(
          -MAX_MAGNETIC_PX,
          Math.min(MAX_MAGNETIC_PX, offsetX * strength)
        );
        const moveY = Math.max(
          -MAX_MAGNETIC_PX,
          Math.min(MAX_MAGNETIC_PX, offsetY * strength)
        );
        el.style.transform = `translate3d(${moveX.toFixed(2)}px, ${moveY.toFixed(
          2
        )}px, 0)`;
      });

      el.addEventListener("mouseleave", () => {
        el.style.transform = "translate3d(0, 0, 0)";
      });
    });

    // Single Master requestAnimationFrame Loop (Pauses automatically when tab is hidden)
    function renderInteractiveLoop() {
      if (document.hidden) {
        requestAnimationFrame(renderInteractiveLoop);
        return;
      }
      // Smooth cursor ring interpolation
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (cursorRing) {
        cursorRing.style.transform = `translate3d(${ringX.toFixed(
          2
        )}px, ${ringY.toFixed(2)}px, 0)`;
      }

      // Smooth ambient spotlight glow interpolation
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      if (cursorGlow) {
        cursorGlow.style.transform = `translate3d(${glowX.toFixed(
          1
        )}px, ${glowY.toFixed(1)}px, 0)`;
      }

      // Smooth normalized coordinates for background & floating nodes
      smoothNormX += (normX - smoothNormX) * 0.06;
      smoothNormY += (normY - smoothNormY) * 0.06;

      if (backdropGrid) {
        backdropGrid.style.transform = `translate3d(${(
          smoothNormX * -10
        ).toFixed(2)}px, ${(smoothNormY * -10).toFixed(2)}px, 0)`;
      }

      if (glowPrimary) {
        glowPrimary.style.transform = `translate3d(${(smoothNormX * 18).toFixed(
          2
        )}px, ${(smoothNormY * 18).toFixed(2)}px, 0)`;
      }

      // Smooth 3D tilt on profile image rig (strictly <= 5deg)
      if (profileTiltRig && body.classList.contains("tilt-ready")) {
        currentTiltX += (targetTiltX - currentTiltX) * 0.09;
        currentTiltY += (targetTiltY - currentTiltY) * 0.09;
        profileTiltRig.style.transform = `rotateX(${currentTiltX.toFixed(
          2
        )}deg) rotateY(${currentTiltY.toFixed(2)}deg) translate3d(${(
          smoothNormX * -6
        ).toFixed(2)}px, ${(smoothNormY * -6).toFixed(2)}px, 0)`;
      }

      // Floating skill nodes parallax
      if (body.classList.contains("motion-ready")) {
        floatingNodes.forEach((node) => {
          const factor = parseFloat(node.getAttribute("data-parallax") || "1");
          const moveX = smoothNormX * 9 * factor;
          const moveY = smoothNormY * 9 * factor;
          node.style.transform = `translate3d(${moveX.toFixed(
            2
          )}px, ${moveY.toFixed(2)}px, 0)`;
        });
      }

      requestAnimationFrame(renderInteractiveLoop);
    }

    requestAnimationFrame(renderInteractiveLoop);
  }

  // ---------------------------------------------------------------------------
  // 7. INTERACTIVE SPATIAL CONSTELLATION & NEURAL FILAMENT CANVAS
  //    (3D Depth-Sorted Nodes, Mouse Proximity Filaments & Intersection Pause)
  // ---------------------------------------------------------------------------
  function initParticlesCanvas() {
    if (!particlesCanvas || prefersReducedMotion) return;
    const ctx = particlesCanvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let isHeroVisible = true;
    let pointerX = -9999;
    let pointerY = -9999;

    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      particlesCanvas.width = width;
      particlesCanvas.height = height;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });

    if (isFinePointer) {
      window.addEventListener(
        "mousemove",
        (e) => {
          pointerX = e.clientX;
          pointerY = e.clientY;
        },
        { passive: true }
      );
    }

    const particleCount = Math.min(36, Math.max(18, Math.floor(window.innerWidth / 42)));
    const particles = Array.from({ length: particleCount }, (_, idx) => {
      const depth = Math.random() * 0.75 + 0.25; // 0.25 (far) to 1.0 (near)
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        z: depth,
        radius: (Math.random() * 1.35 + 0.55) * depth,
        vx: (Math.random() - 0.5) * 0.24 * depth,
        vy: (-Math.random() * 0.22 - 0.04) * depth,
        alpha: (Math.random() * 0.36 + 0.14) * depth,
        isAccent: idx % 4 === 0
      };
    });

    // Pause particle rendering when hero is scrolled out of view
    const heroSection = document.getElementById("hero");
    if ("IntersectionObserver" in window && heroSection) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isHeroVisible = entry.isIntersecting;
          });
        },
        { threshold: 0.05 }
      );
      observer.observe(heroSection);
    }

    function drawParticles() {
      if (isHeroVisible && !document.hidden) {
        ctx.clearRect(0, 0, width, height);
        const isLight =
          document.documentElement.getAttribute("data-theme") === "light";
        const linkDist = Math.min(145, width * 0.12);

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;

          // Subtle mouse repulsion / orbital drift on desktop
          if (isFinePointer && pointerX > 0) {
            const dxMouse = p.x - pointerX;
            const dyMouse = p.y - pointerY;
            const distSq = dxMouse * dxMouse + dyMouse * dyMouse;
            if (distSq < 22500 && distSq > 1) {
              const dist = Math.sqrt(distSq);
              const force = ((150 - dist) / 150) * 0.32 * p.z;
              p.x += (dxMouse / dist) * force;
              p.y += (dyMouse / dist) * force;
            }
          }

          if (p.y < -12) p.y = height + 12;
          if (p.y > height + 12) p.y = -12;
          if (p.x < -12) p.x = width + 12;
          if (p.x > width + 12) p.x = -12;

          // Connect nearby constellation nodes with delicate filaments
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < linkDist) {
              const lineAlpha = (1 - dist / linkDist) * 0.11 * ((p.z + p2.z) * 0.5);
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = isLight
                ? `rgba(2, 132, 199, ${lineAlpha.toFixed(3)})`
                : `rgba(56, 189, 248, ${lineAlpha.toFixed(3)})`;
              ctx.lineWidth = 0.65;
              ctx.stroke();
            }
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          if (p.isAccent) {
            ctx.fillStyle = isLight
              ? `rgba(2, 132, 199, ${p.alpha})`
              : `rgba(56, 189, 248, ${p.alpha})`;
          } else {
            ctx.fillStyle = isLight
              ? `rgba(30, 41, 59, ${p.alpha * 0.75})`
              : `rgba(226, 232, 240, ${p.alpha})`;
          }
          ctx.fill();
        }
      }
      requestAnimationFrame(drawParticles);
    }

    requestAnimationFrame(drawParticles);
  }

  // ---------------------------------------------------------------------------
  // 8. ABOUT SECTION SCROLL REVEALS, COUNT-UP STATS & SEAMLESS PARALLAX
  // ---------------------------------------------------------------------------
  function animateStatCounter(el) {
    if (!el || el.getAttribute("data-counted") === "true") return;
    el.setAttribute("data-counted", "true");

    const target = parseInt(el.getAttribute("data-count-to") || "0", 10);
    if (prefersReducedMotion || target <= 0) {
      el.textContent = String(target);
      return;
    }

    const duration = 1500;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Smooth easeOutQuart curve (no bounce)
      const eased = 1 - Math.pow(1 - progress, 4);
      const currentVal = Math.round(eased * target);
      el.textContent = String(currentVal);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = String(target);
      }
    }

    requestAnimationFrame(step);
  }

  function initAboutScrollAnimations() {
    const revealNodes = Array.from(
      document.querySelectorAll("[data-scroll-reveal]")
    );
    const statNumbers = Array.from(
      document.querySelectorAll(".about-stat-number[data-count-to]")
    );

    if (prefersReducedMotion) {
      revealNodes.forEach((el) => el.classList.add("is-inview"));
      statNumbers.forEach((el) => {
        el.textContent = el.getAttribute("data-count-to") || "0";
      });
      return;
    }

    if ("IntersectionObserver" in window) {
      const revealObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const target = entry.target;
              target.classList.add("is-inview");

              if (target.getAttribute("data-scroll-reveal") === "stats") {
                statNumbers.forEach((numEl) => animateStatCounter(numEl));
              }

              obs.unobserve(target);
            }
          });
        },
        {
          threshold: 0.16,
          rootMargin: "0px 0px -6% 0px"
        }
      );

      revealNodes.forEach((el) => revealObserver.observe(el));
    } else {
      revealNodes.forEach((el) => el.classList.add("is-inview"));
      statNumbers.forEach((numEl) => animateStatCounter(numEl));
    }

    // Seamless Hero -> About Scroll Transition & Parallax via requestAnimationFrame
    const parallaxElements = Array.from(
      document.querySelectorAll("[data-scroll-parallax]")
    );

    let currentScrollY = window.scrollY;
    let smoothScrollY = currentScrollY;

    window.addEventListener(
      "scroll",
      () => {
        currentScrollY = window.scrollY;
      },
      { passive: true }
    );

    // Subtle 3D tilt on About Visual Frame (Desktop only, max 4 deg)
    let aboutTargetRotX = 0;
    let aboutTargetRotY = 0;
    let aboutCurrRotX = 0;
    let aboutCurrRotY = 0;

    if (isFinePointer && aboutVisualStage && aboutGlassFrame) {
      aboutVisualStage.addEventListener(
        "mousemove",
        (event) => {
          const rect = aboutVisualStage.getBoundingClientRect();
          const relX = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
          const relY = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
          const maxDeg = 4;
          aboutTargetRotY = Math.max(-maxDeg, Math.min(maxDeg, relX * maxDeg));
          aboutTargetRotX = Math.max(-maxDeg, Math.min(maxDeg, -relY * maxDeg));
        },
        { passive: true }
      );

      aboutVisualStage.addEventListener("mouseleave", () => {
        aboutTargetRotX = 0;
        aboutTargetRotY = 0;
      });
    }

    function updateScrollParallaxLoop() {
      smoothScrollY += (currentScrollY - smoothScrollY) * 0.1;
      const vh = window.innerHeight || 800;

      // 1. Subtle Hero recession as user scrolls toward About
      if (heroSectionEl && smoothScrollY < vh * 1.2) {
        const progress = Math.min(1, Math.max(0, smoothScrollY / vh));
        const translateTextY = progress * -34;
        const translateVisualY = progress * -20;
        const heroOpacity = Math.max(0.18, 1 - progress * 0.72);

        if (heroContentEl) {
          heroContentEl.style.transform = `translate3d(0, ${translateTextY.toFixed(
            2
          )}px, 0)`;
          heroContentEl.style.opacity = heroOpacity.toFixed(3);
        }
        if (heroVisualColEl) {
          heroVisualColEl.style.transform = `translate3d(0, ${translateVisualY.toFixed(
            2
          )}px, 0)`;
        }
      }

      // 2. About Visual & Floating Milestone Cards Parallax
      parallaxElements.forEach((el) => {
        if (!el.classList.contains("is-inview")) return;
        const rect = el.getBoundingClientRect();
        const centerOffset = rect.top + rect.height / 2 - vh / 2;
        const speed = parseFloat(el.getAttribute("data-scroll-parallax") || "0");
        const yOffset = Math.max(-28, Math.min(28, centerOffset * speed));
        el.style.transform = `translate3d(0, ${yOffset.toFixed(2)}px, 0)`;
      });

      // 3. Smooth 3D tilt on About Glass Frame
      if (isFinePointer && aboutGlassFrame) {
        aboutCurrRotX += (aboutTargetRotX - aboutCurrRotX) * 0.1;
        aboutCurrRotY += (aboutTargetRotY - aboutCurrRotY) * 0.1;
        aboutGlassFrame.style.transform = `rotateX(${aboutCurrRotX.toFixed(
          2
        )}deg) rotateY(${aboutCurrRotY.toFixed(2)}deg)`;
      }

      requestAnimationFrame(updateScrollParallaxLoop);
    }

    requestAnimationFrame(updateScrollParallaxLoop);
  }

  // ---------------------------------------------------------------------------
  // 9. SKILLS SECTION: STAGGERED REVEAL, FILTER SYSTEM & 3D CARD MOUSE ENGINE
  // ---------------------------------------------------------------------------
  function initSkillsSection() {
    const skillsSection = document.getElementById("skills");
    if (!skillsSection) return;

    const headerRevealNodes = Array.from(
      skillsSection.querySelectorAll(
        '[data-skills-reveal]:not([data-skills-reveal="card"])'
      )
    );
    const skillCards = Array.from(
      skillsSection.querySelectorAll('.skill-card[data-skills-reveal="card"]')
    );
    const filterBtns = Array.from(
      skillsSection.querySelectorAll(".skill-filter-btn[data-filter]")
    );

    if (prefersReducedMotion) {
      headerRevealNodes.forEach((el) => el.classList.add("is-inview"));
      skillCards.forEach((card) => card.classList.add("is-inview"));
    } else if ("IntersectionObserver" in window) {
      // 1. Header & Filter Bar Reveal
      const headerObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-inview");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.18, rootMargin: "0px 0px -5% 0px" }
      );

      headerRevealNodes.forEach((el) => headerObserver.observe(el));

      // 2. Sequential Staggered Card Reveal
      const cardObserver = new IntersectionObserver(
        (entries, obs) => {
          const intersectingCards = entries
            .filter((e) => e.isIntersecting)
            .map((e) => e.target);

          intersectingCards.forEach((card, batchIdx) => {
            card.style.transitionDelay = `${Math.min(batchIdx * 55, 380)}ms`;
            card.classList.add("is-inview");
            window.setTimeout(() => {
              card.style.transitionDelay = "0ms";
            }, 700 + batchIdx * 55);
            obs.unobserve(card);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -4% 0px" }
      );

      skillCards.forEach((card) => cardObserver.observe(card));
    } else {
      headerRevealNodes.forEach((el) => el.classList.add("is-inview"));
      skillCards.forEach((card) => card.classList.add("is-inview"));
    }

    // 4. Category Filter System (Smooth Opacity + Transform Transitions)
    let filterTimeout = null;
    let activeCategory = "all";

    function applySkillFilter(category) {
      if (category === activeCategory) return;
      activeCategory = category;

      filterBtns.forEach((btn) => {
        const isMatch = btn.getAttribute("data-filter") === category;
        btn.classList.toggle("is-active", isMatch);
        btn.setAttribute("aria-pressed", String(isMatch));
      });

      if (prefersReducedMotion) {
        skillCards.forEach((card) => {
          const cardCat = card.getAttribute("data-category");
          const shouldShow = category === "all" || cardCat === category;
          card.classList.toggle("is-hidden-card", !shouldShow);
          card.classList.remove("is-filtering-out");
          if (shouldShow) card.classList.add("is-inview");
        });
        return;
      }

      if (filterTimeout) window.clearTimeout(filterTimeout);

      // Step A: Animate out visible cards
      skillCards.forEach((card) => {
        card.style.transitionDelay = "0ms";
        card.classList.add("is-filtering-out");
      });

      // Step B: Swap visibility & stagger in matching cards
      filterTimeout = window.setTimeout(() => {
        let visibleIndex = 0;

        skillCards.forEach((card) => {
          const cardCat = card.getAttribute("data-category");
          const shouldShow = category === "all" || cardCat === category;

          if (shouldShow) {
            card.classList.remove("is-hidden-card");
            const delayMs = Math.min(visibleIndex * 45, 320);
            card.style.transitionDelay = `${delayMs}ms`;
            visibleIndex++;

            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                card.classList.remove("is-filtering-out");
                card.classList.add("is-inview");
              });
            });
          } else {
            card.classList.add("is-hidden-card");
          }
        });
      }, 210);
    }

    filterBtns.forEach((btn, idx) => {
      btn.addEventListener("click", () => {
        const cat = btn.getAttribute("data-filter") || "all";
        applySkillFilter(cat);
      });

      // Keyboard arrow support across filter toolbar
      btn.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          const dir = event.key === "ArrowRight" ? 1 : -1;
          const nextIdx = (idx + dir + filterBtns.length) % filterBtns.length;
          filterBtns[nextIdx].focus();
          filterBtns[nextIdx].click();
        }
      });
    });

    // 5. Mouse-Responsive 3D Skill Card System (Max 5 deg tilt + Cursor Glow)
    if (isFinePointer && !prefersReducedMotion) {
      const MAX_CARD_TILT = 5;
      let hoveredCard = null;
      let targetRotX = 0;
      let targetRotY = 0;
      let currRotX = 0;
      let currRotY = 0;
      let cardRafId = null;

      function updateHoveredCardTransform() {
        if (!hoveredCard) {
          cardRafId = null;
          return;
        }

        currRotX += (targetRotX - currRotX) * 0.16;
        currRotY += (targetRotY - currRotY) * 0.16;

        hoveredCard.style.transform = `translate3d(0, -4px, 0) rotateX(${currRotX.toFixed(
          2
        )}deg) rotateY(${currRotY.toFixed(2)}deg)`;

        cardRafId = requestAnimationFrame(updateHoveredCardTransform);
      }

      skillCards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
          hoveredCard = card;
          card.style.transitionDelay = "0ms";
          if (!cardRafId) {
            cardRafId = requestAnimationFrame(updateHoveredCardTransform);
          }
        });

        card.addEventListener(
          "mousemove",
          (event) => {
            const rect = card.getBoundingClientRect();
            const localX = event.clientX - rect.left;
            const localY = event.clientY - rect.top;

            card.style.setProperty("--card-mouse-x", `${localX.toFixed(1)}px`);
            card.style.setProperty("--card-mouse-y", `${localY.toFixed(1)}px`);

            const relX = (localX - rect.width / 2) / (rect.width / 2);
            const relY = (localY - rect.height / 2) / (rect.height / 2);

            targetRotY = Math.max(
              -MAX_CARD_TILT,
              Math.min(MAX_CARD_TILT, relX * MAX_CARD_TILT)
            );
            targetRotX = Math.max(
              -MAX_CARD_TILT,
              Math.min(MAX_CARD_TILT, -relY * MAX_CARD_TILT)
            );
          },
          { passive: true }
        );

        card.addEventListener("mouseleave", () => {
          if (hoveredCard === card) {
            hoveredCard = null;
          }
          targetRotX = 0;
          targetRotY = 0;
          currRotX = 0;
          currRotY = 0;
          card.style.transform = "";
        });
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 10. SELECTED WORK / PROJECTS SECTION: REVEAL, FILTER, 3D STAGE & CASE MODAL
  // ---------------------------------------------------------------------------
  const REAL_PROJECTS_DATA = {
    "offical-darul-ifta-irshad-us-saileen": {
      index: "01",
      title: "Official Darul Ifta Irshad us Saileen",
      category: "Web Platform",
      language: "JavaScript",
      liveUrl: "https://darulifta-bkfbzf6u.manus.space/",
      githubUrl:
        "https://github.com/DotDaniyal/Offical-Darul-ifta-Irshad-us-saileen-",
      technologies: [
        "JavaScript",
        "Tailwind CSS",
        "HTML5",
        "Responsive Web",
        "REST APIs"
      ],
      metrics: [
        { label: "DEPLOYMENT", value: "Active Production" },
        { label: "ACCESSIBILITY", value: "Mobile & Desktop" },
        { label: "PERFORMANCE", value: "Optimized Load" }
      ],
      overview:
        "Official Darul Ifta Irshad us Saileen is an online consultation platform engineered to provide accessible religious guidance and official fatwas to a broad community across desktop and mobile devices.",
      problem:
        "Traditional consultation workflows relied on physical visits or disjointed communication channels, making verified guidance difficult to archive, search, and access promptly.",
      design:
        "Designed a fast, lightweight, responsive web platform featuring structured inquiry categories, direct submission interfaces, clean editorial typography, and accessible contrast for users of all demographics.",
      solution:
        "Crafted using semantic HTML5, modern Tailwind CSS for modular utility styling, and vanilla JavaScript routines with efficient asset minification to ensure instant load times on variable-speed cellular connections.",
      result:
        "Successfully launched live in production, serving queries with zero layout shift and providing community members with an authoritative digital resource.",
      features: [
        "Intuitive religious consultation portal",
        "Streamlined fatwa repository and searchable categories",
        "High-contrast, distraction-free typographic hierarchy",
        "Accessible design optimized for low-bandwidth mobile devices"
      ]
    },
    "cortexiq-by-dnyl": {
      index: "02",
      title: "CortexIQ AI Suite",
      category: "AI & Intelligence",
      language: "TypeScript",
      liveUrl: "https://daniyal-hayat-portfolio.vercel.app/",
      githubUrl: "https://github.com/DotDaniyal/cortexiq-by-dnyl",
      technologies: [
        "TypeScript",
        "React",
        "Google Gemini AI",
        "Tailwind CSS",
        "Vite",
        "Motion"
      ],
      metrics: [
        { label: "DEPLOYMENT", value: "Live Production" },
        { label: "TYPE SAFETY", value: "100% TypeScript" },
        { label: "ENGINE", value: "Gemini AI" }
      ],
      overview:
        "CortexIQ AI Suite is Daniyal Hayat's premier flagship intelligence platform, bridging natural language prompts with high-performance computational workflows.",
      problem:
        "Traditional developer tools lack unified interfaces for managing complex AI prompts, token budgets, and structured analytical feedback.",
      design:
        "Architected a lightning-fast reactive dashboard with a sleek obsidian-and-cyan theme, glassmorphism panels, and highly responsive data visualizations.",
      solution:
        "Built with React 19, TypeScript, Vite, and Tailwind CSS, implementing efficient client-state separation, memoized rendering components, and robust error boundary checks for sub-100ms UI responsiveness.",
      result:
        "Delivers an exceptional, production-deployed intelligence suite that highlights Daniyal's full-stack and AI engineering mastery.",
      features: [
        "Advanced AI computational intelligence pipeline with real-time prompt parsing",
        "Futuristic dark-mode dashboard with interactive telemetry cards",
        "Strict TypeScript typings and modular SDK integration",
        "Optimized for high-performance reactive web experiences"
      ]
    },
    "hamara-weather": {
      index: "03",
      title: "Hamara Weather",
      category: "Utility App",
      language: "JavaScript",
      liveUrl: "https://hamara-weather.vercel.app/",
      githubUrl: "https://github.com/DotDaniyal/Hamara-Weather",
      technologies: [
        "JavaScript",
        "Meteorological API",
        "DOM Manipulation",
        "CSS3",
        "Async Pipeline"
      ],
      metrics: [
        { label: "STATUS", value: "Live on Vercel" },
        { label: "DATA SOURCE", value: "Real-time API" },
        { label: "UPDATE RATE", value: "On-demand Sync" }
      ],
      overview:
        "Hamara Weather is a sleek, lightweight weather forecasting application created to provide quick, accurate weather reports with minimal bandwidth footprint.",
      problem:
        "Existing consumer weather services are frequently cluttered with intrusive advertisements, slow tracker scripts, and complex layouts that delay essential forecast info.",
      design:
        "Constructed with clean atmospheric gradients, modern iconography, and distinct typographic hierarchy distinguishing key metric numbers from secondary labels.",
      solution:
        "Developed using vanilla JavaScript utilizing asynchronous Fetch API calls, structured JSON parsing, and defensive error fallbacks for unavailable cities or weak network connections.",
      result:
        "Deployed live on Vercel with exceptional speed metrics and a clean, dependable everyday utility experience.",
      features: [
        "Real-time weather API integration for live temperature and wind speed",
        "Atmospheric humidity, pressure, and visibility telemetry",
        "Adaptive weather condition indicators with visual feedback",
        "Zero-latency search with responsive layout across all viewports"
      ]
    },
    "mystic-match-by-dnyl": {
      index: "04",
      title: "Mystic Match Puzzle Game",
      category: "Mobile Game",
      language: "Kotlin",
      liveUrl: "https://mystic-match-rho.vercel.app/",
      githubUrl: "https://github.com/DotDaniyal/mystic-match-by-dnyl",
      technologies: [
        "Kotlin",
        "Android",
        "Game Mechanics",
        "Mobile UI",
        "Algorithms"
      ],
      metrics: [
        { label: "PLATFORM", value: "Live Web & Android" },
        { label: "ENGINE", value: "Custom Algorithmic" },
        { label: "DEPLOYMENT", value: "Vercel Live" }
      ],
      overview:
        "Mystic Match is an interactive puzzle game demonstrating advanced state machines, algorithmic matrix manipulations, and fluid touch interactions.",
      problem:
        "Game loops on mobile and web can easily introduce memory leaks and performance stutters when tracking animated grid states.",
      design:
        "Created a fantasy neo-aesthetic with vibrant gem motifs, clean board borders, and immediate visual reactions upon valid combinations.",
      solution:
        "Implemented discrete state transitions (IDLE, SWAPPING, CHECKING, CLEARING, DROPPING) and 2D matrix traversal algorithms to prevent infinite cascade loops and ensure deterministic gameplay.",
      result:
        "A captivating, glitch-free puzzle experience showcasing deep algorithmic and design competence live on Vercel.",
      features: [
        "Algorithmic match-3 grid detection with cascading mechanics",
        "Fantasy-themed visual styling with custom responsive tile states",
        "Fluid touch-drag interaction and tactile feedback",
        "High-performance frame rendering optimized for modern browsers and devices"
      ]
    },
    "islamic-ai-mujeeb": {
      index: "05",
      title: "Islamic AI / Mujeeb us Saileen",
      category: "AI & Intelligence",
      language: "TypeScript",
      liveUrl: "https://darulifta-bkfbzf6u.manus.space/",
      githubUrl:
        "https://github.com/DotDaniyal/Offical-Darul-ifta-Irshad-us-saileen-",
      technologies: [
        "TypeScript",
        "React",
        "Google Gemini AI",
        "Tailwind CSS",
        "REST APIs"
      ],
      metrics: [
        { label: "AI ENGINE", value: "Gemini AI" },
        { label: "VERIFICATION", value: "Authoritative Fatwas" },
        { label: "LANGUAGES", value: "Arabic, Urdu, English" }
      ],
      overview:
        "Mujeeb us Saileen is an advanced AI research platform designed to help community scholars and seekers locate verified rulings swiftly.",
      problem:
        "Traditional Islamic question archives span thousands of physical and digital texts, making prompt theological verification time-consuming.",
      design:
        "Dignified editorial design with soothing neutral tones, dark mode support, and crystal-clear Arabic and Nastaliq Urdu script legibility.",
      solution:
        "Built in TypeScript with strict API proxy boundaries, rigorous system instructions, few-shot theological examples, and multi-tier defensive prompt guards to ground responses exclusively in verified references.",
      result:
        "An authoritative AI consultation platform bridging tradition with cutting-edge language model technology.",
      features: [
        "Natural language consultation search backed by structured fatwa archives",
        "Defensive prompt engineering preventing hallucinatory jurisprudence rulings",
        "Bilingual typography optimized for complex Arabic and Nastaliq Urdu scripts",
        "Instant query citation indexing with source reference links"
      ]
    },
    "ai-prompt-studio-hub": {
      index: "06",
      title: "AI Prompt Studio & Workspace",
      category: "AI & Fullstack",
      language: "TypeScript",
      liveUrl:
        "https://ais-pre-c2gas5bmz4riptqglg7i75-935024525749.asia-east1.run.app",
      githubUrl: "https://github.com/DotDaniyal/cortexiq-by-dnyl",
      technologies: [
        "React",
        "Node.js",
        "Express",
        "Gemini AI API",
        "Tailwind CSS"
      ],
      metrics: [
        { label: "BACKEND", value: "Express API" },
        { label: "AI INTEGRATION", value: "Google Gemini SDK" },
        { label: "ARCHITECTURE", value: "Full-Stack" }
      ],
      overview:
        "AI Prompt Studio is a robust full-stack developer workspace designed to streamline prompt iteration, testing, and generation workflows.",
      problem:
        "Prompt engineering often requires constant context switching between raw API clients, documentation, and notepad apps.",
      design:
        "High-contrast dark developer aesthetic with code syntax highlighting, clean sidebars, and instant visual feedback indicators.",
      solution:
        "Engineered in React and Express, leveraging server-side Google Gemini SDK proxy routes with streaming support to keep credentials secure.",
      result:
        "Provides an ultra-smooth playground for rapid prompt iteration and AI-driven development.",
      features: [
        "Secure server-side API proxy protecting sensitive AI keys",
        "Interactive template variables with live token count estimation",
        "One-click history export and preset management",
        "Responsive split-screen layout for prompt engineering and output inspection"
      ]
    },
    "faryal-fc": {
      index: "07",
      title: "Faryal FC Web Platform",
      category: "Web Platform",
      language: "JavaScript",
      liveUrl: "https://daniyal-hayat-portfolio.vercel.app/",
      githubUrl: "https://github.com/DotDaniyal",
      technologies: [
        "React",
        "Tailwind CSS",
        "JavaScript",
        "Responsive UI",
        "Vercel"
      ],
      metrics: [
        { label: "DEPLOYMENT", value: "Vercel Live" },
        { label: "ROSTER ENGINE", value: "Interactive Squad" },
        { label: "VIEWPORT", value: "Mobile Optimized" }
      ],
      overview:
        "Faryal FC is an official digital headquarters engineered to unite supporters, display real-time match fixtures, and showcase squad performance metrics.",
      problem:
        "Local sports teams often struggle with fragmented social media updates, leading to lost match announcements and low fan engagement.",
      design:
        "Athletic dark-mode aesthetic with emerald and cyan accents, bold jersey number typography, and tactile match scorecards.",
      solution:
        "Crafted using React, Tailwind CSS, optimized SVG silhouette placeholders, and CSS clamp() fluid typography for instantaneous page transitions.",
      result:
        "Delivered a high-energy, production-ready web platform that elevates the club's professional digital presence.",
      features: [
        "Dynamic match fixture schedule with countdowns and scoreboards",
        "Interactive squad roster profiles with player statistics",
        "Media gallery and match highlights reel",
        "High-contrast club livery design system and responsive mobile drawer"
      ]
    },
    "dnyl-eyewear": {
      index: "08",
      title: "DNYL Eyewear Boutique Experience",
      category: "E-Commerce & Brand",
      language: "TypeScript",
      liveUrl: "https://daniyal-hayat-portfolio.vercel.app/",
      githubUrl: "https://github.com/DotDaniyal",
      technologies: [
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Motion",
        "E-Commerce"
      ],
      metrics: [
        { label: "DESIGN", value: "Editorial Luxury" },
        { label: "TYPE SAFETY", value: "100% TypeScript" },
        { label: "UX FEEL", value: "60 FPS Motion" }
      ],
      overview:
        "DNYL Eyewear is a bespoke digital showroom designed to deliver an in-person boutique feeling directly to browser viewports.",
      problem:
        "Typical online eyewear stores are cluttered with discount banners and generic grid layouts that detract from the craft of designer eyewear.",
      design:
        "Monochrome obsidian and alabaster palette with subtle gold/cyan highlights and expansive negative space.",
      solution:
        "Engineered in React 19 and TypeScript, utilizing Motion for smooth layout transitions and progressive lazy loading for sub-second rendering.",
      result:
        "A stunning digital brand experience demonstrating Daniyal's creative art direction and frontend engineering.",
      features: [
        "Curated frame lookbook with 360-degree aesthetic perspective cards",
        "Interactive lens prescription and tint customizer",
        "High-fashion monochrome typography and glassmorphism accents",
        "Smooth cart simulation with local state persistence"
      ]
    },
    "darul-ifta-irshad-us-saileen-app2": {
      index: "09",
      title: "Darul Ifta Android App v2",
      category: "Mobile App",
      language: "Kotlin",
      liveUrl: "https://darulifta-bkfbzf6u.manus.space/",
      githubUrl:
        "https://github.com/DotDaniyal/Darul-Ifta-Irshad-us-Saileen-app2",
      technologies: [
        "Kotlin",
        "Android SDK",
        "Offline Caching",
        "XML Layouts",
        "Mobile Architecture"
      ],
      metrics: [
        { label: "PLATFORM", value: "Native Android" },
        { label: "STORAGE", value: "SQLite / Room" },
        { label: "LANGUAGE", value: "100% Kotlin" }
      ],
      overview:
        "Second-generation native Android companion app engineered to bring verified fatwa archives and consultation tools directly to Android devices.",
      problem:
        "Mobile users in low-connectivity regions needed offline access to previously read fatwas and fast local search indexing.",
      design:
        "Adhered to modern Android Material guidelines with optimized touch targets, intuitive tab bars, and clear Arabic/Urdu script typography.",
      solution:
        "Engineered in Kotlin using Android SDK components, local database caching, lazy view binding, and defensive network error handling.",
      result:
        "Delivered a rock-solid native companion app that brings essential guidance directly to mobile users anywhere, anytime.",
      features: [
        "Offline fatwa reading cache backed by local SQLite/Room storage",
        "Fast bilingual search indexing across categorized rulings",
        "Refined Material Design layouts with customizable font scaling",
        "Low memory footprint optimized for entry-level Android devices"
      ]
    },
    "soutnaqi-ai": {
      index: "10",
      title: "SOUTNAQI AI Audio Suite",
      category: "AI & Audio",
      language: "TypeScript",
      liveUrl: "https://daniyal-hayat-portfolio.vercel.app/",
      githubUrl: "https://github.com/DotDaniyal/cortexiq-by-dnyl",
      technologies: [
        "TypeScript",
        "Audio Processing",
        "AI Models",
        "Node.js",
        "Tailwind CSS"
      ],
      metrics: [
        { label: "PROCESSING", value: "Real-time Telemetry" },
        { label: "ARCHITECTURE", value: "Server-Side Proxy" },
        { label: "INTERFACE", value: "Audio Canvas Visualizer" }
      ],
      overview:
        "SOUTNAQI AI is an experimental speech and audio processing interface designed for clarity, voice diagnostics, and automated transcription.",
      problem:
        "Voice and audio tools often suffer from clunky multi-step upload workflows that delay feedback.",
      design:
        "Cyber-obsidian aesthetic with electric cyan audio waves and clear signal telemetry gauges.",
      solution:
        "Authored in TypeScript utilizing Web Audio API, decoupled requestAnimationFrame canvas visualizer loops, and backend proxy endpoints for model inference.",
      result:
        "A responsive, futuristic audio intelligence playground showcasing Daniyal's technical depth in AI and canvas physics.",
      features: [
        "Real-time audio frequency spectrum analyzer on HTML5 Canvas",
        "AI-accelerated speech clarity and transcript generation pipelines",
        "Low-latency streaming audio buffers",
        "Secure key protection with Node.js backend routes"
      ]
    },
    "motorcycle-sprint-2d": {
      index: "11",
      title: "Motorcycle Sprint Racing 2D",
      category: "Interactive Game",
      language: "JavaScript",
      liveUrl: "https://daniyal-hayat-portfolio.vercel.app/",
      githubUrl: "https://github.com/DotDaniyal",
      technologies: [
        "JavaScript",
        "HTML5 Canvas",
        "Game Physics",
        "Touch Ergonomics"
      ],
      metrics: [
        { label: "ENGINE", value: "Custom 2D Loop" },
        { label: "FRAME RATE", value: "Locked 60 FPS" },
        { label: "CONTROLS", value: "Mobile Touch" }
      ],
      overview:
        "Motorcycle Sprint 2D is a pure canvas algorithmic game engineered to explore low-overhead physics and mobile ergonomics.",
      problem:
        "Many browser games rely on heavy game engines that take seconds to load on cellular connections.",
      design:
        "Retro-futuristic neon highway aesthetic with crisp collision hitboxes and fluid parallax road markings.",
      solution:
        "Engineered using deterministic timestamp game loops (requestAnimationFrame) and raycast trajectory sweeps between consecutive frames for 100% reliable collision checks.",
      result:
        "An addictive, instant-loading web arcade game running at a rock-solid 60 FPS on any device.",
      features: [
        "Variable vehicle acceleration and centrifugal friction physics",
        "Dynamic obstacle generation with scalable difficulty curve",
        "Haptic visual feedback on collisions and near misses",
        "Zero-dependency pure canvas implementation with sub-15kb bundle footprint"
      ]
    },
    "daniyal-hayat-portfolio": {
      index: "12",
      title: "Daniyal Hayat Portfolio Platform",
      category: "Web Application",
      language: "TypeScript",
      liveUrl: "https://daniyal-hayat-portfolio.vercel.app/",
      githubUrl: "https://github.com/DotDaniyal/Daniyal-Hayat-Portfolio",
      technologies: ["React", "TypeScript", "Tailwind CSS", "Vite", "Motion"],
      metrics: [
        { label: "DEPLOYMENT", value: "Vercel Live" },
        { label: "SPEED", value: "95+ Lighthouse" },
        { label: "SYNC", value: "Live GitHub API" }
      ],
      overview:
        "The digital portfolio of Daniyal Hayat represents his design philosophy: modern, fast, transparent, and focused on tangible engineering value.",
      problem:
        "Many developer portfolios rely on generic templates, static fake numbers, or bloated graphics that harm load performance and accessibility.",
      design:
        "Balanced negative space, refined display and monospace typography, and purposeful interactive feedback.",
      solution:
        "Constructed with hardware-accelerated CSS transforms, GPU-powered animations, and defensive localStorage caching for external APIs.",
      result:
        "A world-class personal brand platform showcasing verified capabilities and real projects to employers, collaborators, and clients worldwide.",
      features: [
        "Live GitHub repository data synchronization with resilient local fallback",
        "Accessible high-contrast dark theme with smooth scroll choreography",
        "Interactive project case studies and 3D perspective stage previews",
        "Clean modular architecture with zero-error compilation"
      ]
    }
  };

  function initProjectsSection() {
    const projectsSection = document.getElementById("projects");
    if (!projectsSection) return;

    const headerRevealNodes = Array.from(
      projectsSection.querySelectorAll(
        '[data-projects-reveal]:not([data-projects-reveal="monolith"]):not([data-projects-reveal="archive-card"])'
      )
    );
    const monolithCards = Array.from(
      projectsSection.querySelectorAll(
        '.project-monolith[data-projects-reveal="monolith"]'
      )
    );
    const archiveCards = Array.from(
      projectsSection.querySelectorAll(
        '.archive-card[data-projects-reveal="archive-card"]'
      )
    );
    const allProjectItems = [...monolithCards, ...archiveCards];
    const filterBtns = Array.from(
      projectsSection.querySelectorAll(
        ".project-filter-btn[data-project-filter]"
      )
    );

    // 1. Scroll Reveal Observers
    if (prefersReducedMotion) {
      headerRevealNodes.forEach((el) => el.classList.add("is-inview"));
      allProjectItems.forEach((el) => el.classList.add("is-inview"));
    } else if ("IntersectionObserver" in window) {
      const headerObs = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-inview");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.16, rootMargin: "0px 0px -5% 0px" }
      );
      headerRevealNodes.forEach((el) => headerObs.observe(el));

      const projectObs = new IntersectionObserver(
        (entries, obs) => {
          const visible = entries
            .filter((e) => e.isIntersecting)
            .map((e) => e.target);
          visible.forEach((item, idx) => {
            item.style.transitionDelay = `${Math.min(idx * 65, 260)}ms`;
            item.classList.add("is-inview");
            window.setTimeout(() => {
              item.style.transitionDelay = "0ms";
            }, 800 + idx * 65);
            obs.unobserve(item);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -4% 0px" }
      );
      allProjectItems.forEach((el) => projectObs.observe(el));
    } else {
      headerRevealNodes.forEach((el) => el.classList.add("is-inview"));
      allProjectItems.forEach((el) => el.classList.add("is-inview"));
    }

    // 2. Domain Category Filter + Real-Time Search & Stack Telemetry System
    let activeProjectFilter = "all";
    let activeSearchQuery = "";
    let projFilterTimer = null;

    const searchInput = document.getElementById("project-search-input");
    const searchClearBtn = document.getElementById("project-search-clear");
    const matchCountEl = document.getElementById("project-match-count");
    const emptyStateEl = document.getElementById("projects-empty-state");
    const resetFiltersBtn = document.getElementById("projects-reset-filters-btn");
    const archiveHeadEl = projectsSection.querySelector(".projects-archive-head");

    function doesProjectMatch(item, category, rawQuery) {
      const tags = (item.getAttribute("data-project-tags") || "").split(" ");
      const catMatch = category === "all" || tags.includes(category);
      if (!catMatch) return false;

      const q = rawQuery.trim().toLowerCase();
      if (!q) return true;

      const projId = item.getAttribute("data-project-id") || "";
      const projData = REAL_PROJECTS_DATA[projId];
      const textCorpus = [
        item.textContent || "",
        projData ? projData.title : "",
        projData ? projData.category : "",
        projData ? projData.language : "",
        projData ? (projData.technologies || []).join(" ") : "",
        projData ? projData.overview : ""
      ]
        .join(" ")
        .toLowerCase();

      return textCorpus.includes(q);
    }

    function updateSearchTelemetry(visibleCount, archiveVisibleCount) {
      if (matchCountEl) {
        const padded = String(visibleCount).padStart(2, "0");
        matchCountEl.textContent = `SHOWING ${padded} / 12 VERIFIED BUILDS`;
      }
      if (emptyStateEl) {
        emptyStateEl.hidden = visibleCount > 0;
      }
      if (archiveHeadEl) {
        archiveHeadEl.style.display = archiveVisibleCount > 0 ? "" : "none";
      }
      if (searchClearBtn) {
        searchClearBtn.hidden = activeSearchQuery.trim().length === 0;
      }
    }

    function runCombinedProjectFilter(animateTransition) {
      filterBtns.forEach((btn) => {
        const isMatch =
          btn.getAttribute("data-project-filter") === activeProjectFilter;
        btn.classList.toggle("is-active", isMatch);
        btn.setAttribute("aria-pressed", String(isMatch));
      });

      if (prefersReducedMotion || !animateTransition) {
        let visibleCount = 0;
        let archiveVisibleCount = 0;
        allProjectItems.forEach((item) => {
          const show = doesProjectMatch(
            item,
            activeProjectFilter,
            activeSearchQuery
          );
          item.classList.toggle("is-hidden-project", !show);
          item.classList.remove("is-filtering-out");
          if (show) {
            item.classList.add("is-inview");
            visibleCount++;
            if (item.classList.contains("archive-card")) {
              archiveVisibleCount++;
            }
          }
        });
        updateSearchTelemetry(visibleCount, archiveVisibleCount);
        return;
      }

      if (projFilterTimer) window.clearTimeout(projFilterTimer);

      allProjectItems.forEach((item) => {
        item.style.transitionDelay = "0ms";
        item.classList.add("is-filtering-out");
      });

      projFilterTimer = window.setTimeout(() => {
        let visIdx = 0;
        let archiveVisibleCount = 0;
        allProjectItems.forEach((item) => {
          const show = doesProjectMatch(
            item,
            activeProjectFilter,
            activeSearchQuery
          );
          if (show) {
            item.classList.remove("is-hidden-project");
            item.style.transitionDelay = `${Math.min(visIdx * 55, 280)}ms`;
            visIdx++;
            if (item.classList.contains("archive-card")) {
              archiveVisibleCount++;
            }
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                item.classList.remove("is-filtering-out");
                item.classList.add("is-inview");
              });
            });
          } else {
            item.classList.add("is-hidden-project");
          }
        });
        updateSearchTelemetry(visIdx, archiveVisibleCount);
      }, 190);
    }

    function applyProjectFilter(category) {
      if (category === activeProjectFilter && !activeSearchQuery) return;
      activeProjectFilter = category;
      runCombinedProjectFilter(true);
    }

    if (searchInput) {
      searchInput.addEventListener("input", () => {
        activeSearchQuery = searchInput.value || "";
        runCombinedProjectFilter(false);
      });
    }

    if (searchClearBtn) {
      searchClearBtn.addEventListener("click", () => {
        activeSearchQuery = "";
        if (searchInput) {
          searchInput.value = "";
          searchInput.focus();
        }
        runCombinedProjectFilter(false);
      });
    }

    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener("click", () => {
        activeProjectFilter = "all";
        activeSearchQuery = "";
        if (searchInput) searchInput.value = "";
        runCombinedProjectFilter(true);
      });
    }

    filterBtns.forEach((btn, idx) => {
      btn.addEventListener("click", () => {
        const cat = btn.getAttribute("data-project-filter") || "all";
        applyProjectFilter(cat);
      });

      btn.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          const dir = event.key === "ArrowRight" ? 1 : -1;
          const nextIdx = (idx + dir + filterBtns.length) % filterBtns.length;
          filterBtns[nextIdx].focus();
          filterBtns[nextIdx].click();
        }
      });
    });

    // 3. Mouse Spotlight & 3D Tilt on Flagship Visual Stages (Clamped <= 4 deg)
    if (isFinePointer && !prefersReducedMotion) {
      monolithCards.forEach((monolith) => {
        const stage = monolith.querySelector("[data-project-tilt]");
        monolith.addEventListener(
          "mousemove",
          (event) => {
            const rect = monolith.getBoundingClientRect();
            const mx = event.clientX - rect.left;
            const my = event.clientY - rect.top;
            monolith.style.setProperty("--proj-mouse-x", `${mx.toFixed(1)}px`);
            monolith.style.setProperty("--proj-mouse-y", `${my.toFixed(1)}px`);

            if (stage) {
              const sRect = stage.getBoundingClientRect();
              const sx = event.clientX - sRect.left;
              const sy = event.clientY - sRect.top;
              const relX = (sx - sRect.width / 2) / (sRect.width / 2);
              const relY = (sy - sRect.height / 2) / (sRect.height / 2);
              const maxDeg = 3.5;
              const rotY = Math.max(-maxDeg, Math.min(maxDeg, relX * maxDeg));
              const rotX = Math.max(-maxDeg, Math.min(maxDeg, -relY * maxDeg));
              stage.style.transform = `rotateX(${rotX.toFixed(
                2
              )}deg) rotateY(${rotY.toFixed(2)}deg)`;
              stage.style.setProperty(
                "--stage-glare-x",
                `${((sx / sRect.width) * 100).toFixed(1)}%`
              );
              stage.style.setProperty(
                "--stage-glare-y",
                `${((sy / sRect.height) * 100).toFixed(1)}%`
              );
            }
          },
          { passive: true }
        );

        monolith.addEventListener("mouseleave", () => {
          if (stage) {
            stage.style.transform = "";
          }
        });
      });

      archiveCards.forEach((card) => {
        card.addEventListener(
          "mousemove",
          (event) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty(
              "--arch-mouse-x",
              `${(event.clientX - rect.left).toFixed(1)}px`
            );
            card.style.setProperty(
              "--arch-mouse-y",
              `${(event.clientY - rect.top).toFixed(1)}px`
            );
          },
          { passive: true }
        );
      });
    }

    // 4. Deep-Dive Case Study Modal Controller
    const modal = document.getElementById("project-case-modal");
    const closeBtn = document.getElementById("case-modal-close");
    const modalIndex = document.getElementById("case-modal-index");
    const modalCategory = document.getElementById("case-modal-category");
    const modalLang = document.getElementById("case-modal-lang");
    const modalTitle = document.getElementById("case-modal-title");
    const modalOverview = document.getElementById("case-modal-overview");
    const modalMetrics = document.getElementById("case-modal-metrics");
    const modalProblem = document.getElementById("case-modal-problem");
    const modalDesign = document.getElementById("case-modal-design");
    const modalSolution = document.getElementById("case-modal-solution");
    const modalResult = document.getElementById("case-modal-result");
    const modalFeatures = document.getElementById("case-modal-features");
    const modalStack = document.getElementById("case-modal-stack");
    const modalLive = document.getElementById("case-modal-live");
    const modalGithub = document.getElementById("case-modal-github");
    let lastFocusedTrigger = null;

    function openCaseStudyModal(projectId, triggerEl) {
      const data = REAL_PROJECTS_DATA[projectId];
      if (!data || !modal) return;

      lastFocusedTrigger = triggerEl || document.activeElement;

      if (modalIndex) modalIndex.textContent = data.index;
      if (modalCategory) modalCategory.textContent = data.category;
      if (modalLang) modalLang.textContent = data.language;
      if (modalTitle) modalTitle.textContent = data.title;
      if (modalOverview) modalOverview.textContent = data.overview;
      if (modalProblem) modalProblem.textContent = data.problem;
      if (modalDesign) modalDesign.textContent = data.design;
      if (modalSolution) modalSolution.textContent = data.solution;
      if (modalResult) modalResult.textContent = data.result;

      if (modalMetrics) {
        modalMetrics.replaceChildren();
        data.metrics.forEach((m) => {
          const itemEl = document.createElement("div");
          itemEl.className = "monolith-metric-item";

          const labelEl = document.createElement("span");
          labelEl.className = "metric-label";
          labelEl.textContent = m.label;

          const valEl = document.createElement("span");
          valEl.className = "metric-value";
          valEl.textContent = m.value;

          itemEl.appendChild(labelEl);
          itemEl.appendChild(valEl);
          modalMetrics.appendChild(itemEl);
        });
      }

      if (modalFeatures) {
        modalFeatures.replaceChildren();
        data.features.forEach((feat) => {
          const li = document.createElement("li");
          li.textContent = feat;
          modalFeatures.appendChild(li);
        });
      }

      if (modalStack) {
        modalStack.replaceChildren();
        data.technologies.forEach((t, idx) => {
          if (idx > 0) {
            const sep = document.createElement("span");
            sep.setAttribute("aria-hidden", "true");
            sep.textContent = "·";
            modalStack.appendChild(sep);
          }
          const span = document.createElement("span");
          span.textContent = t;
          modalStack.appendChild(span);
        });
      }

      if (modalLive) modalLive.setAttribute("href", data.liveUrl);
      if (modalGithub) modalGithub.setAttribute("href", data.githubUrl);

      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      if (closeBtn) closeBtn.focus();
    }

    function closeCaseStudyModal() {
      if (!modal || !modal.classList.contains("is-open")) return;
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === "function") {
        lastFocusedTrigger.focus();
      }
    }

    const caseTriggers = document.querySelectorAll("[data-open-case]");
    caseTriggers.forEach((btn) => {
      btn.addEventListener("click", () => {
        const projId = btn.getAttribute("data-open-case");
        if (projId) openCaseStudyModal(projId, btn);
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", closeCaseStudyModal);
    }

    if (modal) {
      modal.addEventListener("click", (event) => {
        if (event.target === modal) {
          closeCaseStudyModal();
        }
      });
    }

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeCaseStudyModal();
      }
    });

    // Expose Case Study launcher for DNYL Command Palette (⌘K)
    window.openDnylCaseStudy = openCaseStudyModal;
  }

  // ---------------------------------------------------------------------------
  // 11. 05 — MY JOURNEY / EXPERIENCE & TIMELINE ENGINE
  // ---------------------------------------------------------------------------
  function initJourneySection() {
    const journeySection = document.getElementById("experience");
    if (!journeySection) return;

    const headerRevealNodes = Array.from(
      journeySection.querySelectorAll(
        '[data-journey-reveal]:not([data-journey-reveal="currently"])'
      )
    );
    const milestoneItems = Array.from(
      journeySection.querySelectorAll(".timeline-item[data-milestone-index]")
    );
    const storyArcSteps = Array.from(
      journeySection.querySelectorAll(".story-arc-step[data-arc-step]")
    );
    const currentlyWrap = journeySection.querySelector(
      '[data-journey-reveal="currently"]'
    );
    const timelineContainer = document.getElementById("journey-timeline");
    const timelineFill = document.getElementById("timeline-spine-progress");
    const timelineCards = Array.from(
      journeySection.querySelectorAll(".timeline-card")
    );
    const currentlyCard = journeySection.querySelector(".currently-card");

    // 1. Scroll Reveal Observers
    if (prefersReducedMotion) {
      headerRevealNodes.forEach((el) => el.classList.add("is-inview"));
      milestoneItems.forEach((el) => {
        el.classList.add("is-inview", "is-reached", "is-current");
      });
      if (currentlyWrap) currentlyWrap.classList.add("is-inview");
      if (timelineFill) {
        timelineFill.style.setProperty("--timeline-draw", "100%");
        timelineFill.style.height = "100%";
      }
    } else if ("IntersectionObserver" in window) {
      const headerObs = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-inview");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.18, rootMargin: "0px 0px -6% 0px" }
      );
      headerRevealNodes.forEach((el) => headerObs.observe(el));

      const milestoneObs = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-inview");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
      );
      milestoneItems.forEach((el) => milestoneObs.observe(el));

      if (currentlyWrap) {
        const currentlyObs = new IntersectionObserver(
          (entries, obs) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("is-inview");
                obs.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.16, rootMargin: "0px 0px -5% 0px" }
        );
        currentlyObs.observe(currentlyWrap);
      }
    } else {
      headerRevealNodes.forEach((el) => el.classList.add("is-inview"));
      milestoneItems.forEach((el) => {
        el.classList.add("is-inview", "is-reached", "is-current");
      });
      if (currentlyWrap) currentlyWrap.classList.add("is-inview");
    }

    // 2. Scroll-Activated Timeline Spine Drawing & Node Illumination
    if (timelineContainer && timelineFill && !prefersReducedMotion) {
      let spineTicking = false;

      function updateTimelineSpine() {
        spineTicking = false;
        const rect = timelineContainer.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        // Start drawing when timeline top enters 68% down the viewport
        const triggerPoint = viewportHeight * 0.68;
        const distanceScrolled = triggerPoint - rect.top;
        const totalLength = Math.max(1, rect.height);
        const progress = Math.max(
          0,
          Math.min(1, distanceScrolled / totalLength)
        );
        const scaleVal = progress.toFixed(4);

        timelineFill.style.setProperty("--timeline-scale", scaleVal);
        timelineFill.style.transform = `scaleY(${scaleVal})`;

        // Illuminate each milestone marker when the scroll line reaches its vertical center
        const fillBottomY = rect.top + totalLength * progress;
        let currentIdx = 0;

        milestoneItems.forEach((item, idx) => {
          const markerEl = item.querySelector(".timeline-marker");
          if (!markerEl) return;
          const markerRect = markerEl.getBoundingClientRect();
          const markerCenterY = markerRect.top + markerRect.height * 0.5;
          const isReached = fillBottomY >= markerCenterY;
          item.classList.toggle("is-reached", isReached);
          if (isReached) {
            currentIdx = idx;
          }
        });

        milestoneItems.forEach((item, idx) => {
          item.classList.toggle("is-current", idx === currentIdx);
        });

        storyArcSteps.forEach((step, idx) => {
          step.classList.toggle("is-active", idx === currentIdx);
        });
      }

      window.addEventListener(
        "scroll",
        () => {
          if (!spineTicking) {
            spineTicking = true;
            requestAnimationFrame(updateTimelineSpine);
          }
        },
        { passive: true }
      );

      window.addEventListener("resize", updateTimelineSpine, { passive: true });
      updateTimelineSpine();
    }

    // 3. Cursor-Tracking Ambient Glow on Timeline & Currently Cards
    if (isFinePointer && !prefersReducedMotion) {
      timelineCards.forEach((card) => {
        card.addEventListener(
          "mousemove",
          (event) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty(
              "--tl-mouse-x",
              `${(event.clientX - rect.left).toFixed(1)}px`
            );
            card.style.setProperty(
              "--tl-mouse-y",
              `${(event.clientY - rect.top).toFixed(1)}px`
            );
          },
          { passive: true }
        );
      });

      if (currentlyCard) {
        currentlyCard.addEventListener(
          "mousemove",
          (event) => {
            const rect = currentlyCard.getBoundingClientRect();
            currentlyCard.style.setProperty(
              "--tl-mouse-x",
              `${(event.clientX - rect.left).toFixed(1)}px`
            );
            currentlyCard.style.setProperty(
              "--tl-mouse-y",
              `${(event.clientY - rect.top).toFixed(1)}px`
            );
          },
          { passive: true }
        );
      }
    }
  }

  // ---------------------------------------------------------------------------
  // 12. 06 — WHAT I DO / SERVICES & INTERACTIVE VISUAL STAGE ENGINE
  // ---------------------------------------------------------------------------
  const SERVICE_STAGE_META = {
    "srv-web": {
      num: "01 / 04",
      label: "Full-Stack Web Development",
      theme: "web"
    },
    "srv-android": {
      num: "02 / 04",
      label: "Native Android Mobile Apps",
      theme: "android"
    },
    "srv-ai": {
      num: "03 / 04",
      label: "Google AI Studio & AI App Engineering",
      theme: "ai"
    },
    "srv-uiux": {
      num: "04 / 04",
      label: "UI/UX Craft & Performance Audits",
      theme: "uiux"
    }
  };

  function initServicesSection() {
    const servicesSection = document.getElementById("services");
    if (!servicesSection) return;

    const headerRevealNodes = Array.from(
      servicesSection.querySelectorAll('[data-services-reveal="header"]')
    );
    const serviceCards = Array.from(
      servicesSection.querySelectorAll('.service-card[data-services-reveal="card"]')
    );
    const visualCol = servicesSection.querySelector(
      '[data-services-reveal="stage"]'
    );
    const visualStage = document.getElementById("services-visual-stage");
    const ambientGlow = document.getElementById("services-ambient-glow");
    const stageTabs = Array.from(
      servicesSection.querySelectorAll(".srv-stage-tab[data-stage-target]")
    );
    const stagePanels = Array.from(
      servicesSection.querySelectorAll(".srv-visual-panel[data-service-panel]")
    );
    const stageActiveNum = document.getElementById("srv-stage-active-num");
    const stageActiveLabel = document.getElementById("srv-stage-active-label");
    const filterTriggerLinks = Array.from(
      servicesSection.querySelectorAll("[data-service-filter-trigger]")
    );

    // 1. Scroll Reveal Choreography
    if (prefersReducedMotion) {
      headerRevealNodes.forEach((el) => el.classList.add("is-inview"));
      serviceCards.forEach((el) => el.classList.add("is-inview"));
      if (visualCol) visualCol.classList.add("is-inview");
    } else if ("IntersectionObserver" in window) {
      const headerObs = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-inview");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.18, rootMargin: "0px 0px -6% 0px" }
      );
      headerRevealNodes.forEach((el) => headerObs.observe(el));

      const cardObs = new IntersectionObserver(
        (entries, obs) => {
          const visible = entries
            .filter((e) => e.isIntersecting)
            .map((e) => e.target);
          visible.forEach((card, idx) => {
            card.style.transitionDelay = `${Math.min(idx * 85, 280)}ms`;
            card.classList.add("is-inview");
            window.setTimeout(() => {
              card.style.transitionDelay = "0ms";
            }, 850 + idx * 85);
            obs.unobserve(card);
          });
        },
        { threshold: 0.14, rootMargin: "0px 0px -5% 0px" }
      );
      serviceCards.forEach((el) => cardObs.observe(el));

      if (visualCol) {
        const stageObs = new IntersectionObserver(
          (entries, obs) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("is-inview");
                obs.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
        );
        stageObs.observe(visualCol);
      }
    } else {
      headerRevealNodes.forEach((el) => el.classList.add("is-inview"));
      serviceCards.forEach((el) => el.classList.add("is-inview"));
      if (visualCol) visualCol.classList.add("is-inview");
    }

    // 2. Interactive Service Synchronization (Cards <-> Sticky Visual Stage)
    let currentServiceId = "srv-web";

    function activateService(serviceId) {
      if (!serviceId || serviceId === currentServiceId) return;
      currentServiceId = serviceId;

      const meta = SERVICE_STAGE_META[serviceId] || SERVICE_STAGE_META["srv-web"];

      serviceCards.forEach((card) => {
        const isActive = card.getAttribute("data-service-id") === serviceId;
        card.classList.toggle("is-active-service", isActive);
      });

      stageTabs.forEach((tab) => {
        const isActive = tab.getAttribute("data-stage-target") === serviceId;
        tab.classList.toggle("is-active", isActive);
        tab.setAttribute("aria-selected", String(isActive));
      });

      stagePanels.forEach((panel) => {
        const isActive =
          panel.getAttribute("data-service-panel") === serviceId;
        panel.classList.toggle("is-active", isActive);
      });

      if (visualStage) {
        visualStage.setAttribute("data-active-service", serviceId);
      }
      if (ambientGlow) {
        ambientGlow.setAttribute("data-active-theme", meta.theme);
      }
      if (stageActiveNum) {
        stageActiveNum.textContent = meta.num;
      }
      if (stageActiveLabel) {
        stageActiveLabel.textContent = meta.label;
      }
    }

    serviceCards.forEach((card, idx) => {
      const srvId = card.getAttribute("data-service-id");
      card.addEventListener("mouseenter", () => {
        if (srvId) activateService(srvId);
      });
      card.addEventListener("focus", () => {
        if (srvId) activateService(srvId);
      });
      card.addEventListener("click", (event) => {
        if (event.target.closest("a")) return;
        if (srvId) activateService(srvId);
      });
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          if (document.activeElement === card && srvId) {
            event.preventDefault();
            activateService(srvId);
          }
        } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          const dir = event.key === "ArrowDown" ? 1 : -1;
          const nextIdx =
            (idx + dir + serviceCards.length) % serviceCards.length;
          serviceCards[nextIdx].focus();
        }
      });
    });

    stageTabs.forEach((tab, idx) => {
      tab.addEventListener("click", () => {
        const targetId = tab.getAttribute("data-stage-target");
        if (targetId) activateService(targetId);
      });

      tab.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          const dir = event.key === "ArrowRight" ? 1 : -1;
          const nextIdx = (idx + dir + stageTabs.length) % stageTabs.length;
          stageTabs[nextIdx].focus();
          stageTabs[nextIdx].click();
        }
      });
    });

    // Clicking "VIEW SERVICE WORK" activates the matching category filter in #projects
    filterTriggerLinks.forEach((link) => {
      link.addEventListener("click", () => {
        const cat = link.getAttribute("data-service-filter-trigger");
        if (!cat) return;
        const projFilterBtn = document.querySelector(
          `.project-filter-btn[data-project-filter="${cat}"]`
        );
        if (projFilterBtn) {
          projFilterBtn.click();
        }
      });
    });

    // 3. Desktop Mouse Spotlight & Subtle 3D Tilt (Strictly clamped <= 3 deg)
    if (isFinePointer && !prefersReducedMotion) {
      const MAX_SRV_TILT = 2.8;

      serviceCards.forEach((card) => {
        let rafId = null;
        let targetRotX = 0;
        let targetRotY = 0;
        let currRotX = 0;
        let currRotY = 0;
        let isHovered = false;

        function animateCardTilt() {
          currRotX += (targetRotX - currRotX) * 0.16;
          currRotY += (targetRotY - currRotY) * 0.16;

          card.style.transform = `translate3d(0, -3px, 0) perspective(1000px) rotateX(${currRotX.toFixed(
            2
          )}deg) rotateY(${currRotY.toFixed(2)}deg)`;

          if (
            isHovered ||
            Math.abs(targetRotX - currRotX) > 0.02 ||
            Math.abs(targetRotY - currRotY) > 0.02
          ) {
            rafId = requestAnimationFrame(animateCardTilt);
          } else {
            card.style.transform = "";
            rafId = null;
          }
        }

        card.addEventListener(
          "mousemove",
          (event) => {
            const rect = card.getBoundingClientRect();
            const mx = event.clientX - rect.left;
            const my = event.clientY - rect.top;

            card.style.setProperty("--srv-mouse-x", `${mx.toFixed(1)}px`);
            card.style.setProperty("--srv-mouse-y", `${my.toFixed(1)}px`);

            const relX = (mx - rect.width / 2) / (rect.width / 2);
            const relY = (my - rect.height / 2) / (rect.height / 2);

            targetRotY = Math.max(
              -MAX_SRV_TILT,
              Math.min(MAX_SRV_TILT, relX * MAX_SRV_TILT)
            );
            targetRotX = Math.max(
              -MAX_SRV_TILT,
              Math.min(MAX_SRV_TILT, -relY * MAX_SRV_TILT)
            );

            if (!isHovered) {
              isHovered = true;
              if (!rafId) rafId = requestAnimationFrame(animateCardTilt);
            }
          },
          { passive: true }
        );

        card.addEventListener("mouseleave", () => {
          isHovered = false;
          targetRotX = 0;
          targetRotY = 0;
          currRotX = 0;
          currRotY = 0;
          if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
          card.style.transform = "";
        });
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 13. 07 — CONTACT / LOCALSTORAGE FORM, VALIDATION & INTERACTIVE ORB ENGINE
  // ---------------------------------------------------------------------------
  const CONTACT_STORAGE_KEY = "daniyal_portfolio_contact_messages";

  function initContactSection() {
    const contactSection = document.getElementById("contact");
    if (!contactSection) return;

    const headerRevealNodes = Array.from(
      contactSection.querySelectorAll('[data-contact-reveal="header"]')
    );
    const orbCard = document.getElementById("contact-orb-card");
    const orbRig = document.getElementById("contact-orb-rig");
    const infoNodes = Array.from(
      contactSection.querySelectorAll('[data-contact-reveal="info"]')
    );
    const formCol = contactSection.querySelector(
      '[data-contact-reveal="form"]'
    );
    const climaxCta = contactSection.querySelector(
      '[data-contact-reveal="cta"]'
    );
    const formShell = document.getElementById("contact-form-shell");
    const contactForm = document.getElementById("contact-form");
    const successState = document.getElementById("contact-success-state");
    const storageBadge = document.getElementById("form-storage-badge");

    const nameInput = document.getElementById("contact-name");
    const emailInput = document.getElementById("contact-email");
    const subjectInput = document.getElementById("contact-subject");
    const messageInput = document.getElementById("contact-message");
    const charCount = document.getElementById("contact-char-count");

    const copyEmailBtn = document.getElementById("contact-copy-email-btn");
    const copyEmailText = document.getElementById("contact-copy-email-text");
    const copyPhoneBtn = document.getElementById("contact-copy-phone-btn");
    const copyPhoneText = document.getElementById("contact-copy-phone-text");

    const savedSenderEl = document.getElementById("saved-msg-sender");
    const savedTimeEl = document.getElementById("saved-msg-time");
    const savedSubjectEl = document.getElementById("saved-msg-subject");
    const savedBodyEl = document.getElementById("saved-msg-body");
    const copySavedBtn = document.getElementById("btn-copy-saved-msg");
    const copySavedLabel = document.getElementById("copy-saved-msg-label");
    const openEmailAppBtn = document.getElementById("btn-open-email-app");
    const sendAnotherBtn = document.getElementById("btn-send-another");
    const startConversationBtn = document.getElementById(
      "btn-start-conversation"
    );

    // 1. Scroll Reveal Choreography
    if (prefersReducedMotion) {
      headerRevealNodes.forEach((el) => el.classList.add("is-inview"));
      if (orbCard) orbCard.classList.add("is-inview");
      infoNodes.forEach((el) => el.classList.add("is-inview"));
      if (formCol) formCol.classList.add("is-inview");
      if (climaxCta) climaxCta.classList.add("is-inview");
    } else if ("IntersectionObserver" in window) {
      const headerObs = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-inview");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.16, rootMargin: "0px 0px -5% 0px" }
      );
      headerRevealNodes.forEach((el) => headerObs.observe(el));

      if (orbCard) {
        headerObs.observe(orbCard);
      }
      if (formCol) {
        headerObs.observe(formCol);
      }
      if (climaxCta) {
        headerObs.observe(climaxCta);
      }

      const infoObs = new IntersectionObserver(
        (entries, obs) => {
          const visible = entries
            .filter((e) => e.isIntersecting)
            .map((e) => e.target);
          visible.forEach((item, idx) => {
            item.style.transitionDelay = `${Math.min(idx * 75, 250)}ms`;
            item.classList.add("is-inview");
            window.setTimeout(() => {
              item.style.transitionDelay = "0ms";
            }, 800 + idx * 75);
            obs.unobserve(item);
          });
        },
        { threshold: 0.14, rootMargin: "0px 0px -4% 0px" }
      );
      infoNodes.forEach((el) => infoObs.observe(el));
    } else {
      headerRevealNodes.forEach((el) => el.classList.add("is-inview"));
      if (orbCard) orbCard.classList.add("is-inview");
      infoNodes.forEach((el) => el.classList.add("is-inview"));
      if (formCol) formCol.classList.add("is-inview");
      if (climaxCta) climaxCta.classList.add("is-inview");
    }

    // 2. Interactive Orb & Form Mouse Spotlight
    if (isFinePointer && !prefersReducedMotion) {
      if (orbCard && orbRig) {
        let orbRaf = null;
        let targetOrbX = 0;
        let targetOrbY = 0;
        let currOrbX = 0;
        let currOrbY = 0;
        let orbHovered = false;

        function animateOrb() {
          currOrbX += (targetOrbX - currOrbX) * 0.14;
          currOrbY += (targetOrbY - currOrbY) * 0.14;
          orbRig.style.setProperty("--orb-x", `${currOrbX.toFixed(1)}px`);
          orbRig.style.setProperty("--orb-y", `${currOrbY.toFixed(1)}px`);

          if (
            orbHovered ||
            Math.abs(targetOrbX - currOrbX) > 0.1 ||
            Math.abs(targetOrbY - currOrbY) > 0.1
          ) {
            orbRaf = requestAnimationFrame(animateOrb);
          } else {
            orbRaf = null;
          }
        }

        orbCard.addEventListener(
          "mousemove",
          (event) => {
            const rect = orbCard.getBoundingClientRect();
            const relX =
              (event.clientX - (rect.left + rect.width / 2)) /
              (rect.width / 2);
            const relY =
              (event.clientY - (rect.top + rect.height / 2)) /
              (rect.height / 2);
            targetOrbX = Math.max(-14, Math.min(14, relX * 14));
            targetOrbY = Math.max(-14, Math.min(14, relY * 14));
            if (!orbHovered) {
              orbHovered = true;
              if (!orbRaf) orbRaf = requestAnimationFrame(animateOrb);
            }
          },
          { passive: true }
        );

        orbCard.addEventListener("mouseleave", () => {
          orbHovered = false;
          targetOrbX = 0;
          targetOrbY = 0;
          if (!orbRaf) orbRaf = requestAnimationFrame(animateOrb);
        });
      }

      if (formShell) {
        formShell.addEventListener(
          "mousemove",
          (event) => {
            const rect = formShell.getBoundingClientRect();
            formShell.style.setProperty(
              "--form-mouse-x",
              `${(event.clientX - rect.left).toFixed(1)}px`
            );
            formShell.style.setProperty(
              "--form-mouse-y",
              `${(event.clientY - rect.top).toFixed(1)}px`
            );
          },
          { passive: true }
        );
      }
    }

    // 3. Direct Copy Buttons for Email & Phone (+92 333 1001904)
    async function copyTextWithFeedback(text, btnEl, labelEl, toastNotice) {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
        }
        if (btnEl) btnEl.classList.add("is-copied");
        if (labelEl) labelEl.textContent = "COPIED ✓";
        showToast(toastNotice);
        window.setTimeout(() => {
          if (btnEl) btnEl.classList.remove("is-copied");
          if (labelEl) labelEl.textContent = "COPY";
        }, 2800);
      } catch {
        showToast(toastNotice);
      }
    }

    if (copyEmailBtn) {
      copyEmailBtn.addEventListener("click", () => {
        copyTextWithFeedback(
          "mdaniyalhayyat@gmail.com",
          copyEmailBtn,
          copyEmailText,
          "Copied mdaniyalhayyat@gmail.com to your clipboard."
        );
      });
    }

    if (copyPhoneBtn) {
      copyPhoneBtn.addEventListener("click", () => {
        copyTextWithFeedback(
          "+92 333 1001904",
          copyPhoneBtn,
          copyPhoneText,
          "Copied +92 333 1001904 to your clipboard."
        );
      });
    }

    // 4. LocalStorage Helper & Badge Counter
    function getSavedMessages() {
      try {
        const raw = localStorage.getItem(CONTACT_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }

    function updateStorageBadge() {
      if (!storageBadge) return;
      const saved = getSavedMessages();
      if (saved.length > 0) {
        storageBadge.textContent = `LOCALSTORAGE · ${saved.length} SAVED`;
      } else {
        storageBadge.textContent = "LOCALSTORAGE READY";
      }
    }
    updateStorageBadge();

    // 5. Floating Labels & Inline Form Validation
    const fieldsConfig = [
      {
        key: "name",
        input: nameInput,
        wrap: contactSection.querySelector('[data-field-wrap="name"]'),
        errorEl: document.getElementById("contact-name-error"),
        validate: (val) => {
          if (!val.trim()) return "Please enter your name.";
          return "";
        }
      },
      {
        key: "email",
        input: emailInput,
        wrap: contactSection.querySelector('[data-field-wrap="email"]'),
        errorEl: document.getElementById("contact-email-error"),
        validate: (val) => {
          const clean = val.trim();
          if (!clean) return "Please enter your email address.";
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(clean)) {
            return "Please enter a valid email format (e.g., name@domain.com).";
          }
          return "";
        }
      },
      {
        key: "subject",
        input: subjectInput,
        wrap: contactSection.querySelector('[data-field-wrap="subject"]'),
        errorEl: document.getElementById("contact-subject-error"),
        validate: (val) => {
          if (!val.trim()) return "Please enter a subject for your message.";
          return "";
        }
      },
      {
        key: "message",
        input: messageInput,
        wrap: contactSection.querySelector('[data-field-wrap="message"]'),
        errorEl: document.getElementById("contact-message-error"),
        validate: (val) => {
          if (!val.trim()) return "Please enter your project details or message.";
          return "";
        }
      }
    ];

    function syncFloatingState(cfg) {
      if (!cfg.input || !cfg.wrap) return;
      const hasVal = cfg.input.value.trim().length > 0;
      cfg.wrap.classList.toggle("has-value", hasVal);
    }

    function validateSingleField(cfg) {
      if (!cfg.input || !cfg.wrap || !cfg.errorEl) return true;
      const errMsg = cfg.validate(cfg.input.value);
      const hasErr = Boolean(errMsg);
      cfg.wrap.classList.toggle("has-error", hasErr);
      cfg.input.setAttribute("aria-invalid", String(hasErr));
      cfg.errorEl.textContent = errMsg;
      return !hasErr;
    }

    const CONTACT_DRAFT_KEY = "daniyal_portfolio_contact_draft";

    function saveDraftToStorage() {
      try {
        const draft = {
          name: nameInput ? nameInput.value : "",
          email: emailInput ? emailInput.value : "",
          subject: subjectInput ? subjectInput.value : "",
          message: messageInput ? messageInput.value : ""
        };
        localStorage.setItem(CONTACT_DRAFT_KEY, JSON.stringify(draft));
      } catch {
        // Ignore storage quota errors
      }
    }

    function clearDraftFromStorage() {
      try {
        localStorage.removeItem(CONTACT_DRAFT_KEY);
      } catch {
        // Ignore storage errors
      }
    }

    // Restore any saved contact draft safely on load
    (function restoreSavedDraft() {
      try {
        const raw = localStorage.getItem(CONTACT_DRAFT_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object") return;
        if (nameInput && typeof parsed.name === "string" && parsed.name) {
          nameInput.value = parsed.name;
        }
        if (emailInput && typeof parsed.email === "string" && parsed.email) {
          emailInput.value = parsed.email;
        }
        if (subjectInput && typeof parsed.subject === "string" && parsed.subject) {
          subjectInput.value = parsed.subject;
        }
        if (messageInput && typeof parsed.message === "string" && parsed.message) {
          messageInput.value = parsed.message;
          if (charCount) {
            charCount.textContent = `${parsed.message.length} / 5000`;
          }
        }
      } catch {
        // Safe fallback if corrupted
      }
    })();

    fieldsConfig.forEach((cfg) => {
      if (!cfg.input || !cfg.wrap) return;
      syncFloatingState(cfg);

      cfg.input.addEventListener("focus", () => {
        cfg.wrap.classList.add("is-focused");
      });

      cfg.input.addEventListener("blur", () => {
        cfg.wrap.classList.remove("is-focused");
        syncFloatingState(cfg);
        if (cfg.wrap.dataset.touched === "true") {
          validateSingleField(cfg);
        }
      });

      cfg.input.addEventListener("input", () => {
        syncFloatingState(cfg);
        saveDraftToStorage();
        if (cfg.key === "message" && charCount) {
          charCount.textContent = `${cfg.input.value.length} / 5000`;
        }
        if (cfg.wrap.classList.contains("has-error")) {
          validateSingleField(cfg);
        }
      });
    });

    // 6. Form Submission -> Save to LocalStorage & Transition to Success State
    let lastFormattedMessage = "";

    if (contactForm) {
      contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        let firstInvalidInput = null;
        let allValid = true;

        fieldsConfig.forEach((cfg) => {
          if (cfg.wrap) cfg.wrap.dataset.touched = "true";
          const isValid = validateSingleField(cfg);
          if (!isValid && allValid) {
            allValid = false;
            firstInvalidInput = cfg.input;
          }
        });

        if (!allValid) {
          if (firstInvalidInput) firstInvalidInput.focus();
          return;
        }

        const nameVal = nameInput ? nameInput.value.trim() : "";
        const emailVal = emailInput ? emailInput.value.trim() : "";
        const subjectVal = subjectInput ? subjectInput.value.trim() : "";
        const messageVal = messageInput ? messageInput.value.trim() : "";
        const timestamp = new Date().toLocaleString([], {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit"
        });

        const submissionRecord = {
          id: `msg_${Date.now()}`,
          name: nameVal,
          email: emailVal,
          subject: subjectVal,
          message: messageVal,
          savedAt: timestamp
        };

        try {
          const existing = getSavedMessages();
          existing.unshift(submissionRecord);
          localStorage.setItem(
            CONTACT_STORAGE_KEY,
            JSON.stringify(existing.slice(0, 25))
          );
        } catch {
          // Fallback if storage quota is restricted
        }

        updateStorageBadge();
        clearDraftFromStorage();

        lastFormattedMessage = [
          `To: Daniyal Hayat (mdaniyalhayyat@gmail.com)`,
          `From: ${nameVal} <${emailVal}>`,
          `Subject: ${subjectVal}`,
          `Saved Locally: ${timestamp}`,
          `---`,
          messageVal
        ].join("\n");

        if (savedSenderEl) {
          savedSenderEl.textContent = `From: ${nameVal} (${emailVal})`;
        }
        if (savedTimeEl) {
          savedTimeEl.textContent = `Saved locally · ${timestamp}`;
        }
        if (savedSubjectEl) {
          savedSubjectEl.textContent = `Subject: ${subjectVal}`;
        }
        if (savedBodyEl) {
          savedBodyEl.textContent = messageVal;
        }

        if (openEmailAppBtn) {
          const mailSubject = encodeURIComponent(subjectVal);
          const mailBody = encodeURIComponent(
            `Hi Daniyal,\n\n${messageVal}\n\n—\n${nameVal}\n${emailVal}`
          );
          openEmailAppBtn.setAttribute(
            "href",
            `mailto:mdaniyalhayyat@gmail.com?subject=${mailSubject}&body=${mailBody}`
          );
        }

        contactForm.classList.add("is-hidden");
        if (successState) {
          successState.classList.add("is-visible");
          successState.setAttribute("aria-hidden", "false");
        }
        if (copySavedBtn) copySavedBtn.focus();
      });
    }

    // Copy Formatted Saved Message
    if (copySavedBtn) {
      copySavedBtn.addEventListener("click", async () => {
        if (!lastFormattedMessage) return;
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(lastFormattedMessage);
          }
          if (copySavedLabel) copySavedLabel.textContent = "MESSAGE COPIED ✓";
          showToast("Copied your saved message to the clipboard.");
          window.setTimeout(() => {
            if (copySavedLabel) copySavedLabel.textContent = "COPY MESSAGE";
          }, 2800);
        } catch {
          showToast("Copied your saved message to the clipboard.");
        }
      });
    }

    // Send Another Message (Reset Form)
    function resetToContactForm(focusFirstField) {
      if (contactForm) {
        contactForm.reset();
        contactForm.classList.remove("is-hidden");
      }
      clearDraftFromStorage();
      if (charCount) {
        charCount.textContent = "0 / 5000";
      }
      fieldsConfig.forEach((cfg) => {
        if (cfg.wrap) {
          cfg.wrap.classList.remove("has-value", "has-error", "is-focused");
          delete cfg.wrap.dataset.touched;
        }
        if (cfg.input) cfg.input.setAttribute("aria-invalid", "false");
        if (cfg.errorEl) cfg.errorEl.textContent = "";
      });
      if (successState) {
        successState.classList.remove("is-visible");
        successState.setAttribute("aria-hidden", "true");
      }
      if (focusFirstField && nameInput) {
        nameInput.focus();
      }
    }

    if (sendAnotherBtn) {
      sendAnotherBtn.addEventListener("click", () => {
        resetToContactForm(true);
      });
    }

    if (startConversationBtn) {
      startConversationBtn.addEventListener("click", (event) => {
        event.preventDefault();
        resetToContactForm(false);
        if (formShell) {
          formShell.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        window.setTimeout(() => {
          if (nameInput) nameInput.focus();
        }, 420);
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 11. 08 — PREMIUM FOOTER / FINAL CTA ENGINE
  // ---------------------------------------------------------------------------
  function initFooterSection() {
    const footerEl = document.getElementById("footer");
    if (!footerEl) return;

    const footerRevealLines = footerEl.querySelectorAll('[data-footer-reveal="line"]');
    const footerRevealItems = footerEl.querySelectorAll('[data-footer-reveal="item"]');
    const localTimeEl = document.getElementById("footer-local-time");
    const yearEl = document.getElementById("footer-year");
    const backTopBtn = document.getElementById("footer-back-top-btn");
    const getInTouchBtn = document.getElementById("footer-get-in-touch-btn");

    // 1. Dynamic Year
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }

    // 2. Live Local Time in Pakistan (Asia/Karachi — UTC+5)
    function updatePakistanLocalTime() {
      if (!localTimeEl || document.hidden) return;
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Karachi",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true
        });
        localTimeEl.textContent = `${formatter.format(now)} GMT+5`;
      } catch {
        const now = new Date();
        localTimeEl.textContent = now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        });
      }
    }

    updatePakistanLocalTime();
    window.setInterval(updatePakistanLocalTime, 1000);

    // 3. Smooth Back-to-Top & Get-in-Touch Navigation
    if (backTopBtn) {
      backTopBtn.addEventListener("click", (event) => {
        event.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion ? "auto" : "smooth"
        });
      });
    }

    if (getInTouchBtn) {
      getInTouchBtn.addEventListener("click", (event) => {
        event.preventDefault();
        const contactSection = document.getElementById("contact");
        const nameInput = document.getElementById("contact-name");
        if (contactSection) {
          contactSection.scrollIntoView({
            behavior: prefersReducedMotion ? "auto" : "smooth",
            block: "start"
          });
        }
        window.setTimeout(() => {
          if (nameInput) nameInput.focus();
        }, 480);
      });
    }

    // 4. Scroll Reveal Choreography for Closing CTA & Footer Columns
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      footerRevealLines.forEach((line) => line.classList.add("is-inview"));
      footerRevealItems.forEach((item) => item.classList.add("is-inview"));
    } else {
      const footerCtaWrap = footerEl.querySelector('[data-footer-reveal="cta"]');
      if (footerCtaWrap) {
        const ctaObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                footerRevealLines.forEach((line, idx) => {
                  window.setTimeout(() => {
                    line.classList.add("is-inview");
                  }, idx * 115);
                });
                ctaObserver.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.2 }
        );
        ctaObserver.observe(footerCtaWrap);
      }

      const itemsObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-inview");
              itemsObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.14 }
      );

      footerRevealItems.forEach((item, idx) => {
        item.style.transitionDelay = `${idx * 65}ms`;
        itemsObserver.observe(item);
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 15. CINEMATIC TYPOGRAPHY & SCROLL STORYTELLING ENGINE
  //     - Character-by-character Hero headline reveal (accessible aria-label)
  //     - Word-by-word masked section heading reveal
  //     - Text scramble effect on small section labels
  //     - Pointer-reactive kinetic headings
  //     - Scroll-drawn section transition bridges
  // ---------------------------------------------------------------------------
  function initCinematicTypographyAndMotion() {
    if (prefersReducedMotion) {
      document
        .querySelectorAll(".section-transition-bridge")
        .forEach((b) => b.classList.add("is-drawn"));
      return;
    }

    // 1. Character-by-Character Hero Headline Splitter (Screen-Reader Safe)
    function splitElementIntoChars(el, baseDelaySec) {
      if (!el || el.getAttribute("data-char-split") === "true") return;
      const fullText = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (!fullText) return;

      el.setAttribute("data-char-split", "true");
      el.setAttribute("aria-label", fullText);
      el.style.setProperty("--base-delay", `${baseDelaySec}s`);

      const childNodes = Array.from(el.childNodes);
      el.replaceChildren();

      let charGlobalIndex = 0;

      function appendTextAsChars(textStr, targetParent, extraClass) {
        const words = textStr.split(" ");
        words.forEach((word, wIdx) => {
          if (!word) return;
          const wordWrap = document.createElement("span");
          wordWrap.style.display = "inline-block";
          wordWrap.style.whiteSpace = "nowrap";
          wordWrap.setAttribute("aria-hidden", "true");

          for (let c = 0; c < word.length; c++) {
            const mask = document.createElement("span");
            mask.className = "char-mask";

            const unit = document.createElement("span");
            unit.className = extraClass
              ? `char-unit ${extraClass}`
              : "char-unit";
            unit.style.setProperty("--char-index", String(charGlobalIndex));
            unit.textContent = word[c];
            charGlobalIndex++;

            mask.appendChild(unit);
            wordWrap.appendChild(mask);
          }

          targetParent.appendChild(wordWrap);

          if (wIdx < words.length - 1) {
            const space = document.createTextNode(" ");
            targetParent.appendChild(space);
          }
        });
      }

      childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const raw = (node.textContent || "").replace(/\s+/g, " ");
          const leadingSpace = raw.startsWith(" ");
          const trailingSpace = raw.endsWith(" ");
          const trimmed = raw.trim();
          if (leadingSpace && el.childNodes.length > 0) {
            el.appendChild(document.createTextNode(" "));
          }
          if (trimmed) {
            appendTextAsChars(trimmed, el, "");
          }
          if (trailingSpace) {
            el.appendChild(document.createTextNode(" "));
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const elem = node;
          const text = (elem.textContent || "").trim();
          const cls = elem.className || "";
          if (text) {
            appendTextAsChars(text, el, cls);
          }
        }
      });
    }

    const heroGreetingEl = document.querySelector(".hero-greeting");
    const heroNameEl = document.querySelector(".hero-name");
    splitElementIntoChars(heroGreetingEl, 0.08);
    splitElementIntoChars(heroNameEl, 0.14);

    // 2. Word-by-Word Masked Section Heading Splitter (Screen-Reader Safe)
    const sectionRevealLines = document.querySelectorAll(".about-reveal-line");
    sectionRevealLines.forEach((lineEl) => {
      if (lineEl.getAttribute("data-word-split") === "true") return;
      const fullText = (lineEl.textContent || "").replace(/\s+/g, " ").trim();
      if (!fullText) return;

      lineEl.setAttribute("data-word-split", "true");
      lineEl.setAttribute("aria-label", fullText);

      const childNodes = Array.from(lineEl.childNodes);
      lineEl.replaceChildren();
      let wordGlobalIndex = 0;

      function appendWords(textStr, extraClass) {
        const words = textStr.split(/\s+/).filter(Boolean);
        words.forEach((word, idx) => {
          if (lineEl.childNodes.length > 0 || idx > 0) {
            lineEl.appendChild(document.createTextNode(" "));
          }
          const mask = document.createElement("span");
          mask.className = "word-mask";
          mask.setAttribute("aria-hidden", "true");

          const unit = document.createElement("span");
          unit.className = extraClass ? `word-unit ${extraClass}` : "word-unit";
          unit.style.setProperty("--word-index", String(wordGlobalIndex));
          unit.textContent = word;
          wordGlobalIndex++;

          mask.appendChild(unit);
          lineEl.appendChild(mask);
        });
      }

      childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const clean = (node.textContent || "").replace(/\s+/g, " ").trim();
          if (clean) appendWords(clean, "");
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const elem = node;
          const clean = (elem.textContent || "").replace(/\s+/g, " ").trim();
          if (clean) appendWords(clean, elem.className || "");
        }
      });
    });

    // 3. Sophisticated Text Scrambler for Small Section Labels & Brand Wordmark
    const SCRAMBLE_GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789//·";

    function scrambleTextElement(el, durationMs) {
      if (!el || prefersReducedMotion || el.dataset.scrambling === "true") {
        return;
      }
      const original = el.dataset.originalText || (el.textContent || "").trim();
      if (!original) return;
      el.dataset.originalText = original;
      el.dataset.scrambling = "true";

      const totalFrames = Math.max(10, Math.round((durationMs || 480) / 28));
      let frame = 0;

      const timer = window.setInterval(() => {
        if (document.hidden) return;
        frame++;
        const progress = frame / totalFrames;
        const resolvedCount = Math.floor(progress * original.length);
        let output = "";

        for (let i = 0; i < original.length; i++) {
          const ch = original[i];
          if (ch === " " || i < resolvedCount) {
            output += ch;
          } else {
            output +=
              SCRAMBLE_GLYPHS[
                Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)
              ];
          }
        }

        el.textContent = output;

        if (frame >= totalFrames) {
          window.clearInterval(timer);
          el.textContent = original;
          el.dataset.scrambling = "false";
        }
      }, 28);
    }

    const scrambleLabels = document.querySelectorAll(
      ".about-section-label, .section-index-label, .footer-index-tag, .climax-cta-eyebrow, .footer-closing-eyebrow"
    );
    if ("IntersectionObserver" in window) {
      const scrambleObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              scrambleTextElement(entry.target, 520);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      scrambleLabels.forEach((lbl) => scrambleObserver.observe(lbl));
    }

    if (isFinePointer) {
      const brandWordmark = document.querySelector(".brand-wordmark");
      if (brandWordmark) {
        brandWordmark.addEventListener("mouseenter", () => {
          scrambleTextElement(brandWordmark, 380);
        });
      }
    }

    // 4. Interactive Pointer-Reactive Kinetic Headings (Desktop Fine Pointer)
    if (isFinePointer) {
      const kineticHeadings = document.querySelectorAll(
        ".hero-heading, .about-heading, .skills-heading, .projects-heading, .journey-heading, .services-heading, .contact-heading, .footer-closing-heading"
      );
      kineticHeadings.forEach((heading) => {
        heading.setAttribute("data-kinetic-heading", "true");
        heading.addEventListener(
          "mousemove",
          (event) => {
            const rect = heading.getBoundingClientRect();
            const relX =
              (event.clientX - (rect.left + rect.width / 2)) /
              Math.max(1, rect.width / 2);
            const relY =
              (event.clientY - (rect.top + rect.height / 2)) /
              Math.max(1, rect.height / 2);
            const shiftX = Math.max(-5, Math.min(5, relX * 4.5));
            const shiftY = Math.max(-3.5, Math.min(3.5, relY * 3));
            heading.style.setProperty("--kinetic-x", `${shiftX.toFixed(2)}px`);
            heading.style.setProperty("--kinetic-y", `${shiftY.toFixed(2)}px`);
          },
          { passive: true }
        );
        heading.addEventListener("mouseleave", () => {
          heading.style.setProperty("--kinetic-x", "0px");
          heading.style.setProperty("--kinetic-y", "0px");
        });
      });
    }

    // 5. Scroll-Triggered Divider Line Drawing on Section Transition Bridges
    const bridges = document.querySelectorAll(".section-transition-bridge");
    if ("IntersectionObserver" in window) {
      const bridgeObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-drawn");
            }
          });
        },
        { threshold: 0.25 }
      );
      bridges.forEach((b) => bridgeObserver.observe(b));
    } else {
      bridges.forEach((b) => b.classList.add("is-drawn"));
    }
  }

  // ---------------------------------------------------------------------------
  // 16. GSAP SCROLLTRIGGER CINEMATIC MASK-REVEAL & STAGGER SYSTEM
  //     - Smooth clip-path mask-reveal + word/char stagger for section headings
  //     - Curtain & inset mask-reveal + inner scale settle + parallax scrub for images
  //     - Staggered ScrollTrigger batch reveals for project monoliths & cards
  //     - Strict prefers-reduced-motion compliance via gsap.matchMedia()
  // ---------------------------------------------------------------------------
  function initGSAPScrollTriggerSystem() {
    const gsapInstance = window.gsap;
    const ScrollTriggerPlugin = window.ScrollTrigger;

    if (!gsapInstance || !ScrollTriggerPlugin) {
      return;
    }

    gsapInstance.registerPlugin(ScrollTriggerPlugin);
    ScrollTriggerPlugin.config({
      ignoreMobileResize: true,
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load,resize"
    });

    document.documentElement.classList.add("gsap-scrolltrigger-ready");

    const mm = gsapInstance.matchMedia();

    // -------------------------------------------------------------------------
    // BRANCH A: ACCESSIBILITY — PREFERS-REDUCED-MOTION: REDUCE
    // -------------------------------------------------------------------------
    mm.add("(prefers-reduced-motion: reduce)", () => {
      const allTargets = document.querySelectorAll(
        ".reveal-line, .char-unit, .about-reveal-line, .word-unit, .about-eyebrow, .skills-eyebrow, .projects-eyebrow, .journey-eyebrow, .services-eyebrow-wrap, .contact-eyebrow-wrap, .footer-closing-eyebrow, .skills-intro, .projects-intro, .journey-intro, .services-intro-wrap, .contact-intro-wrap, .footer-closing-subtext, #profile-frame, #profile-image, #about-image-rig, #about-image, .about-float-card, .project-monolith, .monolith-stage, .archive-card, .skill-card, .timeline-card, .service-card, .services-stage-card, .contact-orb-card, .contact-channel-item, .footer-avatar-link, .footer-avatar-img, .footer-brand-col, .footer-nav-col, .footer-deployments-col, .footer-contact-col, .footer-monument-wrap"
      );

      gsapInstance.set(allTargets, {
        clearProps: "all",
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        clipPath: "none",
        filter: "none"
      });

      document
        .querySelectorAll(".gsap-image-curtain")
        .forEach((curtain) => curtain.remove());
    });

    // -------------------------------------------------------------------------
    // BRANCH B: CINEMATIC MOTION — PREFERS-REDUCED-MOTION: NO-PREFERENCE
    // -------------------------------------------------------------------------
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Helper: Inject a smooth architectural curtain overlay inside an image mask container
      function ensureImageCurtain(maskContainer) {
        if (!maskContainer) return null;
        let curtain = maskContainer.querySelector(".gsap-image-curtain");
        if (!curtain) {
          curtain = document.createElement("div");
          curtain.className = "gsap-image-curtain";
          curtain.setAttribute("aria-hidden", "true");
          maskContainer.appendChild(curtain);
        }
        return curtain;
      }

      // 1. HERO SECTION: Scroll-scrubbed subtle depth parallax on Hero portrait
      //    (Hero entrance animations are cleanly driven by body.is-loaded CSS transitions
      //     with zero competing GSAP entrance tweens on the same elements)
      const profileImage = document.getElementById("profile-image");

      if (profileImage) {
        gsapInstance.to(profileImage, {
          yPercent: 7,
          ease: "none",
          scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: 0.65
          }
        });
      }

      // 2. UNIVERSAL SECTION HEADINGS MASK-REVEAL & STAGGER SYSTEM
      //    Covers 02 About, 03 Skills, 04 Projects, 05 Experience, 06 Services, 07 Contact, 08 Footer
      const sectionHeaderConfigs = [
        {
          container: ".about-header",
          eyebrow: ".about-eyebrow",
          lines: ".about-reveal-line",
          intro: ".about-philosophy"
        },
        {
          container: ".skills-header",
          eyebrow: ".skills-eyebrow",
          lines: ".about-reveal-line",
          intro: ".skills-intro"
        },
        {
          container: ".projects-header",
          eyebrow: ".projects-eyebrow",
          lines: ".about-reveal-line",
          intro: ".projects-intro"
        },
        {
          container: ".journey-header",
          eyebrow: ".journey-eyebrow",
          lines: ".about-reveal-line",
          intro: ".journey-intro"
        },
        {
          container: ".services-header-grid",
          eyebrow: ".services-eyebrow-wrap",
          lines: ".about-reveal-line",
          intro: ".services-intro-wrap"
        },
        {
          container: ".contact-header-grid",
          eyebrow: ".contact-eyebrow-wrap",
          lines: ".about-reveal-line",
          intro: ".contact-intro-wrap"
        },
        {
          container: ".footer-closing-cta",
          eyebrow: ".footer-closing-eyebrow",
          lines: ".about-reveal-line",
          intro: ".footer-closing-subtext"
        }
      ];

      sectionHeaderConfigs.forEach((cfg) => {
        const headerEl = document.querySelector(cfg.container);
        if (!headerEl) return;

        const eyebrowEl = headerEl.querySelector(cfg.eyebrow);
        const lineEls = headerEl.querySelectorAll(cfg.lines);
        const wordUnits = headerEl.querySelectorAll(".word-unit");
        const introEl =
          headerEl.querySelector(cfg.intro) ||
          (cfg.container === ".about-header"
            ? document.querySelector(".about-philosophy")
            : null);

        if (eyebrowEl) eyebrowEl.setAttribute("data-gsap-controlled", "true");
        lineEls.forEach((l) => l.setAttribute("data-gsap-controlled", "true"));
        wordUnits.forEach((w) => w.setAttribute("data-gsap-controlled", "true"));
        if (introEl) introEl.setAttribute("data-gsap-controlled", "true");

        const tl = gsapInstance.timeline({
          scrollTrigger: {
            trigger: headerEl,
            start: "top 84%",
            toggleActions: "play none none none",
            once: true,
            onEnter: () => {
              if (eyebrowEl) eyebrowEl.classList.add("is-inview");
              lineEls.forEach((l) => l.classList.add("is-inview"));
              if (introEl) introEl.classList.add("is-inview");
            }
          }
        });

        if (eyebrowEl) {
          tl.fromTo(
            eyebrowEl,
            { y: 16, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.65,
              ease: "power3.out"
            },
            0
          );
        }

        if (lineEls.length > 0) {
          tl.fromTo(
            lineEls,
            {
              clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
              y: 24,
              opacity: 0
            },
            {
              clipPath: "polygon(0% 0%, 100% 0%, 100% 120%, 0% 120%)",
              y: 0,
              opacity: 1,
              duration: 0.92,
              stagger: 0.12,
              ease: "power4.out"
            },
            0.08
          );
        }

        if (wordUnits.length > 0) {
          tl.fromTo(
            wordUnits,
            {
              yPercent: 110,
              opacity: 0,
              filter: "blur(4px)"
            },
            {
              yPercent: 0,
              opacity: 1,
              filter: "blur(0px)",
              duration: 0.85,
              stagger: 0.048,
              ease: "power4.out"
            },
            0.12
          );
        }

        if (introEl) {
          tl.fromTo(
            introEl,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.78,
              ease: "power3.out"
            },
            0.26
          );
        }
      });

      // 3. ABOUT PORTRAIT IMAGE MASK-REVEAL, CURTAIN WIPE & STAGGERED FLOAT CARDS
      const aboutImageRig = document.getElementById("about-image-rig");
      const aboutImage = document.getElementById("about-image");
      const aboutImageInner = document.querySelector(".about-image-inner");
      const aboutFloatCards = document.querySelectorAll(".about-float-card");
      const aboutParagraphs = document.querySelectorAll(".about-paragraph");
      const aboutInfoCards = document.querySelectorAll(".about-info-card");

      if (aboutImageRig && aboutImage) {
        aboutImageRig.setAttribute("data-gsap-controlled", "true");
        aboutImage.setAttribute("data-gsap-controlled", "true");
        const aboutCurtain = ensureImageCurtain(aboutImageInner);

        if (aboutCurtain) {
          gsapInstance.set(aboutCurtain, {
            scaleY: 1,
            transformOrigin: "bottom center"
          });
        }

        const aboutImgTl = gsapInstance.timeline({
          scrollTrigger: {
            trigger: "#about-visual-stage",
            start: "top 82%",
            toggleActions: "play none none none",
            once: true,
            onEnter: () => {
              aboutImageRig.classList.add("is-inview");
              aboutFloatCards.forEach((c) => c.classList.add("is-inview"));
            }
          }
        });

        aboutImgTl
          .fromTo(
            aboutImageRig,
            {
              clipPath: "inset(18% 12% 18% 12% round 24px)",
              opacity: 0,
              y: 34,
              scale: 0.94
            },
            {
              clipPath: "inset(0% 0% 0% 0% round 24px)",
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1.25,
              ease: "expo.out"
            },
            0
          )
          .fromTo(
            aboutImage,
            {
              scale: 1.16,
              filter: "blur(6px)"
            },
            {
              scale: 1,
              filter: "blur(0px)",
              duration: 1.45,
              ease: "expo.out"
            },
            0.05
          );

        if (aboutCurtain) {
          aboutImgTl.to(
            aboutCurtain,
            {
              scaleY: 0,
              duration: 1.05,
              ease: "expo.inOut"
            },
            0.08
          );
        }

        if (aboutFloatCards.length > 0) {
          aboutFloatCards.forEach((c) =>
            c.setAttribute("data-gsap-controlled", "true")
          );
          aboutImgTl.fromTo(
            aboutFloatCards,
            {
              y: 24,
              opacity: 0,
              scale: 0.9
            },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.82,
              stagger: 0.14,
              ease: "back.out(1.4)"
            },
            0.38
          );
        }

        // Smooth scroll-linked parallax scrub on About portrait image
        gsapInstance.fromTo(
          aboutImage,
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: "none",
            scrollTrigger: {
              trigger: "#about-visual-stage",
              start: "top bottom",
              end: "bottom top",
              scrub: 0.65
            }
          }
        );
      }

      if (aboutParagraphs.length > 0) {
        gsapInstance.fromTo(
          aboutParagraphs,
          { y: 22, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.78,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".about-prose",
              start: "top 85%",
              once: true,
              onEnter: () => {
                aboutParagraphs.forEach((p) => p.classList.add("is-inview"));
              }
            }
          }
        );
      }

      if (aboutInfoCards.length > 0) {
        gsapInstance.fromTo(
          aboutInfoCards,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.72,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".about-info-grid",
              start: "top 86%",
              once: true,
              onEnter: () => {
                aboutInfoCards.forEach((c) => c.classList.add("is-inview"));
              }
            }
          }
        );
      }

      // 4. SELECTED PROJECTS: MONOLITH VISUAL STAGE MASK-REVEAL & STAGGERED DETAILS
      const projectMonoliths = document.querySelectorAll(".project-monolith");
      projectMonoliths.forEach((monolith) => {
        const stageEl = monolith.querySelector(".monolith-stage");
        const screenEl = monolith.querySelector(".monolith-screen");
        const previewItems = monolith.querySelectorAll(
          ".ui-preview-topbar, .ui-preview-hero-block, .ui-mini-card, .ui-telemetry-box, .ui-weather-primary, .ui-weather-stat, .ui-hud-item, .ui-studio-card"
        );
        const contentItems = monolith.querySelectorAll(
          ".monolith-meta-top, .monolith-title, .monolith-tagline, .monolith-desc, .monolith-metric-item, .monolith-tech-tag, .monolith-actions .project-btn"
        );

        if (stageEl) stageEl.setAttribute("data-gsap-controlled", "true");
        const stageCurtain = ensureImageCurtain(screenEl);
        if (stageCurtain) {
          gsapInstance.set(stageCurtain, {
            scaleY: 1,
            transformOrigin: "bottom center"
          });
        }

        const projTl = gsapInstance.timeline({
          scrollTrigger: {
            trigger: monolith,
            start: "top 82%",
            toggleActions: "play none none none",
            once: true,
            onEnter: () => {
              monolith.classList.add("is-inview");
            }
          }
        });

        if (stageEl) {
          projTl.fromTo(
            stageEl,
            {
              clipPath: "inset(14% 8% 14% 8% round 18px)",
              opacity: 0,
              y: 28,
              scale: 0.95
            },
            {
              clipPath: "inset(0% 0% 0% 0% round 18px)",
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1.15,
              ease: "expo.out"
            },
            0
          );
        }

        if (stageCurtain) {
          projTl.to(
            stageCurtain,
            {
              scaleY: 0,
              duration: 0.95,
              ease: "expo.inOut"
            },
            0.06
          );
        }

        if (previewItems.length > 0) {
          projTl.fromTo(
            previewItems,
            { y: 16, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.65,
              stagger: 0.055,
              ease: "power3.out"
            },
            0.22
          );
        }

        if (contentItems.length > 0) {
          projTl.fromTo(
            contentItems,
            { y: 18, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.68,
              stagger: 0.045,
              ease: "power3.out"
            },
            0.14
          );
        }
      });

      // 5. STAGGERED BATCH REVEALS FOR SKILLS, ARCHIVE PROJECTS, TIMELINE & SERVICES
      ScrollTriggerPlugin.batch(".skill-card", {
        start: "top 88%",
        once: true,
        onEnter: (batch) => {
          batch.forEach((card) => card.classList.add("is-inview"));
          gsapInstance.fromTo(
            batch,
            { y: 26, opacity: 0, scale: 0.97 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.75,
              stagger: 0.06,
              ease: "power3.out",
              overwrite: "auto"
            }
          );
        }
      });

      ScrollTriggerPlugin.batch(".archive-card", {
        start: "top 88%",
        once: true,
        onEnter: (batch) => {
          batch.forEach((card) => card.classList.add("is-inview"));
          gsapInstance.fromTo(
            batch,
            {
              clipPath: "inset(10% 6% 10% 6% round 20px)",
              y: 28,
              opacity: 0
            },
            {
              clipPath: "inset(0% 0% 0% 0% round 20px)",
              y: 0,
              opacity: 1,
              duration: 0.85,
              stagger: 0.08,
              ease: "expo.out",
              overwrite: "auto"
            }
          );
        }
      });

      ScrollTriggerPlugin.batch(".timeline-card", {
        start: "top 86%",
        once: true,
        onEnter: (batch) => {
          batch.forEach((card) => {
            card.classList.add("is-inview");
            const parentItem = card.closest(".timeline-item");
            if (parentItem) parentItem.classList.add("is-inview");
          });
          gsapInstance.fromTo(
            batch,
            {
              clipPath: "inset(8% 4% 8% 4% round 22px)",
              y: 26,
              opacity: 0
            },
            {
              clipPath: "inset(0% 0% 0% 0% round 22px)",
              y: 0,
              opacity: 1,
              duration: 0.88,
              stagger: 0.1,
              ease: "expo.out",
              overwrite: "auto"
            }
          );
        }
      });

      // 6. SERVICES VISUAL STAGE, CONTACT ORB & FOOTER AVATAR MASK-REVEALS
      const servicesStageCard = document.querySelector(".services-stage-card");
      if (servicesStageCard) {
        servicesStageCard.setAttribute("data-gsap-controlled", "true");
        gsapInstance.fromTo(
          servicesStageCard,
          {
            clipPath: "inset(12% 8% 12% 8% round 24px)",
            y: 28,
            opacity: 0
          },
          {
            clipPath: "inset(0% 0% 0% 0% round 24px)",
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: servicesStageCard,
              start: "top 84%",
              once: true,
              onEnter: () => {
                const col = servicesStageCard.closest(".services-visual-col");
                if (col) col.classList.add("is-inview");
              }
            }
          }
        );
      }

      const contactOrbCard = document.querySelector(".contact-orb-card");
      if (contactOrbCard) {
        contactOrbCard.setAttribute("data-gsap-controlled", "true");
        gsapInstance.fromTo(
          contactOrbCard,
          {
            clipPath: "inset(12% 8% 12% 8% round 24px)",
            y: 26,
            opacity: 0
          },
          {
            clipPath: "inset(0% 0% 0% 0% round 24px)",
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: contactOrbCard,
              start: "top 84%",
              once: true,
              onEnter: () => {
                contactOrbCard.classList.add("is-inview");
              }
            }
          }
        );
      }

      const footerAvatarLink = document.querySelector(".footer-avatar-link");
      const footerAvatarImg = document.querySelector(".footer-avatar-img");
      const footerCols = document.querySelectorAll(
        ".footer-brand-col, .footer-nav-col, .footer-deployments-col, .footer-contact-col"
      );

      if (footerCols.length > 0) {
        gsapInstance.fromTo(
          footerCols,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.82,
            stagger: 0.09,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".footer-main-grid",
              start: "top 86%",
              once: true,
              onEnter: () => {
                footerCols.forEach((c) => c.classList.add("is-inview"));
              }
            }
          }
        );
      }

      if (footerAvatarLink && footerAvatarImg) {
        gsapInstance.fromTo(
          footerAvatarLink,
          {
            clipPath: "inset(20% 20% 20% 20% round 14px)",
            scale: 0.9
          },
          {
            clipPath: "inset(0% 0% 0% 0% round 14px)",
            scale: 1,
            duration: 0.95,
            ease: "expo.out",
            scrollTrigger: {
              trigger: ".footer-main-grid",
              start: "top 86%",
              once: true
            }
          }
        );
      }

      // Refresh ScrollTrigger once images and layout settle
      window.addEventListener(
        "load",
        () => {
          ScrollTriggerPlugin.refresh();
        },
        { once: true }
      );
    });
  }

  // ---------------------------------------------------------------------------
  // 17. DNYL INFINITY COMMAND PALETTE (⌘K / Ctrl+K) & REPLAY INTRO CONTROLLER
  // ---------------------------------------------------------------------------
  function initDnylCommandPalette() {
    const paletteBackdrop = document.getElementById("dnyl-command-palette");
    const triggerBtn = document.getElementById("cmd-palette-trigger");
    const closeBtn = document.getElementById("cmd-palette-close");
    const searchInput = document.getElementById("cmd-palette-input");
    const resultsContainer = document.getElementById("cmd-palette-results");
    const countLabel = document.getElementById("cmd-palette-count");
    const replayFooterBtn = document.getElementById("footer-replay-intro-btn");

    if (replayFooterBtn) {
      replayFooterBtn.addEventListener("click", () => {
        if (typeof window.replayDnylIntro === "function") {
          window.replayDnylIntro();
        }
      });
    }

    if (!paletteBackdrop || !searchInput || !resultsContainer) return;

    // Build real command registry from verified portfolio sections, system actions & 12 projects
    const baseCommands = [
      {
        group: "NAVIGATION // PORTFOLIO SECTIONS",
        tag: "01",
        title: "Home & Hero Stage",
        subtitle: "Daniyal Hayat — Full-Stack Developer & Creative Builder",
        actionLabel: "JUMP →",
        keywords: "home hero top intro daniyal hayat dnyl",
        run: () => scrollToSection("#hero")
      },
      {
        group: "NAVIGATION // PORTFOLIO SECTIONS",
        tag: "02",
        title: "About Me & Engineering Philosophy",
        subtitle: "Architecture discipline, personal bio, and verified metrics",
        actionLabel: "JUMP →",
        keywords: "about bio philosophy stats metrics",
        run: () => scrollToSection("#about")
      },
      {
        group: "NAVIGATION // PORTFOLIO SECTIONS",
        tag: "03",
        title: "Skills & Technology Ecosystem Matrix",
        subtitle: "20 verified technologies across Frontend, Mobile, AI & Tooling",
        actionLabel: "JUMP →",
        keywords: "skills stack react nextjs typescript kotlin android gemini tailwind",
        run: () => scrollToSection("#skills")
      },
      {
        group: "NAVIGATION // PORTFOLIO SECTIONS",
        tag: "04",
        title: "Selected Work & Production Archive",
        subtitle: "12 flagship monoliths, mobile apps, and AI suites",
        actionLabel: "JUMP →",
        keywords: "projects work portfolio repositories github",
        run: () => scrollToSection("#projects")
      },
      {
        group: "NAVIGATION // PORTFOLIO SECTIONS",
        tag: "05",
        title: "Experience & Engineering Journey",
        subtitle: "Chronological development milestones (2023 — 2026)",
        actionLabel: "JUMP →",
        keywords: "experience journey timeline milestones career",
        run: () => scrollToSection("#experience")
      },
      {
        group: "NAVIGATION // PORTFOLIO SECTIONS",
        tag: "06",
        title: "Services & Specialized Capabilities",
        subtitle: "Web Platforms, Kotlin Android, Gemini AI & UI/UX Craft",
        actionLabel: "JUMP →",
        keywords: "services capabilities what i do hire",
        run: () => scrollToSection("#services")
      },
      {
        group: "NAVIGATION // PORTFOLIO SECTIONS",
        tag: "07",
        title: "Contact & Local Transmission Composer",
        subtitle: "Direct email, phone (+92 333 1001904) & offline-first composer",
        actionLabel: "JUMP →",
        keywords: "contact email phone message hire collaborate",
        run: () => scrollToSection("#contact")
      },
      {
        group: "SYSTEM // INTERACTIVE CONTROLS",
        tag: "PLAY",
        title: "Replay Cinematic Intro (“Enter the World of DNYL”)",
        subtitle: "Re-launch the 7-step GSAP opening title sequence",
        actionLabel: "LAUNCH ↺",
        keywords: "replay intro animation opening sequence dnyl",
        run: () => {
          if (typeof window.replayDnylIntro === "function") {
            window.replayDnylIntro();
          }
        }
      },
      {
        group: "SYSTEM // INTERACTIVE CONTROLS",
        tag: "THEME",
        title: "Toggle Dark / Light Color Theme",
        subtitle: "Switch between Obsidian Dark and Warm Ivory Light mode",
        actionLabel: "SWITCH ◐",
        keywords: "theme dark light mode color appearance",
        run: () => {
          if (themeToggleBtn) themeToggleBtn.click();
        }
      },
      {
        group: "SYSTEM // INTERACTIVE CONTROLS",
        tag: "MAIL",
        title: "Copy Email Address (mdaniyalhayyat@gmail.com)",
        subtitle: "Copy verified inbox address to clipboard",
        actionLabel: "COPY ⎘",
        keywords: "copy email mdaniyalhayyat gmail",
        run: async () => {
          try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
              await navigator.clipboard.writeText("mdaniyalhayyat@gmail.com");
            }
          } catch {
            // Ignore clipboard errors
          }
          showToast("Copied mdaniyalhayyat@gmail.com to your clipboard.");
        }
      },
      {
        group: "SYSTEM // INTERACTIVE CONTROLS",
        tag: "DIAL",
        title: "Copy Phone Number (+92 333 1001904)",
        subtitle: "Copy verified direct line to clipboard",
        actionLabel: "COPY ⎘",
        keywords: "copy phone call number +923331001904",
        run: async () => {
          try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
              await navigator.clipboard.writeText("+92 333 1001904");
            }
          } catch {
            // Ignore clipboard errors
          }
          showToast("Copied +92 333 1001904 to your clipboard.");
        }
      },
      {
        group: "SYSTEM // INTERACTIVE CONTROLS",
        tag: "CODE",
        title: "Open GitHub Profile (@DotDaniyal)",
        subtitle: "https://github.com/DotDaniyal",
        actionLabel: "GITHUB ↗",
        keywords: "github source code repositories dotdaniyal",
        run: () => {
          window.location.href = "https://github.com/DotDaniyal";
        }
      }
    ];

    const projectCommands = Object.keys(REAL_PROJECTS_DATA).map((projId) => {
      const p = REAL_PROJECTS_DATA[projId];
      return {
        group: "DEEP-DIVE CASE STUDIES // 12 VERIFIED PROJECTS",
        tag: `P·${p.index}`,
        title: p.title,
        subtitle: `${p.category} · ${(p.technologies || []).slice(0, 4).join(" · ")}`,
        actionLabel: "INSPECT +",
        keywords: `${p.title} ${p.category} ${p.language} ${(p.technologies || []).join(" ")}`.toLowerCase(),
        run: () => {
          scrollToSection("#projects");
          if (typeof window.openDnylCaseStudy === "function") {
            window.openDnylCaseStudy(projId, triggerBtn);
          }
        }
      };
    });

    const allCommands = [...baseCommands, ...projectCommands];
    let filteredCommands = [...allCommands];
    let selectedIndex = 0;
    let lastFocusBeforePalette = null;

    function scrollToSection(selector) {
      const el = document.querySelector(selector);
      if (el) {
        el.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start"
        });
      }
    }

    function renderCommandList(query) {
      const q = (query || "").trim().toLowerCase();
      filteredCommands = allCommands.filter((cmd) => {
        if (!q) return true;
        return (
          cmd.title.toLowerCase().includes(q) ||
          cmd.subtitle.toLowerCase().includes(q) ||
          cmd.keywords.includes(q)
        );
      });

      selectedIndex = 0;
      resultsContainer.replaceChildren();

      if (countLabel) {
        countLabel.textContent = `${filteredCommands.length} COMMAND${
          filteredCommands.length === 1 ? "" : "S"
        } READY`;
      }

      if (filteredCommands.length === 0) {
        const emptyEl = document.createElement("div");
        emptyEl.className = "cmd-group-heading";
        emptyEl.textContent = "NO MATCHING COMMANDS OR PROJECTS FOUND";
        resultsContainer.appendChild(emptyEl);
        return;
      }

      let currentGroup = "";
      filteredCommands.forEach((cmd, idx) => {
        if (cmd.group !== currentGroup) {
          currentGroup = cmd.group;
          const groupHeader = document.createElement("div");
          groupHeader.className = "cmd-group-heading";
          groupHeader.textContent = currentGroup;
          resultsContainer.appendChild(groupHeader);
        }

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `cmd-item${idx === selectedIndex ? " is-selected" : ""}`;
        btn.setAttribute("role", "option");
        btn.setAttribute("aria-selected", String(idx === selectedIndex));
        btn.setAttribute("data-cmd-idx", String(idx));

        const left = document.createElement("div");
        left.className = "cmd-item-left";

        const tag = document.createElement("span");
        tag.className = "cmd-item-tag";
        tag.textContent = cmd.tag;

        const titles = document.createElement("div");
        titles.className = "cmd-item-titles";

        const titleSpan = document.createElement("span");
        titleSpan.className = "cmd-item-title";
        titleSpan.textContent = cmd.title;

        const subSpan = document.createElement("span");
        subSpan.className = "cmd-item-sub";
        subSpan.textContent = cmd.subtitle;

        titles.appendChild(titleSpan);
        titles.appendChild(subSpan);
        left.appendChild(tag);
        left.appendChild(titles);

        const actionSpan = document.createElement("span");
        actionSpan.className = "cmd-item-action";
        actionSpan.textContent = cmd.actionLabel;

        btn.appendChild(left);
        btn.appendChild(actionSpan);

        btn.addEventListener("mouseenter", () => {
          selectedIndex = idx;
          updateSelectedHighlight();
        });

        btn.addEventListener("click", () => {
          executeCommand(idx);
        });

        resultsContainer.appendChild(btn);
      });
    }

    function updateSelectedHighlight() {
      const items = resultsContainer.querySelectorAll(".cmd-item");
      items.forEach((el, idx) => {
        const isSel = idx === selectedIndex;
        el.classList.toggle("is-selected", isSel);
        el.setAttribute("aria-selected", String(isSel));
        if (isSel) {
          el.scrollIntoView({ block: "nearest" });
        }
      });
    }

    function executeCommand(idx) {
      const cmd = filteredCommands[idx];
      if (!cmd) return;
      closeCommandPalette();
      cmd.run();
    }

    function openCommandPalette() {
      if (paletteBackdrop.classList.contains("is-open")) return;
      lastFocusBeforePalette = document.activeElement;
      paletteBackdrop.classList.add("is-open");
      paletteBackdrop.setAttribute("aria-hidden", "false");
      if (triggerBtn) triggerBtn.setAttribute("aria-expanded", "true");
      searchInput.value = "";
      renderCommandList("");
      window.setTimeout(() => {
        searchInput.focus();
      }, 20);
    }

    function closeCommandPalette() {
      if (!paletteBackdrop.classList.contains("is-open")) return;
      paletteBackdrop.classList.remove("is-open");
      paletteBackdrop.setAttribute("aria-hidden", "true");
      if (triggerBtn) triggerBtn.setAttribute("aria-expanded", "false");
      if (
        lastFocusBeforePalette &&
        typeof lastFocusBeforePalette.focus === "function"
      ) {
        lastFocusBeforePalette.focus();
      }
    }

    if (triggerBtn) {
      triggerBtn.addEventListener("click", () => {
        if (paletteBackdrop.classList.contains("is-open")) {
          closeCommandPalette();
        } else {
          openCommandPalette();
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", closeCommandPalette);
    }

    paletteBackdrop.addEventListener("click", (event) => {
      if (event.target === paletteBackdrop) {
        closeCommandPalette();
      }
    });

    searchInput.addEventListener("input", () => {
      renderCommandList(searchInput.value);
    });

    window.addEventListener("keydown", (event) => {
      // Toggle Command Palette on Cmd+K or Ctrl+K
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (paletteBackdrop.classList.contains("is-open")) {
          closeCommandPalette();
        } else {
          openCommandPalette();
        }
        return;
      }

      if (!paletteBackdrop.classList.contains("is-open")) return;

      if (event.key === "Escape") {
        event.preventDefault();
        closeCommandPalette();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        if (filteredCommands.length > 0) {
          selectedIndex = (selectedIndex + 1) % filteredCommands.length;
          updateSelectedHighlight();
        }
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        if (filteredCommands.length > 0) {
          selectedIndex =
            (selectedIndex - 1 + filteredCommands.length) %
            filteredCommands.length;
          updateSelectedHighlight();
        }
      } else if (event.key === "Enter") {
        if (filteredCommands.length > 0) {
          event.preventDefault();
          executeCommand(selectedIndex);
        }
      }
    });
  }

  // Fault-isolated initializer runner so no single module can block the intro or hero reveal
  function runSafeInit(initFn) {
    try {
      initFn();
    } catch {
      // Ensure body is never left locked in is-loading if an unexpected runtime error occurs
      body.classList.remove("is-loading");
      body.classList.add("is-loaded");
    }
  }

  function bootstrapPortfolio() {
    runSafeInit(initPageLoadSequence);
    runSafeInit(initCinematicTypographyAndMotion);
    runSafeInit(initGSAPScrollTriggerSystem);
    runSafeInit(initParticlesCanvas);
    runSafeInit(initAboutScrollAnimations);
    runSafeInit(initSkillsSection);
    runSafeInit(initProjectsSection);
    runSafeInit(initJourneySection);
    runSafeInit(initServicesSection);
    runSafeInit(initContactSection);
    runSafeInit(initFooterSection);
    runSafeInit(initDnylCommandPalette);
  }

  // Initialize on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrapPortfolio);
  } else {
    bootstrapPortfolio();
  }
})();
