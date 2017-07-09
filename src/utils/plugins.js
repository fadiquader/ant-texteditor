import Prism from 'slate-prism'
import AutoReplaceText from 'slate-auto-replace-text';
import CollapseOnEscape from 'slate-collapse-on-escape';
import PrismEditCode from 'slate-edit-code';
import PasteLinkify from 'slate-paste-linkify'


const boldPlugin = markHotKey({
    type: 'bold',
    code: 66
});
const italicPlugin = markHotKey({
    type: 'italic',
    code: 73
});
const underlinedPlugin = markHotKey({
    type: 'underlined',
    code: 85
});
const codePlugin = markHotKey({
    type: 'code_inline',
    code: 192
});

const onlyInCode = node => node.type === 'code_block';

const plugins = [
    boldPlugin,
    italicPlugin,
    underlinedPlugin,
    codePlugin,
    Prism({
        onlyIn: onlyInCode,
        getSyntax: (node => node.data.get('syntax'))
    }),
    PrismEditCode({
        onlyIn: onlyInCode,
    }),
    // PasteLinkify({
    //     type: 'link',
    //     hrefProperty: 'url',
    //     collapseTo: 'end'
    // }),
    AutoReplaceText('(c)', '©'),
    AutoReplaceText('(r)', '®'),
    AutoReplaceText('(tm)', '™'),
    CollapseOnEscape(),
];

function markHotKey(options) {
    const { type, code, isAltKey = false } = options;
    return {
        onKeyDown (e, data, state){
            if (!data.isMod || e.which !== code || e.altKey !== isAltKey) return;
            e.preventDefault();
            return state
                .transform()
                .toggleMark(type)
                .apply();
        }
    }
}

export default plugins;