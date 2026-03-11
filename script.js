document.addEventListener("DOMContentLoaded", () => {
  const particleField = document.querySelector(".particle-field");
  const supportCard = document.querySelector(".support-card");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (particleField && !prefersReducedMotion) {
    const particleTotal = window.innerWidth > 1024 ? 34 : 20;
    for (let i = 0; i < particleTotal; i += 1) {
      particleField.appendChild(createParticle());
    }
  }

  if (supportCard) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            supportCard.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(supportCard);
  }

  const ctas = document.querySelectorAll(".cta-button");
  ctas.forEach((btn) => {
    btn.addEventListener("mousemove", (event) => {
      const rect = btn.getBoundingClientRect();
      const px = ((event.clientX - rect.left) / rect.width) * 100;
      const py = ((event.clientY - rect.top) / rect.height) * 100;
      btn.style.setProperty("--px", `${px}%`);
      btn.style.setProperty("--py", `${py}%`);
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.removeProperty("--px");
      btn.style.removeProperty("--py");
    });
  });
});

function createParticle() {
  const particle = document.createElement("span");
  particle.className = "particle";
  particle.style.setProperty("--size", `${(Math.random() * 6 + 3).toFixed(2)}px`);
  particle.style.setProperty("--top", `${Math.random() * 100}%`);
  particle.style.setProperty("--left", `${Math.random() * 100}%`);
  particle.style.setProperty("--duration", `${(Math.random() * 10 + 10).toFixed(2)}s`);
  particle.style.setProperty("--delay", `${(Math.random() * 5).toFixed(2)}s`);
  particle.style.setProperty("--dx", `${(Math.random() * 80 - 40).toFixed(1)}px`);
  particle.style.setProperty("--dy", `${(Math.random() * -120).toFixed(1)}px`);
  return particle;
}
