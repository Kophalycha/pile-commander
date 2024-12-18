import { writeTextFile, readTextFile } from '@tauri-apps/plugin-fs'
import { join } from '@tauri-apps/api/path'
import YAML from 'yaml'

const FOLDER_PILE_FILE_NAME = "folder.pile"

export const Folder_pile = (folder_path: string) => ({
	async init(view: ViewType = "board") {
		const init_folder_pile: FolderPile = {
			"view": view,
			"widgets": []
		}
		return await this.write(init_folder_pile)
	},
	async read(path?: WidgetPath) {
		const fp_path = await join(folder_path, FOLDER_PILE_FILE_NAME)
		const contents = await readTextFile(path || fp_path)
		let json = YAML.parse(contents)
		return await this.update_widgets_path(json, folder_path)
	},
	async update_widgets_path(pile, parent_path) {
		const aggregated_widgets = []
		for await (const widget of pile.widgets) {
			widget.path = await join(parent_path, widget.name)
			aggregated_widgets.push(widget)
		}
		pile.widgets = aggregated_widgets
		return pile
	},
	async write(pile: FolderPile) {
		const fp_path = await join(folder_path, FOLDER_PILE_FILE_NAME)
		await writeTextFile(fp_path, YAML.stringify(pile))
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
		if (payload.name) {
			pile.widgets = pile.widgets.filter(w => !this.is_any_connection(w, name))
			// pile.widgets = pile.widgets.map(w => {
			// 	if (this.is_any_connection(w, name)) {
			// 		let line: LineWidget = w
			// 		const side = w.start === name ? "start" : "end"
			// 		line[side] = payload.name
			// 		return line
			// 	}
			// 	return w
			// })
		}
		pile.widgets = pile.widgets.map((w: Widget) => {
			if (w.name === name) return new_widget
			return w
		})
		return await this.write(pile)
	},
	async copy_widget(name: WidgetName, to_folder_path: WidgetPath, new_widget_name: WidgetName, new_widget_path: WidgetPath) {
		let from_pile = await this.read()
		let copied_widget = from_pile.widgets.find((w: Widget) => w.name === name)
		copied_widget.position.x += 20
		copied_widget.position.y += 20
		copied_widget.name = new_widget_name
		copied_widget.path = new_widget_path
		const to_folder_pile_path = await join(to_folder_path, FOLDER_PILE_FILE_NAME)
		let to_pile = await this.read(to_folder_pile_path)
		to_pile.widgets.push(copied_widget)
		await writeTextFile(to_folder_pile_path, YAML.stringify(to_pile))
		return { from_pile, to_pile }
	},
	async move_widget(name: WidgetName, to: WidgetPath) {
		let from_pile = await this.read()
		let moved_widget = from_pile.widgets.filter((w: Widget) => w.name === name)[0]
		from_pile.widgets = from_pile.widgets.filter((w: Widget) => w.name !== name)
		from_pile.widgets = from_pile.widgets.filter(w => !this.is_any_connection(w, name))
		const to_path = await join(to, FOLDER_PILE_FILE_NAME)
		let to_pile = await this.read(to_path)
		moved_widget.path = await join(to, moved_widget.name)
		to_pile.widgets.push(moved_widget)
		to_pile = await this.update_widgets_path(to_pile, to)
		await writeTextFile(to_path, YAML.stringify(to_pile))
		await this.write(from_pile)
		return { from_pile, to_pile }
	},
	async reorder_widgets(from_index: number, to_index: number) {
		const pile = await this.read()
		const moving_widget = pile.widgets[from_index]
		pile.widgets.splice(from_index, 1)
		pile.widgets.splice(to_index, 0, moving_widget)
		return await this.write(pile)

	},
	async remove_widget(name: WidgetName) {
		const pile = await this.read()
		pile.widgets = pile.widgets.filter((w: Widget) => w.name !== name)
		pile.widgets = pile.widgets.filter(w => !this.is_any_connection(w, name))
		if (pile.selected_widget_index) {
			pile.widgets.length > 0 ?
				pile.selected_widget_index = pile.widgets.length - 1
				: pile.selected_widget_index = 0
		}
		return await this.write(pile)
	},
	is_any_connection(w, widget_name) {
		return (w.type === "line" && ([w.start, w.end].includes(widget_name)))
	},

	async change_view(view: ViewType) {
		const pile = await this.read()
		pile.view = view
		if (view === "slides" && !pile.selected_widget_index) {
			pile.selected_widget_index = 0
		}
		return await this.write(pile)
	},
	async set_option(options: {}) {
		const pile = await this.read()
		const new_pile = {...pile, ...options}
		return await this.write(new_pile)
	}

})