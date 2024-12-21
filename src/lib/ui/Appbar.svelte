<div data-tauri-drag-region class="titlebar">
	<div class="dropdown">
        <button class="dropbtn">Window</button>
        <div class="dropdown-content">
			<div><small><a href="https://github.com/a-matyukh/pile-commander" target="_blank">Pile Commander 0.9.0</a></small></div>
			<div class="titlebar-button" onclick={appWindow.minimize}>
				— &nbsp;<span>Minimize</span>
			</div>
			<div class="titlebar-button" onclick={appWindow.toggleMaximize}>
				<Maximize />
				<span>Maximize</span>
			</div>
			<div class="titlebar-button" onclick={() => window.location.reload()}>
				<Reset />
				<span>Reload</span>
			</div>
			<div class="titlebar-button" onclick={toggle_fullscreen}>
				<CenterToFit />
				<span>Fullscreen (F11)</span>
			</div>
			<div class="titlebar-button" onclick={appWindow.close}>
				<CloseLarge />
				<span>Close</span>
			</div>	
        </div>
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
div span {
	margin-left: 10px;
}

a {
	color: black;
	text-decoration: none;
	opacity: .5;
}

.dropbtn {
	outline: none;
}
.dropdown {
	position: relative;
	display: inline-block;
}
.dropdown-content {
	display: none;
	position: absolute;
	bottom: 30px;
	right: 0;
	background-color: #fff;
	width: 180px;
	height: 260px;
	z-index: 1;
	padding: 0;
	box-shadow: rgba(149, 157, 165, 0.3) 0px 8px 24px;
}
.dropdown-content div {
	padding: 12px 16px;
	display: block;
	cursor: pointer;
}
.dropdown-content div:hover {background-color: #ddd;}
.dropdown:hover .dropdown-content {display: block;}
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