

<script>

export default {
    props: {
        id: {
            type: Number,
            required: true
        },
        task: {
            type: String,
            required: true
        },
        completed: {
            type: Boolean,
            default: false
        }
    },
    emits: ['update:completed', 'delete:task', 'update:task'],
    methods: {
        doStuff($event) {
            const completed = $event.target.checked;
            this.$emit('update:completed', completed);
        },
        save_task({id, task}) {
            this.$emit('update:task', { id, task });
            this.is_edit_mode = false;
        }
    },
    data() {
        return {
            is_edit_mode: false,
            edit_task: this.task
        };
    }
}

</script>

<template>
    <div v-if="!is_edit_mode" :id="`todo-item-${id}`" class="todo-item">
        <div>
            <input :id="id" type="checkbox" :checked="completed" @click="doStuff($event)"/>
            <label :for="id">{{ task }} </label>
        </div>
        <div class="button-grp">
            <button class="button button-edit" @click="is_edit_mode = true">Edit</button>
            <button class="button button-delete" @click="$emit('delete:task', id)">Delete</button>
        </div>
    </div>
    <div v-else class="todo-item">
        <p class="edit-desc">Modify task "{{ task }}"</p>
        <input type="text" v-model="edit_task" />
        <div class="button-grp">
            <button class="button button-cancel" @click="is_edit_mode = false">Cancel</button>
            <button class="button button-save" @click="save_task({ id, task: edit_task })">Save</button>
        </div>
    </div>
</template>

<style scoped>

.todo-item {
    margin:2rem 0;
}

.todo-item:first-child {
    margin-top:1rem;
}

.button-grp {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    margin-top:0.5rem;
}

.button {
    padding: 0.5rem;
    border-radius: 0px;
    cursor: pointer;
    font-size: 1.1rem;
    line-height:1.15;
    border-style:solid;
    border-color:var(--vt-c-black-mute);
    color:var(--color-text);
}

.button-edit, .button-cancel {
    background-color:var(--vt-c-white);
}

.button-delete, .button-save {
    color: var(--vt-c-white);
}

.button-delete {
    background-color: hsla(160, 100%, 27%, 1);
    border-color: hsla(160, 100%, 27%, 1);
}

.button-save {
    background-color: var(--vt-c-black-mute);
    border-color: var(--vt-c-black-mute);
}

input[type="checkbox"] {
    width: 36px;
    height: 36px;
    cursor: pointer;
    margin: 0 0.5rem 0 0;
    vertical-align: middle;
    background-color: var(--vt-c-white);
    appearance: none;
    -webkit-appearance: none;
    border: 2px solid var(--vt-c-black-mute);
    position:relative;
    top:-0.1rem;
}

input[type="checkbox"]::before {
    content: "";
    border-width:0 0 4px 4px;
    border-style:solid;
    border-color:var(--vt-c-black-mute);
    transform:rotate(-45deg) scale(0);
    position:absolute;
    width:22px;
    height:11px;
    top:8px;
    left:5px;
    transition: transform 0.1s ease-in-out;
}

input[type="checkbox"]:checked::before {
    transform:rotate(-45deg) scale(1);
}

input[type="text"] {
    display:block;
    width:100%;
    appearance: none;
    -webkit-appearance: none;
    border: 2px solid var(--vt-c-black-mute);
    color:var(--color-text);
    padding:0.5rem;
    font-size:1.1rem;
    line-height:1.15;
    margin-bottom:0.5rem;
}

label {
    font-size:1.1rem;
    line-height:1.15;
    padding-left:0.5rem;
}

.edit-desc {
    padding-top:0.22rem; /*align text with label in non-edit mode */
    margin-bottom:0.5rem;
    font-size:1.1rem;
    line-height:1.15;
}

</style>