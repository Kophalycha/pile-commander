import { writeTextFile, readTextFile } from '@tauri-apps/plugin-fs'
import { join } from '@tauri-apps/api/path'
import YAML from 'yaml'

const FOLDER_PILE_FILE_NAME = "folder.pile"

export const Folder_pile = (folder_path: string) => ({
	fcpath: `${folder_path}/${FOLDER_PILE_FILE_NAME}`,
	async init() {
		const init_folder_pile: FolderPile = {
			"view": "board",
			"widgets": []
		}
		return await this.write(init_folder_pile)
	},
	async read(path?: WidgetPath) {
		const contents = await readTextFile(path || this.fcpath)
		const json = YAML.parse(contents)
		const aggregated_widgets = []
		for await (const widget of json.widgets) {
			widget.path = await join(folder_path, widget.name)
			aggregated_widgets.push(widget)
		}
		json.widgets = aggregated_widgets
		return json
	},
	async write(pile: FolderPile) {
		await writeTextFile(this.fcpath, YAML.stringify(pile))
		return pile
	},

	async create_widget(new_widget: Widget) {
		const pile = await this.read()
		pile.widgets.push(new_widget)
		return await this.write(pile)
	},
	async update_widget(name: WidgetName, payload: Partial<Widget>) {
		const pile = await this.read()
		let old_widget = pile.widgets.filter((w: Widget) => w.name === name)[0]
		const new_widget: Widget = {
			...old_widget,
			...payload,
		}
		pile.widgets = pile.widgets.map((w: Widget) => {
			if (w.name === name) return new_widget
			return w
		})
		return await this.write(pile)
	},
	async move_widget(name: WidgetName, to: WidgetPath) {
		const from_pile = await this.read()
		let moved_widget = from_pile.widgets.filter((w: Widget) => w.name === name)[0]
		from_pile.widgets = from_pile.widgets.filter((w: Widget) => w.name !== name)
		const to_path = await join(to, FOLDER_PILE_FILE_NAME)
		const to_pile = await this.read(to_path)
		moved_widget.path = await join(to, moved_widget.name)
		to_pile.widgets.push(moved_widget)
		await writeTextFile(to_path, YAML.stringify(to_pile))
		await this.write(from_pile)
		return { from_pile, to_pile }
	},
	async remove_widget(name: WidgetName) {
		const pile = await this.read()
		pile.widgets = pile.widgets.filter((w: Widget) => w.name !== name)
		return await this.write(pile)
	},

})