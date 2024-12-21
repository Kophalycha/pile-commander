<svg id="svgElement" x="0px" y="0px" width={viewport.width} height={viewport.height} viewBox="0 0 {viewport.width} {viewport.height}"></svg>
<div>
    <p>
        Width: 
        <input type="number" bind:value={strokeWidth}>
    </p>
    <p>
        <button onclick={() => strokeColor = "black"}>Black</button>
        <br><br>
        {#snippet color_ficker(color)}
            <button style="background-color: {color};" onclick={() => strokeColor = color}></button>
        {/snippet}
        <span class="colors-board">
            {#each colors as color}
                {@render color_ficker(color)}
            {/each}
        </span>
    </p>
</div>

<style>
#svgElement {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 999;
    cursor: pointer;
}
div {
    position: fixed;
    width: 250px;
    bottom: 80px;
    right: 20px;
    z-index: 9999;
    background-color: #fff;
    padding: 20px;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}
input[type="number"] {
    width: 40px;
}
.colors-board {
    display: grid;
    grid-template-columns: repeat(6, auto);
    gap: 10px;
}
.colors-board > button {
    width: 30px;
    height: 30px;
}
</style>
<script>
/**
 * based on this excellent answer:
 * https://stackoverflow.com/a/40700068/9055415
*/
import { Create_path } from "$lib/services/widget"
import { onMount } from "svelte"

let {selected_folder_path} = $props()
let viewport = $state({
    width: null,
    height: null
})

let strokeWidth = $state(2)
let strokeColor = $state("black")
const colors = ["AliceBlue", "Azure", "Beige", "Bisque", "BlanchedAlmond", "Cornsilk", "FloralWhite",
    "GhostWhite", "Gainsboro", "HoneyDew", "Ivory", "Khaki", "LavenderBlush", "LightBlue",
    "#F1F1EF", "#F4EEEE", "#FBECDD", "#FBF3DB", "#EDF3EC", "#E7F3F8", "#F6F3F9", "#FAF1F5", "#FDEBEC", "plum"
]

onMount(() => {

    viewport.width = window.visualViewport.width
    viewport.height = window.visualViewport.height

    let svgElement = document.getElementById("svgElement")

    let rect = svgElement.getBoundingClientRect()
    let path = null
    let strPath
    let bufferSize
    let buffer = []

    svgElement.addEventListener("mousedown", e => {
        bufferSize = 4
        path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        path.setAttribute("fill", "none")
        path.setAttribute("stroke", strokeColor)
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