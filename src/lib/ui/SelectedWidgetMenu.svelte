<section>
    <p>{widget.name}</p>
    <div> 
        <button onclick={onRename}>
            Rename
            <kbd>F2</kbd>
        </button>
        <button onclick={onRemove}>
            Remove
            <kbd>Del</kbd>
        </button>
    </div>
    {#if widget.type === "folder"}
        <hr>
        <button onclick={async () => {
            const folder_path = widget.path.replace(widget.name, "").slice(0, -1)
            const pile = await Update_widget(folder_path, widget.name, {type: "container"})
            emit("Update_folder", {folder_path, pile})
        }}>Change to container</button>
    {/if}
    {#if widget.type === "container"}
        <hr>
        <button onclick={async () => {
            const folder_path = widget.path.replace(widget.name, "").slice(0, -1)
            const pile = await Update_widget(folder_path, widget.name, {type: "folder"})
            emit("Update_folder", {folder_path, pile})
        }}>Change to folder</button>
        {#if pile}
            <hr>
            View type: 
            <select bind:value={selected_view} onchange={async () => {
                pile = await Change_view(widget.path, selected_view)
                emit("Update_folder", {folder_path: widget.path, pile})
            }}>
                <option value="board">board</option>
                <option value="stack">stack</option>
                <option value="masonry">masonry</option>
                <option value="slides">slides</option>
            </select>
            {#if pile.view === "masonry"}
            <p>Columns: <input type="number" min="2" max="10" bind:value={pile_masonry_column} onchange={set_masonry_column}></p>
            {/if}
            {#if pile.view === "slides"}
            <p>Selected widget: <input type="number" min="1" max={pile.widgets.length} bind:value={pile_selected_widget_index} onchange={set_selected_widget_index}></p>
            {/if}
        {/if}
    {/if}
    {#if widget.type !== "container"}
        <hr>
        <p>Background:</p>
        <div>
            <button onclick={() => change_background("none")}>None</button>
            <button onclick={() => change_background("white")}>White</button>
            <br><br>
            {#snippet color_ficker(color)}
                <button style="background-color: {color};" onclick={() => change_background(color)}></button>
            {/snippet}
            <span class="colors-board">
                {#each colors as color}
                    {@render color_ficker(color)}
                {/each}
            </span>
        </div>
    {/if}
</section>
<style>
section {
    position: fixed;
    bottom: 100px;
    right: 30px;
    z-index: 9999;
    width: 250px;
    padding: 20px;
    background-color: #fff;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}
div > button:not(:last-child) {
    margin-right: 10px;
}
hr {
    border-top: 1px solid #eee;
    border-bottom: none;
}

.colors-board {
    display: grid;
    grid-template-columns: repeat(6, auto);
    gap: 10px;
}
.colors-board > button {
    width: 30px;
    height: 30px;
}
</style>

<script>
import { Update_widget, Change_view, Set_folder_option } from "$lib/services/widget"
import { Folder_pile } from '$lib/services/folder_pile'

let {folder_path, widget, onRename, onRemove} = $props()
let color_picker = $state()
let selected_color = $state(widget.background || "black")

let pile = $state()
let selected_view = $state()
let pile_masonry_column = $state()
let pile_selected_widget_index = $state()
$effect(async () => {
    if (!["folder", "container"].includes(widget.type)) return
    pile = await Folder_pile(widget.path).read()
    selected_view = pile.view
    pile_masonry_column = pile.masonry_column || 3
    pile_selected_widget_index = pile.selected_widget_index || 0
})
async function set_masonry_column() {
    pile = await Set_folder_option(widget.path, {masonry_column: pile_masonry_column})
    emit("Update_folder", {folder_path: widget.path, pile})
}
async function set_selected_widget_index() {
    pile = await Set_folder_option(widget.path, {selected_widget_index: pile_selected_widget_index})
    emit("Update_folder", {folder_path: widget.path, pile})
}

async function change_background(color) {
    const pile = await Update_widget(folder_path, widget.name, {background: color})
    emit("Update_folder", {folder_path, pile})
}

const colors = ["AliceBlue", "Azure", "Beige", "Bisque", "BlanchedAlmond", "Cornsilk", "FloralWhite",
    "GhostWhite", "Gainsboro", "HoneyDew", "Ivory", "Khaki", "LavenderBlush", "LightBlue",
    "#F1F1EF", "#F4EEEE", "#FBECDD", "#FBF3DB", "#EDF3EC", "#E7F3F8", "#F6F3F9", "#FAF1F5", "#FDEBEC", "plum"
]
</script>