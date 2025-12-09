<script>
  // Import des stores
  import { posts } from '../stores/posts.js';
  
  // Charger les posts de la première page au montage
  posts.fetchPosts(1);
</script>

<!-- Composant de pagination -->
<div class="pagination-box">
  <h2>Posts avec Pagination</h2>

  <!-- Affiche le statut du chargement -->
  {#if $posts.loading}
    <div class="loading">⏳ Chargement...</div>
  {/if}

  <!-- Affiche les posts de la page actuelle -->
  {#if $posts && $posts.posts && $posts.posts.length > 0}
    <div class="posts-list">
      {#each $posts.posts as post}
        <div class="post">
          <h3>{post.title || 'Sans titre'}</h3>
          <p>{(post.body || '').substring(0, 100)}...</p>
          <small>ID: {post.id}</small>
          <button on:click={() => posts.deletePost(post.id)} class="delete-btn">
            🗑️ Supprimer
          </button>
        </div>
      {/each}
    </div>
  {/if}

  <!-- Affiche les infos de pagination -->
  {#if $posts}
    <div class="pagination-info">
      <p>
        Page <strong>{$posts.currentPage}</strong> sur
        <strong>{$posts.totalPages}</strong>
        ({$posts.totalPages * 10} posts au total)
      </p>
    </div>
  {/if}

  <!-- Boutons de navigation -->
  <div class="pagination-controls">
    <!-- Bouton première page -->
    <button
      on:click={() => posts.fetchPosts(1)}
      disabled={$posts.currentPage === 1}
      title="Aller à la première page"
    >
      ⏮️ Première
    </button>

    <!-- Bouton page précédente -->
    <button
      on:click={() => posts.fetchPosts($posts.currentPage - 1)}
      disabled={$posts.currentPage === 1}
      title="Aller à la page précédente"
    >
      ◀️ Précédent
    </button>

    <!-- Affiche les numéros de page à cliquer -->
    <div class="page-numbers">
      {#each Array.from({length: Math.min($posts.totalPages, 5)}, (_, i) => {
        const delta = 2;
        const start = Math.max(1, $posts.currentPage - delta);
        return Math.min(start + i, $posts.totalPages);
      }) as pageNum}
        <button
          class="page-button {pageNum === $posts.currentPage ? 'active' : ''}"
          on:click={() => posts.fetchPosts(pageNum)}
          disabled={pageNum === $posts.currentPage}
        >
          {pageNum}
        </button>
      {/each}
    </div>

    <!-- Bouton page suivante -->
    <button
      on:click={() => posts.fetchPosts($posts.currentPage + 1)}
      disabled={$posts.currentPage === $posts.totalPages}
      title="Aller à la page suivante"
    >
      Suivant ▶️
    </button>

    <!-- Bouton dernière page -->
    <button
      on:click={() => posts.fetchPosts($posts.totalPages)}
      disabled={$posts.currentPage === $posts.totalPages}
      title="Aller à la dernière page"
    >
      Dernière ⏭️
    </button>
  </div>

  <!-- Affiche les erreurs s'il y en a -->
  {#if $posts.error}
    <div class="error">
      ❌ Erreur: {$posts.error}
    </div>
  {/if}
</div>

<style>
  .pagination-box {
    padding: 1.5rem;
    background: white;
    border: 1px solid #e5e7eb;
    max-width: 680px;
  }

  .pagination-box h2 {
    margin: 0 0 1.25rem 0;
    font-size: 1.2rem;
    color: #1f2937;
  }

  .loading {
    text-align: center;
    padding: 1.5rem;
    color: #6b7280;
  }

  .posts-list {
    margin: 1rem 0;
  }

  .post {
    padding: 1rem;
    margin: 0.75rem 0;
    background: white;
    border: 1px solid #e5e7eb;
  }

  .post:hover {
    background: #f9fafb;
  }

  .post h3, .post p, .post small {
    margin: 0;
  }

  .post h3 {
    font-size: 1rem;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  .post p {
    font-size: 0.85rem;
    color: #6b7280;
    margin: 0.5rem 0;
  }

  .post small {
    display: block;
    margin-top: 0.5rem;
    color: #9ca3af;
    font-size: 0.8rem;
  }

  .delete-btn {
    width: 100%;
    margin-top: 0.75rem;
    padding: 0.4rem;
    background: #ef4444;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 0.8rem;
  }

  .delete-btn:hover {
    background: #dc2626;
  }

  .pagination-info {
    text-align: center;
    padding: 0.75rem;
    background: #f9fafb;
    margin: 1rem 0;
    font-size: 0.8rem;
    color: #6b7280;
  }

  .pagination-controls {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    flex-wrap: wrap;
    margin: 1.5rem 0;
  }

  button, .page-button {
    padding: 0.5rem 0.9rem;
    background: #4b5563;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 0.8rem;
    white-space: nowrap;
  }

  button:hover:not(:disabled) {
    background: #3a4049;
  }

  button:disabled {
    background: #e5e7eb;
    color: #9ca3af;
    cursor: not-allowed;
  }

  .page-button {
    min-width: 2.2rem;
    padding: 0.5rem 0.6rem;
  }

  .page-numbers {
    display: flex;
    gap: 0.4rem;
  }

  .page-button.active {
    background: #10b981;
  }

  .error {
    padding: 0.75rem;
    background: #fee2e2;
    color: #991b1b;
    font-size: 0.8rem;
    margin-top: 1rem;
  }
</style>
