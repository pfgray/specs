import * as React from 'react';
import { withPromise, fromRenderProp } from 'chainable-components';
import * as axios from 'axios';
import { List, Icon, Row, Col } from 'antd';
import { Route, Link } from 'react-router-dom';
import ItemListLayout from '../layout/ItemListLayout';
import IconText from '../components/IconText';

import withAuth from '../util/AuthContext';
import withLoading from '../util/Loadable';
import { getActivities, Activity } from '../resources';
import { withLoadablePromise } from '../util/Loadable';

const withRoute = fromRenderProp(Route);

const Courses = () =>
  
  withAuth.chain(token =>
    withRoute({}).chain(route =>
      withLoadablePromise(() => getActivities(route.match.params.orgId, route.match.params.courseId, token))
        .map(activities => [activities.activities, route, route.match.params.orgId, route.match.params.courseId, token])
    )
  ).ap(([activities, route, orgId, courseId, token]) => (
    <ItemListLayout title={'Activities'} add={{ href: `/organizations/${orgId}/courses/${courseId}/activities/new`, title: 'New activity' }} orgName={'Hmm'}>
      <div className='gutter-box'>
        <List
          itemLayout="vertical"
          dataSource={activities}
          renderItem={(activity) => (
            <List.Item key={activity.name}>
              <List.Item.Meta
                title={<Link to={`/organizations/${orgId}/courses/${courseId}/activities`}><IconText text={activity.name} type="book" /></Link>}
                description={activity.resourceLinkId}
              />
              <div>
                <Link to={`/organizations/${orgId}/courses/${courseId}/activities/${activity.id}/edit`}>edit</Link>
              </div>
            </List.Item>
          )} />
      </div>
    </ItemListLayout>
  ));


  // <pre>{JSON.stringify(activities, null, 2)}</pre>

export default Courses;