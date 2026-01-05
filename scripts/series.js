import getData from "./getData.js";

const params = new URLSearchParams(window.location.search);
const seriesId = params.get("id");
const seasonList = document.getElementById("select-season");
const fichaSeries = document.getElementById("seasons-episodes");
const fichaDescription = document.getElementById("ficha-description");

// Funcion para cargar temporadas
function loadSeasons() {
  getData(`/series/${seriesId}/season/all`)
    .then((data) => {
      const uniqueSeasons = [
        ...new Set(data.map((temporada) => temporada.temporada)),
      ];
      seasonList.innerHTML = ""; // Limpia las opciones existentes

      const optionDefault = document.createElement("option");
      optionDefault.value = "";
      optionDefault.textContent = "Seleccione la temporada";
      seasonList.appendChild(optionDefault);

      uniqueSeasons.forEach((season) => {
        const option = document.createElement("option");
        option.value = season;
        option.textContent = season;
        seasonList.appendChild(option);
      });

      const allOptions = document.createElement("option");
      allOptions.value = "todas";
      allOptions.textContent = "Todas las temporadas";
      seasonList.appendChild(allOptions);
    })
    .catch((error) => {
      console.error("Error retrieving seasons:", error);
    });
}

// Funcion para cargar episodios de una temporada
function loadEpisodes() {
  getData(`/series/${seriesId}/seasons/${seasonList.value}`)
    .then((data) => {
      const uniqueSeasons = [...new Set(data.map((season) => season.season))];
      fichaSeries.innerHTML = "";
      uniqueSeasons.forEach((season) => {
        const ul = document.createElement("ul");
        ul.className = "episodes-list";

        const episodesOfTheCurrentSeason = data.filter(
          (series) => series.season === season
        );

        const htmlList = episodesOfTheCurrentSeason
          .map(
            (series) => `
                    <li>
                        ${series.episodeNumber} - ${series.title}
                    </li>
                `
          )
          .join("");
        ul.innerHTML = htmlList;

        const paragraph = document.createElement("p");
        const line = document.createElement("br");
        paragraph.textContent = `Temporada ${season}`;
        fichaSeries.appendChild(paragraph);
        fichaSeries.appendChild(line);
        fichaSeries.appendChild(ul);
      });
    })
    .catch((error) => {
      console.error("Error retrieving episodes:", error);
    });
}

// Funcion para cargar informaciones de la serie
function loadSeriesInfo() {
  getData(`/series/${seriesId}`)
    .then((data) => {
      fichaDescription.innerHTML = `
                <img src="${data.poster}" alt="${data.title}" />
                <div>
                    <h2>${data.title}</h2>
                    <div class="description-text">
                        <p><b>Média de evaluaciones:</b> ${data.rating}</p>
                        <p>${data.synopsis}</p>
                        <p><b>Actores:</b> ${data.actors}</p>
                    </div>
                </div>
            `;
    })
    .catch((error) => {
      console.error("Error obtaining series information.:", error);
    });
}

// Adiciona escuchador de evento para el elemento select
seasonList.addEventListener("change", loadEpisodes);

// Carga las informaciones de la série y las temporadas cuando la página carga
loadSeriesInfo();
loadSeasons();
