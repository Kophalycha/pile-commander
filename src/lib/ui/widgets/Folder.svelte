<div
    style="background-color: {widget.background || "initial"};"
    class:drag-handle={view === "board"}
    data-name={widget.name}
    data-path={widget.path}
    ondblclick={() => emit("Show_folder", {folder_path: widget.path})}
>
<button onclick={async () => {
    const folder_path = widget.path.replace(widget.name, "").slice(0, -1)
    const pile = await Update_widget(folder_path, widget.name, {type: "container"})
    emit("Update_folder", {folder_path, pile})
}}>Change to container</button>
</div>

<style>
div {
    height: 100%;
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
    text-align: center;
}
</style>
<script>
let { view, widget } = $props()
import { Update_widget } from "$lib/services/widget"
</script>