<div
    class="cell widget resizable {widget.type} {view}"
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
>
    {#if widget.type === "note"}
        <Note {view} {widget} />
    {:else if widget.type === "folder"}
        <Folder {view} {widget} />
    {:else if widget.type === "container"}
        <Container folder_path={widget.path} {widget} />
    {/if}
    <span class="resize-handle {view}"></span>
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
    width: 10px;
    height: 10px;
    float: right;
    background-color: #ccc;
    padding: 15px;
    box-sizing: border-box;
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
	outline: 5px solid blue !important;
}
.cutted_widget {
	opacity: .3;
}
</style>
<script>
import Note from "$lib/ui/widgets/Note.svelte"
import Folder from "$lib/ui/widgets/Folder.svelte"
import Container from "./Container.svelte"
const { view, widget, selected_slide } = $props()

let selected_widget = $state(false)
listen('Select_widget', ({payload}) => {
    selected_widget = payload.widget_path === widget.path ? true : false
})
</script>