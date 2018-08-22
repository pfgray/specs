import { Card, List, Icon, Modal } from 'antd';
import { ChainableComponent, fromRenderProp, withState } from 'chainable-components';
import * as React from 'react';
import { Link, Route, RouteComponentProps } from 'react-router-dom';
import ItemListLayout from '../layout/ItemListLayout';
import { App, getApps, deleteApp, Id } from '../resources';
import withAuth from '../util/AuthContext';
import { withLoadablePromise } from '../util/Loadable';
import AppLogo from './AppLogo';
import BreadcrumbLayout from '../layout/BreadcrumbLayout';

const withRoute = fromRenderProp(Route);

function removeApp(appId: Id, token: string, route: RouteComponentProps<any, any>) {
  deleteApp(appId as number, token).then(() => {
    window.location.reload();
  });
}

const Apps = () =>
  ChainableComponent.Do(
    withAuth,
    () => withRoute,
    (_, token) => withLoadablePromise(() => getApps(token)),
    () => withState({ deleting: false, app: null } as { deleting: false, app: null } | { deleting: true, app: App }),
    (deleting, apps, route, token) => ({
      apps: apps.apps,
      route,
      token,
      deleting
    })
  ).render(({ apps, token, deleting, route }) => (
    <BreadcrumbLayout breadcrumbs={['Specs', 'Apps']}>
      <Modal
        title={'Delete App'}
        visible={deleting.value.deleting}
        onOk={_ => removeApp((deleting.value.app as any).id , token, route)}
        onCancel={_ => deleting.update({deleting: false, app: null})}
      >
        <p>Are you sure you want to delete {deleting.value.deleting === true ? deleting.value.app.name : ''}?</p>
      </Modal>
      <ItemListLayout add={{ href: `/apps/register`, title: 'Add App' }} orgName={'Apps'}>
        <List
          itemLayout="vertical"
          dataSource={apps}
          renderItem={(app: App) => (
            <Card style={{ marginBottom: '1rem' }}>
              <AppLogo app={app} /><h3>{app.name}</h3>
              <Link to={`/apps/${app.id}/manage`}>manage</Link>
              <Icon type="delete" style={{ fontSize: 16, color: '#ff4d4f', marginLeft: '1rem' }} onClick={() => deleting.update({deleting: true, app})} />
            </Card>
          )} />
      </ItemListLayout>
    </BreadcrumbLayout>
  ));

export default Apps;