<div class="line {anchor_kind.start} {anchor_kind.end}">
{#if anchor_kind.start === "position"}
    <span
        style="top: {widget.start.y}px; left: {widget.start.x}px;"
        class="line-anchor"
        data-line-anchor-kind="start"
        data-name={widget.name}
        data-path={widget.path}
        class:selected_widget
        id={`line-anchor-${widget.name}-1`}></span>
{/if}
{#if anchor_kind.end === "position"}
    <span
        style="top: {widget.end.y}px; left: {widget.end.x}px;"
        class="line-anchor"
        data-line-anchor-kind="end"
        data-name={widget.name}
        data-path={widget.path}
        class:selected_widget
        id={`line-anchor-${widget.name}-2`}></span>
{/if}
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
let anchor_kind = $state({
    start: "position",
    end: "position",
})

import { onDestroy, onMount } from "svelte"
onMount(() => {
    let start, end
    if (widget.start.x) {
        start = document.getElementById(`line-anchor-${widget.name}-1`)
    } else {
        start = document.querySelector(`[data-name="${widget.start}"]`)
        anchor_kind.start = "element"
    }
    if (widget.end.x) {
        end = document.getElementById(`line-anchor-${widget.name}-2`)
    } else {
        end = document.querySelector(`[data-name="${widget.end}"]`)
        anchor_kind.end = "element"
    }
    line = new LeaderLine(start, end)
    for (const [index, node] of document.querySelectorAll(".leader-line").entries()) {
        node.classList.add("selectable")
        if (line._id - 1 === index ) {
            node.dataset.path = widget.path
            node.dataset.name = widget.name
        }
    }

})
onDestroy(() => line.remove())

let selected_widget = $state(false)
listen('Select_widget', ({payload}) => {
    selected_widget = payload.widget_path === widget.path ? true : false
})
listen("Update_line_position", AnimEvent.add(() => line.position()))
listen('Connect_widget', ({payload}) => {
    if (payload.widget_name === widget.name) {
        line[payload.anchor_kind] = document.querySelector(`[data-name="${payload.connection_name}"]`)
        anchor_kind[payload.anchor_kind] = "element"        
    }
})
listen("Remove_line", ({payload}) => {
    if (payload.widget_name === widget.name) line.remove()
})
</script>