import { fetchUpcomingGames, fetchPlatforms, searchGames } from './api';

export default async function PageList(container) {
  container.innerHTML = `
    <div class="search-bar">
      <input id="searchBar" type="text" placeholder="Rechercher un jeu..." />
      <div class="search-icon"></div>
    </div>
    <div class="mb-3">
      <label for="platformSelect" class="form-label"></label>
      <select id="platformSelect" class="form-select">
        <option value="">Toutes les plateformes</option>
      </select>
    </div>
    <div id="gamesList" class="row g-3"></div>
    <div id="showMoreContainer" class="d-flex justify-content-center mt-3"></div> <!-- Conteneur pour le bouton "Show more" -->
  `;

  const gamesList = document.getElementById('gamesList');
  const platformSelect = document.getElementById('platformSelect');
  const searchBar = document.getElementById('searchBar');

  let upcomingGames = [];
  let currentPage = 1;
  const gamesPerPage = 9;

  async function loadUpcomingGames() {
    const games = await fetchUpcomingGames();
    console.log('Jeux récupérés:', games);
    upcomingGames = games;
    displayGames();
  }

  async function loadPlatforms() {
    const platforms = await fetchPlatforms();
    platforms.forEach(platform => {
      const option = document.createElement('option');
      option.value = platform.id;
      option.textContent = platform.name;
      platformSelect.appendChild(option);
    });
  }

  function getPlatformLogo(platformName) {
    const nameLowerCase = platformName.toLowerCase();

    if (nameLowerCase.includes('playstation')) {
      return 'images/platforms/playstation.svg';
    } else if (nameLowerCase.includes('xbox')) {
      return 'images/platforms/xbox.svg';
    } else if (nameLowerCase.includes('pc')) {
      return 'images/platforms/windows.svg';
    } else if (nameLowerCase.includes('nintendo')) {
      return 'images/platforms/nintendo-switch.svg';
    } else {
      return 'images/platforms/default.svg';
    }
  }

  function displayGames() {
    const gamesToDisplay = upcomingGames.slice(0, currentPage * gamesPerPage);

    gamesList.innerHTML = '';
    gamesToDisplay.forEach(game => {
      const gameCard = document.createElement('div');
      gameCard.classList.add('col-md-4');

      const platformsText = game.platforms && game.platforms.length > 0
        ? game.platforms.map(platform => platform.platform.name).join(', ')
        : 'Aucune plateforme disponible';

      const platformLogos = game.platforms
        ? game.platforms.map(p => `<img src="${getPlatformLogo(p.platform.name)}" alt="${p.platform.name}" class="platform-logo" />`).join('')
        : '';

      gameCard.innerHTML = `
      <div class="card game-card">
        <img src="${game.background_image || 'default-image-url.jpg'}" class="card-img-top game-image" alt="${game.name}" />
        <div class="card-body">
          <h5 class="card-title game-title">${game.name}</h5>
        </div>
        <div class="platform-icons">
          ${platformLogos}
        </div>
        <div class="card-footer">
          <small class="text-muted">Sortie prévue : ${game.released || 'Date non spécifiée'}</small>
        </div>
      </div>
      `;

      gameCard.addEventListener('click', () => {
        location.hash = `pagedetails/${game.slug}`;
      });

      gamesList.appendChild(gameCard);
    });

    console.log('Nombre de jeux affichés:', gamesToDisplay.length);
    console.log('Total de jeux:', upcomingGames.length);
    const showMoreContainer = document.getElementById('showMoreContainer');
    showMoreContainer.innerHTML = '';
    if (upcomingGames.length > currentPage * gamesPerPage) {
      const showMoreButton = document.createElement('button');
      showMoreButton.textContent = 'Show more';
      showMoreButton.classList.add('btn', 'btn-secondary', 'mt-3');
      showMoreButton.addEventListener('click', loadMoreGames);
      showMoreContainer.appendChild(showMoreButton);
    }
  }

  function loadMoreGames() {
    currentPage++;
    displayGames();
  }

  searchBar.addEventListener('input', async () => {
    const query = searchBar.value.toLowerCase();
    if (query) {
      const results = await searchGames(query);
      if (results.length > 0) {
        upcomingGames = results;
        currentPage = 1;
        displayGames();
      } else {
        gamesList.innerHTML = '<p>Aucun jeu trouvé.</p>';
        document.getElementById('showMoreContainer').innerHTML = '';
      }
    } else {
      currentPage = 1;
      await loadUpcomingGames();
    }
  });

  platformSelect.addEventListener('change', () => {
    const platform = platformSelect.value;
    let filteredGames = upcomingGames;
    if (platform) {
      filteredGames = filteredGames.filter(game =>
        game.platforms && game.platforms.some(p => p.platform.id == platform)
      );
    }
    upcomingGames = filteredGames;
    currentPage = 1;
    displayGames();
  });

  await loadPlatforms();
  await loadUpcomingGames();
}
