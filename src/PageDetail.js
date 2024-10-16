export default async function PageDetail(container, slug) {
  const apiKey = 'f02ac9f434db406aa2007327ef85539b';
  const gameDetailUrl = `https://api.rawg.io/api/games/${slug}?key=${apiKey}`;

  try {
    const response = await fetch(gameDetailUrl);
    const game = await response.json();
    console.log(game);

    container.innerHTML = `
      <h1>${game.name}</h1>
      <img src="${game.background_image}" alt="${game.name}" style="width: 50%; height: 50%;"/>
      <p>${game.description_raw || 'Aucune description disponible.'}</p>
      <p><strong>Date de sortie :</strong> ${game.released || 'Non spécifiée'}</p>
      
      ${game.developers && game.developers.length > 0 ? `
        <p><strong>Développeurs :</strong> ${game.developers.map(dev => `<a href="#pagelist?developer=${dev.id}">${dev.name}</a>`).join(', ')}</p>
      ` : ''}

      ${game.tags && game.tags.length > 0 ? `
        <p><strong>Tags :</strong> ${game.tags.map(tag => `<a href="#pagelist?tag=${tag.id}">${tag.name}</a>`).join(', ')}</p>
      ` : ''}

      ${game.genres && game.genres.length > 0 ? `
        <p><strong>Genres :</strong> ${game.genres.map(genre => `<a href="#pagelist?genre=${genre.id}">${genre.name}</a>`).join(', ')}</p>
      ` : ''}

      ${game.publishers && game.publishers.length > 0 ? `
        <p><strong>Éditeurs :</strong> ${game.publishers.map(publisher => `<a href="#pagelist?publisher=${publisher.id}">${publisher.name}</a>`).join(', ')}</p>
      ` : ''}

      ${game.platforms && game.platforms.length > 0 ? `
        <p><strong>Plateformes :</strong> ${game.platforms.map(platform => `<a href="#pagelist?platform=${platform.platform.id}">${platform.platform.name}</a>`).join(', ')}</p>
      ` : ''}

      ${game.website ? `<p><strong>Site Web :</strong> <a href="${game.website}" target="_blank">${game.website}</a></p>` : ''}
      
      ${game.clip && game.clip.clip ? `
        <p><strong>Vidéo de présentation :</strong></p>
        <video controls style="width: 100%; height: auto;">
          <source src="${game.clip.clip}" type="video/mp4">
          Votre navigateur ne supporte pas la vidéo.
        </video>
      ` : ''}

      <p><strong>Moyenne des notes :</strong> ${game.rating || 'Non disponible'}</p>
      <p><strong>Nombre de notes :</strong> ${game.ratings_count || 'Non disponible'}</p>

      <h3>Screenshots</h3>
      <div class="screenshots">
        ${game.short_screenshots ? game.short_screenshots.slice(0, 4).map(screenshot => `<img src="${screenshot.image}" alt="Screenshot" style="width: 100%; height: auto; margin-bottom: 10px;" />`).join('') : 'Aucun screenshot disponible.'}
      </div>

      ${game.stores && game.stores.length > 0 ? `
        <h3>Acheter le jeu :</h3>
        <ul>
          ${game.stores.map(store => `<li><a href="${store.url}" target="_blank">${store.store.name}</a></li>`).join('')}
        </ul>
      ` : ''}
      
      <a href="#pagelist">Retour à la liste des jeux</a>
    `;
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du jeu:', error);
    container.innerHTML = '<p>Erreur lors de la récupération des détails du jeu.</p>';
  }
}
