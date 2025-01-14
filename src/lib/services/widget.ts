import { exists, mkdir, rename, copyFile, remove } from '@tauri-apps/plugin-fs'
import { join } from '@tauri-apps/api/path'
import { Folder_pile } from './folder_pile'
import { writeTextFile, writeFile } from '@tauri-apps/plugin-fs'

async function make(folder_path: WidgetName, payload: Partial<Widget>) {
	const type = payload.type || "text"
	const generic_widget = {
		type,
		position: {x: 30, y: 30},
	}
	const typed_records = {
		"text": {
			name: `${+new Date()}.md`,
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
		throw new Error("This name already exists, please give another name")
	} else {
		switch (new_widget.type) {
			case "text":
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
		throw new Error("This name already exists, please give another name")
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

export async function Copy_widget(buffer: Buffer) {
	const old_widget_path = await join(buffer.from_folder_path, buffer.widget_name)
	const new_widget_name = `${+new Date()}.${buffer.widget_name.split(".")[1]}`
	const new_widget_path = await join(buffer.to_folder_path, new_widget_name)
	try {
		await copyFile(old_widget_path, new_widget_path)
	} catch (error) {
		console.log(error)
	}
	return await Folder_pile(buffer.from_folder_path).copy_widget(buffer.widget_name, buffer.to_folder_path, new_widget_name, new_widget_path)
}
export async function Move_widget(buffer: Buffer) {
	const old_widget_path = await join(buffer.from_folder_path, buffer.widget_name)
	const new_widget_path = await join(buffer.to_folder_path, buffer.widget_name)
	const is_exists = await exists(new_widget_path)
	if (is_exists) {
		throw new Error("There is already such a name in the dragged folder, please give it a different name")
	} else {
		try {
			await rename(old_widget_path, new_widget_path)
		} catch (error) {
			console.log(error)
		}
		return await Folder_pile(buffer.from_folder_path).move_widget(buffer.widget_name, buffer.to_folder_path)
	}
}

export async function Remove_widget(folder_path: WidgetPath, widget_name: string) {
	const widget_path = await join(folder_path, widget_name)
	const is_exists = await exists(widget_path)
	if (is_exists) await remove(widget_path, { recursive: true })
	return await Folder_pile(folder_path).remove_widget(widget_name)
}


export async function Change_view(folder_path: WidgetPath, view: ViewType) {
	return await Folder_pile(folder_path).change_view(view)
}
export async function Set_folder_option(folder_path: WidgetPath, option: {}) {
	return await Folder_pile(folder_path).set_option(option)
}

export async function Upload_file(folder_path: WidgetPath, type: WidgetType, filename: string, data: Uint8Array, position?: Position) {
	const file_name = `${+new Date()}.${filename.split(".")[1]}`
	const file_path = await join(folder_path, file_name)
	await writeFile(file_path, data)
	const file_widget = {
		type,
		name: file_name,
		position: position || {x: 30, y: 30},
		size: {width: 200, height: 200},
		path: file_path
	}
	return await Folder_pile(folder_path).create_widget(file_widget)
}
export async function Add_shape(folder_path: WidgetPath, shape_kind: "rect" | "circle" | "line", position?: Position) {
	const name = `${+new Date()}.svg`
	const image_path = await join(folder_path, name)
	const image_widget = shape_kind === "line" ? {
		type: shape_kind,
		name,
		start: {x: 30, y: 30},
		end: {x: 230, y: 130},
		path: image_path,
		stroke: {
			width: 4,
			style: "solid",
			color: "coral",
			is_animate: false,
			curve: "fluid",
			startPlug: "behind",
			endPlug: "arrow1",
		},
	} : {
		type: <WidgetType>shape_kind,
		name,
		position: position || {x: 30, y: 30},
		size: {width: 200, height: 200},
		path: image_path,
		stroke: {
			width: 3,
			style: "solid",
			color: "black"
		}
	}
	return await Folder_pile(folder_path).create_widget(image_widget)
}
export async function Create_path(folder_path: WidgetPath, svg_text: string, position: Position, size: Size) {
	const file_name = `${+new Date()}.svg`
	const file_path = await join(folder_path, file_name)
	await writeTextFile(file_path, svg_text)
	const path_widget = {
		type: <WidgetType>"path",
		name: file_name,
		position: position || {x: 30, y: 30},
		size: size || {width: 200, height: 200},
		path: file_path
	}
	return await Folder_pile(folder_path).create_widget(path_widget)
}