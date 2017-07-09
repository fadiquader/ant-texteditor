
export function getSelectedBlockNode  (selection) {
    const focusNode = selection.focusNode;
    let node = selection.focusNode;
    do {
        if (node.nodeName === 'PRE' || node.nodeName === 'BLOCKQUOTE') {
            return null;
        }
        node = node.parentNode;
    } while (node !== null);
    if (focusNode.nodeName=== 'BR') {
        return true;
    }
    return null;
}

export function getSelectionRect (selected) {
    if(!selected.anchorNode){
        return null;
    }
    const _rect = selected.getRangeAt(0).getBoundingClientRect();
    let rect = _rect && _rect.top ? _rect : selected.getRangeAt(0).getClientRects()[0];
    if (!rect) {
        if (selected.anchorNode && selected.anchorNode.getBoundingClientRect) {
            rect = selected.anchorNode.getBoundingClientRect();
            rect.isEmptyline = true;
        } else {
            return null;
        }
    }
    return rect;
}

export function capitalize_Words (str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}