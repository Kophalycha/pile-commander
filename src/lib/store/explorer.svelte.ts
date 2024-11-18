export class FolderExplorerStore {
	
	ROOT_FOLDER_PATH: string | null = null
	separator: string | null = null
	breadcrumbs: string[] = $derived(this.selected_folder_path?.replace(this.ROOT_FOLDER_PATH, "Home")?.split(this.separator))
	init(root_folder_path: string, separator: string) {
		this.ROOT_FOLDER_PATH = root_folder_path
		this.separator = separator
	}


	selected_folder_path = <WidgetPath>$state()
	selected_folder_name = <WidgetName>$state()
	selected_folder_config = <FolderConfig>$state()

	show_folder(selected_folder_path: string, selected_folder_name: string, folder_config: FolderConfig) {
		this.selected_folder_path = selected_folder_path
		this.selected_folder_name = selected_folder_name
		this.update_explorer(folder_config)
	}
	update_explorer(folder_config: FolderConfig) {
		this.selected_folder_config = folder_config
	}

	selected_widget: null | WidgetName = $state(null)
	select_widget(widget_name: WidgetName) {
		this.selected_widget = widget_name
	}
	deselect_widget() {
		this.selected_widget = null
	}


}