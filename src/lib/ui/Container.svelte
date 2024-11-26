{#if pile}
    {#if !fullscreen} 
        <p class="container-title drag-handle"
        ondblclick={() => {
            document.dispatchEvent(new CustomEvent("show_folder", { detail: {
                folder_path: path
            }}))
        }}
        >{path}</p>
    {/if}
    <section
        style="background: {pile.background || "#f5f5f5"};"
        class="container {pile.view}"
        class:fullscreen
        class:surface={pile.view === "board"}
        bind:this={container_element}
        onclickcapture={ondeselect}
        ondblclick={onCreate}
    >
        {#each pile.widgets as widget, i(widget.path)}
            <Cell
                view={pile.view}
                {widget}
                selected_slide={i === pile.selected_widget_index}
                selected_widget={selected_widget?.path === widget.path}
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
let {fullscreen = false, path, selected_widget, ondeselect, explorer} = $props()
let pile = $state()
let container_element = $state()

import { onMount } from "svelte"
import { Folder_pile } from '$lib/services/folder_pile'
import Sortable from 'sortablejs'
onMount(async () => {
    pile = await Folder_pile(path).read()
    if (["masonry","stack"].includes(pile.view)) {
        setTimeout(() => Sortable.create(container_element), 100)
    }
})

import { Create_widget } from "$lib/services/widget"
async function onCreate(e) {
	//@ts-ignore
	if (e.target.classList.contains("surface")) {
		const type = e.shiftKey ? "folder" : "note"
		const position = {x: e.x, y: e.y}
		pile = await Create_widget(path, {type, position})
	}
}

document.addEventListener("update_pile", (e) => {
    //@ts-ignore
    if (e.detail.folder_path === path) pile = e.detail.pile
})
document.addEventListener("show_folder", async (e) => {
    if (fullscreen) {
        //@ts-ignore
        pile = {...await Folder_pile(e.detail.folder_path).read()}
        //@ts-ignore
        explorer.show_folder(e.detail.folder_path)

        if (["masonry","stack"].includes(pile.view)) {
            setTimeout(() => Sortable.create(container_element), 100)
        }
    }
})

function make_sortable() {
    
}
</script>