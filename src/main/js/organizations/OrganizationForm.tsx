import React from 'react';
import { withPromise, fromRenderProp } from 'chainable-components';
import axios from 'axios';
import { List, Icon, Row, Col, Button, Input } from 'antd';
import { Link, Route } from 'react-router-dom';
import withAuth from '../util/AuthContext';
import withLoading from '../util/Loadable';
import entityForm, { GenericForm } from '../entityForm/EntityForm';

const withRoute = fromRenderProp(Route);

const OrganizationForm = () =>
  withAuth
    .chain(token =>
      withRoute({}).chain(route =>
        entityForm({
          auth: token,
          edit: route.location.pathname.indexOf('edit') !== -1,
          baseUrl: '/api/organizations',
          values:  [{
            name: 'name',
            intialValue: '',
            label: 'Name'
          }],
          afterSuccess: () => {
            route.history.push('/');
          },
          id: route.match.params.id,
          ignore: ['id', 'clientId']
        })
      )
    )
    .ap(GenericForm);

export default OrganizationForm;