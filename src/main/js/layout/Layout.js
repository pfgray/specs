import React from 'react';

import { Layout, Menu, Breadcrumb, Icon } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
import { Link, Route } from 'react-router-dom';

import Organizations from '../organizations/Organizations.tsx';
import OrganizationForm from '../organizations/OrganizationForm.tsx';
import Courses from '../courses/Courses.tsx';
import CoursesForm from '../courses/CoursesForm.tsx';

// #1890ff

const LayoutOut = ({ children }) => (
  <Layout style={{ minHeight: '100vh' }}>
    <Sider collapsible>
      <h1 className='logo' style={{ color: '#fff', padding: '1rem' }}>Specs.</h1>
      <Menu theme="dark" mode="inline" >
        <Menu.Item key="1"><Link to='/'><Icon type={'global'} style={{ marginRight: 8 }} />Organizations</Link></Menu.Item>
        <Menu.Item key="2"><Link to='/launches'><Icon type={'code-o'} style={{ marginRight: 8 }} />Launches</Link></Menu.Item>
        <Menu.Item key="3"><Link to='/users'><Icon type={'user'} style={{ marginRight: 8 }} />Users</Link></Menu.Item>
        <Menu.Item key="4"><Link to='/courses'><Icon type={'book'} style={{ marginRight: 8 }} />Courses</Link></Menu.Item>
      </Menu>
    </Sider>
    <Layout>
      <Content>
        <Route exact path='/' component={Organizations} />
        <Route exact path='/organizations/new' component={OrganizationForm} />
        <Route exact path='/organizations/edit/:id' component={OrganizationForm} />
        <Route path='/launches' component={() => <span>launches</span>} />
        <Route path='/users' component={() => <span>users</span>} />
        <Route exact path='/organizations/:orgId/courses' component={Courses} />
        <Route exact path='/organizations/:orgId/courses/:courseId/edit' component={CoursesForm} />
        <Route exact path='/organizations/:orgId/courses/new' component={CoursesForm} />
        
        {/* <Route path='/users'>users</Route>
      <Route path='/courses'>courses</Route> */}
      </Content>
    </Layout>
  </Layout>
);



export default LayoutOut;
