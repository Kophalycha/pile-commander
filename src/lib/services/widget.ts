import { exists, mkdir, rename } from '@tauri-apps/plugin-fs'
import { join } from '@tauri-apps/api/path'
import { Folder_config } from './folder_config'

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
            	await Folder_config(new_widget_path).init()
                break
        }
        return await Folder_config(folder_path).create_widget(new_widget)
	}
}

export async function Move_widget(buffer: {
	from_folder_path: string,
	widget_name: string,
	to_folder_path: string,
}) {
	const old_widget_path = await join(buffer.from_folder_path, buffer.widget_name)
	const new_widget_path = await join(buffer.to_folder_path, buffer.widget_name)
	const is_exists = await exists(new_widget_path)
	if (is_exists) {
		throw new Error("Такое имя в перетаскиваемой папке уже есть, дайте другое имя")
	} else {
		await rename(old_widget_path, new_widget_path)
		return await Folder_config(buffer.from_folder_path).move_child(buffer.widget_name, buffer.to_folder_path)
	}
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