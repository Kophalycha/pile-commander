import { exists, mkdir, rename, remove } from '@tauri-apps/plugin-fs'
import { join, dirname } from '@tauri-apps/api/path'
import { Folder_config } from './folder_config'
import { Write_note } from "./note"

function make(payload: Partial<Widget>) {
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
    return {...generic_widget, ...typed_records[type], ...payload}  
}
export async function Create_widget(folder_path: WidgetName, payload: Partial<Widget>) {
    const new_widget = make(payload)
	const new_widget_path = await join(folder_path, new_widget.name) // fc.join()
	const is_exists = await exists(new_widget_path) // fc.exists()
	if (is_exists) {
		throw new Error("Такое имя уже есть, дайте другое имя")
	} else {
        switch (new_widget.type) {
            case "note":
                await Write_note(new_widget.name, "")
                break
            case "folder":
                await mkdir(new_widget_path)
            	await Folder_config(new_widget_path).init()
                break
        }
        return await Folder_config(folder_path).create_widget(new_widget)
	}
}