import { exists, mkdir } from '@tauri-apps/plugin-fs'
import { join, documentDir, sep } from '@tauri-apps/api/path'
import { Folder_pile } from '$lib/services/folder_pile'

export async function load() {
	let ROOT_FOLDER_PATH = localStorage.getItem("ROOT_FOLDER_PATH")
	let SEPARATOR = localStorage.getItem("SEPARATOR")
	if (!ROOT_FOLDER_PATH || !SEPARATOR) {
		ROOT_FOLDER_PATH = await join(await documentDir(), "Pile Commander")
		localStorage.setItem("ROOT_FOLDER_PATH", ROOT_FOLDER_PATH)
		SEPARATOR = sep()
		localStorage.setItem("SEPARATOR", SEPARATOR)
	}
	if (!await exists(ROOT_FOLDER_PATH)) {
		await mkdir(ROOT_FOLDER_PATH)
		await Folder_pile(ROOT_FOLDER_PATH).init()
	}
	return { ROOT_FOLDER_PATH, SEPARATOR }
}