import * as React from 'react';
import { withPromise, fromRenderProp } from 'chainable-components';
import axios from 'axios';
import { List, Icon, Row, Col, Button, Input } from 'antd';
import { Route } from 'react-router-dom';
import withAuth from '../util/AuthContext';
import entityForm, { GenericForm } from '../entityForm/EntityForm';

const withRoute = fromRenderProp(Route);


//  given
//  family
//  full
//  contact_email_primary
//  sourcedid
//  image

const OrganizationForm = () =>
  withAuth
    .chain(token =>
      withRoute.chain(route =>
        entityForm({
          auth: token,
          edit: route.location.pathname.indexOf('edit') !== -1,
          baseUrl: `/api/organizations/${route.match.params.orgId}/users`,
          values:  [{
            name: 'username',
            intialValue: '',
            label: 'Username'
          },{
            name: 'givenName',
            intialValue: '',
            label: 'Given Name'
          },{
            name: 'familyName',
            intialValue: '',
            label: 'Family Name'
          },{
            name: 'fullName',
            intialValue: '',
            label: 'Full Name'
          },{
            name: 'contactEmail',
            intialValue: '',
            label: 'Email'
          },{
            name: 'sourcedid',
            intialValue: '',
            label: 'Sourcedid'
          },{
            name: 'image',
            intialValue: '',
            label: 'Image Url'
          }],
          afterSuccess: () => {
            route.history.goBack();
          },
          id: route.match.params.userId,
          ignore: ['id', 'organizationId', 'createdAt']
        })
      )
    )
    .render(GenericForm);

export default OrganizationForm;