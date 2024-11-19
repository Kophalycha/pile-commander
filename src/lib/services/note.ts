import { join } from '@tauri-apps/api/path'
import { folder_explorer } from "../store"
import { writeTextFile, readTextFile } from '@tauri-apps/plugin-fs'

export async function Read_note(note_name: string, group_name?: string) {
	const current_path = group_name ? await join(folder_explorer.selected_folder_path, group_name) : folder_explorer.selected_folder_path
	const note_path = await join(current_path, note_name)
	return await readTextFile(note_path)

}
export async function Write_note(note_name: string, note_text: string) {
	const note_path = await join(folder_explorer.selected_folder_path, note_name)
	await writeTextFile(note_path, note_text)
}