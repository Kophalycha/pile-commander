<div>
    <p>{selected_widget.name}</p>
    <p> 
        <button onclick={onRename}>
            Rename
            <kbd>F2</kbd>
        </button>
        <button onclick={onRemove}>
            Remove
            <kbd>Del</kbd>
        </button>
    </p>
    <hr>
    <p>
        Background:
    </p>
</div>
<style>
div {
    position: fixed;
    bottom: 100px;
    right: 30px;
    z-index: 9999;
    width: 300px;
    padding: 20px;
    background-color: #fff;
}
p > button:not(:last-child) {
    margin-right: 10px;
}
hr {
    border-top: 1px solid #eee;
    border-bottom: none;
}
</style>

<script>
import { Update_widget } from "$lib/services/widget"

let {selected_widget, onRename, onRemove} = $props()
</script>