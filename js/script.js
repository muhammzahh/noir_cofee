// ==========================================
// NOIR COFFEE — PRODUCT DATA
// ==========================================
const PRODUCTS = [
  {
    id: "kopi-latte",
    name: "Kopi Latte",
    category: "hot",
    tags: ["hot", "signature"],
    price: 32000,
    rating: "4.9",
    color: ["#d8c4a8", "#a87545"],
    desc: "A velvety double espresso blended with micro-foamed milk for a silky, balanced finish.",
    notes: "Toasted hazelnut, cocoa butter, and subtle madagascar vanilla.",
    image: "assets/images/kopi-latte.jpg",
  },
  {
    id: "arren-latte",
    name: "Arren Latte",
    category: "iced",
    tags: ["iced", "signature"],
    price: 36000,
    rating: "5.0",
    color: ["#a87545", "#4a2f1d"],
    desc: "Espresso over fresh milk and organic Indonesian aren palm sugar nectar. Rich, creamy, and smoky-sweet.",
    notes: "Warm caramel, smoky palm sugar, and creamy butterscotch.",
    image: "assets/images/arren-latte.png",
  },
  {
    id: "americano",
    name: "Americano",
    category: "iced",
    tags: ["iced"],
    price: 28000,
    rating: "4.8",
    color: ["#5a3d28", "#120F0D"],
    desc: "Pure single-origin espresso poured over cold mountain spring water and ice. Crisp, bold, and refreshing.",
    notes: "Dark chocolate, bright citrus zest, and clean herbal finish.",
    image: "assets/images/americano.jpg",
  },
  {
    id: "cappuccino",
    name: "Classic Cappuccino",
    category: "hot",
    tags: ["hot"],
    price: 34000,
    rating: "4.9",
    color: ["#c4a888", "#7a5030"],
    desc: "Equal parts espresso, steamed milk, and dense velvety microfoam served at perfect warmth in a ceramic cup.",
    notes: "Toasted almond, milk sweetness, and cocoa finish.",
    image: "assets/images/cappuccino.png",
  },
  {
    id: "caramel-macchiato",
    name: "Caramel Macchiato",
    category: "iced",
    tags: ["iced", "signature"],
    price: 38000,
    rating: "5.0",
    color: ["#e0a96d", "#402211"],
    desc: "Layered chilled milk, bold espresso, whipped cream, and cascading golden artisan caramel drizzle.",
    notes: "Burnt butter caramel, Madagascar vanilla, and roasted espresso.",
    image: "assets/images/caramel-macchiato.png",
  },
  {
    id: "mocha",
    name: "Dark Chocolate Mocha",
    category: "iced",
    tags: ["iced", "signature"],
    price: 38000,
    rating: "4.9",
    color: ["#502b1c", "#1f100a"],
    desc: "Decadent iced mocha in a jar with dark chocolate fudge swirl, double espresso, chilled milk, and whipped cream topped with chocolate flakes.",
    notes: "Bittersweet 70% dark chocolate, roasted cacao, and creamy vanilla.",
    image: "assets/images/mocha.png",
  },
];

// Helper to look up product by ID (with legacy backwards compatibility)
const getProduct = (id) =>
  PRODUCTS.find((p) => p.id === id || (p.id === "arren-latte" && id === "aren-latte"));

