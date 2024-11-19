<section class="surface" {onclick} {ondblclick}>
    {#each widgets as widget(widget.name)}
        {#if widget.type === "folder"}
            <Folder {widget}
                selected={selected(widget.name)}
                onselect={(e) => onselect(e, widget.name)}
                onshow={() => Show_folder(widget.name)}
            />
        {:else if widget.type === "note"}
            <Note {widget} 
                selected={selected(widget.name)}
                onselect={(e) => onselect(e, widget.name)}
                onread={Read_widget} onwrite={Write_widget}
            />
        {/if}
    {:else}
        <article>
            <p><span>Create note</span>&emsp;&ensp;Double click mouse</p>
            <p><span>Create folder</span>&emsp;Shift + double click mouse</p>
        </article>
    {/each}
</section>

<style>
section {
    position: relative;
    background: #f5f5f5;
    width: 100%;
    height: 100vh;
    user-select: none;
}
article {
    padding: 30px 40px;
}
article span {
    opacity: .5;
}
</style>

<script>
import { Read_widget, Write_widget } from "$lib/services/widget"
import { Show_folder } from "$lib/services/folder"
import Folder from "$lib/ui/Folder.svelte"
import Note from "$lib/ui/Note.svelte"

let { widgets, onclick, ondblclick, selected, onselect } = $props()
</script>
