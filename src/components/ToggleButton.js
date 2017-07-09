import React from 'react';
import { Tooltip } from 'antd';

const ToggleButton = ({onMouseDown,isActive, tooltipText, icon}) => (
    <span className={`button-toggle ${ isActive ? 'brown': ''}`}
          onMouseDown={onMouseDown} data-active={isActive}>
        <Tooltip placement="top" title={tooltipText}>
            <span className="material-icons">{icon}</span>
        </Tooltip>
      </span>
);

export default ToggleButton;