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
            <button
                onclick={() => emit("Widget_selected", {widget: {type: "crumb",name, path}})}>
                {name} &nbsp;&nbsp;
                &middot; &middot; &middot;
            </button>
            {/if}
    {/each}
</nav>

<style>
nav {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 9999;
    background-color: #eee;
    box-sizing: border-box;
    padding: 8px 15px;
    height: 49px;
}
nav button {
    border: none;
    font-size: medium;
    background-color: inherit;
    box-sizing: border-box;
    transition-property: padding;
    outline: none;
}
:global(nav button:not(:last-child):after) {
    content: "/";
    margin-left: 20px;
    opacity: .3;
}
:global(nav button.dropzone.drop-active span) {
    background-color: white;
    box-sizing: border-box;
    padding: 20px;
    opacity: 1;
    outline: 3px solid orange;
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