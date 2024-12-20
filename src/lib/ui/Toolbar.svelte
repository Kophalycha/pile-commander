<div>
    <button onclick={ontoggle} class="tooltip">
        <Cursor_1 size={24} fill={selected_tool === "selection" ? "orange": "black"} />
        <span class="tooltiptext">Selection</span>
    </button>
    <button onclick={ontoggle} class:selected_tool={selected_tool === "pen"} class="tooltip">
        <Pen size={24} fill={selected_tool === "pen" ? "orange": "black"} />
        <span class="tooltiptext">Pen</span>
    </button>
    <span>&nbsp; &nbsp; &nbsp;</span>
    <button onclick={() => onCreate("text")} class="tooltip">
        <TextScale size={24} />
        <span class="tooltiptext">Text</span>
    </button>
    <button onclick={() => onCreate("container")} class="tooltip">  
        <ContainerImage size={24} />
        <span class="tooltiptext">Container</span>
    </button>
    <button onclick={() => onCreate("folder")} class="tooltip">
        <Folder size={24} />
        <span class="tooltiptext">Folder</span>
    </button>
    <button onclick={() => image_picker.click()} class="tooltip">
        <Image size={24} />
        <span class="tooltiptext">Image</span>
    </button>
    <input type="file" bind:this={image_picker} accept="image/png, image/jpeg, image/gif" hidden onchange={e => addFile(e, "image")} />
    <button onclick={() => addShape("rect")} class="tooltip">
        <SquareOutline size={24} />
        <span class="tooltiptext">Rect</span>
    </button>
    <button onclick={() => addShape("circle")} class="tooltip">
        <CircleOutline size={24} />
        <span class="tooltiptext">Circle</span>
    </button>
    <button onclick={() => addShape("line")} class="tooltip">
        <WatsonHealth3DCurveAutoColon size={24} />
        <span class="tooltiptext">Line</span>
    </button>
    <button onclick={() => audio_picker.click()} class="tooltip">
        <DocumentAudio size={24} />
        <span class="tooltiptext">Audio</span>
    </button>
    <input type="file" bind:this={audio_picker} accept="audio/*" hidden onchange={e => addFile(e, "audio")} />
    <button onclick={() => video_picker.click()} class="tooltip">
        <Video size={24} />
        <span class="tooltiptext">Video</span>
    </button>
    <input type="file" bind:this={video_picker} accept="video/*" hidden onchange={e => addFile(e, "video")} />
    <button onclick={() => model_picker.click()} class="tooltip">
        <WatsonHealth3DMprToggle size={24} />
        <span class="tooltiptext">3D model</span>
    </button>
    <input type="file" bind:this={model_picker} accept="model/gltf-binary, model/gltf+json" hidden onchange={e => addFile(e, "3d_model")} />
</div>
<style>
div {
    position: fixed;
    bottom: 0;
    right: 100px;
    z-index: 9999;
    padding-bottom: 2px;
}
div > button {
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
import TextScale from "carbon-icons-svelte/lib/TextScale.svelte"
import Folder from "carbon-icons-svelte/lib/Folder.svelte"
import ContainerImage from "carbon-icons-svelte/lib/ContainerImage.svelte"
import Image from "carbon-icons-svelte/lib/Image.svelte"
import DocumentAudio from "carbon-icons-svelte/lib/DocumentAudio.svelte"
import Video from "carbon-icons-svelte/lib/Video.svelte"
import WatsonHealth3DMprToggle from "carbon-icons-svelte/lib/WatsonHealth3DMprToggle.svelte"
import WatsonHealth3DCurveAutoColon from "carbon-icons-svelte/lib/WatsonHealth3DCurveAutoColon.svelte"
import CircleOutline from "carbon-icons-svelte/lib/CircleOutline.svelte"
import SquareOutline from "carbon-icons-svelte/lib/SquareOutline.svelte"

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