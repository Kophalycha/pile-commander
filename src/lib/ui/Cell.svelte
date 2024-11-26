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
    class:selected_slide
    class:selected_widget
    class:draggable={view === "board"}
    class:dropzone={["folder", "container"].includes(widget.type) && view === "board"}
    class:cutted
>
    {#if widget.type === "note"}
        <Note {view} {widget} />
    {:else if widget.type === "folder"}
        <Folder {view} {widget} />
    {:else if widget.type === "container"}
        <Container path={widget.path} {widget} />
    {/if}
    <span class="resize-handle"></span>
</div>

<style>
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
</style>
<script>
import Container from "$lib/ui/Container.svelte"
import Note from "$lib/ui/widgets/Note.svelte"
import Folder from "$lib/ui/widgets/Folder.svelte"
const { view, widget, selected_slide, cutted } = $props()
let selected_widget = $state(false)
document.addEventListener("widget_selected", (e) => {
    if (e.detail.widget_path === widget.path) {
        selected_widget = true
    } else {
        selected_widget = false
    }
})
</script>