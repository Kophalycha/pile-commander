<div
    style="position: absolute; top: {widget.position.y}px; left: {widget.position.x}px; 
    width: {widget.size.width}px; height: {widget.size.height}px; 
    background-color: {widget.bg_color || "white"};"
    class:widget={!is_edit}
    class:selected
    class:cutted
    class:is_edit
    class="note"
    data-name={widget.name}
    {ondblclick}
    oncontextmenu={onselect}
>
{#if !is_edit}
    {text}
{:else}
    <textarea
        style="width: {widget.size.width - 40}px; height: {widget.size.height - 40}px;"
        bind:this={textarea}
        bind:value={text}
        {onblur}
    >
    </textarea>
{/if}
</div>

<style>
div {
    padding: 20px;
    box-sizing: border-box;
    user-select: none;
}
div.is_edit {    
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
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
</style>
<script>
let { widget, selected, cutted, onselect, onread, onwrite } = $props()

let text = $state("")
let is_edit = $state(false)
let textarea = $state(null)

import { onMount } from "svelte"
onMount(async () => text = await onread(widget.path))

function ondblclick() {
    is_edit = true
    textarea?.select()
    setTimeout(() => textarea.selectionEnd = text.length, 0)
}
function onblur() {
    is_edit = false
    onwrite(widget.path, text)
}
</script>