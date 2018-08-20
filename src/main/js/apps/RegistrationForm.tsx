import * as React from 'react';
import { withPromise, fromRenderProp, withState } from 'chainable-components';
import axios from 'axios';
import { Card, Row, Col } from 'antd';
import { Route } from 'react-router-dom';
import withAuth from '../util/AuthContext';
import entityForm, { GenericForm } from '../entityForm/EntityForm';

const withRoute = fromRenderProp(Route);

const RegistrationForm = () =>
  withAuth
    .chain(token =>
      withRoute.chain(route =>
        withState({ submitted: false }).chain(state =>
          entityForm({
            auth: token,
            edit: false,
            baseUrl: `/api/apps`,
            values: [{
              name: 'name',
              intialValue: '',
              label: 'Name'
            }, {
              name: 'logo',
              intialValue: '',
              label: 'Logo'
            }],
            afterSuccess: resp => {
              // render a modal?
              console.log('got: ', resp);
              state.update({
                submitted: true,
                app: resp.data
              });
              // route.history.goBack();
            },
            id: route.match.params.activityId,
            ignore: ['id', 'courseId', 'graded', 'createdAt']
          }).map(entityFormProps => ([state, entityFormProps]))
        )
      )
    )
    .render(([state, entityFormProps]) => {
      if (state.value.submitted) {
        return (
          <Row>
            <Col sm={{ span: 8, offset: 8 }} xs={{ span: 22, offset: 1 }}>
              <h4>Public Key</h4>
              <Card>
                <div style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{state.data.app.publicKey}</div>
              </Card>
              <h4>Private Key</h4>
              <Card>
                <div style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{state.data.app.privateKey}</div>
              </Card>
            </Col>
          </Row>
        );
      } else {
        return GenericForm(entityFormProps);
      }
    });

export default RegistrationForm;