
<script>export default {
    data () {
        return {
            newTask: ''
        }
    },
    emits: ['create:task'],
    methods: {
        doStuff() {
            this.$emit('create:task',this.newTask);
            this.newTask = '';
        }
    }
}
</script>



<template>
<div class="new-todo">
    <h2>What needs to be done?</h2>
    <input type="text" placeholder="..." v-model="newTask"  @keydown.enter="doStuff()" />
    <button @click="doStuff($event)">Add</button>
</div>
</template>



<style scoped>
input[type="text"] {
    display:block;
    width:100%;
    appearance: none;
    -webkit-appearance: none;
    border: 2px solid var(--vt-c-black-mute);
    color:var(--color-text);
    padding:1rem;
    font-size:1.1rem;
    line-height:1.15;
    margin-bottom:0.5rem;
}

button {
    padding: 0.5rem;
    border-radius: 0px;
    cursor: pointer;
    font-size: 1.1rem;
    line-height:1.15;
    border-style:solid;
    border-color:var(--vt-c-black-mute);
    color:var(--vt-c-text-dark-1);
    background-color:var(--vt-c-black-mute);
    width:100%;
    display:block;
}

.new-todo {
    margin: 2rem 0 3rem;
}

h2 {
  font-weight:600;
  font-size:1.75rem;
}

</style>