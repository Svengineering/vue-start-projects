<script>
import TheWelcome from './components/TheWelcome.vue'

export default {
  name: 'App',
  components: {
    TheWelcome
  }
}
</script>

<template>
  <main>
    <h1>TodoMatic</h1>
    <TheWelcome />
    <h2 id="tasks-remaining">2 tasks remaining</h2>
    <ul role="list" aria-labelledby="tasks-remaining">
      <li>
        <div><input type="checkbox" /><label>Task 1</label></div>
        <div><button>Edit</button><button>Delete</button></div>
      </li>
      <li>
        <div><input type="checkbox" /><label>Task 2</label></div>
        <div><button>Edit</button><button>Delete</button></div>
      </li>
    </ul>
  </main>
</template>

<style scoped>
main  h1 {
  font-size: 2.5rem;
  text-align: center;
  font-weight: 600;
}

main h2 {
  font-weight:600;
  font-size:1.75rem;

}
</style>
