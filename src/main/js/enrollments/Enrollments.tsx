import * as React from 'react';
import { withPromise, fromRenderProp, ChainableComponent } from 'chainable-components';
import * as axios from 'axios';
import { List, Icon, Row, Col, Table } from 'antd';
import { Route, Link } from 'react-router-dom';
import ItemListLayout from '../layout/ItemListLayout';
import IconText from '../components/IconText';

import withAuth from '../util/AuthContext';
import withLoading, { withLoadablePromise } from '../util/Loadable';
import { getEnrollments, getOrganization, Enrollment, EnrollmentInfo, Organization } from '../resources';
import IdToken from '../apps/IdToken';

const withRoute = fromRenderProp(Route);

const columns = [{
  title: 'User',
  dataIndex: 'user',
  key: 'user',
  render: row => row.fullName
},{
  title: 'Role',
  dataIndex: 'enrollment',
  key: 'role',
  render: row => row.role
}]

const Courses = () =>
  ChainableComponent.Do(
    withAuth,
    () => withRoute,
    (route, token) => 
      withLoadablePromise(() => 
      Promise.all([
        getEnrollments(route.match.params.orgId, route.match.params.courseId, token),
        getOrganization(route.match.params.orgId, token)
      ]) as Promise<[EnrollmentInfo[], Organization]>
    ),
    ([enrollments, org], route, token) => ({
      enrollments,
      org,
      token, 
      orgId: route.match.params.orgId,
      courseId: route.match.params.courseId
    })
  ).render(({enrollments, org, orgId, courseId}) => (
    <ItemListLayout title={'Enrollments'} add={{ href: `/organizations/${orgId}/courses/${courseId}/enrollments/new`, title: 'New enrollment' }} orgName={org.name}>
      <Table dataSource={enrollments} columns={columns} />
    </ItemListLayout>
  ));

export default Courses;