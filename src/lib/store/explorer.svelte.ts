import { Move_widget } from "$lib/services/widget"

export class FolderExplorerStore {
	
	breadcrumbs: string[] = $state([])

	selected_folder_path = <WidgetPath>$state()
	selected_folder_name = <WidgetName>$state()
	selected_folder_config = <FolderConfig>$state()

	show_folder(selected_folder_path: string, selected_folder_name: string, folder_config: FolderConfig, breadcrumbs: string[]) {
		this.selected_folder_path = selected_folder_path
		this.selected_folder_name = selected_folder_name
		this.breadcrumbs = breadcrumbs
		this.update_explorer(folder_config)
	}
	update_explorer(folder_config: FolderConfig) {
		this.deselect_widget()
		this.selected_folder_config = folder_config
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
	async paste() {
		this.buffer.to_folder_path = this.selected_folder_path
		const {to_config} = await Move_widget($state.snapshot(this.buffer))
		this.update_explorer(to_config)
		this.buffer = {
			from_folder_path: "",
			widget_name: "",
			to_folder_path: "",
		}
	}

}