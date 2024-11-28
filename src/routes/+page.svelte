<Container
	fullscreen
	folder_path={selected_folder_path}
/>
<Breadcrumbs
	root_folder_path={data.ROOT_FOLDER_PATH}
	separator={data.SEPARATOR}
	{selected_folder_path}
/>
<script>
import "./app.css"
import Container from "$lib/ui/Container.svelte"
import Breadcrumbs from "$lib/ui/Breadcrumbs.svelte"
import { Create_widget, Rename_widget, Update_widget, Remove_widget, Move_widget } from "$lib/services/widget"
import { join } from '@tauri-apps/api/path'
import { emit, listen } from "@tauri-apps/api/event"
window.emit = emit
window.listen = listen


let { data } = $props()
let selected_folder_path = $state(data.ROOT_FOLDER_PATH)
listen('Show_folder', ({payload}) => {
    console.log(`show folder:`, payload.folder_path)
    selected_folder_path = payload.folder_path
})


document.addEventListener("dblclick", async e => {
	if (e.target.classList.contains("surface")) {
		let type = "note"
        if (e.shiftKey) type = e.ctrlKey ? "container" : "folder"
		const position = {x: e.x, y: e.y}
		const folder_path = e.target.dataset.path
		const pile = await Create_widget(folder_path, {type, position})
		emit("Update_folder", {folder_path, pile})
	}
})

document.addEventListener("click", e => 
    emit("Select_widget", {widget_path: e.target.dataset.path}))

async function onRename() {
	const selected_widget = document.querySelector(".selected_widget")
	if (!selected_widget) return
	try {
		const folder_path = selected_widget.parentElement.closest(".container").dataset.path
		let new_folder_name = prompt("Enter new name", selected_widget.dataset.name)
		if (new_folder_name) {
			const pile = await Rename_widget(folder_path, selected_widget.dataset.name, new_folder_name)
            emit("Update_folder", {folder_path, pile})
		}
	} catch (error) {
		if (error instanceof Error) {
			alert(error.message)
			onRename()
		}
	}
}
async function onRemove() {
	const selected_widget = document.querySelector(".selected_widget")
	if (!selected_widget) return
	let is_remove = confirm("Are you sure remove?")
	if (is_remove) {
		const folder_path = selected_widget.parentElement.closest(".container").dataset.path
		const pile = await Remove_widget(folder_path, selected_widget.dataset.name)
        emit("Update_folder", {folder_path, pile})
	}
}

document.addEventListener("keydown", async e => {
	if (e.key === "F2") onRename()
	if (e.key === "Delete") onRemove()
    if (e.code === "KeyX" && e.ctrlKey) Buffer.cut()
	if (e.code === "KeyV" && e.ctrlKey) Buffer.paste()
})

let Buffer = {
	_status: "empty",
	_buffer: {
		from_folder_path: "",
		widget_name: "",
		to_folder_path: ""
	},
	cut() {
		const selected_widget = document.querySelector(".selected_widget")
		if (!selected_widget) return
		this._buffer.from_folder_path = selected_folder_path
		this._buffer.widget_name = selected_widget.dataset.name
		selected_widget.classList.add("cutted_widget")
		this._status = "cutted"
	},
	async paste() {
		if (this._status !== "cutted") return
		this._buffer.to_folder_path = selected_folder_path
		const {to_pile} = await Move_widget(this._buffer)
		emit("Update_folder", {folder_path: selected_folder_path, pile: to_pile})
		this.clean()
	},
	clean() {
		this._buffer = {
			from_folder_path: "",
			widget_name: "",
			to_folder_path: ""
		}
		this._status = "empty"
	}
}

import interact from 'interactjs'
interact('.draggable')
.draggable({
	allowFrom: '.drag-handle',
	listeners: {
		move(event) {
			event.target.style.left = +event.target.style.left.replace("px", "") + event.delta.x + "px"
			event.target.style.top = +event.target.style.top.replace("px", "") + event.delta.y + "px"
		},
		end(event) {
			const widget_name = event.currentTarget.dataset.name
			const folder_path = event.currentTarget.dataset.path.replace(widget_name, "")
			Update_widget(folder_path, widget_name, {position: {x: event.target.style.left.replace("px", ""), y: event.target.style.top.replace("px", "")}})
		}
	},
	modifiers: [
		interact.modifiers.restrictEdges({ outer: 'parent' }),
	],
})
interact('.resizable')
.resizable({
	allowFrom: '.resize-handle',
	edges: { left: false, right: true, bottom: true, top: false },
	listeners: {
		move (event) {
			event.target.style.width = event.rect.width + "px"
			event.target.style.height = event.rect.height + "px"
		},
		async end(event) {
			const widget_name = event.currentTarget.dataset.name
			const folder_path = event.currentTarget.dataset.path.replace(widget_name, "")
			Update_widget(folder_path, widget_name, {size: {width: event.rect.width, height: event.rect.height}})
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
		console.log(event.target !== event.relatedTarget.parentElement)
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
		console.log(event.target, event.relatedTarget)
		// const widget_name = event.relatedTarget.dataset.name
		// const from_folder_path = await join(event.relatedTarget.dataset.path.replace(widget_name, ""))
		// const to_folder_path = event.target.dataset.path
		// const {from_pile, to_pile} = await Move_widget({
		// 	from_folder_path,
		// 	widget_name,
		// 	to_folder_path,
		// })
		// emit("Update_folder", {folder_path: from_folder_path, pile: from_pile})
		// if (event.target.classList.contains("container")) {
		// 	emit("Update_folder", {folder_path: to_folder_path, pile: to_pile})
		// }
	},
	ondropdeactivate: (event) => {
		event.target.classList.remove('drop-active')
		event.target.classList.remove('drop-target')
		event.relatedTarget.classList.remove('can-drop')
	}
})
</script>