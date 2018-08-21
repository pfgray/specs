import { Col, Row } from 'antd';
import * as React from 'react';
import { Link } from 'react-router-dom';

type ItemListLayoutProps = {
  add: {
    title: string,
    href: string
  },
  orgName?: string
  children: React.ReactNode
}

const ItemListLayout = (props: ItemListLayoutProps) => (
  <Row gutter={16}>
    <Col className='gutter-row' span={18} offset={0} style={{borderRight: '1px solid #ddd'}}>
      {props.children}
    </Col>
    <Col className='gutter-row' span={6}>
      <Link className='ant-btn ant-btn-primary ant-btn-block' style={{width: '100%'}} to={props.add.href}>
        <i className="anticon anticon-plus"></i>
        <span>{props.add.title}</span>
      </Link>
    </Col>
  </Row>
);

export default ItemListLayout;