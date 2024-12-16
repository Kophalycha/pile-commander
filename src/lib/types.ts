interface Position {
	x: number
	y: number
}
interface Size {
	width: number
	height: number
}

//////////////////////////////////////////

interface FolderPile {
	view: ViewType
	widgets: Widget[]
}
type ViewType = "board" | "stack" | "masonry" | "slides"

type WidgetType = 
	"folder" | "container" | 
	"text" | "path" | "rect" | "circle" | 
	"file" | "image" | "audio" | "video" | "3d_model"
type WidgetPath = string // file path + identifier
type WidgetName = string // file name + identifier
type Widget = {
	type: WidgetType
	name: WidgetName
	position: Position
	size: Size
	bg_color?: string
	path?: string
}

//////////////////////////////////////////

type Buffer = {
	from_folder_path: string,
	widget_name: string,
	to_folder_path: string,
}