import { writable, derived, get } from 'svelte/store';

function createPaginationStore(fetchFunction, itemsPerPage = 10) {
  // TODO 49: État de la pagination
  // MODIFICATION: state contient toutes les infos de pagination
  const state = writable({
    currentPage: 1,
    totalItems: 0,
    itemsPerPage,
    items: [],
    loading: false,
    error: null
  });

  // TODO 50: Store dérivé pour totalPages
  // MODIFICATION: Calculer le nombre total de pages
  const totalPages = derived(
    state,
    $state => {
      // Calculer le nombre total de pages
      // HINT: Math.ceil()
      return Math.ceil($state.totalItems / $state.itemsPerPage);
    }
  );

  // TODO 51: Store dérivé pour la plage de pages à afficher
  // MODIFICATION: Créer un tableau de numéros de page à afficher
  const pageRange = derived(
    [state, totalPages],
    ([$state, $totalPages]) => {
      const current = $state.currentPage;
      const delta = 2; // Nombre de pages avant/après

      // TODO: Créer un tableau de numéros de page
      // Ex: Si current=5, total=10 → [3,4,5,6,7]
      const range = [];
      for (let i = Math.max(1, current - delta); i <= Math.min($totalPages, current + delta); i++) {
        range.push(i);
      }
      return range;
    }
  );

  // TODO 52: Méthode pour charger une page
  // MODIFICATION: loadPage charge les données pour une page spécifique
  const loadPage = async (page) => {
    // Validation
    const $totalPages = get(totalPages);
    // Permettre le chargement même si totalPages = 0 (première fois)
    if (page < 1 || (page > $totalPages && $totalPages > 0)) return;

    // TODO 53: Mettre loading à true
    // MODIFICATION: Indiquer qu'on est en train de charger
    state.update(s => ({
      ...s,
      loading: true
    }));

    try {
      // TODO 48: Appel API avec la page
      // MODIFICATION: Appeler la fonction de fetch fournie
      const result = await fetchFunction(page);

      // TODO 54: Mettre à jour avec les résultats
      // MODIFICATION: Mettre à jour state avec les données récupérées
      state.update(s => ({
        ...s,
        items: result.items,
        totalItems: result.total,
        currentPage: page,
        loading: false
      }));
    } catch (error) {
      // TODO 55: Gérer l'erreur
      // MODIFICATION: En cas d'erreur, mettre loading à false et stocker l'erreur
      state.update(s => ({
        ...s,
        loading: false,
        error: error.message
      }));
    }
  };

  // TODO 56: Méthodes de navigation
  // MODIFICATION: nextPage charge la page suivante
  const nextPage = () => {
    const $state = get(state);
    const $totalPages = get(totalPages);
    if ($state.currentPage < $totalPages) {
      loadPage($state.currentPage + 1);
    }
  };

  // MODIFICATION: previousPage charge la page précédente
  const previousPage = () => {
    const $state = get(state);
    if ($state.currentPage > 1) {
      loadPage($state.currentPage - 1);
    }
  };

  // MODIFICATION: firstPage charge la première page
  const firstPage = () => {
    loadPage(1);
  };

  // MODIFICATION: lastPage charge la dernière page
  const lastPage = () => {
    const $totalPages = get(totalPages);
    loadPage($totalPages);
  };

  return {
    // Les trois stores accessibles directement avec $
    state,
    totalPages,
    pageRange,
    // Les méthodes
    loadPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage
  };
}

// CHECKPOINT 9: Créez une instance et testez la pagination
// MODIFICATION: Créer une instance avec JSONPlaceholder
// La fonction fetchFunction simule un appel API avec pagination
const mockFetchFunction = async (page) => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`);
  const items = await response.json();
  // JSONPlaceholder retourne 100 posts
  return {
    items,
    total: 100
  };
};

const paginationStore = createPaginationStore(mockFetchFunction, 10);

// Exporter les stores directement pour pouvoir les utiliser avec $ dans les composants
export const paginationState = paginationStore.state;
export const paginationTotalPages = paginationStore.totalPages;
export const paginationPageRange = paginationStore.pageRange;

// Exporter aussi l'instance complète pour accéder aux méthodes
export const pagination = paginationStore;
