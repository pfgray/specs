import { Table } from 'antd';
import { ChainableComponent, fromRenderProp } from 'chainable-components';
import * as React from 'react';
import { Route } from 'react-router-dom';
import ItemListLayout from '../layout/ItemListLayout';
import { EnrollmentInfo, getEnrollments, getOrganization, Organization, Course, getCourse } from '../resources';
import withAuth from '../util/AuthContext';
import { withLoadablePromise } from '../util/Loadable';
import BreadcrumbLayout from '../layout/BreadcrumbLayout';

const withRoute = fromRenderProp(Route);

const columns = [{
  title: 'User',
  dataIndex: 'user',
  key: 'user',
  render: row => row.fullName
}, {
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
          getOrganization(route.match.params.orgId, token),
          getCourse(route.match.params.orgId, route.match.params.courseId, token)
        ]) as Promise<[EnrollmentInfo[], Organization, Course]>
      ),
    ([enrollments, org, course], route, token) => ({
      enrollments,
      org,
      token,
      orgId: route.match.params.orgId,
      courseId: route.match.params.courseId,
      course
    })
  ).render(({ enrollments, org, orgId, courseId, course}) => (
    <BreadcrumbLayout breadcrumbs={[org.name, course.name, 'Enrollments']}>
      <ItemListLayout add={{ href: `/organizations/${orgId}/courses/${courseId}/enrollments/new`, title: 'New enrollment' }} orgName={org.name}>
        <Table dataSource={enrollments} columns={columns} />
      </ItemListLayout>
    </BreadcrumbLayout>
  ));

export default Courses;