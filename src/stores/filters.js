import { writable, derived } from 'svelte/store';
import { posts } from './posts.js';

// TODO 33: Store pour la recherche
// MODIFICATION: On crée un store pour la valeur de recherche tapée par l'utilisateur
export const searchQuery = writable('');

// TODO 34: Store pour le tri
// MODIFICATION: On crée des stores pour contrôler comment trier les posts
export const sortBy = writable('id'); // 'id', 'title', 'body'
export const sortOrder = writable('asc'); // 'asc', 'desc'

// TODO 35: Store dérivé pour les posts filtrés
// MODIFICATION: Ce store dépend de posts et searchQuery
// Il recalcule automatiquement quand l'un des deux change
export const filteredPosts = derived(
  [posts, searchQuery],
  ([$posts, $searchQuery]) => {
    // Si pas de recherche, retourner tous les posts
    if (!$searchQuery) {
      return $posts.posts;
    }

    // TODO 36: Filtrer par titre ou contenu
    // MODIFICATION: On cherche la requête dans le titre ou le body du post
    // HINT: toLowerCase() pour la comparaison
    return $posts.posts.filter(post => {
      const query = $searchQuery.toLowerCase();
      // On vérifie si la recherche est dans le titre OU dans le body
      return (
        post.title.toLowerCase().includes(query) ||
        post.body.toLowerCase().includes(query)
      );
    });
  }
);

// TODO 37: Store dérivé pour posts filtrés ET triés
// MODIFICATION: Ce store dépend de filteredPosts, sortBy et sortOrder
// Il applique le tri après le filtrage
export const sortedAndFilteredPosts = derived(
  [filteredPosts, sortBy, sortOrder],
  ([$filteredPosts, $sortBy, $sortOrder]) => {
    // Copier le tableau pour ne pas muter
    const sorted = [...$filteredPosts];

    // TODO 38: Implémenter le tri
    // MODIFICATION: On trie selon le champ choisi
    sorted.sort((a, b) => {
      let comparison = 0;

      // Comparer selon sortBy
      if ($sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if ($sortBy === 'id') {
        // MODIFICATION: Comparer les ids numériquement
        comparison = a.id - b.id;
      } else if ($sortBy === 'body') {
        // MODIFICATION: Comparer les longueurs des bodies
        comparison = a.body.length - b.body.length;
      }

      // Inverser si desc
      return $sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }
);

// TODO 39: Store dérivé pour les statistiques
// MODIFICATION: Ce store calcule des infos sur les posts
export const postsStats = derived(
  posts,
  $posts => {
    // Si pas de posts, retourner des valeurs par défaut
    if ($posts.posts.length === 0) {
      return {
        total: 0,
        avgLength: 0,
        shortestTitle: '',
        longestTitle: ''
      };
    }

    // MODIFICATION: Calculer les statistiques
    const postsList = $posts.posts;
    
    // Moyenne de la longueur des bodies
    const totalLength = postsList.reduce((sum, p) => sum + p.body.length, 0);
    const avgLength = Math.round(totalLength / postsList.length);

    // Titre le plus court
    const shortestTitle = postsList.reduce((shortest, p) =>
      p.title.length < shortest.length ? p : shortest
    ).title;

    // Titre le plus long
    const longestTitle = postsList.reduce((longest, p) =>
      p.title.length > longest.length ? p : longest
    ).title;

    return {
      total: postsList.length,
      avgLength,
      shortestTitle,
      longestTitle
    };
  }
);
