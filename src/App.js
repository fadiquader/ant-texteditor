import React, { Component } from 'react';
import Portal from 'react-portal'
import { Popover, Button } from 'antd';
import Toolbar from './components/Toolbar';
import AddButton from './components/AddButton';
import { Editor, Raw, Plain, Html } from 'slate';
import initialState from './state.json';
import schema, { DEFAULT_NODE } from './utils/schema';
import {  getSelectionRect } from './utils/functions';
import { insertImage } from './utils/insert';
import plugins from './utils/plugins';
import isImage from 'is-image';
import isUrl from 'is-url';

class App extends Component {
    state = {
        state: Raw.deserialize(initialState, { terse: true }),
        visible: false,
        style: {},
        readOnly: false
    };
    onChange = (state) => {
        this.setState({ state });
    };
    onDocumentChange = (document, state) => {
        console.log(JSON.stringify(Raw.serialize(state)))
        // console.log(state.document.text.split(' ').length)
    };
    onDropNode = (e, data, state) => {
        return state
            .transform()
            .deselect()
            .removeNodeByKey(data.node.key)
            .select(data.target)
            .insertBlock(data.node)
            .apply()
    };
    onDropOrPasteFiles = (e, data, state, editor) => {
        for (const file of data.files) {
            const reader = new FileReader();
            const [type] = file.type.split('/');
            if (type !== 'image') continue;

            reader.addEventListener('load', () => {
                state = editor.getState();
                state = insertImage(state, reader.result);
                editor.onChange(state)
            });
            reader.readAsDataURL(file)
        }
    };
    onPasteText = (e, data, state) => {
        if (!isUrl(data.text)) return;
        if (!isImage(data.text)) return;
        return insertImage(state, data.text)
    }
    onDrop = (e, data, state, editor) => {
        switch (data.type) {
            case 'files': return this.onDropOrPasteFiles(e, data, state, editor);
            case 'node': return this.onDropNode(e, data, state)
        }
    }
    onPaste = (e, data, state, editor) => {
        switch (data.type) {
            case 'files': return this.onDropOrPasteFiles(e, data, state, editor);
            case 'text': return this.onPasteText(e, data, state)
        }
    };

    updateMenu = () => {
        const { menu, state } = this.state;
        if (!menu) return;

        if (state.isBlurred || state.isCollapsed) {
            menu.removeAttribute('style');
            return;
        }
        const rect = getSelectionRect(window.getSelection());
        menu.style.opacity = 1;
        menu.style.top = `${rect.top + window.scrollY - menu.offsetHeight +20}px`;
        menu.style.left = `${rect.left + window.scrollX - menu.offsetWidth / 2 + rect.width / 2}px`
    };

    onOpen = (portal) => {
        this.setState({ menu: portal.firstChild })
    };
    renderMenu = () => {
        const content = (
            <Toolbar state={this.state.state} onChange={this.onChange}/>
        );
        return (
            <Portal isOpened onOpen={this.onOpen}>
                <div className="menu hover-menu">
                    <Popover visible={true} content={content}>
                    </Popover>
                </div>
            </Portal>
        )
    };

    renderEditor = () => {
        const { readOnly} = this.state;
        return (
            <div className="editor-1">
                <Editor
                    readOnly={readOnly}
                    spellCheck
                    plugins={plugins}
                    placeholder={'Write your story...'}
                    schema={schema}
                    state={this.state.state}
                    onChange={this.onChange}
                    onDocumentChange={this.onDocumentChange}
                    onDrop={this.onDrop}
                    onPaste={this.onPaste}
                />
            </div>
        )
    };
    componentDidMount () {
        this.updateMenu()

    }

    componentDidUpdate () {
        this.updateMenu()
    }
    render() {
        const { uploadApi } = this.props;
        return (
            <div className="editor">
                <div>
                    <Button onClick={(e) => this.setState({readOnly: !this.state.readOnly})}>Read only</Button>
                </div>
                {this.renderEditor()}
                {this.renderMenu()}
                <AddButton
                    uploadApi={uploadApi}
                    onChange={this.onChange}
                    state={this.state.state} />
            </div>
        );
    }

}

export default App;
