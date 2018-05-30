import * as React from 'react';
import { withPromise, withState, fromRenderProp } from 'chainable-components';
import * as axios from 'axios';
import { List, Icon, Row, Col, Button, Card, Select } from 'antd';
import { Route, Link } from 'react-router-dom';
import ItemListLayout from '../layout/ItemListLayout';
import IconText from '../components/IconText';
import withAuth from '../util/AuthContext';
import withLoading from '../util/Loadable';
import { getApp, getLaunchToken, App } from '../resources';
import { withLoadablePromise } from '../util/Loadable';
import { Formik, FormikValues, Form, Field } from 'formik';
import { Users } from './entities';
import LaunchUserForm from './launch/LaunchUserForm';
import LaunchToolForm from './launch/LaunchToolForm';
import LaunchContextForm from './launch/LaunchContextForm';
import LaunchResourceForm from './launch/LaunchResourceForm';

const withRoute = fromRenderProp(Route);
const chainableFormik = fromRenderProp(Formik);

const MessageTypes = ['basic-lti-launch-message'];
const ContextTypes = ['CourseSection', 'CourseTemplate', 'CourseOffering', 'Group'];

const Entry = ({ attr, formState }) => (
  <div className="ant-row">
    <div className="ant-form-item">
      <Col sm={{ span: 8 }} className="ant-form-item-label">
        <label htmlFor={attr}>
          {attr}
        </label>
      </Col>
      <Col sm={{ span: 16 }}>
        <input id={attr} name={attr} className="ant-input" value={formState.data[attr]} onChange={updateField(formState, attr)} />
      </Col>
    </div>
  </div>
);

const updateLaunch = (change, dispatch) => newLaunch => {
  changeAll(change, newLaunch);
}

const changeAll = (change, obj) => {
  Object.keys(obj).forEach(function (key) {
    change(key, obj[key]);
  });
}

// const updateContext = change => e => {
//   const newContext = contexts.find(u => u.name === e.target.value);
//   changeAll(change, newContext);
// }

const updateField = (formState: any, field: string) => (e: any) => {
  formState.update({
    ...formState.data,
    [field]: e.target.value
  });
};

export { Entry, MessageTypes, updateField };


const DefaultUser = Users[0];

const AppLaunch = () =>
  withAuth.chain(token =>
    withRoute({}).chain(route =>
      withState({
        initial: {
          messageType: MessageTypes[0],
          url: 'https://specs.paulgray.net/tool',
          deploymentId: '',
          given_name: DefaultUser.given_name,
          family_name: DefaultUser.family_name,
          middle_name: "",
          picture: DefaultUser.picture,
          email: DefaultUser.email,
          full_name: DefaultUser.label,
          roles: DefaultUser.roles,
          context_type: [ContextTypes[0]],
          resource_link_id: '',
          resource_link_title: '',
          resource_link_description: ''
        }
      }).map(formState => [route, token, formState])
    )
  ).ap(([route, token, formState]) => (
    <Row className='launch-form' style={{ marginTop: '2rem' }}>
      {/* <pre>{JSON.stringify(formState, null, 2)}</pre> */}
      <Col sm={{ span: 22, offset: 1 }}>
        <form onSubmit={() => alert('yo')}>
          <Row>
            {/* Launch */}
            <Col sm={{ span: 12 }} style={{ paddingRight: '0.5rem' }}>
              <LaunchToolForm formState={formState} updateField={updateField} messageTypes={MessageTypes} />
            </Col>
            {/* Resource */}
            <Col sm={{ span: 12 }} style={{ paddingLeft: '0.5rem' }}>
              <LaunchResourceForm formState={formState} updateField={updateField} />
            </Col>
          </Row>

          <Row>
            {/* User */}
            <Col sm={{ span: 12 }} style={{ paddingRight: '0.5rem' }}>
              <LaunchUserForm formState={formState} updateField={updateField} />
            </Col>
            {/* Context */}
            <Col sm={{ span: 12 }} style={{ paddingLeft: '0.5rem' }}>
              <LaunchContextForm formState={formState} updateField={updateField} contextTypes={ContextTypes} />
              <h4>Generated Id Token</h4>
              {/* <Card style={{ width: '50%' }}>
                <pre style={{ marginBottom: '0' }}>{launchToken.idToken}</pre>
              </Card> */}
              <form method="POST" action={formState.data.url}>
                <input type="hidden" value={'hmm'} name="id_token" />
                <input type="submit" value="Launch" className='ant-btn ant-btn-primary'></input>
              </form>
            </Col>
          </Row>

          {/* <Entry name="custom" type="textarea" label="custom" type="textarea" /> */}
        </form>

      </Col>
    </Row>
  ));

export default AppLaunch;