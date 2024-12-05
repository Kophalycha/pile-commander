<div data-path={widget.path}>
    <p class:drag-handle={view === "board"}>-</p>
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