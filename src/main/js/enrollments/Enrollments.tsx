import * as React from 'react';
import { withPromise, fromRenderProp } from 'chainable-components';
import * as axios from 'axios';
import { List, Icon, Row, Col, Table } from 'antd';
import { Route, Link } from 'react-router-dom';
import ItemListLayout from '../layout/ItemListLayout';
import IconText from '../components/IconText';

import withAuth from '../util/AuthContext';
import withLoading from '../util/Loadable';

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
  withAuth.chain(token =>
    withRoute({}).chain(route =>
      withPromise({
        get: () => Promise.all([
          axios.get(`/api/organizations/${route.match.params.orgId}/courses/${route.match.params.courseId}/enrollments`, {
            headers: { Authorization: token }
          }),
          axios.get(`/api/organizations/${route.match.params.orgId}`, {
            headers: { Authorization: token }
          })
        ])
      }).chain(coursesReq =>
        withLoading(coursesReq).map(([enrollments, org]) => [enrollments.data, org, token, route.match.params.orgId, route.match.params.courseId])
      )
    )
  ).ap(([enrollments, org, token, orgId, courseId]) => (
    <ItemListLayout title={'Enrollments'} add={{ href: `/organizations/${orgId}/courses/${courseId}/enrollments/new`, title: 'New enrollment' }} orgName={org.data.name}>
      <Table dataSource={enrollments} columns={columns} />
    </ItemListLayout>
  ));

export default Courses;