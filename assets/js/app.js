if (window.__cartScriptLoaded) {
  console.warn("Cart script already loaded");
} else {
  window.__cartScriptLoaded = true;

  document.addEventListener("DOMContentLoaded", function () {

    /* ======================
       SCROLL ANIMATION
    ====================== */
    const elements = document.querySelectorAll(".scroll-bottom, .scroll-top");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    }, { threshold: 0.2 });
    elements.forEach(el => observer.observe(el));


    /* ======================
       CART BUTTON CLICK
    ====================== */
    const cartBtn = document.querySelector(".icon-btn.cart");
    const cartCount = document.querySelector(".cart-count");

    // Инициализируем число на иконке по localStorage
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    if(cartCount) cartCount.textContent = savedCart.length;

    cartBtn.addEventListener("click", function () {
      window.location.href = "cart.html"; // переход на отдельную страницу корзины
    });


    /* ======================
       BUY BUTTON CLICK
    ====================== */
    document.addEventListener("click", function (e) {
      const button = e.target.closest(".buy-button");
      if (!button) return;

      const card = button.closest(".product-card");
      const name = card.querySelector(".product-name").textContent;
      const priceEl = card.querySelector(".price-current");
      const price = priceEl ? parseInt(priceEl.textContent) : parseInt(card.querySelector(".product-price").textContent);
      const image = card.querySelector(".img-main");
      const thumbSrc = image.dataset.thumb || image.src; // мини-картинка

      // === Добавление в localStorage ===
      let cartData = JSON.parse(localStorage.getItem("cart")) || [];
      cartData.push({ name, price, img: thumbSrc });
      localStorage.setItem("cart", JSON.stringify(cartData));

      // Обновляем иконку корзины
      if(cartCount) cartCount.textContent = cartData.length;

      // === Анимация полета картинки ===
      const imgRect = image.getBoundingClientRect();
      const cartRect = cartBtn.getBoundingClientRect();

      const clone = image.cloneNode(true);
      clone.classList.add("fly-to-cart");
      clone.style.position = "fixed";
      clone.style.left = imgRect.left + "px";
      clone.style.top = imgRect.top + "px";
      clone.style.width = imgRect.width + "px";
      clone.style.height = imgRect.height + "px";
      clone.style.zIndex = 9999;
      document.body.appendChild(clone);
      clone.getBoundingClientRect(); // триггер ререндер

      const translateX = cartRect.left - imgRect.left;
      const translateY = cartRect.top - imgRect.top;

      clone.style.transition = "transform 0.8s cubic-bezier(.65,-0.1,.25,1), opacity 0.8s ease";
      clone.style.transform = `translate(${translateX}px, ${translateY}px) scale(0.2)`;
      clone.style.opacity = "0.3";

      clone.addEventListener("transitionend", () => clone.remove());

      // === Ripple Effect ===
      const ripple = document.createElement("span");
      ripple.classList.add("ripple");
      const rect = button.getBoundingClientRect();
      ripple.style.left = e.clientX - rect.left + "px";
      ripple.style.top = e.clientY - rect.top + "px";
      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);

    });


    /* ======================
       SEARCH TYPE EFFECT
    ====================== */
    const input = document.querySelector(".search-input");
    if (input) {
      const phrases = [
        "Клубника в шоколаде...",
        "Подарочные наборы...",
        "Сладкие букеты...",
        "Акции и скидки..."
      ];

      let phraseIndex = 0;
      let letterIndex = 0;
      let isDeleting = false;

      function typeEffect() {
        const currentPhrase = phrases[phraseIndex];

        if (!isDeleting) {
          input.setAttribute("placeholder", currentPhrase.substring(0, letterIndex + 1));
          letterIndex++;
          if (letterIndex === currentPhrase.length) {
            setTimeout(() => isDeleting = true, 1500);
          }
        } else {
          input.setAttribute("placeholder", currentPhrase.substring(0, letterIndex - 1));
          letterIndex--;
          if (letterIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
          }
        }

        setTimeout(typeEffect, isDeleting ? 40 : 80);
      }

      typeEffect();
    }


    /* ======================
       TABS
    ====================== */
    const tabs = document.querySelectorAll('.tab-button');
    const sectionMap = {
      all: ['hot-products', 'men-products', 'nuts-products', 'seafood-products', 'fruits-products', 'berries-products', 'sweets-products', 'baskets-products', 'contact'],
      hot: ['hot-products'],
      men: ['men-products'],
      nuts: ['nuts-products'],
      seafood: ['seafood-products'],
      fruits: ['fruits-products'],
      berries: ['berries-products'],
      sweets: ['sweets-products'],
      baskets: ['baskets-products'],
      contact: ['contact']
    };

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Снимаем активность со всех табов
        tabs.forEach(t => {
          t.setAttribute('aria-selected', 'false');
          t.setAttribute('tabindex', '-1');
        });

        // Делаем активным кликнутый таб
        tab.setAttribute('aria-selected', 'true');
        tab.setAttribute('tabindex', '0');
        tab.focus();

        const category = tab.dataset.category;

        // Скрываем все секции
        Object.values(sectionMap).flat().forEach(sectionId => {
          const section = document.getElementById(sectionId);
          if (section) section.style.display = 'none';
        });

        // Показываем только нужные
        sectionMap[category].forEach(sectionId => {
          const section = document.getElementById(sectionId);
          if (section) section.style.display = 'block';
        });
      });
    });

    // Показываем "Все категории" при загрузке
    tabs[0].click();

  }); // DOMContentLoaded

  console.log("JS LOADED");
}