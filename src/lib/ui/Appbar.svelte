<div data-tauri-drag-region class="titlebar">
	<!-- Pile Commander 0.8.1 -->
	<div class="titlebar-button" title="Minimize" onclick={appWindow.minimize}>
		—
	</div>
	<div class="titlebar-button" title="Maximize">
		<Maximize onclick={appWindow.toggleMaximize} />
	</div>
	<div class="titlebar-button" title="Reload page">
		<Reset onclick={() => window.location.reload()} />
	</div>
	<div class="titlebar-button" title="Fullscreen (F11)">
	  	<CenterToFit onclick={toggle_fullscreen} />
	</div>
	<div class="titlebar-button" title="Close">
		<CloseLarge onclick={appWindow.close} />
	</div>
</div>

<style>
.titlebar {
	height: 49px;
	background: #eee;
	user-select: none;
	display: flex;
	justify-content: flex-end;
	z-index: 99999;
	box-sizing: border-box;
	padding: 8px;
	border-top: 1px solid #ccc;
	cursor: grab;
}
.titlebar-button {
	display: inline-flex;
	justify-content: center;
	align-items: center;
	width: 30px;
	height: 30px;
	cursor: pointer;
}
.titlebar-button:hover {
	background: #ccc;
}
</style>

<script>
import { getCurrentWindow } from '@tauri-apps/api/window'
import { onMount } from 'svelte'
import Maximize from "carbon-icons-svelte/lib/Maximize.svelte"
import Reset from "carbon-icons-svelte/lib/Reset.svelte"
import CenterToFit from "carbon-icons-svelte/lib/CenterToFit.svelte"
import CloseLarge from "carbon-icons-svelte/lib/CloseLarge.svelte"

const appWindow = getCurrentWindow()
let is_fullscreen = false
const toggle_fullscreen = () => {
	is_fullscreen= !is_fullscreen
	appWindow.setFullscreen(is_fullscreen)
}
onMount(() => {
	document.addEventListener("keydown", e => {
		if (e.code === "F11") toggle_fullscreen()
	})
})
</script>