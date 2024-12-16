<section>
    <p>{selected_widget.name}</p>
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
    <br>
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
</section>
<style>
section {
    position: fixed;
    bottom: 100px;
    right: 30px;
    z-index: 9999;
    width: 300px;
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
    grid-template-columns: repeat(7, auto);
    gap: 10px;
}
.colors-board > button {
    width: 30px;
    height: 30px;
}
</style>

<script>
import { Update_widget } from "$lib/services/widget"

let {folder_path, selected_widget, onRename, onRemove} = $props()
let color_picker = $state()
let selected_color = $state(selected_widget.background || "black")

async function change_background(color) {
    const pile = await Update_widget(folder_path, selected_widget.name, {background: color})
    emit("Update_folder", {folder_path, pile})
}

const colors = ["AliceBlue", "Azure", "Beige", "Bisque", "BlanchedAlmond", "Cornsilk", "FloralWhite",
    "GhostWhite", "Gainsboro", "HoneyDew", "Ivory", "Khaki", "LavenderBlush", "LightBlue",
    "#F1F1EF", "#F4EEEE", "#FBECDD", "#FBF3DB", "#EDF3EC", "#E7F3F8", "#F6F3F9", "#FAF1F5", "#FDEBEC"
]
</script>