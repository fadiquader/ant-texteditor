import React, { Component } from 'react';
import { Input, Modal, Upload, Icon, message } from 'antd';
import isImage from 'is-image'
import isUrl from 'is-url';
import { insertImage, insertEmbed, insertLink } from '../utils/insert';

const Dragger = Upload.Dragger;
const props = {
    name: 'file',
    multiple: false,
    showUploadList: true,
};

class InsertModal extends Component {
    state = {
        url: null
    };
    handleOk = () => {
        const { state, type } = this.props;
        const { url } = this.state;
        // if(isUrl(url)) {
            if(type === 'image'){
                const newState = insertImage(state, 'https://scontent.fjrs2-1.fna.fbcdn.net/v/t1.0-9/944182_618777564806664_335519658_n.jpg?oh=f6b8ea7df3ef37b82bb4256ff7aaabef&oe=5A10D22C');
                this.props.handleOk(newState);

            } else if(type === 'embed'){
                const newState = insertEmbed(state, url);
                this.props.handleOk(newState);
            } else if(type === 'link'){
                if(isUrl(url)){
                    const newState = insertLink(state, url);
                    this.props.handleOk(newState);
                }
            }
        // } else{
        //     message.error('Invalid url.')
        // }

    };
    handleCancel = () => {
        this.props.handleCancel();
    };
    onInputChange = (e) => {
      this.setState({url: e.target.value})
    };
    onUploadChange = (info) => {
        const status = info.file.status;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
            console.log(info.file)
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    renderModalContent = () => {
        const { type } = this.props;
        const placeholder = (type) =>{
            switch(type){
                case 'embed':
                    return 'Copy share link, from youtube, dailymotion, vimeo, twitter'
                    break;
                default:
                    return 'Insert URL';
            }
        };
        const input = <div>
            <Input placeholder={placeholder(type)} onChange={this.onInputChange}/>
        </div>;
        if(type === 'image') {
            const { uploadApi } = this.props;
            return (
                <div>
                    {input}
                    <br/>
                    <div style={{textAlign:'center'}}>
                        <strong>OR</strong>
                    </div>
                    <br/>
                    <Dragger {...props} action={uploadApi} onCange={this.onUploadChange}>
                        <p className="ant-upload-drag-icon">
                            <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
                    </Dragger>
                </div>
            )
        } else {
            return input
        }
    };
    render() {
        const { title } = this.props;
        return (
            <Modal
                title={title}
                visible={this.props.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                okText="Ok"
                cancelText="Cancel">
                {this.renderModalContent()}
            </Modal>
        )
    }
}

export default InsertModal;