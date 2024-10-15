import { fetchUpcomingGames } from './api';
console.log(fetchUpcomingGames); // Ceci devrait afficher la fonction

export default function Home(container) {
  container.innerHTML = `
    <h1>Jeux les plus attendus</h1>
    <div id="upcomingGamesContainer" class="games-container"></div>
    <button id="showMoreButton" style="display:none">Show more</button>
  `;

  let currentPage = 1;

  async function loadGames() {
    try {
      console.log('Chargement des jeux...'); // Ajoute un log ici
      const upcomingGames = await fetchUpcomingGames(currentPage);
      console.log(upcomingGames); // Vérifie si les jeux sont récupérés
      displayGames(upcomingGames);
    } catch (error) {
      console.error('Erreur lors du chargement des jeux:', error);
    }
  }


  function displayGames(games) {
    const gamesContainer = document.getElementById('upcomingGamesContainer');
    games.forEach(game => {
      const gameCard = createGameCard(game);
      gamesContainer.appendChild(gameCard);
    });
  }

  function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.innerHTML = `
      <h2>${game.name}</h2>
      <img src="${game.background_image}" alt="${game.name}" />
      <p>Platforms: ${game.platforms.map(p => p.platform.name).join(', ')}</p>
    `;
    return card;
  }

  loadGames();

  document.getElementById('showMoreButton').addEventListener('click', () => {
    currentPage++;
    loadGames();
  });
}
