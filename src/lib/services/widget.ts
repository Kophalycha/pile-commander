import { exists, mkdir, rename, remove } from '@tauri-apps/plugin-fs'
import { join } from '@tauri-apps/api/path'
import { Folder_pile } from './folder_pile'
import { writeTextFile, writeFile } from '@tauri-apps/plugin-fs'

async function make(folder_path: WidgetName, payload: Partial<Widget>) {
	const type = payload.type || "note"
	const generic_widget = {
		type,
		position: {x: 30, y: 30},
	}
	const typed_records = {
		"note": {
			name: `unnamed_note_${+new Date()}.md`,
			size: {width: 200, height: 120},
		},
		"folder": {
			name: `New folder ${+new Date()}`,
			size: {width: 200, height: 260}
		},
		"container": {
			name: `New container ${+new Date()}`,
			size: {width: 420, height: 380}
		},
	}
	console.log(folder_path, typed_records[type].name)
	const path = await join(folder_path, typed_records[type].name)
	return {...generic_widget, ...typed_records[type], ...payload, path}
}
export async function Create_widget(folder_path: WidgetName, payload: Partial<Widget>) {
	const new_widget = await make(folder_path, payload)
	const is_exists = await exists(new_widget.path)
	if (is_exists) {
		throw new Error("Такое имя уже есть, дайте другое имя")
	} else {
		switch (new_widget.type) {
			case "note":
				await writeTextFile(new_widget.path, "")
				break
			case "folder":
			case "container":
				await mkdir(new_widget.path)
				const view = new_widget.type === "container" ? "stack" : "board"
				await Folder_pile(new_widget.path).init(view)
				break
		}
		return await Folder_pile(folder_path).create_widget(new_widget)
	}
}

export async function Rename_widget(current_path: string, old_widget_name: string, new_widget_name: string) {
	const old_widget_path = await join(current_path, old_widget_name)
	const new_widget_path = await join(current_path, new_widget_name)
	const is_exists = await exists(new_widget_path)
	if (is_exists) {
		throw new Error("Такое имя уже есть, дайте другое имя")
	} else {
		await rename(old_widget_path, new_widget_path)
		return await Folder_pile(current_path).update_widget(old_widget_name, { name: new_widget_name, path: new_widget_path})
	}
}
export async function Update_widget(folder_path: WidgetPath, widget_name: WidgetName, payload: Partial<Widget>) {
	return await Folder_pile(folder_path).update_widget(widget_name, payload)
}

export async function Reorder_widgets(folder_path: WidgetPath, from_index: number, to_index: number) {
	return await Folder_pile(folder_path).reorder_widgets(from_index, to_index)
}

export async function Move_widget(buffer: Buffer) {
	const old_widget_path = await join(buffer.from_folder_path, buffer.widget_name)
	const new_widget_path = await join(buffer.to_folder_path, buffer.widget_name)
	const is_exists = await exists(new_widget_path)
	if (is_exists) {
		throw new Error("Такое имя в перетаскиваемой папке уже есть, дайте другое имя")
	} else {
		await rename(old_widget_path, new_widget_path)
		return await Folder_pile(buffer.from_folder_path).move_widget(buffer.widget_name, buffer.to_folder_path)
	}
}

export async function Remove_widget(folder_path: WidgetPath, widget_name: string) {
	const widget_path = await join(folder_path, widget_name)
	await remove(widget_path, { recursive: true })
	return await Folder_pile(folder_path).remove_widget(widget_name)
}


export async function Change_view(folder_path: WidgetPath, view: ViewType) {
	return await Folder_pile(folder_path).change_view(view)
}
export async function Set_folder_option(folder_path: WidgetPath, option: {}) {
	return await Folder_pile(folder_path).set_option(option)
}

export async function Upload_image(folder_path: WidgetPath, image_name: string, data: Uint8Array, position?: Position) {
	const image_path = await join(folder_path, image_name)
	await writeFile(image_path, data)
	const image_widget = {
		type: <WidgetType>"image",
		name: image_name,
		position: position || {x: 30, y: 30},
		size: {width: 200, height: 200},
		path: image_path
	}
	return await Folder_pile(folder_path).create_widget(image_widget)
}