<div
    data-name={widget.name}
    data-path={widget.path}
    class="widget folder dropzone"
    style="top: {widget.position.y}px; left: {widget.position.x}px; 
    width: {widget.size.width}px; height: {widget.size.height}px;"
    ondblclick={onshow}
    class:selected
    class:cutted
    oncontextmenu={onselect}
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
</style>
<script>
let { widget, selected, cutted, onselect, onshow } = $props()
</script>