import React from 'react';

import { Layout, Menu, Breadcrumb, Icon} from 'antd';
const { Header, Content, Footer, Sider } = Layout;
import { Link, Route } from 'react-router-dom';

import Organizations from '../organizations/Organizations';

// #1890ff

const LayoutOut = ({children}) => (
  <Layout style={{minHeight: '100vh'}}>
    <Sider collapsible>
      <h1 className='logo' style={{color: '#fff',padding: '1rem'}}>Specs.</h1>
      <Menu theme="dark" mode="inline" >
        <Menu.Item key="1"><Link to='/'>Organizations</Link></Menu.Item>
        <Menu.Item key="1"><Link to='/launches'>Launches</Link></Menu.Item>
        <Menu.Item key="2"><Link to='/users'>Users</Link></Menu.Item>
        <Menu.Item key="3"><Link to='/courses'>Courses</Link></Menu.Item>
      </Menu>
    </Sider>
    <Route exact path='/' component={Organizations} />
    <Route path='/launches' component={() => <span>launches</span>} />
    <Route path='/users' component={() => <span>users</span>} />
    <Route path='/courses' component={() => <span>courses</span>} />
      {/* <Route path='/users'>users</Route>
      <Route path='/courses'>courses</Route> */}
  </Layout>
);



export default LayoutOut;
