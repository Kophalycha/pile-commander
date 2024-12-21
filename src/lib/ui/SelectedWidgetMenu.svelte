{#snippet select_options(variants)}
    {#each variants as variant}
        <option value={variant}>{variant}</option>
    {/each}
{/snippet}
<section>
    <p>{widget.name}</p>
    {#if widget.type !== "crumb"}    
        <div> 
            <button onclick={onRename}>
                Rename
                <kbd>F2</kbd>
            </button>
            <button onclick={onRemove}>
                Remove
                <kbd>Del</kbd>
            </button>
        </div>
    {:else}
        {#snippet set_widget_type_icons(type)}
            <svelte:component this={widget_type_icons[type]} />
        {/snippet}
        <details open>
            <summary>Layers</summary>
            <br>
            <div bind:this={layers_element}>
                {#each pile?.widgets as widget}
                    <p>
                        <span class="layer-icon">
                            {@render set_widget_type_icons(widget.type)}
                        </span>
                        {widget.name}
                    </p>
                {/each}
            </div>
        </details>
    {/if}
    {#if widget.type === "folder"}
        <hr>
        <button onclick={() => update_widget({type: "container"})}>
            Change to container
        </button>
    {/if}
    {#if widget.type === "container"}
        <hr>
        <button onclick={() => update_widget({type: "folder"})}>
            Change to folder
        </button>
    {/if}
    {#if ["rect", "circle", "line"].includes(widget.type)}
        <hr>
        <p>
            Width: 
            <input type="number" bind:value={stroke_width}
                onchange={async () => {
                widget.stroke.width = stroke_width
                await update_line_stroke()
                if (widget.type === "line") emit("Update_line_stroke_width")
            }}>
        </p>
        <p>
            Style:
            <select bind:value={stroke_style} onchange={async () => {
                widget.stroke.style = stroke_style
                await update_line_stroke()
                if (widget.type === "line") emit("Update_line_stroke_style")
            }}>
                <option value="solid">solid</option>
                <option value="dashed">dashed</option>
                {#if widget.type !== "line"}
                    <option value="dotted">dotted</option>
                {/if}
            </select>
        </p>
        {#if widget.type === "line"}
            <p>
                Animate: 
                <input type="checkbox" bind:checked={stroke_is_animate} onchange={async () => {
                    widget.stroke.is_animate = stroke_is_animate
                    await update_line_stroke()
                    if (widget.type === "line") emit("Update_line_stroke_style")
                }}>
            </p>
            <p>
                Curve:
                <select bind:value={stroke_curve} onchange={async () => {
                    widget.stroke.curve = stroke_curve
                    await update_line_stroke()
                    if (widget.type === "line") emit("Update_line_stroke_curve")
                }}>
                    {@render select_options(variants["curve"])}
                </select>
            </p>
            <p>
                Start plug:
                <select bind:value={stroke_startPlug} onchange={async () => {
                    widget.stroke.startPlug = stroke_startPlug
                    await update_line_stroke()
                    if (widget.type === "line") emit("Update_line_stroke_startPlug")
                }}>
                    {@render select_options(variants["stroke_Plug"])}
                </select>
            </p>
            <p>
                End plug:
                <select bind:value={stroke_endPlug} onchange={async () => {
                    widget.stroke.endPlug = stroke_endPlug
                    await update_line_stroke()
                    if (widget.type === "line") emit("Update_line_stroke_endPlug")
                }}>
                    {@render select_options(variants["stroke_Plug"])}
                </select>
            </p>
        {/if}
        <details>
            <summary>Color</summary>
            <p>
                {#if widget.type !== "line"}
                    <button onclick={() => change_stroke_color("none")}>None</button>
                {/if}
                <button onclick={() => change_stroke_color("black")}>Black</button>
                <br><br>
                {#snippet color_ficker(color)}
                    <button style="background-color: {color};" onclick={() => change_stroke_color(color)}></button>
                {/snippet}
                <span class="colors-board">
                    {#each colors as color}
                        {@render color_ficker(color)}
                    {/each}
                </span>
            </p>
        </details>
    {/if}
    {#if pile && ["crumb", "container"].includes(widget.type)}
        <hr>
        View type: 
        <select bind:value={selected_view} onchange={async () => {
            pile = await Change_view(widget.path, selected_view)
            emit("Update_folder", {folder_path: widget.path, pile})
        }}>
            {@render select_options(variants["view_type"])}
        </select>
        {#if pile.view === "masonry"}
            <p>Columns: 
                <input type="number" min="2" max="10"
                        bind:value={pile_masonry_column}
                        onchange={set_masonry_column}>
            </p>
        {/if}
        {#if pile.view === "slides"}
            <p>Selected widget: 
                <input type="number" min="1" max={pile.widgets.length} 
                        bind:value={pile_selected_widget_index}
                        onchange={set_selected_widget_index}>
            </p>
        {/if}
    {/if}
    {#if !["line", "path", "image", "audio", "video"].includes(widget.type)}
        <hr>
        <details open>
            <summary>Background</summary>
            <p>
                <button onclick={() => change_background("none")}>None</button>
                <button onclick={() => change_background("white")}>White</button>
                <br><br>
                {#snippet color_ficker(color)}
                    <button style="background-color: {color};" onclick={() => change_background(color)}></button>
                {/snippet}
                <span class="colors-board">
                    {#each colors as color}
                        {@render color_ficker(color)}
                    {/each}
                </span>    
            </p>
        </details>
    {/if}
</section>
<style>
section {
    position: fixed;
    bottom: 80px;
    right: 20px;
    z-index: 9999;
    width: 250px;
    padding: 20px;
    background-color: #fff;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}
div > button:not(:last-child) {
    margin-right: 10px;
}
hr {
    border-top: 1px solid #eee;
    border-bottom: none;
}

input[type="number"] {
    width: 40px;
}

.colors-board {
    display: grid;
    grid-template-columns: repeat(6, auto);
    gap: 10px;
}
.colors-board > button {
    width: 30px;
    height: 30px;
}

.layer-icon {
    padding: 2px 5px 0 0;
    opacity: .3;
}
</style>

<script>
import { Update_widget, Reorder_widgets, Change_view, Set_folder_option } from "$lib/services/widget"
import { Folder_pile } from '$lib/services/folder_pile'
import Sortable from 'sortablejs'

let {folder_path, widget, onRename, onRemove} = $props()
let color_picker = $state()
let selected_color = $state(widget.background || "black")
let stroke_width = $state(widget.stroke?.width || 0)
let stroke_style = $state(widget.stroke?.style || "solid")
let stroke_is_animate = $state(widget.stroke?.is_animate || false)
let stroke_curve = $state(widget.stroke?.curve || "fluid")
let stroke_startPlug = $state(widget.stroke?.startPlug || "behind")
let stroke_endPlug = $state(widget.stroke?.endPlug || "arrow1")

let pile = $state()
let selected_view = $state()
let pile_masonry_column = $state()
let pile_selected_widget_index = $state()
let layers_element = $state()
$effect(async () => {
    if (["crumb", "folder", "container"].includes(widget.type)) {
        pile = await Folder_pile(widget.path).read()
        selected_view = pile.view
        pile_masonry_column = pile.masonry_column || 3
        pile_selected_widget_index = pile.selected_widget_index || 1
    } else {
        stroke_width = widget.stroke?.width || 0
        stroke_style = widget.stroke?.style || "solid"
    }
})
async function set_masonry_column() {
    pile = await Set_folder_option(widget.path, {masonry_column: pile_masonry_column})
    emit("Update_folder", {folder_path: widget.path, pile})
}
async function set_selected_widget_index() {
    pile = await Set_folder_option(widget.path, {selected_widget_index: pile_selected_widget_index})
    emit("Update_folder", {folder_path: widget.path, pile})
}
$effect(() => {
    if (layers_element) {
        new Sortable(layers_element, {
            onUpdate: async e => {
                const pile = await Reorder_widgets(folder_path, e.oldIndex, e.newIndex)
                emit("Update_folder", {folder_path, pile})
            },
        })
    }
})

async function update_widget(payload) {
    const folder_path = widget.path.replace(widget.name, "").slice(0, -1)
    const pile = await Update_widget(folder_path, widget.name, payload)
    emit("Update_folder", {folder_path, pile})
}
async function update_line_stroke() {
    await update_widget({stroke: widget.stroke})
}

async function change_background(color) {
    if (["crumb", "container"].includes(widget.type)) {
        pile = await Set_folder_option(widget.path, {background: color})
        emit("Update_folder", {folder_path: widget.path, pile})
    } else {
        const folder_path = widget.path.replace(widget.name, "").slice(0, -1)
        const pile = await Update_widget(folder_path, widget.name, {background: color})
        emit("Update_folder", {folder_path, pile})
    }
}
async function change_stroke_color(color) {
    const folder_path = widget.path.replace(widget.name, "").slice(0, -1)
    widget.stroke.color = color
    const pile = await Update_widget(folder_path, widget.name, {stroke: widget.stroke})
    emit("Update_folder", {folder_path, pile})
    if (widget.type === "line") emit("Update_line_stroke_color")
}

const colors = ["AliceBlue", "Azure", "Beige", "Bisque", "BlanchedAlmond", "Cornsilk", "FloralWhite",
    "GhostWhite", "Gainsboro", "HoneyDew", "Ivory", "Khaki", "LavenderBlush", "LightBlue",
    "#F1F1EF", "#F4EEEE", "#FBECDD", "#FBF3DB", "#EDF3EC", "#E7F3F8", "#F6F3F9", "#FAF1F5", "#FDEBEC", "plum"
]
const variants = {
    "view_type": ["board", "stack", "masonry", "slides"],
    "curve": ["straight", "arc", "fluid", "magnet", "grid"],
    "stroke_Plug": ["behind", "disc", "square", "arrow1", "arrow2", "arrow3", "hand", ],
}

import TextScale from "carbon-icons-svelte/lib/TextScale.svelte"
import Folder from "carbon-icons-svelte/lib/Folder.svelte"
import ContainerImage from "carbon-icons-svelte/lib/ContainerImage.svelte"
import Image from "carbon-icons-svelte/lib/Image.svelte"
import DocumentAudio from "carbon-icons-svelte/lib/DocumentAudio.svelte"
import Video from "carbon-icons-svelte/lib/Video.svelte"
import WatsonHealth3DMprToggle from "carbon-icons-svelte/lib/WatsonHealth3DMprToggle.svelte"
import WatsonHealth3DCurveAutoColon from "carbon-icons-svelte/lib/WatsonHealth3DCurveAutoColon.svelte"
import CircleOutline from "carbon-icons-svelte/lib/CircleOutline.svelte"
import SquareOutline from "carbon-icons-svelte/lib/SquareOutline.svelte"
import Pen from "carbon-icons-svelte/lib/Pen.svelte"

const widget_type_icons = {
    "text": TextScale,
    "folder": Folder,
    "container": ContainerImage,
    "image": Image,
    "rect": SquareOutline,
    "circle": CircleOutline,
    "line": WatsonHealth3DCurveAutoColon,
    "path": Pen,
    "audio": DocumentAudio,
    "video": Video,
    "3d_model": WatsonHealth3DMprToggle,
}
</script>