<div>
    <span
        style="top: {widget.from.y}px; left: {widget.from.x}px;"
        class="line-anchor"
        data-line-anchor-kind="from"
        data-line-index={line_index}
        data-name={widget.name}
        data-path={widget.path}
        class:selected_widget
        id={`line-anchor-${widget.name}-1`}></span>
    <span
        style="top: {widget.to.y}px; left: {widget.to.x}px;"
        class="line-anchor"
        data-line-anchor-kind="to"
        data-line-index={line_index}
        data-name={widget.name}
        data-path={widget.path}
        class:selected_widget
        id={`line-anchor-${widget.name}-2`}></span>
</div>

<style>
.line-anchor {
    position: fixed;
    width: 30px;
    height: 30px;
    border-radius: 50%;
}
.line-anchor:hover {
    background-color: aquamarine;
}
</style>
<script>
let { widget } = $props()

let line = null
let line_index = $state()
import { onDestroy, onMount } from "svelte"
onMount(() => {
    line = new LeaderLine(
        document.getElementById(`line-anchor-${widget.name}-1`),
        document.getElementById(`line-anchor-${widget.name}-2`)
    )
    listen("Update_line_position", () => line.position())
})
onDestroy(() => line.remove())

let selected_widget = $state(false)
listen('Select_widget', ({payload}) => {
    selected_widget = payload.widget_path === widget.path ? true : false
})
</script>