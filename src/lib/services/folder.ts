import { join } from '@tauri-apps/api/path'
import { exists, rename, remove } from '@tauri-apps/plugin-fs'
import { Folder_config } from './folder_config'
import { folder_explorer } from "../store"

export async function Rename_folder(old_folder_name: string, new_folder_name: string) {
	const current_path = folder_explorer.selected_folder_path
	const old_folder_path = await join(current_path, old_folder_name)
	const new_folder_path = await join(current_path, new_folder_name)
	const is_exists = await exists(new_folder_path)
	if (is_exists) {
		throw new Error("Такое имя уже есть, дайте другое имя")
	} else {
		await rename(old_folder_path, new_folder_path)
		const new_folder_config = await Folder_config(current_path).update_child(old_folder_name, { name: new_folder_name })
		folder_explorer.deselect_widget()
		folder_explorer.update_explorer(new_folder_config)
	}
}
export async function Update_folder(folder_name: string, payload: Partial<Widget>, group_name?: WidgetName) {
	const folder_path = group_name ? await join(folder_explorer.selected_folder_path, group_name) : folder_explorer.selected_folder_path
	const new_folder_config = await Folder_config(folder_path).update_child(folder_name, payload)
	if (!group_name) folder_explorer.update_explorer(new_folder_config)
}
export async function Remove_folder(folder_name: string) {
	const folder_path = await join(folder_explorer.selected_folder_path, folder_name)
	await remove(folder_path, { recursive: true })
	const new_folder_config = await Folder_config(folder_explorer.selected_folder_path).remove_child(folder_name)
	folder_explorer.deselect_widget()
	folder_explorer.update_explorer(new_folder_config)
}


//////////////////////////////////////////////////////////////////////////////////////////

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