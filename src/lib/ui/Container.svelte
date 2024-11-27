{#if pile}
    {#if !fullscreen} 
        <p class="container-title drag-handle"
            data-path={path}
            ondblclick={() => {
                document.dispatchEvent(new CustomEvent("show_folder", { detail: {
                    folder_path: path
                }}))
            }}
        >
        {widget.name}    
    </p>
    <p>
        <button onclick={async () => {
            const folder_path = widget.path.replace(widget.name, "")
            await Update_widget(folder_path, widget.name, {type: "folder"})
            setTimeout(() => {
                document.dispatchEvent(new CustomEvent("show_folder", { detail: {
                    folder_path
                }}))
            }, 10)
        }}>Change to folder</button>
        <select bind:value={selected_view} onchange={async () => {
            pile = await Change_view(path, selected_view)

        }}>
            <!-- <option value="board">board</option> -->
            <option value="stack">stack</option>
            <option value="masonry">masonry</option>
            <option value="slides">slides</option>
        </select>
    </p>
    {/if}
    <section
        style="background: {pile.background || "#f5f5f5"};"
        class="container {pile.view}"
        class:fullscreen
        class:surface={pile.view === "board"}
        data-path={path}
        bind:this={container_element}
        ondblclick={onCreate}
    >
        {#each pile.widgets as widget, i(widget.path)}
            <Cell
                view={pile.view}
                {widget}
                selected_slide={i === pile.selected_widget_index}
                cutted={explorer?.buffer?.widget_name === widget.name}
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
</style>
<script>
import Cell from "$lib/ui/Cell.svelte"
let {fullscreen = false, path, explorer, widget} = $props()
let pile = $state()
let selected_view = $state()
let container_element = $state()

import { onMount } from "svelte"
import { Folder_pile } from '$lib/services/folder_pile'
import Sortable from 'sortablejs'
onMount(async () => {
    // console.log(Folder_pile(path))
    pile = await Folder_pile(path).read()
    selected_view = pile.view
    if_sortable()
})

import { Create_widget, Update_widget, Reorder_widgets, Move_widget, Change_view } from "$lib/services/widget"
async function onCreate(e) {
	if (e.target.classList.contains("surface")) {
		let type = "note"
        if (e.shiftKey) type = e.ctrlKey ? "container" : "folder"
		const position = {x: e.x, y: e.y}
		pile = await Create_widget(path, {type, position})
	}
}

document.addEventListener("update_pile", (e) => {
    if (e.detail.folder_path === path) pile = e.detail.pile
})
document.addEventListener("show_folder", async (e) => {
    if (fullscreen) {
        pile = await Folder_pile(e.detail.folder_path).read()
        path = e.detail.folder_path
        selected_view = pile.view
        explorer.show_folder(e.detail.folder_path)
        if_sortable()
    }
})


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