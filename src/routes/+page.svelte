<FolderEditor

    widgets={folder_explorer.selected_folder_pile?.widgets}
    onread={readTextFile}
    onwrite={writeTextFile}

    onshow={async folder_path => folder_explorer.show_folder(...await Show_folder(folder_path))}
    
    {onclick}
    {ondblclick}
    selected={widget_name => folder_explorer.selected_widget === widget_name}
    cutted={widget_name => folder_explorer.buffer.widget_name === widget_name}
    {onselect}

/>
<Breadcrumbs
    breadcrumbs={folder_explorer.breadcrumbs}
    onclick={async folder_path => folder_explorer.show_folder(...await Show_folder(folder_path))}
/>

<script>
import "./app.css"
import "./interactable"
import FolderEditor from "$lib/ui/FolderEditor.svelte"
import Breadcrumbs from "$lib/ui/Breadcrumbs.svelte"
import { writeTextFile, readTextFile } from '@tauri-apps/plugin-fs'
import { Create_widget, Rename_widget, Remove_widget } from "$lib/services/widget"
import { StartUp, Show_folder } from "$lib/services/navigator"
import { folder_explorer } from "$lib/store"
import { onMount } from "svelte"
onMount(async () => folder_explorer.show_folder(...await StartUp()))

function onclick() {
    folder_explorer.deselect_widget()
}
async function ondblclick(e) {
    //@ts-ignore
    if (e.target.classList.contains("surface")) {
        const type = e.shiftKey ? "folder" : "note"
        const position = {x: e.x, y: e.y}
        const new_folder_pile = await Create_widget(folder_explorer.selected_folder_path, {type, position})
        folder_explorer.update_explorer(new_folder_pile)
    }
}
function onselect(e, widget_name) {
    e.preventDefault()
    folder_explorer.select_widget(widget_name)
}
async function onRename() {
    if (!folder_explorer.selected_widget) return
    try {
        let new_folder_name = prompt("Enter new folder name", folder_explorer.selected_widget)
        if (new_folder_name) {
            const new_folder_pile = await Rename_widget(folder_explorer.selected_folder_path, folder_explorer.selected_widget, new_folder_name)
            folder_explorer.update_explorer(new_folder_pile)
        }
    } catch (error) {
        if (error instanceof Error) {
            alert(error.message)
            onRename()
        }
    }
}
async function onRemove() {
    if (!folder_explorer.selected_widget) return
    let is_remove = confirm("Are you sure remove?")
    if (is_remove) {
        const new_folder_pile = await Remove_widget(folder_explorer.selected_folder_path, folder_explorer.selected_widget)
        folder_explorer.update_explorer(new_folder_pile)
    }
}

document.addEventListener("keydown", e => {
    if (e.key === "Delete") onRemove()
    if (e.key === "F2") onRename()
    if (e.code === "KeyX" && e.ctrlKey) folder_explorer.cut()
    if (e.code === "KeyV" && e.ctrlKey) folder_explorer.paste()
})
</script>