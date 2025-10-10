
<script>
import TodoItem from './components/TodoItem.vue'
import NewTodo from './components/NewTodo.vue'

const filters = { 
  "all": (task) => true, 
  "active": (task) => !task.completed,
  "completed": (task) => task.completed
};

export default {
  name: 'App',
  components: {
    NewTodo,
    TodoItem
  },
  data () {
    return {
      tasks: [
        { id: 1, task: 'Take a walk', completed: true },
        { id: 2, task: 'Project planning', completed: true },
        { id: 3, task: 'Code / Developing', completed: false },
        { id: 4, task: 'Cooking for dinner', completed: false },
      ],
      filter: 'all'  // all, active, completed
    }
  },
  methods: {
    add_task(newTask) {
      if (newTask.trim() === '') { 
        return;
      }
      let max_id = 0;
      this.tasks.forEach(task => { if (task.id > max_id) max_id = task.id; });
      this.tasks.push({ id: max_id + 1, task: newTask, completed: false });
      this.filter = 'all';
    }
  },
  computed: {
    remaining_tasks() {
      return this.tasks.filter(task => !task.completed).length;
    },
    displayed_tasks() {
      return this.tasks.filter(filters[this.filter]);
    }
  }
}
</script>


<template>
  <main>
    <h1>TodoMatic</h1>
    <NewTodo @create:task="add_task"/>
    <h2 id="tasks-remaining">{{ remaining_tasks > 1 ? `${remaining_tasks} tasks remaining` : ( remaining_tasks ? 'only one task remaining' : 'everything done!' ) }}</h2>
    <div class="filter">
        <button class="all" :class="{ filtered: filter === 'all' }" @click="filter = 'all'">All</button>
        <button class="active" :class="{ filtered: filter === 'active' }" @click="filter = 'active'">Active</button>
        <button class="completed" :class="{ filtered: filter === 'completed' }" @click="filter = 'completed'">Completed</button>
    </div>
    <ul role="list" aria-labelledby="tasks-remaining">
      <li v-for="task in displayed_tasks" :key="task.id">
        <TodoItem 
          :id="task.id" 
          :task="task.task" 
          :completed="task.completed" 
          @update:completed="(completed) => task.completed = completed" 
          @delete:task="(id) => this.tasks = this.tasks.filter(task => task.id !== id)"
          @update:task="({ id, task }) => {
            for(const t of this.tasks) {
              if(t.id === id) {
                t.task = task;
                break;
              }
            }
          }" />
      </li>
    </ul>
  </main>
  <!--<footer>{{  JSON.stringify(tasks) }}</footer>-->
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

main .filter {
  display:grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-top:0.5rem;
  margin-bottom:2rem;
}

main .filter button {
    padding: 0.5rem;
    border-radius: 0px;
    cursor: pointer;
    font-size: 1.1rem;
    line-height:1.15;
    border-style:solid;
    border-color:var(--vt-c-divider-dark-2);
    color:var(--vt-c-text-light-1);
    background-color:var(--vt-c-white);
}

main .filter button.filtered {
  border-color:var(--vt-c-black-mute);
  color:var(--color-text);
}

footer {
  margin-top:20rem;
}

</style>
