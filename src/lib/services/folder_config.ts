import { writeTextFile, readTextFile } from '@tauri-apps/plugin-fs'
import YAML from 'yaml'

const FOLDER_CONFIG_FILE_NAME = "folder.pile"

export const Folder_config = (folder_path: string) => ({
    fcpath: `${folder_path}/${FOLDER_CONFIG_FILE_NAME}`,
    async init() {
        const init_folder_config: FolderConfig = {
            "view": "board",
            "widgets": []
        }
        return await this.write(init_folder_config)
    },
    async read(path?: WidgetPath) {
        const contents = await readTextFile(path || this.fcpath)
        return YAML.parse(contents)
    },
    async write(config: FolderConfig) {
        await writeTextFile(this.fcpath, YAML.stringify(config))
        return config
    },

    async update_child(name: WidgetName, payload: Partial<Widget>) {
        const config = await this.read()
        let old_widget = config.widgets.filter((w: Widget) => w.name === name)[0]
        const new_widget: Widget = {
            ...old_widget,
            ...payload,
        }
        config.widgets = config.widgets.map((w: Widget) => {
            if (w.name === name) return new_widget
            return w
        })
        return await this.write(config)
    },
    async move_child(name: WidgetName, to: WidgetPath) {
        const from_config = await this.read()
        let moved_widget = from_config.widgets.filter((w: Widget) => w.name === name)[0]
        from_config.widgets = from_config.widgets.filter((w: Widget) => w.name !== name)
        const to_path = to + `/${FOLDER_CONFIG_FILE_NAME}`
        const to_config = await this.read(to_path)
        to_config.widgets.push(moved_widget)
        await writeTextFile(to_path, YAML.stringify(to_config))
        await this.write(from_config)
        return {
            from_config, to_config
        }
    },
    async remove_child(name: WidgetName) {
        const config = await this.read()
        config.widgets = config.widgets.filter((w: Widget) => w.name !== name)
        return await this.write(config)
    },

    async create_widget(new_widget: Widget) {
        const config = await this.read()
        config.widgets.push(new_widget)
        return await this.write(config)
    },

})