import qs from 'query-string';
import React, { Component } from 'react';
import { Tweet } from 'react-twitter-widgets';
class EmbedNode extends Component {

    static urlMap = new Map([
        ['youtube', 'http://www.youtube.com/embed/'],
        ['vimeo', 'http://player.vimeo.com/video/'],
        ['dailymotion', 'http://www.dailymotion.com/embed/video/']
    ]);

    getIdFromVideoString (vString) {
        const urlArr = vString.split('/');
        const idString = urlArr[urlArr.length - 1];
        const queryParams = qs.extract(vString);

        return (queryParams && qs.parse(queryParams).v) || idString || '';
    }

    isSelected = () => {
        const { node, state } = this.props;
        const isSelected = state.selection.hasEdgeIn(node);
        return isSelected
    }


    renderVideo = () => {
        const url = this.props.node.data.get('url');
        const provider = url.split(/^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/)[1]
            .split('.')[0];
        if(EmbedNode.urlMap.get(provider)){
            const src = `${EmbedNode.urlMap.get(provider)}${this.getIdFromVideoString(url)}`;
            const isSelected = this.isSelected();
            // console.log(EmbedNode.urlMap.get('provider', provider))
            return (
                <div style={{
                    maxWidth: '600px',
                    margin: '20px auto'
                }}>
                    <div  className="embed-responsive embed-responsive-16by9" >
                        <iframe
                            id="ytplayer"
                            type="text/html"
                            src={src}
                            frameBorder="0"
                            className="embed-responsive-item"
                        />
                    </div>
                </div>
            )
        } else if(provider === 'twitter') {
            const tweetId = url.split('status/')[1];
            if(tweetId){
                return (
                    <Tweet tweetId={tweetId} />
                )
            }
        } else {
            return (
                <h2><span style={{color: '#e74c3c'}}>X</span> Sorry, can not embed this url.</h2>
            )
        }

    };
    render(){
        return (
            <div {...this.props.attributes}>
                {this.renderVideo()}
            </div>
        )
    }
}

export default EmbedNode;