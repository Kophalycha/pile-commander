<section class="surface" {onclick} {ondblclick}>
    {#each widgets as widget(widget.name)}
        {#if widget.type === "folder"}
            <Folder {widget}
                selected={selected(widget.name)}
                onselect={(e) => onselect(e, widget.name)}
                onshow={() => onshow(widget.path)}
            />
        {:else if widget.type === "note"}
            <Note {widget} 
                selected={selected(widget.name)}
                onselect={(e) => onselect(e, widget.name)}
                {onread}
                {onwrite}
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
import Folder from "$lib/ui/Folder.svelte"
import Note from "$lib/ui/Note.svelte"

let { widgets, onclick, ondblclick, selected, onselect, onread, onwrite, onshow } = $props()
</script>
