
<script>
import TheWelcome from './components/TheWelcome.vue'
import TodoItem from './components/TodoItem.vue'

export default {
  name: 'App',
  components: {
    TheWelcome,
    TodoItem
  },
  data () {
    return {
      tasks: [
        { id: 1, task: 'Eat', completed: false },
        { id: 2, task: 'Sleep', completed: true },
        { id: 3, task: 'Code', completed: false }
      ]
    }
  }
}
</script>


<template>
  <main>
    <h1>TodoMatic</h1>
    <TheWelcome />
    <h2 id="tasks-remaining">2 tasks remaining</h2>
    <ul role="list" aria-labelledby="tasks-remaining">
      <li v-for="task in tasks" :key="task.id">
        <TodoItem :id="task.id" :task="task.task" :completed="task.completed" />
      </li>
    </ul>
  </main>
</template>


<style scoped>

main {
  max-width:500px;
  margin:0 auto;
}

main  h1 {
  font-size: 2.5rem;
  text-align: center;
  font-weight: 600;
}

main h2 {
  font-weight:600;
  font-size:1.75rem;

}

main ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

</style>
