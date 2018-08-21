import { List, Tooltip } from 'antd';
import { fromRenderProp, withPromise } from 'chainable-components';
import * as React from 'react';
import { Link, Route } from 'react-router-dom';
import IconText from '../components/IconText';
import BreadcrumbLayout from '../layout/BreadcrumbLayout';
import ItemListLayout from '../layout/ItemListLayout';
import { CourseInfo, getCourses, getOrganization, Organization } from '../resources';
import withAuth from '../util/AuthContext';
import withLoading from '../util/Loadable';

const withRoute = fromRenderProp(Route);

const Courses = () =>
  withAuth.chain(token =>
    withRoute.chain(route =>
      withPromise(
        () => Promise.all([
          getCourses(route.match.params.orgId, token),
          getOrganization(route.match.params.orgId, token)
        ]) as Promise<[CourseInfo[], Organization]>
      ).chain(coursesReq =>
        withLoading(coursesReq).map(([courses, org]) => ({ courses, org, token, orgId: route.match.params.orgId })
        )
      )
    )).render(({ courses, org, token, orgId }) => (
      <BreadcrumbLayout breadcrumbs={[org.name, "Courses"]}>
        <ItemListLayout add={{ href: `/organizations/${orgId}/courses/new`, title: 'New course' }}>
          <List
            itemLayout="vertical"
            dataSource={courses}
            renderItem={({ course, aggregates }: CourseInfo) => (
              <List.Item
                key={course.name}
                actions={[
                  <Tooltip title={`${aggregates.activityCount} activities`}>
                    <Link to={`/organizations/${orgId}/courses/${course.id}/activities`}><IconText type="book" text={aggregates.activityCount.toString()} /></Link>
                  </Tooltip>,
                  <Tooltip title={`${aggregates.enrollmentCount} enrollments`}>
                    <Link to={`/organizations/${orgId}/courses/${course.id}/enrollments`}><IconText type="user" text={aggregates.enrollmentCount.toString()} /></Link>
                  </Tooltip>
                ]}
              >
                <List.Item.Meta
                  title={(
                    <Link to={`/organizations/${orgId}/courses/${course.id}/activities`}><IconText text={course.name} type="book" /></Link>
                  )}
                  description={course.groupType}
                />
                <div>{course.label}</div>
                <div>
                  <Link to={`/organizations/${orgId}/courses/${course.id}/edit`}>edit</Link>
                </div>
              </List.Item>
            )} />
        </ItemListLayout>
      </BreadcrumbLayout>
    ));

export default Courses;