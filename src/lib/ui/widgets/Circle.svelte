<div
    data-path={widget.path}
    style="background-color: {widget.background || "inherit"}; outline: {widget.stroke.width}px {widget.stroke.style} {widget.stroke.color}; outline-offset: -{widget.stroke.width}px;"
    class:drag-handle={view === "board"}
>
</div>

<style>
div {
    user-select: none;
    width: 100%;
    height: 100%;
    border-radius: 50%;
}
</style>
<script>
let { view, widget } = $props()
</script>