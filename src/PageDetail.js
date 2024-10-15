export default async function PageDetail(container, slug) {
  const apiKey = 'f02ac9f434db406aa2007327ef85539b';
  const gameDetailUrl = `https://api.rawg.io/api/games/${slug}?key=${apiKey}`;

  try {
    const response = await fetch(gameDetailUrl);
    const game = await response.json();

    container.innerHTML = `
      <h1>${game.name}</h1>
      <p>${game.description_raw}</p>
      <img src="${game.background_image}" alt="${game.name}">
      <a href="#pagelist">Retour à la liste des jeux</a>
    `;
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du jeu:', error);
    container.innerHTML = '<p>Erreur lors de la récupération des détails du jeu.</p>';
  }
}
