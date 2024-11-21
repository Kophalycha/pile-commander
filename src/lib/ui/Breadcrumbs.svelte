{#if breadcrumbs?.length > 1}
    <nav>
        {#each breadcrumbs as {name, path}(path)}
            {#if name !== current_folder_name}
                <button
                    onclick={() => onclick(path)}
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
{/if}

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
const { breadcrumbs, onclick } = $props()
let current_folder_name = $derived(breadcrumbs?.at(-1).name)
</script>