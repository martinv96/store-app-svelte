<script>
  // Import des stores de notifications
  import { notifications } from '../stores/notifications.js';
</script>

<!-- Affiche toutes les notifications actives -->
<div class="notifications-container">
  {#each $notifications as notification (notification.id)}
    <!-- Chaque notification a un style différent selon son type -->
    <div class="notification {notification.type}">
      <div class="content">
        <strong>{notification.type.toUpperCase()}</strong>
        <p>{notification.message}</p>
      </div>
      <!-- Bouton pour fermer manuellement -->
      <button
        class="close"
        on:click={() => notifications.remove(notification.id)}
      >
        ✕
      </button>
    </div>
  {/each}
</div>

<style>
  .notifications-container {
    position: fixed;
    top: 1.25rem;
    right: 1.25rem;
    z-index: 9999;
    max-width: 360px;
  }

  .notification {
    display: flex;
    gap: 0.75rem;
    padding: 1rem;
    margin: 0.75rem 0;
    background: white;
    border-left: 3px solid #4b5563;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .content p {
    margin: 0;
    font-size: 0.9rem;
    color: #4b5563;
  }

  .notification.success {
    border-left-color: #10b981;
  }

  .notification.error {
    border-left-color: #ef4444;
  }

  .notification.info {
    border-left-color: #3b82f6;
  }

  .close {
    background: none;
    border: none;
    cursor: pointer;
    color: #9ca3af;
    padding: 0;
  }
</style>
