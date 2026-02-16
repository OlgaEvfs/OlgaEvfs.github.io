/* button View projects */

const heroCta = document.querySelector(".hero-cta");

heroCta.addEventListener("click", (e) => {
  e.preventDefault();

  document.querySelector("#journey").scrollIntoView({
    behavior: "smooth"
  });

  history.replaceState(null, null, window.location.pathname);
})

/* button View more */

const viewMoreButtons = document.querySelectorAll('.view-more-btn');

viewMoreButtons.forEach(button => {
  button.addEventListener('click', () => {
    const stage = button.closest('.stage');
    const cards = stage.querySelectorAll('.project-card:nth-child(n+4)');

    cards.forEach(card => {
        card.classList.toggle('hidden');
    });

    button.textContent =
      button.textContent === 'View more'
        ? 'Show less'
        : 'View more';
  });
});

/* button top */

const scrollBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    scrollBtn.classList.add("visible");
  } else {
    scrollBtn.classList.remove("visible");
  }
});

scrollBtn.addEventListener("click", () => {
    window.scrollTo({
    top: 0,
    behavior: "smooth"
    });
});

/* section fade in */

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15
});

/* Reveal для обычных секций */
document.querySelectorAll('.intro, .stage, .future, .contact')
  .forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
});

/* Reveal + stagger только для карточек */
document.querySelectorAll('.stage').forEach(stage => {
  const cards = stage.querySelectorAll('.project-card');

  cards.forEach((card, index) => {
    card.classList.add('reveal');
    card.style.transitionDelay = `${index * 0.08}s`;
    observer.observe(card);
  });
});
