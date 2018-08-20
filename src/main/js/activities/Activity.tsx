import { ChainableComponent, fromRenderProp } from 'chainable-components';
import * as React from 'react';
import { Route } from 'react-router-dom';
import { Activity, EnrollmentInfo, getActivity, getEnrollments } from '../resources';
import withAuth from '../util/AuthContext';
import { withLoadablePromise } from '../util/Loadable';

const withRoute = fromRenderProp(Route);

const Courses = () =>
  ChainableComponent.Do(
    withAuth,
    _ => withRoute,
    (route, token) => withLoadablePromise(() =>
      Promise.all([
        getEnrollments(route.match.params.orgId, route.match.params.courseId, token),
        getActivity(route.match.params.orgId, route.match.params.courseId, route.match.params.activityId, token)
      ]) as Promise<[EnrollmentInfo[], Activity]>
    ),
    ([enrollments, activity], route, token) => ({
      enrollments,
      activity,
      orgId: route.match.params.orgId,
      courseId: route.match.params.courseId,
      token
    })
  ).render(({ enrollments, activity, orgId, courseId, token }) => (
    <div className='gutter-box'>
      <h1>
        {activity.name}
      </h1>
      Launching as: 
      <pre>
        {JSON.stringify(activity, null, 2)}
      </pre>
      <pre>
        {JSON.stringify(enrollments, null, 2)}
      </pre>
    </div>
  ));


// <pre>{JSON.stringify(activities, null, 2)}</pre>

export default Courses;