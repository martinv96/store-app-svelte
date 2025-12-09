import { writable } from 'svelte/store';

function createNotificationStore() {
  // TODO 14: État initial - tableau vide
  // On crée un store writable qui contient un tableau de notifications
  const { subscribe, update } = writable([]);

  let nextId = 1;

  // TODO 18: Méthode remove
  // Supprime une notification du tableau par son id
  // MODIFICATION: On filtre le tableau pour enlever la notification
  const remove = (id) => {
    update(notifications => {
      // Filtrez pour enlever la notification avec cet id
      return notifications.filter(n => n.id !== id);
    });
  };

  // TODO 15: Méthode add
  // Paramètres: message, type ('info'|'success'|'error'), duration (ms)
  // Ajoute une notification qui disparaît automatiquement après duration
  const add = (message, type = 'info', duration = 5000) => {
    // TODO: Créez l'objet avec id, message, type, timestamp
    // HINT: new Date().toISOString() pour timestamp
    const notification = {
      id: nextId++,
      message,
      type,
      timestamp: new Date().toISOString()
    };

    // TODO 16: Ajoutez au tableau
    // MODIFICATION: On ajoute la notification à la fin du tableau
    // HINT: Utilisez spread pour ajouter à la fin
    update(notifications => {
      return [...notifications, notification];
    });

    // TODO 17: Auto-dismiss après duration
    // MODIFICATION: Si duration > 0, on supprime la notification automatiquement
    if (duration > 0) {
      setTimeout(() => {
        // Appelez remove avec l'id
        remove(notification.id);
      }, duration);
    }

    return notification.id;
  };

  // TODO 19: Méthodes helpers
  // Raccourcis pour ajouter des notifications avec un type prédéfini

  // Ajoute une notification de succès (disparaît après 5 secondes)
  // MODIFICATION: Appelle add avec type 'success'
  const success = (message) => {
    return add(message, 'success', 5000);
  };

  // Ajoute une notification d'erreur (disparaît après 10 secondes)
  // MODIFICATION: Appelle add avec type 'error' et duration 10000
  const error = (message) => {
    return add(message, 'error', 10000);
  };

  // Ajoute une notification info (disparaît après 5 secondes)
  const info = (message) => {
    return add(message, 'info', 5000);
  };

  // TODO 20: Méthode clear
  // Supprime toutes les notifications
  // MODIFICATION: Réinitialise à tableau vide
  const clear = () => {
    update(() => []);
  };

  return {
    subscribe,
    add,
    remove,
    success,
    error,
    info,
    clear
  };
}

// On exporte l'instance du store
export const notifications = createNotificationStore();
