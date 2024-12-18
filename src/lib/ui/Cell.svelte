<div
    class="cell widget resizable {widget.type} {view} connector-zone"
    style="
        top: {widget.position.y}px;
        left: {widget.position.x}px;
        width: {widget.size.width}px;
        height: {widget.size.height}px;
        grid-row: span {Math.floor(widget.size.height/20)};
    "
    data-path={widget.path}
    data-name={widget.name}
    class:draggable={view === "board"}
    class:dropzone={["folder", "container"].includes(widget.type) && view === "board"}
    class:selected_widget
    class:selected_slide
    class:shape={["rect", "circle"].includes(widget.type)}
>
    {#if widget.type === "text"}
        <Text {view} {widget} />
    {:else if widget.type === "image"}
        <Image {view} {widget} />
    {:else if widget.type === "rect"}
        <Rect {view} {widget} />
    {:else if widget.type === "circle"}
        <Circle {view} {widget} />
    {:else if widget.type === "path"}
        <Path {view} {widget} />
    {:else if widget.type === "audio"}
        <Audio {view} {widget} />
    {:else if widget.type === "video"}
        <Video {view} {widget} />
    {:else if widget.type === "3d_model"}
        <Model {view} {widget} />
    {:else if widget.type === "folder"}
        <Folder {view} {widget} />
    {:else if widget.type === "container"}
        <Container folder_path={widget.path} {widget} />
    {/if}
    <span class="resize-handle {view}">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M213.66,133.66l-80,80a8,8,0,0,1-11.32-11.32l80-80a8,8,0,0,1,11.32,11.32Zm-16-99.32a8,8,0,0,0-11.32,0l-152,152a8,8,0,0,0,11.32,11.32l152-152A8,8,0,0,0,197.66,34.34Z"></path></svg>
    </span>
</div>

<style>
.cell.board {
    position: absolute;
}
.cell.stack {
    display: block;
    width: 100% !important;
    margin-bottom: 10px;
}
.cell.slides {
    display: none;
    width: 100% !important;
}
.cell.slides.selected_slide {
    display: block;
}
.cell.masonry {
    width: 100% !important;
}
.cell.masonry:hover {
    background-color: #ffffff;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
    z-index: 1;
}

.resize-handle {
    visibility: hidden;
    float: right;
    position: relative;
    bottom: 30px;
    opacity: .2;
}
.cell:hover .resize-handle {
    visibility: visible;
}
.resize-handle.board {
    position: absolute;
    bottom: 0;
    right: 0;
}
.resize-handle.stack, .resize-handle.masonry, .resize-handle.slides {
    cursor: ns-resize;
}

.selected_widget {
	outline: 5px solid #2182F8 !important;
}
</style>
<script>
import Text from "$lib/ui/widgets/Text.svelte"
import Image from "$lib/ui/widgets/Image.svelte"
import Rect from "$lib/ui/widgets/Rect.svelte"
import Circle from "$lib/ui/widgets/Circle.svelte"
import Path from "$lib/ui/widgets/Path.svelte"
import Audio from "$lib/ui/widgets/Audio.svelte"
import Video from "$lib/ui/widgets/Video.svelte"
import Model from "$lib/ui/widgets/3DModel.svelte"
import Folder from "$lib/ui/widgets/Folder.svelte"
import Container from "./Container.svelte"
const { view, widget, selected_slide } = $props()

let selected_widget = $state(false)
let l1

import { onDestroy, onMount } from "svelte"
onMount(async () => {
    l1 = await listen('Select_widget', ({payload}) => {
        if (payload.widget_path === widget.path) {
            selected_widget = true
            emit("Widget_selected", {widget})
        } else {
            selected_widget = false
        }
    })
})
onDestroy(() => l1())
</script>