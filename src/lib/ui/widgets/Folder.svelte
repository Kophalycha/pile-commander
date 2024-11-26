<div
    style="background-color: {widget.bg_color || "initial"};"
    class:drag-handle={view === "board"}
    data-name={widget.name}
    ondblclick={() => {
        document.dispatchEvent(new CustomEvent("show_folder", { detail: {
			folder_path: widget.path
		}}))
    }}
>
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
}
</style>
<script>
let { view, widget } = $props()
</script>