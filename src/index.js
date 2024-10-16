import PageList from './PageList';
import PageDetail from './PageDetail';
import { fetchUpcomingGames } from './api';
import './style.scss';

async function init() {
  const container = document.getElementById('pageContent');

  window.addEventListener('hashchange', loadPage);
  loadPage();

  async function loadPage() {
    const hash = window.location.hash;

    if (hash.startsWith('#pagedetails/')) {
      const slug = hash.split('/')[1];
      await PageDetail(container, slug);
    } else {
      const games = await fetchUpcomingGames();
      PageList(container, games);
    }
  }
}

init();
