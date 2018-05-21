import * as React from 'react';
import { withPromise, fromRenderProp } from 'chainable-components';
import axios from 'axios';
import { Row, Col, Button, Input } from 'antd';
import { Route } from 'react-router-dom';
import withAuth from '../util/AuthContext';
import entityForm, { GenericForm } from '../entityForm/EntityForm';

const withRoute = fromRenderProp(Route);

const RegistrationForm = () =>
  withAuth
    .chain(token =>
      withRoute({}).chain(route =>
        entityForm({
          auth: token,
          edit: false,
          baseUrl: `/api/apps`,
          values: [{
            name: 'name',
            intialValue: '',
            label: 'Name'
          },{
            name: 'logo',
            intialValue: '',
            label: 'Logo'
          }],
          afterSuccess: () => {
            route.history.goBack();
          },
          id: route.match.params.activityId,
          ignore: ['id', 'courseId', 'graded', 'createdAt']
        })
      )
    )
    .ap(GenericForm);

export default RegistrationForm;