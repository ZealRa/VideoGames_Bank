import { fetchGames } from './api';

export default async function PageList(container) {
  let currentPage = 1;

  async function loadGames() {
    const games = await fetchGames(currentPage);

    container.innerHTML = '<h1>Liste des jeux</h1>';
    const gamesList = document.createElement('div');
    gamesList.classList.add('games-list');

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

    container.appendChild(gamesList);

    // Gérer le bouton "Show More"
    if (games.length > 0) {
      const showMoreButton = document.createElement('button');
      showMoreButton.textContent = 'Show more';
      container.appendChild(showMoreButton);

      showMoreButton.addEventListener('click', () => {
        currentPage++;
        loadGames(); // Charger la page suivante
      });
    }
  }

  await loadGames(); // Charger les jeux lors de l'initialisation
}
