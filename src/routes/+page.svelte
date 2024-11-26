{#if explorer.selected_folder_path}
	<Container
		fullscreen
		path={explorer.selected_folder_path}
		{explorer}
	/>
	<Breadcrumbs
		breadcrumbs={explorer.breadcrumbs}
		onclick={folder_path => {
			document.dispatchEvent(new CustomEvent("show_folder", { detail: {
				folder_path
			}}))
		}}
	/>
{/if}

<script>
import "./app.css"
import Container from "$lib/ui/Container.svelte"
import Breadcrumbs from "$lib/ui/Breadcrumbs.svelte"
import { join } from '@tauri-apps/api/path'
import { Rename_widget, Update_widget, Remove_widget, Move_widget } from "$lib/services/widget"

let { data } = $props()
import { ExplorerStore } from "$lib/store/explorer.svelte"
let explorer = new ExplorerStore(data.ROOT_FOLDER_PATH, data.SEPARATOR)

document.addEventListener("click", e => {
	document.dispatchEvent(new CustomEvent("select_widget", { detail: {
		widget_path: e.target.dataset.path
	}}))
})

async function onRename() {
	const selected_widget = document.querySelector(".selected_widget")
	if (!selected_widget) return
	try {
		const folder_path = selected_widget.parentElement.closest(".container").dataset.path
		let new_folder_name = prompt("Enter new folder name", selected_widget.dataset.name)
		if (new_folder_name) {
			const pile = await Rename_widget(folder_path, selected_widget.dataset.name, new_folder_name)
			explorer.update_explorer(pile)
			document.dispatchEvent(new CustomEvent("update_pile", { detail: {
				folder_path,
				pile
			}}))
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
		explorer.update_explorer(pile)
		document.dispatchEvent(new CustomEvent("update_pile", { detail: {
			folder_path,
			pile
		}}))
	}
}

document.addEventListener("keydown", async e => {
	if (e.key === "F2") onRename()
	if (e.key === "Delete") onRemove()
	if (e.code === "KeyX" && e.ctrlKey) explorer.cut()
	if (e.code === "KeyV" && e.ctrlKey) {
		explorer.paste()
		const {to_pile} = await Move_widget(explorer.buffer)
		explorer.update_explorer(to_pile)
		document.dispatchEvent(new CustomEvent("update_pile", { detail: {
			folder_path: explorer.selected_folder_path,
			pile: to_pile
		}}))
		explorer.clean()
	}
})


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
			Update_widget(folder_path, widget_name, {position: {x: event.rect.left, y: event.rect.top}})
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
		const widget_name = event.relatedTarget.dataset.name
		const from_folder_path = await join(event.relatedTarget.dataset.path.replace(widget_name, ""))
		const to_folder_path = event.target.dataset.path
		const {from_pile, to_pile} = await Move_widget({
			from_folder_path,
			widget_name,
			to_folder_path,
		})
		document.dispatchEvent(new CustomEvent("update_pile", { detail: {
			folder_path: from_folder_path,
			pile: from_pile
		}}))
		if (event.target.classList.contains("container")) {
			document.dispatchEvent(new CustomEvent("update_pile", { detail: {
				folder_path: to_folder_path,
				pile: to_pile
			}}))
		}
	},
	ondropdeactivate: (event) => {
		event.target.classList.remove('drop-active')
		event.target.classList.remove('drop-target')
		event.relatedTarget.classList.remove('can-drop')
	}
})
</script>