import { fromRenderProp } from 'chainable-components';
import { Route } from 'react-router-dom';
import entityForm, { GenericForm } from '../entityForm/EntityForm';
import withAuth from '../util/AuthContext';

const withRoute = fromRenderProp(Route);

const ActivityForm = () =>
  withAuth
    .chain(token =>
      withRoute.chain(route =>
        entityForm({
          auth: token,
          edit: route.location.pathname.indexOf('edit') !== -1,
          baseUrl: `/api/organizations/${route.match.params.orgId}/courses/${route.match.params.courseId}/activities`,
          values: [{
            name: 'name',
            intialValue: '',
            label: 'Name'
          },{
            name: 'url',
            intialValue: '',
            label: 'Url'
          },{
            name: 'resourceLinkId',
            intialValue: '',
            label: 'Resource Link Id'
          },{
            name: 'oauthKey',
            intialValue: '',
            label: 'Oauth Key'
          },{
            name: 'oauthSecret',
            intialValue: '',
            label: 'Oauth Secret'
          },{
            name: 'signatureMechanism',
            intialValue: 'HMAC-SHA256',
            label: 'Signature Mechanism'
          }],
          afterSuccess: () => {
            route.history.goBack();
          },
          id: route.match.params.activityId,
          ignore: ['id', 'courseId', 'graded', 'createdAt']
        })
      )
    )
    .render(GenericForm as any);

export default ActivityForm;