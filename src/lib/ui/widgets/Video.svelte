<div
    data-path={widget.path}
    class:drag-handle={view === "board"}
>
    <video controls data-path={widget.path} bind:this={video_url}></video>
</div>

<style>
div {
    height: 100%;
}
video {
    width: 100%;
}
</style>
<script>
import { readFile } from '@tauri-apps/plugin-fs'
import { onDestroy, onMount } from "svelte"

let { view, widget } = $props()

let video_url = $state()

onMount(async () => {
    const uint = await readFile(widget.path)
    const blob = new Blob([uint])
    video_url.src = URL.createObjectURL(blob)
})
onDestroy(() => URL.revokeObjectURL(video_url.src))
</script>