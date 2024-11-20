import { Folder_pile } from '../services/folder_pile'

export class FolderExplorerStore {
	
	ROOT_FOLDER_PATH: string
	SEPARATOR: string

	breadcrumbs: { name: string, path: string }[] = $derived.by(() => {
		const crumbs = this.selected_folder_path?.replace(this.ROOT_FOLDER_PATH, "").split(this.SEPARATOR)
		crumbs?.shift()
		return crumbs?.reduce(
			(accumulator, folder_name) => [...accumulator, {
				name: folder_name,
				path: accumulator.at(-1)?.path + this.SEPARATOR + folder_name
			}],
			[{
				name: "Home",
				path: this.ROOT_FOLDER_PATH
			}]
		) || []
	})

	selected_folder_path = <WidgetPath>$state()
	// selected_folder_name = <WidgetName>$state()
	selected_folder_pile = <FolderPile>$state()

	constructor(ROOT_FOLDER_PATH: string, SEPARATOR: string) {
		this.ROOT_FOLDER_PATH = ROOT_FOLDER_PATH
		this.SEPARATOR = SEPARATOR
		this.show_folder(ROOT_FOLDER_PATH)
	}

	async show_folder(selected_folder_path: string) {
		const readed_folder_pile: FolderPile = await Folder_pile(selected_folder_path).read()
		this.selected_folder_path = selected_folder_path
		// this.selected_folder_name = selected_folder_path.split(this.SEPARATOR).at(-1) || ""
		this.update_explorer(readed_folder_pile)
	}
	update_explorer(folder_pile: FolderPile) {
		this.deselect_widget()
		this.selected_folder_pile = folder_pile
	}

	selected_widget: null | WidgetName = $state(null)
	select_widget(widget_name: WidgetName) {
		this.selected_widget = widget_name
	}
	deselect_widget() {
		this.selected_widget = null
	}

	// Extract to service
	buffer = $state({
		from_folder_path: "",
		widget_name: "",
		to_folder_path: "",
	})
	cut() {
		if (this.selected_widget) {
			this.buffer.from_folder_path = this.selected_folder_path
			this.buffer.widget_name = this.selected_widget
		}
	}
	paste() {
		this.buffer.to_folder_path = this.selected_folder_path
	}
	clean() {
		this.buffer = {
			from_folder_path: "",
			widget_name: "",
			to_folder_path: "",
		}
	}

}