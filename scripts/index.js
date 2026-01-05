import getData from "./getData.js";

// Mapea los elementos DOM que desea actualizar
const elements = {
  top5: document.querySelector('[data-name="top5"]'),
  releases: document.querySelector('[data-name="releases"]'),
  series: document.querySelector('[data-name="series"]'),
};

// Funcion para crear la lista de peliculas

function createMovieList(element, data) {
  // Verifica si hay un elemento <ul> dentro de la seccion
  const existingUl = element.querySelector("ul");

  // Si un elemento <ul> ya existe dentro de la seccion, borrarlo
  if (existingUl) {
    element.removeChild(existingUl);
  }

  const ul = document.createElement("ul");
  ul.className = "list";
  const listaHTML = data
    .map(
      (movie) => `
        <li>
            <a href="/details.html?id=${movie.id}">
                <img src="${movie.poster}" alt="${movie.title}">
            </a>
        </li>
    `
    )
    .join("");

  ul.innerHTML = listaHTML;
  element.appendChild(ul);
}

// Funcion genérica para tratamiento de errores
function handleErrors(errorMessage) {
  console.error(errorMessage);
}

const selectCategory = document.querySelector("[data-categories]");
const sectionsToHide = document.querySelectorAll(".section"); // Adicione a classe CSS 'hide-when-filtered' às seções e títulos que deseja ocultar.

selectCategory.addEventListener("change", function () {
  const category = document.querySelector('[data-name="category"]');
  const selectedCategory = selectCategory.value;

  if (selectedCategory === "todos") {
    for (const section of sectionsToHide) {
      section.classList.remove("hidden");
    }
    category.classList.add("hidden");
  } else {
    for (const section of sectionsToHide) {
      section.classList.add("hidden");
    }

    category.classList.remove("hidden");
    // Haga una solicitud para el endpoint com la categoria seleccionada
    getData(`/series/genre/${selectedCategory}`)
      .then((data) => {
        createMovieList(category, data);
      })
      .catch((error) => {
        handleErrors("An error occurred while loading the category data.");
      });
  }
});

// Array de URLs para las solicitudes
generateSeries();
function generateSeries() {
  const urls = ["/series/top5", "/series/releases", "/series"];

  // Hace todas las solicitudes en paralelo
  Promise.all(urls.map((url) => getData(url)))
    .then((data) => {
      //console.log("Resultados de las llamadas:", data);
      createMovieList(elements.top5, data[0]);
      createMovieList(elements.releases, data[1]);
      createMovieList(elements.series, data[2].slice(0, 5));
    })
    .catch((error) => {
      handleErrors("An error ocurred while loading the data.");
      console.error(error);
    });
}
