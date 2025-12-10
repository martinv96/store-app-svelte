import { writable } from 'svelte/store';

// TODO 1: Définir l'utilisateur initial
const initialUser = {
  id: null,
  name: '',
  email: '',
  role: 'guest',
  isLoggedIn: false
};

// TODO 7: Fonction helper pour localStorage
function saveToStorage(userData) {
  // Sauvegarde l'utilisateur dans le navigateur de manière persistante
  localStorage.setItem('svelte_user', JSON.stringify(userData));
}

// TODO 7: Fonction helper pour charger depuis localStorage
function loadFromStorage() {
  // Récupère l'utilisateur sauvegardé, sinon retourne l'état initial
  try {
    const stored = localStorage.getItem('svelte_user');
    return stored ? JSON.parse(stored) : initialUser;
  } catch (error) {
    return initialUser;
  }
}

// TODO 2: Créer la fonction createUserStore
function createUserStore() {
  // TODO 8: Chargez les données initiales depuis localStorage
  const startValue = loadFromStorage();
  const { subscribe, set, update } = writable(startValue);

  return {
    subscribe,

    // TODO 3: Méthode login
    login: (email, password, role = 'user') => {
      // Actions:
      // - Générer un id aléatoire
      // - Définir le role
      // - Mettre isLoggedIn à true
      const userData = {
        id: Math.random().toString(36).substring(2, 9),
        name: email ? email.split('@')[0] : 'Utilisateur',
        email,
        password,
        role,
        isLoggedIn: true
      };
      set(userData);
      // TODO 9: Ajoutez la sauvegarde
      saveToStorage(userData);
    },

    // TODO 4: Méthode logout
    logout: () => {
      // Actions: Réinitialiser avec initialUser
      set(initialUser);
      // TODO 10: Nettoyez localStorage
      localStorage.removeItem('svelte_user');
    },

    // TODO 5: Méthode updateProfile
    updateProfile: (updates) => {
      // Paramètre: updates (object partiel)
      // Action: Fusionner updates avec l'état actuel
      update(currentUser => {
        const newState = { ...currentUser, ...updates };
        saveToStorage(newState);
        return newState;
      });
    }
  };
}

// TODO 6: Exporter l'instance du store
export const user = createUserStore();
