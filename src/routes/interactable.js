import { Update_folder, Move_to_folder, Drop_to_folder } from "$lib/services/folder"
import interact from 'interactjs'
interact('.widget')
.draggable({
	listeners: {
		move(event) {
            event.target.style.left = event.rect.left + "px"
            event.target.style.top = event.rect.top + "px"
		},
		end(event) {
            Update_folder(event.currentTarget.id, {position: {x: event.rect.left, y: event.rect.top}})
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
            Update_folder(event.currentTarget.id, {size: {width: event.rect.width, height: event.rect.height}})
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
    ondrop: (event) => {
        Move_to_folder(event.relatedTarget.id, event.target.id)
    },
    ondropdeactivate: (event) => {
        event.target.classList.remove('drop-active')
        event.target.classList.remove('drop-target')
        event.relatedTarget.classList.remove('can-drop')
    }
})
interact('.breadcrumb').dropzone({
    accept: '.widget',
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
    ondrop: (event) => {
        Drop_to_folder(+event.target.dataset.index, event.relatedTarget.id)
    },
    ondropdeactivate: (event) => {
        event.target.classList.remove('drop-active')
        event.target.classList.remove('drop-target')
        event.relatedTarget.classList.remove('can-drop')
    }
})
