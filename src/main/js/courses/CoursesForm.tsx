import { fromRenderProp } from 'chainable-components';
import { Route } from 'react-router-dom';
import entityForm, { GenericForm } from '../entityForm/EntityForm';
import withAuth from '../util/AuthContext';

const withRoute = fromRenderProp(Route);

const CoursesForm = () =>
  withAuth
    .chain(token =>
      withRoute.chain(route =>
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
    .render(GenericForm);

export default CoursesForm;