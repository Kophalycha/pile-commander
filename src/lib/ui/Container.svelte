{#if pile}
    {#if !fullscreen} 
        <p
            class="container-title drag-handle"
            data-path={folder_path}
            ondblclick={() => emit("Show_folder", {folder_path})}
            style="background-color: {widget.background || "white"};"
        >
            <span class="">{widget.name}</span>
        </p>
    {/if}
    <section
        style="background: {pile.background ? pile.background === "none" ? "#f5f5f5" : pile.background : "#f5f5f5"}; grid-template-columns: repeat({pile_masonry_column}, minmax(auto, auto));"
        class="container {pile.view}"
        class:fullscreen
        class:surface={["board","stack"].includes(pile.view)}
        data-path={folder_path}
        bind:this={container_element}
    >
        {#each pile.widgets as widget, i(widget.path)}
            {#if widget.type === "line"}
                <Line {widget} />
            {:else}
                <Cell
                    {widget}
                    view={pile.view}
                    selected_slide={i === pile_selected_widget_index - 1}
                />
            {/if}
        {:else}
            <article>
                <p><span>Create text</span>&emsp;&ensp;Double click mouse</p>
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
    outline: 1px solid rgba(0, 0, 0, 0.15);
    padding: 20px;
    box-sizing: border-box;
}
.container.fullscreen {
    height: 100vh;
}

.container.board {
    position: absolute;
}
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
import Line from "$lib/ui/widgets/Line.svelte"
import { Folder_pile } from '$lib/services/folder_pile'
import { Update_widget, Reorder_widgets, Move_widget } from "$lib/services/widget"

let { fullscreen = false, folder_path, widget } = $props()
let pile = $state()
let pile_masonry_column = $state()
let pile_selected_widget_index = $state()
let container_element = $state()

$effect(async () => {
    pile = await Folder_pile(folder_path).read()
    pile_masonry_column = pile.masonry_column || 3
    pile_selected_widget_index = pile.selected_widget_index || 0
})

import { onDestroy, onMount } from "svelte"
let l1
onMount(async () => {
    l1 = await listen('Update_folder', ({payload}) => {
        if (payload.folder_path === folder_path) {
            pile = payload.pile
            pile_masonry_column = pile.masonry_column || 3
            pile_selected_widget_index = pile.selected_widget_index || 0
            console.log(`Update_folder:`, payload.folder_path)
        }
    })
})
onDestroy(() => l1())

$effect(() => {
    if (container_element && ["stack","masonry"].includes(pile.view)) {
        console.log("sort!")
        make_sortable()
    }
})
$effect(() => {
    if (container_element) {
        container_element.addEventListener('scroll', e => {
	        if (document.querySelector(".line")) emit("Update_line_position")
        })
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