import { fromRenderProp, all } from 'chainable-components';
import { Route } from 'react-router-dom';
import withAuth from '../util/AuthContext';
import entityForm, { GenericForm } from '../entityForm/EntityForm';

const withRoute = fromRenderProp(Route);

const OrganizationForm = () =>
  all([
    withAuth,
    withRoute({})
  ]).chain(([token, route]) =>
    entityForm({
      auth: token,
      edit: route.location.pathname.indexOf('edit') !== -1,
      baseUrl: '/api/organizations',
      values: [{
        name: 'name',
        intialValue: '',
        label: 'Name'
      }, {
        name: 'description',
        intialValue: '',
        label: 'Description'
      }, {
        name: 'guid',
        intialValue: '',
        label: 'Label'
      }, {
        name: 'url',
        intialValue: '',
        label: 'Url'
      }, {
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
  ).ap(GenericForm as any); // hmm, typing of formik is tough

export default OrganizationForm;