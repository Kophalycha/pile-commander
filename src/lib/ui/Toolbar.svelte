<div>
    <button onclick={() => image_picker.click()}>Image</button>
    <input type="file" bind:this={image_picker} accept="image/png, image/jpeg, image/gif" hidden onchange={addImage} />
    <button onclick={() => addShape("rect")}>Rect</button>
    <button onclick={() => addShape("circle")}>Circle</button>
    <button onclick={() => addShape("line")}>Line</button>
    <button onclick={ontoggle}>Pen</button>
</div>

<style>
div {
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 9999;
}
</style>

<script>
import { Add_shape, Upload_image } from "$lib/services/widget"

let {selected_folder_path, ontoggle} = $props()
let image_picker = $state()

function addImage(e) {
    const file = e.target.files[0]
    let reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = async function() {
        const uint8View = new Uint8Array(reader.result)
        const pile = await Upload_image(selected_folder_path, file.name, uint8View)
        emit("Update_folder", {folder_path: selected_folder_path, pile})
    }
    reader.onerror = function() {console.log(reader.error)}
}
async function addShape(type) {
    const pile = await Add_shape(selected_folder_path, type)
    emit("Update_folder", {folder_path: selected_folder_path, pile})
}
</script>