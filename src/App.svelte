<script>
  // Import de tous les composants
  import UserManager from './lib/UserManager.svelte';
  import NotificationCenter from './lib/NotificationCenter.svelte';
  import SearchBox from './lib/SearchBox.svelte';
  import PaginationComponent from './lib/PaginationComponent.svelte';
</script>

<!-- Page principale avec tous les composants -->
<main>
  <header>
    <h1>Application Svelte Stores - TP2</h1>
    <p>Gestion d'État Avancée et Patterns de Stores</p>
  </header>

  <!-- Notifications globales -->
  <NotificationCenter />

  <!-- Section 1: Gestion utilisateur -->
  <section class="section">
    <UserManager />
  </section>

  <!-- Section 2: Recherche, filtrage et tri -->
  <section class="section">
    <SearchBox />
  </section>

  <!-- Section 3: Pagination -->
  <section class="section">
    <PaginationComponent />
  </section>

  <!-- Footer -->
  <footer>
    <p>TP2 - Gestion d'État Avancée © 2025</p>
  </footer>
</main>

<style>
  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    margin: 0;
    padding: 0;
    background: #f5f5f5;
  }

  :global(*) {
    box-sizing: border-box;
  }

  main {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem 1.25rem;
  }

  header {
    background: #2c3e50;
    color: white;
    padding: 2.5rem 1.5rem;
    margin-bottom: 2.5rem;
    text-align: center;
  }

  header h1 {
    margin: 0;
    font-size: 1.75rem;
  }

  header p {
    margin: 0.75rem 0 0 0;
    font-size: 0.95rem;
    opacity: 0.85;
  }

  .section {
    display: flex;
    justify-content: center;
    margin: 2rem 0;
  }

  footer {
    text-align: center;
    padding: 2rem 1.25rem;
    border-top: 1px solid #e5e7eb;
    color: #9ca3af;
    margin-top: 3rem;
    font-size: 0.8rem;
  }
</style>
