import { join } from '@tauri-apps/api/path'
import { Folder_config } from './folder_config'

/////////////////////////////////// Navigator //////////////////////////////////////

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
	const folder_path = await join(ROOT_FOLDER_PATH, ...breadcrumbs.slice(1, crumbs_index))
	return await Show_folder(folder_path)
}