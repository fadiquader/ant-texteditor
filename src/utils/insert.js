export function insertImage (state, src) {
    return state
        .transform()
        .insertBlock({
            type: 'image',
            isVoid: true,
            data: { src }
        })
        .apply()
}
export function insertEmbed(state, url) {
    return state
        .transform()
        .insertBlock({
            type: 'embed',
            isVoid: true,
            data: { url }
        })
        .apply()
}
export function insertSeparator (state) {
    return state
        .transform()
        .insertBlock({
            type: 'separator',
            isVoid: true,
        })
        .apply()
}
export function insertLink(state, url) {
    return state
        .transform()
        .wrapInline({
            type: 'link',
            data: { href: url }
        })
        .collapseToEnd()
        .apply();
}
export function insertCode(state, syntax) {
    return state
        .transform()
        .insertBlock({
            type: 'code_block',
            data: {
                syntax,
                className: `lan ${syntax}`
            },

        })
        .apply();
}