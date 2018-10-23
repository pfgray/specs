import { Card, Col, Row } from 'antd';
import { ChainableComponent, fromRenderProp, withState } from 'chainable-components';
import { Formik } from 'formik';
import debounce from 'lodash/debounce';
import * as React from 'react';
import { Route } from 'react-router-dom';
import { getLaunchToken, LaunchForm } from '../resources';
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

const updateToken = debounce((tokenState: any, newFormState: any) => {
  console.log('wuuut', newFormState);
  getLaunchToken(newFormState).then(resp => {
    tokenState.update({
      idToken: resp.idToken,
      dirty: false
    });
  });
}, 500);

const refreshToken = (tokenState: any) => (newFormState: any) => {
  tokenState.update({
    ...tokenState.value,
    dirty: true
  });
  updateToken(tokenState, newFormState);
}

const updateField = (tokenState: any) => (formState: any, field: string) => (e: any) => {
  // set the token state to loading...
  // and when we recieve set it back
  const newFormState = {
    ...formState.value,
    [field]: e.target ? e.target.value : e
  };
  if(field !== 'url') {
    refreshToken(tokenState)(newFormState);
  }
  formState.update(newFormState);
};

export { Entry, MessageTypes };

const DefaultUser = Users[0];
const DefaultContext = Contexts[0];

const AppLaunch = () =>
  ChainableComponent.Do(
    withRoute,
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
    (formState, _) => withLoadablePromise(() => getLaunchToken(formState.value)),
    (initialToken) => withState({ dirty: false, idToken: initialToken.idToken }),
    (tokenState, _, formState, route) => ({route, formState, tokenState})
  ).render(({formState, tokenState}) => (
    <Row className='launch-form' style={{ marginTop: '2rem' }}>
      {/* <pre>{JSON.stringify(formState, null, 2)}</pre> */}
      <Col sm={{ span: 22, offset: 1 }}>
          <Row>
            {/* Launch */}
            <Col sm={{ span: 12 }} style={{ paddingRight: '0.5rem' }}>
              <LaunchToolForm formState={formState} updateField={updateField(tokenState)} messageTypes={MessageTypes} refreshToken={refreshToken(tokenState)}/>
            </Col>
            {/* Resource */}
            <Col sm={{ span: 12 }} style={{ paddingLeft: '0.5rem' }}>
            </Col>
          </Row>

          <Row>
            {/* User */}
            <Col sm={{ span: 12 }} style={{ paddingRight: '0.5rem' }}>
              <LaunchUserForm formState={formState} updateField={updateField(tokenState)}  refreshToken={refreshToken(tokenState)}/>
            </Col>
            {/* Context */}
            <Col sm={{ span: 12 }} style={{ paddingLeft: '0.5rem' }}>
              <LaunchContextForm formState={formState} updateField={updateField(tokenState)} contextTypes={ContextTypes}  refreshToken={refreshToken(tokenState)}/>
            </Col>
          </Row>

          <Row style={{opacity: tokenState.value.dirty ? 0.5 : 1}}>
            <Col sm={{ span: 24 }}>
              <form method="POST" action={formState.value.url}>
                <input type="hidden" value={tokenState.value.idToken} name="id_token" />
                <input type="submit" value="Launch" className='ant-btn ant-btn-primary' disabled={tokenState.value.dirty}></input>
              </form>
              <h4>Id Token</h4>
              <IdToken token={tokenState.value.idToken}/>
            </Col>
          </Row>
          {/* <Entry name="custom" type="textarea" label="custom" type="textarea" /> */}
      </Col>
    </Row>
  ));

export default AppLaunch;