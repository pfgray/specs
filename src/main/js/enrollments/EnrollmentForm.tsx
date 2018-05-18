import * as React from 'react';
import { withPromise, fromRenderProp, withState } from 'chainable-components';
import axios from 'axios';
import { Select, Row, Col, Button } from 'antd';
const Option = Select.Option;
import { Route, RouteComponentProps } from 'react-router-dom';
import withAuth from '../util/AuthContext';
import withLoading from '../util/Loadable';
import entityForm, { GenericForm } from '../entityForm/EntityForm';

const withRoute = fromRenderProp(Route);

const handleChange = (a, b, c) => {
  console.log('handling change: ', a, b, c);
}

const submit = (users, role, setSubmitting, orgId, courseId, token, route: RouteComponentProps<{}>) => (e, t) => {
  e.preventDefault();
  console.log('submitting: ', e.target, t);
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

const withInit =
  withAuth
    .chain(token =>
      withRoute({}).chain(route =>
        withPromise({
          get: () => axios.get(`/api/organizations/${route.match.params.orgId}/courses/${route.match.params.courseId}/usersNotInCourse`, {
            headers: { Authorization: token }
          })
        }).chain(usersReq =>
          withLoading(usersReq).map(users => [users.data, token, route.match.params.orgId, route.match.params.courseId, route])
        )
      )
    );

const withEnrollmentState =
  withState({initial:false}).chain(submitting =>
    withState({initial:[]}).chain(users =>
      withState({initial:'student'}).map(role => [submitting, users, role])
    )
  )

const EnrollmentForm = () =>
  withInit.chain(([users, token, orgId, courseId, route]) =>
    withEnrollmentState.map(([submitting, chosenUsers, chosenRole]) =>
      [users, token, orgId, courseId, submitting, chosenUsers, chosenRole, route])
  ).ap(([users, token, orgId, courseId, submitting, chosenUsers, chosenRole, route]) => (
    <form onSubmit={submit(chosenUsers.data, chosenRole.data, submitting.update, orgId, courseId, token, route)} style={{ marginTop: '3rem' }} disabled={submitting.data}>
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
            onChange={chosenUsers.update}
            name="student"
            filterOption={(input, option) => { console.log(option); return option.props.searchTerm.toLowerCase().indexOf(input.toLowerCase()) >= 0 }}
          >
            {users.map(u => <Option key={u.id} searchTerm={`${u.fullName} - ${u.username}`} value={u.id}>{u.fullName} - {u.username}</Option>)}
          </Select>
        </Col>

        <Col className='gutter-row' span={4}>
          <Select defaultValue="student" style={{ width: '100%' }} onChange={chosenRole.update} name="role">
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