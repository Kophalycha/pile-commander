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
    class:dropzone={["folder", "container"].includes(widget.type)}
    class:cutted
    onclick={() => {
		document.dispatchEvent(new CustomEvent("select_widget", { detail: {
			widget: widget
		}}))
    }}
>
    {#if widget.type === "note"}
        <Note {view} {widget} />
    {:else if widget.type === "folder"}
        <Folder {view} {widget} />
    {:else if widget.type === "container"}
        <Container path={widget.path} />
    {/if}
</div>

<script>
import Container from "$lib/ui/Container.svelte"
import Note from "$lib/ui/widgets/Note.svelte"
import Folder from "$lib/ui/widgets/Folder.svelte"
const { view, widget, selected_slide, selected_widget, cutted } = $props()
</script>