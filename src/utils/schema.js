import React from 'react';
import ImageNode from '../components/ImageNode';
import EmbedNode from '../components/EmbedNode';
import CodeNode from '../components/CodeNode';
import SeparatorNode from '../components/SeparatorNode';
import { Block, Raw } from 'slate';
import { defaultBlock } from './constants'

export const DEFAULT_NODE = 'paragraph';

const schema = {
    nodes: {
        'paragraph': (props) => {
            return <p {...props.attributes}>{props.children}</p>
        },
        'block-quote': props => <blockquote className="slate-block-quote" {...props.attributes}>{props.children}</blockquote>,
        'bulleted-list': props => <ul className="slate-bulleted-list" {...props.attributes}>{props.children}</ul>,
        'heading-one': props => <h1 {...props.attributes}>{props.children}</h1>,
        'heading-two': props => <h2 {...props.attributes}>{props.children}</h2>,
        'list-item': props => <li {...props.attributes}>{props.children}</li>,
        'numbered-list': props => <ol  className="slate-numbered-list"{...props.attributes}>{props.children}</ol>,
        'code_block': CodeNode,
        'image': ImageNode,
        'embed': EmbedNode,
        'separator': SeparatorNode,
    },
    inlines: {
        'link': (props) => {
            const { data } = props.node;
            const href = data.get('href');
            return <a target="_blank" {...props.attributes} href={href}>{props.children}</a>
        },
    },
    marks: {
        bold: props => <strong>{props.children}</strong>,
        'code_inline': {
            fontFamily: 'monospace',
            backgroundColor: '#eee',
            padding: '3px',
            borderRadius: '4px'
        },
        italic: props => <em>{props.children}</em>,
        underlined: props => <u>{props.children}</u>,
        strike: props => <strike>{props.children}</strike>,
        highlight: props => <mark>{props.children}</mark>
    },
    rules: [
        // Rule to insert a paragraph block if the document is empty.
        {
            match: (node) => {
                return node.kind === 'document'
            },
            validate: (document) => {
                return document.nodes.size ? null : true
            },
            normalize: (transform, document) => {
                const block = Block.create(defaultBlock)
                transform.insertNodeByKey(document.key, 0, block)
            }
        },
        // Rule to insert a paragraph below a void node (the image) if that node is
        // the last one in the document.
        {
            match: (node) => {
                return node.kind === 'document'
            },
            validate: (document) => {
                const lastNode = document.nodes.last();
                return lastNode && (lastNode.isVoid || lastNode.type==='code_block')? true : null
            },
            normalize: (transform, document) => {
                const block = Block.create(defaultBlock);
                transform.insertNodeByKey(document.key, document.nodes.size, block)
                transform.insertNodeByKey(document.key, document.nodes.size, block)
            }
        }
    ]
};

export default schema;
