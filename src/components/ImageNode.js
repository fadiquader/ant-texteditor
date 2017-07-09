import React, {Component} from 'react';
import {Popover, Spin} from 'antd';
import Portal from 'react-portal'
import Resize from './Resize';
import ToggleButton from './ToggleButton';
import { getSelectionRect } from '../utils/functions';

const Spinner = () => (
    <Spin>
        <div>
            loading...
        </div>
    </Spin>
);
const getStyle = align => {
    switch (align) {
        case 'right':
            return {
                'margin': '15px 0 15px auto',
                display: 'block'
            };
            break;
        case 'center':
            return {
                'margin': '15px auto',
                display: 'block'
            };
            break;
        case 'right-inline':
            return {
                float: 'right',
                'margin': '15px'
            };
        case 'left-inline':
            return {
                float: 'left',
                'margin': '15px'
            };
        default:
            return {
                textAlign: 'left',
                'margin': '15px auto  15px 0',
                display: 'block'
            };
    }
};
class ImageNode extends Component {
    state = {
        visible: false,
        loadingImage: true,
        imgDimensions: {w: 0, h: 0},
        align: 'right-inline'
    };
    hide = () => {
        this.setState({
            visible: false,
        });
    };
    handleVisibleChange = (visible) => {
        this.setState({visible});
    };
    alignImage = (type) => {
        if (this.imageNode) {
        }
        this.setState({align: type});
    };
    onOpen = (portal) => {
        this.setState({ menu: portal.firstChild })
    };
    updateMenu = () => {
        const { menu } = this.state;
        const { node, state} = this.props;

        if (!menu) return;
        const active = state.isFocused && state.selection.hasEdgeIn(node)
        if (!active) {
            menu.removeAttribute('style');
            return;
        }
        // const rect = getSelectionRect(window.getSelection());
        menu.style.opacity = 1;
        menu.style.top = `0px`;
        // menu.style.left = `${rect.left + window.scrollX - menu.offsetWidt${rect.left + window.scrollX - menu.offsetWidth / 2 + rect.width / 2}h / 2 + rect.width / 2}px`
        menu.style.left = `0px`
    };
    renderMenu = () => {
        return (
            <Portal isOpened onOpen={this.onOpen}>
                <div className="menu hover-menu">
                    <ToggleButton onMouseDown={() => {
                        this.alignImage('right-inline')
                    }} tooltipText="Inline right"
                                  isActive={true}
                                  icon="format_indent_increase"/>
                </div>
            </Portal>
        )
    };

    componentDidMount() {
        const $this = this;
        const img = new Image();
        img.onload = function () {
            // console.log('style', this.width + 'x' + this.height)
            $this.setState({
                loadingImage: false,
                imgDimensions: {w: this.width, h: this.height}
            })
        };
        img.src = this.props.node.data.get('src');
        this.updateMenu();
    }
    componentDidUpdate(){
        this.updateMenu();
    }
    render() {
        const {node, state} = this.props;
        const {visible, align, loadingImage} = this.state;
        const active = state.isFocused && state.selection.hasEdgeIn(node)
        const src = node.data.get('src');
        const className = active ? 'editor-image-active' : null;
        const popoverButtons = (
            <div>
                <ToggleButton onMouseDown={() => {
                    this.alignImage('left')
                }} tooltipText="Align left"
                              isActive={align === 'left'} icon="format_align_left"/>
                <ToggleButton onMouseDown={() => {
                    this.alignImage('center')
                }} tooltipText="Align center"
                              isActive={align === 'center'} icon="format_align_center"/>
                <ToggleButton onMouseDown={() => {
                    this.alignImage('right')
                }} tooltipText="Align right"
                              isActive={align === 'right'} icon="format_align_right"/>
                <ToggleButton onMouseDown={() => {
                    this.alignImage('left-inline')
                }} tooltipText="Inline left"
                              isActive={align === 'left-inline'} icon="format_indent_decrease"/>
                <ToggleButton onMouseDown={() => {
                    this.alignImage('right-inline')
                }} tooltipText="Inline right"
                              isActive={align === 'right-inline'}
                              icon="format_indent_increase"/>
            </div>
        );
        // style={getStyle(align)}
        return (
            <span style={{
            }}>
                {loadingImage && <Spinner />}
                {!loadingImage && <img src={src}
                                       className={`${className}`}
                                       {...this.props.attributes} />}

            </span>
        )
        {/*<figure style={{...getStyle(align), position: 'relative'}}>*/}
        {/*/!*<Resize imgDimensions={this.state.imgDimensions}>*!/*/}
        {/*/!*<Popover visible={visible} onVisibleChange={this.handleVisibleChange}*!/*/}
        {/*/!*content={popoverButtons}>*!/*/}
        {/*/!*<span style={{*!/*/}
        {/*/!*display: 'inline-block'*!/*/}
        {/*/!*}}>*!/*/}
        {/*/!*{loadingImage && <Spinner />}*!/*/}
        {/*/!*{!loadingImage && <img src={src}*!/*/}
        {/*/!*className={`${className}`}*!/*/}
        {/*/!*{...this.props.attributes} />}*!/*/}
        {/*/!*</span>*!/*/}
        {/*/!*</Popover>*!/*/}
        {/*/!*</Resize>*!/*/}

        {/*</figure>*/}
    }
}

export default ImageNode;