/* script.js - MedIAdor Landing Page Lógica e Interactividad */

document.addEventListener("DOMContentLoaded", () => {

  /* ==========================================
     1. CARRUSEL DEL SHOWCASE DE LA APP
     ========================================== */
  const slides = [
    {
      img: "capturas/06_vestibulo_dashboard.png?v=2",
      title: "Dashboard Lobby",
      desc: "El centro del caso en tiempo real"
    },
    {
      img: "capturas/13_asistente_propuestas.png?v=2",
      title: "Asistente IA",
      desc: "Sugerencias legales personalizadas"
    },
    {
      img: "capturas/17_mesa_negociacion_desbloqueada.png?v=2",
      title: "Mesa de Negociación",
      desc: "Contraste de propuestas y consensos"
    },
    {
      img: "capturas/21_borrador_firma_listo.png?v=2",
      title: "Libro Mayor / Convenio",
      desc: "Borrador técnico y firmas digitales"
    },
    {
      img: "capturas/26_pago_honorarios.png?v=2",
      title: "Pago Seguro Compartido",
      desc: "Tarifas transparentes al 50%"
    }
  ];

  let currentSlide = 0;
  const slideCount = slides.length;
  let autoplayTimer = null;

  const mockupImg = document.getElementById("mockup-screen-img");
  const tabButtons = document.querySelectorAll(".tab-btn");
  const prevBtn = document.getElementById("prev-slide-btn");
  const nextBtn = document.getElementById("next-slide-btn");
  const indicatorText = document.getElementById("carousel-indicator-text");

  function showSlide(index) {
    if (index < 0) index = slideCount - 1;
    if (index >= slideCount) index = 0;
    
    currentSlide = index;

    // Apply fade transition
    mockupImg.style.opacity = 0;
    
    setTimeout(() => {
      mockupImg.src = slides[currentSlide].img;
      mockupImg.style.opacity = 1;
    }, 200);

    // Update active tab buttons
    tabButtons.forEach((btn, i) => {
      if (i === currentSlide) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Update arrows indicator
    if (indicatorText) {
      indicatorText.innerText = `${currentSlide + 1} / ${slideCount}`;
    }
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      showSlide(currentSlide + 1);
    }, 6000);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
    }
  }

  // Bind Tab Click Events
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      stopAutoplay();
      const slideIndex = parseInt(btn.getAttribute("data-slide"), 10);
      showSlide(slideIndex);
      startAutoplay(); // Restart autoplay timer
    });
  });

  // Bind Arrow Navigation Click Events
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      stopAutoplay();
      showSlide(currentSlide - 1);
      startAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      stopAutoplay();
      showSlide(currentSlide + 1);
      startAutoplay();
    });
  }

  // Initialize Showcase
  showSlide(0);
  startAutoplay();


  /* ==========================================
     2. CALCULADORA DE TARIFAS INTERACTIVA
     ========================================== */
  const chkChildren = document.getElementById("calc-children");
  const chkProperties = document.getElementById("calc-properties");
  const totalValElement = document.getElementById("price-total-val");
  const splitValElement = document.getElementById("price-split-val");
  const partnerValElement = document.getElementById("price-partner-val");

  let currentPrice = 500;

  function animateNumber(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const val = Math.floor(progress * (end - start) + start);
      element.innerText = val;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  function updatePrice() {
    const hasChildren = chkChildren.checked;
    const hasProperties = chkProperties.checked;
    
    // Dynamic Pricing Logic:
    // If has kids or properties, price is 800€. Otherwise, it is 500€.
    const targetPrice = (hasChildren || hasProperties) ? 800 : 500;
    
    if (targetPrice !== currentPrice) {
      // Animate the total value
      animateNumber(totalValElement, currentPrice, targetPrice, 350);
      
      // Animate split value
      const targetHalf = targetPrice / 2;
      const currentHalf = currentPrice / 2;
      
      setTimeout(() => {
        splitValElement.innerText = `${targetHalf}€`;
        partnerValElement.innerText = `${targetHalf}€`;
      }, 100);
      
      currentPrice = targetPrice;
    }
  }

  if (chkChildren && chkProperties) {
    chkChildren.addEventListener("change", updatePrice);
    chkProperties.addEventListener("change", updatePrice);
  }


  /* ==========================================
     3. EFECTOS DE APARICIÓN AL HACER SCROLL (REVEAL)
     ========================================== */
  // Setup elements to animate
  const revealElements = [
    ".hero-title",
    ".hero-subtitle",
    ".hero-actions",
    ".comparison-card",
    ".timeline-step",
    ".showcase-container",
    ".calculator-card",
    ".faq-item",
    ".cta-banner-card"
  ];

  // Apply reveal class initially
  revealElements.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.classList.add("reveal");
    });
  });

  // Create Intersection Observer
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target); // Stop observing after animation triggers
      }
    });
  }, {
    threshold: 0.1, // Trigger when 10% of element is visible
    rootMargin: "0px 0px -50px 0px" // Slight offset from bottom screen edge
  });

  // Start observing
  setTimeout(() => {
    document.querySelectorAll(".reveal").forEach((el) => {
      revealObserver.observe(el);
    });
  }, 100);


  /* ==========================================
     4. CONTROL DEL MODAL COMING SOON / LISTA DE ESPERA
     ========================================== */
  const modal = document.getElementById("coming-soon-modal");
  const openModalBtns = document.querySelectorAll(".open-modal-btn");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const leadForm = document.getElementById("lead-form");
  const successMsg = document.getElementById("lead-success-msg");

  function openModal(e) {
    if (e) e.preventDefault();
    if (modal) {
      modal.classList.add("active");
      document.body.style.overflow = "hidden"; // Prevent background scroll
      const emailInput = document.getElementById("lead-email");
      if (emailInput) setTimeout(() => emailInput.focus(), 150);
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = ""; // Re-enable scroll
      
      // Reset form state after fade out animation
      setTimeout(() => {
        if (leadForm) {
          leadForm.style.display = "flex";
          leadForm.reset();
        }
        if (successMsg) {
          successMsg.classList.add("lead-success-hidden");
        }
      }, 400);
    }
  }

  // Bind click events to all CTA buttons
  openModalBtns.forEach((btn) => {
    btn.addEventListener("click", openModal);
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
  }

  // Close modal when clicking on backdrop
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("active")) {
      closeModal();
    }
  });

  // Handle form submission
  if (leadForm) {
    leadForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const submitBtn = document.getElementById("lead-submit-btn");
      const emailInput = document.getElementById("lead-email");
      
      if (!emailInput || !emailInput.value) return;
      
      // Simulate loading state
      if (submitBtn) {
        const span = submitBtn.querySelector("span");
        if (span) span.innerText = "Registrando...";
        submitBtn.disabled = true;
      }

      // CONFIGURATION: Set your Formspree Form ID here (e.g. "xqyozabc")
      // You can get a free Form ID by registering your email at formspree.io
      const FORMSPREE_ID = ""; 
      
      if (FORMSPREE_ID) {
        fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({ email: emailInput.value })
        })
        .then(() => {
          showSuccess();
        })
        .catch(() => {
          // Fallback to simulation if request fails or offline
          simulateSuccess();
        });
      } else {
        simulateSuccess();
      }
      
      function showSuccess() {
        leadForm.style.display = "none";
        if (successMsg) {
          successMsg.classList.remove("lead-success-hidden");
        }
        if (submitBtn) {
          const span = submitBtn.querySelector("span");
          if (span) span.innerText = "Unirme a la Lista de Espera";
          submitBtn.disabled = false;
        }
      }
      
      function simulateSuccess() {
        setTimeout(() => {
          showSuccess();
        }, 1200);
      }
    });
  }

});
