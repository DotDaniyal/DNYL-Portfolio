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
      "a, button, .floating-node, .profile-frame, .about-info-card, .about-float-card, .about-glass-frame, .skill-card, .skill-filter-btn, .project-monolith, .project-filter-btn, .archive-card, .timeline-card, .journey-currently-card, .currently-action-btn, .service-card, .srv-stage-tab, .service-action-link, .contact-orb-card, .contact-channel-item, .contact-social-btn, .contact-input, .channel-copy-btn"
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
    const navLinks = Array.from(document.querySelectorAll(".nav-link"));

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

      // Active navigation highlight for #projects
      const projectsNavObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              navLinks.forEach((link) => {
                link.classList.toggle(
                  "is-active",
                  link.getAttribute("href") === "#projects"
                );
              });
            }
          });
        },
        { threshold: 0.15 }
      );
      projectsNavObs.observe(projectsSection);
    } else {
      headerRevealNodes.forEach((el) => el.classList.add("is-inview"));
      allProjectItems.forEach((el) => el.classList.add("is-inview"));
    }

    // 2. Domain Category Filter System
    let activeProjectFilter = "all";
    let projFilterTimer = null;

    function applyProjectFilter(category) {
      if (category === activeProjectFilter) return;
      activeProjectFilter = category;

      filterBtns.forEach((btn) => {
        const isMatch =
          btn.getAttribute("data-project-filter") === category;
        btn.classList.toggle("is-active", isMatch);
        btn.setAttribute("aria-pressed", String(isMatch));
      });

      if (prefersReducedMotion) {
        allProjectItems.forEach((item) => {
          const tags = (item.getAttribute("data-project-tags") || "").split(
            " "
          );
          const show = category === "all" || tags.includes(category);
          item.classList.toggle("is-hidden-project", !show);
          item.classList.remove("is-filtering-out");
          if (show) item.classList.add("is-inview");
        });
        return;
      }

      if (projFilterTimer) window.clearTimeout(projFilterTimer);

      allProjectItems.forEach((item) => {
        item.style.transitionDelay = "0ms";
        item.classList.add("is-filtering-out");
      });

      projFilterTimer = window.setTimeout(() => {
        let visIdx = 0;
        allProjectItems.forEach((item) => {
          const tags = (item.getAttribute("data-project-tags") || "").split(
            " "
          );
          const show = category === "all" || tags.includes(category);
          if (show) {
            item.classList.remove("is-hidden-project");
            item.style.transitionDelay = `${Math.min(visIdx * 55, 280)}ms`;
            visIdx++;
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
      }, 210);
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
        modalMetrics.innerHTML = data.metrics
          .map(
            (m) => `
            <div class="monolith-metric-item">
              <span class="metric-label">${m.label}</span>
              <span class="metric-value">${m.value}</span>
            </div>
          `
          )
          .join("");
      }

      if (modalFeatures) {
        modalFeatures.innerHTML = data.features
          .map((feat) => `<li>${feat}</li>`)
          .join("");
      }

      if (modalStack) {
        modalStack.innerHTML = data.technologies
          .map((t) => `<span>${t}</span>`)
          .join('<span aria-hidden="true">·</span>');
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
  }

  // ---------------------------------------------------------------------------
  // 11. 05 — MY JOURNEY / EXPERIENCE & TIMELINE ENGINE
  // ---------------------------------------------------------------------------
  function initJourneySection() {
    const journeySection = document.getElementById("experience");
    if (!journeySection) return;

    const headerRevealNodes = Array.from(
      journeySection.querySelectorAll('[data-journey-reveal="header"]')
    );
    const milestoneItems = Array.from(
      journeySection.querySelectorAll('.timeline-item[data-journey-reveal="milestone"]')
    );
    const currentlyWrap = journeySection.querySelector(
      '[data-journey-reveal="currently"]'
    );
    const timelineContainer = document.getElementById("journey-timeline");
    const timelineFill = document.getElementById("journey-timeline-fill");
    const timelinePulse = document.getElementById("journey-timeline-pulse");
    const timelineCards = Array.from(
      journeySection.querySelectorAll(".timeline-card")
    );
    const currentlyCard = journeySection.querySelector(
      ".journey-currently-card"
    );
    const navLinks = Array.from(document.querySelectorAll(".nav-link"));

    // 1. Scroll Reveal Observers
    if (prefersReducedMotion) {
      headerRevealNodes.forEach((el) => el.classList.add("is-inview"));
      milestoneItems.forEach((el) => {
        el.classList.add("is-inview", "is-active-node");
      });
      if (currentlyWrap) currentlyWrap.classList.add("is-inview");
      if (timelineFill) timelineFill.style.height = "100%";
      if (timelinePulse) timelinePulse.style.top = "100%";
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
        { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
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
          { threshold: 0.18, rootMargin: "0px 0px -5% 0px" }
        );
        currentlyObs.observe(currentlyWrap);
      }

      // Active navigation highlight for #experience (05 — Experience / Journey)
      const journeyNavObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              navLinks.forEach((link) => {
                link.classList.toggle(
                  "is-active",
                  link.getAttribute("href") === "#experience"
                );
              });
            }
          });
        },
        { threshold: 0.16 }
      );
      journeyNavObs.observe(journeySection);
    } else {
      headerRevealNodes.forEach((el) => el.classList.add("is-inview"));
      milestoneItems.forEach((el) => {
        el.classList.add("is-inview", "is-active-node");
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
        // Start drawing when timeline top enters 72% down the viewport
        const triggerPoint = viewportHeight * 0.68;
        const distanceScrolled = triggerPoint - rect.top;
        const totalLength = Math.max(1, rect.height);
        const progress = Math.max(
          0,
          Math.min(1, distanceScrolled / totalLength)
        );
        const percent = (progress * 100).toFixed(2);

        timelineFill.style.height = `${percent}%`;
        if (timelinePulse) {
          timelinePulse.style.top = `${percent}%`;
          timelinePulse.style.opacity =
            progress > 0.01 && progress < 0.995 ? "1" : "0.35";
        }

        // Illuminate each milestone node when the scroll line reaches its vertical center
        const fillBottomY = rect.top + totalLength * progress;
        milestoneItems.forEach((item) => {
          const nodeWrap = item.querySelector(".timeline-node-wrap");
          if (!nodeWrap) return;
          const nodeRect = nodeWrap.getBoundingClientRect();
          const nodeCenterY = nodeRect.top + nodeRect.height * 0.35;
          const isReached = fillBottomY >= nodeCenterY;
          item.classList.toggle("is-active-node", isReached);
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
              "--curr-mouse-x",
              `${(event.clientX - rect.left).toFixed(1)}px`
            );
            currentlyCard.style.setProperty(
              "--curr-mouse-y",
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
    const navLinks = Array.from(document.querySelectorAll(".nav-link"));

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

      // Active navigation highlight for #services
      const servicesNavObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              navLinks.forEach((link) => {
                link.classList.toggle(
                  "is-active",
                  link.getAttribute("href") === "#services"
                );
              });
            }
          });
        },
        { threshold: 0.16 }
      );
      servicesNavObs.observe(servicesSection);
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
    const navLinks = Array.from(document.querySelectorAll(".nav-link"));

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

      // Active navigation highlight for #contact
      const contactNavObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              navLinks.forEach((link) => {
                link.classList.toggle(
                  "is-active",
                  link.getAttribute("href") === "#contact"
                );
              });
            }
          });
        },
        { threshold: 0.16 }
      );
      contactNavObs.observe(contactSection);
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

  // Initialize on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initPageLoadSequence();
      initParticlesCanvas();
      initAboutScrollAnimations();
      initSkillsSection();
      initProjectsSection();
      initJourneySection();
      initServicesSection();
      initContactSection();
    });
  } else {
    initPageLoadSequence();
    initParticlesCanvas();
    initAboutScrollAnimations();
    initSkillsSection();
    initProjectsSection();
    initJourneySection();
    initServicesSection();
    initContactSection();
  }
})();
