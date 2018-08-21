import { List } from 'antd';
import { ChainableComponent, fromRenderProp } from 'chainable-components';
import * as React from 'react';
import { Link, Route } from 'react-router-dom';
import IconText from '../components/IconText';
import ItemListLayout from '../layout/ItemListLayout';
import { Activity, getActivities, getCourse, getOrganization } from '../resources';
import withAuth from '../util/AuthContext';
import { withLoadablePromise } from '../util/Loadable';
import BreadcrumbLayout from '../layout/BreadcrumbLayout';

const withRoute = fromRenderProp(Route);

const Courses = () =>
  ChainableComponent.Do(
    withAuth,
    _ => withRoute,
    (route, token) => withLoadablePromise(() => 
      getActivities(route.match.params.orgId, route.match.params.courseId, token)),
    (_, route, token) => withLoadablePromise(() => 
      getOrganization(route.match.params.orgId, token)),
    (_, org, route, token) => withLoadablePromise(() => 
      getCourse(route.match.params.orgId, route.match.params.courseId, token)),
    (course, org, activities, route, token) => ({
      course,
      org,
      activities: activities.activities,
      orgId: route.match.params.orgId,
      courseId: route.match.params.courseId,
      token
    })
  ).render(({activities, orgId, courseId, course, org, token}) => (
    <BreadcrumbLayout breadcrumbs={[org.name, course.name, "Activities"]}>
    <ItemListLayout title={'Activities'} add={{ href: `/organizations/${orgId}/courses/${courseId}/activities/library/new`, title: 'New activity' }} orgName={'Hmm'}>
      <div className='gutter-box'>
        <List
          itemLayout="vertical"
          dataSource={activities}
          renderItem={(activity: Activity) => (
            <List.Item key={activity.name}>
              <List.Item.Meta
                title={<Link to={`/organizations/${orgId}/courses/${courseId}/activities/${activity.id}`}><IconText text={activity.name} type="book" /></Link>}
                description={activity.resourceLinkId}
              />
              <div>
                <Link to={`/organizations/${orgId}/courses/${courseId}/activities/${activity.id}/edit`}>edit</Link>
              </div>
            </List.Item>
          )} />
      </div>
    </ItemListLayout>
    </BreadcrumbLayout>
  ));


  // <pre>{JSON.stringify(activities, null, 2)}</pre>

export default Courses;