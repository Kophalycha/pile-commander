import { exists, mkdir } from '@tauri-apps/plugin-fs'
import { join, documentDir, sep } from '@tauri-apps/api/path'
import { Folder_config } from './folder_config'

/////////////////////////////////// Navigator //////////////////////////////////////

export async function StartUp() {

	// set_root_folder_path
	let ROOT_FOLDER_PATH = localStorage.getItem("ROOT_FOLDER_PATH")
	if (!ROOT_FOLDER_PATH || !localStorage.getItem("separator")) {
		ROOT_FOLDER_PATH = await join(await documentDir(), "Pile Commander")
		localStorage.setItem("ROOT_FOLDER_PATH", ROOT_FOLDER_PATH)
		localStorage.setItem("separator", sep())	
	}
	
    // check_root_folder
    if (!await exists(ROOT_FOLDER_PATH)) {
        await mkdir(ROOT_FOLDER_PATH)
        await Folder_config(ROOT_FOLDER_PATH).init()
        console.info("ROOT_FOLDER_PATH folder created")
    }

    return await Show_folder(ROOT_FOLDER_PATH)

}

let current_folder_path = ""

function get_breadcrumbs(folder_absolute_path: string) {
	const ROOT_FOLDER_PATH = localStorage.getItem("ROOT_FOLDER_PATH")
	const separator = localStorage.getItem("separator")
	return folder_absolute_path.replace(ROOT_FOLDER_PATH, "Home")?.split(separator)
}
export async function Show_folder(folder_absolute_path: string) {
    const readed_folder_config: FolderConfig = await Folder_config(folder_absolute_path).read()
    const folder_name = folder_absolute_path.split(localStorage.getItem("separator")).at(-1)

	const breadcrumbs = get_breadcrumbs(folder_absolute_path)
	current_folder_path = folder_absolute_path

    return [folder_absolute_path, folder_name, readed_folder_config, breadcrumbs]
}
export async function Go_to_folder(crumbs_index: number) {
	const ROOT_FOLDER_PATH = localStorage.getItem("ROOT_FOLDER_PATH")
	const breadcrumbs = get_breadcrumbs(current_folder_path)
	// navigator.get_crumb_path
	const folder_path = await join(ROOT_FOLDER_PATH, ...breadcrumbs.slice(1, crumbs_index))
	return await Show_folder(folder_path)
}