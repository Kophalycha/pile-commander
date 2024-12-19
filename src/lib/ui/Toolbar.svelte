<div>
    <button onclick={ontoggle} class="tooltip">
        <Cursor_1 size={32} fill={selected_tool === "selection" ? "orange": "black"} />
        <span class="tooltiptext">Selection</span>
    </button>
    <button onclick={ontoggle} class:selected_tool={selected_tool === "pen"} class="tooltip">
        <Pen size={32} fill={selected_tool === "pen" ? "orange": "black"} />
        <span class="tooltiptext">Pen</span>
    </button>
    <span>&nbsp; &nbsp; &nbsp;</span>
    <button onclick={() => onCreate("text")} class="tooltip">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M208,56V88a8,8,0,0,1-16,0V64H136V192h24a8,8,0,0,1,0,16H96a8,8,0,0,1,0-16h24V64H64V88a8,8,0,0,1-16,0V56a8,8,0,0,1,8-8H200A8,8,0,0,1,208,56Z"></path></svg>
        <span class="tooltiptext">Text</span>
    </button>
    <button onclick={() => onCreate("container")} class="tooltip">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M200,40H56A16,16,0,0,0,40,56V200a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,80H136V56h64ZM120,56v64H56V56ZM56,136h64v64H56Zm144,64H136V136h64v64Z"></path></svg>       <span class="tooltiptext">Container</span>
    </button>
    <button onclick={() => onCreate("folder")} class="tooltip">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M216,72H131.31L104,44.69A15.86,15.86,0,0,0,92.69,40H40A16,16,0,0,0,24,56V200.62A15.4,15.4,0,0,0,39.38,216H216.89A15.13,15.13,0,0,0,232,200.89V88A16,16,0,0,0,216,72ZM40,56H92.69l16,16H40ZM216,200H40V88H216Z"></path></svg>
        <span class="tooltiptext">Folder</span>
    </button>
    <button onclick={() => image_picker.click()} class="tooltip">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V158.75l-26.07-26.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L40,149.37V56ZM40,172l52-52,80,80H40Zm176,28H194.63l-36-36,20-20L216,181.38V200ZM144,100a12,12,0,1,1,12,12A12,12,0,0,1,144,100Z"></path></svg>
        <span class="tooltiptext">Image</span>
    </button>
    <input type="file" bind:this={image_picker} accept="image/png, image/jpeg, image/gif" hidden onchange={e => addFile(e, "image")} />
    <button onclick={() => addShape("rect")} class="tooltip">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200Z"></path></svg>
        <span class="tooltiptext">Rect</span>
    </button>
    <button onclick={() => addShape("circle")} class="tooltip">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z"></path></svg>
        <span class="tooltiptext">Circle</span>
    </button>
    <button onclick={() => addShape("line")} class="tooltip">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M214.64,41.36a32,32,0,0,0-50.2,38.89L80.25,164.44a32.06,32.06,0,0,0-38.89,4.94h0a32,32,0,1,0,50.2,6.37l84.19-84.19a32,32,0,0,0,38.89-50.2Zm-139.33,162a16,16,0,0,1-22.64-22.64h0a16,16,0,0,1,22.63,0h0A16,16,0,0,1,75.31,203.33Zm128-128a16,16,0,1,1,0-22.63A16,16,0,0,1,203.33,75.3Z"></path></svg>
        <span class="tooltiptext">Line</span>
    </button>
    <button onclick={() => audio_picker.click()} class="tooltip">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M212.92,17.69a8,8,0,0,0-6.86-1.45l-128,32A8,8,0,0,0,72,56V166.08A36,36,0,1,0,88,196V110.25l112-28v51.83A36,36,0,1,0,216,164V24A8,8,0,0,0,212.92,17.69ZM52,216a20,20,0,1,1,20-20A20,20,0,0,1,52,216ZM88,93.75V62.25l112-28v31.5ZM180,184a20,20,0,1,1,20-20A20,20,0,0,1,180,184Z"></path></svg>
        <span class="tooltiptext">Audio</span>
    </button>
    <input type="file" bind:this={audio_picker} accept="audio/*" hidden onchange={e => addFile(e, "audio")} />
    <button onclick={() => video_picker.click()} class="tooltip">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M164.44,105.34l-48-32A8,8,0,0,0,104,80v64a8,8,0,0,0,12.44,6.66l48-32a8,8,0,0,0,0-13.32ZM120,129.05V95l25.58,17ZM216,40H40A16,16,0,0,0,24,56V168a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,128H40V56H216V168Zm16,40a8,8,0,0,1-8,8H32a8,8,0,0,1,0-16H224A8,8,0,0,1,232,208Z"></path></svg>
        <span class="tooltiptext">Video</span>
    </button>
    <input type="file" bind:this={video_picker} accept="video/*" hidden onchange={e => addFile(e, "video")} />
    <button onclick={() => model_picker.click()} class="tooltip">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M223.68,66.15,135.68,18h0a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32h0l80.34,44L128,120,47.66,76ZM40,90l80,43.78v85.79L40,175.82Zm96,129.57V133.82L216,90v85.78Z"></path></svg>
        <span class="tooltiptext">3D model</span>
    </button>
    <input type="file" bind:this={model_picker} accept="model/gltf-binary, model/gltf+json" hidden onchange={e => addFile(e, "3d_model")} />
</div>
<style>
div {
    position: fixed;
    bottom: 0;
    right: 200px;
    z-index: 9999;
    height: 49px;
    padding: 0 20px 0 20px;
}

button {
    outline: none;
}

.tooltip {
    position: relative;
}
.tooltip .tooltiptext {
    visibility: hidden;
    width: 120px;
    background-color: black;
    color: #fff;
    text-align: center;
    padding: 5px 0;
    border-radius: 6px; 
    position: absolute;
    z-index: 1;
    top: -30px;
    left: -30px;
}
.tooltip:hover .tooltiptext {
    visibility: visible;
}
</style>

<script>
import { Create_widget, Add_shape, Upload_file } from "$lib/services/widget"
import Cursor_1 from "carbon-icons-svelte/lib/Cursor_1.svelte"
import Pen from "carbon-icons-svelte/lib/Pen.svelte"

let {selected_folder_path, ontoggle, selected_tool} = $props()
let image_picker = $state()
let audio_picker = $state()
let video_picker = $state()
let model_picker = $state()

async function onCreate(type) {
    const pile = await Create_widget(selected_folder_path, {type, position: {x: 60, y: 80}})
    emit("Update_folder", {folder_path: selected_folder_path, pile})
}
function addFile(e, type) { // "image" | "audio" | "video" | "3d_model"
    const file = e.target.files[0]
    let reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = async function() {
        const uint8View = new Uint8Array(reader.result)
        const pile = await Upload_file(selected_folder_path, type, file.name, uint8View)
        emit("Update_folder", {folder_path: selected_folder_path, pile})
    }
    reader.onerror = function() {console.log(reader.error)}
}
async function addShape(type) {
    const pile = await Add_shape(selected_folder_path, type)
    emit("Update_folder", {folder_path: selected_folder_path, pile})
}
</script>