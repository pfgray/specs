import React from 'react';

import { Layout, Menu, Icon } from 'antd';
const { Content, Sider } = Layout;
import { Link, Route } from 'react-router-dom';
import Organizations from '../organizations/Organizations.tsx';
import OrganizationForm from '../organizations/OrganizationForm.tsx';


const SpecsLayout = (() => (
  <Layout style={{ minHeight: '100vh' }}>
    <Sider collapsible>
      <h1 className='logo' style={{ color: '#fff', padding: '1rem' }}>Specs.</h1>
      <Menu theme="dark" mode="inline" >
        <Menu.Item key="1"><Link to='/'><Icon type={'global'} style={{ marginRight: 8 }} />Organizations</Link></Menu.Item>
        <Menu.Item key="2"><Link to='/apps'><Icon type={'appstore'} style={{ marginRight: 8 }} />Apps</Link></Menu.Item>
      </Menu>
    </Sider>
    <Layout>
      <Content>
        <Route exact path='/' component={Organizations} />
        <Route exact path='/organizations/new' component={OrganizationForm} />
        <Route exact path='/organizations/edit/:id' component={OrganizationForm} />
      </Content>
    </Layout>
  </Layout>
));

export default SpecsLayout;
