{#if pile}
    {#if !fullscreen} 
        <p
            class="container-title drag-handle"
            data-path={folder_path}
            ondblclick={() => emit("Show_folder", {folder_path})}
        >
            {widget.name}
        </p>
    {/if}
    <section
        style="background: {pile.background || "#f5f5f5"};"
        class="container {pile.view}"
        class:fullscreen
        class:surface={["board","stack"].includes(pile.view)}
        data-path={folder_path}
        ondblclick={onCreate}
        bind:this={container_element}
    >
        {#each pile.widgets as widget, i(widget.path)}
            <Cell
                {widget}
                view={pile.view}
                selected_slide={i === pile.selected_widget_index}
            />
        {:else}
            <article>
                <p><span>Create note</span>&emsp;&ensp;Double click mouse</p>
                <p><span>Create folder</span>&emsp;Shift + double click mouse</p>
            </article>
        {/each}
    </section>
    {#if !fullscreen}
        <footer>
            <button onclick={async () => {
                const folder_path = widget.path.replace(widget.name, "")
                console.log("есть ли символ вконце?", folder_path)
                await Update_widget(folder_path, widget.name, {type: "folder"})
                emit("Show_folder", {folder_path})
                // или просто апдейт?
            }}>Change to folder</button>
            <select bind:value={selected_view} onchange={async () => {
                pile = await Change_view(path, selected_view)
            }}>
                <!-- <option value="board">board</option> -->
                <option value="stack">stack</option>
                <option value="masonry">masonry</option>
                <option value="slides">slides</option>
            </select>
        </footer>
    {/if}
{/if}

<style>
article {
    padding: 30px 40px;
}
article span {
    opacity: .5;
}

.container {
    width: 100%;
    height: 100%;
}
.container.fullscreen {
    height: 100vh;
}

.container.board {
    position: absolute;
}
.container.stack {
    padding: 20px;
    box-sizing: border-box;
    overflow: auto;
    outline-offset: -1px;
    outline: 1px solid #ccc;
}
.container.masonry {
    display: grid !important;
    grid-template-columns: repeat(4, minmax(auto, auto));
    grid-auto-rows: 17px;
    gap: 5px;
    padding: 10px;
    box-sizing: border-box;    
}

.container-title {
    background-color: #eee;
    margin: 0;
    padding: 20px;
    box-sizing: border-box;
    width: 100%;
    height: 60px;
    position: absolute;
    top: -60px;
}
footer {
    background-color: #eee;
    padding: 20px;
    box-sizing: border-box;
}
</style>
<script>
import Cell from "./Cell.svelte"
import { Folder_pile } from '$lib/services/folder_pile'
import { Create_widget, Update_widget, Reorder_widgets, Move_widget, Change_view } from "$lib/services/widget"

let { fullscreen = false, folder_path, widget } = $props()
let pile = $state()
$inspect(pile)
let selected_view = $state()
let container_element = $state()

// это при изменении корневого стейта патча, чтобы показывать обозреваемую папку
$effect(async () => {
    console.log("effect: ")
    pile = await load_container(folder_path)
    selected_view = pile.view
})
listen('Update_folder', ({payload}) => {
    if (payload.folder_path === folder_path) {
        pile = payload.pile
        console.log(`Update_folder:`, payload.folder_path)
    }
})

async function load_container(folder_path) {
    console.log("load_container: ", folder_path)
    return await Folder_pile(folder_path).read()
}

async function onCreate(e) { // может это в корень?
	if (e.target.classList.contains("surface")) {
		let type = "note"
        if (e.shiftKey) type = e.ctrlKey ? "container" : "folder"
		const position = {x: e.x, y: e.y}
		pile = await Create_widget(folder_path, {type, position})
	}
}


// effect: if pile.view === d => if_sortable()
import Sortable from 'sortablejs'
let started_drop_target = null
let finished_drop_target = null
let dropped_position = null
const seek_drop_target = e => {
    finished_drop_target = e.target.closest("section")
    dropped_position = {x: e.x, y: e.y}
}
function if_sortable() {
    if (["masonry","stack"].includes(pile.view)) {
        setTimeout(() => {
            new Sortable(container_element, {
                group: {name: 'shared'},
                onStart: e => {
                    started_drop_target = e.from
                    document.addEventListener("mousemove", seek_drop_target)
                },
                onEnd: async e => {
                    document.removeEventListener("mousemove", seek_drop_target)
                    if (started_drop_target === finished_drop_target) return
                    const from_folder_path = e.from.dataset.path
                    const widget_name = e.item.dataset.name
                    const to_folder_path = finished_drop_target.dataset.path
                    await Update_widget(from_folder_path, widget_name, {position: dropped_position})
                    const {from_pile, to_pile} = await Move_widget({
                        from_folder_path,
                        widget_name,
                        to_folder_path,
                    })
                    pile = from_pile
                    setTimeout(() => {
                        document.dispatchEvent(new CustomEvent("update_pile", { detail: {
                            folder_path: to_folder_path,
                            pile: to_pile
                        }}))
                    }, 100);
                },
                onUpdate: async e => pile = await Reorder_widgets(path, e.oldIndex, e.newIndex),
            })
        }, 100)
    }
}
</script>