import { check } from "@tauri-apps/plugin-updater"

export async function checkForAppUpdates() {
	const update = await check()
	if (update?.available) {
		let yes = confirm(`Update to ${update.version} is available! Install?`)
		if (yes) {
			await update.downloadAndInstall()
			alert("Please, restart app")
		}
	}
}