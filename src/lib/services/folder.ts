import { join } from '@tauri-apps/api/path'
import { exists, rename, remove } from '@tauri-apps/plugin-fs'
import { Folder_config } from './folder_config'
import { folder_explorer } from "../store"

export async function Remove_folder(folder_name: string) {
	const folder_path = await join(folder_explorer.selected_folder_path, folder_name)
	await remove(folder_path, { recursive: true })
	const new_folder_config = await Folder_config(folder_explorer.selected_folder_path).remove_child(folder_name)
	folder_explorer.update_explorer(new_folder_config)
}