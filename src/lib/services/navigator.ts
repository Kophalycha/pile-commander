import { exists, mkdir } from '@tauri-apps/plugin-fs'
import { join, documentDir, sep } from '@tauri-apps/api/path'
import { Folder_config } from './folder_config'

/////////////////////////////////// Navigator //////////////////////////////////////

let ROOT_FOLDER_PATH = localStorage.getItem("ROOT_FOLDER_PATH")
let SEPARATOR = localStorage.getItem("SEPARATOR")
let current_folder_path = ""

function set_breadcrumbs() {
	const crumbs = current_folder_path.replace(ROOT_FOLDER_PATH, "").split(SEPARATOR)
	crumbs.shift()
	return crumbs.reduce(
		(accumulator, folder_name) => {
			return [...accumulator, {
			name: folder_name,
			path: accumulator.at(-1).path + SEPARATOR + folder_name
			}]
		},
		[{
			name: "Home",
			path: ROOT_FOLDER_PATH
		}]
	)
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
	current_folder_path = folder_absolute_path
	const breadcrumbs = set_breadcrumbs()
    return [folder_absolute_path, folder_name, readed_folder_config, breadcrumbs]
}