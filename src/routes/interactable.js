import { Update_widget, Move_widget } from "$lib/services/widget"
import { folder_explorer } from "$lib/store"
import interact from 'interactjs'
interact('.widget')
.draggable({
	listeners: {
		move(event) {
            event.target.style.left = event.rect.left + "px"
            event.target.style.top = event.rect.top + "px"
		},
		end(event) {
            Update_widget(folder_explorer.selected_folder_path, event.currentTarget.dataset.name, {position: {x: event.rect.left, y: event.rect.top}})
		}
	},
    modifiers: [
        interact.modifiers.restrictEdges({ outer: 'parent' }),
    ],
})
.resizable({
    edges: { left: false, right: true, bottom: true, top: false },
    listeners: {
		move (event) {
            event.target.style.width = event.rect.width + "px"
            event.target.style.height = event.rect.height + "px"
		},
		end(event) {
            Update_widget(folder_explorer.selected_folder_path, event.currentTarget.dataset.name, {size: {width: event.rect.width, height: event.rect.height}})
        }
    },
    modifiers: [
        interact.modifiers.restrictEdges({ outer: 'parent' }),
        interact.modifiers.restrictSize({ min: { width: 100, height: 50 } })
    ],
})
interact('.dropzone').dropzone({
    accept: '.widget',
    overlap: 0.10,
    ondropactivate: (event) => {
        event.target.classList.add('drop-active')
    },
    ondragenter: (event) => {
        event.target.classList.add('drop-target')
        event.relatedTarget.classList.add('can-drop')
    },
    ondragleave: (event) => {
        event.target.classList.remove('drop-target')
        event.relatedTarget.classList.remove('can-drop')
    },
    ondrop: async (event) => {
        const {from_pile} = await Move_widget({
			from_folder_path: folder_explorer.selected_folder_path,
			widget_name: event.relatedTarget.dataset.name,
			to_folder_path: event.target.dataset.path,
		})
        folder_explorer.update_explorer(from_pile)
    },
    ondropdeactivate: (event) => {
        event.target.classList.remove('drop-active')
        event.target.classList.remove('drop-target')
        event.relatedTarget.classList.remove('can-drop')
    }
})