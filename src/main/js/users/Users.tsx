import * as React from 'react';
import { withPromise, fromRenderProp } from 'chainable-components';
import axios from 'axios';
import { List, Icon, Row, Col } from 'antd';
import { Route, Link } from 'react-router-dom';
import IconText from '../components/IconText';
import ItemListLayout from '../layout/ItemListLayout';

import withAuth from '../util/AuthContext';
import withLoading from '../util/Loadable';
import { getOrganization, getUsers, Organization, User } from '../resources';
import BreadcrumbLayout from '../layout/BreadcrumbLayout';

const withRoute = fromRenderProp(Route);

const Courses = () =>
  withAuth.chain(token =>
    withRoute.chain(route =>
      withPromise(
        () => Promise.all([
          getUsers(route.match.params.orgId, token),
          getOrganization(route.match.params.orgId, token)
        ]) as Promise<[User[], Organization]>
      ).chain(resp =>
        withLoading(resp).map(([users, org]) => ({users, org, token, orgId: route.match.params.orgId}))
      )
    )
  ).render(({users, org, orgId}) => (
    <BreadcrumbLayout breadcrumbs={[org.name, "Users"]}>
      <ItemListLayout add={{ href: `/organizations/${orgId}/users/new`, title: 'New user' }} orgName={org.name}>
        <div className='gutter-box' style={{ marginTop: '1rem' }}>
          <List
            itemLayout="vertical"
            dataSource={users}
            renderItem={user => (
              <List.Item style={{margin: 0}}>
                <IconText type='user' text={user.username} /> <Link to={`/organizations/${orgId}/users/${user.id}/edit`}>edit</Link>
              </List.Item>
            )} />
        </div>
      </ItemListLayout>
    </BreadcrumbLayout>
  ));

export default Courses;