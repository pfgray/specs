import * as React from 'react';
import { Layout, Menu, Icon } from 'antd';
const { Content, Sider } = Layout;
import { Link, Route, RouteComponentProps } from 'react-router-dom';
import { fromRenderProp } from 'chainable-components';

import Courses from '../courses/Courses';
import CoursesForm from '../courses/CoursesForm';
import Users from '../users/Users';
import UsersForm from '../users/UsersForm';

import Enrollments from '../enrollments/Enrollments';
import EnrollmentForm from '../enrollments/EnrollmentForm';
import withAuth from '../util/AuthContext';

import { getOrganization, Organization } from '../resources';
import { withLoadablePromise } from '../util/Loadable';

const isSelected = (routeLike: string, route: RouteComponentProps<{}>) => {
  console.log('isSelected:', route.location.pathname)
  console.log('isMstching?', !!route.match.url.match(routeLike));
  return route.match.url.match(routeLike) ? "ant-menu-item-selected": "";
}


const withRoute = fromRenderProp(Route);

const OrganizationLayout = () =>
  withAuth.chain(token =>
    withRoute({}).chain(route =>
      withLoadablePromise(() => getOrganization(route.match.params.orgId, token)).map(org => [org, route])
    )
  ).ap(([org, route]) => (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible style={{ background: '#fff' }}>
        <h1 className='logo' style={{ padding: '1rem' }}>{org.name}</h1>
        <Menu theme="light" mode="inline" >
          <Menu.Item key="1" className={isSelected(`/organizations/${org.id}/courses*`, route)}>
            <Link to={`/organizations/${org.id}/courses`}><Icon type={'book'} style={{ marginRight: 8 }}/>Courses</Link>
          </Menu.Item>
          <Menu.Item key="2" className={isSelected(`/organizations/${org.id}/users*`, route)}>
            <Link to={`/organizations/${org.id}/users`}><Icon type={'user'} style={{ marginRight: 8 }} />Users</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Content>
          <Route exact path='/organizations/:orgId/courses' component={Courses} />
          <Route exact path='/organizations/:orgId/courses/:courseId/edit' component={CoursesForm} />
          <Route exact path='/organizations/:orgId/courses/new' component={CoursesForm} />

          <Route exact path='/organizations/:orgId/users' component={Users} />
          <Route exact path='/organizations/:orgId/users/:userId/edit' component={UsersForm} />
          <Route exact path='/organizations/:orgId/users/new' component={UsersForm} />

          <Route exact path='/organizations/:orgId/courses/:courseId/enrollments' component={Enrollments} />
          <Route exact path='/organizations/:orgId/courses/:courseId/enrollments/new' component={EnrollmentForm} />
        </Content>
      </Layout>
    </Layout>
  ));

export default OrganizationLayout;