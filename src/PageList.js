import { fetchUpcomingGames, fetchPlatforms, fetchGames, searchGames } from './api';

export default async function PageList(container) {
  container.innerHTML = `
    <h1>Jeux à venir</h1>
    <input type="text" id="searchInput" placeholder="Rechercher un jeu..." />
    <select id="platformSelect">
      <option value="">Toutes les plateformes</option>
    </select>
    <div id="gamesList" class="games-list"></div>
  `;

  const gamesList = document.getElementById('gamesList');
  const platformSelect = document.getElementById('platformSelect');

  let upcomingGames = []; // Stocker les jeux à venir
  let currentPage = 1;
  const pageSize = 9; // Nombre de jeux à afficher par page

  async function loadUpcomingGames() {
    const games = await fetchUpcomingGames(currentPage);
    upcomingGames = games; // Stocker les jeux à venir
    displayGames(upcomingGames);
  }

  async function loadPlatforms() {
    const platforms = await fetchPlatforms();
    platforms.forEach(platform => {
      const option = document.createElement('option');
      option.value = platform.id; // Utiliser l'ID de la plateforme
      option.textContent = platform.name; // Afficher le nom de la plateforme
      platformSelect.appendChild(option);
    });
  }

  function displayGames(games) {
    gamesList.innerHTML = ''; // Réinitialiser la liste des jeux

    games.forEach(game => {
      const gameItem = document.createElement('div');
      gameItem.classList.add('game-item');
      gameItem.innerHTML = `
        <h2>${game.name}</h2>
        <img src="${game.background_image}" alt="${game.name}" />
        <a href="#pagedetails/${game.slug}">Voir les détails</a>
      `;
      gamesList.appendChild(gameItem);
    });

    // Gérer le bouton "Show More"
    if (games.length > 0) {
      const showMoreButton = document.createElement('button');
      showMoreButton.textContent = 'Show more';
      gamesList.appendChild(showMoreButton);

      showMoreButton.addEventListener('click', () => {
        currentPage++;
        loadMoreUpcomingGames(); // Charger la page suivante
      });
    }
  }

  async function loadMoreUpcomingGames() {
    const newGames = await fetchUpcomingGames(currentPage);
    upcomingGames = [...upcomingGames, ...newGames]; // Ajouter les nouveaux jeux à la liste existante
    displayGames(upcomingGames);
  }

  // Écouteurs d'événements pour le filtrage
  const searchInput = document.getElementById('searchInput');

  searchInput.addEventListener('input', async () => {
    const query = searchInput.value.toLowerCase();
    console.log("Recherche:", query);

    if (query) {
      const results = await searchGames(query); // Appel de la fonction de recherche
      console.log("Jeux filtrés:", results); // Journaliser les résultats

      // Vérifiez si des résultats ont été trouvés
      if (results.length > 0) {
        displayGames(results); // Affichez les jeux filtrés
      } else {
        gamesList.innerHTML = '<p>Aucun jeu trouvé.</p>'; // Afficher un message s'il n'y a pas de résultats
      }
    } else {
      // Si la barre de recherche est vide, réafficher les jeux à venir
      displayGames(upcomingGames);
    }
  });

  platformSelect.addEventListener('change', () => {
    const platform = platformSelect.value;
    let filteredGames = upcomingGames;

    if (platform) {
      filteredGames = filteredGames.filter(game =>
        game.platforms && game.platforms.some(p => p.platform.id == platform) // Filtrer selon la plateforme
      );
    }

    displayGames(filteredGames);
  });

  await loadPlatforms(); // Charger les plateformes lors de l'initialisation
  await loadUpcomingGames(); // Charger les jeux à venir lors de l'initialisation
}
