import * as React from 'react';
import { withPromise, fromRenderProp } from 'chainable-components';
import axios from 'axios';
import { List, Icon, Row, Col } from 'antd';
import { Route, Link } from 'react-router-dom';
import IconText from '../components/IconText';
import ItemListLayout from '../layout/ItemListLayout';

import withAuth from '../util/AuthContext';
import withLoading from '../util/Loadable';

const withRoute = fromRenderProp(Route);

const Courses = () =>
  withAuth.chain(token =>
    withRoute.chain(route =>
      withPromise(
        () => Promise.all([
          axios.get(`/api/organizations/${route.match.params.orgId}/users`, {
            headers: { Authorization: token }
          }),
          axios.get(`/api/organizations/${route.match.params.orgId}`, {
            headers: { Authorization: token }
          })
        ])
      ).chain(resp =>
        withLoading(resp).map(([users, org]) => [users, org, token, route.match.params.orgId])
      )
    )
  ).render(([users, org, token, orgId]) => (
    <ItemListLayout title={'Users'} add={{ href: `/organizations/${orgId}/users/new`, title: 'New user' }} orgName={org.data.name}>
      <div className='gutter-box' style={{ marginTop: '1rem' }}>
        <List
          itemLayout="vertical"
          dataSource={users.data.users}
          renderItem={user => (
            <List.Item actions={[<Link to={`/organizations/${orgId}/users/${user.id}/edit`}>edit</Link>]}>
              <IconText type='user' text={user.username} />
            </List.Item>
          )} />
      </div>
    </ItemListLayout>
  ));

export default Courses;