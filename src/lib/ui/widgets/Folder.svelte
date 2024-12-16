<div
    style="background-color: {widget.background || "initial"};"
    class:drag-handle={view === "board"}
    class:outlined={!widget.background || widget.background === "none"}
    data-name={widget.name}
    data-path={widget.path}
    ondblclick={() => emit("Show_folder", {folder_path: widget.path})}
>
</div>

<style>
div {
    height: 100%;
    border-radius: 10px;
}
div.outlined {
    outline: 2px solid #ccc;
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