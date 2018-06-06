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
import { Users, Contexts } from './entities';
import LaunchUserForm from './launch/LaunchUserForm';
import LaunchToolForm from './launch/LaunchToolForm';
import LaunchContextForm from './launch/LaunchContextForm';
import LaunchResourceForm from './launch/LaunchResourceForm';
import IdToken from './IdToken';
import debounce from 'lodash/debounce';

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
            <input id={attr} name={attr} className="ant-input" value={formState.data[attr]} onChange={updateField(formState, attr)} />
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
    ...tokenState.data,
    dirty: true
  });
  updateToken(tokenState, newFormState, token);
}

const updateField = (tokenState: any, token: string) => (formState: any, field: string) => (e: any) => {
  // set the token state to loading...
  // and when we recieve set it back
  const newFormState = {
    ...formState.data,
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

const AppLaunch = () =>
  withAuth.chain(token =>
    withRoute({}).chain(route =>
      withState({
        initial: {
          messageType: MessageTypes[0],
          url: 'https://specs.paulgray.net/tool',
          deploymentId: '',
          ...DefaultUser,
          middle_name: "",
          ...DefaultContext,
          resource_link_id: '',
          resource_link_title: '',
          resource_link_description: ''
        }
      }).chain(formState =>
        withLoadablePromise(() => getLaunchToken(token, formState.data)).chain(initialToken => 
          withState({ initial: { dirty: false, idToken: initialToken.idToken } }).map(tokenState => [route, token, formState, tokenState])
        )
      )
    )
  ).ap(([route, token, formState, tokenState]) => (
    <Row className='launch-form' style={{ marginTop: '2rem' }}>
      {/* <pre>{JSON.stringify(formState, null, 2)}</pre> */}
      <Col sm={{ span: 22, offset: 1 }}>
        <form onSubmit={() => alert('yo')}>
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

          <Row style={{opacity: tokenState.data.dirty? '0.5' : '1'}}>
            <Col sm={{ span: 24 }}>
              <form method="POST" action={formState.data.url}>
                <input type="hidden" value={'hmm'} name="id_token" />
                <input type="submit" value="Launch" className='ant-btn ant-btn-primary' disabled={tokenState.data.dirty}></input>
              </form>
              <h4>Id Token</h4>
              <Card className='generated-id-token'>
                <a href={`https://jwt.io/#id_token=${tokenState.data.idToken}`} target="_blank"><img src="http://jwt.io/img/badge.svg" /></a>
                <IdToken token={tokenState.data.idToken}/>
              </Card>
            </Col>
          </Row>
          {/* <Entry name="custom" type="textarea" label="custom" type="textarea" /> */}
        </form>

      </Col>
    </Row>
  ));

export default AppLaunch;