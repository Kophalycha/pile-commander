<section
    id="surface"
    onclick={() => folder_explorer.deselect_widget()}
    ondblclick={(e) => {
        //@ts-ignore
        if (e.target.id && e.target.id === "surface") {
            e.shiftKey ?
                onCreate()
                : Create_note({x: e.x, y: e.y})
        }
    }}
>

    {#each folder_explorer.selected_folder_config?.widgets as widget(widget.name)}
        {#if widget.type === "folder"}
            <Folder {widget} />
        {:else if widget.type === "note"}
            <Note {widget} />
        {/if}
    {:else}
        <article>
            <p><span>Create note</span>&emsp;&ensp;Double click mouse</p>
            <p><span>Create folder</span>&emsp;Shift + double click mouse</p>
        </article>
    {/each}
<Breadcrumbs breadcrumbs={folder_explorer.breadcrumbs} />
</section>

<!-- <hr>
Context menu
<button onclick={onCreate}>Create folder</button>
{#if folder_explorer.selected_widget}
    {folder_explorer.selected_widget} 
    <button onclick={onRename}>Rename folder</button>
    <button onclick={onRemove}>Remove folder</button>
{/if} -->

<style>
section {
    position: relative;
    background: #f5f5f5;
    width: 100%;
    height: 100vh;
    user-select: none;
}
article {
    padding: 30px 40px;
}
article span {
    opacity: .5;
}
:global(.drop-target) {
    outline: 5px solid yellowgreen;
}
:global(.widget.can-drop) {
    outline: 5px solid orange;
    z-index: 999;
}
:global(.drop-active) {
    opacity: .6;
    z-index: 0;
}
:global(.drop-target) {
    opacity: .6;
    transition: 0.2s;
    transition-property: scale;
    transform: scale(1.2);
}
:global(.can-drop) {
    z-index: 999;
}
</style>
<script lang="ts">
import { StartUp } from "$lib/services"
import { folder_explorer } from "$lib/store"
StartUp(folder_explorer)

$inspect(folder_explorer.breadcrumbs)

import Folder from "$lib/ui/Folder.svelte"
import Note from "$lib/ui/Note.svelte"
import "./interactable"

import { Create_folder, Rename_folder, Update_folder, Remove_folder, Move_to_folder, Drag_widget } from "$lib/services/folder"
import { Create_note } from "$lib/services/note"
async function onCreate() {
    try {
        let new_folder_name = prompt("Enter folder name", "New folder")
        if (new_folder_name) await Create_folder(new_folder_name)
    } catch (error) {
        if (error instanceof Error) {
            alert(error.message)
            onCreate()
        }
    }
}
async function onRename() {
    if (!folder_explorer.selected_widget) return
    try {
        let new_folder_name = prompt("Enter new folder name", folder_explorer.selected_widget)
        if (new_folder_name) await Rename_folder(folder_explorer.selected_widget, new_folder_name)
    } catch (error) {
        if (error instanceof Error) {
            alert(error.message)
            onRename()
        }
    }
}
async function onUpdate(payload: Partial<Widget>) {
    if (!folder_explorer.selected_widget) return
    Update_folder(folder_explorer.selected_widget, payload)
}
let move_toFolder_name = $state(null)
async function onMove() {
    if (!folder_explorer.selected_widget || !move_toFolder_name) return
    Move_to_folder(folder_explorer.selected_widget, move_toFolder_name)
}
async function onRemove() {
    if (!folder_explorer.selected_widget) return
    let is_remove = confirm("Are you sure remove?")
    if (is_remove) await Remove_folder(folder_explorer.selected_widget)
}

let buffer = $state({
        from_folder_path: "",
        widget_name: "",
        to_folder_path: "",
})
function cut() {
    if (folder_explorer.selected_widget) {
        buffer.from_folder_path = folder_explorer.selected_folder_path
        buffer.widget_name = folder_explorer.selected_widget
    }
}
function paste() {
    buffer.to_folder_path = folder_explorer.selected_folder_path
    console.log("paste", $state.snapshot(buffer))
    Drag_widget($state.snapshot(buffer))
    buffer = {
        from_folder_path: "",
        widget_name: "",
        to_folder_path: "",
    }
}
import Breadcrumbs from "$lib/ui/Breadcrumbs.svelte"
import { onMount } from "svelte"
onMount(() => {
	document.addEventListener("keydown", e => {
		if (e.key === "Delete") onRemove()
		if (e.code === "KeyX" && e.ctrlKey) cut()
		if (e.code === "KeyV" && e.ctrlKey) paste()
	})
})
</script>