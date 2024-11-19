import { join } from '@tauri-apps/api/path'
import { exists, rename, remove } from '@tauri-apps/plugin-fs'
import { Folder_config } from './folder_config'
import { folder_explorer } from "../store"
import { get_crumb_path } from './navigator'

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


export async function Drag_widget(buffer: {
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
		const {to_config} = await Folder_config(buffer.from_folder_path).move_child(buffer.widget_name, buffer.to_folder_path)
		folder_explorer.update_explorer(to_config)
	}
}
export async function Move_to_folder(from_folder_name: string, to_folder_name: string) {
	const current_path = folder_explorer.selected_folder_path
	const old_folder_path = await join(current_path, from_folder_name)
	const new_folder_path = await join(current_path, to_folder_name, from_folder_name)
	const move_to_folder_path = await join(current_path, to_folder_name)
	const is_exists = await exists(new_folder_path)
	if (is_exists) {
		throw new Error("Такое имя в перетаскиваемой папке уже есть, дайте другое имя")
	} else {
		await rename(old_folder_path, new_folder_path)
		const {from_config} = await Folder_config(current_path).move_child(from_folder_name, move_to_folder_path)
		folder_explorer.update_explorer(from_config)
	}
}
export async function Drop_to_folder(folder_crumb_index: number, widget_name: WidgetName) {
	const from_folder_path = folder_explorer.selected_folder_path
	const to_folder_path = await get_crumb_path(folder_crumb_index)
	const old_widget_path = await join(from_folder_path, widget_name)
	const new_widget_path = await join(to_folder_path, widget_name)
	const is_exists = await exists(new_widget_path)
	if (is_exists) {
		throw new Error("Такое имя в перетаскиваемой папке уже есть, дайте другое имя")
	} else {
		await rename(old_widget_path, new_widget_path)
		const {from_config} = await Folder_config(from_folder_path).move_child(widget_name, to_folder_path)
		folder_explorer.update_explorer(from_config)
	}
}