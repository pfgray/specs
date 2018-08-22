import { Card, Col, Row, Button, Icon } from 'antd';
import { fromRenderProp, ChainableComponent } from 'chainable-components';
import * as React from 'react';
import { Route } from 'react-router-dom';
import AppLogo from '../apps/AppLogo';
import { getApps, getOrganization, getCourse, Organization, Course, AppList, App } from '../resources';
import withAuth from '../util/AuthContext';
import { withLoadablePromise } from '../util/Loadable';
import './app-picker.less';
import BreadcrumbLayout from '../layout/BreadcrumbLayout';
import * as ramda from 'ramda';

const withRoute = fromRenderProp(Route);

function appTitle(app: App) {
  return (
    <Row style={{ alignItems: 'center', display: 'flex' }}>
      <Col span={16} offset={0}>{app.name}</Col>
      <Col span={8} offset={0}><Button style={{ width: '100%' }} type="primary">+ Add</Button></Col>
    </Row>
  );
}

function renderedApps(apps: App[]) {
  return apps.map(app => (
      <Card key={app.id} title={appTitle(app)} style={{ height: '225px' }}>
        <AppLogo app={app} />
        {app.description ? <p style={{ marginTop: '1rem' }}>{app.description}</p> : null}
      </Card>
  ));
}

function renderManual() {
  return (
      <div className='manual-app-add'>
        <Icon type="plus" />
        <p>Add Manual</p>
      </div>
  );
}

const ActivityFromApp = () =>
  ChainableComponent.Do(
    withAuth,
    () => withRoute,
    (route, token) => withLoadablePromise(() => Promise.all([
      getApps(token),
      getOrganization(route.match.params.orgId, token),
      getCourse(route.match.params.orgId, route.match.params.courseId, token)
    ]) as Promise<[AppList, Organization, Course]>),
    ([apps, org, course], route, token) => ({ apps: apps.apps, org, course, token })
  ).render(({ apps, org, course, token }) =>
    <BreadcrumbLayout breadcrumbs={[org.name, course.name, 'Add Activity']}>
      {ramda.splitEvery(3, [renderManual(), ...renderedApps(apps)]).map((subApps, i) => (
        <Row key={i} style={{marginBottom: '2rem'}}>
          {subApps.map((sa, i) => (
            <Col span={7} offset={i > 0 ? 1 : 0}>
              {sa}
            </Col>
          ))}
        </Row>
      ))}
    </BreadcrumbLayout>
  );

export default ActivityFromApp;