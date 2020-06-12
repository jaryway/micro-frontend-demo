import React from 'react';
import { Divider } from 'antd';

function Footer(props) {
  const { text } = props;
  return (
    <div>
      <Divider style={{ margin: '16px 0' }} />
      <span>{text}</span>
    </div>
  );
}

export default Footer;
