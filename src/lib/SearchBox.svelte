<script>
  // Import des stores de recherche avec debounce
  import { search, searchResults } from '../stores/search.js';
  // Import des stores de filtrage et tri
  import { sortBy, sortOrder } from '../stores/filters.js';
</script>

<!-- Composant de recherche avec debounce et filtrage, tri -->
<div class="search-box">
  <h2>🔍 Recherche Avancée (Debounce + Filtrage)</h2>

  <!-- Section Recherche avec Debounce -->
  <div class="search-section">
    <h3>Recherche (300ms Debounce)</h3>
    <div class="search-input-group">
      <input
        type="text"
        placeholder="Tapez pour chercher..."
        on:input={(e) => search.setSearch(e.currentTarget.value)}
        class="search-input"
      />
      <button on:click={() => search.searchNow()}>
        🔍 Maintenant
      </button>
    </div>
  </div>

  <!-- Section Tri -->
  <div class="filter-section">
    <h3>↕️ Tri</h3>
    <div class="sort-controls">
      <div class="sort-group">
        <label for="sort-by">Trier par:</label>
        <select id="sort-by" bind:value={$sortBy}>
          <option value="id">ID</option>
          <option value="title">Titre</option>
          <option value="body">Longueur du contenu</option>
        </select>
      </div>
      <div class="sort-group">
        <label for="sort-order">Ordre:</label>
        <select id="sort-order" bind:value={$sortOrder}>
          <option value="asc">Ascendant</option>
          <option value="desc">Descendant</option>
        </select>
      </div>
    </div>
  </div>

  <!-- Affiche les résultats -->
  <div class="results">
    {#await $searchResults}
      <p class="loading">⏳ Recherche en cours...</p>
    {:then results}
      {#if results && results.length > 0}
        <h3>Résultats ({results.length})</h3>
        <ul>
          {#each results as post (post.id)}
            <li>
              <strong>#{post.id} - {post.title}</strong>
              <p>{(post.body || '').substring(0, 100)}...</p>
              <small>{post.body.length} caractères</small>
            </li>
          {/each}
        </ul>
      {:else}
        <p class="no-results">Aucun résultat. Commencez à taper...</p>
      {/if}
    {:catch error}
      <p class="error">❌ Erreur: {error.message}</p>
    {/await}
  </div>

  <!-- Information sur le debounce -->
  <div class="info">
    <small>
      💡 Les résultats s'affichent 300ms après que vous arrêtiez de taper (c'est le debounce)
    </small>
  </div>
</div>

<style>
  .search-box {
    padding: 1.5rem;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    max-width: 520px;
  }

  .search-box h2 {
    margin: 0 0 1.5rem 0;
    font-size: 1.3rem;
    color: #1f2937;
  }

  .search-section,
  .filter-section {
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .search-section h3,
  .filter-section h3 {
    margin: 0 0 1rem 0;
    font-size: 0.95rem;
    color: #374151;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .search-input-group {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0.75rem;
  }

  .search-input {
    padding: 0.625rem 0.875rem;
    font-size: 0.95rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    background: #f9fafb;
    transition: all 0.2s ease;
  }

  .search-input:focus {
    outline: none;
    background: white;
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.05);
  }

  button {
    padding: 0.625rem 1.125rem;
    background: #4b5563;
    color: white;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  button:hover {
    background: #3a4049;
  }

  button:active {
    transform: scale(0.98);
  }

  .sort-controls {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .sort-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .sort-group label {
    font-size: 0.85rem;
    font-weight: 500;
    color: #6b7280;
  }

  .sort-group select {
    padding: 0.625rem;
    font-size: 0.9rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    background: #f9fafb;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .sort-group select:focus {
    outline: none;
    background: white;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  .results {
    margin-top: 1.5rem;
    max-height: 520px;
    overflow-y: auto;
  }

  .results h3 {
    margin: 0 0 1rem 0;
    font-size: 1rem;
    color: #1f2937;
    font-weight: 600;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    padding: 1rem;
    margin: 0.75rem 0;
    background: #f9fafb;
    border-radius: 0.375rem;
    border-left: 2px solid #6366f1;
    transition: all 0.2s ease;
  }

  li:hover {
    background: #f3f4f6;
    border-left-color: #4f46e5;
  }

  li strong {
    display: block;
    color: #1f2937;
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
  }

  li p {
    margin: 0.5rem 0;
    font-size: 0.85rem;
    color: #6b7280;
    line-height: 1.5;
  }

  li small {
    color: #9ca3af;
    font-size: 0.8rem;
  }

  .no-results {
    text-align: center;
    color: #9ca3af;
    padding: 2rem 1rem;
    font-size: 0.9rem;
  }

  .loading {
    text-align: center;
    color: #6b7280;
    padding: 2rem 1rem;
    font-weight: 500;
  }

  .error {
    text-align: center;
    color: #991b1b;
    padding: 1rem;
    background: #fee2e2;
    border-radius: 0.375rem;
    font-size: 0.9rem;
    margin: 1rem 0;
  }

  .info {
    margin-top: 1.5rem;
    padding: 0.875rem;
    background: #f0f9ff;
    border-left: 2px solid #3b82f6;
    border-radius: 0.375rem;
    font-size: 0.85rem;
    color: #1e40af;
  }
</style>
