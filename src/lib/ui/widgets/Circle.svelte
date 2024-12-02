<div
    data-path={widget.path}
    style="background-color: {widget.bg_color || "inherit"};"
    class:drag-handle={view === "board"}
>
</div>

<style>
div {
    user-select: none;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    outline: 3px solid black;
    outline-offset: -3px;
}
</style>
<script>
let { view, widget } = $props()
</script>