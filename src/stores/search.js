import { writable, derived, get } from 'svelte/store';

function createSearchStore() {
  // TODO 40: Store pour la valeur immédiate (ce que l'user tape)
  // MODIFICATION: searchInput se met à jour à chaque frappe
  const searchInput = writable('');

  // TODO 41: Store pour la valeur debouncée (utilisée pour l'API)
  // MODIFICATION: searchQuery se met à jour seulement après 300ms d'inactivité
  const searchQuery = writable('');

  let timeout;

  return {
    // TODO 42: Subscribe custom qui combine les deux
    // MODIFICATION: On expose searchQuery comme le store principal
    subscribe: searchQuery.subscribe,

    // TODO 43: Méthode pour mettre à jour avec debounce
    // MODIFICATION: setSearch met à jour immédiatement searchInput
    // mais retarde la mise à jour de searchQuery
    setSearch: (value) => {
      // Mettre à jour immédiatement l'input pour l'UI réactive
      searchInput.set(value);

      // TODO 44: Annuler le timeout précédent
      // MODIFICATION: On efface le timeout précédent pour éviter les appels multiples
      // HINT: clearTimeout(timeout)
      clearTimeout(timeout);

      // TODO 45: Créer un nouveau timeout
      // MODIFICATION: Mettre à jour searchQuery après 300ms d'inactivité
      // Créer un nouveau timeout
      timeout = setTimeout(() => {
        searchQuery.set(value);
      }, 300);
    },

    // TODO 46: Méthode pour forcer la recherche immédiate
    // MODIFICATION: searchNow force la mise à jour sans attendre les 300ms
    searchNow: () => {
      // Comment récupérer la valeur actuelle?
      // HINT: get() de svelte/store
      const currentValue = get(searchInput);
      clearTimeout(timeout);
      searchQuery.set(currentValue);
    },

    // Exposer aussi searchInput pour l'UI
    // MODIFICATION: On expose searchInput pour que le composant l'utilise
    input: { subscribe: searchInput.subscribe }
  };
}

export const search = createSearchStore();

// TODO 47: Store dérivé pour les résultats
// MODIFICATION: searchResults appelle l'API avec la valeur debouncée
// Ce store a une syntaxe spéciale pour les opérations async
// On doit accéder à searchQuery directement, pas à search
export const searchResults = derived(
  { subscribe: search.subscribe },
  async (searchQuery) => {
    // Si query vide, retourner tableau vide
    if (!searchQuery) {
      return [];
    }

    // TODO 48: Appel API avec la query
    // MODIFICATION: On appelle l'API JSONPlaceholder avec le paramètre q
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?q=${searchQuery}`
      );
      const results = await response.json();
      return results;
    } catch (error) {
      // MODIFICATION: En cas d'erreur, on retourne un tableau vide
      return [];
    }
  }
);
