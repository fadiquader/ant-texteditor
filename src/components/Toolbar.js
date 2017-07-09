import React, { Component } from 'react';
import InsertModal from './InsertModal'
import ToggleButton from './ToggleButton';
import { DEFAULT_NODE } from '../utils/schema';
import { markButtons, blockButtons } from '../utils/constants';
import { capitalize_Words } from '../utils/functions';

class Toolbar extends Component {
    state = {
        type: null
    };
    hasMark = (type) => {
        const { state } = this.props;
        // Determine whether any of the currently selected text has the type.
        return state.marks.some(mark => mark.type === type)
    };
    hasBlock = (type) => {
        const { state } = this.props;
        // Determine whether any of the currently selected text has the type.
        return state.blocks.some(node => node.type === type)
    };
    hasLinks = () => {
        const { state } = this.props;
        return state.inlines.some(inline => inline.type === 'link')
    };
    onClickMark = (e, type) => {
        e.preventDefault();
        let { state } = this.props;
        const newState = state
            .transform()
            .toggleMark(type)
            .apply();

        this.props.onChange(newState);
    };
    renderMarkButton = (type, icon) => {
        const isActive = this.hasMark(type);
        const onMouseDown = e => this.onClickMark(e, type);

        return (
            <ToggleButton onMouseDown={onMouseDown}
                          icon={icon} tooltipText={`${capitalize_Words(type)}`}
                          key={type} isActive={isActive}/>
        )
    };
    renderMarksButtons = () => {
      return markButtons.map(mark => this.renderMarkButton(mark.type, mark.icon))
    };
    onClickBlock = (e, type) => {
        e.preventDefault();
        let { state } = this.props;
        const transform = state.transform();
        const { document } = state;

        // Handle everything but list buttons.
        if (type !== 'bulleted-list' && type !== 'numbered-list') {
            const isActive = this.hasBlock(type);
            const isList = this.hasBlock('list-item');

            if (isList) {
                transform
                    .setBlock(isActive ? DEFAULT_NODE : type)
                    .unwrapBlock('bulleted-list')
                    .unwrapBlock('numbered-list')
            }

            else {
                transform
                    .setBlock(isActive ? DEFAULT_NODE : type)
            }
        }

        // Handle the extra wrapping required for list buttons.
        else {
            const isList = this.hasBlock('list-item');
            const isType = state.blocks.some((block) => {
                return !!document.getClosest(block.key, parent => parent.type === type)
            });
            console.log(isList, isType)
            if (isList && isType) {
                transform
                    .setBlock(DEFAULT_NODE)
                    .unwrapBlock('bulleted-list')
                    .unwrapBlock('numbered-list')
            } else if (isList) {
                transform
                    .unwrapBlock(type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list')
                    .wrapBlock(type)
            } else {
                transform
                    .setBlock('list-item')
                    .wrapBlock(type)
            }
        }

        const newState = transform.apply();
        this.props.onChange(newState)
    };
    renderBlockButton = (type, icon) => {
        const isActive = this.hasBlock(type);
        const onMouseDown = e => this.onClickBlock(e, type);
        return (
        <ToggleButton onMouseDown={onMouseDown}
                      icon={icon} tooltipText={`${type}`}
                      key={type} isActive={isActive}/>
        )
    };
    renderBlockButtons = () => {
        return blockButtons.map(block => this.renderBlockButton(block.type, block.icon))
    };
    onClickLink = (e) => {
        e.preventDefault();
        const {state} = this.props;
        const hasLinks = this.hasLinks();
        // this.linkNode.focus()
        if(!hasLinks) {
            this.setState({type: 'link'})
        }

        if (hasLinks) {
            const newState = state
                .transform()
                .unwrapInline('link')
                .apply();
            this.props.onChange(newState)
        }
    };
    renderLink = () => {
        const hasLinks = this.hasLinks();
        return (
        <ToggleButton onMouseDown={this.onClickLink}
                      icon={`link`} tooltipText="Add link"
                      key={`link`} isActive={hasLinks}/>
        )
    };
    onDone = (newState) => {
        const {state} = this.props;
        if(state.isExpanded){
            this.cancel();
            this.props.onChange(newState);
        }
    };
    cancel = () => {
        this.setState({type: null})
    };
    render() {
        const { type } = this.state;
        const { state } = this.props;
        return (
            <div>
                {this.renderMarksButtons()}
                {this.renderBlockButtons()}
                {this.renderLink()}
                {type === 'link' && <InsertModal title="Add link"
                             type="link"
                             handleOk={this.onDone}
                             handleCancel={() => this.cancel()}
                             state={state}
                             visible={type === 'link'} />}
            </div>
        )
    }

}

export default Toolbar;