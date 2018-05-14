import * as React from 'react';
import { withPromise, fromRenderProp } from 'chainable-components';
import axios from 'axios';
import { Row, Col, Button, Input } from 'antd';
import { Route } from 'react-router-dom';
import withAuth from '../util/AuthContext';
import entityForm, { GenericForm } from '../entityForm/EntityForm';

const withRoute = fromRenderProp(Route);

const CoursesForm = () =>
  withAuth
    .chain(token =>
      withRoute({}).chain(route =>
        entityForm({
          auth: token,
          edit: route.location.pathname.indexOf('edit') !== -1,
          baseUrl: `/api/organizations/${route.match.params.orgId}/courses`,
          values: [{
            name: 'name',
            intialValue: '',
            label: 'Name'
          },{
            name: 'groupType',
            intialValue: '',
            label: 'Type'
          },{
            name: 'label',
            intialValue: '',
            label: 'Label'
          }],
          afterSuccess: () => {
            route.history.goBack();
          },
          id: route.match.params.courseId,
          ignore: ['id', 'organizationId']
        })
      )
    )
    .ap(GenericForm);

export default CoursesForm;