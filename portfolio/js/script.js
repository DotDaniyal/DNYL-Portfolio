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
      "a, button, .floating-node, .profile-frame, .about-info-card, .about-float-card, .about-glass-frame, .skill-card, .skill-filter-btn"
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
    const navLinks = Array.from(document.querySelectorAll(".nav-link"));
    const aboutSection = document.getElementById("about");

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

      // Active navigation link state on scroll
      if (aboutSection) {
        const navObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              navLinks.forEach((link) => {
                if (link.getAttribute("href") === "#about") {
                  link.classList.toggle("is-active", entry.isIntersecting);
                }
              });
            });
          },
          { threshold: 0.28 }
        );
        navObserver.observe(aboutSection);
      }
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
    const navLinks = Array.from(document.querySelectorAll(".nav-link"));

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

      // 3. Active Navigation Highlight for #skills
      const skillsNavObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              navLinks.forEach((link) => {
                link.classList.toggle(
                  "is-active",
                  link.getAttribute("href") === "#skills"
                );
              });
            }
          });
        },
        { threshold: 0.22 }
      );
      skillsNavObserver.observe(skillsSection);
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

  // Initialize on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initPageLoadSequence();
      initParticlesCanvas();
      initAboutScrollAnimations();
      initSkillsSection();
    });
  } else {
    initPageLoadSequence();
    initParticlesCanvas();
    initAboutScrollAnimations();
    initSkillsSection();
  }
})();
