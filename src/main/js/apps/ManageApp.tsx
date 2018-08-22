import { Button, Col, Input, Row, Select, Icon, Modal } from 'antd';
import { ChainableComponent, fromRenderProp, withState } from 'chainable-components';
import { WithStateContext } from 'chainable-components/lib/lib/withState';
import * as React from 'react';
import { Route, RouteComponentProps, RouteProps } from 'react-router-dom';
import { App, getApp, Placement, createApp, updateApp } from '../resources';
import withAuth from '../util/AuthContext';
import { withLoadablePromise } from '../util/Loadable';
import AppLogo from './AppLogo';
import './manage-app.less';


const withRoute = fromRenderProp(Route);

const updateFieldCreator = (state: WithStateContext<App>) => (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
  return state.update({
    ...state.value,
    [field]: e.target.value
  });
}

const newPlacement = (state: WithStateContext<App>) => () => {
  state.update({
    ...state.value,
    placements: {
      placements: state.value.placements.placements.concat([{
        launchType: "CourseTool",
        url: "",
        name: "",
        customParameters: {}
      }])
    }
  });
}

type ReviewState = { reviewing: false, app: null } | { reviewing: true, app: App };

function isAdd(route: RouteComponentProps<any>) {
  return route.location.pathname.indexOf('register') !== -1;
}

function submitApp(appId: null | string, reviewing: WithStateContext<ReviewState>, submitting: WithStateContext<boolean>, route: RouteComponentProps<any, any>, app: App, token: string): Promise<any> {
  submitting.update(true);
  delete app.publicKey;
  const promise = appId ? updateApp(appId, app, token) : createApp(app, token);
  promise.then((resp) => {
    if (!appId) {
      console.log('got: ', resp);
      // this is a new app, so let's review it
      Modal.info({
        title: 'Security Credentials',
        content: (
          <div>
            <p>These are the credentials you'll use to access <i>Specs.</i> Apis</p>
            <p>Make sure to copy them now. You won't be able to see the private key again.</p>

            <h4>Public Key:</h4>
            <pre className='public-key'>{resp.publicKey}</pre>
            <h4>Private Key:</h4>
            <pre className='private-key'>{resp.privateKey}</pre>
          </div>
        ),
        style: {width: '50rem'},
        onOk() { route.history.goBack() },
      });
      // reviewing.update({ reviewing: true, app: resp });
    } else {
      route.history.goBack();
    }
  });
}

const ManageApp = () =>
  ChainableComponent.Do(
    withAuth,
    () => withRoute,
    (route, token) => {
      if (isAdd(route)) {
        return ChainableComponent.of([null, {
          name: '',
          description: '',
          placements: { placements: [] }
        }] as [null | string, App]);
      } else {
        return withLoadablePromise(() => getApp(token, route.match.params.appId)).map(initialApp => [route.match.params.appId, initialApp] as [null | string, App]);
      }
    },
    ([, initialApp]) => withState(initialApp),
    () => withState(false),
    () => withState({ reviewing: false, app: null } as ReviewState),
    (reviewing, submitting, app, [appId,], route, token) => ({ app, appId, submitting, route, token, reviewing })
  ).render(({ route, app, appId, submitting, token, reviewing }) => {
    const updateField = updateFieldCreator(app);
    return (
      <Row style={{ marginTop: '2rem' }}>
        <Modal
          title={'Security Credentials'}
          visible={reviewing.value.reviewing}
          onOk={_ => route.history.goBack()}>
          {reviewing.value.reviewing ? (
            <div>
              <h4>Public Key:</h4>
              <pre className='public-key'>{reviewing.value.app.publicKey}</pre>
              <h4>Private Key:</h4>
              <pre className='private-key'>{reviewing.value.app.privateKey}</pre>
            </div>
          ) : null}
        </Modal>
        <Col sm={{ span: 16, offset: 4 }} xs={{ span: 22, offset: 1 }}>
          <div className='app-metadata'>
            <AppLogo app={app.value} style={{ height: '72px', width: '72px' }} />
            <div className='metadata-form'>
              <Input name='name' placeholder='name' value={app.value.name} style={{ marginBottom: '0.5rem' }} onChange={updateField('name')} />
              <Input name='description' placeholder='description' value={app.value.description} onChange={updateField('description')} />
            </div>
          </div>
          <h4>Placements</h4>
          <Button onClick={newPlacement(app)}>+ New placement</Button>
          {/* <pre>{JSON.stringify(app.value.placements, null, 2)}</pre> */}
          {app.value.placements.placements.map((p, i) => (
            <PlacementEditor p={p} app={app} i={i} />
          ))}
          <div style={{ marginTop: '1rem' }}>
            <Button type="primary" loading={submitting.value} onClick={() => submitApp(appId, reviewing, submitting, route, app.value, token)}>Save</Button>
          </div>
        </Col>
      </Row>
    );
  });

export default ManageApp;

const removePlacement = (state: WithStateContext<App>, i: number) => {
  const newPlacements = [
    ...state.value.placements.placements.slice(0, i),
    ...state.value.placements.placements.slice(i + 1, state.value.placements.placements.length)
  ];
  state.update({
    ...state.value,
    placements: { placements: newPlacements }
  });
};

const updatePlacement = (state: WithStateContext<App>, i: number) => (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
  updatePlacementValue(state, i)(field)(e.target.value);
};
const updatePlacementValue = (state: WithStateContext<App>, i: number) => (field: string) => (value: string) => {
  const placements = state.value.placements.placements;
  state.update({
    ...state.value,
    placements: {
      placements: [
        ...placements.slice(0, i),
        {
          ...placements[i],
          [field]: value
        },
        ...placements.slice(i + 1, placements.length),
      ]
    }
  })
}

type PlacementEditorProps = { app: WithStateContext<App>, i: number, p: Placement };
const PlacementEditor = (props: PlacementEditorProps) => {
  return (
    <div className='placement'>
      <Select
        defaultValue={"CourseTool"}
        onChange={value => updatePlacementValue(props.app, props.i)('launchType')(value as string)}
        style={{ width: '150px', marginBottom: '0.5rem' }}>
        <Select.Option value={"CourseTool"}>Course Tool</Select.Option>
        <Select.Option value={"ContentSelection"}>Content Selection</Select.Option>
        <Select.Option value={"Gradebook"}>Gradebook</Select.Option>
      </Select>
      <Icon type="delete" style={{ fontSize: 16, color: '#ff4d4f', marginLeft: '1rem' }} onClick={() => removePlacement(props.app, props.i)} />
      <Input name='name' value={props.p.name} placeholder='Label' style={{ marginBottom: '0.5rem' }} onChange={updatePlacement(props.app, props.i)('name')} />
      <Input name='url' value={props.p.url} placeholder='Launch url' style={{ marginBottom: '0.5rem' }} onChange={updatePlacement(props.app, props.i)('url')} />
      {/* <Input name='customParameters' value={props.p.customParameters} style={{ marginBottom: '0.5rem' }} onChange={updatePlacement(props.app, props.i)('customParameters')} /> */}
    </div>
  );
}