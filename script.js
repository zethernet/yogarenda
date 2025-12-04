// Carrusel simple + menú + carga de eventos desde JSON

document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  initNav();
  initCarousel();
  cargarEventos();
});

function initNav() {
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (!navToggle || !mainNav) return;

  navToggle.addEventListener("click", () => {
    mainNav.classList.toggle("open");
  });
}

// CARRUSEL

function initCarousel() {
  const items = document.querySelectorAll(".carousel-item");
  const nextBtn = document.querySelector(".carousel-control.next");
  const prevBtn = document.querySelector(".carousel-control.prev");
  const indicators = document.querySelectorAll(".indicator");

  if (!items.length) return;

  let currentIndex = 0;
  let autoTimer = null;

  function showSlide(index) {
    items.forEach((item, i) => {
      item.classList.toggle("active", i === index);
    });
    indicators.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
    currentIndex = index;
  }

  function nextSlide() {
    const nextIndex = (currentIndex + 1) % items.length;
    showSlide(nextIndex);
  }

  function prevSlide() {
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    showSlide(prevIndex);
  }

  if (nextBtn) nextBtn.addEventListener("click", () => {
    nextSlide();
    resetAuto();
  });

  if (prevBtn) prevBtn.addEventListener("click", () => {
    prevSlide();
    resetAuto();
  });

  indicators.forEach((dot) => {
    dot.addEventListener("click", () => {
      const index = parseInt(dot.getAttribute("data-slide"), 10);
      if (!isNaN(index)) {
        showSlide(index);
        resetAuto();
      }
    });
  });

  function startAuto() {
    autoTimer = setInterval(nextSlide, 6000);
  }

  function resetAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
    }
    startAuto();
  }

  showSlide(0);
  startAuto();
}

// CARGA DE EVENTOS DESDE events.json (la "base de datos" en JSON)

function cargarEventos() {
  const contenedor = document.getElementById("eventos-lista");
  const mensajeVacio = document.getElementById("eventos-vacio");

  if (!contenedor) return;

  fetch("events.json")
    .then((resp) => {
      if (!resp.ok) {
        throw new Error("No se pudo cargar events.json");
      }
      return resp.json();
    })
    .then((data) => {
      if (!Array.isArray(data) || data.length === 0) {
        if (mensajeVacio) mensajeVacio.style.display = "block";
        return;
      }

      // Ordenar por fecha ascendente
      data.sort((a, b) => {
        const da = new Date(a.fecha);
        const db = new Date(b.fecha);
        return da - db;
      });

      contenedor.innerHTML = "";

      data.forEach((evento) => {
        const card = document.createElement("article");
        card.className = "event-card";

        const img = document.createElement("img");
        img.src = evento.imagen || "assets/carrusel1.jpg";
        img.alt = evento.titulo || "Evento Yoga Renda";

        const body = document.createElement("div");
        body.className = "event-body";

        const title = document.createElement("h3");
        title.className = "event-title";
        title.textContent = evento.titulo || "Evento";

        const subtitle = document.createElement("p");
        subtitle.className = "event-subtitle";
        subtitle.textContent = evento.subtitulo || "";

        const date = document.createElement("p");
        date.className = "event-date";
        date.textContent = formatearFecha(evento.fecha);

        body.appendChild(title);
        if (evento.subtitulo) body.appendChild(subtitle);
        body.appendChild(date);

        card.appendChild(img);
        card.appendChild(body);
        contenedor.appendChild(card);
      });

      if (mensajeVacio) mensajeVacio.style.display = "none";
    })
    .catch((error) => {
      console.error(error);
      if (mensajeVacio) {
        mensajeVacio.style.display = "block";
        mensajeVacio.textContent =
          "No se pudieron cargar los eventos en este momento.";
      }
    });
}

function formatearFecha(fechaStr) {
  if (!fechaStr) return "";

  const fecha = new Date(fechaStr);
  if (isNaN(fecha.getTime())) return fechaStr;

  const opciones = { day: "2-digit", month: "2-digit", year: "numeric" };
  return fecha.toLocaleDateString("es-PY", opciones);
}
