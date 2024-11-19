<FolderEditor widgets={folder_explorer.selected_folder_config?.widgets} {onclick} {ondblclick} />
<Breadcrumbs breadcrumbs={folder_explorer.breadcrumbs} onclick={(i: number) => Go_to_folder(i + 1)} />

<script lang="ts">
import { StartUp } from "$lib/services"
import { folder_explorer } from "$lib/store"
StartUp(folder_explorer)

import "./app.css"
import "./interactable"
import Breadcrumbs from "$lib/ui/Breadcrumbs.svelte"

import { Create_folder, Rename_folder, Update_folder, Remove_folder, Go_to_folder } from "$lib/services/folder"
import { Create_note } from "$lib/services/note"

import FolderEditor from "$lib/ui/FolderEditor.svelte"
function onclick() {
    folder_explorer.deselect_widget()
}
function ondblclick(e: MouseEvent) {
    //@ts-ignore
    if (e.target.classList.contains("surface")) {
        const position = {x: e.x, y: e.y}
        e.shiftKey ? onCreate(position) : Create_note(position)
    }
}
async function onCreate(position: Position) {
    try {
        let name = prompt("Enter folder name", "New folder")
        if (name) await Create_folder({name, position})
    } catch (error) {
        if (error instanceof Error) {
            alert(error.message)
            onCreate(position)
        }
    }
}


async function onRename() {
    if (!folder_explorer.selected_widget) return
    try {
        let new_folder_name = prompt("Enter new folder name", folder_explorer.selected_widget)
        if (new_folder_name) await Rename_folder(folder_explorer.selected_widget, new_folder_name)
    } catch (error) {
        if (error instanceof Error) {
            alert(error.message)
            onRename()
        }
    }
}
async function onUpdate(payload: Partial<Widget>) {
    if (!folder_explorer.selected_widget) return
    Update_folder(folder_explorer.selected_widget, payload)
}
async function onRemove() {
    if (!folder_explorer.selected_widget) return
    let is_remove = confirm("Are you sure remove?")
    if (is_remove) await Remove_folder(folder_explorer.selected_widget)
}

document.addEventListener("keydown", e => {
    if (e.key === "Delete") onRemove()
    if (e.code === "KeyX" && e.ctrlKey) folder_explorer.cut()
    if (e.code === "KeyV" && e.ctrlKey) folder_explorer.paste()
})
</script>