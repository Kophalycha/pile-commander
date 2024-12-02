<div>
    <button onclick={() => image_picker.click()}>Image</button>
    <input type="file" bind:this={image_picker} accept="image/png, image/jpeg, image/gif" hidden onchange={addImage} />
    <button onclick={addRect}>Rect</button>
</div>

<style>
div {
    position: fixed;
    bottom: 30px;
    right: 30px;
}
</style>

<script>
import { Add_rect, Upload_image } from "$lib/services/widget"

let {selected_folder_path} = $props()
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
async function addRect() {
    const pile = await Add_rect(selected_folder_path)
    emit("Update_folder", {folder_path: selected_folder_path, pile})
}
</script>