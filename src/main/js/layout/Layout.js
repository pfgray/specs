import React from 'react';
import { Link } from 'react-router';

import { Layout, Menu, Breadcrumb, Icon} from 'antd';
const { Header, Content, Footer, Sider } = Layout;

const LayoutOut = ({children}) => (
  <Layout style={{minHeight: '100vh'}}>
    <Sider>
      <Menu mode="inline">
        <Menu.Item key="1">Launches</Menu.Item>
        <Menu.Item key="2">Users</Menu.Item>
        <Menu.Item key="3">Courses</Menu.Item>
      </Menu>
    </Sider>

    <Layout>
      <Header style={{background:'#fff', padding:0}}></Header>
      <Content>
        {children}
      </Content>
    </Layout>
  </Layout>
);



export default LayoutOut;
