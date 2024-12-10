import { check } from "@tauri-apps/plugin-updater"

export async function checkForAppUpdates() {
	const update = await check()
	if (update?.available) {
		let yes = confirm(`Update to ${update.version} is available! Install?`)
		if (yes) {
			let downloaded = 0;
			let contentLength = 0;
			await update.downloadAndInstall((event) => {
				console.log(event)
				switch (event.event) {
					case 'Started':
						contentLength = event.data.contentLength;
						console.log(`started downloading ${event.data.contentLength} bytes`);
						break;
					case 'Progress':
						downloaded += event.data.chunkLength;
						console.log(`downloaded ${downloaded} from ${contentLength}`);
						break;
					case 'Finished':
						console.log('download finished');
						break;
				}
			})
			alert("Please, restart app")
		}
	}
}