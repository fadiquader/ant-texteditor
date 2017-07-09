import React, { Component } from 'react';

class CodeNode extends Component {

    render(){
        const { node } = this.props;
        return (
            <pre className={node.data.get('className')} {...this.props.attributes} >
                <code >{this.props.children}</code>
            </pre>
        )
    }
}

export default CodeNode;