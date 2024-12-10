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
    <button onclick={() => model_picker.click()}>3D model</button>
    <input type="file" bind:this={model_picker} accept="model/gltf-binary, model/gltf+json" hidden onchange={e => addFile(e, "3d_model")} />
    <button onclick={checkForAppUpdates}>Check updates</button>
    <p>{status}</p>
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
let model_picker = $state()

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

import { check } from "@tauri-apps/plugin-updater"
let status = $state("")
async function checkForAppUpdates() {
	const update = await check()
	if (update?.available) {
		let yes = confirm(`Update to ${update.version} is available! Install?`)
		if (yes) {
			let downloaded = 0;
			let contentLength = 0;
			await update.downloadAndInstall((event) => {
				switch (event.event) {
					case 'Started':
						contentLength = event.data.contentLength;
						status = `started downloading ${event.data.contentLength} bytes`
						break;
					case 'Progress':
						downloaded += event.data.chunkLength;
						status = `downloaded ${downloaded} from ${contentLength}`
						break;
					case 'Finished':
						status = 'download finished'
						break;
				}
			})
			alert("Please, restart app")
		}
	}
}
</script>