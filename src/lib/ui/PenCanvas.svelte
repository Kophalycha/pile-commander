<svg id="svgElement" x="0px" y="0px" width="1800px" height="900px" viewBox="0 0 1800 900"></svg>

<style>
#svgElement {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 999;
    border: 1px solid;
}
</style>
<script>
import { Create_path } from "$lib/services/widget"
import { onMount } from "svelte"
let {selected_folder_path} = $props()

onMount(() => {

let svgElement = document.getElementById("svgElement")

let strokeWidth = 2
let bufferSize

let rect = svgElement.getBoundingClientRect()
let path = null
let strPath
let buffer = []

svgElement.addEventListener("mousedown", e => {
    bufferSize = 4
    path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute("fill", "none")
    path.setAttribute("stroke", "#000")
    path.setAttribute("stroke-width", strokeWidth)
    buffer = []
    const pt = getMousePosition(e)
    appendToBuffer(pt)
    strPath = "M" + pt.x + " " + pt.y
    path.setAttribute("d", strPath)
    svgElement.appendChild(path)
})
svgElement.addEventListener("mousemove", e => {
    if (path) {
        appendToBuffer(getMousePosition(e))
        updateSvgPath()
    }
})
svgElement.addEventListener("mouseup", async () => {
    if (path) {
        const {x, y, width, height} = path.getBoundingClientRect()
        const cloned_path = path.cloneNode()
        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute('x', x)
        svg.setAttribute('y', y)
        svg.setAttribute('width', width)
        svg.setAttribute('height', height)
        svg.setAttribute('viewBox', `${x - strokeWidth} ${y - strokeWidth} ${width + strokeWidth*2} ${height + strokeWidth*2}`)
        svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink")
        svg.appendChild(cloned_path)
        path.remove()
        path = null
        const pile = await Create_path(selected_folder_path, svg.outerHTML, {x, y}, {width, height})
		emit("Update_folder", {folder_path: selected_folder_path, pile})
        svg.remove()
    }
})

const getMousePosition = e => ({
    x: e.x - rect.left,
    y: e.y - rect.top
})
const appendToBuffer = pt => {
    buffer.push(pt)
    while (buffer.length > bufferSize) {
        buffer.shift()
    }
}

const getAveragePoint = offset => {
    const len = buffer.length
    if (len % 2 === 1 || len >= bufferSize) {
        let totalX = 0
        let totalY = 0
        let pt, i
        let count = 0
        for (i = offset; i < len; i++) {
            count++
            pt = buffer[i]
            totalX += pt.x
            totalY += pt.y
        }
        return {
            x: totalX / count,
            y: totalY / count
        }
    }
    return null
}
const updateSvgPath = () => {
    let pt = getAveragePoint(0)
    if (pt) {
        strPath += " L" + pt.x + " " + pt.y
        let tmpPath = ""
        for (let offset = 2; offset < buffer.length; offset += 2) {
            pt = getAveragePoint(offset)
            tmpPath += " L" + pt.x + " " + pt.y
        }
        path.setAttribute("d", strPath + tmpPath)
    }
}


})
</script>