import * as React from 'react';
import { withPromise, fromRenderProp, withState, ChainableComponent } from 'chainable-components';
import axios from 'axios';
import { Select, Row, Col, Button } from 'antd';
const Option = Select.Option;
import { Route, RouteComponentProps } from 'react-router-dom';
import withAuth from '../util/AuthContext';
import withLoading, { withLoadablePromise } from '../util/Loadable';
import entityForm, { GenericForm } from '../entityForm/EntityForm';
import { getUsersNotInCourse, Id } from '../resources';
import { isInteger } from 'formik';
import { User } from '../apps/entities';

const withRoute = fromRenderProp(Route);

const handleChange = (a, b, c) => {
  console.log('handling change: ', a, b, c);
}

const submit = (users: User[], role: string, setSubmitting: any, orgId: Id, courseId: Id, token: string, route: RouteComponentProps<{}>) => (e: any) => {
  e.preventDefault();
  console.log('submitting: ', e.target);
  setSubmitting(true);
  axios.put(`/api/organizations/${orgId}/courses/${courseId}/enrollments`, {
    userIds: users,
    role
  }, {
    headers: { Authorization: token }
  }).then(resp => {
    console.log('got resp: ', resp);
    route.history.push(`/organizations/${orgId}/courses/${courseId}/enrollments`);
  });
}

const withInit = withAuth
    .chain(token =>
      withRoute.chain(route =>
        withLoadablePromise(() => getUsersNotInCourse(route.match.params.orgId, route.match.params.courseId, token)).map(
          users => ({
            users,
            token,
            route,
            orgId: route.match.params.orgId,
            courseId: route.match.params.courseId,
          })
        )
      )
    );


const withEnrollmentState =
  withState(false).chain(submitting =>
    withState([]).chain(users =>
      withState('student').map(role => ({submitting, users, role}))
    )
  )

// <form onSubmit={submit(enrollmentState.value.users, enrollmentState.value.role, enrollmentState.update, orgId, courseId, token, route)} style={{ marginTop: '3rem' }} disabled={enrollmentState.value.submitting}>

const EnrollmentForm = () =>
  ChainableComponent.Do(
    withInit,
    _ => withEnrollmentState,
    (enrollments, init) => ({enrollments, ...init})
  ).render(({users, token, orgId, courseId, enrollments, route}) => (
    <form onSubmit={submit(enrollments.users.value, enrollments.role.value, enrollments.submitting.update, orgId, courseId, token, route)} style={{ marginTop: '3rem' }} disabled={enrollments.submitting.value}>
      <Row gutter={16}>
        <Col className='gutter-row' span={8} offset={4} style={{ marginTop: '4rem' }}>
          <h2>Add Users</h2>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className='gutter-row' span={8} offset={4}>
          <Select
            showSearch
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Users"
            defaultValue={[]}
            onChange={enrollments.users.update as any}
            filterOption={(input, option) => { console.log(option); return option.props.searchTerm.toLowerCase().indexOf(input.toLowerCase()) >= 0 }}
          >
            {users.map((u: User) => <Option key={u.id} searchTerm={`${u.fullName} - ${u.username}`} value={u.id}>{u.fullName} - {u.username}</Option>)}
          </Select>
        </Col>

        <Col className='gutter-row' span={4}>
          <Select defaultValue="student" style={{ width: '100%' }} onChange={enrollments.role.update as any}>
            <Option value="student">Student</Option>
            <Option value="instructor">Instructor</Option>
          </Select>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className='gutter-row' span={4} offset={4} style={{ marginTop: '1rem' }}>
          <Button type="primary" htmlType="submit">Submit</Button>
        </Col>
      </Row>
    </form>
  ));

export default EnrollmentForm;