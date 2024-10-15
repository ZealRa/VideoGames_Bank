import PageList from './PageList';
import PageDetail from './PageDetail';
import { fetchUpcomingGames } from './api';
import './style.scss';

async function init() {
  const container = document.getElementById('pageContent');

  // Écouter les changements de l'URL
  window.addEventListener('hashchange', loadPage);
  loadPage(); // Charger la page initiale

  async function loadPage() {
    const hash = window.location.hash; // Obtenir le hachage de l'URL

    if (hash.startsWith('#pagedetails/')) {
      const slug = hash.split('/')[1]; // Récupérer le slug du jeu
      await PageDetail(container, slug); // Charger la page de détails
    } else {
      const games = await fetchUpcomingGames(); // Récupérer les jeux attendus
      PageList(container, games); // Charger la liste des jeux
    }
  }
}

init();
