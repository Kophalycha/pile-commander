import { exists, mkdir } from '@tauri-apps/plugin-fs'
import { join, documentDir, sep } from '@tauri-apps/api/path'
import { Folder_config } from './folder_config'

/////////////////////////////////// Navigator //////////////////////////////////////

let ROOT_FOLDER_PATH = localStorage.getItem("ROOT_FOLDER_PATH")
let SEPARATOR = localStorage.getItem("SEPARATOR")
let current_folder_path = ""

function get_breadcrumbs(folder_absolute_path: string) {
	return folder_absolute_path.replace(ROOT_FOLDER_PATH, "Home")?.split(SEPARATOR)
}
export async function get_crumb_path(crumbs_index: number) {
	const breadcrumbs = get_breadcrumbs(current_folder_path)
	return await join(ROOT_FOLDER_PATH, ...breadcrumbs.slice(1, crumbs_index))
}

export async function StartUp() {
	if (!ROOT_FOLDER_PATH || !SEPARATOR) {
		ROOT_FOLDER_PATH = await join(await documentDir(), "Pile Commander")
		localStorage.setItem("ROOT_FOLDER_PATH", ROOT_FOLDER_PATH)
		SEPARATOR = sep()
		localStorage.setItem("SEPARATOR", SEPARATOR)
	}
    if (!await exists(ROOT_FOLDER_PATH)) {
        await mkdir(ROOT_FOLDER_PATH)
        await Folder_config(ROOT_FOLDER_PATH).init()
    }
    return await Show_folder(ROOT_FOLDER_PATH)
}

export async function Show_folder(folder_absolute_path: string) {
    const readed_folder_config: FolderConfig = await Folder_config(folder_absolute_path).read()
    const folder_name = folder_absolute_path.split(SEPARATOR).at(-1)
	const breadcrumbs = get_breadcrumbs(folder_absolute_path)
	current_folder_path = folder_absolute_path
    return [folder_absolute_path, folder_name, readed_folder_config, breadcrumbs]
}
export async function Go_to_folder(crumbs_index: number) {
	return await Show_folder(await get_crumb_path(crumbs_index))
}