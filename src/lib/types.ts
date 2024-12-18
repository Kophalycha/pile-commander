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
	"text" | "path" | "rect" | "circle" | "line" |
	"file" | "image" | "audio" | "video" | "3d_model"
type WidgetPath = string // file path + identifier
type WidgetName = string // file name + identifier
type Widget = {
	type: WidgetType
	name: WidgetName
	position: Position
	size: Size
	background?: string
	path?: string
}
type LineWidget = {
	type: WidgetType
	name: WidgetName
	path?: string
	start: Position | WidgetName
	end: Position | WidgetName
	stroke: {
		width: number,
		style: "solid" | "dashed",
		color: string,
		is_animate: boolean,
		curve: string,
		startPlug: string,
		endPlug: string,
	}
}

//////////////////////////////////////////

type Buffer = {
	from_folder_path: string,
	widget_name: string,
	to_folder_path: string,
}