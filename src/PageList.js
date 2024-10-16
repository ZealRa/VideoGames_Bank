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

  async function loadUpcomingGames() {
    const games = await fetchUpcomingGames(currentPage);
    upcomingGames = games;
    displayGames(upcomingGames);
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

  function getPlatformIcon(slug) {
    switch (slug) {
      case 'playstation':
        return 'playstation';
      case 'xbox':
        return 'xbox';
      case 'pc':
        return 'windows';
      case 'nintendo':
        return 'nintendo-switch';
      default:
        return 'gamepad';
    }
  }

  function displayGames(games) {
    gamesList.innerHTML = '';

    games.forEach(game => {
      const gameCard = document.createElement('div');
      gameCard.classList.add('col-md-4');

      const platformsText = game.platforms && game.platforms.length > 0
        ? game.platforms.map(platform => platform.platform.name).join(', ')
        : 'Aucune plateforme disponible';

      gameCard.innerHTML = `
      <div class="card game-card">
        <img src="${game.background_image}" class="card-img-top game-image" alt="${game.name}" />
        <div class="card-body">
          <h5 class="card-title game-title">${game.name}</h5>
          <p class="card-text game-text">Plateformes : ${platformsText}</p>
        </div>
        <div class="platform-icons">
          ${game.platforms.map(p => `<i class="fab fa-${getPlatformIcon(p.platform.slug)}"></i>`).join('')}
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

    if (games.length > 0) {
      const showMoreButton = document.createElement('button');
      showMoreButton.textContent = 'Show more';
      showMoreButton.classList.add('btn', 'btn-secondary', 'mt-3');
      gamesList.appendChild(showMoreButton);

      showMoreButton.addEventListener('click', () => {
        currentPage++;
        loadMoreUpcomingGames();
      });
    }
  }

  async function loadMoreUpcomingGames() {
    const newGames = await fetchUpcomingGames(currentPage);
    upcomingGames = [...upcomingGames, ...newGames];
    displayGames(upcomingGames);
  }

  searchBar.addEventListener('input', async () => {
    const query = searchBar.value.toLowerCase();
    if (query) {
      const results = await searchGames(query);
      if (results.length > 0) {
        displayGames(results);
      } else {
        gamesList.innerHTML = '<p>Aucun jeu trouvé.</p>';
      }
    } else {
      displayGames(upcomingGames);
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
    displayGames(filteredGames);
  });

  await loadPlatforms();
  await loadUpcomingGames();
}
