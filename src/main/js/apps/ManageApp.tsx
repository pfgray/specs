import { Button, Col, Input, Row, Select } from 'antd';
import { ChainableComponent, fromRenderProp, withState } from 'chainable-components';
import { WithStateContext } from 'chainable-components/lib/lib/withState';
import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';
import { App, getApp, Placement } from '../resources';
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

function isAdd(route: RouteComponentProps<any>) {
  return route.location.pathname.indexOf('register') !== -1;
}

const ManageApp = () =>
  ChainableComponent.Do(
    withAuth,
    () => withRoute,
    (route, token) => {
      if(isAdd(route)) {
        return ChainableComponent.of([true, {
          name: '',
          description: '',
          placements: {placements: []}
        }] as [boolean, App]);
      } else {
        return withLoadablePromise(() => getApp(token, route.match.params.appId)).map(initialApp => [false, initialApp] as [boolean, App]);
      }
    },
    ([,initialApp]) => withState(initialApp),
    (app, [isAdd,], initialApp) => ({app, initialApp, isAdd})
  ).render(({initialApp, app}) => {
    const updateField = updateFieldCreator(app);
    return (
      <Row style={{ marginTop: '2rem' }}>
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
          <div style={{marginTop: '1rem'}}>
            <Button type="primary" loading={false} onClick={() => alert('yo!')}>Save</Button>
          </div>
        </Col>
      </Row>
    );
  });

export default ManageApp;

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
        ...placements.slice(i+1, placements.length),
      ]
    }
  })
}

type PlacementEditorProps = { app: WithStateContext<App>, i: number, p: Placement};
const PlacementEditor = (props: PlacementEditorProps) => {
  return (
    <div className='placement'>
      <Input name='name' value={props.p.name} placeholder='Label' style={{ marginBottom: '0.5rem' }} onChange={updatePlacement(props.app, props.i)('name')} />
      <Input name='url' value={props.p.url} placeholder='Launch url' style={{ marginBottom: '0.5rem' }} onChange={updatePlacement(props.app, props.i)('url')} />
      {/* <Input name='customParameters' value={props.p.customParameters} style={{ marginBottom: '0.5rem' }} onChange={updatePlacement(props.app, props.i)('customParameters')} /> */}
      <Select
        defaultValue={"CourseTool"}
        onChange={value => updatePlacementValue(props.app, props.i)('launchType')(value as string)} 
        style={{width: '150px'}}>
        <Select.Option value={"CourseTool"}>Course Tool</Select.Option>
        <Select.Option value={"ContentSelection"}>Content Selection</Select.Option>
        <Select.Option value={"Gradebook"}>Gradebook</Select.Option>
      </Select>
    </div>
  );
}