// Placeholder cup art (SVG) as fallback
const art = (p) =>
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="#211813"/>
 <circle cx="200" cy="200" r="140" fill="${p.color[1]}" opacity=".35"/><circle cx="200" cy="200" r="110" fill="#F4EFE6"/>
 <circle cx="200" cy="200" r="80" fill="${p.color[0]}"/><circle cx="200" cy="200" r="50" fill="${p.color[1]}"/>
 <path d="M200 160c24 16 24 50 0 74-24-24-24-58 0-74z" fill="${p.color[0]}" opacity=".5"/></svg>`,
  );
const imgSrc = (p) => p.image || art(p);

// Shorthand helpers
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const rp = (n) => "Rp " + Math.round(n).toLocaleString("id-ID");

// State & Storage
const load = (k, d) => {
  try {
    return JSON.parse(localStorage.getItem(k)) ?? d;
  } catch {
    return d;
  }
};
const save = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};

let cart = load("noir-cart", {}),
  wish = load("noir-wish", []),
  filter = "all",
  query = "",
  discount = 0,
  currentModalId = null;

// ==========================================
// SCROLL-TRIGGERED VISUAL ANIMATIONS
// ==========================================
const nav = $("#nav");
const scrollProgress = $("#scrollProgress");
const heroCup = $("#heroCup");
const heroBg = $("#heroBg");
const backToTop = $("#backToTop");
const floatingParticles = $$(".floating-particle");
const timelineProgress = $("#timelineProgress");

function handleScroll() {
  const currentY = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progressRatio = maxScroll > 0 ? currentY / maxScroll : 0;

  // 1. Scroll Progress Bar
  if (scrollProgress) {
    scrollProgress.style.width = `${progressRatio * 100}%`;
  }

  // 2. Navigation bar styling
  if (nav) {
    nav.classList.toggle("solid", currentY > 50);
  }

  // 3. Hero Parallax
  if (heroBg) {
    heroBg.style.transform = `translate3d(0, ${Math.min(currentY, 900) * 0.16}px, 0)`;
  }
  if (heroCup) {
    heroCup.style.transform = `translate3d(0, ${Math.min(currentY, 900) * 0.22}px, 0)`;
  }

  // 4. Floating Ambient Particles Parallax
  floatingParticles.forEach((particle) => {
    const speed = parseFloat(particle.dataset.speed || 0.1);
    particle.style.transform = `translate3d(0, ${currentY * speed}px, 0)`;
  });

  // 5. Back To Top Button Visibility
  if (backToTop) {
    backToTop.classList.toggle("visible", currentY > 400);
  }

  // 6. Ritual Timeline Progress
  const ritualSection = $("#ritual");
  if (ritualSection && timelineProgress) {
    const rect = ritualSection.getBoundingClientRect();
    const sectionHeight = rect.height;
    if (rect.top <= window.innerHeight && rect.bottom >= 0) {
      const scrolledIntoSection = Math.max(0, window.innerHeight - rect.top);
      const ratio = Math.min(1, Math.max(0, scrolledIntoSection / (sectionHeight + window.innerHeight * 0.5)));
      timelineProgress.style.height = `${ratio * 100}%`;
    }
  }

  // 7. Active Nav Link Indicator
  const sections = ["home", "coffee", "ritual", "reviews", "contact"];
  for (const id of sections) {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top;
      if (top <= 200 && top >= -el.offsetHeight + 200) {
        $$(".nav-link").forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
        break;
      }
    }
  }
}

addEventListener("scroll", handleScroll, { passive: true });
handleScroll();

// Back To Top Click
if (backToTop) {
  backToTop.onclick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
}

// Burger Menu for Mobile
const burger = $("#burger");
const links = $("#links");
if (burger && links) {
  burger.onclick = (e) => {
    const isOpen = links.classList.toggle("open");
    e.currentTarget.setAttribute("aria-expanded", isOpen);
  };
  links.onclick = (e) => {
    if (e.target.tagName === "A") {
      links.classList.remove("open");
      burger.setAttribute("aria-expanded", false);
    }
  };
}

// ==========================================
// INTERSECTION OBSERVER FOR SCROLL REVEAL
// ==========================================
const observerOptions = {
  root: null,
  rootMargin: "0px 0px -60px 0px",
  threshold: 0.15,
};

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("revealed");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

function setupScrollReveal() {
  const elements = $$(
    ".scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .ritual-step, .review-card, .visit-card"
  );
  elements.forEach((el) => revealObserver.observe(el));
}

// ==========================================
// TOAST NOTIFICATION
// ==========================================
let toastTimer;
function showToast(message) {
  const t = $("#toast");
  if (!t) return;
  t.textContent = message;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
}

// ==========================================
// CARD MENU RENDERING & INTERACTIONS
// ==========================================
function renderMenu() {
  const grid = $("#grid");
  const empty = $("#empty");
  if (!grid) return;

  const filtered = PRODUCTS.filter((p) => {
    const matchCategory =
      filter === "all" ||
      (filter === "hot" && p.category === "hot") ||
      (filter === "iced" && p.category === "iced") ||
      (filter === "signature" && p.tags && p.tags.includes("signature"));

    const queryClean = query.trim().toLowerCase();
    const matchQuery =
      !queryClean ||
      p.name.toLowerCase().includes(queryClean) ||
      p.id.toLowerCase().includes(queryClean) ||
      (p.desc && p.desc.toLowerCase().includes(queryClean)) ||
      (p.notes && p.notes.toLowerCase().includes(queryClean)) ||
      (queryClean === "aren" && p.id.includes("arren"));

    return matchCategory && matchQuery;
  });

  if (empty) empty.hidden = filtered.length > 0;

  grid.innerHTML = filtered
    .map((p, i) => {
      const isWished = wish.includes(p.id);

      return `
      <article class="card scroll-reveal revealed" data-card-id="${p.id}" style="animation-delay:${i * 0.08}s">
        <div class="img">
          <img src="${imgSrc(p)}" alt="${p.name}" loading="lazy">
          <div class="card-overlay-glare"></div>
          <button class="wish ${isWished ? "on" : ""}" data-w="${p.id}" aria-label="Wishlist for ${p.name}" aria-pressed="${isWished}">
            ${isWished ? "♥" : "♡"}
          </button>
        </div>
        <div class="info">
          <h3>${p.name}</h3>
          <p class="desc">${p.desc}</p>
          <p class="price">${rp(p.price)}</p>
          <div class="row">
            <button class="btn" data-d="${p.id}">Details</button>
            <button class="btn primary" data-a="${p.id}">Add to Cart</button>
          </div>
        </div>
      </article>`;
    })
    .join("");

  attachCardTilt();
}

// 3D Magnetic Tilt Effect for Cards
function attachCardTilt() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.innerWidth < 800) return;

  const cards = $$(".card");
  cards.forEach((card) => {
    card.onmousemove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    };

    card.onmouseleave = () => {
      card.style.transform = "";
    };
  });
}

// Search Handler
const searchInput = $("#search");
if (searchInput) {
  searchInput.oninput = (e) => {
    query = e.target.value;
    renderMenu();
  };
}

// Filter Buttons
const filtersContainer = $(".filters");
if (filtersContainer) {
  filtersContainer.onclick = (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    $$(".filters button").forEach((b) => b.classList.toggle("on", b === btn));
    filter = btn.dataset.f;
    renderMenu();
  };
}

// Grid Clicks (Details, Add, Wishlist)
const grid = $("#grid");
if (grid) {
  grid.onclick = (e) => {
    const target = e.target.closest("button");
    if (!target) return;

    if (target.dataset.a) {
      addToCart(target.dataset.a);
    } else if (target.dataset.d) {
      openModal(target.dataset.d);
    } else if (target.dataset.w) {
      toggleWishlist(target.dataset.w);
    }
  };
}

function toggleWishlist(id) {
  const prod = getProduct(id);
  if (!prod) return;
  const canonicalId = prod.id;
  const isSaved = wish.includes(canonicalId);
  wish = isSaved ? wish.filter((x) => x !== canonicalId) : [...wish, canonicalId];
  save("noir-wish", wish);
  renderMenu();
  showToast(wish.includes(canonicalId) ? `Saved ${prod.name} to wishlist ♥` : `Removed ${prod.name} from wishlist`);
}

// ==========================================
// SHOPPING CART SYSTEM
// ==========================================
function addToCart(id) {
  const prod = getProduct(id);
  if (!prod) return;
  const canonicalId = prod.id;
  cart[canonicalId] = (cart[canonicalId] || 0) + 1;
  save("noir-cart", cart);
  updateCartUI();
  showToast(`${prod.name} added to cart`);

  // Cart button bounce animation
  const cartBtn = $("#cartBtn");
  if (cartBtn) {
    cartBtn.classList.remove("bump");
    void cartBtn.offsetWidth; // trigger reflow
    cartBtn.classList.add("bump");
  }
}

function updateCartUI() {
  const items = Object.entries(cart)
    .map(([id, q]) => ({ p: getProduct(id), q }))
    .filter((i) => i.p);

  const totalCount = items.reduce((s, i) => s + i.q, 0);
  const rawSubtotal = items.reduce((s, i) => s + i.p.price * i.q, 0);
  const finalTotal = Math.max(0, rawSubtotal * (1 - discount));

  const cartCount = $("#cartCount");
  const cartTotal = $("#cartTotal");
  const cartList = $("#cartList");

  if (cartCount) cartCount.textContent = totalCount;
  if (cartTotal) {
    cartTotal.innerHTML = discount > 0
      ? `<s>${rp(rawSubtotal)}</s> <b>${rp(finalTotal)}</b> <small>(-${discount * 100}%)</small>`
      : rp(rawSubtotal);
  }

  if (cartList) {
    cartList.innerHTML = items.length
      ? items
          .map(
            ({ p, q }) => `
        <li>
          <div class="cart-item-info">
            <span class="cart-item-name">${p.name}</span>
            <span class="cart-item-price">${rp(p.price * q)}</span>
          </div>
          <span class="qty">
            <button data-m="${p.id}" aria-label="Decrease ${p.name}">−</button>
            <span>${q}</span>
            <button data-p="${p.id}" aria-label="Increase ${p.name}">+</button>
          </span>
        </li>`
          )
          .join("")
      : '<li class="empty-cart-msg">Your cart is currently empty. Explore our coffee menu!</li>';
  }
}

// Cart Drawer Quantity Buttons
const cartList = $("#cartList");
if (cartList) {
  cartList.onclick = (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const id = btn.dataset.m || btn.dataset.p;
    const prod = getProduct(id);
    if (!prod) return;
    const cId = prod.id;

    cart[cId] = (cart[cId] || 0) + (btn.dataset.p ? 1 : -1);
    if (cart[cId] <= 0) delete cart[cId];
    save("noir-cart", cart);
    updateCartUI();
  };
}

// Clear Cart
const clearBtn = $("#clear");
if (clearBtn) {
  clearBtn.onclick = () => {
    cart = {};
    discount = 0;
    save("noir-cart", cart);
    updateCartUI();
    showToast("Cart cleared");
  };
}

// Promo Code Apply
const applyPromoBtn = $("#applyPromo");
const promoInput = $("#promoInput");
if (applyPromoBtn && promoInput) {
  applyPromoBtn.onclick = () => {
    const code = promoInput.value.trim().toUpperCase();
    if (code === "NOIR15") {
      discount = 0.15;
      updateCartUI();
      showToast("15% Promo discount applied! 🎉");
    } else if (code) {
      showToast("Invalid promo code. Use NOIR15");
    }
  };
}

// Checkout Button
const checkoutBtn = $("#checkoutBtn");
if (checkoutBtn) {
  checkoutBtn.onclick = () => {
    const itemsCount = Object.values(cart).reduce((a, b) => a + b, 0);
    if (itemsCount === 0) {
      showToast("Your cart is empty. Please add items first.");
      return;
    }
    showToast("Thank you! Order dispatched to our Barista Counter. ☕");
    cart = {};
    discount = 0;
    save("noir-cart", cart);
    updateCartUI();
    setDrawer(false);
  };
}

// Drawer Toggle
const drawer = $("#drawer");
function setDrawer(open) {
  if (!drawer) return;
  drawer.classList.toggle("open", open);
  drawer.setAttribute("aria-hidden", !open);
}
const cartBtn = $("#cartBtn");
if (cartBtn) cartBtn.onclick = () => setDrawer(true);

const drawerCloseBtn = document.querySelector("[data-close=drawer]");
if (drawerCloseBtn) drawerCloseBtn.onclick = () => setDrawer(false);

// ==========================================
// PRODUCT DETAILS MODAL
// ==========================================
const modal = $("#modal");
function openModal(id) {
  const p = getProduct(id);
  if (!p || !modal) return;
  currentModalId = p.id;

  $("#mImg").innerHTML = `<img src="${imgSrc(p)}" alt="${p.name}">`;
  const mTag = $("#mTag");
  if (mTag) {
    mTag.textContent = p.tags && p.tags.includes("signature") ? "★ Signature Drink" : p.category === "hot" ? "Hot Drink" : "Iced Drink";
    mTag.className = `tag ${p.category}`;
  }
  const mRating = $("#mRating");
  if (mRating) mRating.textContent = `★ ${p.rating || "4.9"}`;
  $("#mTitle").textContent = p.name;
  $("#mDesc").textContent = p.desc;
  $("#mNotes").textContent = p.notes || "Balanced espresso and artisan craft.";
  $("#mPrice").textContent = rp(p.price);

  modal.hidden = false;
  modal.querySelector(".x").focus();
}

function closeModal() {
  if (modal) modal.hidden = true;
}

if (modal) {
  modal.onclick = (e) => {
    if (e.target === modal || e.target.dataset.close === "modal") closeModal();
  };
}

const mAdd = $("#mAdd");
if (mAdd) {
  mAdd.onclick = () => {
    if (currentModalId) {
      addToCart(currentModalId);
      closeModal();
    }
  };
}

// Global Keyboard Shortcut
addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
    setDrawer(false);
  }
});

// ==========================================
// FEEDBACK & KRITIK SARAN FORM
// ==========================================
const feedbackForm = $("#feedbackForm");
const feedbackSuccess = $("#feedbackSuccess");
const feedbackResetBtn = $("#feedbackResetBtn");

if (feedbackForm && feedbackSuccess) {
  feedbackForm.onsubmit = (e) => {
    e.preventDefault();
    const name = $("#feedbackName") ? $("#feedbackName").value.trim() : "";
    const email = $("#feedbackEmail") ? $("#feedbackEmail").value.trim() : "";
    const category = $("#feedbackCategory") ? $("#feedbackCategory").value : "Umum";
    const message = $("#feedbackMessage") ? $("#feedbackMessage").value.trim() : "";

    if (!email || !message) return;

    // Save feedback to localStorage
    const savedFeedbacks = load("noir-feedbacks", []);
    savedFeedbacks.push({
      name: name || "Pelanggan NOIR",
      email,
      category,
      message,
      date: new Date().toISOString(),
    });
    save("noir-feedbacks", savedFeedbacks);

    // Show success state
    feedbackForm.style.display = "none";
    feedbackSuccess.hidden = false;
    showToast("Terima kasih! Kritik & saran Anda telah kami terima. 🙏");
  };

  if (feedbackResetBtn) {
    feedbackResetBtn.onclick = () => {
      feedbackForm.reset();
      feedbackForm.style.display = "flex";
      feedbackSuccess.hidden = true;
    };
  }
}

// ==========================================
// INITIALIZATION
// ==========================================
renderMenu();
updateCartUI();
setupScrollReveal();
