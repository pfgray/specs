import { Button, Select, Row, Col, Layout, Breadcrumb } from 'antd';
import { ChainableComponent, fromRenderProp, withState } from 'chainable-components';
import * as React from 'react';
import { Route } from 'react-router-dom';
import { Activity, EnrollmentInfo, getActivity, getEnrollments, LaunchForm, User, getCourse, CourseInfo, Course, getLaunchToken, getOrganization, Organization } from '../resources';
import withAuth from '../util/AuthContext';
import { withLoadablePromise } from '../util/Loadable';
import { MessageTypes } from '../apps/AppLaunch';
import { User as FormUser, Context as FormContext } from '../apps/entities';
import { WithStateContext } from 'chainable-components/lib/lib/withState';
import IdToken from '../apps/IdToken';
import BreadcrumbLayout from '../layout/BreadcrumbLayout';

function userToFormUser(e: EnrollmentInfo): FormUser {
  return {
    full_name: e.user.fullName,
    given_name: e.user.givenName,
    family_name: e.user.familyName,
    guid: e.user.sourcedid,
    email: e.user.contactEmail,
    roles: e.enrollment.role,
    picture: e.user.image
  };
}

function courseToFormContext(c: Course, a: Activity): FormContext {
  return {
    label: c.label,
    context_id: c.id.toString(),
    context_label: c.label,
    context_title: c.name,
    context_type: [c.groupType],
    resource_link_id: a.resourceLinkId,
    resource_link_title: a.name,
    resource_link_description: ""
  };
}

const withRoute = fromRenderProp(Route);

// how to generate an IdToken ???

type IdTokenState = WithStateContext<{ dirty: boolean, idToken: string }>;
type FormState = WithStateContext<LaunchForm>;

function tokenChainable(course: Course, activity: Activity, user: EnrollmentInfo, token: string): ChainableComponent<{ idTokenState: IdTokenState, formState: FormState }> {
  return ChainableComponent.Do(
    withState<LaunchForm>({
      messageType: MessageTypes[0],
      url: activity.url,
      deploymentId: '',
      ...userToFormUser(user),
      middle_name: "",
      ...courseToFormContext(course, activity)
    }),
    (formState) => withLoadablePromise(() => getLaunchToken(token, formState.value)),
    (initialToken) => withState({ dirty: false, idToken: initialToken.idToken }),
    (idTokenState, _, formState) => ({ idTokenState, formState })
  );
}

const Courses = () =>
  ChainableComponent.Do(
    withAuth,
    _ => withRoute,
    (route, token) => withLoadablePromise(() =>
      Promise.all([
        getEnrollments(route.match.params.orgId, route.match.params.courseId, token),
        getActivity(route.match.params.orgId, route.match.params.courseId, route.match.params.activityId, token),
        getCourse(route.match.params.orgId, route.match.params.courseId, token),
        getOrganization(route.match.params.orgId, token)
      ]) as Promise<[EnrollmentInfo[], Activity, Course, Organization]>
    ),
    ([enrollments]) => withState({ userId: enrollments[0].user.id }),
    (user, [enrollments, activity, course], route, token) =>
      tokenChainable(course, activity, enrollments[0], token),
    (tokenState, user, [enrollments, activity, course, org], route, token) => ({
      tokenState,
      enrollments,
      activity,
      orgId: route.match.params.orgId,
      courseId: route.match.params.courseId,
      token,
      course,
      org,
      user
    })
  ).render(({ enrollments, activity, orgId, courseId, token, course, org, user, tokenState }) => (
    <BreadcrumbLayout breadcrumbs={[org.name, course.name, activity.name]}>
      <h1>
        {activity.name}
      </h1>
      <div>
        <span>Launching as:</span>
        <Select defaultValue={enrollments[0].user.id} onChange={e => user.update(e.user.id)}>
          {enrollments.map(e => (
            <Select.Option value={e.user.id} key={e.user.id}>
              {e.user.fullName}
            </Select.Option>
          ))}
        </Select>
      </div>
      <Row style={{ opacity: tokenState.idTokenState.value.dirty ? 0.5 : 1 }}>
        <Col sm={{ span: 24 }}>
          <form method="POST" action={tokenState.formState.value.url}>
            <input type="hidden" value={tokenState.idTokenState.value.idToken} name="id_token" />
            <input type="submit" value="Launch" className='ant-btn ant-btn-primary' disabled={tokenState.idTokenState.value.dirty}></input>
          </form>
          <h4>Id Token</h4>
          <IdToken token={tokenState.idTokenState.value.idToken} />
        </Col>
      </Row>
    </BreadcrumbLayout>
  ));


// <pre>{JSON.stringify(activities, null, 2)}</pre>

export default Courses;