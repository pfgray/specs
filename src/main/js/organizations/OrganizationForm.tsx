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
          },{
            name: 'description',
            intialValue: '',
            label: 'Description'
          },{
            name: 'guid',
            intialValue: '',
            label: 'Label'
          },{
            name: 'url',
            intialValue: '',
            label: 'Url'
          },{
            name: 'contactEmail',
            intialValue: '',
            label: 'Contact Email'
          }],
          afterSuccess: () => {
            route.history.push('/');
          },
          id: route.match.params.id,
          ignore: ['id', 'clientId', 'createdAt']
        })
      )
    )
    .ap(GenericForm);

export default OrganizationForm;