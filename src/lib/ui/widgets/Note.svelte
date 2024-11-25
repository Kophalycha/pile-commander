<div
    style="background-color: {widget.bg_color || "white"};"
    class:is_edit
    {ondblclick}
>
{#if !is_edit}
    {text}
{:else}
    <textarea
        bind:this={textarea}
        bind:value={text}
        {onblur}
    ></textarea>
{/if}
</div>

<style>
div {
    padding: 20px;
    box-sizing: border-box;
    height: 100%;
    user-select: none;
}
div.is_edit {
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    height: 100%;
}
textarea {
    font-size: 16px;
    font-family: "IBM Plex Sans", sans-serif;
    border: none;
    resize: none;
    width: 100%;
    height: 100%;
    outline: none;
    background-color: initial;
    padding: 0;
}
</style>
<script>
let { widget } = $props()

let text = $state("")
let is_edit = $state(false)
let textarea = $state(null)

import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs'
import { onMount } from "svelte"
onMount(async () => text = await readTextFile(widget.path))

function ondblclick() {
    is_edit = true
    setTimeout(() => textarea.focus(), 10)
}
function onblur() {
    is_edit = false
    writeTextFile(widget.path, text)
}
</script>