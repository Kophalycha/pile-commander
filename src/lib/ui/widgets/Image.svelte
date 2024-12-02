<div
    data-path={widget.path}
    class:drag-handle={view === "board"}
>
<img data-path={widget.path} bind:this={image_url}>
</div>

<style>
div {
    height: 100%;
}
img {
    width: 100%;
    height: 100%;
}
</style>
<script>
import { readFile } from '@tauri-apps/plugin-fs'
import { onDestroy, onMount } from "svelte"

let { view, widget } = $props()

let image_url = $state()

onMount(async () => {
    const uint = await readFile(widget.path)
    const blob = new Blob([uint])
    image_url.src = URL.createObjectURL(blob)
})
onDestroy(() => URL.revokeObjectURL(image_url.src))
</script>