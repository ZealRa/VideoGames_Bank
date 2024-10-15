import { fetchUpcomingGames, fetchPlatforms, fetchGames, searchGames } from './api';

export default async function PageList(container) {
  container.innerHTML = `
    <div class="mb-3">
      <input type="text" id="searchInput" class="form-control" placeholder="Rechercher un jeu..." />
    </div>
    <div class="mb-3">
      <label for="platformSelect" class="form-label">Sélectionner une plateforme</label>
      <select id="platformSelect" class="form-select">
        <option value="">Toutes les plateformes</option>
      </select>
    </div>
    <div id="gamesList" class="row g-3"></div>
    <div id="showMoreContainer" class="d-flex justify-content-center mt-3"></div> <!-- Conteneur pour le bouton "Show more" -->
  `;

  const gamesList = document.getElementById('gamesList');
  const platformSelect = document.getElementById('platformSelect');
  const showMoreContainer = document.getElementById('showMoreContainer'); // Récupérer le conteneur pour le bouton

  let upcomingGames = []; // Stocker les jeux à venir
  let currentPage = 1;

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
      const gameCard = document.createElement('div');
      gameCard.classList.add('col-md-4'); // Colonne Bootstrap

      // Vérifiez si la propriété platforms est définie avant d'utiliser map
      const platformsText = game.platforms && game.platforms.length > 0
        ? game.platforms.map(platform => platform.platform.name).join(', ')
        : 'Aucune plateforme disponible'; // Message par défaut s'il n'y a pas de plateformes

      gameCard.innerHTML = `
            <div class="card game-card">
                <img src="${game.background_image}" class="card-img-top" alt="${game.name}" />
                <div class="card-body">
                    <h5 class="card-title">${game.name}</h5>
                    <p class="card-text">Plateformes : ${platformsText}</p>
                </div>
                <div class="card-footer">
                    <small class="text-muted">Sortie prévue : ${game.released || 'Date non spécifiée'}</small>
                </div>
            </div>
        `;

      // Ajoutez un gestionnaire d'événements pour rediriger vers la page de détails
      gameCard.addEventListener('click', () => {
        // Changez l'URL de hachage pour naviguer vers la page de détails
        location.hash = `pagedetails/${game.slug}`;
      });

      // Ajouter la carte au conteneur de la liste des jeux
      gamesList.appendChild(gameCard);
    });

    // Gérer le bouton "Show More"
    if (games.length > 0) {
      const showMoreButton = document.createElement('button');
      showMoreButton.textContent = 'Show more';
      showMoreButton.classList.add('btn', 'btn-secondary', 'mt-3'); // Ajout de classes Bootstrap
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

    if (query) {
      const results = await searchGames(query);

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
