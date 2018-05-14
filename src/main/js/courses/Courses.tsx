import * as React from 'react';
import { withPromise, fromRenderProp } from 'chainable-components';
import * as axios from 'axios';
import { List, Icon, Row, Col } from 'antd';
import { Route, Link } from 'react-router-dom';
import ItemListLayout from '../layout/ItemListLayout';

import withAuth from '../util/AuthContext';
import withLoading from '../util/Loadable';

const withRoute = fromRenderProp(Route);

const Courses = () =>
  withAuth.chain(token =>
    withRoute({}).chain(route =>
      withPromise({
        get: () => Promise.all([
          axios.get(`/api/organizations/${route.match.params.orgId}/courses`, {
            headers: { Authorization: token }
          }),
          axios.get(`/api/organizations/${route.match.params.orgId}`, {
            headers: { Authorization: token }
          })
        ])
      }).chain(coursesReq =>
        withLoading(coursesReq).map(([courses, org]) => [courses, org, token, route.match.params.orgId])
      )
    )
  ).ap(([courses, org, token, orgId]) => (
    <ItemListLayout title={'Courses'} add={{ href: `/organizations/${orgId}/courses/new`, title: 'New course' }} orgName={org.data.name}>
      <div className='gutter-box'>
        <List
          itemLayout="vertical"
          dataSource={courses.data.courses}
          renderItem={course => (
            <List.Item actions={[<Link to={`/organizations/${orgId}/courses/${course.id}/edit`}>edit</Link>]}>
              {course.name}
            </List.Item>
          )} />
      </div>
    </ItemListLayout>
  ));

export default Courses;