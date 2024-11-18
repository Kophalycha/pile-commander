<div
    id={widget.name}
    class="widget folder dropzone"
    class:selected={folder_explorer.selected_widget === widget.name}
    style="top: {widget.position.y}px; left: {widget.position.x}px; 
    width: {widget.size.width}px; height: {widget.size.height}px;"
    data-name={widget.name}
    ondblclick={() => Show_folder(widget.name)}
    oncontextmenu={(e) => {
        e.preventDefault()
        folder_explorer.select_widget(widget.name)
    }}
>
</div>

<style>
div {
    position: absolute;
    outline: 2px solid #ccc;
    border-radius: 10px;
}
div::after {
    content: attr(data-name);
    position: relative;
    height: 100%;
    font-size: 18px;
    display: grid;
    place-content: center center;
}
.selected {
    outline: 2px solid blue;
}
</style>
<script lang="ts">
let { widget }: { widget: Widget} = $props()
import { Show_folder } from "$lib/services/folder"
import { folder_explorer } from "$lib/store"
</script>