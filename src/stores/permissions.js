import { derived } from 'svelte/store';
import { user } from './user.js';

// TODO 11: Créer un store dérivé pour les permissions
// Un store dérivé calcule sa valeur à partir d'autres stores
// Il se met à jour automatiquement quand le store source change
export const permissions = derived(
  // TODO: Premier paramètre - store(s) source
  // On utilise le store user comme source
  user,
  // TODO: Deuxième paramètre - fonction de transformation
  // Cette fonction reçoit la valeur du store user et retourne les permissions
  ($user) => {
    // On crée un objet permissions avec les droits par défaut
    const perms = {
      canEdit: false,
      canDelete: false,
      canManageUsers: false,
      maxUploadSize: 5 // MB
    };

    // TODO 12: Logique selon le rôle
    // Les droits changent en fonction du rôle de l'utilisateur
    // Si role === 'admin': tous les droits, 100MB upload
    // Si role === 'user': canEdit true, 10MB upload
    // Si role === 'guest': aucun droit, 5MB upload
    switch ($user.role) {
      case 'admin':
        perms.canEdit = true;
        perms.canDelete = true;
        perms.canManageUsers = true;
        perms.maxUploadSize = 100;
        break;
      case 'user':
        perms.canEdit = true;
        perms.maxUploadSize = 10;
        break;
      case 'guest':
        // Pas de droits supplémentaires pour les visiteurs
        perms.maxUploadSize = 5;
        break;
    }

    return perms;
  }
);

// TODO 13: Store dérivé pour le message de bienvenue
// On peut aussi passer plusieurs stores sources dans un tableau
export const welcomeMessage = derived(
  // HINT: Tableau si plusieurs stores sources
  [user],
  // La fonction reçoit un tableau avec les valeurs des stores
  ([$user]) => {
    // Retournez un message personnalisé
    // Si connecté: "Bienvenue, [name]!"
    // Sinon: "Bienvenue, visiteur"
    if ($user.isLoggedIn && $user.name) {
      return `Bienvenue, ${$user.name}!`;
    } else {
      return 'Bienvenue, visiteur';
    }
  }
);
