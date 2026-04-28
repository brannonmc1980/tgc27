(() => {
  const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Reveal on scroll ----------
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !prefersReduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const delay = parseInt(e.target.dataset.revealDelay || "0", 10);
          setTimeout(() => e.target.classList.add("is-in"), delay);
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-in"));
  }

  // ---------- Header scrolled state ----------
  const header = document.querySelector(".site-header");
  const onScroll = () => {
    if (window.scrollY > 30) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // ---------- Parallax (rAF, transform-based) ----------
  const parallaxEls = Array.from(document.querySelectorAll("[data-parallax]"));
  let ticking = false;

  function applyParallax() {
    const vh = window.innerHeight;
    parallaxEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      // distance from viewport center, normalized
      const center = rect.top + rect.height / 2;
      const offset = (center - vh / 2);
      const factor = parseFloat(el.dataset.parallax) || 0.2;
      const y = -offset * factor;
      // pick the moving inner if present
      const inner = el.querySelector(".hero-bg-img, .ca-img-inner, .loc-img-inner");
      const target = inner || el;
      target.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) scale(${inner ? 1.08 : 1})`;
    });
    ticking = false;
  }

  function requestParallax() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(applyParallax);
    }
  }

  if (!prefersReduced) {
    applyParallax();
    window.addEventListener("scroll", requestParallax, { passive: true });
    window.addEventListener("resize", requestParallax);
  }

  // ---------- Speaker rail ----------
  const track = document.querySelector(".speaker-track");
  if (track) {
    const prev = document.querySelector(".rail-prev");
    const next = document.querySelector(".rail-next");
    const dots = Array.from(document.querySelectorAll(".rail-dots .dot"));

    const step = () => {
      const card = track.querySelector(".speaker-card");
      if (!card) return 320;
      const styles = getComputedStyle(track);
      const gap = parseFloat(styles.columnGap) || 16;
      return card.getBoundingClientRect().width + gap;
    };

    prev?.addEventListener("click", () => {
      track.scrollBy({ left: -step() * 2, behavior: "smooth" });
    });
    next?.addEventListener("click", () => {
      track.scrollBy({ left: step() * 2, behavior: "smooth" });
    });

    const updateDots = () => {
      const max = track.scrollWidth - track.clientWidth;
      if (max <= 0) return;
      const ratio = track.scrollLeft / max;
      const idx = Math.min(dots.length - 1, Math.round(ratio * (dots.length - 1)));
      dots.forEach((d, i) => d.classList.toggle("is-active", i === idx));
    };
    track.addEventListener("scroll", updateDots, { passive: true });

    dots.forEach((d, i) => {
      d.addEventListener("click", () => {
        const max = track.scrollWidth - track.clientWidth;
        track.scrollTo({ left: (max * i) / (dots.length - 1), behavior: "smooth" });
      });
    });
  }

  // ---------- Lazy image fade-in ----------
  document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
    img.style.transition = "opacity .9s ease, filter .9s ease";
    img.style.opacity = "0";
    img.style.filter = "blur(8px)";
    const reveal = () => {
      img.style.opacity = "1";
      img.style.filter = "blur(0)";
    };
    if (img.complete && img.naturalWidth) reveal();
    else img.addEventListener("load", reveal, { once: true });
  });

  // ---------- Trailer click-to-play overlay ----------
  const playOverlay = document.querySelector(".trailer-play");
  const video = document.getElementById("trailerVideo");
  const playBtn = document.getElementById("playTrailer");
  const playTrailer = (e) => {
    e?.preventDefault?.();
    if (!video) return;
    playOverlay?.classList.add("is-hidden");
    video.play().catch(() => {});
  };
  playOverlay?.addEventListener("click", playTrailer);
  playBtn?.addEventListener("click", (e) => {
    playTrailer(e);
    document.getElementById("trailer")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
})();
