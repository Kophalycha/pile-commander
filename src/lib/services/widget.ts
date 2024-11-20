import { exists, mkdir, rename, remove } from '@tauri-apps/plugin-fs'
import { join } from '@tauri-apps/api/path'
import { Folder_pile } from './folder_pile'

async function make(folder_path: WidgetName, payload: Partial<Widget>) {
    const type = payload.type
    const generic_widget = {
        type,
        position: {x: 30, y: 30},
        size: {width: 100, height: 80},
    }
    const typed_records = {
        "note": {
            name: `unnamed_note_${+new Date()}.md`,
        },
        "folder": {
            name: `New folder ${+new Date()}`,
            widgets: [],
        },
    }
    const path = await join(folder_path, typed_records[type].name)
    return {...generic_widget, ...typed_records[type], ...payload, path}  
}
export async function Create_widget(folder_path: WidgetName, payload: Partial<Widget>) {
    const new_widget = await make(folder_path, payload)
	const new_widget_path = await join(folder_path, new_widget.name) // fc.join()
	const is_exists = await exists(new_widget_path) // fc.exists()
	if (is_exists) {
		throw new Error("Такое имя уже есть, дайте другое имя")
	} else {
        switch (new_widget.type) {
            case "note":
                await Write_widget(new_widget.name, "")
                break
            case "folder":
                await mkdir(new_widget_path)
            	await Folder_pile(new_widget_path).init()
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
		return await Folder_pile(current_path).update_child(old_widget_name, { name: new_widget_name, path: new_widget_path})
	}
}
export async function Update_widget(folder_path: WidgetPath, widget_name: WidgetName, payload: Partial<Widget>) {
	await Folder_pile(folder_path).update_child(widget_name, payload)
}

export async function Move_widget(buffer: Buffer) {
	const old_widget_path = await join(buffer.from_folder_path, buffer.widget_name)
	const new_widget_path = await join(buffer.to_folder_path, buffer.widget_name)
	const is_exists = await exists(new_widget_path)
	if (is_exists) {
		throw new Error("Такое имя в перетаскиваемой папке уже есть, дайте другое имя")
	} else {
		await rename(old_widget_path, new_widget_path)
		return await Folder_pile(buffer.from_folder_path).move_child(buffer.widget_name, buffer.to_folder_path)
	}
}

export async function Remove_widget(folder_path: WidgetPath, widget_name: string) {
	const widget_path = await join(folder_path, widget_name)
	await remove(widget_path, { recursive: true })
	return await Folder_pile(folder_path).remove_child(widget_name)
}

//////////////////////////////////////////////////////////////////

import { folder_explorer } from "../store"
import { writeTextFile, readTextFile } from '@tauri-apps/plugin-fs'
export async function Read_widget(note_name: string) {
	const note_path = await join(folder_explorer.selected_folder_path, note_name)
	return await readTextFile(note_path)

}
export async function Write_widget(note_name: string, note_text: string) {
	const note_path = await join(folder_explorer.selected_folder_path, note_name)
	await writeTextFile(note_path, note_text)
}