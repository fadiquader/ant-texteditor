import React, { Component } from 'react';
import { Button,  Menu, Dropdown } from 'antd';
import CircleButton from './CircleButton';
import Portal from 'react-portal'
import InsertModal from './InsertModal';
import { getSelectionRect, getSelectedBlockNode,} from '../utils/functions';
import {insertSeparator, insertCode } from '../utils/insert';

class AddButton extends Component {
    state = {
        isOpen: false,
        visible: false,
        type: null
    };
    toggleOpen = (e) => {
        this.setState({
            isOpen: !this.state.isOpen
        })
    };
    openImageModal = (e, type) => {
        this.setState({
            type,
            visible: true
        })
    }
    handleOk = (e) => {
        this.setState({
            visible: false,
        });
        this.props.onChange(e);
    };
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    };
    onOpen = (portal) => {
        this.setState({ menu: portal.firstChild })
    };
    updateMenu = () => {
        const { menu, isOpen } = this.state;
        const { state } = this.props;
        if (!menu) return;

        if (state.isBlurred || state.isCollapsed) {
            const selection = window.getSelection();
            const rect = getSelectionRect(selection);
            if(rect){
                // console.log(selection.focusNode.parentNode.parentNode.parentNode.nodeName)
                if(getSelectedBlockNode(selection)){
                    menu.style.opacity = 1;
                    menu.style.top = `${rect.top + window.scrollY - menu.offsetHeight}px`;
                    menu.style.left = `0px`;
                    return;
                }
                if(isOpen)this.toggleOpen();
                menu.removeAttribute('style');
            }
        }

    };
    componentDidMount(){
        this.addButtonStyle={
            position: 'absolute',
            left: '0'
        };
        this.updateMenu()
    }
    componentDidUpdate () {
        this.updateMenu()
    }
    onInsertCode = (e, syntax) => {
        e.preventDefault();
        const { state } = this.props;
        const newState = insertCode(state, syntax);
        this.props.onChange(newState);
    }
    render(){
        const { state, uploadApi } = this.props;
        const {visible, isOpen, type } = this.state;
        const menu = (
            <Menu>
                <Menu.Item>
                    <a onClick={(e) => this.onInsertCode(e, 'javascript')}>Javascript</a>
                </Menu.Item>
                <Menu.Item>
                    <a onClick={(e) => this.onInsertCode(e, 'html')}>HTML</a>
                </Menu.Item>
                <Menu.Item>
                    <a onClick={(e) => this.onInsertCode(e, 'css')}>CSS</a>
                </Menu.Item>
            </Menu>
        );
        return (
            <div className="editor-add-button" style={this.addButtonStyle}>
                <Portal isOpened onOpen={this.onOpen}>
                    <div className="menu hover-menu editor-add-menu-container">
                        <Button shape="circle" type={`primary`} size="large"
                                onClick={(e) => this.toggleOpen(e)}
                                className={`editor-add-btn ${ isOpen? 'rotate-45': ''}`}>
                            <i className="material-icons">add</i>
                        </Button>
                        <div className={`editor-add-menu ${!isOpen? 'close-add-menu': 'open-add-menu '}`}>
                            <CircleButton onClick={this.openImageModal}
                                          type="image" title="Insert Image"
                                          icon="image"/>
                            <CircleButton onClick={this.openImageModal}
                                          type="embed"
                                          title="Insert embed"
                                          icon="code"/>
                            <Dropdown overlay={menu} trigger={['click']}>
                               <span style={{display:'inline-block'}}>
                                    <CircleButton onClick={(e) =>{}}
                                                  type="embed"
                                                  title="Insert code block"
                                                  icon="settings_ethernet"/>
                               </span>
                            </Dropdown>

                            <CircleButton onClick={(e) => this.props.onChange(insertSeparator(state))}
                                          type="separator"
                                          title="Add separator"
                                          icon="remove"/>
                        </div>
                    </div>
                </Portal>

                {visible && <InsertModal visible={visible}
                             state={state}
                             type={type}
                             title={`Add ${type}`}
                             handleCancel={this.handleCancel}
                             handleOk={this.handleOk} uploadApi={uploadApi} />}
            </div>
        );
    }
}

export default AddButton;