<script lang="ts">
  import Header from './Header.svelte';
  import './styles.css';
</script>

<div class="app">
  <Header />

  <main>
    <slot />
  </main>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
  }

  main {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    padding: 1rem;
    width: 100%;
  }
</style>
