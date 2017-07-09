import React, { Component } from 'react';
import { Resizable, ResizableBox } from 'react-resizable';


const Cover = ({ children, style }) => (
    <div style={{ backgroundColor: 'black', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 3 }}>{children}</div>
);

class Resize extends Component{
    state = {
        resize: false,
        width: null,
        height: null,
    };

    onResizeStart = () => {
        console.log('start resize')
        this.setState({ resize: true, });
    };
    onResizeStop = (event, { deltaX, deltaY }) => {
        console.log('start stop')

        const width = this.state.width + deltaX;
        const height = this.state.height + deltaY;
        this.setState({ resize: false, width: width, height: height });
    }
    onResize = (event, { size }) => {
        // console.log('on resize', size)
    }
    render(){
        const { w, h } = this.props.imgDimensions;
        return (
            <ResizableBox width={w} height={h}
                          lockAspectRatio={true}
                          onResizeStart={this.onResizeStart}
                          onResizeStop={this.onResizeStop}
                          onResize={this.onResize}
                          minConstraints={[w*0.3, h*0.3]}
                          maxConstraints={[w, h]}>
                {this.props.children}
            </ResizableBox>
        )
    }
}

export default Resize;