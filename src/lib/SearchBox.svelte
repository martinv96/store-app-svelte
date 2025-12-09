<script>
  // Import des stores de recherche
  import { search, searchResults } from '../stores/search.js';
</script>

<!-- Composant de recherche avec debounce -->
<div class="search-box">
  <h2>Rechercher des Posts</h2>

  <!-- Input de recherche -->
  <div class="search-input-group">
    <input
      type="text"
      placeholder="Tapez pour chercher..."
      on:input={(e) => search.setSearch(e.currentTarget.value)}
    />
    <!-- Bouton pour forcer la recherche immédiate -->
    <button on:click={() => search.searchNow()}>
      🔍 Chercher maintenant
    </button>
  </div>

  <!-- Affiche les résultats -->
  <div class="results">
    {#await $searchResults}
      <p class="loading">⏳ Recherche en cours...</p>
    {:then results}
      {#if results && results.length > 0}
        <h3>Résultats ({results.length})</h3>
        <ul>
          {#each results as post}
            <li>
              <strong>{post.title || 'Sans titre'}</strong>
              <p>{(post.body || '').substring(0, 100)}...</p>
              <small>ID: {post.id}</small>
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
      💡 Les résultats s'affichent 300ms après que vous arrêtiez de taper
      (c'est le debounce)
    </small>
  </div>
</div>

<style>
  .search-box {
    padding: 1.5rem;
    margin: 1.25rem;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    max-width: 520px;
  }

  .search-input-group {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  input {
    padding: 0.625rem 0.875rem;
    font-size: 0.95rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    background: #f9fafb;
    transition: all 0.2s ease;
  }

  input:focus {
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

  .results {
    margin-top: 1.5rem;
    max-height: 520px;
    overflow-y: auto;
  }

  h3 {
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
