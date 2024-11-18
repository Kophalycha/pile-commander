<div
    style="position: absolute; top: {widget.position.y}px; left: {widget.position.x}px; 
    width: {widget.size.width}px; height: {widget.size.height}px; 
    background-color: {widget.bg_color || "white"};"
    class:widget={!is_edit}
    class:selected={folder_explorer.selected_widget === widget.name}
    class:is_edit
    class="note"
    id={widget.name}
    ondblclick={onfocus}
    oncontextmenu={(e) => {
        e.preventDefault()
        folder_explorer.select_widget(widget.name)
    }}
>
{#if !is_edit}
    {text}
{:else}
    <textarea
    bind:this={textarea}
    style="width: {widget.size.width - 40}px; height: {widget.size.height - 40}px;"
    bind:value={text} onblur={onEdit}></textarea>
{/if}

</div>


<style>
div {
    padding: 20px;
    box-sizing: border-box;
    user-select: none;
}
textarea {
    font-size: 16px;
    font-family: "IBM Plex Sans", sans-serif;
    border: none;
    resize: none;
    outline: none;
    background-color: initial;
    padding: 0;
}
div.is_edit {    
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}
.selected {
    outline: 2px solid blue;
}
</style>
<script lang="ts">
let { widget , group_name}: {widget: Widget, group_name?: string} = $props()
import { Read_note, Write_note } from "$lib/services/note"
import { folder_explorer } from "$lib/store"
import { onMount } from "svelte"

let text = $state("")
let is_edit = $state(false)
let textarea = $state(null)

function is_unnamed(): boolean {
	return widget.name.includes("unnamed_note_")
}

onMount(async () => {
    text = await Read_note(widget.name, group_name)
})
function onfocus() {
    is_edit = true
    textarea?.select()
    setTimeout(() => textarea.selectionEnd = text.length, 0)
}
function onEdit() {
    is_edit = false
    Write_note(widget.name, text)
}
</script>