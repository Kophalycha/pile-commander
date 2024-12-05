<div
    data-path={widget.path}
    class:drag-handle={view === "board"}
>
    <audio controls data-path={widget.path} bind:this={audio_url}></audio>
</div>

<style>
div {
    height: 100%;
}
audio {
    width: 100%;
}
</style>
<script>
import { readFile } from '@tauri-apps/plugin-fs'
import { onDestroy, onMount } from "svelte"

let { view, widget } = $props()

let audio_url = $state()

onMount(async () => {
    const uint = await readFile(widget.path)
    const blob = new Blob([uint])
    audio_url.src = URL.createObjectURL(blob)
})
onDestroy(() => URL.revokeObjectURL(audio_url.src))
</script>