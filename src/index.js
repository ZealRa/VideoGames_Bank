import PageList from './PageList';
import { fetchUpcomingGames } from './api';

async function init() {
  const container = document.getElementById('pageContent');
  const games = await fetchUpcomingGames(); // Récupérer les jeux attendus
  PageList(container, games); // Passer les jeux à PageList
}

init();
