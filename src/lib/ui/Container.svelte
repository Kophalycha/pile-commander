{#if pile}
    {#if !fullscreen} 
        <p
            class="container-title"
            data-path={folder_path}
            ondblclick={() => emit("Show_folder", {folder_path})}
        >
            <span class="drag-handle">{widget.name}</span>
            -
            <select bind:value={selected_view} onchange={async () => {
                pile = await Change_view(folder_path, selected_view)
            }}>
                <option value="board">board</option>
                <option value="stack">stack</option>
                <option value="masonry">masonry</option>
                <option value="slides">slides</option>
            </select>

            {#if pile.view === "masonry"}
            - <input type="number" min="2" max="10" bind:value={pile_masonry_column} onchange={set_masonry_column}>
            {/if}
            {#if pile.view === "slides"}
            - <input type="number" min="0" max={pile.widgets.length - 1} bind:value={pile_selected_widget_index} onchange={set_selected_widget_index}>
            {/if}

            <button onclick={async () => {
                const folder_path = widget.path.replace(widget.name, "").slice(0, -1)
                const pile = await Update_widget(folder_path, widget.name, {type: "folder"})
                emit("Update_folder", {folder_path, pile})
            }}>Change to folder</button>
        </p>
    {/if}
    <section
        style="background: {pile.background || "#f5f5f5"}; grid-template-columns: repeat({pile_masonry_column}, minmax(auto, auto));"
        class="container {pile.view}"
        class:fullscreen
        class:surface={["board","stack"].includes(pile.view)}
        data-path={folder_path}
        bind:this={container_element}
    >
        {#each pile.widgets as widget, i(widget.path)}
            <Cell
                {widget}
                view={pile.view}
                selected_slide={i === pile_selected_widget_index}
            />
        {:else}
            <article>
                <p><span>Create note</span>&emsp;&ensp;Double click mouse</p>
                <p><span>Create folder</span>&emsp;Shift + double click mouse</p>
            </article>
        {/each}
    </section>
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
    overflow: auto;
    outline-offset: -1px;
    outline: 1px solid #ccc;
    padding: 20px;
    box-sizing: border-box;
}
.container.fullscreen {
    height: 100vh;
}

.container.board {
    position: absolute;
}
/* .container.stack {
} */
.container.masonry {
    display: grid !important;
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
</style>
<script>
import Cell from "./Cell.svelte"
import { Folder_pile } from '$lib/services/folder_pile'
import { Update_widget, Reorder_widgets, Move_widget, Change_view, Set_folder_option } from "$lib/services/widget"

let { fullscreen = false, folder_path, widget } = $props()
let pile = $state()
$inspect(pile)
let selected_view = $state()
let pile_masonry_column = $state()
let pile_selected_widget_index = $state()
let container_element = $state()

$effect(async () => {
    console.log("effect: ")
    pile = await load_container(folder_path)
    selected_view = pile.view
    pile_masonry_column = pile.masonry_column || 3
    pile_selected_widget_index = pile.selected_widget_index || 0
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
function set_masonry_column() {
    Set_folder_option(folder_path, {masonry_column: pile_masonry_column})
}
function set_selected_widget_index() {
    Set_folder_option(folder_path, {selected_widget_index: pile_selected_widget_index})
}

$effect(() => {
    if (container_element && ["stack","masonry"].includes(pile.view)) {
        console.log("sort!")
        make_sortable()
    }
})

import Sortable from 'sortablejs'
let started_drop_target = null
let finished_drop_target = null
let dropped_position = null
const seek_drop_target = e => {
    finished_drop_target = e.target.closest("section")
    dropped_position = {x: e.x, y: e.y}
}
function make_sortable() {
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
            emit("Update_folder", {folder_path: to_folder_path, pile: to_pile})
        },
        onUpdate: async e => pile = await Reorder_widgets(folder_path, e.oldIndex, e.newIndex),
    })
}
</script>