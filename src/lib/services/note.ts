import { join } from '@tauri-apps/api/path'
import { exists } from '@tauri-apps/plugin-fs'
import { Folder_config } from './folder_config'
import { folder_explorer } from "../store"
import { writeTextFile, readTextFile } from '@tauri-apps/plugin-fs'

export async function Create_note(position: Position = {x: 30, y: 30}) {
	const default_note_name = `unnamed_note_${+new Date()}.md`
	const new_folder_path = await join(folder_explorer.selected_folder_path, default_note_name)
	const is_exists = await exists(new_folder_path)
	if (is_exists) {
		throw new Error("Такое имя уже есть, дайте другое имя")
	} else {
		await Write_note(default_note_name, "")
		const new_folder_config = await Folder_config(folder_explorer.selected_folder_path).create_child("note", { name: default_note_name, position })
		folder_explorer.update_explorer(new_folder_config)
	}
}
export async function Read_note(note_name: string, group_name?: string) {
	const current_path = group_name ? await join(folder_explorer.selected_folder_path, group_name) : folder_explorer.selected_folder_path
	const note_path = await join(current_path, note_name)
	return await readTextFile(note_path)

}
export async function Write_note(note_name: string, note_text: string) {
	const note_path = await join(folder_explorer.selected_folder_path, note_name)
	await writeTextFile(note_path, note_text)
}