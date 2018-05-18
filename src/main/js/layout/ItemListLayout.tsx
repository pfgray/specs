import * as React from 'react';
import { withPromise, fromRenderProp } from 'chainable-components';
import * as axios from 'axios';
import { List, Icon, Row, Col } from 'antd';
import { Route, Link } from 'react-router-dom';

type ItemListLayoutProps = {
  title: string,
  add: {
    title: string,
    href: string
  },
  orgName: string
  children: React.ReactNode
}

const ItemListLayout = (props: ItemListLayoutProps) => (
  <Row gutter={16}>
    <Col className='gutter-row' span={14} offset={5} style={{ marginTop: '2rem' }}>
      <h1>{props.orgName}</h1>
      <Row gutter={16}>
        <Col className='gutter-row' span={4} >
          <h4>{props.title}</h4>
        </Col>
        <Col className='gutter-row' span={8} offset={12} >
          <Link className='ant-btn ant-btn-primary' to={props.add.href}>
            <i className="anticon anticon-plus"></i>
            <span>{props.add.title}</span>
          </Link>
        </Col>
      </Row>
    </Col>
    <Col className='gutter-row' style={{marginTop: '2rem'}} span={14} offset={5}>
      {props.children}
    </Col>
  </Row>
);

export default ItemListLayout;