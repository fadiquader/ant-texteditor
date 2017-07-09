import React from 'react';
import { Tooltip, Button } from 'antd';
const CircleButton = ({title, onClick, type,icon}) => (
    <Tooltip placement="top" title={title}>
        <Button shape="circle"
                onClick={(e) => onClick(e,type)}>
            <i className="material-icons">{icon}</i>
        </Button>
    </Tooltip>
);

export default CircleButton;