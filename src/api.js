// api.js
const apiKey = 'f02ac9f434db406aa2007327ef85539b';
const apiBaseUrl = 'https://api.rawg.io/api/games?key=' + apiKey;

export async function fetchGames(page = 1, pageSize = 9) {
  const paginatedUrl = `${apiBaseUrl}&page=${page}&page_size=${pageSize}`;
  try {
    const response = await fetch(paginatedUrl);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Erreur lors de la récupération des jeux:', error);
    return [];
  }
}

export async function fetchUpcomingGames(page = 1) {
  const nextYear = new Date().getFullYear() + 1;
  const response = await fetch(
    `${apiBaseUrl}&dates=${nextYear}-01-01,${nextYear}-12-31&ordering=-added&page_size=9&page=${page}`
  );

  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération des jeux : ${response.statusText}`);
  }

  const data = await response.json();
  return data.results; // Assurez-vous que vous renvoyez les résultats
}

export async function fetchPlatforms() {
  const response = await fetch(`https://api.rawg.io/api/platforms?key=${apiKey}`);
  const data = await response.json();
  return data.results; // Assurez-vous que vous renvoyez les plateformes
}

export async function searchGames(query, platform = '', page = 1) {
  let url = `${apiBaseUrl}&search=${encodeURIComponent(query)}&page_size=9&page=${page}`;
  if (platform) {
    url += `&platforms=${platform}`;
  }
  const response = await fetch(url);
  const data = await response.json();
  return data.results;
}

export async function fetchGameDetails(slug) {
  const response = await fetch(`https://api.rawg.io/api/games/${slug}?key=${apiKey}`);
  const data = await response.json();
  return data;
}
