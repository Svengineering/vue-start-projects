

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
    }
}

</script>

<template>
    <div :id="`todo-item-${id}`" class="todo-item">
        <div>
            <input :id="id" type="checkbox" :checked="completed" />
            <label :for="id">{{ task }} </label>
        </div>
        <div class="button-grp">
            <button class="button-edit">Edit</button>
            <button class="button-delete">Delete</button>
        </div>
    </div>
</template>

<style scoped>

.todo-item {
    margin:2rem 0;
}

.button-grp {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    margin-top:0.5rem;
}

.button-edit, .button-delete {
    padding: 0.5rem;
    border-radius: 0px;
    cursor: pointer;
    font-size: 1.1rem;
    line-height:1.15;
    border-style:solid;
    border-color:var(--vt-c-black-mute);
    color:var(--color-text);
}

.button-edit {
    background-color:var(--vt-c-white);
}

.button-delete {
    background-color: hsla(160, 100%, 27%, 1);
    border-color: hsla(160, 100%, 27%, 1);
    color: var(--vt-c-white);
}

input[type="checkbox"] {
    width: 36px;
    height: 36px;
    cursor: pointer;
    margin: 0 0.5rem 0 0;
    vertical-align: middle;
    background-color:transparent;
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

label {
    font-size:1.1rem;
    line-height:1.15;
    padding-left:0.5rem;
}

</style>