import * as React from 'react';
import { withPromise, fromRenderProp } from 'chainable-components';
import * as axios from 'axios';
import { List, Icon, Row, Col } from 'antd';
import { Route, Link } from 'react-router-dom';

import withAuth from '../util/AuthContext';
import withLoading from '../util/Loadable';

const withRoute = fromRenderProp(Route);

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

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
    <Row gutter={16}>
      <div className='gutter-box' style={{ marginTop: '2rem' }}>
        <Link className='ant-btn ant-btn-primary' to={`/organizations/${orgId}/courses/new`}>
          <i className="anticon anticon-plus"></i>
          <span>New course</span>
        </Link>
      </div>
      <Col className='gutter-row' span={14} offset={5}>
        <div className='gutter-box'>
          <h1>{org.data.name}</h1>
          <h4>Courses</h4>
          <List
            itemLayout="vertical"
            dataSource={courses.data.courses}
            renderItem={course => (
              <List.Item actions={[<Link to={`/organizations/${orgId}/courses/${course.id}/edit`}>edit</Link>]}>
                {course.name}
              </List.Item>
            )} />
        </div>
      </Col>
    </Row>
  ));

export default Courses;