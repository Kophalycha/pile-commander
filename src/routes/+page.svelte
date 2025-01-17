<main>
	<div>
		<Container
			fullscreen
			folder_path={selected_folder_path}
		/>
		<Breadcrumbs
			root_folder_path={data.ROOT_FOLDER_PATH}
			separator={data.SEPARATOR}
			{selected_folder_path}
		/>
		<Toolbar {selected_folder_path} ontoggle={toggle_tool} selected_tool={tool} />
		{#if tool === "pen"}
			<PenCanvas {selected_folder_path} />
		{/if}
		{#if selected_widget}
			<SelectedWidgetMenu folder_path={selected_folder_path} widget={selected_widget} {onRename} {onRemove} />
		{/if}
	</div>
	<div>
		<Appbar />
	</div>
</main>
<style>
main {
	display: grid;
	grid-template-rows: auto 50px;
	height: 100vh;
}
main div {
	user-select: none;
}
</style>
<script>
import "./app.css"
import Appbar from "$lib/ui/Appbar.svelte"
import Container from "$lib/ui/Container.svelte"
import Breadcrumbs from "$lib/ui/Breadcrumbs.svelte"
import Toolbar from "$lib/ui/Toolbar.svelte"
import PenCanvas from "$lib/ui/PenCanvas.svelte"
import SelectedWidgetMenu from "$lib/ui/SelectedWidgetMenu.svelte"
import { Create_widget, Rename_widget, Update_widget, Remove_widget, Copy_widget, Move_widget, Upload_file } from "$lib/services/widget"
import { join, basename } from '@tauri-apps/api/path'
import { readFile } from '@tauri-apps/plugin-fs'
import { emit, listen } from "@tauri-apps/api/event"
window.emit = emit
window.listen = listen

let { data } = $props()
let selected_folder_path = $state(data.ROOT_FOLDER_PATH)
let tool = $state("selection")
function toggle_tool() {
	tool = tool === "selection" ? "pen" : "selection"
}
listen('Show_folder', ({payload}) => {
    console.log(`show folder:`, payload.folder_path)
    selected_folder_path = payload.folder_path
})

let selected_widget = $state(null)
listen('Widget_selected', ({payload}) => {
	selected_widget = payload.widget
})

listen('tauri://drag-drop', async ({payload}) => {
	const file_name = await basename(payload.paths[0])
	const uint8View = await readFile(payload.paths[0])
	const file_ext = file_name.split(".")[1]
	let widget_type
	if (["jpg", "jpeg", "png", "gif"].includes(file_ext)) {
		widget_type = "image"
	} else if (["mp3", "wav", "ogg"].includes(file_ext)) {
		widget_type = "audio"
	} else if (["mp4", "mpg", "mov", "avi"].includes(file_ext)) {
		widget_type = "video"
	} else if (["glb", "gltf"].includes(file_ext)) {
		widget_type = "3d_model"
	}
	if (widget_type) {
		const pile = await Upload_file(selected_folder_path, widget_type, file_name, uint8View, payload.position)
		emit("Update_folder", {folder_path: selected_folder_path, pile})
	}
})

document.addEventListener("dblclick", async e => {
	if (e.target.classList.contains("surface")) {
		let type = "text"
        if (e.shiftKey) type = e.ctrlKey ? "container" : "folder"
		const position = {x: e.layerX, y: e.layerY}
		const folder_path = e.target.dataset.path
		const pile = await Create_widget(folder_path, {type, position})
		emit("Update_folder", {folder_path, pile})
	}
})

document.addEventListener("click", async e => {
	if (e.target.classList.value.includes("leader-line")) {
		emit("Select_widget", {widget_path: e.target.closest("svg").dataset.path})
	} else if (["svg", "path"].includes(e.target.nodeName) && e.target.closest("div.path")) {
		emit("Select_widget", {widget_path: e.target.closest("div.path").dataset.path})
	} else {
		if (e.target.classList.contains("surface")) selected_widget = null
		emit("Select_widget", {widget_path: e.target.dataset.path})
	}
})

async function onRename() {
	const selected_widget_node = document.querySelector(".selected_widget")
	if (!selected_widget_node && !selected_widget) return
	try {
		const folder_path = selected_widget.path.replace(selected_widget.name, "").slice(0, -1)
		const old_widget_name = selected_widget.name
		let new_widget_name = prompt("Enter new name", old_widget_name)
		if (new_widget_name) {
			const pile = await Rename_widget(folder_path, old_widget_name, new_widget_name)
            emit("Update_folder", {folder_path, pile})
			selected_widget = null
		}
	} catch (error) {
		if (error instanceof Error) {
			alert(error.message)
			onRename()
		}
	}
}
async function onRemove() {
	const selected_widget_node = document.querySelector(".selected_widget")
	if (!selected_widget_node && !selected_widget) return
	let is_remove = confirm("Are you sure remove?")
	if (is_remove) {
		const folder_path = selected_widget.path.replace(selected_widget.name, "").slice(0, -1)
		const widget_name = selected_widget.name
		const pile = await Remove_widget(folder_path, widget_name)
        emit("Update_folder", {folder_path, pile})
		selected_widget = null
	}
}

document.addEventListener("keydown", async e => {
	if (e.key === "F2") onRename()
	if (e.key === "Delete") onRemove()
    if (e.code === "KeyX" && e.ctrlKey) Buffer.cut()
    if (e.code === "KeyC" && e.ctrlKey) Buffer.copy()
	if (e.code === "KeyV" && e.ctrlKey) Buffer.paste()
	if (e.code === "KeyD" && e.ctrlKey) Buffer.duplicate()
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
		if (!selected_widget || selected_widget.classList.contains("line-anchor")) return
		this._buffer.from_folder_path = selected_widget.dataset.path.replace(selected_widget.dataset.name, "")
		this._buffer.widget_name = selected_widget.dataset.name
		selected_widget.classList.add("cutted_widget")
		this._status = "cutted"
	},
	copy() {
		const selected_widget = document.querySelector(".selected_widget")
		if (!selected_widget || selected_widget.classList.contains("line-anchor")) return
		this._buffer.from_folder_path = selected_widget.dataset.path.replace(selected_widget.dataset.name, "")
		this._buffer.widget_name = selected_widget.dataset.name
		this._status = "copied"
	},
	async paste() {
		if (!["cutted", "copied"].includes(this._status)) return
		this._buffer.to_folder_path = selected_folder_path
		const {to_pile} = this._status === "cutted" ? await Move_widget(this._buffer) : await Copy_widget(this._buffer)
		emit("Update_folder", {folder_path: selected_folder_path, pile: to_pile})
		this.clean()
	},
	duplicate() {
		this.copy()
		this.paste()
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
			if (document.querySelector(".line.element")) emit("Update_line_position")
		},
		end(event) {
			const widget_name = event.currentTarget.dataset.name
			const folder_path = event.currentTarget.dataset.path.replace(widget_name, "")
			Update_widget(folder_path, widget_name, {position: {x: +event.target.style.left.replace("px", ""), y: +event.target.style.top.replace("px", "")}})
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
			if (document.querySelector(".line.element")) emit("Update_line_position")
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
	ondropactivate: (event) => {
		if (event.target !== event.relatedTarget.parentElement.parentElement) {
			event.target.classList.add('drop-active')
		}
	},
	ondragenter: (event) => {
		if (event.target !== event.relatedTarget.parentElement.parentElement) {
			event.target.classList.add('drop-target')
			event.relatedTarget.classList.add('can-drop')
		}
	},
	ondragleave: (event) => {
		event.target.classList.remove('drop-target')
		event.relatedTarget.classList.remove('can-drop')
	},
	ondrop: async (event) => {
		if (event.target !== event.relatedTarget.parentElement.parentElement) {
			const dropzone_position = {x: +event.target.style.left.replace("px", ""), y: +event.target.style.top.replace("px", "")}
			const dropwidget_position = {x: +event.relatedTarget.style.left.replace("px", ""), y: +event.relatedTarget.style.top.replace("px", "")}
			const new_widget_position = {
				x: dropwidget_position.x - dropzone_position.x,
				y: dropwidget_position.y - dropzone_position.y,
			}
			
			const widget_name = event.relatedTarget.dataset.name
			const from_folder_path = await join(event.relatedTarget.dataset.path.replace(widget_name, ""))
			const to_folder_path = event.target.dataset.path

			if (event.target.classList.contains("container")) {
				await Update_widget(from_folder_path, widget_name, {position: new_widget_position})
			}

			const {from_pile, to_pile} = await Move_widget({
				from_folder_path,
				widget_name,
				to_folder_path,
			})
			emit("Update_folder", {folder_path: from_folder_path, pile: from_pile})
			if (event.target.classList.contains("container")) {
				emit("Update_folder", {folder_path: to_folder_path, pile: to_pile})
			}
		}
	},
	ondropdeactivate: (event) => {
		event.target.classList.remove('drop-active')
		event.target.classList.remove('drop-target')
		event.relatedTarget.classList.remove('can-drop')
	}
})

interact('.line-anchor')
.draggable({
	listeners: {
		move(event) {
			event.target.style.left = +event.target.style.left.replace("px", "") + event.delta.x + "px"
			event.target.style.top = +event.target.style.top.replace("px", "") + event.delta.y + "px"
			emit("Update_line_position")
		},
		async end(event) {
			const widget_name = event.currentTarget.dataset.name
			const folder_path = event.currentTarget.dataset.path.replace(widget_name, "")
			const line = event.currentTarget.dataset.lineAnchorKind
			const anchor_position = {x: +event.currentTarget.style.left.replace("px", ""), y: +event.currentTarget.style.top.replace("px", "")}
			const line_pos = {[line]: anchor_position}
			await Update_widget(folder_path, widget_name, line_pos)
		}
	}
})
interact('.connector-zone').dropzone({
	accept: '.line-anchor',
	overlap: 0.10,
	ondropactivate: (event) => {
		if (event.target !== event.relatedTarget.parentElement.parentElement) {
			event.target.classList.add('drop-active')
		}
	},
	ondragenter: (event) => {
		if (event.target !== event.relatedTarget.parentElement.parentElement) {
			event.target.classList.add('drop-target')
			event.relatedTarget.classList.add('can-drop')
		}
	},
	ondragleave: (event) => {
		event.target.classList.remove('drop-target')
		event.relatedTarget.classList.remove('can-drop')
	},
	ondrop: async (event) => {
		if (event.target !== event.relatedTarget.parentElement.parentElement && !event.relatedTarget.classList.contains("shape")) {

			const anchor_kind = event.relatedTarget.dataset.lineAnchorKind
			const widget_name = event.relatedTarget.dataset.name
			const connection_name = event.target.dataset.name
			emit("Connect_widget", {widget_name, anchor_kind, connection_name })
			console.log(selected_folder_path, widget_name, {[anchor_kind]: connection_name})
			setTimeout(async () => {
				await Update_widget(selected_folder_path, widget_name, {[anchor_kind]: connection_name})
			}, 100)

		}
	},
	ondropdeactivate: (event) => {
		event.target.classList.remove('drop-active')
		event.target.classList.remove('drop-target')
		event.relatedTarget.classList.remove('can-drop')
	}
})
</script>