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
  // 1. PAGE LOAD ORCHESTRATION (0.00s -> 1.40s Choreography)
  // ---------------------------------------------------------------------------
  function initPageLoadSequence() {
    if (prefersReducedMotion) {
      body.classList.remove("is-loading");
      body.classList.add("is-loaded");
      return;
    }

    requestAnimationFrame(() => {
      body.classList.remove("is-loading");
      body.classList.add("is-loaded");

      // Enable interactive 3D tilt and floating loop after 1.40s entrance finishes
      window.setTimeout(() => {
        body.classList.add("tilt-ready", "motion-ready");
      }, 1450);
    });
  }

  // ---------------------------------------------------------------------------
  // 2. RESILIENT PROFILE IMAGE FALLBACK HANDLER
  // ---------------------------------------------------------------------------
  if (profileImage) {
    profileImage.addEventListener("error", () => {
      profileImage.style.opacity = "0";
    });
  }

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
      specialtyRotator.classList.add("is-switching");
      window.setTimeout(() => {
        specialtyIndex = (specialtyIndex + 1) % realSpecialties.length;
        specialtyRotator.textContent = realSpecialties[specialtyIndex];
        specialtyRotator.classList.remove("is-switching");
      }, 280);
    }, 3400);
  }

  // ---------------------------------------------------------------------------
  // 4. NAVIGATION SCROLL STATE & MOBILE HAMBURGER MENU
  // ---------------------------------------------------------------------------
  function updateHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
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
  // 5. WORKING INTERACTIVE HANDLERS FOR PLACEHOLDER SECTIONS & EMAIL COPY
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

  // Handle placeholder section anchors (#about, #skills, #projects, #experience, #contact)
  const sectionLinks = document.querySelectorAll(
    'a[href^="#"]:not(.skip-link)'
  );
  sectionLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetHref = link.getAttribute("href");
      if (!targetHref || targetHref === "#hero") {
        setMobileMenuState(false);
        return;
      }

      const targetEl = document.querySelector(targetHref);
      setMobileMenuState(false);

      if (!targetEl) {
        event.preventDefault();
        const label =
          link.getAttribute("data-section") ||
          targetHref.replace("#", "").toUpperCase();

        if (targetHref === "#projects") {
          showToast(
            "Projects section is queued for Phase 2. Meanwhile, inspect Daniyal Hayat’s 7+ live repositories on GitHub (@DotDaniyal)."
          );
        } else {
          showToast(
            `${label} section will be built next in the Hero → ${label} progression. Hero section is active.`
          );
        }
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

    // Interactive cursor hover states
    const interactiveElements = document.querySelectorAll(
      "a, button, .floating-node, .profile-frame"
    );
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        body.classList.add("cursor-hover");
        const labelText = el.getAttribute("data-cursor-text");
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

    // Magnetic Effect on CTA buttons & brand links
    const magneticElements = document.querySelectorAll("[data-magnetic]");
    magneticElements.forEach((el) => {
      const strength = parseFloat(el.getAttribute("data-magnetic") || "0.25");

      el.addEventListener("mousemove", (event) => {
        const rect = el.getBoundingClientRect();
        const offsetX = event.clientX - (rect.left + rect.width / 2);
        const offsetY = event.clientY - (rect.top + rect.height / 2);
        el.style.transform = `translate3d(${(offsetX * strength).toFixed(
          2
        )}px, ${(offsetY * strength).toFixed(2)}px, 0)`;
      });

      el.addEventListener("mouseleave", () => {
        el.style.transform = "translate3d(0, 0, 0)";
      });
    });

    // Single Master requestAnimationFrame Loop
    function renderInteractiveLoop() {
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
  // 7. SUBTLE FLOATING PARTICLES CANVAS (INTERSECTION OBSERVER PAUSE SUPPORT)
  // ---------------------------------------------------------------------------
  function initParticlesCanvas() {
    if (!particlesCanvas || prefersReducedMotion) return;
    const ctx = particlesCanvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let isHeroVisible = true;

    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      particlesCanvas.width = width;
      particlesCanvas.height = height;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });

    const particleCount = Math.min(28, Math.floor(window.innerWidth / 48));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.35 + 0.45,
      vx: (Math.random() - 0.5) * 0.18,
      vy: -Math.random() * 0.22 - 0.05,
      alpha: Math.random() * 0.38 + 0.12
    }));

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
      if (isHeroVisible) {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;

          if (p.y < -10) p.y = height + 10;
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(226, 232, 240, ${p.alpha})`;
          ctx.fill();
        }
      }
      requestAnimationFrame(drawParticles);
    }

    requestAnimationFrame(drawParticles);
  }

  // Initialize on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initPageLoadSequence();
      initParticlesCanvas();
    });
  } else {
    initPageLoadSequence();
    initParticlesCanvas();
  }
})();
