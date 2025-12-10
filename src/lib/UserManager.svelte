<script>
  // Import des stores
  import { user } from '../stores/user.js';
  import { notifications } from '../stores/notifications.js';
  import { welcomeMessage } from '../stores/permissions.js';

  // Variables locales pour le formulaire
  let email = '';
  let password = '';
  let newRole = 'user';
</script>

<!-- Affiche l'état actuel de l'utilisateur -->
<div class="user-card">
  <h2>Gestion Utilisateur</h2>

  <!-- Si l'utilisateur est connecté -->
  {#if $user.id}
    <div class="welcome-message">
      <p>{$welcomeMessage}</p>
    </div>

    <div class="user-info">
      <p><strong>ID:</strong> {$user.id}</p>
      <p><strong>Email:</strong> {$user.email}</p>
      <p><strong>Rôle:</strong> {$user.role}</p>
    </div>

    <!-- Formulaire pour modifier le profil -->
    <div class="form-group">
      <h3>Modifier le profil</h3>
      <input
        type="email"
        placeholder="Nouveau email"
        bind:value={email}
      />
      <select bind:value={newRole}>
        <option value="guest">Guest</option>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button
        on:click={() => {
          user.updateProfile({ email, role: newRole });
          notifications.success('Profil mis à jour');
        }}
      >
        Mettre à jour
      </button>
    </div>

    <!-- Bouton de déconnexion -->
    <button
      class="logout"
      on:click={() => {
        user.logout();
        notifications.info('Vous êtes déconnecté');
      }}
    >
      Déconnexion
    </button>
  {:else}
    <!-- Si pas connecté, afficher le formulaire de connexion -->
    <div class="form-group">
      <h3>Connexion</h3>
      <input
        type="email"
        placeholder="Email"
        bind:value={email}
      />
      <input
        type="password"
        placeholder="Mot de passe"
        bind:value={password}
      />
      <select bind:value={newRole}>
        <option value="guest">Guest</option>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button
        on:click={() => {
          user.login(email, password, newRole);
          notifications.success('Connexion réussie');
        }}
      >
        Connexion
      </button>
    </div>
  {/if}
</div>

<style>
  .user-card {
    padding: 1.5rem;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    max-width: 420px;
  }

  .user-card h2 {
    margin: 0 0 1.5rem;
    font-size: 1.25rem;
    color: #1f2937;
  }

  .welcome-message {
    padding: 1rem;
    background: #dbeafe;
    border-left: 4px solid #0ea5e9;
    margin-bottom: 1.5rem;
    border-radius: 0.375rem;
  }

  .welcome-message p {
    margin: 0;
    color: #0369a1;
    font-weight: 500;
  }

  .user-info {
    background: #f9fafb;
    padding: 1rem;
    margin: 1rem 0;
  }

  .user-info p {
    margin: 0.5rem 0;
    font-size: 0.9rem;
    color: #4b5563;
  }

  .form-group {
    margin: 1rem 0;
  }

  .form-group h3 {
    margin: 0 0 0.75rem;
    font-size: 0.95rem;
    color: #374151;
  }

  input, select {
    width: 100%;
    padding: 0.5rem 0.75rem;
    margin: 0.4rem 0;
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
    font-size: 0.9rem;
  }

  input:focus, select:focus {
    outline: none;
    border-color: #4b5563;
  }

  button {
    width: 100%;
    padding: 0.5rem 0.75rem;
    margin: 0.4rem 0;
    border: none;
    border-radius: 0.25rem;
    background: #4b5563;
    color: white;
    cursor: pointer;
    font-size: 0.9rem;
  }

  button:hover {
    background: #3a4049;
  }

  button.logout {
    background: #ef4444;
  }
</style>
