import { Card, Col, Row } from 'antd';
import { ChainableComponent, fromRenderProp, withState } from 'chainable-components';
import { Formik } from 'formik';
import debounce from 'lodash/debounce';
import * as React from 'react';
import { Route } from 'react-router-dom';
import { getLaunchToken } from '../resources';
import withAuth from '../util/AuthContext';
import { withLoadablePromise } from '../util/Loadable';
import { Contexts, Users } from './entities';
import IdToken from './IdToken';
import LaunchContextForm from './launch/LaunchContextForm';
import LaunchToolForm from './launch/LaunchToolForm';
import LaunchUserForm from './launch/LaunchUserForm';

const withRoute = fromRenderProp(Route);
const chainableFormik = fromRenderProp(Formik);

const MessageTypes = ['basic-lti-launch-message'];
const ContextTypes = ['CourseSection', 'CourseTemplate', 'CourseOffering', 'Group'];

const Entry = ({attr, formState, updateField}) => (
  <div className="ant-row">
    <div className="ant-form-item">
      <Col sm={{ span: 8 }} className="ant-form-item-label">
        <label htmlFor={attr}>
          {attr}
        </label>
      </Col>
      <Col sm={{ span: 16 }} className='ant-form-item-control-wrapper'>
        <div className='ant-form-item-control'>
          <span className='ant-form-item-children'>
            <input id={attr} name={attr} className="ant-input" value={formState.value[attr]} onChange={updateField(formState, attr)} />
          </span>
        </div>
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

const updateToken = debounce((tokenState: any, newFormState: any, token: string) => {
  getLaunchToken(token, newFormState).then(resp => {
    tokenState.update({
      idToken: resp.idToken,
      dirty: false
    });
  });
}, 500);

const refreshToken = (tokenState: any, token: string) => (newFormState: any) => {
  tokenState.update({
    ...tokenState.value,
    dirty: true
  });
  updateToken(tokenState, newFormState, token);
}

const updateField = (tokenState: any, token: string) => (formState: any, field: string) => (e: any) => {
  // set the token state to loading...
  // and when we recieve set it back
  const newFormState = {
    ...formState.value,
    [field]: e.target ? e.target.value : e
  };
  if(field !== 'url') {
      refreshToken(tokenState, token)(newFormState);
  }
  formState.update(newFormState);
};

export { Entry, MessageTypes };

const DefaultUser = Users[0];
const DefaultContext = Contexts[0];

type LaunchForm = {
  messageType: string,
  url: string,
  deploymentId: string,
  full_name: string,
  given_name: string,
  family_name: string,
  guid: string,
  email: string,
  roles: string,
  picture: string
  middle_name: "",
  label: string,
  context_id: string,
  context_label: string,
  context_title: string,
  context_type:  string[],
  resource_link_title: string,
  resource_link_description: string, 
  resource_link_id: string,
}
const AppLaunch = () =>
  ChainableComponent.Do(
    withAuth,
    () => withRoute,
    () => withState<LaunchForm>({
      messageType: MessageTypes[0],
      url: 'http://localhost:9001/launch.php',
      deploymentId: '',
      ...DefaultUser,
      middle_name: "",
      ...DefaultContext,
      resource_link_id: '',
      resource_link_title: '',
      resource_link_description: ''
    }),
    (formState, _, token) => withLoadablePromise(() => getLaunchToken(token, formState.value)),
    (initialToken) => withState({ dirty: false, idToken: initialToken.idToken }),
    (tokenState, _, formState, route, token) => ({route, token, formState, tokenState})
  ).render(({token, formState, tokenState}) => (
    <Row className='launch-form' style={{ marginTop: '2rem' }}>
      {/* <pre>{JSON.stringify(formState, null, 2)}</pre> */}
      <Col sm={{ span: 22, offset: 1 }}>
          <Row>
            {/* Launch */}
            <Col sm={{ span: 12 }} style={{ paddingRight: '0.5rem' }}>
              <LaunchToolForm formState={formState} updateField={updateField(tokenState, token)} messageTypes={MessageTypes} refreshToken={refreshToken(tokenState, token)}/>
            </Col>
            {/* Resource */}
            <Col sm={{ span: 12 }} style={{ paddingLeft: '0.5rem' }}>
            </Col>
          </Row>

          <Row>
            {/* User */}
            <Col sm={{ span: 12 }} style={{ paddingRight: '0.5rem' }}>
              <LaunchUserForm formState={formState} updateField={updateField(tokenState, token)}  refreshToken={refreshToken(tokenState, token)}/>
            </Col>
            {/* Context */}
            <Col sm={{ span: 12 }} style={{ paddingLeft: '0.5rem' }}>
              <LaunchContextForm formState={formState} updateField={updateField(tokenState, token)} contextTypes={ContextTypes}  refreshToken={refreshToken(tokenState, token)}/>
            </Col>
          </Row>

          <Row style={{opacity: tokenState.value.dirty ? 0.5 : 1}}>
            <Col sm={{ span: 24 }}>
              <form method="POST" action={formState.value.url}>
                <input type="hidden" value={tokenState.value.idToken} name="id_token" />
                <input type="submit" value="Launch" className='ant-btn ant-btn-primary' disabled={tokenState.value.dirty}></input>
              </form>
              <h4>Id Token</h4>
              <Card className='generated-id-token'>
                <a href={`https://jwt.io/#id_token=${tokenState.value.idToken}`} target="_blank"><img src="http://jwt.io/img/badge.svg" /></a>
                <IdToken token={tokenState.value.idToken}/>
              </Card>
            </Col>
          </Row>
          {/* <Entry name="custom" type="textarea" label="custom" type="textarea" /> */}

      </Col>
    </Row>
  ));

export default AppLaunch;