<div>
    <button onclick={() => image_picker.click()}>Image</button>
    <input type="file" bind:this={image_picker} accept="image/png, image/jpeg, image/gif" hidden onchange={e => addFile(e, "image")} />
    <button onclick={() => addShape("rect")}>Rect</button>
    <button onclick={() => addShape("circle")}>Circle</button>
    <button onclick={() => addShape("line")}>Line</button>
    <button onclick={ontoggle} class:selected_tool>Pen</button>
    <button onclick={() => audio_picker.click()}>Audio</button>
    <input type="file" bind:this={audio_picker} accept="audio/*" hidden onchange={e => addFile(e, "audio")} />
    <button onclick={() => video_picker.click()}>Video</button>
    <input type="file" bind:this={video_picker} accept="video/*" hidden onchange={e => addFile(e, "video")} />
</div>

<style>
div {
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 9999;
}
button.selected_tool {
    outline: 2px solid orange;
}
</style>

<script>
import { Add_shape, Upload_file } from "$lib/services/widget"

let {selected_folder_path, ontoggle, selected_tool} = $props()
let image_picker = $state()
let audio_picker = $state()
let video_picker = $state()

function addFile(e, type) { // "image" | "audio" | "video"
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