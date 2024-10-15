import Home from './Home';
import PageList from './PageList';
import PageDetail from './PageDetail';
import { fetchGames } from './api';

function router() {
  const hash = window.location.hash;
  const container = document.getElementById('pageContent');

  if (!hash || hash === '#') {
    Home(container);
  } else if (hash.startsWith('#pagelist')) {
    PageList(container);
  } else if (parts.length === 2) {
    const slug = parts[1];
    PageDetail(pageContent, slug);
  } else {
    container.innerHTML = '<h2>404 - Page non trouvée</h2>';
  }
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

async function init() {
  await fetchGames();
  router();
}

init();
