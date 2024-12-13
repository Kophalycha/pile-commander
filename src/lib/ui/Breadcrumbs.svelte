<nav>
    {#each breadcrumbs as {name, path}, i(path)}
        {#if i !== breadcrumbs.length - 1}
            <button
                onclick={() => emit("Show_folder", {folder_path: path})}
                data-path={path}
                class="dropzone"
            >
                <span>{name}</span>
            </button>
        {:else}
            {name}
        {/if}
    {/each}
</nav>

<style>
nav {
    position: fixed;
    left: 30px;
    bottom: 30px;
    z-index: 9999;
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
const { root_folder_path, separator, selected_folder_path } = $props()

// breadcrumbs: { name: string, path: string }[]
const breadcrumbs = $derived.by(() => {
    const crumbs = selected_folder_path?.replace(root_folder_path, "").split(separator)
    crumbs?.shift()
    return crumbs?.reduce(
        (accumulator, folder_name) => [...accumulator, {
            name: folder_name,
            path: accumulator.at(-1)?.path + separator + folder_name
        }],
        [{
            name: "Home",
            path: root_folder_path
        }]
    ) || []
})

let current_folder_name = $derived(breadcrumbs?.at(-1).name)
</script>