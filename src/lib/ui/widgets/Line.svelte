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
    position: absolute;
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

let line = $state(null)
let anchor_kind = $state({
    start: "position",
    end: "position",
})
let selected_widget = $state(false)
let u1, u2, u3, u4, u5, u6

import { onDestroy, onMount } from "svelte"
onMount(async () => {
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
    line.size = widget.stroke.width
    line.color = widget.stroke.color
    for (const [index, node] of document.querySelectorAll(".leader-line").entries()) {
        node.classList.add("selectable")
        if (line._id - 1 === index ) {
            node.dataset.path = widget.path
            node.dataset.name = widget.name
        }
    }
    u1 = await listen("Update_line_position", AnimEvent.add(() => line.position()))
    u2 = await listen('Select_widget', ({payload}) => {
        selected_widget = payload.widget_path === widget.path ? true : false
        if (selected_widget) emit("Widget_selected", {widget})
    })
    u3 = await listen('Connect_widget', ({payload}) => {
        if (payload.widget_name === widget.name) {
            line[payload.anchor_kind] = document.querySelector(`[data-name="${payload.connection_name}"]`)
            anchor_kind[payload.anchor_kind] = "element"
        }
    })
    u4 = await listen("Remove_line", ({payload}) => {
        if (payload.widget_name === widget.name) line.remove()
    })
    u5 = await listen("Update_line_stroke_width", AnimEvent.add(() => line.size = widget.stroke.width))
    u6 = await listen("Update_line_stroke_color", AnimEvent.add(() => line.color = widget.stroke.color))
})
onDestroy(() => {
    line.remove()
    u1()
    u2()
    u3()
    u4()
    u5()
    u6()
})
</script>