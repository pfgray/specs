import { Card, Col, Row } from 'antd';
import { fromRenderProp, ChainableComponent } from 'chainable-components';
import * as React from 'react';
import { Route } from 'react-router-dom';
import AppLogo from '../apps/AppLogo';
import { getApps, getOrganization, getCourse, Organization, Course, AppList } from '../resources';
import withAuth from '../util/AuthContext';
import { withLoadablePromise } from '../util/Loadable';
import './app-picker.less';
import BreadcrumbLayout from '../layout/BreadcrumbLayout';

const withRoute = fromRenderProp(Route);

const ActivityFromApp = () =>
  ChainableComponent.Do(
    withAuth,
    () => withRoute,
    (route, token) => withLoadablePromise(() => Promise.all([
      getApps(token),
      getOrganization(route.match.params.orgId, token),
      getCourse(route.match.params.orgId, route.match.params.courseId, token)
    ]) as Promise<[AppList, Organization, Course]>),
    ([apps, org, course], route, token) => ({apps: apps.apps, org, course, token})
  ).render(({apps, org, course, token}) =>
      <BreadcrumbLayout breadcrumbs={[org.name, course.name, 'Add Activity']}>
        <Row>
          <Col span={20} offset={2} className='app-picker'>
            {apps.map(app => (
              <Card key={app.id} title={app.name} style={{ width: 300 }}>
                <AppLogo app={app} />
                <p>Card content</p>
              </Card>
            ))}
          </Col>
        </Row>
      </BreadcrumbLayout>
    );

export default ActivityFromApp;