import * as React from 'react';
import { Icon } from 'antd';

export type IconTextProps = {
  type: string,
  text: string
};

const IconText = (props: IconTextProps) => (
  <span>
    <Icon type={props.type} style={{ marginRight: 8 }} />
    {props.text}
  </span>
);

export default IconText;