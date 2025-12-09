import { writable, get } from 'svelte/store';

const API_URL = 'https://jsonplaceholder.typicode.com';

function createPostsStore() {
  // TODO 21: Structure initiale
  // On définit l'état initial avec tous les champs nécessaires
  const initialState = {
    posts: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    // TODO 28: Ajoutez un Map pour le cache
    // MODIFICATION: On ajoute un Map pour sauvegarder les résultats précédents
    cache: new Map()
  };

  const { subscribe, set, update } = writable(initialState);

  // Stocke l'état actuel pour y accéder depuis les méthodes
  let currentState = initialState;
  subscribe(state => {
    currentState = state;
  });

  return {
    subscribe,

    // TODO 22: Méthode fetchPosts
    // Charge les articles depuis l'API avec pagination
    fetchPosts: async (page = 1, forceRefresh = false) => {
      // TODO 29: Vérifier le cache d'abord
      // MODIFICATION: On crée une clé pour identifier cette page dans le cache
      const cacheKey = `page_${page}`;

      if (!forceRefresh) {
        // TODO 29: Récupérer depuis state.cache
        // MODIFICATION: On cherche si cette page est en cache
        const cached = currentState.cache.get(cacheKey);

        if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
          // TODO 30: Utiliser les données cachées
          // MODIFICATION: Si moins de 5 minutes, on utilise le cache au lieu de l'API
          // Si moins de 5 minutes, utilisez le cache
          update(state => ({
            ...state,
            posts: cached.data,
            currentPage: page,
            loading: false
          }));
          return;
        }
      }

      // 1. Mettre loading à true, error à null
      // MODIFICATION: On indique qu'on charge et on efface les erreurs précédentes
      update(state => ({
        ...state,
        loading: true,
        error: null
      }));

      try {
        // TODO 23: Appel API
        // MODIFICATION: On appelle l'API avec pagination
        // URL: ${API_URL}/posts?_page=${page}&_limit=10
        const response = await fetch(`${API_URL}/posts?_page=${page}&_limit=10`);

        if (!response.ok) {
          throw new Error('Erreur de chargement');
        }

        const posts = await response.json();

        // TODO 24: Mettre à jour le store avec les posts
        // TODO 31: Après un fetch réussi, mettez en cache
        // MODIFICATION: On sauvegarde les posts en cache avec un timestamp
        // Structure: { data: posts, timestamp: Date.now() }
        update(state => {
          // Ajoutez au cache
          // MODIFICATION: On ajoute les posts au cache avec la date actuelle
          state.cache.set(cacheKey, {
            data: posts,
            timestamp: Date.now()
          });

          return {
            ...state,
            posts: posts,
            loading: false,
            currentPage: page,
            // totalPages: calculer depuis response headers
            // JSONPlaceholder retourne x-total-count en header
            totalPages: Math.ceil(parseInt(response.headers.get('x-total-count')) / 10)
          };
        });
      } catch (error) {
        // TODO 25: Gérer l'erreur
        // MODIFICATION: On arrête le chargement et on stocke l'erreur
        update(state => ({
          ...state,
          loading: false,
          error: error.message
        }));
      }
    },

    // TODO 26: Méthode deletePost
    // Supprime un article avec optimistic update
    deletePost: async (postId) => {
      // Sauvegarde l'état avant pour pouvoir revenir en arrière
      let previousPosts = [];

      // Optimistic update: enlever immédiatement
      // MODIFICATION: On enlève l'article tout de suite pour une meilleure UX
      update(state => {
        previousPosts = state.posts;
        return {
          ...state,
          posts: state.posts.filter(p => p.id !== postId)
        };
      });

      try {
        // Appel API DELETE
        const response = await fetch(`${API_URL}/posts/${postId}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          // Si erreur, rétablir (vous devez sauvegarder l'état avant)
          throw new Error('Erreur de suppression');
        }
      } catch (error) {
        // TODO 27: Rollback en cas d'erreur
        // MODIFICATION: On restaure les posts si la suppression a échoué
        // HINT: Il faut sauvegarder les posts avant la suppression
        update(state => ({
          ...state,
          posts: previousPosts,
          error: error.message
        }));
      }
    },

    // TODO 32: Méthode pour vider le cache
    // MODIFICATION: On supprime tous les résultats en cache
    clearCache: () => {
      update(state => ({
        ...state,
        cache: new Map()
      }));
    }
  };
}

// On exporte l'instance du store
export const posts = createPostsStore();
