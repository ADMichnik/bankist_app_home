'use strict';

///////////////////////////////////////
//----------------------------------------------------------------------------------------- Modal window=====================================================

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const header = document.querySelector('.header');
const btnScrollTo = document.querySelector(`.btn--scroll-to`);
const section1 = document.querySelector(`#section--1`);
const nav = document.querySelector(`.nav`);
// Tabbed component
const tabs = document.querySelectorAll(`.operations__tab`);
const tabsContainer = document.querySelector(`.operations__tab-container`);
const tabsContent = document.querySelectorAll(`.operations__content`);

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener(`click`, function (e) {
  const s1coords = section1.getBoundingClientRect();
  // window.scrollTo(s1coords.left, s1coords.top + window.pageYOffset);
  // window.scrollTo({
  //   left: s1coords.left,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: `smooth`,
  // });
  section1.scrollIntoView({ behavior: `smooth` });
});

const message = document.createElement(`div`);
message.classList.add(`cookie-message`);
message.innerHTML = `We use cookies for improved funcionality and analytics. <button class="btn btn--close-cookie">Got it!<button>`;
header.append(message);

// -----------------------------------------------------------------------------PAGE NAVIGATION---------------------------------------------------

// Slow method

// document.querySelectorAll(`.nav__link`).forEach(function (el) {
//   el.addEventListener(`click`, function (e) {
//     e.preventDefault();
//     const id = this.getAttribute(`href`);
//     document.querySelector(id).scrollIntoView({ behavior: `smooth` });
//   });
// });

// Faster method -> Event delegation
// 1. Add event listener to common parent element
// 2. Determine what element originated the event (we can use e.target for this)

document.querySelector(`.nav__links`).addEventListener(`click`, function (e) {
  e.preventDefault();
  // 3.Maching startegy
  if (e.target.classList.contains(`nav__link`)) {
    const id = e.target.getAttribute(`href`);
    document.querySelector(id).scrollIntoView({ behavior: `smooth` });
  }
});

// ---------------------------------------------------------------------------Tabs=================================================

tabsContainer.addEventListener(`click`, function (e) {
  // We use .closest method becouse when we click on span tag that is in the button we want to get button element
  const clicked = e.target.closest(`.operations__tab`);
  // if there is click somewhere in tabsContainer (beside buttons or span tag we get null) -> We use guard clause (clicked is null = falsy value)
  if (!clicked) return;

  // we add operations__tab--active class for upwards movement, but first we remove it from all tabs
  tabs.forEach(t => t.classList.remove(`operations__tab--active`));
  clicked.classList.add(`operations__tab--active`);

  // activate content area
  tabsContent.forEach(o => o.classList.remove(`operations__content--active`));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add(`operations__content--active`);
});

// -----------------------------------------------------------------------menu fade animation================================================
const handleHover = function (e) {
  if (e.target.classList.contains(`nav__link`)) {
    const link = e.target;
    const siblings = link.closest(`.nav`).querySelectorAll(`.nav__link`);
    const logo = link.closest(`.nav`).querySelector(`img`);

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
// course ep.195 14:25 min
nav.addEventListener(`mouseover`, handleHover.bind(0.5));

nav.addEventListener(`mouseout`, handleHover.bind(1));

// sticky navigation - worse implementation
// First we get coords  by .getBounding CLientRect()
// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener(`scroll`, function (e) {
//   if (window.scrollY > initialCoords.top) nav.classList.add(`sticky`);
//   else nav.classList.remove(`sticky`);
// });

// ---------------------------------------------------------- better implementation intersection observer API ===================================
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => console.log(entry));
// };
// const obsOptions = {
//   root: null,
//   threshold: 0.1,
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add(`sticky`);
  else nav.classList.remove(`sticky`);
};
const options = {
  root: null,
  treshold: 0,
  rootMargin: `-${navHeight}px`,
};
const headerObserver = new IntersectionObserver(stickyNav, options);
headerObserver.observe(header);

//  reveal sections
const allSections = document.querySelectorAll(`section`);
const revealSection = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove(`section--hidden`);
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add(`section--hidden`);
});

// ---------------------------------------------------------------------------lazy loading images===============================ep.199

const loadImg = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  // replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener(`load`, function () {
    entry.target.classList.remove(`lazy-img`);
  });

  observer.unobserve(entry.target);
};
const imgTargets = document.querySelectorAll(`img[data-src]`);
// console.log(imgTargets);
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: `200px`,
});

imgTargets.forEach(img => imgObserver.observe(img));

// ------------------------------------------------------------------------------Slider====================================================

const slides = document.querySelectorAll(`.slide`);
const btnLeft = document.querySelector(`.slider__btn--left`);
const btnRight = document.querySelector(`.slider__btn--right`);
const dotContainer = document.querySelector(`.dots`);

let curSlide = 0;
const maxSlides = slides.length;

// working space
// const slider = document.querySelector(`.slider`);
// slider.style.transform = `scale(0.5)`;
// slider.style.overflow = `visible`;

const crateDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      `beforeend`,
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

const activateDot = function (slide) {
  document
    .querySelectorAll(`.dots__dot`)
    .forEach(dot => dot.classList.remove(`dots__dot--active`));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add(`dots__dot--active`);
};

const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
  activateDot(slide);
};

// -----------------------------------------------------next/previous slide ============================================

const nextSlide = function () {
  if (curSlide === maxSlides - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};

const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlides - 1;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};

const init = function () {
  crateDots();
  goToSlide(0);
};

init();

btnRight.addEventListener(`click`, nextSlide);
btnLeft.addEventListener(`click`, prevSlide);

document.addEventListener(`keydown`, function (e) {
  if (e.key === `ArrowLeft`) prevSlide();
  if (e.key === `ArrowRight`) nextSlide();
});

dotContainer.addEventListener(`click`, function (e) {
  if (e.target.classList.contains(`dots__dot`)) {
    const { slide } = e.target.dataset;
    goToSlide(slide);
  }
});

// --------------------------------------------------------------------------delete elements ==================================================

document
  .querySelector(`.btn--close-cookie`)
  .addEventListener(`click`, function () {
    message.remove();
  });

// styles
message.style.backgroundColor = `#37383d`;
message.style.width = `120%`;

message.style.height =
  Number.parseFloat(getComputedStyle(message).height) + 30 + `px`;

// document.documentElement.style.setProperty(`--color-primary`, `orangered`);

// const h1 = document.querySelector(`h1`);

// h1.addEventListener

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// document.querySelector(`.nav__link`).addEventListener(`click`, function (e) {
//   this.style.backgroundColor = randomColor();
// });
// document.querySelector(`.nav__links`).addEventListener(`click`, function (e) {
//   this.style.backgroundColor = randomColor();
// });
// document.querySelector(`.nav`).addEventListener(`click`, function (e) {});
