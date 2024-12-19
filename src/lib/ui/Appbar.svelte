<div data-tauri-drag-region class="titlebar">
    Pile Commander 0.8.1
    <div class="titlebar-button" id="titlebar-minimize">
      <img
        src="https://api.iconify.design/mdi:window-minimize.svg"
        alt="minimize"
      />
    </div>
    <div class="titlebar-button" id="titlebar-maximize">
      <img
        src="https://api.iconify.design/mdi:window-maximize.svg"
        alt="maximize"
      />
    </div>
    <div class="titlebar-button" id="titlebar-reload" title="Stack Overflow">
      r
    </div>
    <div class="titlebar-button" id="titlebar-fullscreen">
      f
    </div>
    <div class="titlebar-button" id="titlebar-close">
      <img src="https://api.iconify.design/mdi:close.svg" alt="close" />
    </div>
</div>

<style>
.titlebar {
    height: 50px;
    background: #329ea3;
    user-select: none;
    display: flex;
    justify-content: flex-end;
    z-index: 99999;
}
.titlebar-button {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    user-select: none;
    -webkit-user-select: none;
}
.titlebar-button:hover {
    background: #5bbec3;
}
</style>

<script>
import { getCurrentWindow } from '@tauri-apps/api/window'
import { onMount } from 'svelte'

const appWindow = getCurrentWindow()
let is_fullscreen = false
const toggle_fullscreen = () => {
    is_fullscreen= !is_fullscreen
    appWindow.setFullscreen(is_fullscreen)
}

onMount(() => {
    document
    .getElementById('titlebar-minimize')
    ?.addEventListener('click', () => appWindow.minimize())
    document
    .getElementById('titlebar-maximize')
    ?.addEventListener('click', () => appWindow.toggleMaximize())
    document
    .getElementById('titlebar-reload')
    ?.addEventListener('click', () => window.location.reload())
    document
    .getElementById('titlebar-fullscreen')
    ?.addEventListener('click', toggle_fullscreen)
    document
    .getElementById('titlebar-close')
    ?.addEventListener('click', () => appWindow.close())
    document.addEventListener("keydown", e => {
        if (e.code === "F11") toggle_fullscreen()
    })
})
</script>