<div
    style="background-color: {widget.bg_color || "initial"};"
    class="folder {view}"
    data-name={widget.name}
    data-path={widget.path}
    ondblclick={() => {
        document.dispatchEvent(new CustomEvent("show_folder", { detail: {
			folder_path: widget.path
		}}))
    }}
>
</div>

<style>
div.folder {
    height: 100%;
    outline: 2px solid #ccc;
    border-radius: 10px;
}
div.folder::after {
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