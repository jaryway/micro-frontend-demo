import React from 'react';
import { Badge } from 'antd';

function Item(props) {
  const { badge, text, userName, time, onClick } = props;
  return (
    <div
      onClick={() => {
        onClick && onClick();
      }}
      style={{ display: 'flex', justifyContent: 'space-between' }}
      className={`content-item ${onClick ? 'need-click' : ''}`}
    >
      <div style={{ whiteSpace: 'pre-wrap' }}>
        {badge && <Badge status={badge || 'default'} />}
        {text}
      </div>
      <div style={{ marginLeft: 16 }}>
        {userName ? (
          <span
            style={{
              display: 'inline-block',
              maxWidth: 80,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              verticalAlign: 'top',
              marginRight: 14,
              textAlign: 'right',
            }}
          >
            {userName}
          </span>
        ) : null}
        {time ? <span style={{ width: 76, textAlign: 'right' }}>{time}</span> : null}
      </div>
    </div>
  );
}

export default Item;
