{#if !is_root}
    <nav>
        {#each breadcrumbs as folder_name, i(folder_name)}
            {#if folder_name !== current_folder_name}
                <button onclick={() => Go_to_folder(i + 1)} data-index={i} class="breadcrumb" id="Home"><span>{folder_name}</span></button>
            {:else}
                {folder_name}
            {/if}
        {/each}
    </nav>
{/if}

<style>
nav {
    position: fixed;
    left: 30px;
    bottom: 30px;
}
nav button {
    border: none;
    font-size: medium;
    background-color: inherit;
    margin-right: 10px;
    box-sizing: border-box;
    transition-property: padding;
}
:global(nav button::after) {
    content: "/";
    margin-left: 20px;
    opacity: .3;
}
:global(nav button.dropzone.drop-active span) {
    background-color: white;
    box-sizing: border-box;
    padding: 20px;
    opacity: 1;
}
</style>

<script>
import { Go_to_folder } from "$lib/services/folder"
const {breadcrumbs} = $props()
let current_folder_name = $derived(breadcrumbs?.at(-1))
let is_root = $derived(current_folder_name === "Home")
</script>