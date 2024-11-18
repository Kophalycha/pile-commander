import { exists, mkdir } from '@tauri-apps/plugin-fs'
import { join, documentDir, sep } from '@tauri-apps/api/path'
import { Folder_config } from './folder_config'
import type { FolderExplorerStore } from '$lib/store/explorer.svelte'

export async function StartUp(folder_explorer: FolderExplorerStore) {

    // set_root_folder_path
    const documentDirPath = await documentDir()
    const ROOT_FOLDER_NAME = "Pile Commander"
    const ROOT_FOLDER_PATH = await join(documentDirPath, ROOT_FOLDER_NAME)

    // check_root_folder
    const is_exists = await exists(ROOT_FOLDER_PATH)
    let config: FolderConfig
    if (!is_exists) {
        await mkdir(ROOT_FOLDER_PATH)
        config = await Folder_config(ROOT_FOLDER_PATH).init()
        console.info("ROOT_FOLDER_PATH folder created")
    } else {
        config = await Folder_config(ROOT_FOLDER_PATH).read()
        console.info("ROOT_FOLDER_PATH exists")
    }

    // explorer_store_init
    folder_explorer.init(ROOT_FOLDER_PATH, sep())
    folder_explorer.show_folder(ROOT_FOLDER_PATH, ROOT_FOLDER_NAME, config)

}