<FolderEditor
	widgets={folder_explorer.selected_folder_pile?.widgets}
	onread={readTextFile}
	onwrite={writeTextFile}
	onshow={folder_path => folder_explorer.show_folder(folder_path)}
	{onclick}
	{ondblclick}
	selected={widget_name => folder_explorer.selected_widget === widget_name}
	cutted={widget_name => folder_explorer.buffer.widget_name === widget_name}
	{onselect}
/>
<Breadcrumbs
	breadcrumbs={folder_explorer.breadcrumbs}
	onclick={folder_path => folder_explorer.show_folder(folder_path)}
/>

<script lang="ts">
import "./app.css"
import FolderEditor from "$lib/ui/FolderEditor.svelte"
import Breadcrumbs from "$lib/ui/Breadcrumbs.svelte"
import { writeTextFile, readTextFile } from '@tauri-apps/plugin-fs'
import { Create_widget, Rename_widget, Update_widget, Remove_widget, Move_widget } from "$lib/services/widget"
import { FolderExplorerStore } from "$lib/store/explorer.svelte"

let { data } = $props()
let folder_explorer = new FolderExplorerStore(data.ROOT_FOLDER_PATH, data.SEPARATOR)

function onclick() {
	folder_explorer.deselect_widget()
}
async function ondblclick(e) {
	//@ts-ignore
	if (e.target.classList.contains("surface")) {
		const type = e.shiftKey ? "folder" : "note"
		const position = {x: e.x, y: e.y}
		const new_folder_pile = await Create_widget(folder_explorer.selected_folder_path, {type, position})
		folder_explorer.update_explorer(new_folder_pile)
	}
}
function onselect(e, widget_name) {
	e.preventDefault()
	folder_explorer.select_widget(widget_name)
}
async function onRename() {
	if (!folder_explorer.selected_widget) return
	try {
		let new_folder_name = prompt("Enter new folder name", folder_explorer.selected_widget)
		if (new_folder_name) {
			const new_folder_pile = await Rename_widget(folder_explorer.selected_folder_path, folder_explorer.selected_widget, new_folder_name)
			folder_explorer.update_explorer(new_folder_pile)
		}
	} catch (error) {
		if (error instanceof Error) {
			alert(error.message)
			onRename()
		}
	}
}
async function onRemove() {
	if (!folder_explorer.selected_widget) return
	let is_remove = confirm("Are you sure remove?")
	if (is_remove) {
		const new_folder_pile = await Remove_widget(folder_explorer.selected_folder_path, folder_explorer.selected_widget)
		folder_explorer.update_explorer(new_folder_pile)
	}
}

document.addEventListener("keydown", async e => {
	if (e.key === "Delete") onRemove()
	if (e.key === "F2") onRename()
	if (e.code === "KeyX" && e.ctrlKey) folder_explorer.cut()
	if (e.code === "KeyV" && e.ctrlKey) {
		if (!folder_explorer.selected_widget) return
		folder_explorer.paste()
		const {to_pile} = await Move_widget(folder_explorer.buffer)
		folder_explorer.update_explorer(to_pile)
		folder_explorer.clean()
	}
})


import interact from 'interactjs'
interact('.widget')
.draggable({
	listeners: {
		move(event) {
			event.target.style.left = event.rect.left + "px"
			event.target.style.top = event.rect.top + "px"
		},
		end(event) {
			Update_widget(folder_explorer.selected_folder_path, event.currentTarget.dataset.name, {position: {x: event.rect.left, y: event.rect.top}})
		}
	},
	modifiers: [
		interact.modifiers.restrictEdges({ outer: 'parent' }),
	],
})
.resizable({
	edges: { left: false, right: true, bottom: true, top: false },
	listeners: {
		move (event) {
			event.target.style.width = event.rect.width + "px"
			event.target.style.height = event.rect.height + "px"
		},
		end(event) {
			Update_widget(folder_explorer.selected_folder_path, event.currentTarget.dataset.name, {size: {width: event.rect.width, height: event.rect.height}})
		}
	},
	modifiers: [
		interact.modifiers.restrictEdges({ outer: 'parent' }),
		interact.modifiers.restrictSize({ min: { width: 100, height: 50 } })
	],
})
interact('.dropzone').dropzone({
	accept: '.widget',
	overlap: 0.10,
	ondropactivate: (event) => {
		event.target.classList.add('drop-active')
	},
	ondragenter: (event) => {
		event.target.classList.add('drop-target')
		event.relatedTarget.classList.add('can-drop')
	},
	ondragleave: (event) => {
		event.target.classList.remove('drop-target')
		event.relatedTarget.classList.remove('can-drop')
	},
	ondrop: async (event) => {
		const {from_pile} = await Move_widget({
			from_folder_path: folder_explorer.selected_folder_path,
			widget_name: event.relatedTarget.dataset.name,
			to_folder_path: event.target.dataset.path,
		})
		folder_explorer.update_explorer(from_pile)
	},
	ondropdeactivate: (event) => {
		event.target.classList.remove('drop-active')
		event.target.classList.remove('drop-target')
		event.relatedTarget.classList.remove('can-drop')
	}
})
</script>