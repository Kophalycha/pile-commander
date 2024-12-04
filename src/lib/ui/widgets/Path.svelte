<div
    class="path"
    data-path={widget.path}
    class:drag-handle={view === "board"}
>
    {@html svg}
</div>

<style>
div {
    height: 100%;
    user-select: none;
}
:global(.path > svg) {
    width: 100%;
    height: 100%;
}
</style>
<script>
let { view, widget } = $props()

let svg = $state("")

import { readTextFile } from '@tauri-apps/plugin-fs'
import { onMount } from "svelte"
onMount(async () => svg = await readTextFile(widget.path))
</script>