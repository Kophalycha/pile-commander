<div
    data-path={widget.path}
    style="background-color: {widget.background || "none"};"
>
    <p class:drag-handle={view === "board"}>
        <span class="">{widget.name}</span>
    </p>
    <model-viewer data-path={widget.path} bind:this={model_url} shadow-intensity="1" camera-controls touch-action="pan-y"></model-viewer>
</div>

<style>
div {
    height: 100%;
}
model-viewer {
    width: 100%;
    height: 100%;
}

p {
    background-color: rgba(0, 0, 0, 0.05);
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
import { readFile } from '@tauri-apps/plugin-fs'
import { onDestroy, onMount } from "svelte"

let { view, widget } = $props()

let model_url = $state()

onMount(async () => {
    const uint = await readFile(widget.path)
    const blob = new Blob([uint])
    model_url.src = URL.createObjectURL(blob)
})
onDestroy(() => URL.revokeObjectURL(model_url.src))
</script>